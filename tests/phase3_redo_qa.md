# Veilward Phase 3 REDO — Photo-matched geometry QA (v1.2.4)

**Why this redo was required:** The first Phase 3 tested connected collision graphs and claimed success, but never tested if the graphs matched the current background art. User-provided iPhone screenshots exposed four fundamentally invalid positions. The old village polygons were scaled from a superseded 707×530 map while the actual source image was 900×584.

## Four screenshot bug fixes — image-native coordinates

These coordinates are authored against the source 900×584 background image. `worldX=imageX×1850/900` and `worldY=imageY×1200/584`.

| Reported screenshot | Forbidden source pixel (approximate) | New geometry |
|---|---|---|
| Cave Wanderer on a lantern-post cap | (300, 330) | Narrow bridge connector plus lantern-post solid: cannot walk on top |
| Frostbridge Wanderer standing in blue river | (469, 470) | Explicit river no-walk polygon; southern snow trail separately authored |
| Greenwood Wanderer standing on bridge railing | (524, 409) | Bridge floor shrunk to the visible wooden *deck*, not the rail |
| Frostbridge Wanderer standing on high shrine fence | (608, 170) | Raised fence solid blocks its decorative railing while stone steps remain walkable |

Other invalid fixtures: river/waterfall shore, monument plinth, ritual door, cave abyss, pillar, cliff drop, and forest rail post.

## In-game location coherence

- Village portal → Greenwood now stands on visible southwestern snowy footpath `(790,1090)`. Upon returning from Greenwood, player arrives on the central snowy clearing `(1030,675)` (479 world units from portal).
- Cave exit relocated from a mid-bridge painted post/rail to the **left bridge mouth** at `(170,795)`, still within the real boardwalk. Greenwood return after cave uses `(1520,720)`, outside cave re-entry range.
- NPC and quest object positions moved onto reachable painted ground: Mira `(1210,665)`, Eldric `(720,1015)`, noticepost `(845,600)`, first Blueleaf `(500,920)`, cave wraith `(1435,525)`.
- Old saves on the now-forbidden screenshot coordinates auto-recover using `safePoint`; valid saves are not teleported. No save wipe, no progression reset.
- All main NPCs, 2 Blueleaf pickups, Worldscar and stolen supplies still have viable approach routes.

## Automated regression

Permanent test: `node tests/phase3_scene_geometry.test.js`. It uses only Node built-ins (assert/fs/vm), with no added dependencies.

Tested against actual source files and the 900×584 coordinates:
- **1,319 assertions** passed (positive/negative coordinates, safe relocation, connectivity, movement, source identity checks).
- **10** complete routes re-run using `projectMotion`: village start→Joren, Joren→snow trail portal, village return→Warden, village trail→Mira, forest arrival→cave, cave return→forest exit, Blueleaf→Worldscar, cave arrival→bandit supplies, supplies→upper shrine, shrine→left cave exit.
- **612** individual movement segments had no blocked or out-of-map movement.
- Walkable traversable floor graph comprises one connected region in each of village, forest and cave.
- The screenshot positions above are now **explicitly non-walkable**. This is crucial: all-connected alone is insufficient.
- Game, nav, visual and service-worker code parse as JavaScript; version and asset references agree.
- The approved 32-frame Wanderer hero rendering branch, its asset, and Warden Hal source PNG are not modified. The clone-looking bandit (enemy only) is changed to atlas slot 6.

## On-device checklist (must still be tested)

1. Open the iPhone Home Screen game, confirm running **v1.2.4** in Journey Menu.
2. Attempt to approach the four photographed problem areas: water by the south bridge, village north shrine fence, the top rail of Greenwood bridge, and the cave bridge lamp. Character should remain standing on snow, deck planks or stone floor.
3. Reach Joren and Warden Hal; travel to Greenwood across visible road and bridge; collect herbs and reach the cave.
4. Retrieve supplies, reach the cave upper shrine, walk the bridge to the cave exit, return to Greenwood and then village.
5. After updating from v1.2.3, load the previous save. If the old location was water/rail/fence, the player should respawn on nearby legal snow/stone **without losing the quest or level**.
6. Inspect painted bridge posts/rail foreground depth. Occlusion might still need authored foreground masks to hide the character behind the rail; **not** claimed completely fixed. Report specific images for a follow-on art-depth patch if needed.

**Status:** Code and simulated movement QA passed. Real iPhone visual review pending. Do not proceed to Phase 4 until next user instruction.
