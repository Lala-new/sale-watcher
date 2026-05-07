import React, { useState } from 'react';
import { useStore } from './hooks/useStore';
import Header from './components/Header';
import Watchlist from './components/Watchlist';
import AddItem from './components/AddItem';
import Settings from './components/Settings';
import { ActivityLog, Toast } from './components/ActivityLog';
import './App.css';

const TABS = ['Watchlist', 'Add Item', 'Settings', 'Activity'];

export default function App() {
  const [tab, setTab] = useState('Watchlist');
  const store = useStore();
  const salesCount = store.watchlist.filter(i => i.status === 'onsale').length;

  return (
    <div className="app">
      <div className="app-inner">
        <Header
          watchlist={store.watchlist}
          salesCount={salesCount}
          onCheckAll={store.checkAll}
          checking={Object.values(store.checking).some(Boolean)}
          hasApiKey={!!store.settings.apiKey}
        />

        <nav className="tabs">
          {TABS.map(t => (
            <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t}
              {t === 'Watchlist' && salesCount > 0 && <span className="tab-badge">{salesCount}</span>}
            </button>
          ))}
        </nav>

        <main className="main">
          {tab === 'Watchlist' && (
            <Watchlist
              watchlist={store.watchlist}
              checking={store.checking}
              onCheck={store.checkItem}
              onRemove={store.removeItem}
              onEdit={store.editItem}
              hasApiKey={!!store.settings.apiKey}
              onGoAdd={() => setTab('Add Item')}
              onGoSettings={() => setTab('Settings')}
            />
          )}
          {tab === 'Add Item' && (
            <AddItem onAdd={(item) => { store.addItem(item); setTab('Watchlist'); }} />
          )}
          {tab === 'Settings' && (
            <Settings settings={store.settings} onUpdate={store.updateSettings} onTest={store.showToast} />
          )}
          {tab === 'Activity' && <ActivityLog log={store.log} />}
        </main>
      </div>

      {store.toast && (
        <div className="toast-wrap">
          <Toast toast={store.toast} />
        </div>
      )}
    </div>
  );
}
