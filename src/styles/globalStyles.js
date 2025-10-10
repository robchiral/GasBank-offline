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
    --card-bg: linear-gradient(145deg, rgba(22, 33, 58, 0.96), rgba(15, 23, 42, 0.92));
    --card-border: rgba(56, 189, 248, 0.08);
    --header-bg: rgba(15, 23, 42, 0.85);
    --nav-button-accent-border: rgba(56, 189, 248, 0.4);
    --modal-backdrop-bg: rgba(8, 15, 30, 0.75);
    --modal-bg: #0b1529;
    --modal-border: rgba(56, 189, 248, 0.25);
    --modal-shadow: 0 24px 60px rgba(1, 9, 18, 0.65);
    --session-controls-bg: rgba(12, 20, 38, 0.92);
    --session-controls-border: rgba(56, 189, 248, 0.16);
    --session-controls-shadow: 0 12px 32px rgba(6, 16, 32, 0.55);
    --stat-pill-bg: rgba(148, 163, 184, 0.12);
    --answer-option-bg: rgba(23, 35, 58, 0.6);
    --answer-option-border: var(--border);
    --answer-option-selected-bg: rgba(56, 189, 248, 0.08);
    --answer-option-correct-bg: rgba(52, 211, 153, 0.12);
    --answer-option-incorrect-bg: rgba(248, 113, 113, 0.1);
    --palette-item-bg: rgba(15, 23, 42, 0.8);
    --palette-item-correct-bg: rgba(52, 211, 153, 0.18);
    --palette-item-incorrect-bg: rgba(248, 113, 113, 0.15);
    --palette-item-answered-bg: rgba(148, 163, 184, 0.16);
    --chart-rim: rgba(15, 23, 42, 0.85);
    --chart-shadow: 0 12px 30px rgba(8, 20, 33, 0.5);
    --callout-bg: rgba(15, 23, 42, 0.6);
    --callout-border: rgba(56, 189, 248, 0.22);
    --list-card-bg: rgba(16, 26, 43, 0.65);
    --list-card-border: rgba(56, 189, 248, 0.12);
    --answer-card-bg: rgba(12, 21, 39, 0.65);
    --answer-card-border: rgba(56, 189, 248, 0.12);
    --table-zebra-bg: rgba(15, 23, 42, 0.5);
    --table-bg: rgba(10, 18, 34, 0.8);
  }

  :root[data-theme='dark'] {
    color-scheme: dark;
  }

  :root[data-theme='light'] {
    color-scheme: light;
    --bg: #f8fafc;
    --bg-soft: #f1f5f9;
    --bg-softer: #e2e8f0;
    --border: #cbd5f5;
    --primary: #0ea5e9;
    --primary-soft: rgba(14, 165, 233, 0.12);
    --secondary: #7c3aed;
    --danger: #ef4444;
    --success: #10b981;
    --text: #0f172a;
    --text-muted: #475569;
    --card-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
    --card-bg: linear-gradient(145deg, rgba(255, 255, 255, 0.97), rgba(241, 245, 249, 0.94));
    --card-border: rgba(148, 163, 184, 0.35);
    --header-bg: rgba(248, 250, 252, 0.95);
    --nav-button-accent-border: rgba(2, 132, 199, 0.5);
    --modal-backdrop-bg: rgba(15, 23, 42, 0.35);
    --modal-bg: #ffffff;
    --modal-border: rgba(148, 163, 184, 0.35);
    --modal-shadow: 0 24px 50px rgba(15, 23, 42, 0.12);
    --session-controls-bg: rgba(248, 250, 252, 0.95);
    --session-controls-border: rgba(148, 163, 184, 0.4);
    --session-controls-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
    --stat-pill-bg: rgba(148, 163, 184, 0.16);
    --answer-option-bg: rgba(241, 245, 249, 0.85);
    --answer-option-border: rgba(148, 163, 184, 0.5);
    --answer-option-selected-bg: rgba(14, 165, 233, 0.18);
    --answer-option-correct-bg: rgba(16, 185, 129, 0.22);
    --answer-option-incorrect-bg: rgba(239, 68, 68, 0.18);
    --palette-item-bg: rgba(226, 232, 240, 0.85);
    --palette-item-correct-bg: rgba(16, 185, 129, 0.26);
    --palette-item-incorrect-bg: rgba(239, 68, 68, 0.22);
    --palette-item-answered-bg: rgba(148, 163, 184, 0.3);
    --chart-rim: rgba(226, 232, 240, 0.95);
    --chart-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
    --callout-bg: rgba(226, 232, 240, 0.85);
    --callout-border: rgba(148, 163, 184, 0.4);
    --list-card-bg: rgba(255, 255, 255, 0.92);
    --list-card-border: rgba(148, 163, 184, 0.35);
    --answer-card-bg: rgba(248, 250, 252, 0.9);
    --answer-card-border: rgba(148, 163, 184, 0.35);
    --table-zebra-bg: rgba(226, 232, 240, 0.7);
    --table-bg: rgba(255, 255, 255, 0.95);
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow: hidden;
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
    background: var(--header-bg);
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
    border-color: var(--nav-button-accent-border);
    color: var(--primary);
  }

  .nav-button:hover {
    border-color: var(--nav-button-accent-border);
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
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 18px;
    padding: 22px 24px;
    box-shadow: var(--card-shadow);
  }

  .callout-card {
    background: var(--callout-bg);
    border-color: var(--callout-border);
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
    background: var(--stat-pill-bg);
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
    background: var(--modal-backdrop-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal {
    background: var(--modal-bg);
    border-radius: 18px;
    border: 1px solid var(--modal-border);
    box-shadow: var(--modal-shadow);
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
    padding-bottom: 140px;
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
    position: fixed;
    left: 28px;
    right: 28px;
    bottom: 28px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 28px;
    border-radius: 18px;
    background: var(--session-controls-bg);
    border: 1px solid var(--session-controls-border);
    box-shadow: var(--session-controls-shadow);
    backdrop-filter: blur(12px);
    z-index: 50;
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

  .markdown-content strong {
    font-weight: 700;
  }

  .markdown-content em {
    font-style: italic;
  }

  .markdown-content strong em,
  .markdown-content em strong {
    font-weight: 700;
    font-style: italic;
  }

  .markdown-content .katex-mathml {
    width: 0 !important;
    height: 0 !important;
    margin: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
    clip: rect(0, 0, 0, 0) !important;
    clip-path: inset(50%) !important;
    white-space: nowrap !important;
  }

  .markdown-content .katex-html {
    display: inline-block;
  }

  .markdown-content .katex-display {
    display: block;
    margin: 18px 0;
    text-align: center;
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
    background: var(--table-zebra-bg);
  }

  .markdown-table-wrapper {
    overflow-x: auto;
    border-radius: 12px;
  }

  .markdown-table-wrapper table {
    margin: 0;
    background: var(--table-bg);
  }

  .question-text {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.65;
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
      left: 16px;
      right: 16px;
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
    border: 1px solid var(--answer-option-border);
    padding: 16px;
    background: var(--answer-option-bg);
    cursor: pointer;
    transition: border 0.2s, transform 0.1s;
  }

  .answer-option-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    color: var(--text);
  }

  .answer-letter {
    font-weight: 600;
    flex: 0 0 auto;
    margin-top: 2px;
  }

  .answer-text {
    flex: 1 1 auto;
    font-size: 15px;
    line-height: 1.5;
  }

  .answer-text p:last-child {
    margin-bottom: 0;
  }

  .answer-option.selected {
    border-color: rgba(56, 189, 248, 0.8);
    background: var(--answer-option-selected-bg);
  }

  .answer-option.correct {
    border-color: rgba(52, 211, 153, 0.65);
    background: var(--answer-option-correct-bg);
  }

  .answer-option.incorrect {
    border-color: rgba(248, 113, 113, 0.45);
    background: var(--answer-option-incorrect-bg);
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

  .palette-card {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    max-height: min(520px, 70vh);
  }

  .palette-card .question-palette-container {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;
    margin-top: 4px;
    position: relative;
    border-radius: 14px;
  }

  .palette-card .question-palette-container::before,
  .palette-card .question-palette-container::after {
    content: '';
    position: absolute;
    left: 0;
    right: 8px;
    height: 20px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.18s ease;
    background: linear-gradient(to bottom, var(--card-bg), transparent);
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--card-bg) 92%, transparent),
      transparent
    );
    z-index: 1;
  }

  .palette-card .question-palette-container::before {
    top: 0;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }

  .palette-card .question-palette-container::after {
    bottom: 0;
    transform: rotate(180deg);
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }

  .palette-card .question-palette-container.has-scroll-shadow-top::before {
    opacity: 1;
  }

  .palette-card .question-palette-container.has-scroll-shadow-bottom::after {
    opacity: 1;
  }

  @media (max-width: 900px) {
    .palette-card {
      max-height: min(460px, 60vh);
    }
    .palette-card .question-palette-container::before,
    .palette-card .question-palette-container::after {
      height: 16px;
    }
  }

  .question-palette {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 8px;
  }

  .palette-item {
    padding: 12px 0;
    border-radius: 12px;
    background: var(--palette-item-bg);
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
    background: var(--palette-item-correct-bg);
    border-color: rgba(52, 211, 153, 0.6);
  }

  .palette-item.incorrect {
    background: var(--palette-item-incorrect-bg);
    border-color: rgba(248, 113, 113, 0.45);
  }

  .palette-item.answered {
    background: var(--palette-item-answered-bg);
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

  .category-scroll {
    max-height: 320px;
    overflow-y: auto;
    padding-right: 6px;
  }

  .category-scroll .bar-row:last-child {
    margin-bottom: 0;
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

  .create-answer-card {
    border-radius: 12px;
    border: 1px solid var(--answer-card-border);
    padding: 14px;
    margin-bottom: 12px;
    background: var(--answer-card-bg);
    display: flex;
    flex-direction: column;
    gap: 10px;
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

  .content-question-card {
    border-radius: 16px;
    border: 1px solid var(--list-card-border);
    padding: 18px;
    background: var(--list-card-bg);
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: background 0.2s ease, border 0.2s ease;
  }

  .content-question-card.selected {
    border-color: rgba(56, 189, 248, 0.45);
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
