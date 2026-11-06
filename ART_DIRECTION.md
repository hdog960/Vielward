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


## Visual acceptance failure — source-art reset v1.3.7
**The creator explicitly rejected R2's blocky/flat overworld versus the original fully illustrated Hollowreach screenshot.** Adding progressively more procedural props is NOT progress toward the art contract. Source paintings `assets/village_v06_clear.jpg` and `assets/wilds_clean.jpg` are the golden references for authored environment painting. `world_source_materials.js` builds an initial texture sample atlas directly from these raster sources; production preview disables primitive `world_setpieces.js` building clutter and corresponding invisible collision. This is only a temporary materials foundation; the original scenes remain untouched, while illustrated object sprite atlases and fully composed village/Greenwood pilots remain mandatory. **Do not claim finished art, begin Phase 10 or count visual acceptance above 0%.** Do not use full painting backplates as fake animated maps. Read `docs/overworld/ART_RESET_R3.md`. Test real/source-art mode with `npm run audit:source-art` and inspect actual gameplay at the source image's reference scale.