# GasBank

**Free, open-source anesthesiology question bank built for medical students and interns.**

Support project costs: [Donate on PayPal](https://www.paypal.com/donate/?hosted_button_id=E9AH3MYABRBAL)

- 1,000 clinical anesthesia questions aligned with ABA basic content.
- 100% free forever — app and questions are open source.
- Bridges the gap between USMLE Step 2 prep and CA-1 year.
- Backed by high-quality LLM drafting (GPT-5 reasoning) and cross-reviewed (Gemini 2.5 Pro) before inclusion.

---

## Built for Students

- **Residency-ready content**: Focused explanations and objectives highlight what matters in the OR.
- **Interactive practice**: Tutor & Exam modes, built-in analytics, and snapshots of your performance by category.
- **Offline-first**: Runs entirely on your machine without logins.
- **Keep costs down**: A free alternative to pricey subscriptions.

---

## Features at a Glance

- 📊 **Dashboard insights** with quick actions to review incorrect or flagged questions.
- 🧠 **Session configurator** that filters by topic, difficulty, status, and custom content.
- ✍️ **Custom question authoring** with Markdown + KaTeX support for didactics and math.
- 🧾 **History tracking** to revisit prior sessions and monitor progress.
- 💾 **Automatic & manual backups** so your progress is always safe.
- 🎨 **Adaptive themes** (system, dark, light) with polished UI for long study blocks.

---

## Quick Start

1. **Install Node.js (includes npm)**
   - Visit [https://nodejs.org](https://nodejs.org) and download the “LTS” installer for your operating system (Windows or macOS).
   - Run the installer with the default options. This installs both Node.js and the npm tool you will use in the next steps.
   - After installation, open a new Terminal (macOS) or Command Prompt (Windows) and type `npm -v`. If you see a version number, npm is ready.
2. **Download GasBank**
   - On this GitHub page, click the green `Code` button, then `Download ZIP`, and unzip the file to a folder you can find easily (for example, your Desktop).
3. **Open the project folder in a terminal**
   - macOS: Open Terminal, type `cd ` (note the space), drag the GasBank folder into the window, then press Enter.
   - Windows: Open Command Prompt, type `cd `, drag the GasBank folder into the window, and press Enter.
4. **Install the app’s dependencies**
   ```bash
   npm install
   ```
5. **Build an installer for your OS**
   ```bash
   npm run make
   ```
   When the command finishes, open the new `out/make` folder inside GasBank. Choose the installer that matches your computer (for example, the `.exe` file on Windows or the `.dmg`/`.zip` file on macOS). Run it now or copy it wherever you want.

---

## Contribute & Support

We welcome:

- New question ideas (especially image-based cases!).
- Feedback on UX and performance.
- Pull requests that improve accessibility, speed, or content.

---

## License

GasBank is released under the MIT License.
