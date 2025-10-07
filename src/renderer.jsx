import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

const globalCss = `
  :root {
    color-scheme: dark;
    --bg: #0f172a;
    --bg-soft: #16213a;
    --bg-softer: #19253f;
    --border: #1f2a44;
    --primary: #38bdf8;
    --primary-soft: rgba(56, 189, 248, 0.12);
    --secondary: #a855f7;
    --danger: #f87171;
    --success: #34d399;
    --text: #e2e8f0;
    --text-muted: #94a3b8;
    --card-shadow: 0 10px 30px rgba(8, 29, 64, 0.35);
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: var(--bg);
    color: var(--text);
  }

  button {
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
    background: var(--bg-softer);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 8px;
    padding: 10px 12px;
  }

  input:focus, select:focus, textarea:focus {
    outline: 2px solid var(--primary);
    outline-offset: 1px;
  }

  .app-shell {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-header {
    padding: 18px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(8px);
  }

  .brand {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0.4px;
  }

  .nav-buttons {
    display: flex;
    gap: 12px;
  }

  .nav-button {
    padding: 9px 16px;
    border-radius: 999px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
    cursor: pointer;
    transition: background 0.2s, border 0.2s, color 0.2s;
  }

  .nav-button.active {
    background: var(--primary-soft);
    border-color: rgba(56, 189, 248, 0.4);
    color: var(--primary);
  }

  .nav-button:hover {
    border-color: rgba(56, 189, 248, 0.4);
  }

  .main {
    flex: 1;
    overflow: auto;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .grid {
    display: grid;
    gap: 20px;
  }

  .grid.two {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .card {
    background: linear-gradient(145deg, rgba(22, 33, 58, 0.96), rgba(15, 23, 42, 0.92));
    border: 1px solid rgba(56, 189, 248, 0.08);
    border-radius: 18px;
    padding: 22px 24px;
    box-shadow: var(--card-shadow);
  }

  .card h2 {
    margin: 0 0 14px;
    font-size: 19px;
    font-weight: 600;
  }

  .stats-row {
    display: flex;
    gap: 18px;
  }

  .stat-pill {
    padding: 14px 18px;
    background: rgba(148, 163, 184, 0.12);
    border-radius: 16px;
    flex: 1;
  }

  .stat-pill strong {
    display: block;
    font-size: 22px;
    margin-bottom: 4px;
  }

  .button {
    padding: 11px 18px;
    border-radius: 12px;
    border: none;
    background: var(--primary);
    color: #021424;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .button.secondary {
    background: rgba(56, 189, 248, 0.12);
    color: var(--primary);
  }

  .button.danger {
    background: rgba(248, 113, 113, 0.15);
    color: var(--danger);
  }

  .button.flag-button {
    background: rgba(168, 85, 247, 0.15);
    color: var(--secondary);
    border: 1px solid rgba(168, 85, 247, 0.35);
  }

  .button.flag-button.active {
    background: rgba(168, 85, 247, 0.28);
    color: #f5eaff;
    border-color: rgba(168, 85, 247, 0.6);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(56, 189, 248, 0.2);
  }

  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .section-title h1 {
    margin: 0;
    font-size: 28px;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(8, 15, 30, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal {
    background: #0b1529;
    border-radius: 18px;
    border: 1px solid rgba(56, 189, 248, 0.25);
    box-shadow: 0 24px 60px rgba(1, 9, 18, 0.65);
    padding: 26px;
    width: min(640px, 96vw);
    max-height: calc(100vh - 80px);
    overflow-y: auto;
  }

  .form-row {
    display: flex;
    gap: 12px;
    margin-bottom: 14px;
  }

  .form-row label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    font-size: 14px;
    color: var(--text-muted);
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  .loading {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: var(--text-muted);
  }

  .session-container {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 20px;
  }

  .session-question {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .answers {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .answer-option {
    border-radius: 12px;
    border: 1px solid var(--border);
    padding: 16px;
    background: rgba(23, 35, 58, 0.6);
    cursor: pointer;
    transition: border 0.2s, transform 0.1s;
  }

  .answer-option.selected {
    border-color: rgba(56, 189, 248, 0.8);
    background: rgba(56, 189, 248, 0.08);
  }

  .answer-option.correct {
    border-color: rgba(52, 211, 153, 0.65);
    background: rgba(52, 211, 153, 0.12);
  }

  .answer-option.incorrect {
    border-color: rgba(248, 113, 113, 0.45);
    background: rgba(248, 113, 113, 0.1);
  }

  .answer-option:hover {
    transform: translateY(-1px);
  }

  .explanation {
    margin-top: 12px;
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.5;
  }

  .question-palette {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 8px;
  }

  .palette-item {
    padding: 12px 0;
    border-radius: 12px;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid var(--border);
    text-align: center;
    font-weight: 600;
    cursor: pointer;
    font-size: 13px;
  }

  .palette-item.flagged::after {
    content: "*";
    display: block;
    font-size: 12px;
    color: var(--secondary);
    margin-top: 4px;
  }

  .palette-item.current {
    border-color: rgba(56, 189, 248, 0.9);
  }

  .palette-item.correct {
    background: rgba(52, 211, 153, 0.18);
    border-color: rgba(52, 211, 153, 0.6);
  }

  .palette-item.incorrect {
    background: rgba(248, 113, 113, 0.15);
    border-color: rgba(248, 113, 113, 0.45);
  }

  .palette-item.answered {
    background: rgba(148, 163, 184, 0.16);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 10px 12px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.15);
    text-align: left;
    font-size: 14px;
  }

  th {
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 12px;
  }

  .pill {
    display: inline-flex;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    letter-spacing: 0.02em;
    font-weight: 600;
  }

  .pill.correct {
    background: rgba(52, 211, 153, 0.16);
    color: var(--success);
  }

  .pill.incorrect {
    background: rgba(248, 113, 113, 0.18);
    color: #fecaca;
  }

  .pill.unanswered {
    background: rgba(148, 163, 184, 0.16);
    color: var(--text-muted);
  }

  .chart {
    position: relative;
    min-height: 200px;
  }

  .bar-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .bar-label {
    width: 140px;
    color: var(--text-muted);
    font-size: 14px;
  }

  .bar-track {
    flex: 1;
    height: 14px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.14);
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.8));
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag {
    background: rgba(56, 189, 248, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.35);
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 12px;
  }

  .section-subtitle {
    margin: 0;
    color: var(--text-muted);
    font-size: 16px;
    font-weight: 400;
  }

  .dual-column {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .question-meta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 13px;
    color: var(--text-muted);
  }

  .empty-state {
    padding: 40px;
    text-align: center;
    color: var(--text-muted);
    border: 1px dashed rgba(148, 163, 184, 0.3);
    border-radius: 16px;
  }

  .question-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-height: 540px;
    overflow-y: auto;
    padding-right: 4px;
  }

  .session-item {
    border: 1px solid rgba(56, 189, 248, 0.12);
    border-radius: 16px;
    padding: 16px;
    background: rgba(15, 23, 42, 0.55);
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: border 0.2s ease, background 0.2s ease;
  }

  .session-item.active {
    border-color: rgba(56, 189, 248, 0.45);
    background: rgba(15, 31, 56, 0.75);
  }

  .session-item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
  }

  .question-list::-webkit-scrollbar {
    width: 6px;
  }

  .question-list::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.3);
    border-radius: 999px;
  }

  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: rgba(8, 13, 28, 0.95);
    border: 1px solid rgba(56, 189, 248, 0.35);
    box-shadow: 0 20px 45px rgba(4, 12, 24, 0.6);
    border-radius: 14px;
    padding: 14px 22px;
    z-index: 1200;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .toast.success {
    border-color: rgba(52, 211, 153, 0.45);
  }

  .toast.error {
    border-color: rgba(248, 113, 113, 0.45);
  }

  .chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .chip {
    border-radius: 999px;
    border: 1px solid rgba(56, 189, 248, 0.4);
    color: var(--primary);
    padding: 6px 12px;
    font-size: 12px;
  }

  .divider {
    height: 1px;
    background: rgba(148, 163, 184, 0.18);
    margin: 20px 0;
  }
`;

const styleTag = document.createElement('style');
styleTag.textContent = globalCss;
document.head.appendChild(styleTag);

const DEFAULT_SESSION_CONFIG = {
  mode: 'Tutor',
  numQuestions: 10,
  randomize: true,
  selectedCategories: [],
  selectedSubcategories: [],
  difficulty: 'all',
  statusFilter: 'unanswered',
  includeCustom: true,
  onlyCustom: false,
  flagFilter: 'any'
};

const statusLabels = {
  correct: 'Correct',
  incorrect: 'Incorrect',
  unanswered: 'Unanswered'
};

const difficultyOrder = ['easy', 'medium', 'hard'];

function clone(data) {
  return data ? JSON.parse(JSON.stringify(data)) : data;
}

function normalizeUserData(data) {
  const normalized = data ? { ...data } : {};
  if (!normalized.userSettings) normalized.userSettings = { theme: 'system' };
  if (!Array.isArray(normalized.customQuestions)) normalized.customQuestions = [];
  if (!normalized.questionStats) normalized.questionStats = {};
  if (!Array.isArray(normalized.sessionHistory)) normalized.sessionHistory = [];
  if (!normalized.notes) normalized.notes = {};
  if (!Array.isArray(normalized.flaggedQuestionIds)) normalized.flaggedQuestionIds = [];
  return normalized;
}

function determineStatus(statsEntry) {
  if (!statsEntry) return 'unanswered';
  return statsEntry.status || 'unanswered';
}

function formatDate(timestamp) {
  if (!timestamp) return '—';
  const dt = new Date(timestamp);
  if (Number.isNaN(dt.valueOf())) return '—';
  return dt.toLocaleString();
}

function computeSummary(allQuestions, userData) {
  if (!userData) {
    return {
      total: allQuestions.length,
      correct: 0,
      incorrect: 0,
      unanswered: allQuestions.length
    };
  }

  let correct = 0;
  let incorrect = 0;
  allQuestions.forEach((q) => {
    const status = determineStatus(userData.questionStats[q.id]);
    if (status === 'correct') correct += 1;
    if (status === 'incorrect') incorrect += 1;
  });

  const total = allQuestions.length;
  const unanswered = Math.max(0, total - correct - incorrect);
  return { total, correct, incorrect, unanswered };
}

function computeCategoryPerformance(allQuestions, userData) {
  const byCategory = new Map();
  allQuestions.forEach((question) => {
    const status = determineStatus(userData?.questionStats[question.id]);
    if (!byCategory.has(question.category)) {
      byCategory.set(question.category, { total: 0, correct: 0 });
    }
    const entry = byCategory.get(question.category);
    entry.total += 1;
    if (status === 'correct') entry.correct += 1;
  });

  return Array.from(byCategory.entries()).map(([category, { total, correct }]) => ({
    category,
    total,
    correct,
    ratio: total === 0 ? 0 : Math.round((correct / total) * 100)
  }));
}

function collectFilters(allQuestions) {
  const categories = new Set();
  const subcategories = new Set();
  const difficulties = new Set();

  allQuestions.forEach((q) => {
    if (q.category) categories.add(q.category);
    if (q.subcategory) subcategories.add(q.subcategory);
    if (q.difficulty) difficulties.add(q.difficulty.toLowerCase());
  });

  return {
    categories: Array.from(categories).sort(),
    subcategories: Array.from(subcategories).sort(),
    difficulties: Array.from(difficulties).sort((a, b) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b))
  };
}

function scoreAnswer(question, answerIndex) {
  const correctIndex = question.answers.findIndex((answer) => answer.isCorrect);
  return {
    isCorrect: correctIndex === answerIndex,
    correctIndex
  };
}

function attemptTemplate(result, answerIndex) {
  return {
    timestamp: new Date().toISOString(),
    result: result ? 'correct' : 'incorrect',
    answerIndex
  };
}

function prepareAttemptRecord(questionId, draft, attempt) {
  if (!draft.questionStats[questionId]) {
    draft.questionStats[questionId] = {
      status: 'unanswered',
      attempts: []
    };
  }
  const entry = draft.questionStats[questionId];
  entry.attempts.push(attempt);
  entry.status = attempt.result;
  if (entry.attempts.length > 250) {
    entry.attempts = entry.attempts.slice(-250);
  }
}

function evaluateSessionResults(session, questionsMap) {
  return session.questionIds.map((id) => {
    const question = questionsMap.get(id);
    const userAnswer = session.userAnswers[id];
    const { correctIndex } = scoreAnswer(question, userAnswer?.choiceIndex ?? -1);
    return {
      id,
      choiceIndex: userAnswer?.choiceIndex ?? null,
      correctIndex,
      isCorrect: !!userAnswer?.isCorrect
    };
  });
}

function derivePaletteClass(entry, current, session) {
  let className = 'palette-item';
  if (entry === current) className += ' current';
  const answer = session.userAnswers[entry];
  if (!answer) return className;
  if (session.mode === 'Exam' && session.status !== 'completed') {
    return className;
  }
  if (answer.isCorrect) return `${className} correct`;
  if (answer.choiceIndex != null) return `${className} incorrect`;
  return `${className} answered`;
}

function PieChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return <div className="empty-state">No answers yet. Start a session to see statistics.</div>;
  }
  let currentAngle = 0;
  const segments = data
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const angle = (segment.value / total) * 360;
      const start = currentAngle;
      currentAngle += angle;
      return `${segment.color} ${start}deg ${start + angle}deg`;
    })
    .join(', ');

  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: `conic-gradient(${segments})`,
          border: '12px solid rgba(15, 23, 42, 0.85)',
          boxShadow: '0 12px 30px rgba(8, 20, 33, 0.5)'
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((segment) => (
          <div key={segment.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: '4px',
                background: segment.color
              }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>{segment.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{segment.value} questions</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryBars({ breakdown }) {
  if (!breakdown.length) {
    return <div className="empty-state">No questions available.</div>;
  }

  return (
    <div className="chart">
      {breakdown.map((row) => (
        <div key={row.category} className="bar-row">
          <div className="bar-label">{row.category}</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${row.ratio}%` }} />
          </div>
          <div style={{ width: 40, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.ratio}%</div>
        </div>
      ))}
    </div>
  );
}

function Toast({ type, message }) {
  if (!message) return null;
  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
    </div>
  );
}

function Dashboard({
  summary,
  breakdown,
  onStartSession,
  onReviewIncorrect,
  onReviewFlagged,
  onResumeSession,
  hasActiveSession,
  hasFlagged,
  onOpenConfig
}) {
  return (
    <div className="grid">
      <div className="section-title">
        <div>
          <h1>Welcome back</h1>
          <p className="section-subtitle">Track your mastery and jump into the next study block.</p>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <h2>Overall Performance</h2>
          <PieChart
            data={[
              { label: 'Correct', value: summary.correct, color: 'rgba(52, 211, 153, 0.9)' },
              { label: 'Incorrect', value: summary.incorrect, color: 'rgba(248, 113, 113, 0.8)' },
              { label: 'Unanswered', value: summary.unanswered, color: 'rgba(148, 163, 184, 0.55)' }
            ]}
          />
        </div>
        <div className="card">
          <h2>Category Breakdown</h2>
          <CategoryBars breakdown={breakdown} />
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div className="stats-row">
          <div className="stat-pill">
            <strong>{summary.total}</strong>
            Total questions
          </div>
          <div className="stat-pill">
            <strong>{summary.correct}</strong>
            Correct answers
          </div>
          <div className="stat-pill">
            <strong>{summary.incorrect}</strong>
            Incorrect answers
          </div>
          <div className="stat-pill">
            <strong>{summary.unanswered}</strong>
            Awaiting review
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
          <button className="button" onClick={onOpenConfig}>
            Start New Session
          </button>
          <button className="button secondary" onClick={onReviewIncorrect}>
            Review Incorrect Questions
          </button>
          <button className="button secondary" onClick={onReviewFlagged} disabled={!hasFlagged}>
            Review Flagged Questions
          </button>
          <button className="button secondary" onClick={onResumeSession} disabled={!hasActiveSession}>
            Resume Last Session
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionView({
  session,
  question,
  questionIndex,
  totalQuestions,
  onSelectAnswer,
  onNavigate,
  onFinish,
  onExit,
  onToggleFlag,
  isFlagged,
  flaggedSet
}) {
  if (!session || !question) {
    return <div className="empty-state">No active session. Start a new study session from the dashboard.</div>;
  }

  const currentAnswer = session.userAnswers[question.id] || null;
  const { correctIndex } = scoreAnswer(question, currentAnswer?.choiceIndex ?? -1);
  const showFeedback = session.mode === 'Tutor'
    ? currentAnswer?.choiceIndex != null
    : session.status === 'completed';
  const imageSrc = question.image ? `../data/images/${question.image}` : null;

  return (
    <div className="session-container">
      <div className="card session-question">
        <div className="question-meta">
          <span className="pill">{session.mode} mode</span>
          <span>Question {questionIndex + 1} of {totalQuestions}</span>
          {question.difficulty && <span className="pill">{question.difficulty.toUpperCase()}</span>}
          <span>{question.category} ▸ {question.subcategory}</span>
          {isFlagged && (
            <span
              className="pill"
              style={{ background: 'rgba(168, 85, 247, 0.18)', color: '#f4e8ff' }}
            >
              Flagged
            </span>
          )}
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className={`button flag-button ${isFlagged ? 'active' : ''}`}
            onClick={() => onToggleFlag(question.id)}
          >
            {isFlagged ? 'Remove Flag' : 'Flag Question'}
          </button>
        </div>
        {session.mode === 'Exam' && session.status === 'active' && (
          <div style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 13 }}>
            Answers save automatically; explanations unlock when you end the session.
          </div>
        )}
        <div>
          <h2 style={{ marginBottom: 10 }}>{question.questionText}</h2>
          {question.stem && <p>{question.stem}</p>}
        </div>
        {imageSrc && (
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.18)', maxWidth: 480 }}>
            <img src={imageSrc} alt={question.imageAlt || 'Question illustration'} style={{ display: 'block', width: '100%' }} />
          </div>
        )}
        <div className="answers">
          {question.answers.map((answer, index) => {
            const isSelected = currentAnswer?.choiceIndex === index;
            const isCorrectChoice = showFeedback && index === correctIndex;
            let className = 'answer-option';
            if (isSelected) className += ' selected';
            if (showFeedback && isCorrectChoice) className += ' correct';
            if (showFeedback && isSelected && !isCorrectChoice) className += ' incorrect';
            return (
              <div
                key={answer.text}
                className={className}
                onClick={() => onSelectAnswer(index)}
                role="button"
              >
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{String.fromCharCode(65 + index)}. {answer.text}</div>
                {showFeedback && (
                  <div className="explanation">{answer.explanation}</div>
                )}
              </div>
            );
          })}
        </div>
        {showFeedback && question.didactic && (
          <div className="card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
            <h3 style={{ marginTop: 0 }}>Didactic Summary</h3>
            <p style={{ whiteSpace: 'pre-line', color: 'var(--text-muted)', lineHeight: 1.6 }}>{question.didactic}</p>
          </div>
        )}
        {showFeedback && question.educationalObjective && (
          <div className="card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
            <h3 style={{ marginTop: 0 }}>Educational Objective</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{question.educationalObjective}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="button secondary" onClick={() => onNavigate(questionIndex - 1)} disabled={questionIndex === 0}>
            Previous
          </button>
          <button className="button secondary" onClick={() => onNavigate(questionIndex + 1)} disabled={questionIndex === totalQuestions - 1}>
            Next
          </button>
          <button className="button danger" onClick={onFinish}>
            End Session
          </button>
          <button className="button secondary" onClick={onExit}>
            Exit to Dashboard
          </button>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: 10 }}>Question Palette</h3>
        <div className="question-palette">
          {session.questionIds.map((id, idx) => (
            <div
              key={id}
              className={`${derivePaletteClass(id, question.id, session)}${flaggedSet?.has(id) ? ' flagged' : ''}`}
              onClick={() => onNavigate(idx)}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HistoryView({
  questionsMap,
  userData,
  onResetAll,
  selectedSessionId,
  onSelectSession,
  onDeleteSession
}) {
  const attempts = useMemo(() => {
    if (!userData?.questionStats) return [];
    const rows = [];
    Object.entries(userData.questionStats).forEach(([id, stats]) => {
      stats.attempts?.forEach((attempt, idx) => {
        rows.push({
          id,
          attempt,
          index: idx + 1
        });
      });
    });
    return rows.sort((a, b) => new Date(b.attempt.timestamp) - new Date(a.attempt.timestamp));
  }, [userData]);

  const sessions = userData?.sessionHistory || [];
  const selectedSession = sessions.find((session) => session.id === selectedSessionId) || null;

  return (
    <div className="grid">
      <div className="section-title">
        <div>
          <h1>History</h1>
          <p className="section-subtitle">Review performance trends and revisit past sessions.</p>
        </div>
        <button className="button danger" onClick={onResetAll}>
          Reset All Progress
        </button>
      </div>

      <div className="card">
        <h2>Question Attempts</h2>
        {attempts.length === 0 ? (
          <div className="empty-state">No recorded attempts yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Attempt #</th>
                <th>Result</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((row) => {
                const question = questionsMap.get(row.id);
                const resultClass = row.attempt.result === 'correct' ? 'pill correct' : 'pill incorrect';
                return (
                  <tr key={`${row.id}-${row.index}-${row.attempt.timestamp}`}>
                    <td style={{ maxWidth: 360 }}>
                      <div style={{ fontWeight: 600 }}>{row.id}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        {(question && question.questionText) || 'Deleted question'}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {question ? `${question.category} ▸ ${question.subcategory}` : '—'}
                    </td>
                    <td>{row.index}</td>
                    <td>
                      <span className={resultClass}>{row.attempt.result.toUpperCase()}</span>
                    </td>
                    <td>{formatDate(row.attempt.timestamp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid two">
        <div className="card">
          <h2>Session History</h2>
          {sessions.length === 0 ? (
            <div className="empty-state">Complete a session to populate history.</div>
          ) : (
            <div className="question-list">
              {sessions.map((session) => {
                const totalQuestions = session.questionIds?.length || session.total || 0;
                const answers = session.userAnswers || {};
                const answeredCount = Object.values(answers).filter((answer) => answer && answer.choiceIndex != null).length;
                const correctCount =
                  typeof session.correct === 'number'
                    ? session.correct
                    : Object.values(answers).filter((answer) => answer && answer.isCorrect).length;
                const accuracy = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;
                const isActive = selectedSessionId === session.id;
                return (
                  <div key={session.id} className={`session-item${isActive ? ' active' : ''}`}>
                    <div className="session-item-meta">
                      <div>
                        <div style={{ fontWeight: 600 }}>{session.mode} · {totalQuestions} questions</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                          {formatDate(session.completedAt || session.createdAt)}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                          {totalQuestions ? `${correctCount}/${totalQuestions} correct` : 'No questions recorded'}
                        </div>
                      </div>
                      <span
                        className="pill"
                        style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)' }}
                      >
                        {accuracy}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button className="button secondary" onClick={() => onSelectSession(session.id)}>
                        {isActive ? 'Close Review' : 'Review'}
                      </button>
                      <button className="button danger" onClick={() => onDeleteSession(session.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <SessionReviewCard session={selectedSession} questionsMap={questionsMap} />
      </div>
    </div>
  );
}

function SessionReviewCard({ session, questionsMap }) {
  if (!session) {
    return (
      <div className="card">
        <h2>Session Review</h2>
        <div className="empty-state">Select a session to review detailed results.</div>
      </div>
    );
  }

  const questionIds = session.questionIds || [];
  const answers = session.userAnswers || {};
  const totalQuestions = questionIds.length || session.total || 0;
  const answeredCount = Object.values(answers).filter((answer) => answer && answer.choiceIndex != null).length;
  const correctCount =
    typeof session.correct === 'number'
      ? session.correct
      : Object.values(answers).filter((answer) => answer && answer.isCorrect).length;
  const incorrectCount = Math.max(0, answeredCount - correctCount);
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  return (
    <div className="card">
      <div className="section-title">
        <div>
          <h2>Session Review</h2>
          <p className="section-subtitle">
            {formatDate(session.completedAt || session.createdAt)} · {session.mode} mode
          </p>
        </div>
      </div>
      <div className="stats-row" style={{ marginBottom: 14 }}>
        <div className="stat-pill">
          <strong>{correctCount}</strong>
          Correct
        </div>
        <div className="stat-pill">
          <strong>{incorrectCount}</strong>
          Incorrect
        </div>
        <div className="stat-pill">
          <strong>{unansweredCount}</strong>
          Unanswered
        </div>
      </div>
      <div className="question-list">
        {questionIds.length === 0 && <div className="empty-state">No questions recorded for this session.</div>}
        {questionIds.map((id, index) => {
          const question = questionsMap.get(id);
          const userAnswer = answers[id];
          const statusKey = userAnswer?.choiceIndex == null ? 'unanswered' : userAnswer?.isCorrect ? 'correct' : 'incorrect';
          const correctIndex =
            userAnswer?.correctIndex != null
              ? userAnswer.correctIndex
              : question
                ? scoreAnswer(question, userAnswer?.choiceIndex ?? -1).correctIndex
                : -1;

          if (!question) {
            return (
              <div
                key={`${id}-${index}`}
                style={{
                  borderRadius: 16,
                  border: '1px solid rgba(56, 189, 248, 0.12)',
                  padding: 18,
                  background: 'rgba(16, 26, 43, 0.65)'
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Question no longer available</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>ID: {id}</div>
              </div>
            );
          }

          return (
            <div
              key={`${id}-${index}`}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Question {index + 1}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{question.questionText}</div>
                </div>
                <span className={`pill ${statusKey}`}>{statusLabels[statusKey]}</span>
              </div>
              {question.image && (
                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.18)' }}>
                  <img
                    src={`../data/images/${question.image}`}
                    alt={question.imageAlt || 'Question illustration'}
                    style={{ display: 'block', width: '100%' }}
                  />
                </div>
              )}
              <div className="answers">
                {question.answers.map((answer, answerIndex) => {
                  const isSelected = userAnswer?.choiceIndex === answerIndex;
                  const isCorrectChoice = answerIndex === correctIndex;
                  let className = 'answer-option';
                  if (isSelected) className += ' selected';
                  if (isCorrectChoice) className += ' correct';
                  else if (isSelected) className += ' incorrect';
                  return (
                    <div key={answer.text} className={className} style={{ cursor: 'default' }}>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>
                        {String.fromCharCode(65 + answerIndex)}. {answer.text}
                      </div>
                      <div className="explanation">{answer.explanation}</div>
                    </div>
                  );
                })}
              </div>
              {question.didactic && (
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: 12, padding: 14 }}>
                  <h3 style={{ marginTop: 0 }}>Didactic Summary</h3>
                  <p style={{ whiteSpace: 'pre-line', color: 'var(--text-muted)', lineHeight: 1.6 }}>{question.didactic}</p>
                </div>
              )}
              {question.educationalObjective && (
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: 12, padding: 14 }}>
                  <h3 style={{ marginTop: 0 }}>Educational Objective</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{question.educationalObjective}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContentView({
  allQuestions,
  userData,
  filters,
  customQuestionIds,
  flaggedSet,
  onCreateQuestion,
  onImport,
  onExport,
  onResetQuestion,
  onBulkReset,
  onDeleteCustomQuestions,
  onToggleFlag
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  useEffect(() => {
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

  const selectedArray = useMemo(() => Array.from(selectedIds), [selectedIds]);
  const selectedCount = selectedArray.length;
  const customSelectedCount = useMemo(
    () => selectedArray.filter((id) => customQuestionIds.has(id)).length,
    [selectedArray, customQuestionIds]
  );
  const hasSelection = selectedCount > 0;
  const hasCustomSelection = customSelectedCount > 0;

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

  const filteredQuestions = useMemo(() => {
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

  const [newQuestion, setNewQuestion] = useState({
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
            const status = determineStatus(userData?.questionStats[question.id]);
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
                  <button className="button secondary" onClick={() => onResetQuestion(question.id)}>
                    Reset History
                  </button>
                  <button
                    className={`button flag-button ${isFlagged ? 'active' : ''}`}
                    onClick={() => onToggleFlag(question.id)}
                  >
                    {isFlagged ? 'Remove Flag' : 'Flag'}
                  </button>
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
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Place image under <code>data/images</code>.</span>
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

function SettingsView({ paths, onChooseLocation, onUseDefault }) {
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

function SessionConfigurator({ filters, config, onUpdate, onCancel, onCreate }) {
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

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baseQuestions, setBaseQuestions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [sessionConfig, setSessionConfig] = useState({ ...DEFAULT_SESSION_CONFIG });
  const [toast, setToast] = useState({ type: 'success', message: '' });
  const [storagePaths, setStoragePaths] = useState({
    currentUserDataPath: '',
    defaultUserDataPath: ''
  });
  const [selectedHistorySessionId, setSelectedHistorySessionId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        const payload = await window.gasbank.loadData();
        if (cancelled) return;
        setBaseQuestions(payload.questions || []);
        setUserData(normalizeUserData(payload.userData || {}));
        if (payload.paths) {
          setStoragePaths(payload.paths);
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const allQuestions = useMemo(() => {
    if (!userData) return baseQuestions;
    const custom = userData.customQuestions || [];
    return [...baseQuestions, ...custom];
  }, [baseQuestions, userData]);

  const filters = useMemo(() => collectFilters(allQuestions), [allQuestions]);

  const summary = useMemo(() => computeSummary(allQuestions, userData), [allQuestions, userData]);

  const breakdown = useMemo(() => computeCategoryPerformance(allQuestions, userData), [allQuestions, userData]);

  const questionsMap = useMemo(() => {
    const map = new Map();
    allQuestions.forEach((question) => map.set(question.id, question));
    return map;
  }, [allQuestions]);

  const customQuestionIds = useMemo(() => {
    const ids = new Set();
    (userData?.customQuestions || []).forEach((question) => {
      if (question?.id) {
        ids.add(question.id);
      }
    });
    return ids;
  }, [userData]);

  const flaggedSet = useMemo(() => new Set(userData?.flaggedQuestionIds || []), [userData]);
  const flaggedCount = flaggedSet.size;

  useEffect(() => {
    if (!selectedHistorySessionId) return;
    const exists = userData?.sessionHistory?.some((session) => session.id === selectedHistorySessionId);
    if (!exists) {
      setSelectedHistorySessionId(null);
    }
  }, [selectedHistorySessionId, userData]);

  const activeSession = userData?.activeSession ?? null;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev.message === message ? { type, message: '' } : prev));
    }, 3200);
  };

  const refreshStoragePaths = async () => {
    try {
      const nextPaths = await window.gasbank.getStoragePaths();
      if (nextPaths) {
        setStoragePaths(nextPaths);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to read storage paths.');
    }
  };

  const updateUserData = (mutator) => {
    setUserData((prev) => {
      if (!prev) return prev;
      const draft = normalizeUserData(clone(prev));
      mutator(draft);
      if (Array.isArray(draft.flaggedQuestionIds)) {
        draft.flaggedQuestionIds = Array.from(new Set(draft.flaggedQuestionIds));
      }
      window.gasbank.saveUserData(draft).catch((err) => {
        console.error(err);
        showToast('error', 'Failed to save changes locally.');
      });
      return draft;
    });
  };

  const handleChangeStorageLocation = async () => {
    const selection = await window.gasbank.chooseUserDataDirectory();
    if (!selection || selection.canceled) return;
    try {
      const result = await window.gasbank.updateUserDataPath({ directory: selection.directory });
      if (!result?.success) {
        showToast('error', result?.message || 'Unable to update location.');
        return;
      }
      if (result.userData) {
        setUserData(normalizeUserData(result.userData));
      }
      if (result.paths) {
        setStoragePaths(result.paths);
      } else {
        await refreshStoragePaths();
      }
      showToast('success', 'Storage location updated.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Could not change storage location.');
    }
  };

  const handleUseDefaultStorage = async () => {
    if (storagePaths.currentUserDataPath === storagePaths.defaultUserDataPath) {
      showToast('success', 'Already using the default storage location.');
      return;
    }
    try {
      const result = await window.gasbank.updateUserDataPath({ useDefault: true });
      if (!result?.success) {
        showToast('error', result?.message || 'Unable to update location.');
        return;
      }
      if (result.userData) {
        setUserData(normalizeUserData(result.userData));
      }
      if (result.paths) {
        setStoragePaths(result.paths);
      } else {
        await refreshStoragePaths();
      }
      showToast('success', 'Now using default storage location.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Could not switch to default storage.');
    }
  };

  const startSessionFromConfig = (config, preselectedIds = null) => {
    const pool = allQuestions.filter((question) => {
      if (!config.includeCustom && userData?.customQuestions?.some((custom) => custom.id === question.id)) {
        return false;
      }
      if (config.onlyCustom && !userData?.customQuestions?.some((custom) => custom.id === question.id)) {
        return false;
      }
      if (config.difficulty !== 'all' && question.difficulty?.toLowerCase() !== config.difficulty) {
        return false;
      }
      if (config.selectedCategories.length && !config.selectedCategories.includes(question.category)) {
        return false;
      }
      if (config.selectedSubcategories.length && !config.selectedSubcategories.includes(question.subcategory)) {
        return false;
      }
      if (config.statusFilter === 'unanswered' && determineStatus(userData?.questionStats[question.id]) !== 'unanswered') {
        return false;
      }
      if (config.statusFilter === 'incorrect' && determineStatus(userData?.questionStats[question.id]) !== 'incorrect') {
        return false;
      }
      const isFlagged = flaggedSet.has(question.id);
      if (config.flagFilter === 'flagged' && !isFlagged) {
        return false;
      }
      if (config.flagFilter === 'excludeFlagged' && isFlagged) {
        return false;
      }
      return true;
    });

    const questionIds = preselectedIds || pool.map((question) => question.id);
    if (!questionIds.length) {
      showToast('error', 'No questions match this configuration.');
      return;
    }

    const ids = [...questionIds];
    if (config.randomize) {
      for (let i = ids.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
    }

    const trimmed = ids.slice(0, config.numQuestions);
    const session = {
      id: `session-${Date.now()}`,
      createdAt: new Date().toISOString(),
      questionIds: trimmed,
      currentIndex: 0,
      userAnswers: {},
      mode: config.mode,
      status: 'active',
      config
    };

    updateUserData((draft) => {
      draft.activeSession = session;
    });
    setActiveView('session');
    showToast('success', `Session launched with ${trimmed.length} questions.`);
  };

  const handleSelectAnswer = (index) => {
    if (!activeSession) return;
    if (activeSession.mode === 'Exam' && activeSession.status === 'completed') return;
    const questionId = activeSession.questionIds[activeSession.currentIndex];
    const question = questionsMap.get(questionId);
    if (!question) return;
    const currentAnswer = activeSession.userAnswers[questionId];
    if (activeSession.mode === 'Tutor' && currentAnswer?.choiceIndex != null) {
      return;
    }
    const { isCorrect, correctIndex } = scoreAnswer(question, index);
    const attempt = attemptTemplate(isCorrect, index);
    updateUserData((draft) => {
      if (!draft.activeSession) return;
      draft.activeSession.userAnswers[questionId] = {
        choiceIndex: index,
        isCorrect,
        correctIndex
      };
      if (draft.activeSession.mode === 'Tutor' && (currentAnswer?.choiceIndex == null)) {
        prepareAttemptRecord(questionId, draft, attempt);
      }
    });
    if (activeSession.mode === 'Tutor' && currentAnswer?.choiceIndex == null) {
      showToast(isCorrect ? 'success' : 'error', isCorrect ? 'Correct!' : 'Marked for review.');
    }
  };

  const handleNavigate = (index) => {
    if (!activeSession) return;
    updateUserData((draft) => {
      if (!draft.activeSession) return;
      draft.activeSession.currentIndex = Math.max(0, Math.min(index, draft.activeSession.questionIds.length - 1));
    });
  };

  const handleFinishSession = () => {
    if (!activeSession) return;
    if (activeSession.status === 'completed') {
      updateUserData((draft) => {
        draft.activeSession = null;
      });
      setActiveView('dashboard');
      showToast('success', 'Session archived.');
      return;
    }

    const answersSnapshot = clone(activeSession.userAnswers || {});
    const questionIdsSnapshot = [...activeSession.questionIds];
    const sessionSummary = {
      ...activeSession,
      completedAt: new Date().toISOString(),
      status: 'completed',
      userAnswers: answersSnapshot,
      questionIds: questionIdsSnapshot
    };
    const updates = evaluateSessionResults(sessionSummary, questionsMap);
    const answeredCount = Object.values(answersSnapshot).filter((answer) => answer && answer.choiceIndex != null).length;
    const correctCount = updates.filter((entry) => entry.isCorrect).length;
    const sessionRecord = {
      id: sessionSummary.id,
      createdAt: sessionSummary.createdAt,
      completedAt: sessionSummary.completedAt,
      mode: sessionSummary.mode,
      questionIds: [...questionIdsSnapshot],
      userAnswers: clone(answersSnapshot),
      total: questionIdsSnapshot.length,
      correct: correctCount,
      answered: answeredCount,
      config: sessionSummary.config,
      status: 'completed'
    };

    updateUserData((draft) => {
      if (!draft.activeSession) return;
      draft.sessionHistory = draft.sessionHistory || [];
      draft.sessionHistory.unshift(sessionRecord);
      if (draft.sessionHistory.length > 50) {
        draft.sessionHistory = draft.sessionHistory.slice(0, 50);
      }

      updates.forEach((entry) => {
        const attempt = attemptTemplate(entry.isCorrect, entry.choiceIndex ?? -1);
        prepareAttemptRecord(entry.id, draft, attempt);
      });

      draft.activeSession = sessionSummary;
    });
    showToast('success', 'Session completed. Review your answers.');
  };

  const handleExitSession = () => {
    setActiveView('dashboard');
  };

  const handleResumeSession = () => {
    if (!userData?.activeSession) {
      showToast('error', 'No active session to resume.');
      return;
    }
    setActiveView('session');
  };

  const handleReviewIncorrect = () => {
    const incorrectIds = allQuestions
      .filter((question) => determineStatus(userData?.questionStats[question.id]) === 'incorrect')
      .map((question) => question.id);
    if (!incorrectIds.length) {
      showToast('success', 'Fantastic! No incorrect questions remain.');
      return;
    }
    const config = { ...DEFAULT_SESSION_CONFIG, statusFilter: 'incorrect', numQuestions: incorrectIds.length };
    startSessionFromConfig(config, incorrectIds);
  };

  const handleReviewFlagged = () => {
    const flaggedIds = userData?.flaggedQuestionIds?.filter((id) => questionsMap.has(id)) || [];
    if (!flaggedIds.length) {
      showToast('error', 'No flagged questions to review.');
      return;
    }
    const config = {
      ...DEFAULT_SESSION_CONFIG,
      statusFilter: 'all',
      flagFilter: 'flagged',
      numQuestions: flaggedIds.length
    };
    startSessionFromConfig(config, flaggedIds);
  };

  const handleResetAll = async () => {
    const confirmReset = window.confirm('Reset all progress? This cannot be undone.');
    if (!confirmReset) return;
    try {
      const result = await window.gasbank.resetAllProgress();
      setUserData(normalizeUserData(result.userData));
      showToast('success', 'Progress reset.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to reset progress.');
    }
  };

  const handleResetQuestion = (id) => {
    updateUserData((draft) => {
      if (draft.questionStats[id]) {
        delete draft.questionStats[id];
      }
    });
    showToast('success', `History cleared for ${id}.`);
  };

  const handleBulkResetQuestions = (ids) => {
    if (!ids || !ids.length) return;
    const unique = Array.from(new Set(ids));
    updateUserData((draft) => {
      unique.forEach((id) => {
        if (draft.questionStats[id]) {
          delete draft.questionStats[id];
        }
      });
    });
    showToast('success', unique.length === 1 ? 'History cleared for 1 question.' : `History cleared for ${unique.length} questions.`);
  };

  const handleDeleteCustomQuestions = (ids) => {
    if (!ids || !ids.length) return;
    const unique = Array.from(new Set(ids));
    const toDelete = new Set(unique);
    updateUserData((draft) => {
      draft.customQuestions = (draft.customQuestions || []).filter((question) => !toDelete.has(question.id));
      unique.forEach((id) => {
        if (draft.questionStats[id]) {
          delete draft.questionStats[id];
        }
      });
      if (Array.isArray(draft.flaggedQuestionIds)) {
        draft.flaggedQuestionIds = draft.flaggedQuestionIds.filter((id) => !toDelete.has(id));
      }
      if (draft.activeSession) {
        draft.activeSession.questionIds = draft.activeSession.questionIds.filter((id) => !toDelete.has(id));
        if (draft.activeSession.userAnswers) {
          unique.forEach((id) => {
            delete draft.activeSession.userAnswers[id];
          });
        }
        if (!draft.activeSession.questionIds.length) {
          draft.activeSession = null;
        } else if (draft.activeSession.currentIndex >= draft.activeSession.questionIds.length) {
          draft.activeSession.currentIndex = Math.max(0, draft.activeSession.questionIds.length - 1);
        }
      }
    });
    showToast('success', unique.length === 1 ? 'Custom question deleted.' : `${unique.length} custom questions deleted.`);
  };

  const handleToggleFlag = (id) => {
    updateUserData((draft) => {
      draft.flaggedQuestionIds = draft.flaggedQuestionIds || [];
      const index = draft.flaggedQuestionIds.indexOf(id);
      if (index >= 0) {
        draft.flaggedQuestionIds.splice(index, 1);
      } else {
        draft.flaggedQuestionIds.push(id);
      }
    });
    const isNowFlagged = !flaggedSet.has(id);
    showToast('success', isNowFlagged ? 'Question flagged for review.' : 'Flag removed.');
  };

  const handleSelectHistorySession = (sessionId) => {
    setSelectedHistorySessionId((prev) => (prev === sessionId ? null : sessionId));
  };

  const handleDeleteSession = (sessionId) => {
    const exists = userData?.sessionHistory?.some((session) => session.id === sessionId);
    if (!exists) {
      showToast('error', 'Session not found.');
      return;
    }
    const confirmDelete = window.confirm('Delete this session? This cannot be undone.');
    if (!confirmDelete) return;
    updateUserData((draft) => {
      draft.sessionHistory = (draft.sessionHistory || []).filter((session) => session.id !== sessionId);
      if (draft.activeSession && draft.activeSession.id === sessionId) {
        draft.activeSession = null;
      }
    });
    if (selectedHistorySessionId === sessionId) {
      setSelectedHistorySessionId(null);
    }
    showToast('success', 'Session deleted.');
  };

  const handleCreateQuestion = (question) => {
    const existing = allQuestions.find((entry) => entry.id === question.id && question.id);
    if (existing && question.id) {
      showToast('error', 'Question ID already exists. Choose a unique ID.');
      return;
    }

    const trimmedImage = question.image?.trim();
    const trimmedImageAlt = question.imageAlt?.trim();
    const finalQuestion = {
      ...question,
      id: question.id?.trim() || `CUS-${Date.now()}`,
      difficulty: question.difficulty?.toLowerCase() || 'medium',
      educationalObjective: question.educationalObjective?.trim() || '',
      answers: question.answers.map((answer, index) => ({
        ...answer,
        isCorrect: answer.isCorrect || index === 0
      }))
    };
    if (trimmedImage) {
      finalQuestion.image = trimmedImage;
    } else {
      delete finalQuestion.image;
    }
    if (trimmedImageAlt) {
      finalQuestion.imageAlt = trimmedImageAlt;
    } else {
      delete finalQuestion.imageAlt;
    }

    updateUserData((draft) => {
      draft.customQuestions = draft.customQuestions || [];
      draft.customQuestions.push(finalQuestion);
    });
    showToast('success', 'Custom question added.');
  };

  const handleImport = async () => {
    const result = await window.gasbank.importQuestions();
    if (!result || result.canceled) return;
    if (result.error) {
      showToast('error', `Failed to import: ${result.error}`);
      return;
    }
    if (result.format === 'csv') {
      showToast('error', 'CSV import is not yet supported. Please import JSON.');
      return;
    }
    try {
      const incoming = Array.isArray(result.data) ? result.data : [];
      if (!incoming.length) {
        showToast('error', 'No questions found in file.');
        return;
      }
      updateUserData((draft) => {
        draft.customQuestions = draft.customQuestions || [];
        incoming.forEach((question) => {
          if (question.id && draft.customQuestions.some((entry) => entry.id === question.id)) {
            const uniqueId = `CUS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            draft.customQuestions.push({ ...question, id: uniqueId });
          } else {
            draft.customQuestions.push(question);
          }
        });
      });
      showToast('success', `${incoming.length} custom questions imported.`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Import failed. Ensure the file contains valid JSON.');
    }
  };

  const handleExport = async () => {
    const payload = userData?.customQuestions || [];
    if (!payload.length) {
      showToast('error', 'No custom questions to export.');
      return;
    }
    const result = await window.gasbank.exportCustomQuestions(payload);
    if (result?.canceled) return;
    showToast('success', `Exported ${payload.length} questions.`);
  };

  if (loading) {
    return (
      <div className="loading">
        <span>Loading question bank…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state" style={{ height: '100vh', border: 'none' }}>
        Failed to load application: {error.message}
      </div>
    );
  }

  const currentQuestionId = activeSession
    ? activeSession.questionIds[activeSession.currentIndex ?? 0]
    : null;
  const currentQuestion = currentQuestionId ? questionsMap.get(currentQuestionId) : null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Anesthesiology Question Bank</div>
        <nav className="nav-buttons">
          <button
            className={`nav-button ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-button ${activeView === 'session' ? 'active' : ''}`}
            onClick={() => setActiveView('session')}
          >
            Session
          </button>
          <button
            className={`nav-button ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            History
          </button>
          <button
            className={`nav-button ${activeView === 'content' ? 'active' : ''}`}
            onClick={() => setActiveView('content')}
          >
            Content
          </button>
          <button
            className={`nav-button ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveView('settings')}
          >
            Settings
          </button>
        </nav>
      </header>

      <main className="main">
        {activeView === 'dashboard' && (
          <Dashboard
            summary={summary}
            breakdown={breakdown}
            onStartSession={() => {
              setSessionConfig({ ...DEFAULT_SESSION_CONFIG });
              setShowConfigurator(true);
            }}
            onReviewIncorrect={handleReviewIncorrect}
            onReviewFlagged={handleReviewFlagged}
            onResumeSession={handleResumeSession}
            hasActiveSession={!!userData?.activeSession}
            hasFlagged={flaggedCount > 0}
            onOpenConfig={() => setShowConfigurator(true)}
          />
        )}
        {activeView === 'session' && (
          <SessionView
            session={activeSession}
            question={currentQuestion}
            questionIndex={activeSession?.currentIndex ?? 0}
            totalQuestions={activeSession?.questionIds.length ?? 0}
            onSelectAnswer={handleSelectAnswer}
            onNavigate={handleNavigate}
            onFinish={handleFinishSession}
            onExit={handleExitSession}
            onToggleFlag={handleToggleFlag}
            isFlagged={currentQuestion ? flaggedSet.has(currentQuestion.id) : false}
            flaggedSet={flaggedSet}
          />
        )}
        {activeView === 'history' && (
          <HistoryView
            questionsMap={questionsMap}
            userData={userData}
            onResetAll={handleResetAll}
            selectedSessionId={selectedHistorySessionId}
            onSelectSession={handleSelectHistorySession}
            onDeleteSession={handleDeleteSession}
          />
        )}
        {activeView === 'content' && (
          <ContentView
            allQuestions={allQuestions}
            userData={userData}
            filters={filters}
            customQuestionIds={customQuestionIds}
            flaggedSet={flaggedSet}
            onCreateQuestion={handleCreateQuestion}
            onImport={handleImport}
            onExport={handleExport}
            onResetQuestion={handleResetQuestion}
            onBulkReset={handleBulkResetQuestions}
            onDeleteCustomQuestions={handleDeleteCustomQuestions}
            onToggleFlag={handleToggleFlag}
          />
        )}
        {activeView === 'settings' && (
          <SettingsView
            paths={storagePaths}
            onChooseLocation={handleChangeStorageLocation}
            onUseDefault={handleUseDefaultStorage}
          />
        )}
      </main>

      {showConfigurator && (
        <SessionConfigurator
          filters={filters}
          config={sessionConfig}
          onUpdate={(config) => setSessionConfig(config)}
          onCancel={() => setShowConfigurator(false)}
          onCreate={(config) => {
            setShowConfigurator(false);
            startSessionFromConfig(config);
          }}
        />
      )}

      <Toast type={toast.type} message={toast.message} />
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);
