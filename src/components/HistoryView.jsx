import React from 'react';
import { formatDate } from '../utils/dataUtils.js';

export function HistoryView({
  questionsMap,
  userData,
  onResetAll,
  onSelectSession,
  onDeleteSession
}) {
  const attempts = React.useMemo(() => {
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

  return (
    <div className="grid">
      <div className="section-title">
        <div>
          <h1>History</h1>
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

      <div className="card">
        <h2>Session History</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
          Click Review to reopen the session in the Session workspace with the original answer state.
        </p>
        {sessions.length === 0 ? (
          <div className="empty-state">Complete a session to populate history.</div>
        ) : (
          <div className="question-list">
            {sessions.map((session) => {
              const totalQuestions = session.questionIds?.length || session.total || 0;
              const answers = session.userAnswers || {};
              const correctCount =
                typeof session.correct === 'number'
                  ? session.correct
                  : Object.values(answers).filter((answer) => answer && answer.isCorrect).length;
              const accuracy = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;
              return (
                <div key={session.id} className="session-item">
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
                      Review
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
    </div>
  );
}
