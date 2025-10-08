import React from 'react';
import { statusLabels } from '../constants.js';
import { determineStatus } from '../utils/dataUtils.js';

export function ContentView({
  allQuestions,
  userData,
  filters,
  customQuestionIds,
  flaggedSet,
  customImageDirectory,
  onCreateQuestion,
  onImport,
  onExport,
  onBulkReset,
  onDeleteCustomQuestions
}) {
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [difficultyFilter, setDifficultyFilter] = React.useState('all');
  const [sourceFilter, setSourceFilter] = React.useState('all');
  const [selectedIds, setSelectedIds] = React.useState(() => new Set());

  React.useEffect(() => {
    const availableIds = new Set(allQuestions.map((question) => question.id));
    setSelectedIds((prev) => {
      let changed = false;
      const next = new Set();
      prev.forEach((id) => {
        if (availableIds.has(id)) {
          next.add(id);
        } else {
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [allQuestions]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(() => new Set());
  };

  const filteredQuestions = React.useMemo(() => {
    return allQuestions.filter((question) => {
      const isCustom = customQuestionIds.has(question.id);
      if (sourceFilter === 'default' && isCustom) return false;
      if (sourceFilter === 'custom' && !isCustom) return false;
      if (categoryFilter !== 'all' && question.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && question.difficulty?.toLowerCase() !== difficultyFilter) return false;
      if (search) {
        const needle = search.toLowerCase();
        const haystack = `${question.id} ${question.questionText} ${question.category} ${question.subcategory}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [allQuestions, categoryFilter, difficultyFilter, search, sourceFilter, customQuestionIds]);

  const [newQuestion, setNewQuestion] = React.useState({
    id: '',
    category: '',
    subcategory: '',
    difficulty: 'medium',
    questionText: '',
    image: '',
    imageAlt: '',
    answers: [
      { text: '', isCorrect: true, explanation: '' },
      { text: '', isCorrect: false, explanation: '' },
      { text: '', isCorrect: false, explanation: '' },
      { text: '', isCorrect: false, explanation: '' }
    ],
    didactic: '',
    educationalObjective: ''
  });

  const selectedArray = React.useMemo(() => Array.from(selectedIds), [selectedIds]);
  const selectedCount = selectedArray.length;
  const customSelectedCount = React.useMemo(
    () => selectedArray.filter((id) => customQuestionIds.has(id)).length,
    [selectedArray, customQuestionIds]
  );
  const hasSelection = selectedCount > 0;
  const hasCustomSelection = customSelectedCount > 0;

  const handleAnswerChange = (index, patch) => {
    setNewQuestion((prev) => {
      const nextAnswers = prev.answers.map((answer, idx) => (idx === index ? { ...answer, ...patch } : answer));
      return { ...prev, answers: nextAnswers };
    });
  };

  const submitQuestion = () => {
    const requiredFields = ['category', 'subcategory', 'questionText'];
    const missing = requiredFields.filter((field) => !newQuestion[field].trim());
    if (missing.length) {
      alert(`Please fill in: ${missing.join(', ')}`);
      return;
    }
    const hasCorrect = newQuestion.answers.some((answer) => answer.isCorrect);
    if (!hasCorrect) {
      alert('At least one answer must be marked correct.');
      return;
    }
    onCreateQuestion(newQuestion);
    setNewQuestion((prev) => ({
      ...prev,
      id: '',
      questionText: '',
      image: '',
      imageAlt: '',
      answers: prev.answers.map((answer, idx) => ({
        ...answer,
        text: '',
        explanation: '',
        isCorrect: idx === 0
      })),
      didactic: '',
      educationalObjective: ''
    }));
  };

  const handleResetSelected = () => {
    if (!hasSelection) return;
    const confirmReset = window.confirm(
      selectedCount === 1
        ? 'Reset history for the selected question?'
        : `Reset history for ${selectedCount} questions?`
    );
    if (!confirmReset) return;
    onBulkReset(selectedArray);
    clearSelection();
  };

  const handleDeleteSelected = () => {
    if (!hasCustomSelection) {
      alert('Select custom questions to delete.');
      return;
    }
    const customIds = selectedArray.filter((id) => customQuestionIds.has(id));
    const confirmDelete = window.confirm(
      customIds.length === 1
        ? 'Delete this custom question? This cannot be undone.'
        : `Delete ${customIds.length} custom questions? This cannot be undone.`
    );
    if (!confirmDelete) return;
    onDeleteCustomQuestions(customIds);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      customIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  const handleDeleteSingle = (id) => {
    if (!customQuestionIds.has(id)) return;
    const confirmDelete = window.confirm('Delete this custom question? This cannot be undone.');
    if (!confirmDelete) return;
    onDeleteCustomQuestions([id]);
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="grid">
      <div className="section-title">
        <div>
          <h1>Content Management</h1>
          <p className="section-subtitle">Curate the question bank, add notes, and share your work.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="button secondary" onClick={onImport}>
            Import Questions
          </button>
          <button className="button secondary" onClick={onExport} disabled={userData?.customQuestions?.length === 0}>
            Export Custom
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Question Browser</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
          Custom image directory:{' '}
          {customImageDirectory ? (
            <code>{customImageDirectory}</code>
          ) : (
            'Set this under Settings to enable custom images for imported/created questions.'
          )}
        </p>
        <div className="form-row">
          <label>
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Keyword or ID" />
          </label>
          <label>
            Category
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">All</option>
              {filters.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            Difficulty
            <select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)}>
              <option value="all">All</option>
              {filters.difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label>
            Source
            <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
              <option value="all">All questions</option>
              <option value="default">Core bank</option>
              <option value="custom">Custom only</option>
            </select>
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          <span style={{ color: 'var(--text-muted)' }}>{selectedCount} selected</span>
          <button className="button secondary" onClick={() => {
            const allIds = filteredQuestions.map((question) => question.id);
            setSelectedIds(new Set(allIds));
          }} disabled={filteredQuestions.length === 0}>
            Select All
          </button>
          <button className="button secondary" onClick={handleResetSelected} disabled={!hasSelection}>
            Reset Selected
          </button>
          <button className="button danger" onClick={handleDeleteSelected} disabled={!hasCustomSelection}>
            Delete Selected
          </button>
          <button className="button secondary" onClick={clearSelection} disabled={!hasSelection}>
            Clear Selection
          </button>
        </div>
        <div className="question-list" style={{ marginTop: 18 }}>
          {filteredQuestions.map((question) => {
            const status = determineStatus(userData?.questionStats?.[question.id]);
            const isCustom = customQuestionIds.has(question.id);
            const isFlagged = flaggedSet.has(question.id);
            const isSelected = selectedIds.has(question.id);
            return (
              <div
                key={question.id}
                style={{
                  borderRadius: 16,
                  border: '1px solid rgba(56, 189, 248, 0.12)',
                  padding: 18,
                  background: 'rgba(16, 26, 43, 0.65)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', minWidth: 0 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(question.id)}
                      style={{ width: 18, height: 18, marginTop: 2 }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>{question.id || 'Custom (pending ID)'}</div>
                      <div style={{ color: 'var(--text-muted)' }}>{question.questionText}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    {isCustom && (
                      <span className="pill" style={{ background: 'rgba(52, 211, 153, 0.18)', color: '#a7f3d0' }}>
                        Custom
                      </span>
                    )}
                    {isFlagged && (
                      <span className="pill" style={{ background: 'rgba(168, 85, 247, 0.18)', color: '#f4e8ff' }}>
                        Flagged
                      </span>
                    )}
                    <span className={`pill ${status}`}>{statusLabels[status]}</span>
                  </div>
                </div>
                <div className="question-meta">
                  <span>{question.category} ▸ {question.subcategory}</span>
                  <span>Difficulty: {question.difficulty?.toUpperCase() || 'N/A'}</span>
                </div>
                {question.image && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Image: <code>{question.image}</code>
                  </div>
                )}
                {question.educationalObjective && (
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    Objective: {question.educationalObjective}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {isCustom && (
                    <button className="button danger" onClick={() => handleDeleteSingle(question.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filteredQuestions.length === 0 && <div className="empty-state">No questions match the current filters.</div>}
        </div>
      </div>

      <div className="card">
        <h2>Create Question</h2>
        <div className="form-row">
          <label>
            Question ID (optional)
            <input
              value={newQuestion.id}
              onChange={(event) => setNewQuestion((prev) => ({ ...prev, id: event.target.value }))}
              placeholder="Auto-generated if empty"
            />
          </label>
          <label>
            Difficulty
            <select
              value={newQuestion.difficulty}
              onChange={(event) => setNewQuestion((prev) => ({ ...prev, difficulty: event.target.value.toLowerCase() }))}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Category
            <input
              value={newQuestion.category}
              onChange={(event) => setNewQuestion((prev) => ({ ...prev, category: event.target.value }))}
            />
          </label>
          <label>
            Subcategory
            <input
              value={newQuestion.subcategory}
              onChange={(event) => setNewQuestion((prev) => ({ ...prev, subcategory: event.target.value }))}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Image filename (optional)
            <input
              value={newQuestion.image}
              onChange={(event) => setNewQuestion((prev) => ({ ...prev, image: event.target.value }))}
              placeholder="e.g., arterial_line_ultrasound.png"
            />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {customImageDirectory
                ? `Place image under ${customImageDirectory}`
                : 'Set a custom image directory under Settings.'}
            </span>
          </label>
          <label>
            Image alt text
            <input
              value={newQuestion.imageAlt}
              onChange={(event) => setNewQuestion((prev) => ({ ...prev, imageAlt: event.target.value }))}
              placeholder="Describe the image for accessibility"
            />
          </label>
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          Stem / Question Text
          <textarea
            value={newQuestion.questionText}
            onChange={(event) => setNewQuestion((prev) => ({ ...prev, questionText: event.target.value }))}
          />
        </label>

        <div>
          <h3 style={{ marginBottom: 10 }}>Answers</h3>
          {newQuestion.answers.map((answer, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 12,
                border: '1px solid rgba(56, 189, 248, 0.12)',
                padding: 14,
                marginBottom: 12,
                background: 'rgba(12, 21, 39, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontWeight: 600, minWidth: 26 }}>{String.fromCharCode(65 + idx)}.</span>
                <input
                  value={answer.text}
                  onChange={(event) => handleAnswerChange(idx, { text: event.target.value })}
                  placeholder="Answer text"
                  style={{ flex: 1 }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={(event) => handleAnswerChange(idx, { isCorrect: event.target.checked })}
                    style={{ width: 18, height: 18 }}
                  />
                  Correct
                </label>
              </div>
              <textarea
                value={answer.explanation}
                onChange={(event) => handleAnswerChange(idx, { explanation: event.target.value })}
                placeholder="Explanation for this answer choice"
              />
            </div>
          ))}
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
          Didactic Summary
          <textarea
            placeholder="Summarize the key teaching points"
            value={newQuestion.didactic}
            onChange={(event) => setNewQuestion((prev) => ({ ...prev, didactic: event.target.value }))}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
          Educational Objective
          <textarea
            placeholder="One sentence objective that captures the learning point"
            value={newQuestion.educationalObjective}
            onChange={(event) => setNewQuestion((prev) => ({ ...prev, educationalObjective: event.target.value }))}
          />
        </label>

        <button className="button" onClick={submitQuestion}>
          Save Question
        </button>
      </div>
    </div>
  );
}
