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
- Day plan: no pre-filled templates or sávok any more. Each task carries its own optional start time and duration, set freely by the user; a conflicting time warns (never blocks) via `overlaps()`. Unfinished tasks from earlier days carry over to today automatically, losing their old time so the user gives them a new one (`carryOver()`). A task can be split into several occurrences across different days (`splitId`, the "Új alkalom" button). The workout choice (úszás/torna/pihenőnap, "megvolt") stays as its own day-level panel, independent of scheduling; the swim travel/changing-time padding that used to come from the removed block system is gone. The pet makes a species-fitting sound (`petSound()`, separate from the focus timer's melody) when a scheduled task starts or its time is up.
- Pet panel with drawn SVG pets (mood 0–4, level 0–6), tricks, daily mood lines, breathing together.
- Emotional intelligence: 16 feelings in 4 groups, 40 small steps in 5 areas, evening question, weekly feeling map, free writing with `kindReply()` (23 themes × 3 replies, word replies, companion line for a second theme).
- Reviews: weekly statistics and lessons, weekly review, monthly view, evening story.
- First-visit guide (7 pages), alerts with the melody, export and import, logo, favicon, apple-touch-icon, light and dark theme.

## Workflow that works

- Edit `index.html`, run the syntax check and Playwright tests (see `CLAUDE.md`), take screenshots for visual changes.
- Commit, push the session branch, then `git push origin HEAD:main`.
- Check the Pages build with the GitHub MCP tool `actions_list` (workflow "pages build and deployment"); the session proxy blocks `github.io`, so the live page cannot be fetched directly.
- Republish the artifact: `Artifact` publish with `url` https://claude.ai/artifact/QFrFrcGtYcUhtfj2gJkTaQ (read it first in a new session). It declares the `db`, `user` and `downloads` capabilities; keep them.
- The browser checks are in `tests/` (the user agreed to keep them in the repo); run `tests/run.sh` before every commit. Screenshot helpers and mockups were scratchpad-only and are gone.

## Open items

- The user may review the 40 EQ steps and the ~140 kind replies; change their wording only with him.
- Possible next features: Google Calendar import of events into the day plan; AI-written kind replies through the artifact's `sample` capability (deferred by the user).
- The free-scheduling redesign dropped the swim travel/changing-time padding that the old block system computed automatically (travel minutes to the pool, 10 min changing before/after). If the user wants that back, it would need to hang off a scheduled edzés-mode task rather than a block.
- Keep `CLAUDE.md` and this file current at the end of each session.
