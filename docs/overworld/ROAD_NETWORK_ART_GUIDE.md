# Veilward — Route and Crossing Art Contract (Phase 8)

**Source of truth:** `world_blueprint.json` + `terrain_geometry.json` through `world_geometry.js`. `world_routes.js` does not define a separate road path. All rendering in world-space is clipped by the lazy streaming chunk, so long roads can cross tile boundaries without geometry changes.

## Road bodies
- Source `roads[].path`, `roads[].parts`, `roads[].halfWidth`, `roads[].fromHeight`, `roads[].toHeight`.
- Tread is narrower than physical foot clearance. Alpine uses snow/ice shade; snowmelt uses wet earth; forest tracks use mossy compacted soil; basin uses wet stone; arcane upperland uses cool violet gray.
- Scattered pixel gravel uses deterministic world samples, not runtime randomness. Junction and terminus markers are inlaid texture and do not pretend to be interactable containers or signs.
- Stairs and switchbacks receive repeated physical cross-axis markings with a 45/62 world-unit rhythm. Artist polish on true high-relief stairs continues with foot/occlusion Phase 11.

## Seven physical crossings
| Route | Kind | Authored deck | Drawn rail + solid rail guard |
|---|---|---|---|
| north_bridge_w → north_bridge_e | bridge | stone-and-timber | yes |
| bridge_w → bridge_e | bridge | wooden | yes |
| ford_w → ford_e | ford | raised stepped stones | no |
| falls_w → falls_e | bridge | stone-footbridge | yes |
| mossmere_w → island | bridge | wood-and-rope | yes |
| island → mossmere_e | causeway | stone | no |
| ravine_bridge_w → ravine_bridge_e | bridge | timber-rope | yes |

All crossing centerlines, real banks, island and elevation source remain exactly as planned in Phase 2/4. Bridge rail stroke center is at 87% of the physical deck halfwidth. `edgeGuard()` uses that same position, foot radius, and a 7% unrailed approach at each end. Side guards are not painted as unexplained invisible walls. On both ford and causeway, no bridge rails or false drowning risk are added.

## Source-alignment principle
Phase 8 `terrain_art.js` paints water from `geometry.waterAt` rather than from a separate 205-world-unit artist mask. Bridges draw on top of the physical hazard. No scene swap when crossing from one outdoor region to another. Exterior interactions should be used only for actual indoor thresholds. The visual quality bar remains the original snowy village reference, not this first source-coupled set of traversal layers.

## Next artist review
During Phase 9 inspect all source roads against real iPhone screenshots, route heatmaps, reachable ledges, shoreline/railings and slow walking. Fix actual defects before requesting full-world appearance approval.
