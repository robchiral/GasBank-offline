import React from 'react';

export function SettingsView({ paths, customImageDirectory }) {
  const defaultImageDirectory = React.useMemo(() => {
    if (!paths.currentUserDataPath) return null;
    const sanitized = paths.currentUserDataPath.replace(/\\/g, '/');
    const segments = sanitized.split('/');
    segments.pop();
    return `${segments.join('/')}/images`;
  }, [paths.currentUserDataPath]);

  const resolvedImageDirectory = customImageDirectory || defaultImageDirectory;

  return (
    <div className="grid">
      <div className="section-title">
        <div>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="card">
        <h2>Application Data</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          GasBank stores your progress, custom questions, and preferences inside a single <code>userData.json</code>{' '}
          file. Use this path if you want to back up or inspect the data manually.
        </p>
        <div style={{ margin: '18px 0', padding: 18, borderRadius: 14, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(56,189,248,0.14)' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Managed location
          </div>
          <code style={{ fontSize: 14, wordBreak: 'break-all', color: 'var(--text)' }}>{paths.currentUserDataPath || 'Unknown'}</code>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 18 }}>
          Location is controlled by the application; move or copy the file externally if you need your own backups.
        </p>
      </div>

      <div className="card">
        <h2>Custom Images</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
          Images referenced by custom questions must reside in this directory. Reference files by filename (e.g.,
          <code>arterial_line_ultrasound.png</code>) when adding questions.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Image directory
            </div>
            <code style={{ fontSize: 14, wordBreak: 'break-all', color: 'var(--text)' }}>
              {resolvedImageDirectory || 'Unavailable'}
            </code>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            The folder is created automatically beside <code>userData.json</code>. Organize or back it up alongside the data file.
          </p>
        </div>
      </div>
    </div>
  );
}
