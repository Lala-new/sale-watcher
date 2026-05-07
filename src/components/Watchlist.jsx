import React, { useState } from 'react';
import EditModal from './EditModal';
import './Watchlist.css';

function ProductImage({ item }) {
  const [err, setErr] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const emoji = (() => {
    const n = (item.name || '').toLowerCase();
    const u = (item.url || '').toLowerCase();
    if (u.includes('nike') || u.includes('adidas') || n.includes('shoe') || n.includes('sneaker') || n.includes('boot') || n.includes('air max') || n.includes('ultra boost')) return '👟';
    if (u.includes('sephora') || u.includes('ulta') || n.includes('cream') || n.includes('serum') || n.includes('moistur') || n.includes('tatcha')) return '🧴';
    if (n.includes('jacket') || n.includes('coat') || n.includes('puffer') || n.includes('hoodie')) return '🧥';
    if (n.includes('watch') || n.includes('casio') || n.includes('rolex') || n.includes('omega')) return '⌚';
    if (n.includes('perfume') || n.includes('cologne') || n.includes('fragrance') || n.includes('replica') || n.includes('eau de')) return '🌸';
    if (n.includes('bag') || n.includes('purse') || n.includes('tote') || n.includes('backpack')) return '👜';
    if (n.includes('dress') || n.includes('skirt')) return '👗';
    if (n.includes('shirt') || n.includes('tee') || n.includes('top') || n.includes('blouse')) return '👕';
    if (n.includes('pant') || n.includes('jean') || n.includes('trouser') || n.includes('denim')) return '👖';
    if (n.includes('laptop') || n.includes('macbook') || n.includes('computer')) return '💻';
    if (n.includes('phone') || n.includes('iphone') || n.includes('samsung')) return '📱';
    if (n.includes('headphone') || n.includes('airpod') || n.includes('earbud')) return '🎧';
    return '🛍️';
  })();

  // Try a Google thumbnail as fallback when direct image URL fails
  const googleThumb = `https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(item.url).hostname; } catch { return ''; } })()}&sz=128`;

  if (!item.imageUrl || err) {
    return (
      <div className="img-placeholder">
        <span className="placeholder-emoji">{emoji}</span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className="img-placeholder img-loading">
          <span className="placeholder-emoji">{emoji}</span>
        </div>
      )}
      <img
        src={item.imageUrl}
        alt={item.name}
        className={`product-img${loaded ? ' loaded' : ''}`}
        onLoad={() => setLoaded(true)}
        onError={() => setErr(true)}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
    </>
  );
}

function WatchCard({ item, checking, onCheck, onRemove, onEdit, hasApiKey, size }) {
  const sale = item.status === 'onsale';
  const savings = item.originalPrice && item.currentPrice && item.originalPrice > item.currentPrice
    ? Math.round((1 - item.currentPrice / item.originalPrice) * 100)
    : null;
  const fmt = n => n != null ? `$${Number(n).toFixed(2)}` : '—';
  const domain = (() => { try { return new URL(item.url).hostname.replace('www.', ''); } catch { return ''; } })();

  return (
    <div className={`watch-card${sale ? ' on-sale' : ''} size-${size}`}>
      <div className="card-img-wrap">
        <ProductImage item={item} />
        {sale && <span className="sale-badge">On sale</span>}
        <span className={`status-dot${sale ? ' sale' : ''}`} />
        <div className="card-actions-overlay">
          <button
            className="overlay-btn check"
            onClick={() => onCheck(item.id)}
            disabled={checking || !hasApiKey}
            title={!hasApiKey ? 'Add your API key in Settings' : 'Check price now'}
          >
            {checking ? <span className="mini-spin" /> : '↻'}
          </button>
          <button className="overlay-btn edit" onClick={() => onEdit(item)} title="Edit">✎</button>
          <button className="overlay-btn remove" onClick={() => onRemove(item.id)} title="Remove">✕</button>
        </div>
      </div>

      <div className="card-body">
        {domain && <div className="card-site">{domain}</div>}
        <div className="card-name" title={item.name}>{item.name}</div>
        {item.size && <span className="card-size">{item.size}</span>}
        <div className="price-row">
          <span className={`price-now${sale ? ' sale' : ''}`}>{fmt(item.currentPrice)}</span>
          {item.originalPrice && item.originalPrice !== item.currentPrice && (
            <span className="price-was">{fmt(item.originalPrice)}</span>
          )}
          {savings > 0 && <span className="savings">{savings}% off</span>}
        </div>
      </div>

      <div className="card-footer">
        <span className="target-label">
          {item.targetPrice ? `Target: ${fmt(item.targetPrice)}` : 'Any drop'}
        </span>
        <a href={item.url} target="_blank" rel="noreferrer" className="view-link">View ↗</a>
      </div>
    </div>
  );
}

export default function Watchlist({ watchlist, checking, onCheck, onRemove, onEdit, hasApiKey, onGoAdd, onGoSettings }) {
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => setEditingItem(item);
  const handleSave = (updatedItem) => { onEdit(updatedItem); setEditingItem(null); };

  if (!watchlist.length) {
    return (
      <div className="empty-watchlist">
        <div className="empty-icon">◈</div>
        <h2>Your watchlist is empty</h2>
        <p>Add product URLs to start tracking prices. Sale Watcher will alert you the moment something goes on sale.</p>
        <div className="empty-actions">
          <button className="btn-primary" onClick={onGoAdd}>Add your first item</button>
          {!hasApiKey && <button className="btn-ghost" onClick={onGoSettings}>Set up API key</button>}
        </div>
      </div>
    );
  }

  const onSale = watchlist.filter(i => i.status === 'onsale');
  const watching = watchlist.filter(i => i.status !== 'onsale');

  const assignSizes = (items) => items.map((item, i) => {
    if (i === 0 && items.length > 2) return { item, size: 'tall' };
    if (i === 2 && items.length > 3) return { item, size: 'wide' };
    return { item, size: 'normal' };
  });

  return (
    <div className="watchlist">
      {onSale.length > 0 && (
        <>
          <div className="sale-strip">
            <span className="sale-strip-text">
              {onSale.length} item{onSale.length > 1 ? 's are' : ' is'} on sale right now
            </span>
            <span className="sale-strip-meta">Check your email</span>
          </div>
          <div className="section-label red">On sale now</div>
          <div className="moodboard-grid">
            {assignSizes(onSale).map(({ item, size }) => (
              <WatchCard key={item.id} item={item} size={size}
                checking={!!checking[item.id]} onCheck={onCheck}
                onRemove={onRemove} onEdit={handleEdit} hasApiKey={hasApiKey} />
            ))}
          </div>
        </>
      )}

      {watching.length > 0 && (
        <>
          {onSale.length > 0 && <div className="section-label" style={{ marginTop: 28 }}>Watching</div>}
          <div className="moodboard-grid">
            {assignSizes(watching).map(({ item, size }) => (
              <WatchCard key={item.id} item={item} size={size}
                checking={!!checking[item.id]} onCheck={onCheck}
                onRemove={onRemove} onEdit={handleEdit} hasApiKey={hasApiKey} />
            ))}
          </div>
        </>
      )}

      {editingItem && (
        <EditModal
          item={editingItem}
          onSave={handleSave}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
