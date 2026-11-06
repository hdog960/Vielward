# VEILWARD — Phase 5 Pixel-Art Materials & Compositing Style Guide

**Status: IMPLEMENTED in the playable v1.2.9 Phase 5 outdoor preview.** This is the first functioning 2.5D-inspired environment material pipeline, **not the creator-approved finished world art**. Phase 6–9 will substantially enrich specific locations and adjust any devices' visual problems.

## Reference art (existing protected game assets)

The palette and shadow language are derived from the existing **approved game's illustrated scenes**, not unrelated clip art:

- `assets/village_v06_clear.jpg`: frosty blue-purple and slate shadows, clustered white/blue snow edges, stone and timber, warm lamps, directional falling terrain.
- `assets/wilds_clean.jpg`: mossy stone, layered forest-green foliage, sunlit clearings, illuminated lanterns and wooden bridges, blue water.
- `assets/cave_clean.jpg`: desaturated violet/shale depths, icy cyan reflection, layered cliffs and warm lighting.

These reference JPGs are **not stretched into roads or fake collision maps**, and the approved player/Warden artwork stays intact.

## Source atlas, material identities and provenance

The *real shipped game* loads `terrain_art.js` after the already-shipped `world_geometry.js`. `terrain_art.js` creates **one 256×256 in-memory Canvas source atlas** with **16 material families × 4 source variations each = 64 hand-composed 32×32 pixel cells**; it has no extra downloaded asset and uses fixed motif functions for clustered highlights, drifts, pebbles, leaves, flowers, water ripples, reeds, plank grain and runic stones. The full source-to-game list, palette hex colors, frame indexes and location rules are in [TERRAIN_MATERIALS.json](./TERRAIN_MATERIALS.json), which is regression-checked against the live code.

| Material source ID | Appearance and practical use | Relationship to the art references |
|---|---|---|
| `snow` | Packed snowy footpaths with pale crystalline drift shapes | Hollowreach snowbanks and compacted walkways |
| `frost` | Wind-scraped ice-stone with blue-gray fissures | Northwatch/Coldpine escarpment and altitudes |
| `thaw` | Moss, wet soil and surviving snow fragments | Long, gentle transition between climates |
| `forest` | Layered greens, small wildflower/leaf clusters | Greenwood organic undergrowth |
| `grass` | Meadow grasses and warm off-white blossoms | Heatherwood clearings and lake island |
| `moss` | Darker wetland green-gray with mineral highlights | Greenwood Falls rocky moss |
| `road` | Cool beige/gray pebbled roadway | Old Crown routes |
| `dirt` | Brown, warm compacted path earth | Soft woodland trail shoulders |
| `stone` | Slate and pale stone patterned blocks | Steps, buildings and Northwatch memorial |
| `ruin` | Violet-tinted broken masonry | Historic watchtower fragments |
| `wetland` | Reeds, marsh mud, green-blue shadows | Mossmere shallows |
| `river` | Glacial blue flow and short white ripple marks | Frostbridge river and cascades |
| `lake` | Deeper, calmer blue surface with intermittent reflections | Mossmere lake body |
| `cliff` | Recessed mauve/gray layered rock | Cliffs, ravines, and steep outer walls |
| `arcane` | Worn purple-gray ancient stone with tiny glints | Worldscar ring |
| `timber` | Tan-brown wood grain and separated dark planks | Bridge decks, fences, old timber |

## Required compositing order

1. **Global-grid environment pixels:** Sample each world cell from an absolute `96`-world-unit grid, not from a per-chunk origin. Repeat the 32px source tile at 96world dimensions. Draw with image smoothing **off** on all terrain so pixels stay crisp.
2. **Snow/moss/forest transition:** Blend the visual region *by material variety* near macro-region boundaries. The base material selection uses weighted region distance and deterministic tile-level mottling; no solid biome rectangle or false portal.
3. **River, canyon, lake and shoreline:** Calculate water occupancy from global river lines/lake polygon. Draw atlas water/clouded rock and square-edged shoreline glints directly against that occupancy. Do not paint walkable surfaces over invisible water except explicit authored bridge/ford/causeway decks.
4. **Authored land/paved surfaces:** Clip material-atlas stamps to **the same floor polygons** used by `world_geometry.js`. Don't approximate polygon masks from screenshots. Height bands and stair routes remain authored geometry, not derived from color.
5. **Path/road/stairs/bridges:** Draw **the exact geometry.roads path** with dark edge, muted inset material, oriented planks/treads/stone details and two timber edge rails where appropriate. Road thickness tracks the physical path half-width, not an independently guessed brush width.
6. **Solids and anchored shadows:** Draw blockers from `geometry.solids`, respecting each true footprint: tree roots and offset crowns; wood rail posts; lanterns; stone monuments; cliff face shading. Ground contact shadow stays immediately under the solid, not disconnected several feet south.
7. **Characters and dynamic occlusion:** Render the **approved Wanderer eight-direction atlas** unchanged at its boot-point world coordinate. Existing player shadow remains provided by the same approved character renderer. Only front-facing foliage that is physically in front of boots may overlay the character; it has separate transparency from collision and must not hide the entire avatar.
8. **Diagnostics:** The Phase 4 overlay is optional and never becomes part of final art. It must continue showing true walkability, blocker outlines and ground-height information from source geometry.

## Tile seams, device performance and color rules

The 1,500-world-unit runtime chunk size is not a multiple of a 96-world-unit source tile. **This is intentional:** neighboring chunk renderers must crop and repeat **the same** global tile at both ends instead of generating independent border motifs. Tests verify material/variant identity and shared overlapping source cell at a chunk seam.

Keep the **18-chunk LRU** and 375×375 streamed Canvas target initially. 64×32² source atlas pixels occupy about 256 KB raw RGBA, while cached terrain canvases remain bounded to around 10 MB raw RGBA. These are **estimates of raster backing storage**, not iPhone Safari total memory or guaranteed frame-rate readings.

For material edits:
- Reconcile all palette IDs and source frame names against `docs/overworld/TERRAIN_MATERIALS.json`.
- Keep dark/cool ground shadows, lighter high-frequency texture marks and selective warm accents. Avoid muddy full-gray fill or white image matting.
- Prefer purposeful cluster/sprite variation and maintain the existing approved scene's rendered look. Prevent abstract vector-only replacements or repetitive low-resolution checkerboard fields from being called final environment art.
- Check at normal iPhone landscape size *with the Wanderer in frame*. A beautiful art-only sheet is not an acceptable delivery.

## Visual quality limitations and acceptance

This is a **source-controlled functional first atlas pass**, not a claim that the entire 72,000×48,000 world already equals the detail of the village JPG. Region-specific architecture, terrain chunk composition, foliage silhouettes, waterfall animation, transition falloffs, cliff tiling and lighting depth will still be built in Phases 6–8. The five in-game **Terrain Material Showcase** destinations make those differences easy to inspect without changing original quest saves.

**Mandatory review remains after Phase 9:** The creator must inspect the *actual complete playable outdoor appearance* and approve it before Phase 10. Phase 5 art-source checks and in-game screenshots do not supersede that requirement.
