# Veilward — Phase 9 R22: Landscape camera composition around the real hermit's refuge

Build **v1.3.30**, artist acceptance **0%**; no Phase 10 work authorized.

## Grounded problem
The R21 real browser gameplay image showed only a partial high-detail roof because the camera followed the player at the screen center, with the illustrated 424-world-unit-tall source extending 512 world units above the player's original waypoint. A generic world-wide zoom change would make the Wanderer too small and weaken other scenes.

## Source implementation
`world_stream.framing(screenW, screenH, baseZoom)` transitions smoothly inside 850 world units of the ORIGINAL hermit node, using the original waypoint as its only anchor. It activates on landscape screens rather than modifying portrait layout, lowers the Wanderer toward the lower third, and calculates a safe zoom based on physical screen height and source sprite roof offset. `game.renderWorldPreview` applies the same returned zoom to terrain, Wanderer, and geometry debug drawing; movement, physics, sprite anchoring and save storage do not change.

## Honest verification
New `tests/greenwood_hermit_framing_r22.test.js` verifies original framing at Hollowreach and Greenwood hearth, tall-roof framing near hermit on 720×405 and 1136×640, unchanged portrait framing, actual rendered viewport coordinates and original save. `scripts/visual_capture.mjs` now captures a real `GREENWOOD_R22_FULL_ROOF` frame and checks the camera's actual pixel projection after responsive resize and multiple animation frames, avoiding the initial race where a resized capture used the old viewport.

## Protected world
12 regions, 48 anchors, 65 roads, seven crossings, 39 solids, original hermit image source and original `veilward-hollowreach-v01` save key remain unchanged. The second Greenwood cottage remains a separate open art-production task, and the forest/winter visual overhaul is still substantially incomplete.

**Phase 9 ACTIVE; Phase 10 LOCKED; visual acceptance 0%.**
