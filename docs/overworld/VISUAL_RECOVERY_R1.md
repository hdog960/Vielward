# Veilward — Visual Recovery R1 (v1.3.4)

**CREATOR ART ACCEPTANCE: 0% until the creator explicitly reevaluates and accepts the deployed in-game appearance.** Visual acceptance of previous 1.3.3 Phase 9 atlas was explicitly rejected. All Phase 10+ work is PAUSED. This is an initial art-recovery implementation, not a declaration of finished 32-bit illustration quality.

## Why the previous look failed

The repo has detailed approved artistic scene references (`assets/village_v06_clear.jpg`, `assets/wilds_clean.jpg`), but the optional continuous overworld renderer used a random speckle texture atlas (25 tiny dots plus 8 motifs on each 32px tile), independent tile-by-tile material selection, wide continuous vector road strokes, sparse rounded blob trees, almost nonexistent landmark density and 1900-world-unit thumbnails focused on empty road junctions. Functional map, 65 roads, seven crossings, quest/save work remained correct; presentation did not.

## Actual changes in this recovery slice

1. **New `world_illustration.js`**: A real in-world drawing layer (no raster screenshot pasted behind gameplay). Uses original source positions of solid tree trunks, reproducible trees/rocks from `world_footprint.js`, physical building polygon for Joren's cottage, and 13 authored landmark anchors. Pine shapes have six deeply layered bough tiers, shaded wood trunks, staggered needle clusters and climate-dependent snowy branches. Deciduous trees have branching trunks and irregular overlapping foliage layers. Rocks/crystals get faceted lit surfaces and contact shadows. Groundcover, shrubs, flowers and reeds respond to the climate. The cottage has a pitched roof with snow-lit tile structure, beam and facade planes, amber windows, chimney and doorway steps. Alpine memorials, ruined stone posts, camps, markets, cave-mouth and Woodland refuges gain more legible 2.5D-inspired silhouette and value contrast. **These still use Canvas procedural pixel shapes and require further artist-directed refinement to match the beautiful reference JPGs.**
2. **`terrain_art.js`**: Owns the source atlas but reduces base speckle from 25 fragments to seven + fewer repetitive motifs. Inserts a world-space, deterministic organic ground pass and the new source-anchored illustration instead of the old minimal `footprint.drawScenery` objects. Static collision trees are drawn with the same new artist module; render-mode and source geometry are not changed.
3. **`world_climate.js`**: Replaces independent tile dice rolls with smoothly varying large-scale snowmelt and vegetation patch noise, reducing the unnatural alternating checkerboard between materials. Global coordinate sampling prevents cross-chunk discontinuity.
4. **`world_footprint.js`**: Landmark natural-prop exclusions were large 600–1200-unit empty circles, leaving review views barren. They are reduced to physically protected 315–355-unit clearings. Actual road, river and obstacle buffers remain protected; new visible trees and rocks have corresponding real blockers, not decorative ghost trunks. Densities stay source-regional.
5. **`world_routes.js`**: Replaces broad tube-like full physical-width strokes with recessed trails bounded inside existing walkable geometry, improved subdued material palette, footpath gravel pockets and vegetated shoulders. All bridge/fords/causeway collision and seven source crossing construction types remain untouched; decks are narrower than physical rail lanes, visually framed by them.
6. **`world_stream.js`**: Integrates one illustration runtime alongside the already-authoritative climate/land/route/terrain components. Tile streaming cache remains bounded to 18 mobile canvases.
7. **`world_review.js` / `game.js`**: The four primary review regions now focus on actual physical landmarks rather than empty map centre nodes; all 12 targets have source-verified nodes. The region galleries zoom from 1900 to 1250 world units so vegetation, roofs, rocks and paths are visible. Menu labels openly identify **Visual Recovery R1 / appearance not approved**. The map geometry and all original saves are unchanged.
8. **iPhone service worker**: New versioned JS filenames, `v1.3.4` in UI and rotated `veilward-hollowreach-v134-illustrated-recovery-r1` cache to prevent older artwork from persisting in Safari / Home Screen.
9. **Regression**: New `tests/visual_recovery_r1.test.js` checks actual painter runtime, four curated region render operations, physical route safety, source anchors, no independent art-only collision claims, PWA asset parity and preserved approved hero/warden textures. Existing Phase 1–9 suites remain active.

## Visual inspection priorities

Open [Veilward](https://hdog960.github.io/Vielward/) and confirm v1.3.4. Journey Menu → **Review Visual Recovery R1 (Phase 9)** → **Review World Map & All 12 In-Game Regions**. Focus on:

- **Hollowreach**: The new cottage roof/facade should visibly replace the plain line intersections, though fully layered village architecture and true environment-level asset fidelity are not yet achieved.
- **Greenwood**: Foliage should actually populate the scene rather than a green carpet, with more varied oak and pine silhouettes and shaded footpaths.
- **Coldpine / Northwatch**: Taller snow-bearing evergreen silhouettes, brighter snow highlights, three-dimensional stone facets.
- **Frostbridge River**: Footpaths should not look like monochrome pipelines; same physical deck and shoreline.
- **Other eight regions**: Better density and focal landmarks, without breaking region travel.

The golden standard remains `assets/village_v06_clear.jpg` / `assets/wilds_clean.jpg`. **Source-level regression success does not prove these have been met.** The creator previously rated the whole Phase 9 appearance **0%** and must personally review this release. Record only user-supplied acceptance, not invented percentages.

## Recovery roadmap after R1 (within the failed Phase 9 checkpoint, before Phase 10)

- R2: Author context-specific environment architecture: complete Hollowreach square, cottage grouping and rooftops; Greenwood grove/logs/bridges; Coldpine ridge cliffs; river and waterfall layering. Eliminate generic repetitive shape grammar, improve palette and lighting.
- R3: Replace procedural silhouette drafts with deliberately authored and coherent pixel sprite/terrain atlases based on the approved reference perspective. Validate scale, tree/house relationships, lighting, snow/grass transitions, roof depth.
- R4: Quality-control entire 12-region visual atlas from real live on-device screenshots, test iPhone frame rate, tune clutter/occlusion, and obtain explicit creator acceptance. Only then return to Phase 10.

All R2–R4 are future work, not claims of current completion.


## Visual Recovery R1.1 — v1.3.5 (after real-browser screenshots)

The creator's original v1.3.3 appearance rejection still stands at **0% approval**. Real browser screenshots of R1/v1.3.4 were captured by [GitHub Browser Visual QA](https://github.com/hdog960/Vielward/actions/workflows/visual-qa.yml). **They exposed that the environment was STILL visually inadequate**: Hollowreach/Greenwood too bare, landscapes still noisy, roads wide flat bands, and authentic original scene quality missing. We have not pretended a passing source test means adequate appearance.

R1.1 directly responds: `world_footprint.js` now generates more **collision-backed grove plants** in a deterministic 220-unit global grid, placed only on real land and outside existing roads/river/authorised clearings; passability is still checked against the complete network. `world_illustration.js` draws those groves in proper y-order along with mature trees, with considerably denser planted grass/meadow, wetland reeds and delicate snowbanks. `terrain_art.js` reduces repetitive material speckle by a further ~70% to two background marks / two source motifs; `world_routes.js` trims the stylized visible road strokes without changing physical path geometry or crossing collision. iPhone service worker uses v1.3.5 cache and the browser capture workflow runs again.

**Truthful current status:** More work is required before matching `village_v06_clear.jpg` and `wilds_clean.jpg`; R1.1 is another implemented art-recovery increment, not creator visual acceptance. Phase 10 remains locked. Compare the four new screenshot frames and iterate.
