# Veilward Phase 6 — Full Footprint Travel and Visual QA

**Target:** build v1.3.0. Status: automated geography/render/collision checks, not on-device approval.

| Check | Source-backed result | On-iPhone assessment pending |
|---|---|---|
| Twelve regions exist | All 12 source region IDs have a landmass interior, biome source palette, environment grammar and 12 named survey stops | Do they look differentiated and intentional? |
| Entire landmass traversability | Global outline physically blocks only off-land movement; 65 roads, 7 bridges/fords remain | Walking, river bank readability, steep escarpments |
| Full world not blank | Material tiles, 13 authored hubs, 35 large clearings and deterministic wilderness feature cells exist around each macro region | Are areas richly composed rather than repetitive? |
| Snow village fidelity anchor | Joren's snow-roof cottage authored over his *existing physical polygon*, while the original approved village art remains playable in the legacy scene | Is scale/detail acceptable compared with approved scene? |
| Natural barriers | Solid woods/rocks/ruins/crystals share one deterministic foot-collision radius and drawn object position | Tree canopy, collision and shadow perception |
| Floor-to-void boundary | 29-point outer cliff perimeter; rendered even on chunk spans with no endpoint in view | Edge clipping, shoreline/canyon silhouette |
| World memory bounds | 18 offscreen terrain images + max 6,000 memoized feature cells | Real iPhone memory, frame rate, stutter |
| Quests and player art | Legacy save key and approved eight-way hero source unchanged | Home Screen cached art / save regression |
| Future gate | Creator must approve the ENTIRE visual overworld after Phase 9 | Pending; no Phase 10 work |

## Follow-up scope and gate

Phase 7 is dedicated to **gradual snow-to-green seasonal/elevation climate, vegetation variation and shoreline/lighting blend**. Phase 8 refines region detail, crossings, landmarks and access. Phase 9 verifies the complete actual outdoor world, including creator appearance review.

Any playtest feedback requires patching the **game source and deployment** in the current turn; do not send conceptual sprite art as a substitute.

## Tracking
- Main world: `docs/overworld/world_blueprint.json`
- Ground and scripted objects: `docs/overworld/terrain_geometry.json`
- Global 12-region landmass: `docs/overworld/outdoor_footprint.json`
- Real art/collision bridge: `world_footprint.js`, `terrain_art.js`, `world_stream.js`
- Source test: `tests/overworld_phase6_footprint.test.js`
