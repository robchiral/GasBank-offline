import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_SESSION_CONFIG } from '../constants.js';

export function SessionConfigurator({ filters, config, onUpdate, onCancel, onCreate, getMatchingCount }) {
  const [localConfig, setLocalConfig] = useState({ ...DEFAULT_SESSION_CONFIG, ...config });
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    setLocalConfig({ ...DEFAULT_SESSION_CONFIG, ...config });
    setCategoryMenuOpen(false);
  }, [config]);

  useEffect(() => {
    if (!categoryMenuOpen) return;
    const handleClickOutside = (event) => {
      if (!categoryDropdownRef.current) return;
      if (!categoryDropdownRef.current.contains(event.target)) {
        setCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [categoryMenuOpen]);

  useEffect(() => {
    setLocalConfig((prev) => {
      if (!prev.selectedCategories?.length) return prev;
      const allowed = new Set(filters.categories);
      const filtered = prev.selectedCategories.filter((category) => allowed.has(category));
      if (filtered.length === prev.selectedCategories.length) return prev;
      return { ...prev, selectedCategories: filtered };
    });
  }, [filters.categories]);

  const toggleCategory = (category) => {
    setLocalConfig((prev) => {
      const present = prev.selectedCategories.includes(category);
      const nextCategories = present
        ? prev.selectedCategories.filter((entry) => entry !== category)
        : [...prev.selectedCategories, category];
      return { ...prev, selectedCategories: nextCategories };
    });
  };

  const categoryLabel = useMemo(() => {
    const selections = localConfig.selectedCategories || [];
    if (!selections.length) return 'All categories';
    if (selections.length === 1) return selections[0];
    if (selections.length === 2) return `${selections[0]}, ${selections[1]}`;
    return `${selections.length} selected`;
  }, [localConfig.selectedCategories]);

  const matchingCount = React.useMemo(() => {
    if (!getMatchingCount) return 0;
    return getMatchingCount(localConfig);
  }, [getMatchingCount, localConfig]);
  const requestedCount = Math.max(1, Number(localConfig.numQuestions) || DEFAULT_SESSION_CONFIG.numQuestions);
  const plannedCount = Math.min(requestedCount, matchingCount);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 style={{ marginTop: 0 }}>Configure Session</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 18 }}>
          Choose the scope for your next focused session.
        </p>
        <div className="form-row">
          <label>
            Mode
            <select
              value={localConfig.mode}
              onChange={(event) => setLocalConfig((prev) => ({ ...prev, mode: event.target.value }))}
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
              value={localConfig.numQuestions}
              onChange={(event) => setLocalConfig((prev) => ({ ...prev, numQuestions: Number(event.target.value) }))}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Difficulty
            <select
              value={localConfig.difficulty}
              onChange={(event) => setLocalConfig((prev) => ({ ...prev, difficulty: event.target.value }))}
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
              value={localConfig.statusFilter}
              onChange={(event) => setLocalConfig((prev) => ({ ...prev, statusFilter: event.target.value }))}
            >
              <option value="all">All questions</option>
              <option value="unanswered">Unanswered only</option>
              <option value="incorrect">Incorrect only</option>
            </select>
          </label>
          <label>
            Flag Filter
            <select
              value={localConfig.flagFilter || 'any'}
              onChange={(event) => setLocalConfig((prev) => ({ ...prev, flagFilter: event.target.value }))}
            >
              <option value="any">Include flagged & unflagged</option>
              <option value="flagged">Flagged only</option>
              <option value="excludeFlagged">Exclude flagged</option>
            </select>
          </label>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
          <input
            type="checkbox"
            checked={localConfig.randomize}
            onChange={(event) => setLocalConfig((prev) => ({ ...prev, randomize: event.target.checked }))}
            style={{ width: 18, height: 18 }}
          />
          Randomize question order
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <input
            type="checkbox"
            checked={localConfig.includeCustom}
            onChange={(event) => setLocalConfig((prev) => ({ ...prev, includeCustom: event.target.checked }))}
            style={{ width: 18, height: 18 }}
          />
          Include custom questions
        </label>

        <div className="divider" />
        <h3>Categories</h3>
        {filters.categories.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', marginBottom: 20 }}>No categories available.</div>
        ) : (
          <div style={{ marginBottom: 8 }} ref={categoryDropdownRef} className="multi-select">
            <button
              type="button"
              className={`multi-select-toggle${categoryMenuOpen ? ' open' : ''}`}
              onClick={() => setCategoryMenuOpen((prev) => !prev)}
            >
              <span>{categoryLabel}</span>
              <span className="multi-select-indicator" aria-hidden="true">
                {categoryMenuOpen ? '^' : 'v'}
              </span>
            </button>
            {categoryMenuOpen && (
              <div className="multi-select-menu">
                <label className="multi-select-option">
                  <input
                    type="checkbox"
                    checked={(localConfig.selectedCategories || []).length === 0}
                    onChange={() => {
                      setLocalConfig((prev) => ({ ...prev, selectedCategories: [] }));
                    }}
                  />
                  <span>All categories</span>
                </label>
                <div className="multi-select-divider" />
                {filters.categories.map((category) => (
                  <label key={category} className="multi-select-option">
                    <input
                      type="checkbox"
                      checked={localConfig.selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
        {filters.categories.length > 0 && (
          <p className="multi-select-help">Leave blank to include all categories.</p>
        )}

        <div style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          Matching questions: <span style={{ fontWeight: 600 }}>{matchingCount}</span>
          {matchingCount === 0
            ? '. Adjust the filters to find eligible questions.'
            : plannedCount < requestedCount
              ? ` (will launch with ${plannedCount} to match the available pool).`
              : ` (will launch with ${plannedCount}).`}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button className="button secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="button"
            disabled={matchingCount === 0}
            onClick={() => {
              onUpdate(localConfig);
              onCreate(localConfig);
            }}
          >
            Launch Session
          </button>
        </div>
      </div>
    </div>
  );
}
