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
- Settings live in `S.settings`: targets, focus and break lengths, travel minutes, the weekday and weekend templates, and `alerts` (off by default).
- `S.sessions`: one record per finished focus block (planned and actual minutes, intent, done condition, outcome, pauses, distractions). Kept 90 days; the weekly statistics and the evening story read it.
- `S.settings.pet` (`on`, `species`, `name`) and `S.petMins` (total focus minutes, sets the pet level). `S.morning[date]` holds the morning answer (`text`, `taskId`) or `skip`.

## Structure of the script

- `defTemplates()`: the default weekday and weekend schedule blocks. Every default template must have no overlapping blocks for any workout choice. The swim block adds travel and changing windows (`CHANGE` = 10 min, `travel` from settings), and `dayItems()` marks overlaps with `conf`.
- `dayItems()`, `dayPlanMins()`, `weekStatus()`: the derived day and week views.
- `beep()` plays the melody (`MELODY`) through Web Audio. `ensureAudio()` must run from a user gesture first.
- `alertsDue()` runs every 15 s and fires sound and notifications for blocks that start or end. `tick()` handles the focus timer.
- `countdown()` updates the two live countdowns, once per second.
- `taskHtml()` and `taskForm()`: task rows, their details panel and the edit form.
- `pauseTimer()`/`resumeTimer()` shift `startAt` so a paused block keeps its remaining time; `logSession()` writes the session record and credits the pet.
- `resizeBlock()` and `replanToday()`: duration buttons that push following blocks, and the re-plan of the rest of today.
- `sessStats()`/`sessLessons()`: weekly statistics; lessons only with at least 8 rated blocks and a clear gap.
- Pet: `PETS`, `petSvg()` (inline SVG, species, mood 0–4, level 0–6), `petPanel()`, `petTrick()` and CSS classes `t-<trick>`. Nothing is ever taken away from the pet.
- `viewIntro()`: the first-visit guide (welcome, pet choice, four pages, first step). Shown while `S.onboarded` is false; old states with tasks or sessions count as onboarded.
- `morningHtml()`, `dayStory()` (evening sentences, varied per day by `dayPick()`), export/import in the settings view.
- Logo: `logoSvg()` (hourglass: loose grains above, ordered blocks below); the favicon is a bolder inline SVG, the apple-touch-icon an embedded PNG.
- Focus: length chosen at start (`startDur`), `extend` adds 10 min; deep work mode (`deep`, `deepHtml()`, `ambient()` generated sound); soft block via `visibilitychange` keeps `away` seconds on the session.
- `projNames()`/`projField()`: optional project on tasks and sessions. `weekReviewHtml()` (`S.weekly[monday]`), `monthHtml()`, `suggestDeep()` (`S.sug[date]`).
- Emotional intelligence (`S.settings.eq`: `on`, `freq` napi/3/keres): `FEELS`/`recordFeel()` (`S.feel`), `EQ_STEPS` (5 areas × 8) with `eqToday()`/`eqHtml()` (`S.eqd[date]`), breathing with the pet (`breathOn`), `EQ_EVE` evening question, `feelHtml()` weekly map; when hard feelings dominate it invites the user to write instead of pointing elsewhere. `feelBox()` lets the user write what they feel and `kindReply()` answers kindly (theme in the text first, else the feeling's group). No helpline numbers. Tone: kind, optional, never judging.
- Simplicity first: one main action per screen. `heroHtml()` is the Ma view's top card (current block, the task to start, countdown, one big button, the pet); below it at most one nudge at a time (morning question, else deep work suggestion, else the collapsed small step). `oneThingHtml()` shows the day's one thing; `petPanel(true)` is the compact pet card.
- `S.settings.simple` (default on) hides projects, deep work mode and the detailed week statistics; `simpleoff` and the settings switch bring them back. Settings are grouped in `<details class="sec">` (`sec()`, open state in `openSecs`). Day plan blocks keep their changes behind one "…" button (`bOpen`). The day plan is a timeline (`timelineHtml()`): start times on a left axis, gaps kept, and an amber line at the current moment (`nowLine()`), moved every second by `countdown()` and re-rendered each new minute when nothing is being edited.
- Visual system: borderless cards with soft shadow (`--sh`), one accent (munka teal), mode colours only as small dots, icon + label bottom nav (`NAV_IC`).
- `render()` rebuilds the view; the click handler at the bottom switches on `data-act`.

## Writing rules

- The UI is Hungarian and addresses the user informally ("te": "Vegyél fel…", "Nyisd meg…"). The app speaks as "mi" ("Elmentettük…", "Itt vagyunk"). The tagline is "az idő a Te hasznodra".
- Write active sentences: Hungarian avoids passive constructions, so "Elmentettük az adataidat", never "Az adatai elmentve".
- Keep the app to one file.

## Checks before a commit

- Syntax: extract the `<script>` block and run `node --check` on it.
- Behaviour: headless Chromium with `playwright-core`. The checks live in `tests/` (one file per feature, `t01.js`…; `env.js` finds the app and Chromium). Run them all with `NODE_PATH=/opt/node-tools/node_modules tests/run.sh`; it lists every FAIL and exits non-zero. Add a new `tNN.js` for each new feature and keep the existing ones passing. Screenshots go to a temp folder, never into the repo.

## Git and publishing

- Commit with the repo's author identity (`Menyuswin`) through `git -c user.name=... -c user.email=...`. The machine has no global git identity.
- Push to `main` and republish the Claude artifact only when the user asks.
