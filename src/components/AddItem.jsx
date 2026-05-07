import React, { useState } from 'react';
import './AddItem.css';

export default function AddItem({ onAdd }) {
  const [form, setForm] = useState({ url: '', name: '', size: '', originalPrice: '', targetPrice: '', notes: '' });
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.url.trim()) { setError('Please enter a product URL'); return; }
    try { new URL(form.url.trim()); } catch { setError('Please enter a valid URL (include https://)'); return; }
    setError('');

    let name = form.name.trim();
    if (!name) {
      try {
        const u = new URL(form.url.trim());
        const parts = u.pathname.split('/').filter(Boolean);
        name = parts[parts.length - 1]?.replace(/[-_]/g, ' ').replace(/\.\w+$/, '') || u.hostname.replace('www.', '');
        name = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      } catch { name = 'Product'; }
    }

    onAdd({
      url: form.url.trim(),
      name,
      size: form.size.trim(),
      originalPrice: parseFloat(form.originalPrice) || null,
      targetPrice: parseFloat(form.targetPrice) || null,
      notes: form.notes.trim(),
    });
    setForm({ url: '', name: '', size: '', originalPrice: '', targetPrice: '', notes: '' });
  };

  return (
    <div className="add-item">
      <div className="ai-card">
        <h2 className="ai-title">Add a product to watch</h2>
        <p className="ai-sub">Paste any product page URL. Sale Watcher will check the price regularly and alert you when it drops.</p>

        {error && <div className="ai-error">{error}</div>}

        <div className="field full">
          <label>Product URL <span className="req">*</span></label>
          <input type="url" placeholder="https://www.nike.com/t/air-max-90..." value={form.url}
            onChange={e => set('url', e.target.value)} />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Product name <span className="opt">optional</span></label>
            <input type="text" placeholder="Auto-detected from URL" value={form.name}
              onChange={e => set('name', e.target.value)} />
          </div>
          <div className="field">
            <label>Size / variant <span className="opt">optional</span></label>
            <input type="text" placeholder="e.g. US 10, M, Blue..." value={form.size}
              onChange={e => set('size', e.target.value)} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Current price ($) <span className="opt">optional</span></label>
            <input type="number" placeholder="e.g. 129.99" step="0.01" min="0" value={form.originalPrice}
              onChange={e => set('originalPrice', e.target.value)} />
          </div>
          <div className="field">
            <label>Alert me when below ($) <span className="opt">optional</span></label>
            <input type="number" placeholder="e.g. 89.99" step="0.01" min="0" value={form.targetPrice}
              onChange={e => set('targetPrice', e.target.value)} />
          </div>
        </div>

        <div className="field full">
          <label>Notes <span className="opt">optional</span></label>
          <input type="text" placeholder="e.g. Birthday gift, want 30% off..." value={form.notes}
            onChange={e => set('notes', e.target.value)} />
        </div>

        <div className="ai-hint">
          <span className="hint-icon">◈</span>
          If you set a target price, you'll only be alerted when the price drops below it. Leave it blank to be alerted on any price drop.
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Add to Watchlist →
        </button>
      </div>

      <div className="ai-tips">
        <h3>Tips for best results</h3>
        <ul>
          <li><strong>Use direct product URLs</strong>, not search results or collection pages</li>
          <li><strong>Include size</strong> if you need a specific one — Sale Watcher will check availability</li>
          <li><strong>Works with most major retailers</strong> — Nike, ASOS, H&M, Amazon, Zara, and more</li>
          <li><strong>Price checks use your Anthropic API key</strong> — set it in Settings</li>
        </ul>
      </div>
    </div>
  );
}
