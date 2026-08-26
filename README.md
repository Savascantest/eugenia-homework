# Eugenia Homework Workspace

Interactive English homework and revision platform for Eugenia.

## Homework history

The app now keeps dated homework sets instead of replacing old work.

- **Homework 3 · 25 August 2026** opens by default and is marked **Latest**.
- **Homework 2 · 21 August 2026** remains available from the homework switcher.
- **Homework 1 · 18 August 2026** remains available from the homework switcher.

Homework 3 is based on the Aug 25 lesson and focuses on:

- question word order with do/does and BE
- adverbs of frequency
- routines vs temporary situations
- personality traits supported by reasons and examples
- first impressions and icebreakers in context
- transcript-based word-order practice, a five-exchange conversation, a longer reading, external listening, short writing, and a 20-question final quiz

The permanent app keeps one idempotent dated package per lesson under `public/homeworks/` and generates a newest-first index during every build. The original Homework 1 and Homework 2 experiences and their browser-local progress keys remain unchanged.

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
