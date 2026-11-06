# Veilward v1.2.7 — Phase 3 Streaming QA Record

**Feature:** Optional continuous outdoor test preview integrated into `game.js` and exposed through the real Journey Menu.

## QA checklist / expected behavior

| Test | Expected | QA method |
|---|---|---|
| Startup | Original snowy village works and current save loads | Existing quest game + menu integration |
| Preview enter | Pauses old quest, opens full global world on approved Wanderer sprite | Real game functions exercised in mocked DOM |
| Starting camera | Player visible on first streaming frame, not sliding in from off-screen | First-frame camera bounds assertions |
| Chunk streaming | No full-map eager allocation; visible tiles rasterize and draw | Cache and Canvas draw spies |
| Walking | Sequential passage through several chunk columns without global-position reset | Extended repeated movement simulation |
| Cache budget | Max 18 tile canvases of 375×375 each, ~10.1MB raw RGBA at peak | Repeated long-range movement/camera rendering |
| Waterways | Provisional lake blocker, river bridge and lake-island footbridge traverse | Geometry checks against authored crossings |
| Loading fallback | Unpainted view tiles get biome-colored fallback; black screen avoided | Render-path source and mock screen checks |
| Preserve quest | Enter, move, render, leave, save unchanged zone, character, quest state | Real-game action integration + serialized save check |
| Old sprites | Wanderer/Warden asset names and draw logic unchanged | Source protection tests |
| PWA | HTML and service-worker versions for JSON, script, CSS and manifest agree | Asset list assertions |
| Real iPhone quality | Check smoothness, visual placement, caching, input and PWA update | **Pending creator test, NOT machine verified** |

## Known limitations (not false passes)

This phase doesn't complete Phase 4 collision/elevation, Phase 5 final terrain art, Phase 6–8 visual geography, regional gameplay populations, or the Phase 9 creator appearance approval. It is a playable core demonstration and rollback-safe migration foundation. The temporary map does not yet look like the finished snowy/green pixel-art references.

**Regressions if any:** Patch on receipt of creator feedback, push to GitHub and verify the Home Screen version. Do not advance to Phase 4 until the next continuation instruction.
