import { DEFAULT_SESSION_CONFIG } from '../constants.js';

export const QUESTION_COUNT_LIMITS = {
  MIN: 1,
  MAX: 100
};

export function clampQuestionCount(value, fallback = DEFAULT_SESSION_CONFIG.numQuestions) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  const rounded = Math.round(numeric);
  if (!Number.isFinite(rounded)) {
    return fallback;
  }
  if (rounded < QUESTION_COUNT_LIMITS.MIN) return QUESTION_COUNT_LIMITS.MIN;
  if (rounded > QUESTION_COUNT_LIMITS.MAX) return QUESTION_COUNT_LIMITS.MAX;
  return rounded;
}

export function normalizeSessionConfig(rawConfig = {}, fallbackConfig = DEFAULT_SESSION_CONFIG) {
  const merged = { ...DEFAULT_SESSION_CONFIG, ...fallbackConfig, ...rawConfig };
  const includeFallback =
    typeof fallbackConfig?.includeCustom === 'boolean'
      ? fallbackConfig.includeCustom
      : DEFAULT_SESSION_CONFIG.includeCustom;
  const onlyFallback =
    typeof fallbackConfig?.onlyCustom === 'boolean'
      ? fallbackConfig.onlyCustom
      : DEFAULT_SESSION_CONFIG.onlyCustom;
  const flagFallback = fallbackConfig?.flagFilter || DEFAULT_SESSION_CONFIG.flagFilter;

  return {
    ...merged,
    numQuestions: clampQuestionCount(merged.numQuestions),
    selectedCategories: Array.isArray(merged.selectedCategories) ? merged.selectedCategories : [],
    includeCustom:
      typeof merged.includeCustom === 'boolean' ? merged.includeCustom : includeFallback,
    onlyCustom: typeof merged.onlyCustom === 'boolean' ? merged.onlyCustom : onlyFallback,
    flagFilter: merged.flagFilter || flagFallback
  };
}
