export const DEFAULT_SESSION_CONFIG = {
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

export const statusLabels = {
  correct: 'Correct',
  incorrect: 'Incorrect',
  unanswered: 'Unanswered'
};

export const difficultyOrder = ['easy', 'medium', 'hard'];
