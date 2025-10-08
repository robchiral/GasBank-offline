# GasBank Design Notes

## Purpose
- Deliver a self-contained anesthesiology study tool that runs entirely on the user's machine.
- Keep the core question set read-only while letting learners track progress, add custom content, and review analytics without needing an internet connection.

## Architecture
- **Platform:** Electron shell embedding a React single-page app.
- **Entry Point:** `electron/main.js` bootstraps the window, serves `src/index.html`, and exposes file-system helpers through `preload.js`.
- **Frontend Stack:** React (with hooks) plus lightweight CSS-in-JS globals. All first-party UI lives in `src/components`.
- **Rich Content Rendering:** Question prompts, stems, and didactic summaries flow through `react-markdown` with the GitHub-flavored Markdown plugin so tables, lists, and other Markdown affordances render consistently inside the app.
- **Persistence:**
  - `data/questions.json` ships with the app and remains immutable at runtime.
  - A per-user `userData.json` is stored under the OS-specific Electron `userData` directory on first launch.
  - A sibling `gasbank.config.json` lives in the same directory and records the active `userData.json` path plus the resolved custom image directory so the main process can restore state before loading renderer data.
  - Core questions reference assets under `data/images/`; custom questions load images from the managed `<user-data>/images/` directory. Settings surfaces both paths so authors know where to place files.
  - The renderer can schedule timestamped backups of `userData.json` to a user-selected directory. Manual backups are one-click; auto-backups default to every 10 recorded attempts and reset the attempt counter after each successful write.

## Data Flow
1. On launch the renderer calls `gasbank.loadData()`, which loads bundled questions and ensures `userData.json`/`images/`.
2. Renderer state is normalized in `src/utils/dataUtils.js` and distributed across views through React context/state lifting inside `App.jsx`.
3. Mutations (sessions, stats, custom questions, settings flags) call back into `gasbank.saveUserData`, which rewrites `userData.json` and guarantees the image directory exists.
4. Imports/exports and analytics derive from the same unified question list composed of shipped plus custom items.

## Key Views
- **Dashboard:** Presents mastery summaries, quick-actions for starting/resuming sessions, and review flows for incorrect or flagged items.
- **Session:** Runs active study sessions with support for tutor/exam modes, answer tracking, and per-question flagging. Prompt/stem/didactic regions render Markdown (tables, lists, emphasis) and navigation now sits in a sticky bottom control bar so Flag/Previous/Next/End/Exit stay aligned within reach.
- **History:** Lists prior sessions with high-level results and re-opening support. Recent question attempts stay in view thanks to a capped, scrollable table.
- **Content:** Browses, filters, imports/exports, and creates questions. The custom question editor starts with two answer slots, lets authors add/remove choices up to six, and requires every visible answer to contain text while keeping explanations/objectives optional. A shared builder now seeds and resets editor state so the Add Answer area and subsequent didactic fields stay consistently spaced while also avoiding stale data. A single correct answer is still enforced.
- **Settings:** Consolidates critical paths under a succinct “User Data” panel, exposes backup directory and auto-backup controls, and lets users adjust the default session configuration (mode, filters, randomization) used when launching new study runs. The Backups card now groups directory info, action buttons, and auto-backup preferences into clearer sections with aligned checkbox and interval controls.
- **Session Configurator:** Modal for assembling session parameters now shows the live count of questions matching the selected filters, uses a multi-select dropdown for category filtering, and prevents launching when the pool is empty.

## Extensibility & Guardrails
- The renderer treats the default assets as canonical; any enhancements should continue to clone/normalize state before writes to avoid corrupting user data.
- Core asset references stay rooted in `data/images/`, while custom content expects images to live under the managed user-data `images/` directory; the UI only references filenames to keep paths portable across machines.
- Backup automation relies on accurate attempt tracking; filesystem helpers guard against missing directories before writing timestamped snapshots.
- File operations are centralized in the Electron main process to preserve sandbox boundaries and ease cross-platform support.
- Shared form helpers (`field-group`, `checkbox-inline`) keep checkbox-based controls vertically aligned with their peer inputs, reducing ad-hoc spacing overrides when new settings panels are added.
- Question content accepts GitHub-flavored Markdown so authors can embed lists, tables, emphasis, and hyperlinks inside prompts or didactics without introducing custom HTML.
