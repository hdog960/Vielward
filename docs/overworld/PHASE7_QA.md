# Veilward Phase 7 — Climate, Ecology and Pixel Art QA

**Build:** v1.3.1 · **Source test:** `npm run audit:climate` · **Full test:** `npm test`

| Area | Source-level expected evidence | Required creator visual follow-up |
|---|---|---|
| Winter Hollowreach/Northwatch | Highest snow cover; alpine terrain materials and pine/snowstone ground objects | Snowy roads, winter shadows, no mismatched green trees |
| Three connected forest routes | Continuous snow gradient from village through Thawline into Greenwood | Walk every road without a biome portal, screenshot natural snowmelt |
| Thawline midslope | Intermediate snow fraction; mosaic ice/thaw/moss/foliage | Patchy snow and realistic ground color rather than straight palette line |
| Greenwood/Greenwood Falls | Low snow, green canopies, wetter waterfall-adjacent soils | Correct terrain density, scale and detail relative to winter reference |
| Mossmere river/lake | Water physics unchanged; marsh wetness and reeds around physical banks | Shoreline and islands believable; no water-walking or dead-end crossing |
| Worldscar high eastern terrain | Alpine snow fraction survives despite far-east longitude | Frost/runes/stone look coherent and landmark remains accessible |
| All 12 regions | Smooth global climate independent of tile boundaries; unchanged route geometry | No visible scene cut, wrong foliage edges, stranded roads or 8-bit look |
| Vegetation collision | Stable global feature IDs, same trunk/rock geometry in art and physics | No hovering feet, invisible bushes, walking on tree canopies |
| iPhone PWA update | Versioned source links, 18 cached chunks, new worker cache | Installed Home Screen shortcut refreshes and performs reliably |
| Save/character protection | Original save key, approved hero and Warden files untouched | No quest/inventory/gear/animation regressions |

**Not yet verified on a real iPhone:** illustration quality vs the creator's gold reference, frame rate or memory under long travel, fade/sorting/height occlusion in the full landscape. These must not be represented as approved after only automated passes.

**Known design gate:** Finish road and island artwork in Phase 8, complete physical outdoor QA in Phase 9, then **stop for creator full-world appearance approval before Phase 10**.
