# VEILWARD — ART DIRECTION CONTRACT

## Golden reference
Creator's November 3 screenshot of a snowy highland cottage and footbridge. The style, perspective, and detail are the standard, not the snow biome itself.

## Approved visual grammar
1. **Camera:** elevated three-quarter top-down, fixed and grounded. Buildings show roof and wall facades; cliffs and bridges show elevation.
2. **Density:** 32-bit-era-inspired authored pixel clusters, material-specific light/dark ramps, detailed hand-crafted environments; not generic flat primitive shapes or giant 8-bit pixels.
3. **Scale:** small but readable player relative to houses and trees; generous landscape visible in iPhone horizontal play.
4. **Depth:** layered pines, cliffs, riverbeds, fences, foreground branches, roof shadows and occlusion/roof fading to keep play readable.
5. **Lighting:** cool ambient shadows against warm windows, lanterns and fire; weather/day-night color treatment consistent with materials.
6. **Materials:** stone blocks and cracks, wood grain, shale shingles, ice/snow clusters, dirt paths, grass clumps, blossoms, water foam and rock moss that don't repeat in obvious checkerboard patterns.
7. **Motion:** consistent directional walk/idle/attack/cast/dodge and understandable foot placement; believable water, fire, foliage animation.
8. **Environmental storytelling:** intentional details (fishing equipment, crates, notices, tracks, logs, herbs, abandoned camp, snow drifts) rather than random sparse decoration.
9. **Phone readability:** controls and interaction ranges must work without magnifying player to half a building.
10. **Cross-biome quality:** forest, winter, caves, towns, interiors all use matching pixel density and rendering principles.

## Red flags — automatic rejection for approved prototype
- Vector icons, emoji or flat generic polygons substituting for production trees, heroes, enemies or terrain.
- Painting screenshots placed behind fake characters and passed off as tilemaps.
- Character/roof collision errors, poor layering, fuzzy art, huge repeated tiles or scale inconsistencies.
- No real in-game screenshots on actual device.
- Game menu visual direction disconnected from the world.

## Approval
Gate 1 must include in-game captures: winter village day/night, green forest travel, a real interior, player/NPC scale, combat and UI, compared side-by-side to the user's image. Refinement continues until the user approves.

## Current build
v0.1 has procedural graphics **strictly as a functional foundation**. It has not passed the art requirement. Prioritize replacing them with authored consistent pixel assets before adding broad game content.


## Visual failure and corrected development constraint (v1.3.4)

On 2026-11-06 the creator rejected the full v1.3.3 overworld look at **0% acceptance**, while approving the physical layout/roads. The 32×32 material atlas and generic strokes/trees **did not** meet this contract. The R1 `world_illustration.js` source-anchored Canvas painter and scene-frame repair are an **incremental recovery, not the approved final art direction**. High-quality environmental texture atlas creation, full 3/4 architecture, landscape lighting and exhaustive real-iPhone comparison are still mandatory. No further main-roadmap phase can begin before creator visual signoff. For details see `docs/overworld/VISUAL_RECOVERY_R1.md`.



## Visual Recovery R2 — v1.3.6 (Phase 9, not Phase 10)
**Work implemented:** Source-authored and terrain-aware 3/4 world vignettes from `world_setpieces.js` add 29 collision-aware scenery objects across all 13 genuine landmark groups, plus readable pitched cottage roofs and windows, Greenwood shelter, village furnishings, masonry/highland columns and bridgehead details. R2 also replaces flat cliff polygon shading with source-polygon stone strata and enhances the original bridges' plank/nail/parapet grammar without altering rail collision. The ordinary player preview hides its technical status banner; debugger remains available. All 48 original travel nodes, 65 roads and seven crossings stay unchanged. **Creator art acceptance remains 0% unless the creator directly updates that assessment.** R2 is not permission to start Phase 10. Source reference: `docs/overworld/VISUAL_RECOVERY_R2.md`; test: `npm run audit:setpieces`; real pixel evidence: GitHub Actions `Veilward Browser Visual QA` (Hollowreach, Atlas, Greenwood, Coldpine, Frostbridge). New fixed versions v1.3.6 and service-worker cache v136. Next R3 author higher-fidelity environment atlases or patch feedback, NOT Phase 10.


## OVERRIDING ART-GATE CORRECTION — 2026-11-06
The original Hollowreach/Greenwood artwork is the ONLY accepted visual standard. Creator rejected current extended-world geometry art at **0% visual acceptance**; adding polygon cottages, noisy ground, primitive firs and blocky stone was a failed visual strategy, not progress. A source-image swatch repetition experiment also failed real screenshot review and was rolled back. **NO NEW PROCEDURAL PLACEHOLDER DECORATION** should be presented as future authored art. The 12-region road/connectivity/collision work is approved, but the visually rejected `v1.3.6` overworld remains a TECHNICAL MAP TEST ONLY. Preserve the detailed original scene rendering, sprite sets and all saves. The next art work is true authored raster environment sprites/terrain tiles, beginning with ONE complete Hollowreach and ONE Greenwood pilot at the exact quality of `assets/village_v06_clear.jpg` and `assets/wilds_clean.jpg`, with actual gameplay captures and explicit creator signoff. Phase 10 LOCKED. See `docs/overworld/ART_DIRECTION_RESET.md`.



### v1.3.8 raster-art pilot — original style remains the acceptance criterion
The developer has integrated the first three REAL hand-painted pixel environment sprites as a 288×96 transparent PNG in `assets/hollowreach_pilot_sprites_v1.png`: winter fir, timber cottage, snow/ice cliff. `world_raster_pilot.js` stamps these at source-anchored Hollowreach physical object positions, preserving authoritative geometry, travel and quests. It does **not** make the entire 12-region renderer artistically acceptable. Ground, roads, many props and 11 other regions remain temporary. The original approved image backgrounds in `visual.js` remain untouched. **Visual acceptance is 0% until creator approval; Phase 10 is locked.** Required next work: whole playable Hollowreach artist-authored pixel environment, no more polygon decor / crop-and-repeat texture hacks, then a full Greenwood pilot. [Implementation / QA](docs/overworld/HOLLOWREACH_RASTER_PILOT.md).



### Phase 9 R3 v1.3.9 — winter materials and source infrastructure
The Hollowreach pilot now has a **new independent 16-variant snow/cobble/rock ground raster atlas** plus **three hand-painted bridge, stair and lantern sprites**, integrated at physical world cell, source-road and geometry-anchor positions. The actual finished assets are `assets/hollowreach_ground_painted_v2.webp` and `assets/hollowreach_bridge_stairs_lamp_v2.png`, alongside the existing authored 3-object sprite sheet. These replace the old confetti-like snow and some smooth tube-road visuals **only within Hollowreach**; original world geometry and source travel/collision remain untouched. Do not assert the entire environment now matches the original artwork. Check actual browser screenshots for severe seams/tiles and remove rejected art. Artist signoff is still at 0%, Phase 10 LOCKED. Next: a whole cohesive Hollowreach forecourt (not additional orphan props), followed by Greenwood. Details: `docs/overworld/HOLLOWREACH_MATERIALS_R3.md`.


### Phase 9 R6 — v1.3.12 illustrated Hollowreach environment sprites (NOT APPROVED)
A new independently produced eight-cell transparent PNG (`assets/hollowreach_neighborhood_r6.png`) has been incorporated into the **actual optional continuous-world game**, with two snowy fir silhouettes, glacial rock formations, snowy scrub, timber rail and retaining-wall details, and a warm lantern. The painter places these on the existing source-driven trees, rocks, cliff solids, lamps and cottages; polygon-clipped cliffs keep their original physical colliders, cottage frontage remains inside pre-existing building footprints, and original quests, hero/Warden art, 48 waypoints, 65 roads, seven crossings and saves remain protected. The source-art regression is `tests/hollowreach_neighborhood_r6.test.js`; build/cache is v1.3.12 with an updated iPhone service worker. See `docs/overworld/HOLLOWREACH_NEIGHBORHOOD_R6.md`.
**Creator visual acceptance is STILL 0%, Phase 9 is ACTIVE, Phase 10 is LOCKED.** No isolated sprite sheet, QA result or screenshot can substitute for completing a cohesive original-fidelity Hollowreach forecourt and then Greenwood. The artist-authored reference scenes remain the standard, not the new test sprites.

