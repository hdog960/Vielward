# VEILWARD — Phase 9 R9 / v1.3.15: Hollowreach Western Forest Verge

**Real game implementation, visual acceptance still 0%, Phase 10 locked.**

## Why this exists

The genuine browser views after R8 still show an unusually open, texture-heavy snowy courtyard, with only two small disconnected winter trees on the western side. A complete illustrated village requires a visually composed natural boundary; filling the map with unrelated primitive objects is explicitly rejected.

## Implemented in source

- Added four **real, collidable** old-growth spruces to the AUTHORITATIVE `docs/overworld/terrain_geometry.json`: `hollowreach_west_spruce_upper`, `_gate`, `_court`, `_lower`. They form a deliberately staggered sheltered western grove, around Hollowreach's existing cottages and physical road edges. All use existing `pine-trunk` collision and source-rendered hand-painted fir sprites, not an image-only overlay.
- `world_raster_pilot.js` now has `drawShelterbeltGround`: a coherent continuous snowbank/blue-shaded frozen ground line between the exact tree roots, using an existing painted winter material plate for surface texture and source-illustrated snow brush sprites along its *village-facing* edge. Groundcover is intentionally walkable. **Only the actual trees have collision.**
- Tree canopies still participate in the single world-foot-Y painter order with buildings, cliffs and vegetation. This protects correct foreground occlusion and avoids duplicating geometric tree crowns.
- The village ground compositor calls the shelterbelt painter, with a larger bound to include this connected west landscape. No copied approved screenshot, no new primitive tree art, no fake geography.
- New regression `tests/hollowreach_shelterbelt_r9.test.js` checks physical tree blockers, tree/sprite render integration, grove connected ground art, unchanged 48 original nodes and all 65 road centerlines, seven legal crossings, and unchanged legacy save key.
- Game version, source-geometry asset query and PWA cache advance to **v1.3.15**; original main RPG adventure, dialogue, hero/Warden art and user saves are untouched.
- Browser visual QA captures a separate **real walkable western-grove vantage point**, in addition to the usual Hollowreach, R8 terraces, Greenwood, Coldpine, river and 12-region atlas.

## State and restrictions

Original world blueprint stays **12 regions, 48 nodes, 65 roads, seven crossings**. Physical source obstacles are now **37 solids**: the prior 33 (including seven existing/added cliff-face polygons) plus four new grounded spruces. Historical phase-specific documents describing earlier counts remain historical.

**Passing source tests is not art acceptance.** Creator visual acceptance remains **0%** until creator inspects and explicitly approves a full cohesive playable scene. Phase 10 (camera and movement refinement) is still locked.

## Future Phase 9 order

1. Use the actual grove browser screenshot to correct overly uniform spruce silhouettes, depth overdraw, and any floating snow-bank seams.
2. Build a holistic cottage-to-street-to-cliff environmental composition, including believable stone/timber retaining walls, stairway connections, river/bridge banks, and varied illustrated architecture, not just source trees.
3. Reach Hollowreach's original richly illustrated `assets/village_v06_clear.jpg` standard; then produce the equally finished Greenwood counterpart against `assets/wilds_clean.jpg`. Keep expanding real-world art only as quality matches.
4. Verify on iPhone (Home Screen app) before final creator reinspection. Do not claim this is complete or advance Phase 10.

Testing: `npm run check`, `npm test` (includes `audit:shelterbelt`), `npm run audit:shelterbelt` and GitHub's real Chromium image capture workflow.
