# VEILWARD — Phase 3 Playable Seamless Terrain-Streaming Handoff

**Build:** v1.2.7 · **Stage:** COMPLETE engine foundation, with an opt-in playable test mode.  
**Next stage:** Phase 4 — Honest collision, elevation and interaction data.  
**Save safety:** Legacy iPhone adventure remains the default; no player-position, quest or inventory migration is forced in Phase 3.  
**Appearance gate:** Full 12-region overworld art review remains mandatory after Phase 9 before Phase 10.

## What actually changed in the playable game

**UI** — A new **Journey Menu → Explore Seamless Overworld (Phase 3 Preview)** option opens a secondary but genuinely interactive outdoor game mode. It uses the normal landscape joystick and the approved Wanderer animation sheet. The original pause button remains accessible; **Journey Menu → Return to Hollowreach Adventure** exits the preview at the same legacy zone and coordinates, leaving the active quest, money, inventory, health, equipment, skills and save key unchanged. Preview actions that could affect quests/combat are blocked.

**World data** — `world_stream.js` loads the actual approved `docs/overworld/world_blueprint.json` (~49KB) as static PWA data; it uses the 12 region influences, 48 landmark anchors, 65 road/path links, river/lake/chasm centerlines and the 7 named crossings. The 72,000 × 48,000 global world-coordinate design is separate from the previous 1850×1200 scene coordinates. Region detection and camera are global, not zone-local.

**Streaming** — Outdoor address space is a logical **48 × 32 = 1,536-chunk** grid (1,500 × 1,500 world units each). Only visible/adjacent tiles are rasterized on demand into **375 × 375 pixel offscreen canvas surfaces**. Newly needed tiles are queued with a 2-per-frame render budget and prefetched in a camera neighborhood. An **18-tile LRU limit** holds approximate raw canvas RGBA tile memory below **10.2 MB** (not a measured total Safari process-memory figure). Empty visible tiles temporarily draw a biome-matched color instead of a black loading frame.

**Movement and camera** — The streaming preview preserves one uninterrupted global player position and smoothly follows the player's feet. Initial camera position is initialized to include the player immediately. Movement continues across chunk boundaries using the existing 165-unit/sec walking-speed convention. A coarse preview river/lake/chasm blocker respects named bridges/raised fords and the lake island; this is **not** the final world-ground collider/elevation design.

**Visual basis** — Chunk images are derived deterministically from approved macro-region palette influences and global road and water polylines. These are **temporary diagnostic/prototype graphics only**, intentionally not the final art from the snowy forest/cave screenshots. The approved Wanderer eight-facing frame atlas and Warden Hal assets are untouched. Phase 5 specifies the full detailed pixel-art production rules, and Phases 6–8 build out the complete approved world with terrain/collision and roads.

**Home Screen & offline** — The live HTML now loads `world_stream.js?v=1` before `game.js?v=19`, and fetches the blueprint by `./docs/overworld/world_blueprint.json?v=1`. Both resources and the updated CSS are precached by `sw.js` in **`veilward-hollowreach-v127-world-preview`**, with build number 1.2.7. This does not override the user's original localStorage save key.

## How to test the real game

1. Open **https://hdog960.github.io/Vielward/** in iPhone Safari or the pinned Home Screen app and check **Journey Menu → Running build v1.2.7**.
2. Press **Explore Seamless Overworld (Phase 3 Preview)**. The menu prepares a small visible tile neighborhood, then shows a marked streaming-preview banner.
3. Walk using the joystick. The detailed original Hollowreach art is NOT used as a repeated placeholder; the temporary streaming terrain is intentionally schematic. Walk across 3+ adjacent chunks and observe uninterrupted camera and character animation.
4. Walk toward the main Frostbridge road, Northwatch upper span, or southern Stoneford approach and watch the biome and road surface change without an outdoor portal prompt. The planned trip to Greenwood is several minutes of uninterrupted walking.
5. The banner shows current named region and cached-tile count. Moving long distances should keep cache bounded; no black tile should appear. Some newly prefetched regions may briefly appear as **biome-color fallback** before their generated detail arrives; record any objectionable flash.
6. Use **☰ Journey Menu → Return to Hollowreach Adventure**. The snowy legacy scene, NPCs, enemies, HP, gold, skills, Joren quest, herb collection and original map return unchanged.
7. Exit/reopen from Home Screen and check quest state is still correct. If installed Safari and Home Screen disagree on build number, report both.
8. Report any device-specific freezing, tile seam, frame hitch, hero facing issue, missing terrain, false river blocking or inability to return; **a bug report requires patching this actual game** before moving on.

## Source-level QA

**Automated tests**: `tests/overworld_phase3_streaming.test.js` — actual stream engine and game function integration in a mocked browser environment. It covers:
- Source blueprint compatibility, 1,536 chunk addresses without eager allocation, 72k × 48k global coordinate bounds;
- Camera initial location, deterministic region/palette sampling, warmed first frame, bounded tile cache and regeneration after eviction;
- River bridge crossing, lake island ground and blocked open water;
- Walking across consecutive chunk boundaries, joystick-equivalent global movement and stable animation state;
- Real game pause/preview menu binding, preview frame rendering, independent preview position, no changed player stats and no leaked preview data in legacy localStorage;
- Matching HTML/worker script versions and Home Screen cache migration; protected hero/Warden references.

The older navigation, combat, quest/save, Phase 1 protected-asset and Phase 2 topology tests remain part of `npm test`. Passing code-level and simulated Canvas tests does **not** prove visual quality, 60 FPS or memory usage on a real iPhone. **The creator's device test is still required.**

## Engineering caveats and Phase 4 handoff

- **No finished terrain art**: This is an actual gameplay-connected engine with diagnostic terrain canvases, not the final highly detailed pixel-art environment. Do not call Phase 9 visual acceptance complete.
- **No real elevation model or occlusion yet**: The preview blocker is schematic, does not trace the final collision geometry, and does not yet guarantee precise cliffs, stairs, riverbanks, bridge rails, tree trunks or roof masks. Phase 4 must author reliable co-sourced render/nav/elevation/occlusion data for real chunks.
- **No NPCs or quest objects in preview yet**: Existing NPC/quest logic is available in the unchanged main game and is not allowed to run in the preview. Phase 12+ reconnects real buildings, quests, props and wilderness ecology to the continuous world.
- **World streaming stress**: A tile is rasterized at 375 square pixels and drawn at full world scale; art density is diagnostic, not a pixel-art final. Future tiles can increase resolution only after iPhone memory profiling.
- **Snapshot preservation**: Old scene keys remain `village`, `wilds`, `cave`, `forge`; the original save `veilward-hollowreach-v01` remains active and preview position stays memory-only. A future full save migration must explicitly anchor and transfer all legacy fields and interior exits; do not convert the two old scene coordinates by naive offsetting.

**STOP after Phase 3.** Wait for the user's next development instruction or iPhone playtest corrections. **After Phase 9** stop again for the full appearance review before any Phase 10 work.
