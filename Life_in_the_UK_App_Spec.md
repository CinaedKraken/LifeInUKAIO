# Product Specification: Bilingual "Life in the UK" Mock Test Web App

## 1. Project Overview
**Objective:** Build a serverless, mobile-first web application for Hong Kongers taking the "Life in the UK" test. The app provides bilingual (English and Traditional Chinese) mock tests mirroring the official exam format. 
**Target Audience:** Users aged 20 to 60+. Must be highly accessible, intuitive, and extremely easy to read on mobile devices.
**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS v4, Vitest.
**Hosting:** GitHub Pages (Static website static export, no database).

---

## 2. Accessibility & UI/UX Guidelines (Crucial for Elderly Users)
Since users may be 60+ years old and using mobile phones, the UI must prioritize extreme clarity over modern minimalism.

*   **Typography:** 
    *   Base font size must be at least `18px` (text-lg in Tailwind). 
    *   Use clean, highly legible sans-serif fonts (e.g., system-ui, Inter, Roboto).
    *   Line height should be generous (leading-relaxed or 1.6).
*   **Color Palette (High Contrast):**
    *   Background: Off-white/cream (e.g., `#F9FAFB` or `#F8F9FA`) to reduce eye strain.
    *   Primary Text: Very dark grey, not pure black (e.g., `#111827`).
    *   Secondary Text (Chinese Translation): Slightly lighter grey (e.g., `#4B5563`) or a distinct but readable blue/navy tone to visually separate it from the English text without losing contrast.
    *   Success/Correct: High contrast Green (e.g., `#166534` background, white text).
    *   Error/Incorrect: High contrast Red (e.g., `#991B1B` background, white text).
*   **Tap Targets & Interaction:**
    *   All clickable elements (buttons, multiple-choice options) MUST have a minimum height of `48px` (Tailwind `min-h-[48px]`).
    *   Add clear borders to multiple-choice options so they look like distinct, clickable cards.
    *   When an option is selected, give it a thick border and a subtle background color change so the selection state is blatantly obvious.
*   **Bilingual Layout & Toggle Feature:**
    *   Do not put English and Chinese side-by-side on mobile; it makes text too small.
    *   **Stack them:** English text on top (bolded or slightly larger), Traditional Chinese immediately below it in standard weight. Apply this to questions, options, and explanations.
    *   **Language Toggle:** Implement a global toggle in the navigation bar to allow users to turn Chinese text on or off. State must be preserved across sessions.

---

## 3. Core Features & User Flow

### A. The Dashboard (Home Screen)
*   **Welcome Banner:** Bilingual welcome and instructions.
*   **Mock Test Sets List:** 
    *   The app should read the JSON data and generate a list of available test sets (e.g., "Mock Exam Set 1", "Mock Exam Set 2", up to "Mock Exam Set 15").
    *   **Progress Tracking:** Use the browser's `localStorage` to save the user's progress. 
    *   Each set on the dashboard should display a status tag: 
        *   `Not Started` (Grey)
        *   `Completed: 20/24 - PASS` (Green)
        *   `Completed: 15/24 - FAIL` (Red)
    *   This allows users to easily see which sets they have finished and which ones to do next.

### B. The Mock Test Engine
*   **Official Rules Enforcement:**
    *   24 questions per set.
    *   Pass mark is 18/24 (75%).
*   **The UI Layout:**
    *   **Sticky Header:** Displays the Set Number (e.g., "Set 1") and a large Countdown Timer (45:00). If the timer hits 00:00, auto-submit the test.
    *   **Progress Bar:** A thick, visible progress bar showing how many questions have been answered (e.g., "Question 5 of 24").
    *   **Question View:** Display exactly ONE question per screen to prevent users from losing their place. Include large "Previous" and "Next" buttons at the bottom.
*   **Submission:** On the 24th question, the "Next" button becomes a large, prominent "Submit Test" button. Prompt a confirmation dialog before submitting.

### C. Results & Review Screen
*   **Score Header:** Massive, bilingual text displaying "Pass" or "Fail" based on the 18/24 threshold, followed by their exact score.
*   **Review Section:** A scrollable list of all 24 questions from the test.
    *   Highlight the user's chosen answer.
    *   Clearly mark if it was correct (Green checkmark) or wrong (Red cross).
    *   If wrong, highlight the correct answer.
    *   **Crucial:** Display the bilingual "Explanation" box below the answers so the user can learn from their mistake.

---

## 4. Data Architecture (No Database)

All questions will be stored in a static JSON file (`src/data/mock_tests.json`). 

**JSON Schema:**
```json
[
  {
    "setId": 1,
    "title": { "en": "Mock Exam Set 1", "zh": "模擬考試 第一套" },
    "questions": [
      {
        "id": "1-1",
        "question": {
          "en": "What year did the Battle of Hastings take place?",
          "zh": "黑斯廷斯戰役發生在哪一年？"
        },
        "options": [
          { "id": "A", "text": { "en": "1066", "zh": "1066" }, "isCorrect": true },
          { "id": "B", "text": { "en": "1215", "zh": "1215" }, "isCorrect": false },
          { "id": "C", "text": { "en": "1415", "zh": "1415" }, "isCorrect": false },
          { "id": "D", "text": { "en": "1914", "zh": "1914" }, "isCorrect": false }
        ],
        "explanation": {
          "en": "William the Conqueror defeated King Harold at the Battle of Hastings in 1066.",
          "zh": "征服者威廉於1066年在黑斯廷斯戰役中擊敗了哈羅德國王。"
        }
      }
      // ... 23 more questions
    ]
  }
  // ... More Sets
]
```

---

## 5. Instructions for the Antigravity Agent

Please execute the following tasks in order:

**Phase 1: Data Parsing**
1. Look into the `Sources` directory in this workspace. Read the provided text/PDF/Word files containing the Life in the UK study materials and questions.
2. Extract the questions, correct answers, and explanations.
3. Translate all extracted content into Traditional Chinese (繁體中文).
4. Organize the questions into batches of 24.
5. Create `src/data/mock_tests.json` following the exact schema provided in Section 4.

**Phase 2: App Setup & Configuration (COMPLETED)**
1. Initialize a Next.js (App Router) application with TypeScript.
2. Install and configure Tailwind CSS v4.
3. Set up the GitHub Pages deployment configuration:
   - Add `"homepage": "https://<your-github-username>.github.io/<repository-name>"` to `package.json`.
   - Install the `gh-pages` npm package.
   - Add deploy scripts: `"predeploy": "npm run build", "deploy": "gh-pages -d build"`.

**Phase 3: Component Development**
1. Build the **Dashboard Component**: Implement `localStorage` to read/write `mockTestProgress` object (e.g., `{ 1: { score: 20, passed: true }, 2: null }`). Render the list of sets with status tags.
2. Build the **Test Engine Component**: Implement the 45-minute countdown timer, the 1-question-per-screen state management, and the answer selection logic. Ensure minimum 48px tap targets.
3. Build the **Results & Review Component**: Implement the grading logic (>=18 passes) and the review list showing the bilingual explanations for each question.

**Phase 4: Styling & Accessibility Pass**
1. Apply the color palette and typography rules from Section 2.
2. Ensure English text and Chinese text are stacked (flex-col) inside buttons and text blocks, not side-by-side. 
3. Run a final test simulating a mobile viewport to ensure no horizontal scrolling and all buttons are easily tappable.

---

## 6. Knowledge Distillation (Lessons Learned)

### Next.js Static Export on GitHub Pages
1. **The `_next` 404 Issue:** By default, GitHub Pages uses Jekyll, which ignores directories starting with an underscore (like `_next`). To solve this, you must deploy a `.nojekyll` file at the root. When using `gh-pages`, the CLI ignores dotfiles, so you must use the `-t` or `--dotfiles` and `--nojekyll` flags (`gh-pages -d out -t --nojekyll`).
2. **PWA Manifest 404:** Hardcoding `<link rel="manifest" href="/manifest.json" />` inside `layout.tsx` is prone to path resolution issues when deployed on a subpath (e.g., `/LifeInUK`). Use the native `app/manifest.ts` file provided by Next.js App Router (ensuring it exports `const dynamic = "force-static"`). Next.js will automatically generate the correct `<link>` tags respecting `basePath` and `assetPrefix`.
3. **Dynamic Routes Prefetch Bug (`__next.test.[setId].txt`):** When using `output: "export"` with dynamic routes (`[setId]`), the Next.js client-side router may incorrectly attempt to fetch the dynamic template payload instead of the fully generated static file when a user hovers over a `<Link>`. To fix this:
   - Ensure `export const dynamicParams = false;` is declared in the dynamic `page.tsx` so Next.js knows there are strictly no dynamic parameters.
   - Set `trailingSlash: true` in `next.config.ts` to map static paths perfectly to index.html structures, which GitHub pages inherently supports.
   - Set `prefetch={true}` explicitly on `<Link>` components for dynamic routes to force the router to fetch the exact static payload rather than the generic template.
