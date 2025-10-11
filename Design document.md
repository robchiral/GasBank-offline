# GasBank Design Notes

## Purpose
- Deliver a self-contained anesthesiology study tool that runs entirely on the user's machine.
- Keep the core question set read-only while letting learners track progress, add custom content, and review analytics without needing an internet connection.

## Architecture
- **Platform:** Electron shell embedding a React single-page app.
- **Entry Point:** `electron/main.js` bootstraps the window, serves `src/index.html`, and exposes file-system helpers through `preload.js`.
- **Frontend Stack:** React (with hooks) plus lightweight CSS-in-JS globals. All first-party UI lives in `src/components`.
- **Rich Content Rendering:** Question prompts, answer choices, stems, and didactic summaries flow through `react-markdown` with GitHub-flavored Markdown plus `remark-math`/`rehype-katex`, enabling tables, lists, emphasis, and inline or block equations to render consistently inside the app.
- **Persistence:**
  - `data/questions.json` ships with the app and remains immutable at runtime.
  - A per-user `userData.json` is stored under the OS-specific Electron `userData` directory on first launch.
  - A sibling `gasbank.config.json` lives in the same directory and records the active `userData.json` path plus the resolved custom image directory so the main process can restore state before loading renderer data.
  - Core questions reference assets under `data/images/`; custom questions load images from the managed `<user-data>/images/` directory. Settings surfaces both paths so authors know where to place files.
  - The renderer can schedule timestamped backups of `userData.json` to a user-selected directory. Manual backups are one-click; auto-backups default to every 10 recorded attempts and reset the attempt counter after each successful write.

## Data Flow
1. On launch the renderer calls `gasbank.loadData()`, which loads bundled questions and ensures `userData.json`/`images/`.
2. Renderer state is normalized in `src/utils/dataUtils.js`—`prepareQuestions` precomputes each question’s `correctAnswerIndex` while `normalizeUserData` hydrates persisted settings—and then distributed across views through React context/state lifting inside `App.jsx`.
3. Mutations (sessions, stats, custom questions, settings flags) call back into `gasbank.saveUserData`, which rewrites `userData.json` and guarantees the image directory exists.
4. Imports/exports and analytics derive from the same unified question list composed of shipped plus custom items.

## Key Views
- **Dashboard:** Puts quick actions up front so learners can immediately launch or resume study flows, keeps mastery summaries visible, and now wraps the category breakdown in a scrollable list that gracefully handles large specialty sets while still surfacing review flows for incorrect or flagged items.
- **Session:** Runs active study sessions with support for tutor/exam modes, answer tracking, and per-question flagging. Prompt/stem/didactic regions and answer choices render Markdown (tables, lists, emphasis, KaTeX), navigation sits in a fixed bottom control bar so Flag/Previous/Next/End/Exit stay aligned within reach without shifting when explanations expand, and the Question Palette now caps its height with an internal scroll (showing soft edge fades only when content overflows) so large exams keep the right-rail compact without harsh cutoffs. The top metadata row now surfaces question ID, category, and mixed-case difficulty on a single line for quicker orientation.
- **History:** Lists prior sessions with high-level results and re-opening support. Recent question attempts stay in view thanks to a capped, scrollable table, and each row now highlights the educational objective instead of repeating the full stem. The Session History card appears before the attempts table so users see whole-session summaries first.
- **Content:** Browses, filters, imports/exports, and creates questions. The custom question editor starts with two answer slots, lets authors add/remove choices up to six, and requires every visible answer to contain text while keeping explanations/objectives optional. A shared builder now seeds and resets editor state so the Add Answer area and subsequent didactic fields stay consistently spaced while also avoiding stale data. Question lists surface the educational objective alongside metadata so the browser stays concise, and filter copy now mirrors the session configurator (e.g., “All categories,” “All levels”) so language stays consistent. A single correct answer is still enforced.
- **Settings:** Adds a dedicated appearance selector (system, light, or dark) alongside the existing “User Data” panel, backup directory/automation controls, and session defaults (now clamped to 1–100 questions) so learners can tailor both visuals and behavior. Default sessions now seed 20 questions, and the Backups card groups directory info, action buttons, and auto-backup preferences into clearer sections with aligned checkbox and interval controls.
- **Session Configurator:** Modal for assembling session parameters now shows the live count of questions matching the selected filters, uses a multi-select dropdown for category filtering, enforces a 1–100 question range in the picker, defaults to 20 questions, and prevents launching when the pool is empty.

## Extensibility & Guardrails
- The renderer treats the default assets as canonical; any enhancements should continue to clone/normalize state before writes to avoid corrupting user data.
- Core asset references stay rooted in `data/images/`, while custom content expects images to live under the managed user-data `images/` directory; the UI only references filenames to keep paths portable across machines.
- Backup automation relies on accurate attempt tracking; filesystem helpers guard against missing directories before writing timestamped snapshots.
- File operations are centralized in the Electron main process to preserve sandbox boundaries and ease cross-platform support.
- The shared `clone` helper prefers `structuredClone` (when available) before falling back to JSON serialization so state updates stay defensive without incurring unnecessary copy cost.
- Toast notifications share a managed timeout ref so rapid successive messages replace one another cleanly and the timer clears on unmount, preventing stale callbacks in long-running sessions.
- Shared form helpers (`field-group`, `checkbox-inline`) keep checkbox-based controls vertically aligned with their peer inputs, reducing ad-hoc spacing overrides when new settings panels are added, and the theme token palette (`--bg`, `--card-bg`, `--session-controls-bg`, etc.) keeps light/dark styling centralized.
- Question content accepts GitHub-flavored Markdown (with KaTeX-backed math) so authors can embed lists, tables, emphasis, hyperlinks, and equations inside prompts or didactics without introducing custom HTML.
- Session configuration helpers live in a shared utility (`sessionConfig.js`) so every entry point (defaults, configurator modal, persisted state) applies the same 1–100 question clamp and bool sanitization, reducing drift between UI validation and stored values.
