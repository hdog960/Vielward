# Phase 9 R38 — Greenwood Falls camera-composed original forest

**Baseline:** R37 commit `1f4aae73`. **Visual approval:** 0%; Phase 9 ACTIVE; Phase 10 LOCKED.

R37 added fourteen physically backed old-growth trees, but the real screenshot showed that most were outside the immediate landscape frame. R38 reorders candidates so true land/road/water/root-verified trees FIRST frame both actual sides of the narrow, walkable Falls overlook; distant fallback roots are admitted only after camera-visible candidates. The distribution remains deterministic and subject to unchanged source collision, clearance, water and landmark tests. The existing player, original detailed art reference, 12-region world, 48 nodes, 65 roads, seven crossings and saved quests are preserved.

The new `world_greenwood_art.paintFallsComposedGround` paints larger connected shadow and native R18 fern beds below the original trees, without giant horizontal stretching. It also plants subtle, native original fern margins alongside the real `falls_e--falls_overlook` stone ascent from the exact source endpoints. Both painters use world coordinates; the road artist paints ON TOP, and no false stairs, inaccessible cliffs, new water hazards, or blocking props are created. Original R18 tree canvases are still drawn in the physically sorted actor-depth layer, not pasted into a fake landscape screenshot.

**Quality gates:** `npm run audit:greenwood-r38` verifies at least one near-screen left and right physical root, every root's original road/water/landmark clearance, original native art, and preserved save/path counts. Browser script captures the ACTUAL 720x405 and 1136x640 playable `GREENWOOD_R38_COMPOSED_FALLS_FOREST` scene, compares the R37 capture history, and checks original path/crossing/actor safety. This technical check does NOT claim creator aesthetic approval or physical-iPhone FPS verification.

**Next priority after inspecting browser images:** replace any remaining checker-like exposed ground and overly flat gorge edges with higher-quality original native source paintings, without repeating oversized primitive landscaping. Device acceptance remains outstanding.
