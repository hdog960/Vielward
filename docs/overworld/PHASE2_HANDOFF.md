# VEILWARD — Phase 2 Handoff to the Runtime World Rebuild

**Completed Phase:** 2 — Full terrain topology / master geography blueprint  
**Status:** Source-authored, validated planning map; no new playable world or runtime art has shipped in this phase.  
**Source:** [master map](./MASTER_MAP.md) · [vector schematic](./MASTER_MAP.svg) · [editable map data](./world_blueprint.json) · [topology QA](./PHASE2_TOPOLOGY_AUDIT.md)

## Delivered

1. Designed all **12** approved macro regions in one connected outdoor geography: Hollowreach, Northwatch, Coldpine, Frostbridge River, Thawline, Greenwood, Greenwood Falls, Mossmere, Heatherwood, Old Crown Road, Smugglers' Ravine, Worldscar Uplands.
2. Defined 48 global planning landmarks/foot-point anchors, 65 unique travel links, heights 1–6, five major contour guides, river source and outflow, one actual lake with island land polygon, and one dry canyon.
3. Established four river crossings, two lake-island approaches and one rope bridge across the ravine. Removed draft roads that traversed open river/lake water without a proper crossing and added a credible southern meadow loop.
4. Designed three distinct connected village-to-forest routes (main, north, south); no biome teleport action. Connected the local monument circuit, real Joren doorway threshold, southern market trade loop, Worldscar return and Smuggler's cave entrance.
5. Proposed provisional source scale: 1,200×800 map plan coordinates, 60 world units per plan unit, **72,000×48,000** world bounds, 1,500-world-unit chunks, **48×32** logical grid. These dimensions may be tuned after actual device profiling; the conceptual geography and connections must remain coherent.
6. Authored `scripts/render_overworld_blueprint.js` and deterministic `docs/overworld/MASTER_MAP.svg`; the map is derived from data, not independently hand-drawn and subject to drift.
7. Authored `tests/overworld_phase2_topology.test.js`: 943 pre-commit source-model assertions for graph reachability, crossroads, water-boundary intersection, intended bridge types, environmental height changes, route math, approval gate and exact map-source parity.
8. Preserved all protected player/Warden/scene assets and legacy save fields. Current v1.2.6 still shows existing separate scene illustrations until the playable streaming world is created.

## Hard technical rules for Phase 3

**No unnecessary full rewrite:** Keep the current stable playable scene while introducing a new global outdoor world model *alongside it*, optionally feature-flagged. Never remove the four current scene entry methods before the new world proves functional.

**Authoritative source:** `world_blueprint.json` defines the intended *macro* world and landmark graph, **not** production collision polygons. Implement a proper master world coordinate mapping with consistently derived rendering, collision, elevation, streaming and object IDs from one structured terrain source. The overlap in biome influence polygons means they cannot function as region-exclusive walk masks.

**Chunk performance:** The 48×32 grid is logical addressing only. Do not allocate 1,536 full-resolution textures or keep them in memory at once; stream a small needed neighborhood near the camera, unload old chunks and implement deterministic cache and fallback/loading behavior appropriate to Safari.

**Preserve saves:** Save key `veilward-hollowreach-v01`; no reset. Reuse the **legacy_scene_anchors.json** migration list. Preserve Joren quest, chest, herb pickup, scar attunement, defeated enemy IDs, skill progression, gold and equipment. The old village and Greenwood coordinates are in *two independent local coordinate systems*; never simply add coordinates to each other to infer continuous location.

**Physical thresholds:** The cottage door and cave mouth are portals only in the literal enter/exit sense; ordinary outdoor biomes never open a dialog to change backgrounds.

**Quality:** Source tests are necessary but insufficient. Do not claim full world artwork or seamless in-game movement completed at Phase 2. Actual world and image streaming begins in Phase 3, coauthored collision in Phase 4, art pipeline in Phase 5, regional footprint/biomes/roads in Phases 6–8, full route survey and creator appearance review in Phase 9.

## Next instruction

Wait for **"Continue development"** before beginning **Phase 3 — Seamless chunked outdoor rendering**. Implement one complete phase and push it; user feedback must be patched directly into the game as usual.

**Checkpoint cannot move:** Creator must review and explicitly approve full outdoor world appearance after Phase 9 before Phase 10. A Phase 2 diagram is not the appearance approval.

**Reference files:** `docs/overworld/WORLD_DESIGN_LOCK.md`, `docs/overworld/COORDINATES_AND_MIGRATION.md`, `docs/overworld/ISSUE_REGISTER.md`, `AGENTS.md`.
