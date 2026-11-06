# Veilward Phase 9 — Hollowreach R3 Environment Materials (v1.3.9)

**Status: DEVELOPMENT PREVIEW — NOT READY FOR CREATOR REINSPECTION. Creator art approval remains 0%, and Phase 10 stays locked.**

## Changes implemented in the real, walkable extended world
The approved original Hollowreach screenshot remains the fidelity benchmark. R2's flat ground, banded pipe-roads, and geometric infrastructure do NOT meet it.

New independently authored transparent infrastructure PNG: `assets/hollowreach_bridge_stairs_lamp_v2.png` includes a snowy timber-and-stone bridge, carved glacial stairs and warm lantern (3 independent 72×72 painted sprites). Original three raster objects — pine, winter cottage and icy boulder/cliff — are preserved.

New independently painted `assets/hollowreach_ground_painted_v2.webp` contains 16 winter terrain variants: four snow/drift types, four cobbled/stone tracks, four raised rock/ledge types and four snow/earth/vegetation transitions, packed as 4×4 cells at 32 native pixels per cell. It was painted as a new asset sheet, **not harvested as mirrored low-quality crops of the golden-reference screenshot**. The first implementation uses the exact source `terrain_art.js` 96-unit world cells, a keyed 4-variant selection and climate boundaries, *only for the Hollowreach pilot*, instead of the old sparse confetti texture. Non-Hollowreach regions still use the old map preview. The source `world_routes.js` road centerlines get illustrated stone paint inside the unchanged physical corridor; physical bridge rails and the seven crossings stay as before. In the winter region, selected stairs and lampposts now use the new painted sprites at physical anchors. Other geometry continues working.

**Proven controls:** same original hero and Warden assets, original painted quest scenes, persistent adventure save key `veilward-hollowreach-v01`, 12-region map, 65 roads, seven crossings, and all travel-node coordinates.

## Potential issues to inspect in the screenshots
- The 32px illustrated ground cells **may still show obvious repeating checkerboards and abrupt seams**. If so, do NOT claim visual progress: revise ground blending or withhold that material patch.
- The real world is far from golden-reference quality. A handful of painted assets does not complete cliffs, water, lighting, foreground depth, props or natural vegetation. The illustrated tile grammar is only a pipeline pilot.
- Full player navigation and room scale must remain coherent. Painted stairs are only placed on real slope/stair sources. The selected winter bridge asset is used only for short physically valid bridges.
- **Never treat passing CI as creator acceptance**. A browser snapshot is necessary but not sufficient; actual iPhone inspection and explicit user approval will ultimately set acceptance.

## Next required phases before request for reinspection
1. Make a complete **Hollowreach starting neighborhood** with harmonious snowy ground, paths, house placement, cliff edges, staircases, lanterns and foliage. Remove remaining blocky placeholders.
2. Real browser comparison versus `assets/village_v06_clear.jpg`; check road and terrain seam/mosaic artifacts, collision alignment, camera and player scale.
3. Build equivalent finished **Greenwood** woodland pilot; do not move to every region prematurely.
4. Expand art assets to the other 10 regions, with actual screenshots at each checkpoint and iPhone load/performance testing.
5. Only say **READY FOR REINSPECTION** when an actual world scene looks genuinely close to the original screenshot. No premature art acceptance claims.

### QA
`npm run audit:winter-materials` checks binary asset signatures, authentic runtime image painting, strict 65-road/7-crossing geometry, 48 safe nodes, original game save key and iPhone worker/source parity. Other Phase 1–9 audits remain enabled. `Veilward Browser Visual QA` captures actual HOLLOWREACH, GREENWOOD, COLDPINE, FROSTBRIDGE and WORLD ATLAS views.


### R4: site integration instead of additional isolated props
See [R4 neighborhood integration](HOLLOWREACH_COMPOSITION_R4.md). Cliff artwork now follows the real polygon as a composed continuous face, warm light is anchored to physical village sprites, winter tree foreground duplications are suppressed, and snow-road rims are quieter. The 12-region art review remains FAILED at 0% until creator approval; no Phase 10.
