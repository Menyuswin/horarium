# Horárium – handoff for the next session

Read this together with `CLAUDE.md` before changing anything. It records what the user decided, so nothing has to be asked twice.

## The user

- Zoltán, 52, has worked in communication for 25 years, not a programmer. Answer him in Hungarian, in literary register, thoroughly, with examples, and explain the why.
- In chat, address him formally ("Ön"). The app itself addresses its users informally ("te"); see the writing rules in `CLAUDE.md`.
- His three non-negotiables: consistency (what was agreed stays agreed), plan before larger work (offer a concrete proposal to discuss), and care with anything that would reach an audience in his name.
- He has allowed me to commit, push to `main` and republish the artifact on my own after a finished, tested phase ("Nem bánom, ha belenyúlsz és magadtól elvégzed").

## Vision and decisions

- Goal: a better, friendlier app than Forest, with real emotional impact. Not a copy.
- Motto: a page that makes you better and more efficient, and develops your emotional intelligence, kindly and unobtrusively.
- Tagline: "az idő a Te hasznodra". No passive voice anywhere ("Idő jól beosztva" was rejected for that reason).
- Logo: the hourglass (loose grains above, ordered blocks below). It stands for allocating time well.
- Pets only (dog, cat, rabbit, hamster, plus two imaginary ones: felhő, moha). The user names the pet. Pets "develop together with you" ("együtt fejlődik veled"), never "grow". Their development is mood, kindness and tricks; nothing is ever taken away.
- No helpline numbers. Instead the user can write down what they feel and the app answers kindly.
- Kind replies stay pre-written for now: many of them, matched to what the user wrote. AI-generated replies are a later idea.
- Simplicity first: user-friendly, easy, clear. Simple mode is on by default; the extra features are one tap away ("…" menus, collapsible settings groups, "több" links).
- The day plan is flexible in content and duration, and shows as a timeline with a time axis on the left and a "most" line.

## What is built (all on `main`, live on Pages and in the artifact)

- Today view: hero card with one next step, morning question, deep-work suggestion, EQ step (at most one nudge at a time).
- Focus timer: chosen length (25/50/90/custom), +10 min, pause and resume, intent and done condition, reflection with feeling chips, deep work mode with generated ambient sound, soft block that records time away.
- Day plan: weekday and weekend templates, workout choice with swim travel windows, resize and push following blocks, re-plan the rest of today, timeline with the live "most" line.
- Pet panel with drawn SVG pets (mood 0–4, level 0–6), tricks, daily mood lines, breathing together.
- Emotional intelligence: 16 feelings in 4 groups, 40 small steps in 5 areas, evening question, weekly feeling map, free writing with `kindReply()` (23 themes × 3 replies, word replies, companion line for a second theme).
- Reviews: weekly statistics and lessons, weekly review, monthly view, evening story.
- First-visit guide (7 pages), alerts with the melody, export and import, logo, favicon, apple-touch-icon, light and dark theme.

## Workflow that works

- Edit `index.html`, run the syntax check and Playwright tests (see `CLAUDE.md`), take screenshots for visual changes.
- Commit, push the session branch, then `git push origin HEAD:main`.
- Check the Pages build with the GitHub MCP tool `actions_list` (workflow "pages build and deployment"); the session proxy blocks `github.io`, so the live page cannot be fetched directly.
- Republish the artifact: `Artifact` publish with `url` https://claude.ai/artifact/QFrFrcGtYcUhtfj2gJkTaQ (read it first in a new session). It declares the `db`, `user` and `downloads` capabilities; keep them.
- The test scripts (t1–t19) and screenshot helpers lived in the session scratchpad and are gone. Recreate the checks you need; the user may decide to keep tests in the repo.

## Open items

- The user may review the 40 EQ steps and the ~140 kind replies; change their wording only with him.
- Possible next features: Google Calendar import of events into the day plan; AI-written kind replies through the artifact's `sample` capability (deferred by the user).
- Keep `CLAUDE.md` and this file current at the end of each session.
