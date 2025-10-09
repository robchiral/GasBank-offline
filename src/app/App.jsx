import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dashboard } from '../components/Dashboard.jsx';
import { SessionView } from '../components/SessionView.jsx';
import { HistoryView } from '../components/HistoryView.jsx';
import { ContentView } from '../components/ContentView.jsx';
import { SettingsView } from '../components/SettingsView.jsx';
import { SessionConfigurator } from '../components/SessionConfigurator.jsx';
import { Toast } from '../components/Toast.jsx';
import { DEFAULT_SESSION_CONFIG } from '../constants.js';
import {
  attemptTemplate,
  clone,
  collectFilters,
  computeCategoryPerformance,
  computeSummary,
  determineStatus,
  evaluateSessionResults,
  normalizeUserData,
  prepareAttemptRecord,
  scoreAnswer
} from '../utils/dataUtils.js';
import { injectGlobalStyles } from '../styles/globalStyles.js';

const MIN_REQUIRED_ANSWERS = 2;

export function App() {
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
  const [customImageDirectory, setCustomImageDirectory] = useState(null);
  const [resolvedTheme, setResolvedTheme] = useState('dark');
  const autoBackupInFlight = useRef(false);
  const sessionDefaults = useMemo(() => {
    return { ...DEFAULT_SESSION_CONFIG, ...(userData?.userSettings?.defaultSessionConfig || {}) };
  }, [userData?.userSettings?.defaultSessionConfig]);
  const themePreference = userData?.userSettings?.theme || 'system';

  const backupState = useMemo(() => {
    const preferences = userData?.userSettings?.backupPreferences || {};
    return {
      directory: userData?.storage?.backupDirectory || null,
      lastBackupAt: userData?.storage?.lastBackupAt || null,
      attemptsSinceBackup: Number(userData?.storage?.attemptsSinceBackup || 0),
      preferences: {
        autoEnabled: preferences.autoEnabled !== false,
        interval: Math.max(1, Number(preferences.interval) || 10)
      }
    };
  }, [userData]);

  useEffect(() => {
    injectGlobalStyles();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const nextTheme =
        themePreference === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : themePreference;
      setResolvedTheme(nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      document.documentElement.style.colorScheme = nextTheme;
    };
    applyTheme();
    if (themePreference === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
    return undefined;
  }, [themePreference]);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        const payload = await window.gasbank.loadData();
        if (cancelled) return;
        setBaseQuestions(payload.questions || []);
        const normalizedUser = normalizeUserData(payload.userData || {});
        setUserData(normalizedUser);
        setSessionConfig({ ...DEFAULT_SESSION_CONFIG, ...(normalizedUser.userSettings?.defaultSessionConfig || {}) });
        if (payload.paths) {
          setStoragePaths(payload.paths);
        }
        const initialImageDir =
          payload.storage?.customImageDirectory ??
          normalizedUser.storage?.customImageDirectory ??
          null;
        setCustomImageDirectory(initialImageDir);
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

  const activeSession = userData?.activeSession ?? null;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev.message === message ? { type, message: '' } : prev));
    }, 3200);
  };

  const updateUserData = (mutator, afterPersist) => {
    setUserData((prev) => {
      if (!prev) return prev;
      const draft = normalizeUserData(clone(prev));
      mutator(draft);
      if (Array.isArray(draft.flaggedQuestionIds)) {
        draft.flaggedQuestionIds = Array.from(new Set(draft.flaggedQuestionIds));
      }
      const prepared = clone(draft);
      window.gasbank
        .saveUserData(prepared)
        .then(() => {
          if (afterPersist) {
            afterPersist(clone(prepared));
          }
        })
        .catch((err) => {
          console.error(err);
          showToast('error', 'Failed to save changes locally.');
      });
      return draft;
    });
  };

  const maybeTriggerAutoBackup = (snapshot) => {
    const preferences = snapshot.userSettings?.backupPreferences || {};
    const autoEnabled = preferences.autoEnabled !== false;
    if (!autoEnabled) return;
    const directory = snapshot.storage?.backupDirectory;
    if (!directory) return;
    const interval = Math.max(1, Number(preferences.interval) || 10);
    const attempts = Number(snapshot.storage?.attemptsSinceBackup) || 0;
    if (attempts < interval) return;
    if (autoBackupInFlight.current) return;
    autoBackupInFlight.current = true;
    window.gasbank
      .createBackup({ directory })
      .then((result) => {
        if (result?.success) {
          const timestamp = result.timestamp || new Date().toISOString();
          updateUserData((draft) => {
            draft.storage = draft.storage || {};
            draft.storage.lastBackupAt = timestamp;
            draft.storage.attemptsSinceBackup = 0;
          });
          const filename = result.filePath ? result.filePath.split(/[\\/]/).pop() : 'backup';
          showToast('success', `Auto-backup saved (${filename}).`);
        } else if (result?.message) {
          showToast('error', result.message);
        }
      })
      .catch((err) => {
        console.error(err);
        showToast('error', 'Auto-backup failed.');
      })
      .finally(() => {
        autoBackupInFlight.current = false;
      });
  };

  const computeMatchingQuestionIds = useCallback(
    (config) => {
      if (!config) return [];
      const normalized = { ...DEFAULT_SESSION_CONFIG, ...config };
      const ids = [];
      allQuestions.forEach((question) => {
        const isCustom = customQuestionIds.has(question.id);
        if (!normalized.includeCustom && isCustom) return;
        if (normalized.onlyCustom && !isCustom) return;
        if (normalized.difficulty !== 'all' && question.difficulty?.toLowerCase() !== normalized.difficulty) return;
        if (normalized.selectedCategories.length && !normalized.selectedCategories.includes(question.category)) return;
        if (normalized.statusFilter === 'unanswered' && determineStatus(userData?.questionStats?.[question.id]) !== 'unanswered') return;
        if (normalized.statusFilter === 'incorrect' && determineStatus(userData?.questionStats?.[question.id]) !== 'incorrect') return;
        const isFlagged = flaggedSet.has(question.id);
        if (normalized.flagFilter === 'flagged' && !isFlagged) return;
        if (normalized.flagFilter === 'excludeFlagged' && isFlagged) return;
        ids.push(question.id);
      });
      return ids;
    },
    [allQuestions, customQuestionIds, flaggedSet, userData?.questionStats]
  );

  const startSessionFromConfig = (config, preselectedIds = null) => {
    const normalizedConfig = { ...DEFAULT_SESSION_CONFIG, ...config };
    normalizedConfig.numQuestions = Math.max(
      1,
      Math.min(100, Number(normalizedConfig.numQuestions) || DEFAULT_SESSION_CONFIG.numQuestions)
    );
    const baseIds = preselectedIds ? [...preselectedIds] : computeMatchingQuestionIds(normalizedConfig);
    if (!baseIds.length) {
      showToast('error', 'No questions match this configuration.');
      return;
    }

    const ids = [...baseIds];
    if (normalizedConfig.randomize) {
      for (let i = ids.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
    }

    const trimmed = ids.slice(0, normalizedConfig.numQuestions);
    const session = {
      id: `session-${Date.now()}`,
      createdAt: new Date().toISOString(),
      questionIds: trimmed,
      currentIndex: 0,
      userAnswers: {},
      mode: normalizedConfig.mode,
      status: 'active',
      config: normalizedConfig
    };

    updateUserData((draft) => {
      draft.activeSession = session;
    });
    setActiveView('session');
    showToast('success', `Session launched with ${trimmed.length} questions.`);
  };

  const getMatchingCount = useCallback(
    (config) => computeMatchingQuestionIds(config).length,
    [computeMatchingQuestionIds]
  );

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
    let attemptDelta = 0;
    updateUserData(
      (draft) => {
        if (!draft.activeSession) return;
        draft.activeSession.userAnswers[questionId] = {
          choiceIndex: index,
          isCorrect,
          correctIndex
        };
        if (draft.activeSession.mode === 'Tutor' && (currentAnswer?.choiceIndex == null)) {
          prepareAttemptRecord(questionId, draft, attempt);
          draft.storage = draft.storage || {};
          const prevAttempts = Number(draft.storage.attemptsSinceBackup || 0);
          draft.storage.attemptsSinceBackup = prevAttempts + 1;
          attemptDelta += 1;
        }
      },
      (updated) => {
        if (attemptDelta > 0) {
          maybeTriggerAutoBackup(updated);
        }
      }
    );
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

    let attemptDelta = 0;
    updateUserData(
      (draft) => {
        if (!draft.activeSession) return;
        draft.sessionHistory = draft.sessionHistory || [];
        draft.sessionHistory.unshift(sessionRecord);
        if (draft.sessionHistory.length > 50) {
          draft.sessionHistory = draft.sessionHistory.slice(0, 50);
        }

        updates.forEach((entry) => {
          const attempt = attemptTemplate(entry.isCorrect, entry.choiceIndex ?? -1);
          prepareAttemptRecord(entry.id, draft, attempt);
          if (entry.choiceIndex != null) {
            attemptDelta += 1;
          }
        });

        if (attemptDelta > 0) {
          draft.storage = draft.storage || {};
          const prevAttempts = Number(draft.storage.attemptsSinceBackup || 0);
          draft.storage.attemptsSinceBackup = prevAttempts + attemptDelta;
        }

        draft.activeSession = sessionSummary;
      },
      (updated) => {
        if (attemptDelta > 0) {
          maybeTriggerAutoBackup(updated);
        }
      }
    );
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
      .filter((question) => determineStatus(userData?.questionStats?.[question.id]) === 'incorrect')
      .map((question) => question.id);
    if (!incorrectIds.length) {
      showToast('success', 'Fantastic! No incorrect questions remain.');
      return;
    }
    const config = { ...sessionDefaults, statusFilter: 'incorrect', numQuestions: incorrectIds.length };
    startSessionFromConfig(config, incorrectIds);
  };

  const handleReviewFlagged = () => {
    const flaggedIds = userData?.flaggedQuestionIds?.filter((id) => questionsMap.has(id)) || [];
    if (!flaggedIds.length) {
      showToast('error', 'No flagged questions to review.');
      return;
    }
    const config = {
      ...sessionDefaults,
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
      const normalized = normalizeUserData(result.userData);
      setUserData(normalized);
      setCustomImageDirectory(normalized.storage?.customImageDirectory || null);
      setSessionConfig({ ...DEFAULT_SESSION_CONFIG, ...(normalized.userSettings?.defaultSessionConfig || {}) });
      showToast('success', 'Progress reset.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to reset progress.');
    }
  };

  const handleChooseBackupDirectory = async () => {
    try {
      const result = await window.gasbank.chooseBackupDirectory();
      if (!result || result.canceled || !result.directory) return;
      updateUserData((draft) => {
        draft.storage = draft.storage || {};
        draft.storage.backupDirectory = result.directory;
      });
      showToast('success', 'Backup directory updated.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to select backup directory.');
    }
  };

  const handleClearBackupDirectory = () => {
    updateUserData((draft) => {
      draft.storage = draft.storage || {};
      draft.storage.backupDirectory = null;
    });
    showToast('success', 'Backup directory cleared.');
  };

  const handleUpdateBackupPreferences = (patch) => {
    updateUserData((draft) => {
      draft.userSettings = draft.userSettings || {};
      const current = draft.userSettings.backupPreferences || { autoEnabled: true, interval: 10 };
      const next = { ...current };
      if (Object.prototype.hasOwnProperty.call(patch, 'autoEnabled')) {
        next.autoEnabled = !!patch.autoEnabled;
      }
      if (Object.prototype.hasOwnProperty.call(patch, 'interval')) {
        const numeric = Math.max(1, Math.round(Number(patch.interval) || 1));
        next.interval = numeric;
      } else {
        next.interval = Math.max(1, Math.round(Number(next.interval) || 10));
      }
      draft.userSettings.backupPreferences = next;
    });
  };

  const handleCreateBackup = async () => {
    const directory = userData?.storage?.backupDirectory;
    if (!directory) {
      showToast('error', 'Choose a backup directory first.');
      return;
    }
    try {
      const result = await window.gasbank.createBackup({ directory });
      if (!result?.success) {
        showToast('error', result?.message || 'Failed to create backup.');
        return;
      }
      updateUserData((draft) => {
        draft.storage = draft.storage || {};
        draft.storage.lastBackupAt = result.timestamp || new Date().toISOString();
        draft.storage.attemptsSinceBackup = 0;
      });
      const filename = result.filePath ? result.filePath.split(/[\\/]/).pop() : 'backup';
      showToast('success', `Backup saved (${filename}).`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to create backup.');
    }
  };

  const handleImportBackup = async () => {
    try {
      const result = await window.gasbank.importBackup();
      if (!result || result.canceled) return;
      if (!result.success) {
        showToast('error', result.message || 'Failed to import backup.');
        return;
      }
      const normalized = normalizeUserData(result.userData);
      setUserData(normalized);
      setCustomImageDirectory(normalized.storage?.customImageDirectory || null);
      setSessionConfig({ ...DEFAULT_SESSION_CONFIG, ...(normalized.userSettings?.defaultSessionConfig || {}) });
      if (result.paths) {
        setStoragePaths(result.paths);
      }
      showToast('success', 'Backup imported.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to import backup.');
    }
  };

  const handleBulkResetQuestions = (ids) => {
    if (!ids || !ids.length) return;
    const unique = Array.from(new Set(ids));
    let cleared = 0;
    updateUserData((draft) => {
      unique.forEach((id) => {
        if (draft.questionStats[id]) {
          delete draft.questionStats[id];
          cleared += 1;
        }
      });
    });
    if (cleared === 0) {
      showToast('success', 'No stored history for the selected questions.');
    } else {
      showToast('success', cleared === 1 ? 'History cleared for 1 question.' : `History cleared for ${cleared} questions.`);
    }
  };

  const handleDeleteCustomQuestions = (ids) => {
    if (!ids || !ids.length) return;
    const unique = Array.from(new Set(ids));
    const toDelete = new Set(unique);
    let deleted = 0;
    updateUserData((draft) => {
      draft.customQuestions = (draft.customQuestions || []).filter((question) => {
        if (toDelete.has(question.id)) {
          deleted += 1;
          return false;
        }
        return true;
      });
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
    if (deleted === 0) {
      showToast('success', 'No custom questions matched the selection.');
    } else {
      showToast('success', deleted === 1 ? 'Custom question deleted.' : `${deleted} custom questions deleted.`);
    }
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

  const handleReviewSessionFromHistory = (sessionId) => {
    if (!sessionId) return;
    const session = (userData?.sessionHistory || []).find((item) => item.id === sessionId);
    if (!session) {
      showToast('error', 'Session not found.');
      return;
    }
    updateUserData((draft) => {
      draft.activeSession = {
        ...session,
        status: 'completed',
        questionIds: [...(session.questionIds || [])],
        userAnswers: clone(session.userAnswers || {}),
        currentIndex: 0
      };
    });
    setActiveView('session');
  };

  const handleUpdateSessionDefaults = (config) => {
    const sanitized = {
      ...DEFAULT_SESSION_CONFIG,
      ...sessionDefaults,
      ...config,
      selectedCategories: Array.isArray(config.selectedCategories)
        ? config.selectedCategories
        : Array.isArray(sessionDefaults.selectedCategories)
          ? sessionDefaults.selectedCategories
          : []
    };
    sanitized.numQuestions = Math.max(
      1,
      Math.min(100, Number(sanitized.numQuestions) || DEFAULT_SESSION_CONFIG.numQuestions)
    );
    sanitized.onlyCustom = typeof sanitized.onlyCustom === 'boolean' ? sanitized.onlyCustom : !!sessionDefaults.onlyCustom;
    updateUserData((draft) => {
      draft.userSettings = draft.userSettings || {};
      draft.userSettings.defaultSessionConfig = sanitized;
    });
    setSessionConfig(sanitized);
    showToast('success', 'Session defaults updated.');
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
    showToast('success', 'Session deleted.');
  };

  const handleUpdateThemePreference = (preference) => {
    const allowed = ['system', 'dark', 'light'];
    const sanitized = allowed.includes(preference) ? preference : 'system';
    updateUserData((draft) => {
      draft.userSettings = draft.userSettings || {};
      draft.userSettings.theme = sanitized;
    });
    const message =
      sanitized === 'system'
        ? 'Theme set to match system preference.'
        : `Theme switched to ${sanitized} mode.`;
    showToast('success', message);
  };

  const handleCreateQuestion = (question) => {
    const existing = allQuestions.find((entry) => entry.id === question.id && question.id);
    if (existing && question.id) {
      showToast('error', 'Question ID already exists. Choose a unique ID.');
      return;
    }

    const trimmedImage = question.image?.trim();
    const trimmedImageAlt = question.imageAlt?.trim();
    const preparedAnswers = (question.answers || []).map((answer) => ({
      ...answer,
      text: typeof answer?.text === 'string' ? answer.text.trim() : '',
      explanation: answer.explanation?.trim() || '',
      isCorrect: !!answer.isCorrect
    }));
    if (preparedAnswers.length < MIN_REQUIRED_ANSWERS) {
      showToast('error', `Provide at least ${MIN_REQUIRED_ANSWERS} answer choices.`);
      return;
    }
    if (preparedAnswers.some((answer) => answer.text.length === 0)) {
      showToast('error', 'Fill in text for every answer choice.');
      return;
    }
    const correctAnswers = preparedAnswers.filter((answer) => answer.isCorrect);
    if (correctAnswers.length !== 1) {
      showToast('error', 'Select exactly one correct answer.');
      return;
    }
    const finalQuestion = {
      id: question.id?.trim() || `CUS-${Date.now()}`,
      category: question.category?.trim() || '',
      subcategory: question.subcategory?.trim() || '',
      difficulty: question.difficulty?.toLowerCase() || 'medium',
      questionText: question.questionText?.trim() || '',
      answers: preparedAnswers,
      didactic: question.didactic?.trim() || '',
      educationalObjective: question.educationalObjective?.trim() || ''
    };
    if (trimmedImage) {
      finalQuestion.image = trimmedImage;
    }
    if (trimmedImageAlt) {
      finalQuestion.imageAlt = trimmedImageAlt;
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
      const existingIds = new Set(allQuestions.map((question) => question.id));
      const prepared = [];
      let skipped = 0;
      let counter = 0;

      incoming.forEach((question) => {
        const trimmedId = typeof question.id === 'string' ? question.id.trim() : '';
        if (trimmedId && existingIds.has(trimmedId)) {
          skipped += 1;
          return;
        }
        let finalId = trimmedId;
        if (!finalId) {
          do {
            counter += 1;
            finalId = `CUS-${Date.now()}-${counter}`;
          } while (existingIds.has(finalId));
        }
        existingIds.add(finalId);
        const sanitizedQuestion = {
          ...question,
          id: finalId,
          difficulty: (question.difficulty || 'medium').toLowerCase()
        };
        if (typeof sanitizedQuestion.image === 'string') {
          const trimmedImage = sanitizedQuestion.image.trim();
          sanitizedQuestion.image = trimmedImage || undefined;
        }
        prepared.push(sanitizedQuestion);
      });

      if (!prepared.length) {
        const message = skipped
          ? `No new questions imported. Skipped ${skipped} duplicate IDs.`
          : 'No new questions imported.';
        showToast('error', message);
        return;
      }

      updateUserData((draft) => {
        draft.customQuestions = draft.customQuestions || [];
        prepared.forEach((question) => {
          draft.customQuestions.push(question);
        });
      });

      const summaryMessage = skipped
        ? `${prepared.length} question${prepared.length === 1 ? '' : 's'} imported. Skipped ${skipped} duplicate ID${skipped === 1 ? '' : 's'}.`
        : `${prepared.length} question${prepared.length === 1 ? '' : 's'} imported.`;
      showToast('success', summaryMessage);
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
              setSessionConfig({ ...sessionDefaults });
              setShowConfigurator(true);
            }}
            onReviewIncorrect={handleReviewIncorrect}
            onReviewFlagged={handleReviewFlagged}
            onResumeSession={handleResumeSession}
            hasActiveSession={!!userData?.activeSession}
            hasFlagged={flaggedCount > 0}
            onOpenConfig={() => {
              setSessionConfig({ ...sessionDefaults });
              setShowConfigurator(true);
            }}
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
            customQuestionIds={customQuestionIds}
            customImageDirectory={customImageDirectory}
          />
        )}
        {activeView === 'history' && (
          <HistoryView
            questionsMap={questionsMap}
            userData={userData}
            onResetAll={handleResetAll}
            onSelectSession={handleReviewSessionFromHistory}
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
            customImageDirectory={customImageDirectory}
            onCreateQuestion={handleCreateQuestion}
            onImport={handleImport}
            onExport={handleExport}
            onBulkReset={handleBulkResetQuestions}
            onDeleteCustomQuestions={handleDeleteCustomQuestions}
          />
        )}
        {activeView === 'settings' && (
          <SettingsView
            paths={storagePaths}
            customImageDirectory={customImageDirectory}
            sessionDefaults={sessionDefaults}
            onUpdateSessionDefaults={handleUpdateSessionDefaults}
            backupState={backupState}
            onChooseBackupDirectory={handleChooseBackupDirectory}
            onClearBackupDirectory={handleClearBackupDirectory}
            onUpdateBackupPreferences={handleUpdateBackupPreferences}
            onCreateBackup={handleCreateBackup}
            onImportBackup={handleImportBackup}
            themePreference={themePreference}
            resolvedTheme={resolvedTheme}
            onUpdateThemePreference={handleUpdateThemePreference}
          />
        )}
      </main>

      {showConfigurator && (
        <SessionConfigurator
          filters={filters}
          config={sessionConfig}
          getMatchingCount={getMatchingCount}
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
