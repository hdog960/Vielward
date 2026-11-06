# VEILWARD — Overworld Phase 4 Handoff (build v1.2.8)

**Status:** Phase 4 code and data shipped to the playable Phase 4 outdoor preview. Actual final full-overworld pixel art and iPhone visual approval remain outstanding.  
**Next:** Phase 5 — approved pixel-art terrain materials, atlases, compositing, masking, and shadows. No Phase 5 work has begun.  
**Hard creator checkpoint:** After Phase 9, the creator must review and explicitly approve the *entire actual outdoor playable appearance* before Phase 10.

## What changed in the actual game

- Added `docs/overworld/terrain_geometry.json` — authored **7 floor surfaces**, **30 true blocking props/terrain solids** (including 4 cliff faces, tree trunks, fence/rail lengths, lantern posts, shrine plinths), and **11 location-specific inspectable objects**. All use plan coordinates consistently transformed by the blueprint's global 60× world-unit scale.
- Added `world_geometry.js`, the **authoritative walking, physical obstacle, elevation, material, stair/bridge/deck, and interaction source**. It compiles the Phase 2 **65 travel links** into georeferenced path polylines, 7 crossing decks and elevation slopes, and indexes route segments sparsely by logical chunk. **The visible ground/solid polygons are rendered from those same exact authored objects**, not independently hand-approximated artwork.
- Updated `world_stream.js` to draw those floor patches and blocked props into its on-demand tiles, read one consistent walking-foot collision radius, consult `geometry.step()` for actual movement, surface terrain material and altitude for the debug HUD, and paint the live developer overlay. The original 72,000×48,000 world and **18 × 375² cache bound** remain.
- Updated `game.js`: Journey Menu → **Explore Outdoor Terrain (Phase 4 Preview)** loads *both* blueprint JSON and terrain JSON before enabling the preview; the **Terrain Geometry Overlay** button appears only in preview. The banner lists the current ground material, altitude and cached chunks. The existing **✋ Talk** button becomes **✋ Inspect** in the preview, and offers read-only location text at named landmarks. Keyboard **E** likewise inspects. On returning to Hollowreach, the original quest HUD and buttons are restored.
- Updated `index.html`, `visual.css` and `sw.js`: **v1.2.8** HTML/worker/cache, version-busted `world_geometry.js?v=1`, `world_stream.js?v=2`, `game.js?v=20`, `visual.css?v=12` and `terrain_geometry.json?v=1`. The updated Home Screen app must activate its new worker cache `veilward-hollowreach-v128-terrain-geometry`.

## Exit-gate evidence (source-level)

- The authored walkability model was surveyed over **65 paths with 20,864 continuous sample steps** and **41,955 Phase 4 assertions** in a Node-compatible source simulation; each scripted road centerline could be followed without a collision or abrupt altitude jump. All 7 bridge/ford/causeway decks passed midpoint surface checks. Decorative collisions that initially overlapped roads were moved out of the route.
- The full legacy navigation, combat and quest/save test suites continue to run in `npm test`; Phase 1 protected-art and Phase 2 topology/source-generated map assertions are retained.
- Geometry visual-and-collision coupling: cliff polygons, tree trunks, rail segments, lantern posts and shrine foundations are drawn from `terrain_geometry.json` and tested against precisely the same coordinate shapes. A cliff/river crossing is only traversable on its documented physical surface, and stairs interpolate route elevations continuously.
- **Important limitation:** These tests exercise coordinate geometry and Canvas drawing calls, not the perceived final visual placement on an iPhone. *Full 2.5D tree canopy occlusion, detailed rails, architectural perspective and actual pixel-art terrain texture matching still need authored Phase 5–8 assets and on-device screenshot QA.* Do not mark the creator's screenshot issues as visually approved yet.

## Testing on the user's iPhone

1. Open [Veilward](https://hdog960.github.io/Vielward/) via iPhone Safari or the Home Screen shortcut and check that Journey Menu says **v1.2.8**.
2. Enter **Explore Outdoor Terrain (Phase 4 Preview)**. Move with the original joystick. The approved Wanderer sprite remains unchanged.
3. Inside the preview, open **☰ Journey Menu → Terrain Geometry Overlay: ON**, then resume the preview. **Green samples = walkable**, **red samples/outlines = blockers**, yellow/blue route traces = crossings/paths, and the crosshair text displays **FOOT coordinates and ALT**. Confirm the boots, blockers, steps and camera agree.
4. Try walking against a tree trunk, fence rail, standing stone or cliff. It should stop; stepping along a supported road/stair/bridge should remain smooth. Water and chasms should only pass at dedicated crossing decks.
5. Walk near a named location and tap **✋ Inspect** or press **E**; a read-only dialogue should describe that landmark without changing quest progress.
6. **☰ Journey Menu → Return to Hollowreach Adventure.** Recheck Joren's quest, your weapon/gold/potions and the snowy settlement. Close/reopen the app; local save is the unchanged `veilward-hollowreach-v01` key.

## Engineering constraints for Phase 5

- Keep **the approved hero eight-direction art and Warden Hal** unchanged. Do not quietly replace them or alter avatar scale to compensate for missing foot geometry.
- The current Phase 4 world previews are *diagnostic and procedural*, **not finished player-facing pixel art**. Phase 5 must implement authored material and silhouette rules: snow, moss, river, rock, shaded cliffs, foliage, ruins, stair treads, planks, alpha cleanup, occlusion masks and lighting. Author art against the same source floor/solid polygons and anchor coordinates. Any visual correction should patch the real game, not send isolated concept sheets.
- Keep user saves and old entrance/quest scenes live through migration. Do not force the preview's ephemeral position into the original legacy save.
- Verify changes in the Home Screen PWA, not only Safari, and validate the exact running build after deployment.
- Stop after each complete phase until the creator explicitly says Continue development. The **Phase 9 full-appearance approval gate** remains mandatory.

**Source:** `docs/overworld/terrain_geometry.json`, `docs/overworld/world_blueprint.json`, `world_geometry.js`, `world_stream.js`, `tests/overworld_phase4_geometry.test.js`.
