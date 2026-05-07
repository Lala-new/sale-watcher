import React from 'react';

const TYPE_COLORS = { sale: '#cc1111', add: '#2266cc', remove: '#cc1111', error: '#cc1111', check: '#aaa', info: '#ccc' };
const TYPE_ICONS = { sale: '🔴', add: '+', remove: '−', error: '!', check: '↻', info: '·' };

export function ActivityLog({ log }) {
  if (!log.length) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 20px', color: '#bbb', fontFamily: 'var(--font-display)', fontSize: 14, animation: 'fadeUp 0.25s ease both' }}>
        No activity yet — add items and run a price check to get started.
      </div>
    );
  }
  return (
    <div style={{ animation: 'fadeUp 0.25s ease both' }}>
      <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {log.map((entry, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderBottom: i < log.length - 1 ? '1px solid #f0f0f0' : 'none', background: entry.type === 'sale' ? '#fff8f8' : '#fff' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: entry.type === 'sale' ? '#fff0f0' : '#f5f5f5', color: TYPE_COLORS[entry.type] || '#bbb', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, fontWeight: 700 }}>
              {TYPE_ICONS[entry.type] || '·'}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: entry.type === 'sale' ? '#cc1111' : '#111', lineHeight: 1.5, wordBreak: 'break-word' }}>{entry.msg}</div>
              <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>{new Date(entry.time).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Toast({ toast }) {
  const isError = toast.type === 'error';
  return (
    <div style={{
      background: isError ? '#fff0f0' : '#111',
      border: `1px solid ${isError ? '#ffcccc' : '#333'}`,
      color: isError ? '#cc1111' : '#fff',
      padding: '12px 20px',
      borderRadius: 'var(--radius)',
      fontSize: 14,
      fontFamily: 'var(--font-body)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      animation: 'fadeUp 0.2s ease both',
      maxWidth: '100%',
      textAlign: 'center',
      wordBreak: 'break-word',
    }}>
      {toast.msg}
    </div>
  );
}

export default ActivityLog;
