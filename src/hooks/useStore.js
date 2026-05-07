import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sale-watcher-v1';
function load() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
function persist(data) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {} }

export function useStore() {
  const saved = load();
  const [watchlist, setWatchlist] = useState(saved?.watchlist || []);
  const [settings, setSettings] = useState(saved?.settings || { apiKey: '', email: '', alertAnyDrop: true, emailOn: true });
  const [log, setLog] = useState(saved?.log || []);
  const [checking, setChecking] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => { persist({ watchlist, settings, log: log.slice(0, 200) }); }, [watchlist, settings, log]);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const addLog = useCallback((msg, type = 'info') => {
    setLog(prev => [{ time: new Date().toISOString(), msg, type }, ...prev].slice(0, 200));
  }, []);

  const addItem = useCallback((item) => {
    const newItem = { id: Date.now(), ...item, status: 'watching', added: new Date().toISOString(), lastChecked: null, currentPrice: item.originalPrice || null, imageUrl: null };
    setWatchlist(prev => [newItem, ...prev]);
    addLog(`Added "${item.name}" to watchlist`, 'add');
    showToast(`"${item.name}" added! Run a check to fetch its image.`);
    return newItem;
  }, [addLog, showToast]);

  const removeItem = useCallback((id) => {
    setWatchlist(prev => {
      const item = prev.find(i => i.id === id);
      if (item) addLog(`Removed "${item.name}"`, 'remove');
      return prev.filter(i => i.id !== id);
    });
  }, [addLog]);

  const editItem = useCallback((updatedItem) => {
    setWatchlist(prev => prev.map(i => i.id === updatedItem.id ? { ...i, ...updatedItem } : i));
    addLog(`Edited "${updatedItem.name}"`, 'info');
    showToast(`"${updatedItem.name}" updated`);
  }, [addLog, showToast]);

  const updateSettings = useCallback((updates) => { setSettings(prev => ({ ...prev, ...updates })); }, []);

  const checkItem = useCallback(async (id) => {
    const item = watchlist.find(i => i.id === id);
    if (!item || !settings.apiKey) return;
    setChecking(prev => ({ ...prev, [id]: true }));
    try {
      const prompt = `You are a price-checking assistant. Search for this product page and return ONLY a raw JSON object — no markdown, no backticks, no extra text.

Required JSON fields:
- name: string (product name)
- currentPrice: number or null (current selling price, digits only)
- originalPrice: number or null (crossed-out/was price if shown)
- onSale: boolean (true if price is visibly reduced)
- inStock: boolean
- sizeAvailable: boolean or null (${item.size ? `check if size "${item.size}" is available` : 'null'})
- imageUrl: string or null (direct URL to the main product image — must be a full https:// URL ending in .jpg .jpeg .png .webp or similar. Try to find the highest quality image shown on the page. Return null if not found.)
- currency: string

URL: ${item.url}`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': settings.apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 512,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
      const match = text.match(/\{[\s\S]*?\}/);
      if (!match) throw new Error('No data returned');

      const result = JSON.parse(match[0]);
      const prevPrice = item.currentPrice;
      const currPrice = result.currentPrice;
      const targetPrice = parseFloat(item.targetPrice) || null;
      const priceDropped = prevPrice && currPrice && currPrice < prevPrice;
      const belowTarget = targetPrice && currPrice && currPrice <= targetPrice;
      const onSale = result.onSale || priceDropped || belowTarget;
      const sizeOk = !item.size || result.sizeAvailable !== false;
      const newStatus = onSale && sizeOk ? 'onsale' : 'watching';

      setWatchlist(prev => prev.map(i => i.id === id ? {
        ...i,
        name: result.name || i.name,
        currentPrice: currPrice ?? i.currentPrice,
        originalPrice: result.originalPrice || i.originalPrice,
        imageUrl: result.imageUrl || i.imageUrl,
        currency: result.currency || 'USD',
        status: newStatus,
        lastChecked: new Date().toISOString(),
      } : i));

      let logMsg = `Checked "${result.name || item.name}"`;
      if (currPrice) logMsg += ` — $${currPrice.toFixed(2)}`;
      if (onSale && sizeOk) logMsg += ' 🔴 ON SALE';
      addLog(logMsg, onSale && sizeOk ? 'sale' : 'check');

      if (onSale && sizeOk && settings.emailOn && settings.email) {
        const subject = `🛍️ Sale alert: ${item.name}${item.size ? ` (${item.size})` : ''}`;
        const body = [`Hi there!`, ``, `A product you're watching just went on sale:`, ``,
          `  📦 ${result.name || item.name}`,
          item.size ? `  Size: ${item.size}` : null,
          result.currentPrice ? `  Current price: $${result.currentPrice.toFixed(2)}` : null,
          result.originalPrice ? `  Original price: $${result.originalPrice.toFixed(2)}` : null,
          `  🔗 ${item.url}`, ``, `Happy shopping!`, `— Sale Watcher`,
        ].filter(l => l !== null).join('\n');
        window.open(`mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
      }

      return { onSale: onSale && sizeOk, result };
    } catch (e) {
      addLog(`Error checking "${item.name}": ${e.message}`, 'error');
      showToast(`Error checking "${item.name}"`, 'error');
    } finally {
      setChecking(prev => ({ ...prev, [id]: false }));
    }
  }, [watchlist, settings, addLog, showToast]);

  const checkAll = useCallback(async () => {
    if (!watchlist.length) { showToast('Add items to your watchlist first', 'error'); return; }
    if (!settings.apiKey) { showToast('Add your API key in Settings first', 'error'); return; }
    let sales = 0;
    for (const item of watchlist) { const r = await checkItem(item.id); if (r?.onSale) sales++; }
    addLog(`Bulk check complete — ${sales} sale${sales !== 1 ? 's' : ''} found`, 'info');
    showToast(sales > 0 ? `${sales} item${sales > 1 ? 's are' : ' is'} on sale! 🎉` : `All ${watchlist.length} items checked — no sales yet`);
  }, [watchlist, settings, checkItem, addLog, showToast]);

  return { watchlist, settings, log, checking, toast, addItem, removeItem, editItem, updateSettings, checkItem, checkAll, showToast, addLog };
}
