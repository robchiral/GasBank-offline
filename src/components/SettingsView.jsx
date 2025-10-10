import React from 'react';
import { DEFAULT_SESSION_CONFIG } from '../constants.js';
import { formatDate } from '../utils/dataUtils.js';
import { clampQuestionCount, normalizeSessionConfig } from '../utils/sessionConfig.js';

export function SettingsView({
  paths,
  customImageDirectory,
  sessionDefaults,
  onUpdateSessionDefaults,
  backupState,
  onChooseBackupDirectory,
  onClearBackupDirectory,
  onUpdateBackupPreferences,
  onCreateBackup,
  onImportBackup,
  themePreference,
  resolvedTheme,
  onUpdateThemePreference
}) {
  const defaultImageDirectory = React.useMemo(() => {
    if (!paths.currentUserDataPath) return null;
    const sanitized = paths.currentUserDataPath.replace(/\\/g, '/');
    const segments = sanitized.split('/');
    segments.pop();
    return `${segments.join('/')}/images`;
  }, [paths.currentUserDataPath]);

  const resolvedImageDirectory = customImageDirectory || defaultImageDirectory;
  const mergedDefaults = React.useMemo(
    () => normalizeSessionConfig(sessionDefaults),
    [sessionDefaults]
  );
  const normalizedThemePreference = themePreference || 'system';
  const effectiveTheme = React.useMemo(() => {
    if (resolvedTheme === 'light' || resolvedTheme === 'dark') {
      return resolvedTheme;
    }
    if (normalizedThemePreference === 'light') return 'light';
    if (normalizedThemePreference === 'dark') return 'dark';
    return 'dark';
  }, [normalizedThemePreference, resolvedTheme]);

  const [localDefaults, setLocalDefaults] = React.useState(mergedDefaults);
  const backupAutoEnabled = backupState?.preferences?.autoEnabled ?? true;
  const backupInterval = Math.max(1, Number(backupState?.preferences?.interval) || 10);
  const [localBackupPrefs, setLocalBackupPrefs] = React.useState({
    autoEnabled: backupAutoEnabled,
    interval: backupInterval
  });

  React.useEffect(() => {
    setLocalDefaults(mergedDefaults);
  }, [mergedDefaults]);

  React.useEffect(() => {
    setLocalBackupPrefs({
      autoEnabled: backupAutoEnabled,
      interval: backupInterval
    });
  }, [backupAutoEnabled, backupInterval]);

  const isDirty = React.useMemo(() => {
    return (
      localDefaults.mode !== mergedDefaults.mode ||
      localDefaults.numQuestions !== mergedDefaults.numQuestions ||
      localDefaults.difficulty !== mergedDefaults.difficulty ||
      localDefaults.statusFilter !== mergedDefaults.statusFilter ||
      (localDefaults.flagFilter || 'any') !== (mergedDefaults.flagFilter || 'any') ||
      !!localDefaults.randomize !== !!mergedDefaults.randomize ||
      !!localDefaults.includeCustom !== !!mergedDefaults.includeCustom
    );
  }, [localDefaults, mergedDefaults]);

  const backupDirty = React.useMemo(() => {
    return (
      localBackupPrefs.autoEnabled !== backupAutoEnabled ||
      localBackupPrefs.interval !== backupInterval
    );
  }, [localBackupPrefs, backupAutoEnabled, backupInterval]);
  const lastBackupDisplay = backupState?.lastBackupAt ? formatDate(backupState.lastBackupAt) : 'Never';
  const attemptsSinceBackup = Number(backupState?.attemptsSinceBackup || 0);
  const backupDirectory = backupState?.directory || 'Not set';
  const hasBackupDirectory = !!backupState?.directory;

  const handleSaveDefaults = () => {
    if (!onUpdateSessionDefaults) return;
    const baseConfig = {
      ...localDefaults,
      selectedCategories: Array.isArray(localDefaults.selectedCategories)
        ? localDefaults.selectedCategories
        : []
    };
    const sanitized = normalizeSessionConfig(baseConfig, mergedDefaults);
    onUpdateSessionDefaults(sanitized);
    setLocalDefaults(sanitized);
  };

  const handleSaveBackupPrefs = () => {
    if (!onUpdateBackupPreferences) return;
    onUpdateBackupPreferences(localBackupPrefs);
  };

  return (
    <div className="grid">
      <div className="section-title">
        <div>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="card">
        <h2>Appearance</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 18 }}>
          Choose whether GasBank follows your system theme or stays in light or dark mode.
        </p>
        <div className="form-row" style={{ maxWidth: 360, marginBottom: 10 }}>
          <label>
            Theme preference
            <select
              value={normalizedThemePreference}
              onChange={(event) => onUpdateThemePreference && onUpdateThemePreference(event.target.value)}
            >
              <option value="system">Match system setting</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
          Currently using <strong>{effectiveTheme === 'light' ? 'light' : 'dark'}</strong> mode
          {normalizedThemePreference === 'system' ? ' (matching system preference)' : ''}.
        </p>
      </div>

      <div className="card">
        <h2>User Data</h2>
        <div className="info-block">
          <div className="info-row">
            <div className="info-label">userData.json</div>
            <code className="info-value">{paths.currentUserDataPath || 'Unknown'}</code>
          </div>
          <div className="info-row">
            <div className="info-label">Custom images</div>
            <code className="info-value">{resolvedImageDirectory || 'Unavailable'}</code>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Backups</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
          Manage local backups of <code>userData.json</code>. Auto-backups trigger after the selected number of tracked question attempts.
        </p>
        <div className="info-block" style={{ marginBottom: 16 }}>
          <div className="info-row">
            <div className="info-label">Backup directory</div>
            <code className="info-value">{backupDirectory}</code>
          </div>
          <div className="info-row">
            <div className="info-label">Last backup</div>
            <div className="info-value">{lastBackupDisplay}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Attempts since backup</div>
            <div className="info-value">{attemptsSinceBackup}</div>
          </div>
        </div>
        <div className="form-row" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
          <button
            className="button"
            type="button"
            onClick={() => onChooseBackupDirectory && onChooseBackupDirectory()}
          >
            Choose Backup Directory
          </button>
          <button
            className="button secondary"
            type="button"
            onClick={() => onClearBackupDirectory && onClearBackupDirectory()}
            disabled={!hasBackupDirectory}
          >
            Clear Directory
          </button>
        </div>
        <div className="divider" style={{ margin: '12px 0 16px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="form-row">
            <label>
              Auto-backup interval (attempts)
              <input
                type="number"
                min={1}
                value={localBackupPrefs.interval}
                onChange={(event) =>
                  setLocalBackupPrefs((prev) => ({
                    ...prev,
                    interval: Math.max(1, Math.round(Number(event.target.value) || 1))
                  }))
                }
              />
            </label>
            <div className="field-group">
              <span className="field-label">Auto-backup setting</span>
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={localBackupPrefs.autoEnabled}
                  onChange={(event) =>
                    setLocalBackupPrefs((prev) => ({
                      ...prev,
                      autoEnabled: event.target.checked
                    }))
                  }
                />
                Enable auto-backup
              </label>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
            Auto-backups run only when a backup directory is set.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
          <button
            className="button secondary"
            type="button"
            onClick={handleSaveBackupPrefs}
            disabled={!backupDirty}
          >
            Save Backup Preferences
          </button>
          <button
            className="button"
            type="button"
            onClick={() => onCreateBackup && onCreateBackup()}
            disabled={!hasBackupDirectory}
          >
            Create Backup Now
          </button>
          <button
            className="button secondary"
            type="button"
            onClick={() => onImportBackup && onImportBackup()}
          >
            Import Backup…
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Session Defaults</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 18 }}>
          Adjust the baseline configuration used when creating new sessions.
        </p>

        <div className="form-row">
          <label>
            Mode
            <select
              value={localDefaults.mode}
              onChange={(event) => setLocalDefaults((prev) => ({ ...prev, mode: event.target.value }))}
            >
              <option value="Tutor">Tutor (instant feedback)</option>
              <option value="Exam">Exam (review at end)</option>
            </select>
          </label>
          <label>
            Number of Questions
            <input
              type="number"
              min={1}
              max={100}
              value={localDefaults.numQuestions}
              onChange={(event) =>
                setLocalDefaults((prev) => ({
                  ...prev,
                  numQuestions: clampQuestionCount(event.target.value, prev.numQuestions)
                }))
              }
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Difficulty
            <select
              value={localDefaults.difficulty}
              onChange={(event) => setLocalDefaults((prev) => ({ ...prev, difficulty: event.target.value }))}
            >
              <option value="all">All levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label>
            Status Filter
            <select
              value={localDefaults.statusFilter}
              onChange={(event) => setLocalDefaults((prev) => ({ ...prev, statusFilter: event.target.value }))}
            >
              <option value="all">All questions</option>
              <option value="unanswered">Unanswered only</option>
              <option value="incorrect">Incorrect only</option>
            </select>
          </label>
          <label>
            Flag Filter
            <select
              value={localDefaults.flagFilter || 'any'}
              onChange={(event) => setLocalDefaults((prev) => ({ ...prev, flagFilter: event.target.value }))}
            >
              <option value="any">Include flagged & unflagged</option>
              <option value="flagged">Flagged only</option>
              <option value="excludeFlagged">Exclude flagged</option>
            </select>
          </label>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
          <input
            type="checkbox"
            checked={!!localDefaults.randomize}
            onChange={(event) => setLocalDefaults((prev) => ({ ...prev, randomize: event.target.checked }))}
            style={{ width: 18, height: 18 }}
          />
          Randomize question order
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <input
            type="checkbox"
            checked={!!localDefaults.includeCustom}
            onChange={(event) => setLocalDefaults((prev) => ({ ...prev, includeCustom: event.target.checked }))}
            style={{ width: 18, height: 18 }}
          />
          Include custom questions
        </label>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="button secondary"
            type="button"
            onClick={() => setLocalDefaults({ ...DEFAULT_SESSION_CONFIG })}
          >
            Reset
          </button>
          <button className="button" type="button" onClick={handleSaveDefaults} disabled={!isDirty}>
            Save Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
