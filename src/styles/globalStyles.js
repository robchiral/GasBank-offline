export const globalCss = `
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

  input,
  select,
  textarea {
    font-family: inherit;
    background: var(--bg-softer);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 8px;
    padding: 10px 12px;
  }

  input:focus,
  select:focus,
  textarea:focus {
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

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    font-size: 14px;
    color: var(--text-muted);
  }

  .field-group .field-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
  }

  .checkbox-inline {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--text);
    font-size: 14px;
  }

  .checkbox-inline input {
    width: 18px;
    height: 18px;
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

  .session-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

  .session-controls-bar {
    position: sticky;
    bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-radius: 18px;
    background: rgba(12, 20, 38, 0.92);
    border: 1px solid rgba(56, 189, 248, 0.16);
    box-shadow: 0 12px 32px rgba(6, 16, 32, 0.55);
    backdrop-filter: blur(12px);
    z-index: 5;
  }

  .session-controls-bar .button {
    min-width: 120px;
  }

  .controls-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .controls-spacer {
    flex: 1 1 auto;
  }

  .answers {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .question-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .markdown-content {
    font-size: 15px;
    line-height: 1.6;
    color: var(--text);
  }

  .markdown-content p {
    margin: 0 0 12px;
  }

  .markdown-content ul,
  .markdown-content ol {
    margin: 0 0 12px 20px;
    padding-left: 0;
  }

  .markdown-content li + li {
    margin-top: 6px;
  }

  .markdown-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 14px;
  }

  .markdown-content th,
  .markdown-content td {
    border: 1px solid rgba(148, 163, 184, 0.28);
    padding: 8px 10px;
    text-align: left;
  }

  .markdown-content th {
    background: rgba(56, 189, 248, 0.18);
    color: var(--primary);
  }

  .markdown-content tbody tr:nth-child(even) {
    background: rgba(15, 23, 42, 0.5);
  }

  .markdown-table-wrapper {
    overflow-x: auto;
    border-radius: 12px;
  }

  .markdown-table-wrapper table {
    margin: 0;
    background: rgba(10, 18, 34, 0.8);
  }

  .question-text {
    font-size: 18px;
    font-weight: 600;
  }

  .question-text p {
    margin: 0 0 12px;
  }

  .question-didactic,
  .question-objective {
    color: var(--text-muted);
  }

  .multi-select {
    position: relative;
    width: 100%;
  }

  .multi-select-toggle {
    width: 100%;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(56, 189, 248, 0.2);
    background: rgba(56, 189, 248, 0.08);
    color: var(--text);
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    cursor: pointer;
    transition: background 0.2s, border 0.2s;
  }

  .multi-select-toggle.open {
    border-color: rgba(56, 189, 248, 0.45);
    background: rgba(56, 189, 248, 0.18);
  }

  .multi-select-indicator {
    font-size: 12px;
    color: var(--text-muted);
  }

  .multi-select-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 260px;
    max-height: 260px;
    overflow-y: auto;
    background: rgba(12, 21, 38, 0.98);
    border: 1px solid rgba(56, 189, 248, 0.22);
    border-radius: 14px;
    box-shadow: 0 18px 42px rgba(5, 12, 24, 0.55);
    padding: 12px;
    z-index: 1010;
  }

  .multi-select-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 4px;
    font-size: 14px;
    color: var(--text);
  }

  .multi-select-option input {
    width: 16px;
    height: 16px;
  }

  .multi-select-divider {
    height: 1px;
    background: rgba(148, 163, 184, 0.24);
    margin: 8px 0;
  }

  .multi-select-help {
    margin: 6px 0 20px;
    font-size: 13px;
    color: var(--text-muted);
  }

  @media (max-width: 1100px) {
    .session-container {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .session-controls-bar {
      flex-wrap: wrap;
      position: sticky;
      bottom: 16px;
      gap: 10px;
    }

    .session-controls-bar .button {
      flex: 1 1 calc(50% - 10px);
      min-width: unset;
    }

    .controls-spacer {
      display: none;
    }

    .controls-group {
      width: 100%;
      justify-content: flex-end;
    }
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

  .table-scroll {
    max-height: 360px;
    overflow-y: auto;
    margin-top: 8px;
  }

  .table-scroll table {
    margin: 0;
  }

  .info-block {
    display: grid;
    gap: 14px;
  }

  .info-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .info-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
  }

  .info-value {
    font-size: 14px;
    color: var(--text);
    word-break: break-all;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
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

  .question-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-height: 540px;
    overflow-y: auto;
    padding-right: 4px;
  }

  .question-list::-webkit-scrollbar {
    width: 6px;
  }

  .question-list::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.3);
    border-radius: 999px;
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
`;

export function injectGlobalStyles() {
  if (document.getElementById('gasbank-global-styles')) {
    return;
  }
  const styleTag = document.createElement('style');
  styleTag.id = 'gasbank-global-styles';
  styleTag.textContent = globalCss;
  document.head.appendChild(styleTag);
}
