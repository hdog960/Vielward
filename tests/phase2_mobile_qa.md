# Veilward Phase 2 — Mobile and Home Screen QA

Target build: **1.2.2**. All checks below are **simulated runtime/unit checks**. Physical iPhone acceptance remains the creator's next playtest.

## Confirmed implemented

- Controller joystick binds to the first pointer ID until release. Additional touches cannot steal its pointer; pointercancel and lostpointercapture stop movement.
- Pressing a combat or Talk button while the joystick is engaged works without triggering an extra synthetic click.
- Touch action response occurs on pointerdown. Mouse and keyboard click remain supported.
- On modal open, pagehide, blur, and background visibility transitions, the joystick resets; background/pagehide save local progress.
- The interaction picker now evaluates physical distance first, with minor penalties for portal travel and the hound so nearby NPC dialogue is easier to select.
- Pause menu displays the **live running JS build** (`v1.2.2`) instead of relying solely on a static HTML version string.
- Service worker attempts update checks on load, pageshow, foreground/focus; `updateViaCache:"none"`; per-build reload guard; on activation removes old `veilward-` caches and advances old clients once.
- Service-worker fetch falls back to precached `index.html` for offline launch URLs that have a `?vwbuild` parameter.
- Consistent source version links: `game.js?v=14`, `visual.js?v=29`, `visual.css?v=8`, `manifest.webmanifest?v=122`, `?art=19`.
- Original key `veilward-hollowreach-v01` and player tick logic remain unchanged.

## Synthetic tests performed

| Area | Result |
|---|---|
| 10 touch input scenarios (single joystick owner, second finger ignored, attack/talk one-shot, pointer cancel, keyboard click, pause release, pagehide/visibility saves) | PASS |
| 6 interaction scenarios (Warden vs hound, hound nearest, guard vs portal, portal alone, no remote target, nearby herb) | PASS |
| Simulated service worker activation: old cache deleted, clients claimed, one stale client navigated, current-version client not navigated again | PASS |
| Offline `?vwbuild=1.2.2` navigation found precached `index.html`; network-first request used `cache:"no-store"` | PASS |
| JS syntax check: `game.js`, `visual.js`, `sw.js` | PASS |
| Hero rendering source unchanged except build strings; combat/movement tick byte-for-byte unchanged | PASS |

## Requested iPhone acceptance checks

1. Launch the **Home Screen icon**, open Journey Menu, confirm **Running build v1.2.2**. If it says an older build, report the shown version. Avoid deleting the Home Screen app until we diagnose any stale install.
2. Walk using the left thumb while simultaneously pressing Strike/Spell/Dodge with the right thumb; confirm movement stays under the left thumb.
3. Press Talk near Warden Hal and Ash to confirm the intended NPC dialogue is selected without unwanted portal travel.
4. Cancel a joystick drag or open Inventory while walking; verify the character stops immediately.
5. Switch apps briefly, resume Veilward, and verify your progress and saved inventory remain.
6. Test offline launch after first online start. It should load precached resources (offline world behavior depends on previously cached assets).

**No manual iOS or actual GitHub Pages deployment check was performed during this phase.** Stop after Phase 2.
