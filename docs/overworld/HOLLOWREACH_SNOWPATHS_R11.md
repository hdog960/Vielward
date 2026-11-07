# VEILWARD v1.3.17 — Phase 9 R11: Worn Snow Paths in the Playable Village

**Actual iPhone/browser game source** · **Art acceptance remains 0%** · **Phase 10 stays locked**

## Reason for this pass

The real browser view of v1.3.16 remained an unused-looking, flat winter courtyard despite the new retaining walls and trees. Hollowreach's reference `assets/village_v06_clear.jpg` has a carefully lived-in network of tiny tracks and snow-worn routes. This slice adds *travel history* grounded in the world that already exists rather than a detached decorative object or a new fake path.

## Implemented

- `world_raster_pilot.js` now provides `drawWinterFootpaths(ctx,bounds)`, placing alternating worn heel/toe impressions in snow along **the actual physical `geometry.roads[].parts`** connected to the authored Hollowreach village and thresholds.
- Each imprint is computed at a deterministic absolute distance along its source road; the same chunk reproduces exactly the same pattern after camera movement, and partial chunks agree at boundaries.
- Footprints are confined to the winter region, checked against the original road network, real water and obstacle geometry, and culled to a modest radius around the village. Missing patches create realistic wind-worn gaps. They have **zero collisions**, no extra roads, and no player input/save effect.
- `terrain_art.js` paints the impressions **after** actual painted roads and **before** source-backed village architecture and vegetation, so boots read as impressions under the real scenery rather than floating above cottages.
- At real gameplay zoom the marks were initially too faint. Their outline size, depth and snowy lip contrast were raised modestly following the actual browser capture; they remain visually subordinate to the street.
- `tests/hollowreach_snowpaths_r11.test.js` checks that source-traced boot marks are deterministic, located on real walkable roads and not in water/buildings, produce no marks outside Hollowreach, preserve 48 travel anchors, 65 roads, seven crossings, 39 existing physical solids, and use the original localStorage save key.
- `scripts/visual_capture.mjs` now includes a separate walkable **HOLLOWREACH_SNOWPATHS** gameplay screenshot and a runtime register check; normal Hollowreach, terraces, grove, walls, Greenwood and atlas screenshots remain.

## Non-negotiable artist acceptance and next step

The user explicitly likes the original painterly `village_v06_clear.jpg` world and **does not accept** low-detail polygons, disconnected sprites or procedural decoration as substitutes. This slice is an incremental pass for grounded environmental storytelling, not an approved screenshot and not a finished neighborhood.

**Phase 9 stays ACTIVE and Phase 10 LOCKED. Creator visual approval is still 0%.** The major remaining goal is to build a truly coherent painted scene: integrated snow cliffs and connected architecture, authored elevated stairs only where navigation elevations allow, mature foreground vegetation, river banks/bridges that read as real geography, and equivalent Greenwood visual overhaul. Do not claim visual signoff from CI or continue placing unrelated low-detail props.

Verification: `npm run check`, `npm test` (which includes `audit:snowpaths`), GitHub real-browser screenshot workflow, GitHub Pages live deployment, and eventual iPhone Home Screen creator inspection.
