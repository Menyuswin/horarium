# Horárium

Hungarian day-focus app: a single static file, `index.html`, no build step, no dependencies beyond Google Fonts.
Users say "horarium" or "hirarium" to start a development session on it.
Read `HANDOFF.md` first: it holds the user's decisions, what is built, the deployment workflow and the open items.

## Where things live

- Repo: `/home/mz-x/Projects/horarium`, GitHub `Menyuswin/horarium`, branch `main`.
- Live page (GitHub Pages): https://menyuswin.github.io/horarium/
- Claude artifact (private, same app): https://claude.ai/artifact/QFrFrcGtYcUhtfj2gJkTaQ
- Local run: `cd /home/mz-x/Projects/horarium && python3 -m http.server 8765 --bind 127.0.0.1`, then http://127.0.0.1:8765/index.html

## Data

- Local storage key `horarium-v1`. When the Claude `db` capability is available, the state is also synced to the user's document. `normalize()` must keep old saved states loading, so add new settings with defaults there, not by assuming they exist.
- Settings live in `S.settings`: targets, focus and break lengths, and `alerts` (off by default). There is no pre-filled schedule: each task carries its own optional `start` (HH:MM, `null` = unscheduled) directly, alongside its existing `plan` (duration in minutes). `S.plan[date]` only holds the day's workout choice (`workout`, `workoutDone`, `workoutCredit`), independent of any task.
- A task can be split into several occurrences via `splitId` (shared uid across the group, each occurrence its own `date`/`start`/`plan`); `splitLabel()` derives the "x/y. rész" badge on the fly, nothing is stored about ordering.
- `S.lastSeen` (date string) drives `carryOver()`: once per calendar day, every incomplete task dated before today moves to today with `start` cleared and `postponed` incremented. Runs at startup and from `alertsDue()`'s 15 s tick, so it also catches the app staying open across midnight.
- `S.sessions`: one record per finished focus block (planned and actual minutes, intent, done condition, outcome, pauses, distractions). Kept 90 days; the weekly statistics and the evening story read it.
- `S.settings.pet` (`on`, `species`, `name`) and `S.petMins` (total focus minutes, sets the pet level). `S.morning[date]` holds the morning answer (`text`, `taskId`) or `skip`.

## Structure of the script

- `overlaps(date,start,planMin,excludeId)`/`overlapFlash()`: a task's time only ever warns on conflict with another scheduled task that day, it never blocks the save. Called from the task add form and `taskForm`'s save.
- `dayPlanMins()`, `weekStatus()`: the derived day and week views, summed straight from `S.tasks` (no blocks layer).
- `beep()` plays the melody (`MELODY`) through Web Audio, used only by the focus timer's own start/end/break cues. `petSound(species)` is a separate, shorter WebAudio cue per pet species (bark/meow/chirp/whoosh/knock), used only by `alertsDue()`'s schedule alerts, together with a `petTrick()` call. `ensureAudio()` must run from a user gesture first.
- `alertsDue()` runs every 15 s, calls `carryOver()`, and fires sound (`petSound`), a pet trick and a notification when a scheduled task (one with `start` set) starts or its planned window ends. `tick()` handles the focus timer.
- `countdown()` updates the two live countdowns, once per second.
- `taskHtml()` and `taskForm()`: task rows (with their time range, overlap and split badges), their details panel and the edit form (title, mode, date, start, duration, project). The "Új alkalom" button in a task's open panel is the split action.
- `pauseTimer()`/`resumeTimer()` shift `startAt` so a paused block keeps its remaining time; `logSession()` writes the session record and credits the pet.
- `freeWindows()`/`suggestDeep()`: free gaps today between already-scheduled tasks, used to propose start times (not blocks) for up to two unscheduled tasks.
- `sessStats()`/`sessLessons()`: weekly statistics; lessons only with at least 8 rated blocks and a clear gap.
- Pet: `PETS`, `petSvg()` (inline SVG, species, mood 0–4, level 0–6), `petPanel()`, `petTrick()` and CSS classes `t-<trick>`. Nothing is ever taken away from the pet.
- `viewIntro()`: the first-visit guide (welcome, pet choice, four pages, first step). Shown while `S.onboarded` is false; old states with tasks or sessions count as onboarded.
- `morningHtml()`, `dayStory()` (evening sentences, varied per day by `dayPick()`), export/import in the settings view.
- Logo: `logoSvg()` (hourglass: loose grains above, ordered blocks below); the favicon is a bolder inline SVG, the apple-touch-icon an embedded PNG.
- Focus: length chosen at start (`startDur`), `extend` adds 10 min; deep work mode (`deep`, `deepHtml()`, `ambient()` generated sound); soft block via `visibilitychange` keeps `away` seconds on the session.
- `projNames()`/`projField()`: optional project on tasks and sessions. `weekReviewHtml()` (`S.weekly[monday]`), `monthHtml()`, `suggestDeep()` (`S.sug[date]`).
- Emotional intelligence (`S.settings.eq`: `on`, `freq` napi/3/keres): `FEELS`/`recordFeel()` (`S.feel`), `EQ_STEPS` (5 areas × 8) with `eqToday()`/`eqHtml()` (`S.eqd[date]`), breathing with the pet (`breathOn`), `EQ_EVE` evening question, `feelHtml()` weekly map; when hard feelings dominate it invites the user to write instead of pointing elsewhere. `feelBox()` lets the user write what they feel and `kindReply()` answers kindly (theme in the text first, else the feeling's group). No helpline numbers. Tone: kind, optional, never judging.
- Simplicity first: one main action per screen. `heroHtml()` is the Ma view's top card (current block, the task to start, countdown, one big button, the pet); below it at most one nudge at a time (morning question, else deep work suggestion, else the collapsed small step). `oneThingHtml()` shows the day's one thing; `petPanel(true)` is the compact pet card.
- `S.settings.simple` (default on) hides projects, deep work mode and the detailed week statistics; `simpleoff` and the settings switch bring them back. Settings are grouped in `<details class="sec">` (`sec()`, open state in `openSecs`). The day plan (`viewNapirend()`) is two lists of the day's own tasks via `taskHtml()`: "Beütemezve" (has a `start`, sorted) and "Időpont nélkül" (no `start` yet); the current one gets the `.task.now` outline, re-rendered each new minute by `countdown()` when nothing is being edited.
- Visual system: borderless cards with soft shadow (`--sh`), one accent (munka teal), mode colours only as small dots, icon + label bottom nav (`NAV_IC`).
- `render()` rebuilds the view; the click handler at the bottom switches on `data-act`.

## Token economy (the user asked for this)

- Start each new topic in a new session. `HANDOFF.md` and this file carry the history, so a long conversation is never needed: every turn re-sends the whole conversation, which is where most tokens go.
- Never read `index.html` whole (about 190 KB, roughly 60k tokens). Find the function with `grep -n`, then read only those lines (`sed -n 'A,Bp'` or Read with offset and limit). The structure notes above name the functions.
- Read only the parts of `HANDOFF.md` and the code that the new task needs. Do not re-read a file after editing it.
- Run `tests/run.sh` and read only its summary; look at a single test's output only when it fails.
- Look at screenshots only for visual changes, one or two per change, cropped to the element.
- Delegate wide searches to a subagent so only its conclusion enters the conversation.

## Writing rules

- The UI is Hungarian and addresses the user informally ("te": "Vegyél fel…", "Nyisd meg…"). The app speaks as "mi" ("Elmentettük…", "Itt vagyunk"). The tagline is "az idő a Te hasznodra".
- Write active sentences: Hungarian avoids passive constructions, so "Elmentettük az adataidat", never "Az adatai elmentve".
- Keep the app to one file.

## Checks before a commit

- Syntax: extract the `<script>` block and run `node --check` on it.
- Behaviour: headless Chromium with `playwright-core`. The checks live in `tests/` (one file per feature, `t01.js`…; `env.js` finds the app and Chromium). Run them all with `NODE_PATH=/opt/node-tools/node_modules tests/run.sh`; it lists every FAIL and exits non-zero. Add a new `tNN.js` for each new feature and keep the existing ones passing. Screenshots go to a temp folder, never into the repo.
- On this local machine (not the cloud sandbox) `/opt/node-tools` and `/opt/pw-browsers` don't exist. `npm install playwright-core` into a scratch dir and point `CHROMIUM` at the cached binary instead, e.g.:
  `NODE_PATH=<scratch>/node_modules CHROMIUM=$(find ~/.cache/ms-playwright -name chrome -path '*chrome-linux64*') tests/run.sh`

## Git and publishing

- Commit with the repo's author identity (`Menyuswin`) through `git -c user.name=... -c user.email=...`. The machine has no global git identity.
- Push to `main` and republish the Claude artifact only when the user asks. The harness's own auto-mode classifier blocks `git push` as a destructive action by default — expect a permission prompt (or an outright denial needing the user's explicit go-ahead) even after the user has said yes in principle.

## Session log

- 2026-10-17: this local checkout was 29 commits behind `origin/main` (a cloud session had already built the pet/EQ/focus-timer system on top of the original block-based day plan). Fast-forwarded first, then implemented the free-scheduling redesign described above (removed templates/blocks; tasks get their own `start`; overlap warning; `carryOver()`; task splitting; per-species `petSound()`). Pushed to `main` (`a58bfd5`) and republished the Claude artifact. Local test run (24/24 passing) verified independently of the implementing session before publishing.
