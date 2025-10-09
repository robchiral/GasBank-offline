import React from 'react';
import { PieChart, CategoryBars } from './Charts.jsx';

export function Dashboard({
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
          <h1>Dashboard</h1>
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
          <button
            className="button secondary"
            onClick={onReviewIncorrect}
            disabled={summary.incorrect === 0}
          >
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
          <div className="category-scroll">
            <CategoryBars breakdown={breakdown} />
          </div>
        </div>
      </div>
    </div>
  );
}
