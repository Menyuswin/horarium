# Horárium

Hungarian day-focus app: a single static file, `index.html`, no build step, no dependencies beyond Google Fonts.
Users say "horarium" or "hirarium" to start a development session on it.

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
- `render()` rebuilds the view; the click handler at the bottom switches on `data-act`.

## Writing rules

- The UI is Hungarian and uses the polite "Ön" form for instructions ("Vegyen fel…", "Nyissa meg…"). Keep that register for new text.
- Keep the app to one file.

## Checks before a commit

- Syntax: extract the `<script>` block and run `node --check` on it.
- Behaviour: headless Chromium with `playwright-core`. Keep test scripts in the session scratchpad, not in the repo. The existing checks cover alerts, countdowns and task editing.

## Git and publishing

- Commit with the repo's author identity (`Menyuswin`) through `git -c user.name=... -c user.email=...`. The machine has no global git identity.
- Push to `main` and republish the Claude artifact only when the user asks.
