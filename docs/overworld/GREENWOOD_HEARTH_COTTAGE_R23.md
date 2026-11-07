# Vielward Phase 9 — R23 original Greenwood hearth cottage

**v1.3.31.** Scope: **one existing collision-backed house** near the Greenwood hearth / original safe crossroads, not a new building, a map screenshot, or additional invisible wall.

## Original production illustration
- `assets/greenwood_hearth_cottage_r23.webp`: 256×256 transparent native WebP original blue-tiled/storybook gabled house, unique from the existing independent 512×512 moss-roof hermit refuge. Bell tower, slate shingles, timber porch, warm lattice windows, ferns and flowers; small optimized mobile source asset.
- Exact binary Git SHA verified during transfer: `62310f309c5c748b47795297855cff8d6128bc58`.
- `world_greenwood_hearth.js` asynchronously decodes and verifies 256×256 BEFORE streamed terrain is cached; stamps it at the **same authoritative** `greenwood_hearth-forest_cottage-91` physical setpiece, 350×350 world pixels with ground-aligned foundation.
- Only the authorized kind AND existing anchor may receive the new sprite. No additional architecture is added to the game. If the image fails, the original timber cottage renders instead.
- R23b camera composition follows the *actual source setpiece* to reveal the upper roof in landscape near its entrance, without zooming other forest/route scenes.

## Functional and visual regression
`tests/greenwood_hearth_cottage_r23.test.js` checks real asset, decode behavior, dimensions, source predicate, placement, fallback, and saved progress. Existing combat, quests, 12 regions, 48 waypoints, 65 roads, seven crossing paths, 39 landscape solids and original localStorage key `veilward-hollowreach-v01` remain. The real browser `GREENWOOD_R23_HEARTH_COTTAGE` capture uses a physically walkable viewpoint, asserts source art is actually rendered into production chunks and checks the actual 720×405 camera pixel positions of both roof and player.

## Remaining artist acceptance
Visual quality must be judged from the **actual gameplay screenshot**, never from the isolated PNG/WebP. The rest of Greenwood's many trees, layered canopy depth and forest-floor/path transitions still need major high-fidelity work. This slice does NOT constitute approval: Phase 9 ACTIVE, visual acceptance 0%, Phase 10 LOCKED pending creator signoff. Automated Chromium tests are not physical iPhone hardware tests.
