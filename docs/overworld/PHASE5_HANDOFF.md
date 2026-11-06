# VEILWARD — Phase 5 Playable Material Production Handoff

**Build:** v1.2.9 · **Phase:** 5 COMPLETE (source atlas and functioning preview art) · **Next:** Phase 6 NOT STARTED.  
**Creator's hard gate:** Complete playable outdoor appearance review after Phase 9, explicit approval before Phase 10.

## Changes shipped to the actual game

- Added `terrain_art.js`: a real **16-family, four-variation, 64-frame pixel-art material atlas** generated *once* from source brush patterns. Color/pattern signatures are versioned and testable in `docs/overworld/TERRAIN_MATERIALS.json`.
- Updated `world_stream.js` to use this atlas during on-demand chunk rasterization while retaining lazy rendering, a 18-chunk cache budget, 72,000×48,000 global terrain and Phase 4 co-authored collisions. No full-world bitmap is allocated.
- Added authored scenic layers for snow, thaw, forest, grass, moss, ancient stone, river/lake pixels, shoreline glints, shadowed cliffs, timber planks, stone stairs, timber rails, rooted pines and oaks, lamp/light caps, rubble, and source-matched ground shadows.
- All paths/decks/props still obtain their coordinates from `world_geometry.js` / `terrain_geometry.json`. Unlike old painted-over screenshot geometry, the new preview visuals share the physical collision and elevation source.
- Added foliage foreground overlap for trees physically in front of the character's boot position. The existing **approved eight-direction Wanderer art** and its own shadow are left untouched.
- Added a **five-stop Terrain Material Showcase** in the *actual iPhone Journey Menu*, visible only after entering the preview. It cycles **Hollowreach snow → Thawline snowmelt → Greenwood forest → Worldscar arcane stone → Mossmere water/shore**, loading each region through the *real* streamer. This teleports only the non-saved preview actor and cannot modify the legacy quest character.
- Updated `game.js`, `index.html`, `visual.css`, and `sw.js` to build **v1.2.9** and offline cache `veilward-hollowreach-v129-material-atlas`. The art module loads after `world_geometry.js` and before `world_stream.js` on Safari and Home Screen.
- The original Hollowreach quest/combat/inventory/save scenes continue as the default; only opt-in preview art has been upgraded.

## Playtest: five visually distinct terrain environments

1. Open [the actual game](https://hdog960.github.io/Vielward/) on iPhone Safari or your Home Screen shortcut, open **Journey Menu**, and verify the running build reads **v1.2.9**.
2. Select **Explore Pixel-Art Terrain (Phase 5 Preview)**.
3. Walk a little; the old broad color-block procedural terrain should now show clustered atlas textures and physically drawn props/paths.
4. Open the menu again and tap **Visit Next Terrain Material** repeatedly to visit **Snow, Thaw, Forest, Stone, Water**. Walk around each destination and look for edge artifacts, mismatched scale, poor water texture, leg/ground hovering, blocked routes or tree-canopy occlusion.
5. Optional: toggle **Terrain Geometry Overlay: ON** to compare visible tree trunks/stone railings, roads and shorelines against actual foot collision; it continues to use Phase 4 ground geometry.
6. Use **Return to Hollowreach Adventure**. The normal village, approved hero sprite, Joren quest, gold, potions, equipment and old save should be unchanged.
7. Close/reopen the Home Screen app; verify v1.2.9 installed and screenshot any regions that look too coarse. The update has to appear in both Safari and installed PWA, not only the in-chat browser.

## Automated QA

- `tests/overworld_phase5_art.test.js`: source atlas counts/order/palettes, five biome destinations, determinism, chunk border continuity, 64 frame-crop bounds, renderer Canvas draw calls, true solid/source geometry and cache, input gallery, protected sprites, iPhone worker asset version parity.
- Previous `audit:streaming`, `audit:geometry`, combat, quest/save, navigation, protected asset and topology tests remain part of `npm test`.
- QA verifies real source and simulated Canvas drawing. It **does not prove** exact visual fidelity to the background photos, iPhone 60 FPS, or device-memory use. Those need on-device observations and later region-by-region art work.

## Phase 6 handoff

Read `TERRAIN_ART_STYLE_GUIDE.md` and `TERRAIN_MATERIALS.json` first. Build **Hollowreach village** into the actual new continuous outdoor terrain with coherent stone roads, cottage, riverbank, front/back trees, snow edges, stairs and player scale. Preserve the source art and fine detail target seen in `assets/village_v06_clear.jpg`. Author meaningful region-specific chunks rather than procedurally stamping an entire 48×32 grid of generic materials. Keep the 65-source route graph and Physics Phase 4 authoritative; add or refine footprints and materials in the same source when art changes. Verify on the actual iPhone and debug terrain overlay.

**Stop at Phase 5.** Await the user's next `Continue development` or patch direct feedback immediately. Phase 9 appearance approval is still mandatory.
