# VEILWARD — CONTINUOUS OVERWORLD REBUILD ROADMAP
**Status: APPROVED BY CREATOR — DEVELOPMENT MAY PROCEED PHASE-BY-PHASE UPON INSTRUCTION**  
**Prepared:** November 5, 2026  
**Starting playable build:** v1.2.6  
**Basis:** The creator's 12-page `Vielward.pdf` review, especially the directive on page 12 to build the **entire outdoor overworld first**, then choose a connected subsection to refine gameplay before expanding polish.  
**Supersedes:** The completed five-phase Hollowreach polish sprint as the *next proposed direction*. Does **not** erase its code, achievements, art or saved progress.

## 1. The non-negotiable vision

VEILWARD is a **Skyrim-inspired fantasy adventure in the established rich 2.5D, three-quarter-view pixel-art aesthetic**. The wilderness must feel like an actual large place, not a few beautiful backgrounds joined by arbitrary Talk markers.

1. **One continuous outdoor world:** Walk naturally from snowy Hollowreach toward Greenwood, across valleys, roads and woods. No exterior portal or interaction prompt merely because a biome changes. Biomes transition over geography, weather, elevation and vegetation. True enter interactions remain for buildings, caves, ruins and other actual enclosed locations.
2. **Visual language is sacred:** Keep the current admired highly detailed painted/pixel aesthetic, character scale, warm lanterns, texture density, controlled light and atmosphere. No generic polygons, vector pickup triangles, unexplained white outlines or pasted-in mismatched characters.
3. **World design must make physical sense:** Roads connect real destinations; bridges connect actual banks; stairs lead to accessible upper areas; monuments can be circled; islands have visible crossings or consciously designed transport; flowers, trees, props and chests obey their visible footprint.
4. **Every visible affordance tells the truth:** A visible path is walkable unless clearly and physically obstructed. A door has an enter interaction if part of the playable sample; other doors must have honest, non-misleading treatment. Signs can be read, treasure containers can be opened where designated, ladders/steps lead somewhere, magic landmarks produce meaningful outcomes.
5. **Movement follows art:** The Wanderer's feet remain planted on valid terrain. Smooth steering, sliding, transitions, foot shadows and occlusion must work on iPhone without impossible detours around walkable-looking grass.
6. **Enemies must be thoughtfully designed:** Clear family identity, truly distinct bandits, original monsters and individually authored *full* sprite sheets, including movement and combat animations. Use Skyrim's broad enemy diversity for inspiration, not copied names, silhouettes or assets. Eventual VEILWARD bestiary aims to surpass Skyrim's variety in genuinely distinct enemies—not by inflated recolor counts.
7. **Overworld-first, then one test section:** Construct the macro geography for the *whole proposed outdoor region* before deep-refining one continuous Hollowreach → Greenwood → showcase cave/ruin stretch. This does NOT mean completing every building interior, cave or quest first.
8. **Preserve accepted work:** The approved Wanderer eight-direction sprite, distinct Warden Hal asset, saved skills, equipment, quest results and the existing iPhone/Safari platform are protected. World-coordinate save migration is mandatory.
9. **No false completion claims:** Code-level checks are not proof that a landscape screenshot looks right on a real iPhone. Final approval requires the creator's direct device tests and screenshots.

## 2. Proposed whole-overworld layout (names and scale are adjustable)

This is a **physical geography proposal**, not a claim that these areas already exist. The full outdoor surface should form one connected explorable map with meaningful loops, not a row of isolated scenes.

| Region / landmark | Geographic role | Connection / reason to visit |
|---|---|---|
| Hollowreach / Frostbridge | Snowy mountain village, central anchor | Homes, Joren's smithy, inn, watch, major roads and readable notices |
| Northwatch Heights | Monument, ledges, snowy overlooks | Stairs and circular paths around the memorial; rare view and secret |
| Coldpine Ridge | Alpine evergreen hills | Northern loop, predators, quarry and sheltered road |
| Frostbridge River | Glacier-fed stream, ravines and islands | Physically grounded crossing network, fishing/collectibles |
| The Thawline | Snow-to-moss-to-grass transition | Natural, gradual change of climate, no portal |
| Greenwood | Dense temperate forest and old roads | Wildlife, gathering, lore, hermit and road junctions |
| Greenwood Falls | Waterfall, bridges and riverside trail | Walkable banks and meaningful vertical route |
| Mossmere Basin | Lake, wetland and small island | Island reached through visible bridge/ford/boat design, rewards |
| Heatherwood Commons | Meadow and foothill crossroads | Trade/camp, wildlife, optional branch discoveries |
| Old Crown Road | Forgotten trade road | Connects settlement, ruins and smugglers' routes |
| Smuggler's Ravine | Rocky canyon and real cave entrance | Exterior watch posts, loot trail, enclosed cave entered by door/threshold |
| Worldscar Uplands | Ancient ruins and strange magic | Visible ascent, optional outer approach, puzzle and substantial reward |

**Scale decision for creator approval:** First set density, landmarks and path network; then tune travel distances with test walks. A substantial several-dozen-minute outdoor crossing is a *design target*, not a guaranteed metric or license to add empty walking. Outdoor breadth must be achieved through authored streaming chunks, not stretching the current 900×584 still scene.

**Mandatory connections:** At least two loops between the village and Greenwood rather than one funnel; the main road must continue through the biomes; a safe route to every visible bridge landing and staircase; a believable route to the river island; loops/backtracks within the highland and ruined areas; no isolated walkable islands unless that isolation is intentional and explained.

## 3. Work protocol for this roadmap

- This roadmap is **approved by the creator**. Begin each implementation phase only on the creator's explicit development instruction; do not treat roadmap approval alone as authorization to start an entire multi-phase build.
- After approval, **one complete phase per "Continue development"**, as in the existing workflow. Each continuation means implement the phase in real files, test it, commit/push to GitHub and give the user the live game link and exact results. Stop for the user's playtest or next instruction. If the user supplies corrections, patch those before advancing.
- Scope may be large. No artificial two-hour sprint cap and no treating a rough mockup as a finished world. Break particularly heavy work into internal tasks, but a phase is not complete without its stated acceptance conditions.
- Keep a stable live release and use behind-the-scenes staged data/feature flags while the rebuilt overworld is incomplete; never silently replace a playable section with an inaccessible prototype.
- Build authored maps, dynamic entities, height/collision/occlusion layers and tests from a common **source coordinate system**. No independent guessed polygons over unrelated background JPGs.
- Every phase adds/updates repeatable tests. Back up/migrate existing save fields; no progress wipe to make new code easier. Upgrade cache/service-worker versions and verify mobile navigation on each playable release.

## 4. Detailed phased implementation

### ACT I — World architecture and art foundation

#### Phase 1 — Screenshot issue register and design lock
**Status: COMPLETE — source audit, 34 issue records, 12/12 PDF pages, design/asset/save protection locked on November 5, 2026. No gameplay or art files changed.**
**Files:** [Phase 1 readable issue register](./docs/overworld/ISSUE_REGISTER.md) · [machine-readable issue data](./docs/overworld/issue_register.json) · [World design lock](./docs/overworld/WORLD_DESIGN_LOCK.md) · [Current asset/runtime inventory](./docs/overworld/ASSET_AND_RUNTIME_INVENTORY.md) · [Coordinates and save-migration contract](./docs/overworld/COORDINATES_AND_MIGRATION.md) · [Protected asset manifest](./docs/overworld/protected_assets.json) · [Permanent Phase 1 test](./tests/overworld_phase1_audit.test.js).
**Screenshot verification:** [PDF page-to-reproduction matrix](./docs/overworld/SCREENSHOT_ACCEPTANCE_MATRIX.md) · [legacy scene anchor table](./docs/overworld/legacy_scene_anchors.json) · [completed Phase 1 handoff](./docs/overworld/PHASE1_HANDOFF.md).
**Exit gate:** Met in documented source audit; **Phase 2 is NOT started** and needs the creator's next "Continue development."
**Work:** Convert all 12 pages of notes into reproducible game issues, with the pictured location, ground truth, desired interaction and acceptance screenshots. Inventory every existing outdoor scene, actor asset, prop, quest item, collision polygon and travel portal. Record which pieces are approved versus broken. Produce a source-controlled world design bible, layout and image coordinate reference.  
**Exit gate:** Every PDF complaint is assigned to a concrete future phase; approved Wanderer/visual style and saved progress are explicitly protected.

#### Phase 2 — Complete terrain blueprint and world topology
**Status: COMPLETE (November 5, 2026) — 12 macro-regions, 48 named global anchors, 65 links, 7 physical crossings, three distinct village→forest approaches, topological river/island/canyon verification, source-generated master map. Phase 3 NOT STARTED.**
**Deliverables:** [Creator-readable master map and plan](./docs/overworld/MASTER_MAP.md) · [Vector geography diagram](./docs/overworld/MASTER_MAP.svg) · [Authoritative JSON source](./docs/overworld/world_blueprint.json) · [Geometry and density audit](./docs/overworld/PHASE2_TOPOLOGY_AUDIT.md) · [Phase 3 handoff](./docs/overworld/PHASE2_HANDOFF.md) · [Permanent automated topology test](./tests/overworld_phase2_topology.test.js).
**Important:** This phase creates the **full outdoor design blueprint**, NOT playable seamless outdoors or finished pixel-art terrain. Live gameplay remains v1.2.6. The creator's complete **appearance approval** is still held after Phase 9 before Phase 10, not after the map schematic.
**Work:** Draw the **whole outdoor map before expanding mechanics**: 12 proposed geographic regions, true rivers and banks, mountain contours, snowline, passable ridges, roads, bridges, island routes, villages, cave mouths, ruins, resources and memorable silhouettes. Label every intended road endpoint, elevation change and optional loop. Calculate terrain/encounter density and identify a candidate contiguous mechanics-test route.  
**Exit gate:** Creator can trace a connected walking journey on the master map from Hollowreach to Greenwood and beyond without unexplained transitions or dead-end roads. No unreachable landmark presented as accessible.

#### Phase 3 — Seamless chunked outdoor rendering
**Work:** Refactor the current separate 1850×1200 `village` / `wilds` scene model into a stable **global overworld coordinate system**, streamed image/data chunks, culling, prefetching, and shared camera. Retain an independent enterable interior/cave scene system. Preserve the existing app during staged migration.  
**Exit gate:** The Wanderer can cross multiple adjoining outdoor chunks without a fade, Talk prompt, camera snap, visible black load frame or lost controls; roaming does not exhaust iPhone memory.

#### Phase 4 — Honest collision, elevation and interaction data
**Work:** Replace collision polygons manually approximated over scene screenshots with **co-authored terrain geometry**: floor layers, true blocked solids, stairs, door thresholds, railings, water hazards, slopes, cliffs, and height/elevation levels. Separate an actor's collision-footprint from the sprite's visual height. Add developer overlays for walkability, altitude, blockers, interaction zones, foot anchors and reachable routes.  
**Exit gate:** Automated route checks verify advertised roads, bridges and staircases; visual blockers match collision; no player can stand on a tree canopy, fence cap, river, cliff face or lantern post.

#### Phase 5 — Approved pixel-art terrain/asset production workflow
**Work:** Establish source atlases and compositing rules for materials, shadow ramps, perspective, transition edges, pixel density, foliage clusters, bridges, water, architecture, prop silhouettes and lighting. Ban clip-art/polygon replacements for ground pickups. Record source-to-game assets, alpha cleanup and consistent authored shadow footprints.  
**Exit gate:** A small set of snow, thawline, forest, stone and water chunks reads as the **same game** next to approved current imagery; no jarring seams/white matte edges.

### ACT II — Build the ENTIRE outdoor overworld, not just three rooms

#### Phase 6 — Full-world terrain footprint
**Work:** Author the full outdoor landmass, all major region boundaries and waterways, canyon heights, islands and lakes, logical roads and open clearings, with baseline visually coherent terrain for **every outdoor chunk**. Build it as actually traversable surface; do not ship a large empty flat procedural placeholder as the finished map. Keep legacy areas usable during transition.  
**Exit gate:** All planned outdoor regions exist in a unified world, are reachable through world-space movement or clearly intentional obstacles, and have a route to/from Hollowreach.

#### Phase 7 — Gradual climate, vegetation and biome transitions
**Work:** Blend mountain winter through evergreen lower slopes, patchy melt, wet forest and temperate meadows. Use elevation, slope exposure, water, and weather to justify where snow and greenery appear. Hand-refine chunk boundaries, lighting and foliage. No "walk into bush → lush climate" teleport.  
**Exit gate:** The Hollowreach-to-Greenwood trek visibly and logically changes climate over distance; no abrupt JPG/world swap, severe palette edge, cut-off flower sheet or mismatched texture scale.

#### Phase 8 — Entire road, bridge, stairway and island network
**Work:** Build all major roads, footpaths, side branches, crossings, switchbacks and stairs across the complete outdoor map. Every road ends in a landmark, junction, believable barrier, scenic overlook or intentional discovery. Give the river island a visible bridge, ford or deliberate transport interaction. Make stairs and bridge decks traversable where the art promises they are.  
**Exit gate:** Every planned endpoint has at least one proven reachable route; crossing to islands requires a physical, understandable action; no invisible detour to walk left along an apparently open path.

#### Phase 9 — Whole-world navigability survey; choose the test slice
**Work:** Programmatically walk/route-check the full outdoors in multiple directions, run collision heatmaps, inspect terrain-to-collision matches and repair nontraversable terrain. Then mark the connected **Hollowreach → Thawline → Greenwood → Smuggler's Ravine** trail as the main detailed mechanics-testing area. Other outdoors remain real and walkable but may await fine interactive content.  
**Exit gate:** All exterior traversal works at a baseline quality before deep-refining the sample. Publish a truthful "map complete / mechanics slice in progress" status, not "entire RPG complete." **Mandatory creator approval checkpoint follows this phase: stop before Phase 10 until the creator has personally reviewed and approved the full overworld's appearance and geographic layout.**

### MANDATORY CHECKPOINT — Full overworld visual review and creator approval

**When:** Immediately after Phase 9 (the complete outdoor landscape, climate transitions, road/bridge network, and accessibility survey), **before** beginning Phase 10 or detailed mechanics-slice refinement.

**Deliver the actual playable overworld, not a concept illustration.** Give the creator a working iPhone Safari/Home Screen build where they can roam the outdoor world, plus clear in-game screenshots or a visual atlas/map representing **all outdoor regions**. Include representative close-ups of Hollowreach, high snowy elevations, the gradual thawline, Greenwood, river crossings and islands, ruins, roads, and meaningful large-scale landmarks.

**Review criteria:** Overall aesthetic and pixel-art fidelity; geographic continuity; whether locations feel like a coherent Skyrim-inspired region; gradual snow-to-forest progression; environment composition and landmark placement; the scale and density of exploration; visually obvious paths, bridges and entrances; and the relationship between what looks reachable and what can actually be reached.

**Hard stop:** The assistant MUST stop development after delivering the Phase 9 review build. Do not start Phase 10 or any other gameplay refinement phase merely because the overworld implementation tests pass. Obtain the creator's **explicit approval of the overworld appearance**. If they give notes or reject any visual/geographic detail, **patch the actual game and push the correction**, then submit the revised overworld for review again. Continue the roadmap only after approval.

**Scope:** This checkpoint reviews the entire outdoor overworld's appearance and world layout. It does not require every interior, dungeon, quest, or later enemy system to be complete.

### ACT III — Make the selected continuous slice feel physically correct

#### Phase 10 — Movement, controls, collision and camera overhaul
**Work:** Fix the excessive movement detours shown on PDF page 2. Improve axis/diagonal steering, gentle obstacle sliding, reachability near foliage, navigation tolerance, 2.5D height transitions, camera framing, and iPhone landscape joystick/touch response. Keep the approved eight-direction Wanderer atlas and animation body proportions.  
**Exit gate:** Walking left across a visually open path works without taking a circuitous artificial route; steering and collision agree at slow and fast movements, including on bridge edges and steps.

#### Phase 11 — Feet, shadows, foreground occlusion and perspective
**Work:** Anchor character shadows to the **actual foot-contact plane**; fix hovering/floating on cliffs and bridges. Implement front rail/tree/roof masks and correct sorting based on foot depth plus elevation. Add clean footstep transition cues and prevent the player from visually standing on a canopy or rock wall.  
**Exit gate:** Creator's equivalent cave lantern and cliff screenshots show grounded feet and convincing depth, not floating over the chasm or sitting atop a post.

#### Phase 12 — Hollowreach village and buildings that make sense
**Work:** Revisit the village site plan. Correct the inaccessible northward path and circling of the upper monument. Put the snow-to-forest road where the geography says it belongs. Convert intended accessible building doors (begin with Joren's workshop) into explicit **Enter** interactions and implement that chosen interior; reserve other interiors for later. Make signs readable and consistent with the environment.  
**Exit gate:** The player can reach the northern trail, walk around the monument, read the pictured notice, enter/exit Joren's workshop, and naturally follow the road out of the village.

#### Phase 13 — Greenwood paths, living forest and visual cleanup
**Work:** Repair Greenwood's illogical side paths, bridge connections, unreachable steps and clippable trees; replace outlined cut-off flowers and visual-only resource impostors. Organize rocks, fallen trunks, mushrooms, gathering plants and trees as physically believable objects with authored footprints and visible purpose.  
**Exit gate:** Forest paths are honest; no white-highlight flower mats, no tree-top walking, and no unexplained invisible wall or path through decorative foliage.

#### Phase 14 — Rivers, lakes, waterfall platforms and the island
**Work:** Validate wet-ground depth and navigation, water-bank collision, bridges, waterfalls and upstream/downstream routes. Build and test the island access described in the PDF, including a reason to cross, safe landing and convincing visual continuity. No swimming shortcut unless swimming is a deliberately implemented mechanic.  
**Exit gate:** Island access is visually and mechanically logical; water and cliff edges cannot be walked across by accident; crossings line up with real geometry.

#### Phase 15 — Proper cave and ruin entrances, bridges and vertical routes
**Work:** Keep cave/ruin interiors as true Enter transitions at the *visible physical entrance*, not arbitrary dots outdoors. Fully polish **one** Smuggler's Hollow interior, its rope bridges, lanterns, elevations, upper stairs and ritual platform. Other caves/ruins can remain authored exterior landmarks until individually scheduled.  
**Exit gate:** Both sides of the showcase cave entrance align, the rope bridge is crossable deck-to-deck, shrine stairs are climbable, and no illogical lantern/fence/void walkability remains.

#### Phase 16 — Every pickup, chest, notice and glowing landmark has a role
**Work:** Replace the blue triangles/generic rendered primitives with small **authored world-scale pixel-art sprites**: separate pickup states, shadows, grounded meshes, and effects that match the environment. Decide for each pictured prop whether it is scenery, readable, harvestable, openable, puzzle-related or a destination; do not visually promise an interaction and then do nothing.  
**Exit gate:** Collectible artwork fits the game's aesthetic; real chest contents are recoverable, fake treasure chest cues are gone, notices can be read, ritual circles and strange oval floor markings are intentionally functional or clearly decorative.

### ACT IV — Enemies with unique art, not cloned characters

#### Phase 17 — Original bestiary and biome ecology bible
**Work:** Draft **original** predator, human-outlaw, spectral, ancient/undead, woodland, subterranean, magical and elite families; define silhouettes, culture, habitat, threat, loot and combat behavior for each. Use Skyrim's *range of encounter categories* only as inspiration (wildlife, human factions, undead, magical beings, constructs and bosses). The broader future objective is **more truly distinct opponents than Skyrim**, not merely extra names, ranks or recolors.  
**Exit gate:** An approved bestiary matrix with no copied Elder Scrolls art/names, no civilian-looking generic bandits, and clear environment placement; scope for first full-art sample enemy roster agreed.

#### Phase 18 — Full enemy sprite sheets and animation quality gate
**Work:** Build a **small but finished initial roster** of approximately 10–12 visibly distinct enemy archetypes for the playable slice (exact roster subject to review). Every combat actor requires directional idle, walking, telegraph/attack, hit/stagger and death animations, credible feet/shadows, clean alpha and consistent world scale. Different anatomical families must animate differently; do not swap the same hero base.  
**Exit gate:** Each initial enemy looks like its role and remains recognizably the same entity across facing and action frames. Individual art/animation sheets pass in-game visual inspection—not only a standalone gallery.

#### Phase 19 — Distinct encounters, fair combat and ecology
**Work:** Tune behaviors around geography: predators patrol/hunt, bandits use cover/ambush, undead haunt ruins, rare anomalies protect lore sites. Retain existing sword/magic/dodge functionality while improving reaction/hit/death animations, line-of-sight, stagger timing, telegraphs, drop placement and varied rewards. Enemy spawns must not block required traversal or appear pasted onto cliffs.  
**Exit gate:** Multiple enemy families feel different to fight, have accurate complete animations, are fair on touch controls, and yield understandable loot.

### ACT V — Purpose, preservation and art/technical signoff

#### Phase 20 — Exploration payoff, local interactions and quest integration
**Work:** Integrate the existing Joren supplies progression with real spatial routes and give meaningful purposes to the island, monument, noticeboard, strange oval stones, cave chest and luminous Worldscar sanctuary. Add a tightly scoped set of optional discoveries that make exploration worthwhile—e.g. readable lore, short puzzle, unique loot or unlock. NPC dialogue reflects actual reachable geography and player accomplishments.  
**Exit gate:** Every high-visibility landmark in the PDF has a purpose or an honest explanation; no full set of new interiors is required. The main quest remains completable in the new map.

#### Phase 21 — Save migration, chunk performance and world-wide consistency
**Work:** Migrate saves from `zone + local x/y` to persistent **global outdoor coordinates**, preserving stats, equipped art/gear, quest achievements and previously collected unique items. Ensure enemy/loot state is stable across streamed chunks. Profile iPhone memory, camera/asset loading, input and battery load; update GitHub Pages service-worker caching without stale Home Screen versions. Apply proven polish rules to every outdoor region, not only the test trail.  
**Exit gate:** Existing saves open at safe logical locations without loss. Long exploration and repeated backgrounding/reopening do not cause black screens, missing tiles, broken progress or unexpected scene reloads. Every outdoor region has baseline polish consistency.

#### Phase 22 — Full regression, creator playtest and explicit approval
**Work:** Keep the established movement, art and quest tests, add screenshot-based visual acceptance for all issues in the PDF, route-walk checks of the entire map, collision-versus-visual test points and in-game enemy/prop screenshot reviews. Present device screenshots of village, transition, forest, rivers/island, monument, Smuggler's Hollow interior, combat and glowing ritual site. Collect the creator's notes and patch them before calling the work accepted.  
**Exit gate:** No remaining known PDF complaint without a verified fix; no critical regressions; creator explicitly approves the continuous overworld and chosen slice. **STOP HERE** and co-design the next content roadmap after approval.

## 5. Source document issue-to-phase traceability

| PDF page(s) | Creator concern | Assigned phases | Must be visibly proven |
|---|---|---|---|
| 1, 7, 12 | Artificial snowy→lush portal; want big flowing world | 2, 3, 6–9 + mandatory visual review | Walk between biomes continuously; creator inspects and approves the entire outdoor world before Phase 10 |
| 2 | Walking left requires irrational long detour | 4, 8–10 | Reach visible adjacent ground by intuitive local movement |
| 3 | Generic/cloned enemies and no full sheets | 17–19 | Unique bandit and creature sprites; all directions/actions animated |
| 3–4, 8–9 | Bright blue triangle pickups, outlined/cut plants | 5, 13, 16 | Hand-authored resources, no jarring color/alpha mismatch |
| 4–5 | Random art placement; blocked path; monument inaccessible | 2, 4, 8, 12 | Paths lead somewhere; circle monument without standing on fence |
| 6 | Can't enter building; can't read sign | 12, 16 | Real accessible doorway and readable notice |
| 7 | Illogical shrub transition; island inaccessible | 7, 8, 14 | Road logic and visible actual crossing |
| 8 | Stands on tree; white outlined flowers | 4, 11, 13 | Honest tree collider/foreground; no matte edges |
| 9 | Stairs cannot be climbed; bridge cannot be crossed | 4, 8, 13, 15 | Real stairs and bridge floor routes |
| 10 | Floats over cliff; fake treasure chest | 4, 11, 15, 16 | Grounded shadow, valid cliff edge, authentic openable chest |
| 11 | Walkable unexplained oval; beautiful but pointless portal/shrine | 15, 16, 20 | Ritual space has purpose and correct collision |
| All | Preserve beloved aesthetic and gameplay continuity | 1, 5, 21, 22 | Creator-approved artwork, saves and atmosphere retained |

## 6. Final rules for judging results

**A phase is NOT done because a single technical test passes.** Source files must be updated, syntax checked, relevant automated tests passed, GitHub commit verified, and any visual claims checked with playable screenshot/video evidence. For temporary defects that still need iPhone inspection, say so plainly and put them in the next test list.

**Overworld complete** means a geographically connected, accessible, visibly coherent *outdoor* landscape—not all building interiors, all dungeons or every future quest.

**Chosen slice complete** means physically logical navigation, reliable iPhone movement, compelling enemies/props, fair combat, meaningful discoveries, persistent quests, and **user-approved visual fidelity**.

**The creator approved this roadmap with an additional mandatory full-overworld appearance review after Phase 9.** Implementation begins only when the creator requests development. **Phase 10 is locked until explicit creator approval of the Phase 9 world appearance.** The current playable build remains v1.2.6 until an implementation phase is completed and pushed.
