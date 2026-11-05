# SUPERSEDED — v1.2.3 connected-graph-only QA was not sufficient

This older QA passed while the user could still stand on river water, bridge railing, shrine fence and lantern posts. The v1.2.4 screenshot-driven redo supersedes it. For current behavior, see [phase3_redo_qa.md](./phase3_redo_qa.md) and the executable [phase3_scene_geometry.test.js](./phase3_scene_geometry.test.js).

---

# Phase 3 traversal / environmental QA — v1.2.3

**Scope:** Village, Greenwood, Smuggler's Hollow. Synthetic navigation tests against real `navigation.js` (radius 8), service-worker/asset string consistency and simulated Canvas route lighting. Real iPhone QA pending.

## Root causes corrected

1. The upper cave shrine was isolated by a solid quadrilateral `[[730,102],[790,91],[804,272],[741,265]]` extending through the visible staircase. The corrected pylon ground footprint `[[730,102],[790,91],[795,211],[740,224]]` preserves the rock obstacle but leaves a walkable way around its lower edge.
2. Returning from cave originally placed the player only 56 units from its Greenwood entrance, inside the 100-unit Talk radius. Returning from Greenwood to the village placed the player exactly 100 units from the Greenwood exit. Both return locations moved outside those radii.
3. Spawn recovery originally tested collision radius 6, while the actual player uses radius 8. Both now use 8, including fallback safe spawn points.
4. If a player repeatedly tapped Talk while the destination image loaded, multiple travel requests/notifications could pile up. Pending travel is now one request per target; completed travel applies a 1.2-second cooldown.

## Static collision / graph test

Dense 13-world-unit connectivity grid with radius 8 and midpoint checks for diagonal motion:

| Zone | Connected walkable regions | Named anchors validated |
|---|---:|---|
| Village | 1 | Player starting point, Joren, Warden Hal, Mira, Eldric, Greenwood exit, return spawn |
| Greenwood | 1 | Arrival, village exit, cave entrance, return from cave, Blueleaf, Worldscar |
| Smuggler's Hollow | 1 | Cave entrance, forest exit, bandit supplies, wraith arena, upper shrine |

All 18 tested anchors are individually `canWalk(zone,x,y,8)=true` and fall within the same component in their respective zone (the original cave shrine was isolated). Safe spawn distances from the corresponding exit portals:

- Greenwood → village: **198.3** world units (portal reach 100).
- Cave → Greenwood: **181.7** world units (portal reach 100).
- Village → Greenwood: **209.7** world units from Greenwood's return exit.
- Greenwood → cave: **433.3** world units from the cave's return exit.

## Real movement (projectMotion) replays

| Journey | Grid waypoints | Blocked movement steps |
|---|---:|---:|
| New game → Joren | 10 | 0 |
| Joren → Greenwood exit | 49 | 0 |
| Greenwood arrival → cave entrance | 82 | 0 |
| Cave return → village trail | 83 | 0 |
| Cave arrival → bandit supplies | 10 | 0 |
| Bandit supplies → upper shrine | 71 | 0 |
| Upper shrine → forest exit | 116 | 0 |

**421 sampled waypoints** across seven simulated routes, all ending within 7 world units of their target. No disconnected destinations, no stuck steps and no departure from navigable ground.

## Visual smoke checks

- Scene painter `routeGlows` triggered 1 village / 2 Greenwood / 1 cave / 0 forge soft radial glows exactly as authored.
- Glows and arrival halo execute beneath actors; not added as thick flat-colored overlay art.
- Approved Wanderer eight-way rendering branch, `hero_approved_8way_v12.webp` and Warden Hal `warden_hal_v13.png` are unchanged.
- Source JS validated with JavaScript parser; PWA version bump targets `game.js?v=15`, `navigation.js?v=8`, `visual.js?v=30`, `manifest.webmanifest?v=123`, asset `?art=20`.
- Save key remains `veilward-hollowreach-v01`. Zone travel retains quest, equipment, gold and progression.

## iPhone acceptance checks to request

1. Home Screen Journey Menu displays running **v1.2.3**.
2. Start at Joren; follow the village trail to Greenwood; confirm no river/bridge invisible barriers or unexpected exit bounce.
3. Follow Greenwood to Smuggler's Hollow, retrieve supplies, take the stone steps all the way onto the previously isolated **upper shrine** platform; return to the exit without crossing open void.
4. Leave cave to Greenwood: verify arrival is clear of the portal and not immediately re-entering cave.
5. Return to village, talk to Joren and reopen app: quest/inventory preserved.
6. Visually inspect cliff staircases and bridge railing in landscape; compare whether static painted foreground railings occlude the Wanderer convincingly. **Baked foreground-rail depth remains an open visual acceptance issue**, not claimed solved by collision geometry changes.

**STOP after Phase 3.** Await user feedback or next "Continue development" for Phase 4.
