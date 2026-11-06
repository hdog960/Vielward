# VEILWARD — MANDATORY DEVELOPMENT WORKFLOW

> **GAME PATCHING AFTER FEEDBACK IS A REQUIREMENT — NOT MERELY AUTHORIZATION.**
>
> The developer assistant MUST update the **actual playable game** in this repository in direct response to each user playtest report, bug report, art correction, or development instruction. The assistant MUST do the implementation work before presenting a completed-response summary. The user's feedback is the work order, not an invitation to propose plans.

## Required cycle: user tests → assistant patches → user retests

1. **Read the latest feedback and screenshots carefully.** Diagnose the actual issue in source code and/or assets. Check the live repository, not assumptions from an older response.
2. **Patch the real game immediately.** Modify gameplay code, sprite atlases, assets, CSS, data, or service worker as needed. Do not provide only instructions, a diagnosis, future intent, design mockups, a plan, or a standalone art sheet in place of implemented changes. Do not ask for repeat authorization or defer to another turn.
3. **Follow the specific requested scope.** Keep approved work intact (especially the player-character atlas), preserve gameplay saves, and fix the actual requested issue without gratuitous unrelated rewrites.
4. **Quality-check the result before reporting completion.** Validate code syntax, correct asset dimensions/render paths, and behavior with available tests/simulations. For image bugs, inspect rendered output where feasible; do not claim final on-device visual confirmation without it.
5. **Push all required changes to this repository's GitHub main branch**, preserving history and checking the branch head before updating. Verify the new remote commit ID and source files *after* pushing. Keep iPhone Safari / Add-to-Home-Screen service-worker cache behavior in mind, including versioned assets and update detection.
6. **Return a short patch report, not a proposal.** State the exact modifications made, version/commit if verified, test results and any genuinely unverified device checks, and link to the playable game: https://hdog960.github.io/Vielward/.
7. **Repeat with the next user test.** The user should never have to remind the assistant of this loop.

## Non-negotiable prohibitions

- **Do NOT treat feedback as optional, future work, or merely permission to patch. Patching is mandatory.**
- Do NOT respond with a plan or explanation *instead* of making the patch.
- Do NOT send new sprite art, previews, or concept images as a substitute for updating the actual game.
- Do NOT repeatedly claim tool access is unavailable without first checking tools and actually attempting the repository operation.
- Do NOT claim an update was pushed or deployed if GitHub has not verified the commit; a GitHub push is not itself proof of iPhone cache refresh.
- Do NOT quietly abandon the patch if one method fails; inspect the blocker, try an available valid alternative, and do as much real work as possible.

## Genuine blockers and factual accuracy

If the repository is genuinely inaccessible, a tool fails, or the task is otherwise impossible, report the **verified** specific blocker and what was attempted; never invent a pushed patch or falsely promise asynchronous completion. This is an exception for truthfulness, **not** permission to skip work when tools are available.

## Current outstanding user feedback

- **Warden Hal must be rebuilt from scratch as a distinct character**, NOT merely recolored, painted over, given box-like helmets, or visually cloned from the player. Make a real dedicated sprite asset, wire it into the game, check its aesthetic in the scene, and preserve all Warden interactions and quest logic.
- **The player character must NOT be changed** during Warden work. Keep the approved eight-direction player atlas, movement, and animations untouched.
- **iPhone Home Screen shortcut updates must be reliable.** Verify versioning, service-worker activation and cache refresh on each patch. A closed and reopened app still may show stale assets; fix the update path rather than blaming the player.
- Keep the art faithful to the high-detail three-quarter pixel-art direction in ART_DIRECTION.md and ART_BENCHMARK.md.

## Scope and milestone

Follow PROTOTYPE_ROADMAP.md: perfect the Hollowreach playable slice and obtain explicit creator approval before broad full-game expansion. Prioritize quality of implemented art, controls, grounded sprites and collision over quantity of new content.

This file is the project's canonical agent instruction and applies on each future development turn. When answering from another chat, **read this file and the latest commit before changing the game**.

## Approved overworld rebuild roadmap — mandatory review gate

The creator approved the 22-phase continuous-overworld rebuild with an explicit new checkpoint: **after Phase 9, the creator must review and approve the appearance and geography of the fully built outdoor overworld** before Phase 10 begins. Deliver a real playable iPhone build with regional screenshots/map, not artwork alone. If the creator supplies corrections, patch the live game, push, and resubmit for review. Do not automatically advance. Source of truth: `OVERWORLD_REBUILD_ROADMAP.md`.

Roadmap approval does not override the established **one complete phase per "Continue development"** workflow. No new phase begins without an explicit continuation instruction.


## Overworld rebuild — Phase 1 source-of-truth audit complete (November 5, 2026)

**Completed only Phase 1** of the approved 22-phase plan. See `docs/overworld/ISSUE_REGISTER.md` (34 records, PDF p.1–12), `docs/overworld/WORLD_DESIGN_LOCK.md`, `docs/overworld/ASSET_AND_RUNTIME_INVENTORY.md`, `docs/overworld/COORDINATES_AND_MIGRATION.md`, machine-readable `docs/overworld/issue_register.json` and protected `docs/overworld/protected_assets.json`. Test with `npm run audit:world`. The detailed Phase 1 handoff is `docs/overworld/PHASE1_HANDOFF.md`.

Use `OVERWORLD_REBUILD_ROADMAP.md` as the **current next-development authority**; the old prototype and micro-sprint roadmaps are preserved as history. Phase 1 authorizes documentation-only auditing, not changing the current playable code. **Do not start Phase 2 until the creator says “Continue development”.** Before Phase 10, the creator must approve full overworld appearance after the Phase 9 review build. Continue the original test→notes→actual GitHub patch workflow for gameplay feedback.


## Overworld rebuild — Phase 2 complete (November 5, 2026)

Phase 2 produced a full 12-region connected outdoor **DESIGN BLUEPRINT**, not a playable overhaul. Source of truth: `docs/overworld/world_blueprint.json` (48 named anchors, 65 unique physical links, 7 crossings). Creator map: `docs/overworld/MASTER_MAP.svg`, generated deterministically by `scripts/render_overworld_blueprint.js`. Readable geography: `docs/overworld/MASTER_MAP.md`; QA / implementation handoff: `docs/overworld/PHASE2_TOPOLOGY_AUDIT.md` and `docs/overworld/PHASE2_HANDOFF.md`. Run `npm run audit:topology` and `npm test`.

**Phase 3 is NOT STARTED**. Do not begin it until the creator requests another continuation. Preserve v1.2.6 live gameplay until new streaming is stable. Respect the entire world's Phase 9 appearance approval gate: no Phase 10 work without explicit creator approval of the **actual built playable overworld**, not this planning SVG.


## Overworld Phase 3 (v1.2.7) — playable streaming engine delivered

The actual game includes `world_stream.js`, a lazy, chunk-cached full-global-coordinate engine driven by `docs/overworld/world_blueprint.json`. It is accessible through **Journey Menu → Explore Seamless Overworld (Phase 3 Preview)** and can be exited to the unmodified active quest/saves via the same menu. **Preview terrain is intentionally PROVISIONAL, not creator-approved art.** Combat, quests, inventory and legacy player position do not mutate during the preview. Current world collision is only a preview mask; Phase 4 will co-author real ground/elevation geometry, Phases 5–9 implement the full art/world, then the creator must approve world appearance before Phase 10. Avoid removing old gameplay during staged migration. Check with `npm run audit:streaming` and `npm test`.

**Phase 4 NOT STARTED**. Await creator's next `Continue development` or specific iPhone feedback (which must be patched immediately as always).


## Overworld Phase 4 complete — build v1.2.8 (November 5, 2026)

`world_geometry.js` and `docs/overworld/terrain_geometry.json` now author the *same visible shape and exact foot collision* for region floors, path/stair elevations, bridge/ford/causeway ground, tree trunks, railings, cliff faces and landmark Inspect zones. The actual iPhone game has an optional **Explore Outdoor Terrain (Phase 4 Preview)** mode and **Terrain Geometry Overlay** (Journey Menu; visible only inside preview). All quest/combat/gear/save mechanics remain in the working legacy adventure until subsequent migration. Check `npm run audit:geometry`, `npm run audit:streaming` and `npm test` and **verify Home Screen activation**. Read `docs/overworld/PHASE4_HANDOFF.md` and `docs/overworld/PHASE4_QA.md` before modifying terrain. Important: world preview's provisional graphics have NOT passed user visual approval. Detailed 2.5D pixel-art and foreground occlusion remain Phase 5–9.

**Phase 5 NOT STARTED.** Do not advance without the creator's next continuation or patch specific user feedback immediately. **After Phase 9 stop for the creator's full-overworld playable visual appearance approval before Phase 10.**


## Overworld Phase 5 complete — build v1.2.9 (November 5, 2026)

The **actual playable preview** now runs `terrain_art.js`, a source-authored 16-material×4-variant = 64-frame Canvas atlas, with source-to-game data at `docs/overworld/TERRAIN_MATERIALS.json`. The atlas paints deterministic world-grid snow, thaw, forest, moss, river/lake, stone, timber, rock, canopy and shadows using exactly the Phase 4 `world_geometry.js` floors, paths and blocker coordinates. Source rules: `docs/overworld/TERRAIN_ART_STYLE_GUIDE.md`; test and next phase: `docs/overworld/PHASE5_HANDOFF.md`, `docs/overworld/PHASE5_QA.md`. The real iPhone Journey Menu has **Explore Pixel-Art Terrain (Phase 5 Preview)** and inside it **Visit Next Terrain Material** (Snow→Thawline→Greenwood→Worldscar→Mossmere). Check `npm run audit:art` and `npm test`, and verify the new Home Screen cache `veilward-hollowreach-v129-material-atlas`. Approved player and Warden sprites, actual old village gameplay, and legacy save remain intact. **No separate image-only art deliverables.**

**Phase 6 NOT STARTED.** Next explicit continuation implements the actual Hollowreach integrated outdoor region art/architecture from the approved scene reference. The atlas alone is not full-appearance approval; the creator must inspect the entire real playable outdoor overworld after Phase 9 before Phase 10.


## Phase 6 complete — v1.3.0 continuous twelve-region outdoor landmass

The **actual GitHub Pages game** includes `world_footprint.js` and `docs/overworld/outdoor_footprint.json`, authoring a physical landmass outline, all **12 macro-regions**, 13 distinct scenery hubs, 35 protected clearings, biome-specific deterministic region vegetation and solid obstacles. The *same authored global positions* draw trees/rocks/ruins and block Wanderer feet; background/materials and outside cliff boundary are painted into lazy streamed `terrain_art.js` chunks. The entire **65-road + 7 crossing** geometry remains physically navigable. The iPhone Journey Menu has **Explore Continuous Overworld (Phase 6)** and a **12-stop Visit Next Region survey**. This only changes the optional preview, preserving the existing saved Hollowreach quest, Joren, equipment and approved hero/Warden sprites. New Home Screen cache: `veilward-hollowreach-v130-world-footprint`. Run `npm run audit:footprint` then `npm test`, and read `docs/overworld/PHASE6_HANDOFF.md` and `docs/overworld/PHASE6_QA.md` before any terrain changes.

**Phase 7 NOT STARTED.** Future work improves climate transition, foliage, terrain cohesion, then all-region art. The Phase 6 footprint is not an approved final game-art image. After Phase 9 **STOP for creator's appearance review** and do not enter Phase 10 without explicit approval. Any user feedback requires a real game patch first.


## Overworld Phase 7 complete — v1.3.1 global climate and vegetation

The live preview uses `world_climate.js` to derive continuous regional snow, exposure, elevation and riverbank dampness in global coordinates. Terrain pixel materials and region-specific pine/oak/flower/rock families both consume that source without altering the road colliders, protected approved hero/Warden art or saved Hollowreach adventure. Test `npm run audit:climate` and `npm test`; see `docs/overworld/PHASE7_HANDOFF.md` and `docs/overworld/PHASE7_QA.md`. **Phase 8 NOT STARTED** until the next explicit "Continue development". Creator must see and explicitly approve the whole landscape **after Phase 9 before Phase 10**. Actual iPhone visual approval is still pending.


## Overworld Phase 8 COMPLETE — v1.3.2 physical road and crossing network

The actual live preview now uses `world_routes.js` to render all **65** physical roads, **5** individual bridge decks with colliding painted rails, the dry Stoneford ford and Mossmere east causeway; the lake's east/west bank routes both connect to the walkable island. Source road art and obstacle guard share `world_geometry.js` centerlines and widths. `terrain_art.js` water occupancy uses the physical `geometry.waterAt()` source so shown banks and collision match. Added Journey Menu → Visit Next Crossing to survey seven stops on iPhone. Original saved quest, approved hero/Warden, world climate, lazy cache and earlier features preserved. Full suites: `npm run audit:routes` and `npm test`. Handoff: `docs/overworld/PHASE8_HANDOFF.md`, QA: `docs/overworld/PHASE8_QA.md`, drawing source guide: `docs/overworld/ROAD_NETWORK_ART_GUIDE.md`. **Phase 9 NOT STARTED** until next explicit instruction. After Phase 9 STOP for creator full-overworld appearance approval before Phase 10. Source checks cannot replace on-iPhone visual review.


## Phase 9 delivered — v1.3.3 MANDATORY CREATOR VISUAL GATE (NO PHASE 10)

The current main branch delivers actual-world in-game overview and 12-region true terrain-compositor thumbnails through `world_review.js`, accessed from Journey Menu → Review Full Overworld (Phase 9) → Review World Map & All 12 In-Game Regions or the map icon while in the continuous outdoor preview. Tap to visit physically grounded anchors and inspect on foot. Complete road graph: 48 anchors, 65 real physical links, 7 crossings, every region walkable, climate transitions and preserved original quest/save. The atlas highlights an approved-data Hollowreach → Frostbridge → Thawline → Greenwood → Old Crown → Smugglers test corridor, for focus **after approval**. Run `npm run audit:review` and `npm test`; read `docs/overworld/PHASE9_HANDOFF.md`, `docs/overworld/PHASE9_QA.md` and `docs/overworld/PHASE9_REGION_ATLAS.md`. **STOP ALL PHASE 10+ development until the creator has personally inspected and EXPLICITLY APPROVED the full game overworld appearance/geography.** If feedback is negative or contains requests, patch the actual deployed GitHub game, rerun regressions, resubmit the revised review; do not silently declare acceptance. The existing live runtime atlas is honest; no physical-device FPS or final art fidelity approval inferred from mocked tests.


## CREATOR REJECTED PHASE 9 APPEARANCE — VISUAL RECOVERY R1 ON v1.3.4

**NON-NEGOTIABLE:** Creator explicitly rates the v1.3.3 whole-world visuals **0% acceptance**, while approving the **12-region layout, original 65 roads and seven crossings**. Phase 10 is LOCKED. Do not say Phase 9 art is approved or shift into Phase 10. Detailed snowy/woodland references remain `assets/village_v06_clear.jpg` and `assets/wilds_clean.jpg`. See `docs/overworld/VISUAL_RECOVERY_R1.md` for root cause, concrete code changes, honest visual limitations and R2–R4 remaining visual work.

New `world_illustration.js` is a source-aligned artist layer (shape draft) for tiered pines/oaks, rocks, roofed cottage, landmarks and environmental clusters. `terrain_art.js` uses it to replace the sparse scenery, and `world_climate.js` uses continuous patches instead of individual checkerboard decisions. `world_footprint.js` restores actual collider-bearing trees near landmarks while protecting real route and water corridors. `world_routes.js` renders narrower worn trails inside original physical passability. All four selected region-views now focus on real land-marked anchors and show more visual detail. New version and service worker: v1.3.4 / v134. Run `npm run audit:recovery` and `npm test`. **No source test or generated thumb proves finished art**; only creator approval after actual iPhone review does.


## Visual Recovery R1.1 — v1.3.5 (after real-browser screenshots)

The creator's original v1.3.3 appearance rejection still stands at **0% approval**. Real browser screenshots of R1/v1.3.4 were captured by [GitHub Browser Visual QA](https://github.com/hdog960/Vielward/actions/workflows/visual-qa.yml). **They exposed that the environment was STILL visually inadequate**: Hollowreach/Greenwood too bare, landscapes still noisy, roads wide flat bands, and authentic original scene quality missing. We have not pretended a passing source test means adequate appearance.

R1.1 directly responds: `world_footprint.js` now generates more **collision-backed grove plants** in a deterministic 220-unit global grid, placed only on real land and outside existing roads/river/authorised clearings; passability is still checked against the complete network. `world_illustration.js` draws those groves in proper y-order along with mature trees, with considerably denser planted grass/meadow, wetland reeds and delicate snowbanks. `terrain_art.js` reduces repetitive material speckle by a further ~70% to two background marks / two source motifs; `world_routes.js` trims the stylized visible road strokes without changing physical path geometry or crossing collision. iPhone service worker uses v1.3.5 cache and the browser capture workflow runs again.

**Truthful current status:** More work is required before matching `village_v06_clear.jpg` and `wilds_clean.jpg`; R1.1 is another implemented art-recovery increment, not creator visual acceptance. Phase 10 remains locked. Compare the four new screenshot frames and iterate.



## Visual Recovery R2 — v1.3.6 (Phase 9, not Phase 10)
**Work implemented:** Source-authored and terrain-aware 3/4 world vignettes from `world_setpieces.js` add 29 collision-aware scenery objects across all 13 genuine landmark groups, plus readable pitched cottage roofs and windows, Greenwood shelter, village furnishings, masonry/highland columns and bridgehead details. R2 also replaces flat cliff polygon shading with source-polygon stone strata and enhances the original bridges' plank/nail/parapet grammar without altering rail collision. The ordinary player preview hides its technical status banner; debugger remains available. All 48 original travel nodes, 65 roads and seven crossings stay unchanged. **Creator art acceptance remains 0% unless the creator directly updates that assessment.** R2 is not permission to start Phase 10. Source reference: `docs/overworld/VISUAL_RECOVERY_R2.md`; test: `npm run audit:setpieces`; real pixel evidence: GitHub Actions `Veilward Browser Visual QA` (Hollowreach, Atlas, Greenwood, Coldpine, Frostbridge). New fixed versions v1.3.6 and service-worker cache v136. Next R3 author higher-fidelity environment atlases or patch feedback, NOT Phase 10.


## OVERRIDING ART-GATE CORRECTION — 2026-11-06
The original Hollowreach/Greenwood artwork is the ONLY accepted visual standard. Creator rejected current extended-world geometry art at **0% visual acceptance**; adding polygon cottages, noisy ground, primitive firs and blocky stone was a failed visual strategy, not progress. A source-image swatch repetition experiment also failed real screenshot review and was rolled back. **NO NEW PROCEDURAL PLACEHOLDER DECORATION** should be presented as future authored art. The 12-region road/connectivity/collision work is approved, but the visually rejected `v1.3.6` overworld remains a TECHNICAL MAP TEST ONLY. Preserve the detailed original scene rendering, sprite sets and all saves. The next art work is true authored raster environment sprites/terrain tiles, beginning with ONE complete Hollowreach and ONE Greenwood pilot at the exact quality of `assets/village_v06_clear.jpg` and `assets/wilds_clean.jpg`, with actual gameplay captures and explicit creator signoff. Phase 10 LOCKED. See `docs/overworld/ART_DIRECTION_RESET.md`.



### v1.3.8 raster-art pilot — original style remains the acceptance criterion
The developer has integrated the first three REAL hand-painted pixel environment sprites as a 288×96 transparent PNG in `assets/hollowreach_pilot_sprites_v1.png`: winter fir, timber cottage, snow/ice cliff. `world_raster_pilot.js` stamps these at source-anchored Hollowreach physical object positions, preserving authoritative geometry, travel and quests. It does **not** make the entire 12-region renderer artistically acceptable. Ground, roads, many props and 11 other regions remain temporary. The original approved image backgrounds in `visual.js` remain untouched. **Visual acceptance is 0% until creator approval; Phase 10 is locked.** Required next work: whole playable Hollowreach artist-authored pixel environment, no more polygon decor / crop-and-repeat texture hacks, then a full Greenwood pilot. [Implementation / QA](docs/overworld/HOLLOWREACH_RASTER_PILOT.md).



### Phase 9 R3 v1.3.9 — winter materials and source infrastructure
The Hollowreach pilot now has a **new independent 16-variant snow/cobble/rock ground raster atlas** plus **three hand-painted bridge, stair and lantern sprites**, integrated at physical world cell, source-road and geometry-anchor positions. The actual finished assets are `assets/hollowreach_ground_painted_v2.webp` and `assets/hollowreach_bridge_stairs_lamp_v2.png`, alongside the existing authored 3-object sprite sheet. These replace the old confetti-like snow and some smooth tube-road visuals **only within Hollowreach**; original world geometry and source travel/collision remain untouched. Do not assert the entire environment now matches the original artwork. Check actual browser screenshots for severe seams/tiles and remove rejected art. Artist signoff is still at 0%, Phase 10 LOCKED. Next: a whole cohesive Hollowreach forecourt (not additional orphan props), followed by Greenwood. Details: `docs/overworld/HOLLOWREACH_MATERIALS_R3.md`.
