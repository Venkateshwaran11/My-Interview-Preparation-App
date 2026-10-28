# InterviewForge — Interview Preparation App

A responsive interview practice app built with plain HTML, CSS and JavaScript. No framework, backend, account, API key or build step is required.

## Run it
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. For the most consistent local behavior, run a local static server from this folder (for example, VS Code Live Server).
4. Open the Dashboard → Daily challenge → AI setup, enter an OpenRouter API key and model ID, then choose **Generate AI questions**. The app uses five questions for the selected topic.
5. Choose **Practise today’s set** to answer them in the guided practice flow.

## Features
- Configure role, experience band, company type, skills, difficulty, question count and practice mode.
- Practice frontend (JavaScript, HTML/CSS, Angular, React, Vue), backend (Node.js, NestJS, Java, Python, REST APIs), MySQL, MongoDB, database design, RAG, GenAI, vector databases, DSA, system design, DevOps/testing and behavioral interviews.
- Guided mode with hints and answer guides; mock mode with a two-minute per-question timer.
- Answer text area, word count, self-confidence rating, skip and end-session controls.
- Session review, tailored practice suggestions, skill confidence chart, recent sessions and JSON export.
- Daily topic rotation across frontend, backend, databases, RAG/GenAI, system design, DSA and DevOps.
- Optional AI-generated daily question sets (5 questions) through OpenRouter, tailored to role, experience, company type and difficulty.
- Expandable answer guides, then one-click practice using the generated question set.
- AI key is held in sessionStorage for the current browser tab only; do not deploy this static app publicly with a personal API key. For a production app, proxy AI requests through a backend and keep provider keys server-side.
- Saves progress in the browser using localStorage.

## Important limitations
- Sample answer guides are learning prompts, not a guarantee of what an interviewer expects.
- Ratings are self-assessments, not AI evaluation or objective grading.
- This is a front-end-only app. AI question generation requires an OpenRouter API key, network access and an available model. There is no live AI answer grading, user account, cloud sync or server-side persistence.
- The question library is starter content and can be extended in `app.js`.
- Progress is stored in this browser profile. Clearing browser storage removes it.

## File structure
- `index.html` — page structure and views
- `styles.css` — responsive visual design
- `app.js` — question bank, session logic, timer and local progress
