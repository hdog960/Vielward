# Phase 9 — Greenwood upper-forest composition R32

## Baseline and creator requirement
The R31c **real playable screenshot** had original mature illustrated buildings, but the upper frame and central green floor remained extremely bare relative to the creator's original `wilds_clean.jpg` forest scene. Decorative flecks and repeated geometry were explicitly rejected. Source trees rather than screenshot backdrops or new phantom collision are mandatory.

## Changes now in live source
- `world_greenwood_art.js` exports `paintHearthUpperForest(ctx,bounds,roots)`. It can render upper oak/pine boughs only from the original physical Hearth tree IDs 8, 9, 10, 15, 20 and 23. The source is cropped **directly from the existing four-file R18 atlas** (upper 78 pixels of the native 128px oak/pine paintings), not new procedural triangles or generic green ovals.
- Four rooted northern trees supply overlapping rear-canopy lobes that reach down toward the camera, with two side oaks supplying longer adjoining branches. Full rooted tree sprites continue rendering afterward.
- Skip unrecognized ID, absent original physical blockage, water, non-Greenwood position and offscreen chunk. Keep the center of the Hearth clearing readable to the actor. Do not create new footpoints or alter navigation.
- `world_illustration.js` adds the upper-forest painter in the existing world-space feature pass, between R31c boughs and complete physical trees.
- `scripts/visual_capture.mjs` captures `GREENWOOD_R32_UPPER_FOREST` from the *actual playable preview*, checks the real rooted sources are physically blocked, and checks the original player remains walkable. New `tests/greenwood_upper_forest_r32.test.js` verifies genuine source image rectangles, output count, source-only gating and untouched saves.
- Build and mobile cache advance to v1.3.33; original 12 region topology, 48 nodes, 65 roads, seven crossings, 39 hand-authored static solids, original sprites, quests, inventory, and `veilward-hollowreach-v01` local save key remain protected.

## Acceptance truth
Tests and visual capture prove a renderer executes and takes *actual gameplay images*. They cannot by themselves confirm artistic beauty, physical iPhone performance, or creator signoff. The original forest/winter art references remain mandatory; this is only one forest compositional improvement. **Phase 9 remains active; visual approval 0%; Phase 10 remains locked.**

## Next source targets
After inspecting the new real screenshot, correct any leaf cropping, unnatural branch repetition, dark floating foliage or road occlusion. Only then continue deeper authored seamless terrain, distinctive cliffs and water banks, coherent forest depth and cross-region scene consistency. Do not revert to scattered micro-detail or blocky geometry to chase a milestone count.
