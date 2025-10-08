import { DEFAULT_SESSION_CONFIG, difficultyOrder } from '../constants.js';

export function clone(data) {
  return data ? JSON.parse(JSON.stringify(data)) : data;
}

export function normalizeUserData(data) {
  const normalized = data ? { ...data } : {};
  const userSettings = normalized.userSettings ? { ...normalized.userSettings } : {};
  if (!userSettings.theme) {
    userSettings.theme = 'system';
  }
  const rawBackupPreferences = userSettings.backupPreferences || {};
  const backupPreferences = {
    autoEnabled: rawBackupPreferences.autoEnabled !== false,
    interval: Math.max(1, Math.round(Number(rawBackupPreferences.interval) || 10))
  };
  const defaultSessionConfig = {
    ...DEFAULT_SESSION_CONFIG,
    ...(userSettings.defaultSessionConfig || {})
  };
  if (!Array.isArray(defaultSessionConfig.selectedCategories)) {
    defaultSessionConfig.selectedCategories = [];
  }
  if (!defaultSessionConfig.flagFilter) {
    defaultSessionConfig.flagFilter = 'any';
  }
  userSettings.defaultSessionConfig = defaultSessionConfig;
  userSettings.backupPreferences = backupPreferences;
  normalized.userSettings = userSettings;
  if (!normalized.storage) {
    normalized.storage = {
      customImageDirectory: null,
      backupDirectory: null,
      attemptsSinceBackup: 0,
      lastBackupAt: null
    };
  }
  if (normalized.storage && typeof normalized.storage.customImageDirectory === 'undefined') {
    normalized.storage.customImageDirectory = null;
  }
  if (typeof normalized.storage.backupDirectory === 'undefined') {
    normalized.storage.backupDirectory = null;
  }
  const attemptsValue = Number(normalized.storage.attemptsSinceBackup);
  normalized.storage.attemptsSinceBackup =
    Number.isFinite(attemptsValue) && attemptsValue >= 0 ? Math.floor(attemptsValue) : 0;
  if (!normalized.storage.lastBackupAt || typeof normalized.storage.lastBackupAt !== 'string') {
    normalized.storage.lastBackupAt = null;
  }
  if (!Array.isArray(normalized.customQuestions)) normalized.customQuestions = [];
  if (!normalized.questionStats) normalized.questionStats = {};
  if (!Array.isArray(normalized.sessionHistory)) normalized.sessionHistory = [];
  if (!normalized.notes) normalized.notes = {};
  if (!Array.isArray(normalized.flaggedQuestionIds)) normalized.flaggedQuestionIds = [];
  if (!normalized.activeSession) normalized.activeSession = null;
  return normalized;
}

export function determineStatus(statsEntry) {
  if (!statsEntry) return 'unanswered';
  return statsEntry.status || 'unanswered';
}

export function computeSummary(allQuestions, userData) {
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
  allQuestions.forEach((question) => {
    const status = determineStatus(userData.questionStats?.[question.id]);
    if (status === 'correct') correct += 1;
    if (status === 'incorrect') incorrect += 1;
  });

  const total = allQuestions.length;
  const unanswered = Math.max(0, total - correct - incorrect);
  return { total, correct, incorrect, unanswered };
}

export function computeCategoryPerformance(allQuestions, userData) {
  const byCategory = new Map();
  allQuestions.forEach((question) => {
    const status = determineStatus(userData?.questionStats?.[question.id]);
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

export function collectFilters(allQuestions) {
  const categories = new Set();
  const difficulties = new Set();

  allQuestions.forEach((question) => {
    if (question.category) categories.add(question.category);
    if (question.difficulty) difficulties.add(question.difficulty.toLowerCase());
  });

  return {
    categories: Array.from(categories).sort(),
    difficulties: Array.from(difficulties).sort(
      (a, b) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b)
    )
  };
}

export function scoreAnswer(question, answerIndex) {
  const correctIndex = question.answers.findIndex((answer) => answer.isCorrect);
  return {
    isCorrect: correctIndex === answerIndex,
    correctIndex
  };
}

export function attemptTemplate(result, answerIndex) {
  return {
    timestamp: new Date().toISOString(),
    result: result ? 'correct' : 'incorrect',
    answerIndex
  };
}

export function prepareAttemptRecord(questionId, draft, attempt) {
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

export function evaluateSessionResults(session, questionsMap) {
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

export function formatDate(timestamp) {
  if (!timestamp) return '—';
  const dt = new Date(timestamp);
  if (Number.isNaN(dt.valueOf())) return '—';
  return dt.toLocaleString();
}

export function derivePaletteClass(entry, current, session) {
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

export function getInitialConfig() {
  return { ...DEFAULT_SESSION_CONFIG };
}
