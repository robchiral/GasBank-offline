import React from 'react';

export function SettingsView({ paths, onChooseLocation, onUseDefault }) {
  const isDefault = paths.currentUserDataPath === paths.defaultUserDataPath;

  return (
    <div className="grid">
      <div className="section-title">
        <div>
          <h1>Settings</h1>
          <p className="section-subtitle">Control where your study data is stored.</p>
        </div>
      </div>

      <div className="card">
        <h2>Storage Location</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          GasBank keeps your progress inside a single <code>userData.json</code> file. You can relocate this file to
          match your backup workflow.
        </p>
        <div style={{ margin: '18px 0', padding: 18, borderRadius: 14, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(56,189,248,0.14)' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Current path
          </div>
          <code style={{ fontSize: 14, wordBreak: 'break-all', color: 'var(--text)' }}>{paths.currentUserDataPath || 'Unknown'}</code>
        </div>
        {!isDefault && (
          <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            Default location: <code>{paths.defaultUserDataPath}</code>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="button secondary" onClick={onChooseLocation}>
            Choose New Location
          </button>
          <button className="button secondary" onClick={onUseDefault} disabled={isDefault}>
            Use Default Location
          </button>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 18 }}>
          Tip: place the data file inside a synced folder so your progress follows you.
        </p>
      </div>
    </div>
  );
}
