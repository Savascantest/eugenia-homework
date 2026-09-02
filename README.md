# Eugenia Homework Workspace

Interactive English homework and revision platform for Eugenia.

## Homework history

The app now keeps dated homework sets instead of replacing old work.

- **Homework 5 · 1 September 2026** opens by default and is marked **Latest**.
- **Homework 4 · 29 August 2026**, **Homework 3 · 25 August 2026**, **Homework 2 · 21 August 2026**, and **Homework 1 · 18 August 2026** remain available from the homework switcher.

Homework 5 combines the 29 August and 1 September lessons and focuses on:

- broad stative-verb categories
- simple forms for states and continuous forms for genuinely active meanings
- English-only flip flashcards with example sentences
- day-to-day contrasts with think, have, see, taste, smell, feel, look, be and weigh
- a manageable review of hobby vocabulary, preference strength, follow-up questions and verb-preposition partnerships
- interactive practice, conversation, reading, built-in listening, short writing, mistake review and a 20-question final quiz

The permanent app keeps one idempotent dated package per lesson under `public/homeworks/` and generates a newest-first index during every build. All earlier experiences and their browser-local progress keys remain unchanged.

Progress is stored locally in the student's browser and is separated by homework date.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The Vite base path is `/eugenia-homework/` for GitHub Pages.
