import React from 'react';

export function SettingsView({
  paths,
  customImageDirectory,
  onChooseLocation,
  onUseDefault,
  onSelectCustomImageDirectory,
  onPersistCustomImageDirectory
}) {
  const isDefault = paths.currentUserDataPath === paths.defaultUserDataPath;
  const defaultImageDirectory = React.useMemo(() => {
    if (!paths.currentUserDataPath) return null;
    const sanitized = paths.currentUserDataPath.replace(/\\/g, '/');
    const segments = sanitized.split('/');
    segments.pop();
    return `${segments.join('/')}/images`;
  }, [paths.currentUserDataPath]);

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

      <div className="card">
        <h2>Custom Images</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
          Custom question images are stored locally so you can manage them alongside your question data.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Current directory
            </div>
            <code style={{ fontSize: 14, wordBreak: 'break-all', color: 'var(--text)' }}>{customImageDirectory || defaultImageDirectory || 'Not set'}</code>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="button secondary"
              onClick={async () => {
                const result = await window.gasbank.chooseUserDataDirectory();
                if (!result || result.canceled || !result.directory) return;
                onSelectCustomImageDirectory(result.directory);
              }}
            >
              Choose Directory
            </button>
            <button
              className="button secondary"
              onClick={() => onSelectCustomImageDirectory(defaultImageDirectory)}
              disabled={!defaultImageDirectory}
            >
              Use Default
            </button>
            <button
              className="button"
              onClick={() => onPersistCustomImageDirectory(customImageDirectory)}
              disabled={!customImageDirectory}
            >
              Save Location
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Images placed in this folder can be referenced by filename when creating or importing custom questions. Choose a directory, then click Save to apply the change.
          </p>
        </div>
      </div>
    </div>
  );
}
