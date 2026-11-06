# VEILWARD — Phase 6 Full Outdoor Footprint (v1.3.0)

**Status:** PHASE 6 IMPLEMENTED in the actual playable outdoor preview. This is not the finished high-detail painted 12-region scene and does not satisfy the creator's visual approval checkpoint. **Next: Phase 7 — climate, vegetation and biome continuity.** Do not start Phase 7 until the next development instruction.

## Scope actually shipped

The previous Phase 5 environment made all 1,536 logical chunk addresses drawable, but individual outdoor areas could look like sparse materials. This phase gives the full plan a **single explicit physical landmass outline** (`docs/overworld/outdoor_footprint.json`) and geographically distinct environmental composition rules across **all 12 approved regions**, with real collision, authored anchor clearings, landmarks and varied wilderness.

- **Physical world footprint:** 29-point irregular exterior land boundary mapped into the 72,000×48,000 global outdoor space. The boundary is visible as a rock/ice edge, cannot be walked across and follows planned geography. A south-Mossmere road clipping the original draft outline was fixed after a full route survey.
- **Routes:** **65 planned physical road/bridge/stair connections**, **7 explicitly grounded water/chasm crossings**, and **three distinct Hollowreach → Greenwood approaches** remain traversable. No outdoor button swaps the background. The old intro adventure continues independently.
- **Full-region ecology:** Rules for 12 biomes control ground clutter, tree/grove frequency, rocks, snowstones, ruins, highland cairns, reeds, wildflowers, fallen timber and Worldscar crystals. Natural standing obstacles are deterministic **per global 380-world-unit field cell**, lazily generated. They have the exact same footprint in art and player collision; small plants are decorative and nonblocking.
- **Real clearings / landmarks:** 13 major hub environments and **22 authored route clearings**, together 35 protected travel/landmark clearings. Locations include Joren's workshop, Coldpine lodge, Northwatch memorial, Greenwood clearing, hermit retreat, falls overlook, Mossmere island sanctuary, Heatherwood market, Old Crown watchtower, Smuggler's cave threshold and Worldscar stone ring. Joren's workshop uses the **existing actual collider polygon** to draw a more distinct snowy timber cottage with roof, shingles, windows, chimney and a ground shadow rather than a duplicate scenery card.
- **Rendering:** `terrain_art.js` now layers globally sampled pixel-material tiles → landmass/cliff borders → actual floor polygons → road and bridge strokes → regional groundcover/landmark composition → physical solids → approved Wanderer → foreground vegetation. Solid blocker rendering and walking are based on the same `world_footprint.js` positions and Phase 4 `world_geometry.js` data.
- **Memory:** Runtime tile LRU remains **18 375×375 Canvas tiles**; natural feature-cell cache has a separate **6,000-entry FIFO limit**. No eager generation of all 1,536 outdoor chunks. The iPhone footprint still needs real on-device performance and visual QA.
- **Tour:** Actual Journey Menu has **Explore Continuous Overworld (Phase 6)**; inside the preview, **Visit Next Region · 12-Region World Survey** cycles every macro-region at a grounded named anchor, using the same real streamer and navigation. No quest/game save is changed when touring. The terrain debugging overlay also outlines natural collisions.

## Real iPhone verification procedure

1. Open the Home Screen app or [Veilward on GitHub Pages](https://hdog960.github.io/Vielward/) and check the Journey Menu shows **v1.3.0**.
2. Choose **Explore Continuous Overworld (Phase 6)** and move with the same joystick. Examine the snowy Hollowreach square, cottage and physical river crossing. The already approved Wanderer sprite and old snowy v1.2.x adventure remain available.
3. Open Journey Menu and tap **Visit Next Region** through all **12** destinations. At each, walk beyond the immediate clearing and verify the road surface, foliage and rocks are region-specific and physically anchored. Observe that routes and foot shadows remain on ground.
4. Turn **Terrain Geometry Overlay: ON**. Stand against a tree, boulder, stone, ruin or outer cliff. Verify visible obstacle and player collision match. Groundcover such as reeds and flowers should not be an invisible wall.
5. Follow a full outdoor road in either direction through several real chunk boundaries. No scene-swap prompt, pure-black blank tile, incoherent cliff cut or abrupt character offset should appear.
6. Exit preview via **Return to Hollowreach Adventure**. Confirm Joren quest, gold, equipment, health, inventory and saved location have not changed. Close and reopen the iPhone Home Screen shortcut and verify v1.3.0 remains installed.

## Tests and caveats

`tests/overworld_phase6_footprint.test.js` walks **all 65 route centerlines** at short spatial intervals and checks region reachability, physical outer boundary, biome-specific density, identical deterministic solid collisions, prop art rendering, region-survey teleport grounding, cache limits, PWA source version parity and approved sprite preservation. Older scene, navigation, combat, quest, Phase 1 protected-art, Phase 2 geography, Phase 3 streaming, Phase 4 physical geometry and Phase 5 material tests remain in `npm test`.

**Do not claim:** These source-level checks are not actual iPhone frame profiling, full 2.5D projection fidelity, final designer-approved environmental art, world population or finished quests. The new wilderness still uses a material source atlas and authored procedural cell grammar; Phases 7–8 must deepen region-specific composition, especially climate/shore transitions, village-scale architectural polish, true terrain relief/occlusion and foreground layering. The creator's **complete overworld appearance approval after Phase 9** remains mandatory before Phase 10.

**Development workflow remains absolute:** user tests → user gives screenshots/notes → assistant patches this same playable GitHub build and verifies push/deployment → user retests.
