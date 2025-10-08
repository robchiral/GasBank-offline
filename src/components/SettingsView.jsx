import React from 'react';
import { DEFAULT_SESSION_CONFIG } from '../constants.js';

export function SettingsView({ paths, customImageDirectory, sessionDefaults, onUpdateSessionDefaults }) {
  const defaultImageDirectory = React.useMemo(() => {
    if (!paths.currentUserDataPath) return null;
    const sanitized = paths.currentUserDataPath.replace(/\\/g, '/');
    const segments = sanitized.split('/');
    segments.pop();
    return `${segments.join('/')}/images`;
  }, [paths.currentUserDataPath]);

  const resolvedImageDirectory = customImageDirectory || defaultImageDirectory;
  const mergedDefaults = React.useMemo(
    () => ({ ...DEFAULT_SESSION_CONFIG, ...(sessionDefaults || {}) }),
    [sessionDefaults]
  );

  const [localDefaults, setLocalDefaults] = React.useState(mergedDefaults);

  React.useEffect(() => {
    setLocalDefaults(mergedDefaults);
  }, [mergedDefaults]);

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

  const handleSaveDefaults = () => {
    if (!onUpdateSessionDefaults) return;
    const sanitized = {
      ...DEFAULT_SESSION_CONFIG,
      ...localDefaults,
      selectedCategories: Array.isArray(localDefaults.selectedCategories) ? localDefaults.selectedCategories : [],
      selectedSubcategories: Array.isArray(localDefaults.selectedSubcategories) ? localDefaults.selectedSubcategories : [],
      onlyCustom: typeof localDefaults.onlyCustom === 'boolean' ? localDefaults.onlyCustom : false
    };
    sanitized.numQuestions = Math.max(1, Math.min(100, Number(sanitized.numQuestions) || DEFAULT_SESSION_CONFIG.numQuestions));
    onUpdateSessionDefaults(sanitized);
    setLocalDefaults(sanitized);
  };

  return (
    <div className="grid">
      <div className="section-title">
        <div>
          <h1>Settings</h1>
        </div>
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
                  numQuestions: Math.max(1, Math.min(100, Number(event.target.value) || 1))
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
