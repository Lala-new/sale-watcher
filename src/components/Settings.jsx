import React, { useState } from 'react';
import './Settings.css';

const SCHEDULES = [
  { id: 'manual', label: 'Manual only', desc: 'Check when you click the button' },
  { id: 'daily', label: 'Daily', desc: 'Once per day when you open the app' },
];

export default function Settings({ settings, onUpdate, onTest }) {
  const [showKey, setShowKey] = useState(false);

  const sendTestEmail = () => {
    if (!settings.email) { onTest('Enter your email address first', 'error'); return; }
    const subject = 'Sale Watcher — test notification';
    const body = `Hi!\n\nThis is a test from Sale Watcher.\n\nYou're all set to receive price drop alerts.\n\n— Sale Watcher`;
    window.open(`mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    onTest('Test email draft opened in your mail app');
  };

  return (
    <div className="settings" style={{ animation: 'fadeUp 0.25s ease both' }}>

      <section className="settings-section">
        <h2 className="settings-section-title">
          <span className="section-icon">🔑</span> API Key
        </h2>
        <p className="settings-desc">
          Sale Watcher uses the Claude AI API to check prices. You need a free Anthropic API key —{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">get one here</a>.
          Your key is stored only in your browser.
        </p>

        <div className="setting-row">
          <div className="key-input-wrap">
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="sk-ant-api03-..."
              value={settings.apiKey}
              onChange={e => onUpdate({ apiKey: e.target.value.trim() })}
            />
            <button className="show-btn" onClick={() => setShowKey(s => !s)}>
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {settings.apiKey && (
          <div className="key-status ok">✓ API key set</div>
        )}

        <div className="api-note">
          <strong>Cost:</strong> Checking 10 items once a day costs roughly $0.05–$0.15/month.
          You can set a spending limit at <a href="https://console.anthropic.com/settings/limits" target="_blank" rel="noreferrer">console.anthropic.com</a>.
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">
          <span className="section-icon">📧</span> Email Notifications
        </h2>
        <p className="settings-desc">
          When a sale is detected, Sale Watcher opens a pre-written email draft in your mail app ready to send.
        </p>

        <div className="toggle-row">
          <div>
            <div className="toggle-label">Enable email alerts</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={settings.emailOn} onChange={e => onUpdate({ emailOn: e.target.checked })} />
            <span className="toggle-slider" />
          </label>
        </div>

        {settings.emailOn && (
          <>
            <div className="field">
              <label>Your email address</label>
              <input type="email" placeholder="you@example.com" value={settings.email}
                onChange={e => onUpdate({ email: e.target.value.trim() })} />
            </div>
            <button className="test-btn" onClick={sendTestEmail}>Send test email</button>
          </>
        )}
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">
          <span className="section-icon">⚙️</span> Alert Preferences
        </h2>

        <div className="toggle-row">
          <div>
            <div className="toggle-label">Alert on any price drop</div>
            <div className="toggle-sub">Notify even if no target price is set</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={settings.alertAnyDrop} onChange={e => onUpdate({ alertAnyDrop: e.target.checked })} />
            <span className="toggle-slider" />
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">
          <span className="section-icon">ℹ️</span> About Sale Watcher
        </h2>
        <p className="settings-desc">
          Sale Watcher is an open-source app that uses Claude AI to check product prices on your behalf.
          Your watchlist and API key are stored locally in your browser — nothing is sent to any server except the Anthropic API when checking prices.
        </p>
        <p className="settings-desc" style={{ marginTop: 8 }}>
          <a href="https://github.com" target="_blank" rel="noreferrer">View on GitHub</a> · Built with React + Claude AI
        </p>
      </section>
    </div>
  );
}
