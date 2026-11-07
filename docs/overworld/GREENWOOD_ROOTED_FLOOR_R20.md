# VEILWARD — Phase 9, R20 rooted forest-floor tapestry

**Build:** v1.3.28. **Status:** still 0% artist acceptance; Phase 10 locked.

## What actual gameplay showed
The player sprite is better than the environment. R19's larger original painted trees improved scale, but the visible world was still peppered with distracting, repeated tiny squares and disconnected grass marks instead of a lush contiguous woodland floor.

## Exact in-game implementation
- `world_greenwood_art.js` adds `paintRootedUnderstory`, a bounded renderer that consumes only `footprint.cells` and `footprint.groves` (original authority for tree roots). It places the existing independent R18 128px transparent fern illustration in varied low, naturally overlapping clumps around each original tree/shrub root. It checks real biome boundaries, the true road network, source water, and physical building obstacles before drawing and does **not** change collision.
- `paintForestFloor` eliminates its old batch of 27 deterministic isolated micro-rectangles per 460px zone and the extra eight flecks per source tree, retaining the continuous original-grade forest shade, source roads and all original rooted foliage features.
- `world_illustration.drawGround` skips only Greenwood's scattered 112px grass/flower drawings. `terrain_art.climateDetails` omits the duplicated 96px marks only inside Greenwood; all other biomes remain unchanged.
- Ground art still paints below genuine routes and existing original tree sprite artwork. The original R18 independent AVIF sources (oak, pine, ferns, moss-rock) are unchanged, as are the R19 feathered real-road verges and final tree silhouettes.

## QA and scope
- New test: `tests/greenwood_floor_r20.test.js`, validates source-only plant placement, no spatial source mutation, separated biome, source-art cell, ordinary world saves and feature registration.
- Real browser capture: `GREENWOOD_R20_HERMIT_FLOOR`, taken at a physically walkable point at the existing hermit landmark and not a mocked screenshot.
- 12-region world, 39 physical solids, 48 travel anchors, 65 routes, seven crossings, protected original Wanderer/Warden sprite sheets and `veilward-hollowreach-v01` save key remain unchanged.
- The current work is **not** evidence of physical iPhone testing or acceptance. Full premium Greenwood 2.5D visual fidelity, architecture, density and the remainder of the map still need major environmental artwork.

**Creator acceptance:** 0%. **Phase 9 ACTIVE. Phase 10 LOCKED.**
