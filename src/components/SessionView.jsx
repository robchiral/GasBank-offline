import React from 'react';
import { scoreAnswer, derivePaletteClass } from '../utils/dataUtils.js';
import { MarkdownContent } from './MarkdownContent.jsx';

function buildCustomImageSrc(directory, filename) {
  if (!directory || !filename) return null;
  if (/^(file|https?):\/\//i.test(filename)) {
    return filename;
  }
  const sanitizedDir = directory.replace(/\\/g, '/');
  const hasProtocol = /^file:\/\//i.test(sanitizedDir);
  const needsLeadingSlash = !sanitizedDir.startsWith('/') && !hasProtocol;
  let base = hasProtocol ? sanitizedDir : `file://${needsLeadingSlash ? '/' : ''}${sanitizedDir}`;
  if (!base.endsWith('/')) {
    base += '/';
  }
  const safeFilename = filename
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('/');
  return encodeURI(base) + safeFilename;
}

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
  flaggedSet,
  customQuestionIds,
  customImageDirectory
}) {
  const paletteRef = React.useRef(null);
  const paletteShadowUpdaterRef = React.useRef(() => {});

  React.useEffect(() => {
    const element = paletteRef.current;
    if (!element) return;

    const updateShadows = () => {
      const scrollable = element.scrollHeight - element.clientHeight > 1;
      const atTop = element.scrollTop <= 0;
      const atBottom = element.scrollHeight - element.clientHeight - element.scrollTop <= 1;
      const showTopShadow = scrollable && !atTop;
      const showBottomShadow = scrollable && !atBottom && !atTop;

      element.classList.toggle('is-scrollable', scrollable);
      element.classList.toggle('has-scroll-shadow-top', showTopShadow);
      element.classList.toggle('has-scroll-shadow-bottom', showBottomShadow);
    };

    paletteShadowUpdaterRef.current = updateShadows;
    updateShadows();

    element.addEventListener('scroll', updateShadows, { passive: true });

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateShadows);
      resizeObserver.observe(element);
    }

    return () => {
      element.removeEventListener('scroll', updateShadows);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [session.questionIds.length]);

  React.useEffect(() => {
    paletteShadowUpdaterRef.current();
  }, [question.id, session.questionIds.length]);

  if (!session || !question) {
    return <div className="empty-state">No active session. Start a new study session from the dashboard.</div>;
  }

  const currentAnswer = session.userAnswers[question.id] || null;
  const { correctIndex } = scoreAnswer(question, currentAnswer?.choiceIndex ?? -1);
  const showFeedback = session.mode === 'Tutor'
    ? currentAnswer?.choiceIndex != null
    : session.status === 'completed';
  const isCustomQuestion = customQuestionIds?.has ? customQuestionIds.has(question.id) : false;
  const imageSrc = question.image
    ? isCustomQuestion
      ? buildCustomImageSrc(customImageDirectory, question.image)
      : `../data/images/${question.image}`
    : null;

  return (
    <div className="session-wrapper">
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
          {session.mode === 'Exam' && session.status === 'active' && (
            <div style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 13 }}>
              Answers save automatically; explanations unlock when you end the session.
            </div>
          )}
          <div className="question-body">
            <MarkdownContent className="question-text">
              {question.questionText}
            </MarkdownContent>
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
                  key={`${question.id}-${index}`}
                  className={className}
                  onClick={() => onSelectAnswer(index)}
                  role="button"
                >
                  <div className="answer-option-header">
                    <span className="answer-letter">{String.fromCharCode(65 + index)}.</span>
                    <MarkdownContent className="answer-text">
                      {answer.text}
                    </MarkdownContent>
                  </div>
                  {showFeedback && (
                    <MarkdownContent className="explanation">
                      {answer.explanation}
                    </MarkdownContent>
                  )}
                </div>
              );
            })}
          </div>
          {showFeedback && question.didactic && (
            <div className="card callout-card">
              <h3 style={{ marginTop: 0 }}>Didactic Summary</h3>
              <MarkdownContent className="question-didactic">
                {question.didactic}
              </MarkdownContent>
            </div>
          )}
          {showFeedback && question.educationalObjective && (
            <div className="card callout-card">
              <h3 style={{ marginTop: 0 }}>Educational Objective</h3>
              <MarkdownContent className="question-objective">
                {question.educationalObjective}
              </MarkdownContent>
            </div>
          )}
        </div>
        <div className="card palette-card">
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>Question Palette</h3>
          <div className="question-palette-container" ref={paletteRef}>
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
      </div>
      <div className="session-controls-bar">
        <button
          className={`button flag-button ${isFlagged ? 'active' : ''}`}
          onClick={() => onToggleFlag(question.id)}
          type="button"
        >
          {isFlagged ? 'Remove Flag' : 'Flag Question'}
        </button>
        <div className="controls-spacer" aria-hidden="true" />
        <div className="controls-group">
          <button
            className="button secondary"
            onClick={() => onNavigate(questionIndex - 1)}
            disabled={questionIndex === 0}
            type="button"
          >
            Previous
          </button>
          <button
            className="button secondary"
            onClick={() => onNavigate(questionIndex + 1)}
            disabled={questionIndex === totalQuestions - 1}
            type="button"
          >
            Next
          </button>
          <button className="button danger" onClick={onFinish} type="button">
            End Session
          </button>
          <button className="button secondary" onClick={onExit} type="button">
            Exit to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
