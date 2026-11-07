# VEILWARD — Phase 9 R10: Physically Anchored Hollowreach Retaining Walls

**Build:** v1.3.16 | **Status:** implementation slice, **NOT** creator-approved art | **Creator visual acceptance:** 0% | **Phase 10:** LOCKED.

## Purpose

After the R9 real-browser Grove capture, the western Hollowreach cottage lane still had disconnected houses, snowfields, and spruce silhouettes with no architectural foundation joining them. This pass adds one *genuine* source-authored architectural boundary with a real usable passage, while preserving the original densely illustrated village reference as the art target.

## What changed in the PLAYABLE world

- `docs/overworld/terrain_geometry.json`: two source-defined physical `retaining-wall` segment colliders, `hollowreach_west_retaining_upper` and `hollowreach_west_retaining_lower`, track the village's western architectural edge. There is a deliberate **walkable opening** between them, and both are safely off the authoritative road centerlines.
- `world_raster_pilot.js`: `drawRetainingWallGround` paints wide, low-contrast snow/ice transitions along the SAME physical segment, while `drawRetainingWall` uses the existing **illustrated stonework atlas** for a sequence of joined, snow-capped wall sections. These are not synthetic polygon blocks, unrelated props, a reference screenshot, or fake walkable walls.
- `drawWinterScene` includes retaining segments in its world-coordinate **boot-Y depth order** alongside authentic cliffs, cottages, trees and lanterns. The old geometric segment fallback is suppressed for the newly illustrated walls to prevent double-rendered blocky shapes.
- `drawRetainingWallForeground` re-renders only genuinely nearer illustrated wall panels over the Wanderer where a real physical wall stands between the actor and camera.
- `drawArchitectureForeground` makes cottage roof cover **partially translucent** when the hero is genuinely behind it. This balances believable occlusion with the ability to still locate the character.
- `world_geometry.js` adds a neutral cold-stone color for inspecting the new retaining-wall colliders on the debugging geometry overlay.
- iPhone PWA and script caches change to **v1.3.16** with `terrain_geometry.json?v=4`. Existing game save key `veilward-hollowreach-v01` is unchanged.

## Regression and real-browser proof

- Added `tests/hollowreach_architecture_r10.test.js`, wired into full `npm test` via `audit:architecture`.
- Tests check both real wall colliders, illustrated rendering, correct real-world foot-Y sort, the intentionally open alley, correct actor foreground behavior from both sides, all 48 existing waypoint boots accessible, and source version/save integrity.
- Real-browser QA captures a walkable camera position inside Hollowreach's western alley: `HOLLOWREACH_WALLS`; it also still captures the village square, existing R8 rocky terraces, R9 pine verge, all 12-region atlas, Greenwood, Coldpine and Frostbridge. Screenshots must be compared with the REAL reference `assets/village_v06_clear.jpg` rather than mistaking a source mock-up for gameplay.
- Geographical topology remains **12 regions, 48 nodes, 65 roads, 7 legal crossings**. Source terrain colliders now number **39** (7 source cliffs, 4 added western spruce roots, 2 new wall segments plus other original geometry).

## Limitations and next step

This does NOT finish the connected artistic village, nor does it supply finished hand-painted stairs, complex roof variation, riverbanks, or Greenwood. The `village`→`joren` and `village`→`village_north` roads presently have equal authored elevations, so never put ornamental stair art in these flat physical roads and misrepresent actual travel. Any future stone stairway MUST be grounded in source navigation and elevation data first.

**Do not unlock Phase 10 or request acceptance** until the playable village looks substantially like the approved illustrated scenes and the creator explicitly approves it. Incremental technical quality is not creator signoff. No autonomous background work.
