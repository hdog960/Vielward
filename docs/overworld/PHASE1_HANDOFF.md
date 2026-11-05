# VEILWARD — Overworld Rebuild Phase 1 Handoff

**Status: COMPLETE — documentation, evidence, source protection, and migration requirements only.**  
**Completed:** November 5, 2026. **Audited live build:** v1.2.6, GitHub commit `dde016f184223eae9bc90a8f427905f3f13cdeb4`.  
**Implementation scope:** No gameplay, player character, scene illustration, collision mesh, UI or service-worker update is performed in Phase 1; the existing playable app remains intact. Phase 2 begins only on explicit creator continuation.

## Completed source audit

- Reviewed the entire 12-page creator PDF including screenshot pages and p.12's overworld-first directive. The content of that user-provided PDF is **not copied to the public GitHub repository**; only derived, source-labeled acceptance notes are committed.
- Registered **34 stable issue IDs**, of which 33 trace back to specific PDF pages and one is the later Phase 9 creator appearance-approval instruction.
- Each issue has a creator observation, v1.2.6 code evidence or code limitation, future phase assignments, and a verifiable acceptance condition. The `SCREENSHOT_ACCEPTANCE_MATRIX.md` additionally describes specific player routes and expected real iPhone screenshots.
- Inventoried four existing scene IDs, source JPGs, art-history files, four portal links (two unnecessary outdoor transitions, two indoor/cave thresholds), six NPCs, five non-portal objects, seven hostile spawns, current quests, save fields, and PWA architecture.
- Recorded protected SHA identifiers for the approved eight-direction Wanderer and independent Warden Hal, plus reference winter/forest/cave artwork; all compared against the actual pre-phase GitHub tree hashes.
- Froze design requirements: continuous whole-outdoor world before detail-polishing, coherent geography/materials/elevation, meaningful affordances, complete enemy art, and preservation of save progress.
- Defined legacy `900×584` reference-image → `1850×1200` local-world scaling and phase-later global-coordinate migration rules without deciding future chunk sizes prematurely.
- Reinforced that **Phase 9 is a mandatory full-overworld appearance review**. Actual user approval must precede Phase 10.

## Source-controlled deliverables

| Document | Purpose |
|---|---|
| [Issue register](./ISSUE_REGISTER.md) / [JSON](./issue_register.json) | All 34 issues and 12 source pages, stable IDs and acceptance |
| [Screenshot matrix](./SCREENSHOT_ACCEPTANCE_MATRIX.md) | Specific screenshot locations, reproduction actions and expected in-game proof |
| [Current build inventory](./ASSET_AND_RUNTIME_INVENTORY.md) | Source art, scene keys, actors, NPCs, enemies, world objects, portals and scripts |
| [Legacy scene anchors](./legacy_scene_anchors.json) | Machine-readable local world positions and portal endpoints for migration |
| [World design lock](./WORLD_DESIGN_LOCK.md) | Non-negotiable visual, gameplay and process constraints |
| [Coordinates and save contract](./COORDINATES_AND_MIGRATION.md) | Existing reference coordinates, proposed later global mapping, non-destructive save migration |
| [Protected asset manifest](./protected_assets.json) | Exact Git blob hashes for approved player and Warden sprites and quality-reference scenes |
| [Phase 1 audit test](../../tests/overworld_phase1_audit.test.js) | Repeatable Node checks for issue/page coverage, art SHA guards, scene baseline and phase review gate |

## Validation

- **390 source-audit checks passed in a simulated Node-compatible harness** against source files and GitHub tree metadata before the commit.
- Verified all **12 pages** have mapped issue records and screenshot acceptance scenarios, all **34 IDs** are unique, all future phase references are within 1–22, and two unnecessary exterior portal edges are recorded for replacement.
- Confirmed live build `game.js`, `visual.js`, `navigation.js`, `combat.js`, `quest.js`, scene art and existing save key are **not part of this phase's write set**.
- Node CI audit is wired into existing `npm test` as `npm run audit:world`; after pushing, GitHub Actions becomes the source of truth for that CI run. The simulated source QA does not constitute actual iPhone validation.
- Visual issues stay **OPEN** until genuine gameplay screenshot/device acceptance; the previous code-level collision claims are not treated as creator approval.

## Exact next work instruction for Phase 2

Use `OVERWORLD_REBUILD_ROADMAP.md` Phase 2, `WORLD_DESIGN_LOCK.md`, and the issue register to design **the full coherent outdoor geography and topology**: all 12 proposed macro-regions, elevations, river origins/banks, thawline, roads, bridges, islands, village location, caves, ruins, route loops, and landmark purposes. Present a creator-readable master map and route graph with candidate travel/density estimates. Do not replace working v1.2.6 gameplay with a blank prototype, and do not begin Phase 3 without the next development instruction.

**The explicit creator-appearance gate remains after Phase 9 — not after Phase 2.** The Phase 2 geography is a working topology blueprint for subsequent implementation, not the finished visual world approval.
