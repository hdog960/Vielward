## R7 v1.3.13 — source-foot depth painter and physically weathered village routes (Phase 9)
The **actual optional continuous-world preview** now draws winter pines, icy cliffs, cottages, lanterns and physically defined winter props in a single painter order by world-space foot Y. The old illustration layer yields its winter features to avoid doubled scenery; winter source solids are not drawn a second time after the new layer. Hollowreach roads now use a deterministic, gently weathered *visual-only* line fully inside the pre-existing walkable route geometry, with soft blending into the same painted snow materials. The village node has a subdued snow-worn gathering apron with no extra collision or invented doorway. Existing original painted scenes, approved Wanderer/Warden sprites, 12 regions, 48 nodes, 65 roads, seven crossings, quest mechanics, save key and Home Screen support remain protected. CI source/simulation regressions passed on the R7 implementation; a real browser captured Hollowreach, Greenwood, Frostbridge, Coldpine and atlas views. **The full painted aesthetic is still far from the approved reference; creator visual acceptance remains 0%, Phase 10 LOCKED.** No on-iPhone acceptance claimed. [R7 handoff](docs/overworld/HOLLOWREACH_DEPTH_R7.md).

### Phase 9 R6 — v1.3.12 illustrated Hollowreach environment sprites (NOT APPROVED)
A new independently produced eight-cell transparent PNG (`assets/hollowreach_neighborhood_r6.png`) has been incorporated into the **actual optional continuous-world game**, with two snowy fir silhouettes, glacial rock formations, snowy scrub, timber rail and retaining-wall details, and a warm lantern. The painter places these on the existing source-driven trees, rocks, cliff solids, lamps and cottages; polygon-clipped cliffs keep their original physical colliders, cottage frontage remains inside pre-existing building footprints, and original quests, hero/Warden art, 48 waypoints, 65 roads, seven crossings and saves remain protected. The source-art regression is `tests/hollowreach_neighborhood_r6.test.js`; build/cache is v1.3.12 with an updated iPhone service worker. See `docs/overworld/HOLLOWREACH_NEIGHBORHOOD_R6.md`.
**Creator visual acceptance is STILL 0%, Phase 9 is ACTIVE, Phase 10 is LOCKED.** No isolated sprite sheet, QA result or screenshot can substitute for completing a cohesive original-fidelity Hollowreach forecourt and then Greenwood. The artist-authored reference scenes remain the standard, not the new test sprites.


### Phase 9 R3 v1.3.9 — winter materials and source infrastructure
The Hollowreach pilot now has a **new independent 16-variant snow/cobble/rock ground raster atlas** plus **three hand-painted bridge, stair and lantern sprites**, integrated at physical world cell, source-road and geometry-anchor positions. The actual finished assets are `assets/hollowreach_ground_painted_v2.webp` and `assets/hollowreach_bridge_stairs_lamp_v2.png`, alongside the existing authored 3-object sprite sheet. These replace the old confetti-like snow and some smooth tube-road visuals **only within Hollowreach**; original world geometry and source travel/collision remain untouched. Do not assert the entire environment now matches the original artwork. Check actual browser screenshots for severe seams/tiles and remove rejected art. Artist signoff is still at 0%, Phase 10 LOCKED. Next: a whole cohesive Hollowreach forecourt (not additional orphan props), followed by Greenwood. Details: `docs/overworld/HOLLOWREACH_MATERIALS_R3.md`.


### v1.3.8 raster-art pilot — original style remains the acceptance criterion
The developer has integrated the first three REAL hand-painted pixel environment sprites as a 288×96 transparent PNG in `assets/hollowreach_pilot_sprites_v1.png`: winter fir, timber cottage, snow/ice cliff. `world_raster_pilot.js` stamps these at source-anchored Hollowreach physical object positions, preserving authoritative geometry, travel and quests. It does **not** make the entire 12-region renderer artistically acceptable. Ground, roads, many props and 11 other regions remain temporary. The original approved image backgrounds in `visual.js` remain untouched. **Visual acceptance is 0% until creator approval; Phase 10 is locked.** Required next work: whole playable Hollowreach artist-authored pixel environment, no more polygon decor / crop-and-repeat texture hacks, then a full Greenwood pilot. [Implementation / QA](docs/overworld/HOLLOWREACH_RASTER_PILOT.md).



## OVERRIDING ART-GATE CORRECTION — 2026-11-06
The original Hollowreach/Greenwood artwork is the ONLY accepted visual standard. Creator rejected current extended-world geometry art at **0% visual acceptance**; adding polygon cottages, noisy ground, primitive firs and blocky stone was a failed visual strategy, not progress. A source-image swatch repetition experiment also failed real screenshot review and was rolled back. **NO NEW PROCEDURAL PLACEHOLDER DECORATION** should be presented as future authored art. The 12-region road/connectivity/collision work is approved, but the visually rejected `v1.3.6` overworld remains a TECHNICAL MAP TEST ONLY. Preserve the detailed original scene rendering, sprite sets and all saves. The next art work is true authored raster environment sprites/terrain tiles, beginning with ONE complete Hollowreach and ONE Greenwood pilot at the exact quality of `assets/village_v06_clear.jpg` and `assets/wilds_clean.jpg`, with actual gameplay captures and explicit creator signoff. Phase 10 LOCKED. See `docs/overworld/ART_DIRECTION_RESET.md`.


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
**Status: IMPLEMENTED v1.2.7 — streaming engine integrated into a playable, optional iPhone-accessible preview alongside unchanged main adventure. Terrain art and precise geometry are NOT finished; creator's full-overworld appearance review remains after Phase 9.**
**Implementation:** [world_stream.js](./world_stream.js) · updated [game.js](./game.js), [index.html](./index.html), [visual.css](./visual.css), [sw.js](./sw.js) · [streaming QA](./tests/overworld_phase3_streaming.test.js) · [Phase 3 technical handoff](./docs/overworld/PHASE3_HANDOFF.md).
**Preview test:** Launch v1.2.7 → Journey Menu → **Explore Seamless Overworld (Phase 3 Preview)**. This is a real playable stream/camera test with coarse prototype terrain generated from the approved full-world plan, not the finished illustrated world. Pause → **Return to Hollowreach Adventure**. Phase 4 will author honest collision and elevation; Phase 5 will establish final terrain art; Phases 6–9 construct/refine the full terrain.
**Next:** Phase 4 NOT STARTED; wait for the next creator instruction.
**Work:** Refactor the current separate 1850×1200 `village` / `wilds` scene model into a stable **global overworld coordinate system**, streamed image/data chunks, culling, prefetching, and shared camera. Retain an independent enterable interior/cave scene system. Preserve the existing app during staged migration.  
**Exit gate:** The Wanderer can cross multiple adjoining outdoor chunks without a fade, Talk prompt, camera snap, visible black load frame or lost controls; roaming does not exhaust iPhone memory.

#### Phase 4 — Honest collision, elevation and interaction data
**Status: IMPLEMENTED v1.2.8 — actual playable terrain-preview geometry, collision, stair/bridge surfaces, foot-anchor elevation, 11 landmark Inspect zones and optional on-device debug overlay. Phase 5 NOT STARTED.**
**Source of truth:** [terrain geometry JSON](./docs/overworld/terrain_geometry.json) · [runtime terrain collider, floor & prop renderer](./world_geometry.js) · [world streamer](./world_stream.js) · [actual game integration](./game.js) · [Phase 4 handoff](./docs/overworld/PHASE4_HANDOFF.md) · [QA matrix](./docs/overworld/PHASE4_QA.md) · [automated regression](./tests/overworld_phase4_geometry.test.js).
**User test:** Running v1.2.8 → Journey Menu → Explore Outdoor Terrain (Phase 4 Preview). Toggle the Terrain Geometry Overlay to inspect green walkable samples, red colliders, stairs, height/foot anchor. ✋ Inspect landmarks. Return to original Hollowreach adventure with quest/save intact.
**Scope truth:** Preview world geometry is coupled to temporary schematic terrain render shapes. It is **not final pixel-art terrain**; detailed 2.5D canopy occlusion, material quality and final screenshot-level collision alignment need Phases 5–9. Creator's mandatory complete-overworld visual sign-off remains after Phase 9, before Phase 10.
**Work:** Replace collision polygons manually approximated over scene screenshots with **co-authored terrain geometry**: floor layers, true blocked solids, stairs, door thresholds, railings, water hazards, slopes, cliffs, and height/elevation levels. Separate an actor's collision-footprint from the sprite's visual height. Add developer overlays for walkability, altitude, blockers, interaction zones, foot anchors and reachable routes.  
**Exit gate:** Automated route checks verify advertised roads, bridges and staircases; visual blockers match collision; no player can stand on a tree canopy, fence cap, river, cliff face or lantern post.

#### Phase 5 — Approved pixel-art terrain/asset production workflow
**Status: IMPLEMENTED v1.2.9 — real authored pixel material atlas and 5-region interactive game preview, 16 materials × 4 variations (64 source frames), art drawn from Phase 4 ground/road/solid geometry. Phase 6 NOT STARTED.**
**Changes:** [actual terrain art module](./terrain_art.js) · [source-to-game material manifest](./docs/overworld/TERRAIN_MATERIALS.json) · [artist/compositing guide](./docs/overworld/TERRAIN_ART_STYLE_GUIDE.md) · [Phase 5 handoff](./docs/overworld/PHASE5_HANDOFF.md) · [QA acceptance notes](./docs/overworld/PHASE5_QA.md) · [source art test](./tests/overworld_phase5_art.test.js).
**Playable access:** Run v1.2.9 → Journey Menu → **Explore Pixel-Art Terrain (Phase 5 Preview)**; while in the preview, select **Visit Next Terrain Material** to cycle Snow, Thawline, Greenwood, Worldscar, Mossmere. Detailed full-region art still follows in Phases 6–8. **The appearance of the ENTIRE finished overworld must still receive creator approval after Phase 9, before Phase 10.** Do not confuse the Phase 5 source atlas with full world appearance approval.
**Work:** Establish source atlases and compositing rules for materials, shadow ramps, perspective, transition edges, pixel density, foliage clusters, bridges, water, architecture, prop silhouettes and lighting. Ban clip-art/polygon replacements for ground pickups. Record source-to-game assets, alpha cleanup and consistent authored shadow footprints.  
**Exit gate:** A small set of snow, thawline, forest, stone and water chunks reads as the **same game** next to approved current imagery; no jarring seams/white matte edges.

### ACT II — Build the ENTIRE outdoor overworld, not just three rooms

#### Phase 6 — Full-world terrain footprint
**Status: IMPLEMENTED v1.3.0 — full 12-region source-authored landmass, world-unique natural obstacles, 13 detailed location hubs, 35 protected clearings and 12-stop playable region tour. Phase 7 NOT STARTED.**
**Implementation:** [landmass and ecology source](./docs/overworld/outdoor_footprint.json) · [runtime landmass and natural solid collider](./world_footprint.js) · [environment art compositor](./terrain_art.js) · [outdoor stream](./world_stream.js) · [Phase 6 handoff](./docs/overworld/PHASE6_HANDOFF.md) · [Phase 6 QA](./docs/overworld/PHASE6_QA.md) · [automated full-route/region survey](./tests/overworld_phase6_footprint.test.js).
**Gameplay:** Journey Menu → **Explore Continuous Overworld (Phase 6)**, then **Visit Next Region · 12-Region World Survey**. Movement and natural blocking use the same authored positions as art. Source tests survey all 65 road connections, 12 regional anchors and 7 physical crossing decks; no outdoor teleport portal is required for ordinary movement. The approved original quest, NPC art and save remain intact.
**Scope caution:** This is a functional and visually differentiated 12-region footprint; full illustrated environmental artistry, blended season and forest transitions, true relief/occlusion and final detail remain in Phases 7–9. It is NOT the creator's required actual finished overworld visual sign-off. **Mandatory appearance review after Phase 9, before Phase 10 remains in force.**
**Work:** Author the full outdoor landmass, all major region boundaries and waterways, canyon heights, islands and lakes, logical roads and open clearings, with baseline visually coherent terrain for **every outdoor chunk**. Build it as actually traversable surface; do not ship a large empty flat procedural placeholder as the finished map. Keep legacy areas usable during transition.  
**Exit gate:** All planned outdoor regions exist in a unified world, are reachable through world-space movement or clearly intentional obstacles, and have a route to/from Hollowreach.

#### Phase 7 — Gradual climate, vegetation and biome transitions
**Status: IMPLEMENTED v1.3.1 — twelve continuous biome profiles, snow/exposure/altitude, physical riverbank moisture, Worldscar alpine exception, seasonal vegetation, pixel-cluster snowmelt transitions and global chunk-independent painting. Phase 8 NOT STARTED.**
**Source:** [Live climate engine](./world_climate.js) · [Phase 7 technical handoff](./docs/overworld/PHASE7_HANDOFF.md) · [Phase 7 QA](./docs/overworld/PHASE7_QA.md) · [Regression suite](./tests/overworld_phase7_climate.test.js).
**Playable:** Journey Menu → Explore Climate-Blended Overworld (Phase 7); the 12-stop survey remains. This is real climate artwork inside the optional preview, not final creator-approved illustrated scene quality.
**Work:** Blend mountain winter through evergreen lower slopes, patchy melt, wet forest and temperate meadows. Use elevation, slope exposure, water, and weather to justify where snow and greenery appear. Hand-refine chunk boundaries, lighting and foliage. No "walk into bush → lush climate" teleport.  
**Exit gate:** The Hollowreach-to-Greenwood trek visibly and logically changes climate over distance; no abrupt JPG/world swap, severe palette edge, cut-off flower sheet or mismatched texture scale.

#### Phase 8 — Entire road, bridge, stairway and island network
**Status: IMPLEMENTED v1.3.2 — all 65 graph edges draw from physical route coordinates, five varied railed bridges, a walkable dry ford, the Mossmere island west bridge/east causeway, real landing aprons, authored stair/switchback cues and mapped junction/terminus details. Phase 9 NOT STARTED.**
**Source:** [Runtime route/crossing renderer and rail guard](./world_routes.js) · [Phase 8 technical and mobile handoff](./docs/overworld/PHASE8_HANDOFF.md) · [Source-art route contract](./docs/overworld/ROAD_NETWORK_ART_GUIDE.md) · [QA checklist](./docs/overworld/PHASE8_QA.md) · [Route topology/art/physics regression](./tests/overworld_phase8_routes.test.js).
**Playable:** v1.3.2 Journey Menu → Explore Roads & Crossings (Phase 8) → Visit Next Crossing (7-stop physical survey). The original Hollowreach quest and saved character remain intact. Source-level connectivity does NOT replace the creator's real-iPhone assessment or mandatory post-Phase-9 appearance approval.
**Work:** Build all major roads, footpaths, side branches, crossings, switchbacks and stairs across the complete outdoor map. Every road ends in a landmark, junction, believable barrier, scenic overlook or intentional discovery. Give the river island a visible bridge, ford or deliberate transport interaction. Make stairs and bridge decks traversable where the art promises they are.  
**Exit gate:** Every planned endpoint has at least one proven reachable route; crossing to islands requires a physical, understandable action; no invisible detour to walk left along an apparently open path.


## Visual Recovery R2 — v1.3.6 (Phase 9, not Phase 10)
**Work implemented:** Source-authored and terrain-aware 3/4 world vignettes from `world_setpieces.js` add 29 collision-aware scenery objects across all 13 genuine landmark groups, plus readable pitched cottage roofs and windows, Greenwood shelter, village furnishings, masonry/highland columns and bridgehead details. R2 also replaces flat cliff polygon shading with source-polygon stone strata and enhances the original bridges' plank/nail/parapet grammar without altering rail collision. The ordinary player preview hides its technical status banner; debugger remains available. All 48 original travel nodes, 65 roads and seven crossings stay unchanged. **Creator art acceptance remains 0% unless the creator directly updates that assessment.** R2 is not permission to start Phase 10. Source reference: `docs/overworld/VISUAL_RECOVERY_R2.md`; test: `npm run audit:setpieces`; real pixel evidence: GitHub Actions `Veilward Browser Visual QA` (Hollowreach, Atlas, Greenwood, Coldpine, Frostbridge). New fixed versions v1.3.6 and service-worker cache v136. Next R3 author higher-fidelity environment atlases or patch feedback, NOT Phase 10.

## CREATOR VISUAL REJECTION AFTER PHASE 9 — RECOVERY IN PROGRESS (v1.3.4)

The creator explicitly approved the **physical world layout/connectivity** and rejected the **entire scene look (0% visual acceptance)** in the v1.3.3 region atlas. The procedural random 32px terrain, broad flat stroke roads, missing 3/4 silhouette architecture, tiny/empty foliage and arbitrary blank regional clearings do not match the approved snowy-village and Greenwood artwork. **This overrides any previous completion phrasing about Phase 9 appearance.** Phase 9 is functionally complete but the **mandatory appearance gate FAILED**. The next development is an art-recovery series **inside Phase 9**, not Phase 10.

**R1 SOURCE PATCH: v1.3.4** — New source-anchored `world_illustration.js` layer for shaded six-tier firs, multi-layer forest trees, faceted stone, three-quarter gabled cottage and landmark detail; wider continuous snow/moss clumps, reduced noisy atlas pixels, narrower worn roads, actual physically backed woodland near landmarks and 1250-world-unit landmark-framed atlas. Details: [Visual Recovery R1](./docs/overworld/VISUAL_RECOVERY_R1.md). **R1 is not visually accepted; no user approval yet.**

**R2–R4 STILL REQUIRED:** genuinely authored location-specific environmental detail; full artist-consistent authored world tile/sprite atlases and correct 3/4 scene depth; real on-iPhone quality comparison and creator explicit acceptance. Preserve roads/bridges/collision/saves and approved hero/Warden throughout.

#### Phase 9 — Whole-world navigability survey; choose the test slice
**Status: REVIEW BUILD v1.3.3 IMPLEMENTED — 12-region true runtime terrain atlas, real-world overview with all 65 source roads and seven crossing sites, full-world sampled walkability, shoreline/paint/physics survey, and explicit creator acceptance gate. PHASE 10 LOCKED UNTIL CREATOR APPROVAL.**
**Source:** [Actual runtime atlas](./world_review.js) · [Phase 9 handoff, walkability, future slice and stop conditions](./docs/overworld/PHASE9_HANDOFF.md) · [12-region appearance index](./docs/overworld/PHASE9_REGION_ATLAS.md) · [Phase 9 regression](./tests/overworld_phase9_review.test.js) · [Creator QA matrix](./docs/overworld/PHASE9_QA.md).
**Playable review:** Journey Menu → Review Full Overworld (Phase 9) → Review World Map & All 12 In-Game Regions. This atlas uses actual `terrain_art.paintChunk` world snapshots and taps jump to real source anchors; the gold test-corridor line is source-grounded. The creator MUST personally inspect and explicitly approve the appearance and layout before moving on.
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


## Visual Recovery R1.1 — v1.3.5 (after real-browser screenshots)

The creator's original v1.3.3 appearance rejection still stands at **0% approval**. Real browser screenshots of R1/v1.3.4 were captured by [GitHub Browser Visual QA](https://github.com/hdog960/Vielward/actions/workflows/visual-qa.yml). **They exposed that the environment was STILL visually inadequate**: Hollowreach/Greenwood too bare, landscapes still noisy, roads wide flat bands, and authentic original scene quality missing. We have not pretended a passing source test means adequate appearance.

R1.1 directly responds: `world_footprint.js` now generates more **collision-backed grove plants** in a deterministic 220-unit global grid, placed only on real land and outside existing roads/river/authorised clearings; passability is still checked against the complete network. `world_illustration.js` draws those groves in proper y-order along with mature trees, with considerably denser planted grass/meadow, wetland reeds and delicate snowbanks. `terrain_art.js` reduces repetitive material speckle by a further ~70% to two background marks / two source motifs; `world_routes.js` trims the stylized visible road strokes without changing physical path geometry or crossing collision. iPhone service worker uses v1.3.5 cache and the browser capture workflow runs again.

**Truthful current status:** More work is required before matching `village_v06_clear.jpg` and `wilds_clean.jpg`; R1.1 is another implemented art-recovery increment, not creator visual acceptance. Phase 10 remains locked. Compare the four new screenshot frames and iterate.
