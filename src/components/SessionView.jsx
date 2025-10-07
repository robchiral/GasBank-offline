import React from 'react';
import { scoreAnswer, derivePaletteClass } from '../utils/dataUtils.js';

export function SessionView({
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
