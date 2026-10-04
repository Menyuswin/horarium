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

## Structure of the script

- `defTemplates()`: the default weekday and weekend schedule blocks. Every default template must have no overlapping blocks for any workout choice. The swim block adds travel and changing windows (`CHANGE` = 10 min, `travel` from settings), and `dayItems()` marks overlaps with `conf`.
- `dayItems()`, `dayPlanMins()`, `weekStatus()`: the derived day and week views.
- `beep()` plays the melody (`MELODY`) through Web Audio. `ensureAudio()` must run from a user gesture first.
- `alertsDue()` runs every 15 s and fires sound and notifications for blocks that start or end. `tick()` handles the focus timer.
- `countdown()` updates the two live countdowns, once per second.
- `taskHtml()` and `taskForm()`: task rows, their details panel and the edit form.
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
