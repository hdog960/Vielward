# Veilward — Phase 9 Art-Direction Reset / R3 Materials (v1.3.7)

**Creator's visual acceptance remains 0%. Do not describe this milestone as complete or visually accepted.**

## Creator's side-by-side rejection
The creator compared the current procedural overworld preview to the **original fully authored Hollowreach screenshot** (in-game original snowy village). The overworld had flat snow particles, vector road tubes, simplified trees, primitive cottages and missing authored depth, while the original has dense intentional painting of stone cliffs, snowy branches, lanterns, walkways, buildings and natural ground. This mismatch is fundamental. The prior R1 and R2 approach of adding more Canvas polygons **WAS NOT** a migration path to the approved style. Stop claiming that adding more geometric fixtures improves art acceptance.

## Non-negotiable reconstruction approach

- Keep approved original environments: `assets/village_v06_clear.jpg`, `assets/wilds_clean.jpg`, the original core Hollowreach/forest/interior gameplay, hero/NPC art, camera feel and lighting. Do NOT repaint or replace the source paintings.
- Keep 12-region authored physical topology, 65 road links, 7 bridges/fords/causeway, 48 named navigation anchors and all save keys. The architecture must follow the authentic travel geometry; never paste the full approved scene behind a moving actor and pretend the walkable terrain was constructed.
- The revised production art pipeline must use **genuine raster environment assets**. Build reusable scene-matching material tiles, masked foreground/environment sprite atlases, illustrated 3/4 roof and wall variants, elevation, river/bridge pieces. These assets must be inspected in real runtime screenshots at iPhone gameplay scale. No SVG-ish or Canvas-only shapes as finished foliage, huts, rocks, roads or stairs.
- Production art overrides must have source-based boot collision, soft occlusion and landmark identity. Collision must be updated together with a new visible object and disabled together with any temporary placeholder object.
- Prove fidelity in the smallest playable visual slice (Hollowreach and Greenwood) **before** mass-producing art for all 12 regions. Only build other biomes after those initial reference comparisons pass. Do not continue Phases 10–22 until a creator review approves the art.

## What changed in v1.3.7 (NOT the final rebuilt art)

`world_source_materials.js` now uses the **existing original paintings** (900×584 pixel clean refs) to create a 64-cell atlas across 16 real surface/material categories with four patches each. It samples real hand-painted snow, moss, dirt, water, stone, cliff and bridge timber **as small, reusable, mirrored texture swatches**, never the entire image as a fake map background. This is a first material source and is *not* intended to represent authored finished object sprites. Small mirrored patches may themselves be too repetitive and must be replaced with genuinely author-cut pieces if visually rejected.

The live browser world preview now waits for BOTH source paintings to load before creating the tile streamer; if either is unavailable it fails closed and preserves the original adventure, rather than replacing artwork with noisily rendered placeholders.

The genuine original-material path disables `world_setpieces.js` primitive cottages/stalls/obelisk clutter **and their physical collision at the same time**. The compatibility renderer and older source modules remain in the repository for test and topology history only, not finished art. The raster atlas replaces old synthetic 32px material cells in `terrain_art.js`, disables overlaid random speckle patches, and permits `world_routes.js` to sample the original road, timber and stone raster paint for existing source walkways. Old geometric tree silhouettes may remain *temporarily* for geographic legibility; they do **not** meet the original artistic standard.

`tests/world_source_materials.test.js` asserts 64 original-image atlas cells were actually stamped from the approved source assets; no full screen backdrop substitution; 48 safe nodes, sampled 65 road centerlines, original crossing count, removed placeholder colliders and strict web/offline asset-parity.

## Next required art-production stages

1. **Asset cutting:** build a dedicated approved-style environment sprite/tile sheet **with individually isolated** snow-laden firs, deciduous branches, snow banks, shrub clusters, stone cliff ledges, fences, roof/eave/wall modules, bridge railing and walkway planks. Assets must be real PNG/WebP/AVIF art, not runtime polygon shapes.
2. **Hollowreach pilot:** compose one village block with correct raised cliff geometry, cabin/roof silhouettes and foreground depth at the player-to-house scale of the golden screenshot, including proper lighting/occlusion. Inspect on the actual running iPhone version.
3. **Greenwood pilot:** build corresponding illustrated forest and creek valley, preserving authored paths and player footpoint, lush overlapping canopy depth and earthy materials. Inspect on actual running iPhone.
4. **Expand** approved material grammar and actual sprite maps to remaining 10 regions, compare browser/iPhone pictures against references, optimize PWA/GPU/canvas load, obtain creator approval.
5. Only then return to locked post-Phase-9 roadmap.

The **last creator visual acceptance was zero**. Do not advance acceptance because a test passed.
