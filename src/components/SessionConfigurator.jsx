import React, { useEffect, useState } from 'react';
import { DEFAULT_SESSION_CONFIG } from '../constants.js';

export function SessionConfigurator({ filters, config, onUpdate, onCancel, onCreate }) {
  const [localConfig, setLocalConfig] = useState({ ...DEFAULT_SESSION_CONFIG, ...config });

  useEffect(() => {
    setLocalConfig({ ...DEFAULT_SESSION_CONFIG, ...config });
  }, [config]);

  const toggleCategory = (category) => {
    setLocalConfig((prev) => {
      const present = prev.selectedCategories.includes(category);
      const nextCategories = present
        ? prev.selectedCategories.filter((entry) => entry !== category)
        : [...prev.selectedCategories, category];
      return { ...prev, selectedCategories: nextCategories };
    });
  };

  const toggleSubcategory = (subcategory) => {
    setLocalConfig((prev) => {
      const present = prev.selectedSubcategories.includes(subcategory);
      const next = present
        ? prev.selectedSubcategories.filter((entry) => entry !== subcategory)
        : [...prev.selectedSubcategories, subcategory];
      return { ...prev, selectedSubcategories: next };
    });
  };

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
        <div className="tag-list" style={{ marginBottom: 20 }}>
          {filters.categories.map((category) => {
            const active = localConfig.selectedCategories.includes(category);
            return (
              <button
                key={category}
                className="button secondary"
                style={{
                  background: active ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.08)',
                  border: active ? '1px solid rgba(56, 189, 248, 0.6)' : '1px solid rgba(56, 189, 248, 0.2)',
                  color: active ? 'var(--primary)' : 'var(--text-muted)'
                }}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            );
          })}
          {filters.categories.length === 0 && <span style={{ color: 'var(--text-muted)' }}>No categories available.</span>}
        </div>

        <h3>Subcategories</h3>
        <div className="tag-list" style={{ marginBottom: 20 }}>
          {filters.subcategories.map((subcategory) => {
            const active = localConfig.selectedSubcategories.includes(subcategory);
            return (
              <button
                key={subcategory}
                className="button secondary"
                style={{
                  background: active ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.08)',
                  border: active ? '1px solid rgba(168, 85, 247, 0.6)' : '1px solid rgba(168, 85, 247, 0.25)',
                  color: active ? 'var(--secondary)' : 'var(--text-muted)'
                }}
                onClick={() => toggleSubcategory(subcategory)}
              >
                {subcategory}
              </button>
            );
          })}
          {filters.subcategories.length === 0 && <span style={{ color: 'var(--text-muted)' }}>No subcategories available.</span>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button className="button secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="button"
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
