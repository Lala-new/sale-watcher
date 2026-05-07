import React from 'react';
import './Header.css';

export default function Header({ watchlist, salesCount, onCheckAll, checking, hasApiKey }) {
  const lastCheck = watchlist.map(i => i.lastChecked).filter(Boolean).sort().pop();

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <div className="logo-icon">◈</div>
          <div>
            <h1 className="logo-name">Sale Watcher</h1>
            <p className="logo-sub">AI-powered price drop alerts</p>
          </div>
        </div>
      </div>

      <div className="stats-and-btn">
        <div className="stats">
          <div className="stat">
            <span className="stat-val">{watchlist.length}</span>
            <span className="stat-label">Watching</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className={`stat-val${salesCount > 0 ? ' red' : ''}`}>{salesCount}</span>
            <span className="stat-label">On sale</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-val sm">
              {lastCheck ? new Date(lastCheck).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
            </span>
            <span className="stat-label">Last check</span>
          </div>
          {!hasApiKey && (
            <>
              <div className="stat-divider" />
              <div className="stat api-warning">
                <span className="stat-val warn">!</span>
                <span className="stat-label">API key needed</span>
              </div>
            </>
          )}
        </div>

        <button
          className={`check-btn${checking ? ' loading' : ''}`}
          onClick={onCheckAll}
          disabled={checking}
        >
          {checking ? <><span className="spinner" />Checking...</> : <>↻ Check All</>}
        </button>
      </div>
    </header>
  );
}
