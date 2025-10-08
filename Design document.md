# GasBank Design Notes

## Purpose
- Deliver a self-contained anesthesiology study tool that runs entirely on the user's machine.
- Keep the core question set read-only while letting learners track progress, add custom content, and review analytics without needing an internet connection.

## Architecture
- **Platform:** Electron shell embedding a React single-page app.
- **Entry Point:** `electron/main.js` bootstraps the window, serves `src/index.html`, and exposes file-system helpers through `preload.js`.
- **Frontend Stack:** React (with hooks) plus lightweight CSS-in-JS globals. All first-party UI lives in `src/components`.
- **Persistence:**
  - `data/questions.json` ships with the app and remains immutable at runtime.
  - A per-user `userData.json` is stored under the OS-specific Electron `userData` directory on first launch. The path is fixed; users cannot relocate it.
  - The app automatically manages a sibling `images/` directory for custom question assets and surfaces the resolved paths in Settings.

## Data Flow
1. On launch the renderer calls `gasbank.loadData()`, which loads bundled questions and ensures `userData.json`/`images/`.
2. Renderer state is normalized in `src/utils/dataUtils.js` and distributed across views through React context/state lifting inside `App.jsx`.
3. Mutations (sessions, stats, custom questions, settings flags) call back into `gasbank.saveUserData`, which rewrites `userData.json` and guarantees the image directory exists.
4. Imports/exports and analytics derive from the same unified question list composed of shipped plus custom items.

## Key Views
- **Dashboard:** Presents mastery summaries, quick-actions for starting/resuming sessions, and review flows for incorrect or flagged items.
- **Session:** Runs active study sessions with support for tutor/exam modes, answer tracking, and per-question flagging.
- **History:** Lists prior sessions with high-level results and re-opening support. Recent question attempts stay in view thanks to a capped, scrollable table.
- **Content:** Browses, filters, imports/exports, and creates questions. Custom question forms provide five answer slots (users may leave extras blank) and enforce a single correct choice.
- **Settings:** Consolidates critical paths under a succinct “User Data” panel and exposes controls for editing the default session configuration (mode, filters, randomization) used when launching new study runs.

## Extensibility & Guardrails
- The renderer treats the default assets as canonical; any enhancements should continue to clone/normalize state before writes to avoid corrupting user data.
- Custom content expects images to live under the managed image directory; the UI only references filenames to keep paths portable across machines.
- File operations are centralized in the Electron main process to preserve sandbox boundaries and ease cross-platform support.
