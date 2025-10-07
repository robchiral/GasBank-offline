import React from 'react';
import { statusLabels } from '../constants.js';
import { formatDate, scoreAnswer } from '../utils/dataUtils.js';

export function HistoryView({
  questionsMap,
  userData,
  onResetAll,
  selectedSessionId,
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
