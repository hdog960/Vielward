## Phase 9 R32 — source-rooted Greenwood upper woodland (v1.3.33)

Real R31c landscape gameplay still showed a mostly exposed, empty northern crossroads, even with excellent original illustrated cottages and a few narrow canopy slivers. R32 therefore introduces a **three-quarter-view upper woodland gallery**, cropped from the original transparent R18 oak/pine paintings. It grows only from **six existing physically collidable Hearth oak/pine roots**: four north-facing mature trees and two side oaks. Each rooted tree supplies proportionate upper boughs that extend toward the walkable camera rather than unrelated fern confetti or detached wallpaper. These are drawn behind complete tree sprites and the real house scenery. The actor's central clearway and all original roads, crossings and land geometry remain physically unchanged. No invented trunk, collider, entrance or changed save key.

The updated actual-world browser capture is `GREENWOOD_R32_UPPER_FOREST` and `tests/greenwood_upper_forest_r32.test.js` protects original R18 image crops, fixed physical sources, viewport culling and the historical `veilward-hollowreach-v01` save identifier. The iPhone PWA cache and live build are updated to **v1.3.33**. **This is a substantial forest-composition iteration, NOT creator art approval:** compare the actual mobile-scale screenshot to the reference and keep Phase 9 active, aesthetic acceptance 0%, Phase 10 locked. A desktop Chromium screenshot is not physical iPhone QA.

## Phase 9 R24 — Greenwood landmark forest-floor habitat, v1.3.32

R23's real screenshots show sophisticated source-painted houses sitting against largely empty, uncomposed green ground. R24 adds walkable, independent R18 painted fern material around **the two original waypoints** `greenwood_hearth` and `hermit` in the actual streamed Greenwood painter. Non-grid golden-angle clusters vary scale, spacing and rotation, with low-opacity forest canopy light/contact shadow, and check the authoritative original physical water, road corridor, obstacle and tree-trunk occupancy before drawing. This is ground-only artwork beneath the real road and building passes; it creates **no roads, obstacles, building duplicates, or new tree colliders**.

The new `tests/greenwood_habitat_r24.test.js` locks the unchanged world nodes, one-authored-fern-source painting, exclusion near roads, and user save-key stability; `GREENWOOD_R24_HABITAT` captures the **actual playable Hearth scene**, not the concept art. **These tests do not establish beauty or approval.** The original R18 oak/pine/fern/rock paintings, R21 moss-roof hermit, R23 blue-roof Hearth, character sprites, all region geometry, quest flow and `veilward-hollowreach-v01` save key remain unchanged. Greenwood still needs cohesive large-scale canopy, unique landscape layers, scene-level atmosphere, and more original art. **Visual acceptance 0%; Phase 9 ACTIVE; Phase 10 LOCKED until your actual playable-world inspection and approval.** iPhone hardware verification remains outstanding.

## Phase 9 R23 — v1.3.31: distinct illustrated Greenwood hearth cottage

The existing **single, collision-backed** `greenwood_hearth-forest_cottage-91` receives an original, separate, transparent **256 × 256 WebP** building sprite: blue slate roof, warm windows, timber porch, bell cupola, flower boxes and wood store, independent from the hermit's moss-roof refuge. The native binary `assets/greenwood_hearth_cottage_r23.webp` was transferred and validated byte-for-byte via Git object SHA, and the renderer `world_greenwood_hearth.js` loads it BEFORE original world chunk cache construction. `world_setpieces.draw` stamps it only at the existing Greenwood hearth setpiece, with the earlier real cottage art available as a decode-failure fallback. No placement, original collider radius, physical routes, quests or save key changed. R23b also smoothly frames the entire original 350-unit cottage and Wanderer only when they approach that building in phone landscape, retaining ordinary Greenwood crossroads/other-region camera behavior.

The regression test `tests/greenwood_hearth_cottage_r23.test.js` checks the genuine RIFF/WebP source, loaded dimensions, rendering position, source-only stamp predicate, legacy fallback, and original saving/world structure. Real Chromium `GREENWOOD_R23_HEARTH_COTTAGE` gameplay screenshot asserts both new painting and genuine physical screen-space roof/actor bounds. This is a SOURCE production art milestone, **not creator signoff**. Phase 9 stays ACTIVE, creator visual acceptance **0%**, Phase 10 LOCKED. Real iPhone hardware testing remains unverified. The broader Greenwood forest remains notably sparse versus premium references and Hollowreach/other regions still need substantial illustration work.

## Phase 9 R22 — v1.3.30: non-cropping Greenwood hermit framing

Real-browser R21 gameplay showed the original 512px painted hermit's refuge roof was partly clipped by the small landscape viewport. R22 changes ONLY the optional streaming-world preview camera. When a player approaches the **existing hermit node**, a smooth distance-derived, landscape-only camera composition looks ahead vertically and adjusts zoom to keep both the roof and Wanderer's feet visible; elsewhere, and on portrait screens, the original camera remains unchanged. It reuses the exact physical hub, 12 world regions, 39 existing solids, 48 waypoints, 65 roads, seven crossings, approved player sprites, quests, and `veilward-hollowreach-v01` save key.

The new real browser `GREENWOOD_R22_FULL_ROOF` capture tests actual pixel-space framing *after* changing to 720×405 and allowing the camera to settle. `tests/greenwood_hermit_framing_r22.test.js` verifies small-screen composition, desktop landscape behavior, portrait fallback, route position, and original saves. No invisible new obstacles or unrelated illustrated decorations are created.

**Not an aesthetic sign-off:** the second Greenwood cottage is still an older placeholder, and forest canopy/environment layers remain incomplete. Creator visual acceptance remains **0%**; Phase 9 ACTIVE; Phase 10 LOCKED pending explicit creator inspection and approval. Browser QA is not physical iPhone testing.

## Phase 9 R20 — v1.3.28: rooted Greenwood forest-floor tapestry

Real Chromium screenshots of R19 showed the individual R18 painted trees improved, but tiny forest specks and shallow green backgrounds still made Greenwood visibly artificial. R20 retires Greenwood's three competing micro-decoration layers (96-unit climate speckles, 112-unit isolated grass/flowers, and the 460-unit zone's detached rectangular leaf flecks), replacing them with larger existing original R18 illustrated fern-and-moss artwork planted exclusively around the **same actual original Greenwood oak/pine/flowerbed root objects**. The native world still generates the art, road verges remain physically bound to the 65 source routes, water is avoided, and no new fake collider/road/house is authored. The painter draws these soft low ground layers before the real roads and trees; other biomes retain their previous treatment. An extra true-game `GREENWOOD_R20_HERMIT_FLOOR` capture audits the walkable hermit's clearing.

R20 improves a source-grounded illustration system rather than declaring the visual target achieved. **Visual acceptance remains 0%, Phase 9 ACTIVE, Phase 10 LOCKED until the creator approves actual game screenshots/playable world.** Original Hollowreach painterly buildings, original R18 Greenwood oak/pine/fern/rock AVIFs, Wanderer/Warden art, 12 regions, 39 solid geometries, 48 anchors, 65 roads, seven crossings, quests and `veilward-hollowreach-v01` save remain protected. Browser gameplay tests are not physical iPhone tests. More work is required on truly dense 2.5D canopy architecture, hermit sanctuary illustration and layered forest environment.

## Phase 9 R19b — v1.3.27: visual QA rejected geometric verges, replaced with graded forest soil

The first R19 real-browser screenshot confirmed the mature Greenwood tree art improved proportions, but its dark, nearly flat quadrilateral road shoulders did NOT meet the creator's painterly visual standard. R19b removes the harsh block-band appearance by using distance-to-trail **feathered Canvas gradients** that fade at both inner and outer edges of each source-road verge, retaining irregular natural ground outlines and native fern illustration. All existing source geometry, physical travel/collision, PWA saves, original painted sprites and route order are unchanged. Real in-game visual capture `GREENWOOD_R19_ROAD_CORRIDOR` is retained, and `tests/greenwood_verges_r19.test.js` now checks the feathered gradient rendering path.

This is further Phase 9 art recovery, **not visual acceptance**. True large-scale woodland architecture and more sophisticated forest-floor sprite coverage remain unfinished. Visual acceptance 0%, Phase 9 ACTIVE, Phase 10 LOCKED.

## Phase 9 R19 — v1.3.26: mature Greenwood forest and road corridor integration

Actual gameplay reviews of R18 revealed under-scaled trees (roughly Wanderer-sized) and flat, sharply separated tan roads. R19 raises the **illustrated oak and pine crowns to mature tree proportions** while keeping their exact pre-existing physical root coordinates and collider sizes. The new `paintRoadVerges` stage builds two subdued, irregular moss-and-forest-duff layers along **the real Greenwood route geometry**, with small, low-opacity reuse of the R18 original painted fern texture inside those verges. It runs in `paintForestFloor` before the authoritative roads are rendered, does not create a route or solid, and is skipped in other biomes / water / distant chunks. R19 visual QA includes a new actual playable `GREENWOOD_R19_ROAD_CORRIDOR` screenshot and a deterministic source regression.

The original R18 oak, pine, fern and rock AVIFs are unchanged. All 12 regions, 39 source physical solids, 48 nodes, 65 road links, seven crossings, quests and the `veilward-hollowreach-v01` save are protected. **This is not a final art acceptance claim:** Greenwood needs substantially more large-scale cohesive original forest-floor textures and architecture, Hollowreach and other regions remain unfinished; user visual acceptance 0%, Phase 9 ACTIVE, Phase 10 LOCKED. Physical iPhone testing is not implied.

## Phase 9 R18 — v1.3.25: independent high-detail Greenwood paintings (still unapproved)

Replaced the purely procedural look of many Greenwood canopy roots with four **real transparent illustrated asset files**: oak, pine, fern bed, and moss-covered rock, each an original 128×128 AVIF with verified Git blob hash and SHA-256. These are composited once into a cached 512×128 atlas and drawn only at Greenwood's original physical scenery positions; the other five-per-kind R17 source variations are retained for variety and as an offline/old-browser fallback. The hermit clearing, original path edges, all region boundaries and all player-interaction/collision geometry stay intact. The new loader deliberately refuses empty/transparent decoded sprites (the first combined transfer was detected and rejected) and will instead keep the previously working pixel canopy. Actual browser QA captured `GREENWOOD_R18_PAINTED_TREE` from a walkable, real rooted-tree location; a separate SHA-256 and geometry regression documents the same assets.

The player HUD/character remains clearer than the world art; the **original reference quality is NOT reached**. Greenwood crossroads and forest architecture still need richer continuous illustrated composition, and Hollowreach remains incomplete. **Visual acceptance 0%; Phase 9 remains ACTIVE; Phase 10 LOCKED pending creator review.** No new obstructing geometry, path edits, save migration, quests, or actor sprite changes. See `docs/overworld/GREENWOOD_PAINTED_R18.md`.

## Phase 9 R17 — v1.3.24: grounded Greenwood foliage atlas

Greenwood now has 15 original cached native-pixel foliage variants (five broadleaf oaks, five pines, five fern/flower clusters), implemented as a 192×240 source pixel atlas rendered once per browser session by `world_greenwood_art.js`. Each sprite reuses the **existing real Greenwood footprint root** and draws in the same world painter order as other physical vegetation; no new blocked cell, object collider, destination, path, or disguised overlay is created. Forest-floor canopy shadows and leaf-litter motifs likewise derive from original trees, paint beneath the actual roads and exclude water and road crossings. Hollowreach's painterly cottages and existing winter cliffs are unchanged. A special live-game `GREENWOOD_R17_FOLIAGE` screenshot and `tests/greenwood_foliage_r17.test.js` audit actual registration, rooted placement, topology and save protection.

**Important:** The alternative photoreal/detailed experimental sprite sheet generated during planning was NOT successfully uploaded to the repository, so do not represent it as live art. The deployed asset is the original source-rendered foliage atlas described above. This remains a step toward, not a guarantee of, the gold reference standard; art approval is **0%**, Phase 9 remains **ACTIVE**, and Phase 10 remains **LOCKED**. The 12 regions, 39 authored solids, 48 node anchors, 65 roads, seven water crossings, protected actor sprites and original save key are unchanged.

## Phase 9 R16 — v1.3.23: physically rooted snow-field deposition

The playable Hollowreach terrain now draws connected painted ground-relief fans from the **same three collision-backed rock escarpments** already in the 12-region map. Each fan uses the original seamless snow material atlas, soft depth shading, an irregular continuous cliff-to-ground edge and a strict physical source reference. The four existing village roads are drawn **above** these underpaintings. There are no new arbitrary decorations, walls, invisible obstacles or invented walkable corridors. Distant terrain chunks near these cliffs now receive the scenery even outside the former 1,280-world-unit village-square paint cutoff; plaza-only detail is still skipped there to limit iPhone draw work. The new `HOLLOWREACH_R16_SNOW_FANS` browser capture and `tests/hollowreach_snow_fans_r16.test.js` check the actual source bound to gameplay.

**This is a source/landscape continuity pass, NOT art approval**. Greenwood still has insufficient illustration detail, and much of Hollowreach remains sparse. Original painterly cottages, accepted hero/Warden sprite sheets, all 39 solids, 48 anchors, 65 roads, seven crossings, quests, and original `veilward-hollowreach-v01` save key are unchanged. Creator visual acceptance remains **0%, Phase 9 ACTIVE, Phase 10 LOCKED**.

## Phase 9 R15 — v1.3.22: independent source winter escarpment sprites (November 7, 2026)

Actual playable Hollowreach now draws new original four-cell 144px transparent RGBA winter environment artwork from `assets/hollowreach_environment_r15.webp` (576×144, 27,178 bytes). Its two cliff illustrations are attached ONLY to the three existing source collision-backed snowy cliff polygons; its low snow-drift and brush artwork appears at those same cliff fronts and along the four physically placed spruce roots. Painterly original cottages are PROTECTED; the rejected R13 geometric cottage experiments remain disabled in normal gameplay. R14 connected snow/road contours remain underneath and the same authoritative roads paint over them.

No screenshot backdrop is used. The independent sprite art was generated for this game, transparency-cleaned, compacted, and verified as a real GitHub binary. Real Chromium screenshots and automated tests cover the source artwork in the actual build; **that is not user visual approval**. The R15 screenshots still reveal too much empty snow and incomplete integration, and Greenwood is still under-detailed. **Creator visual acceptance remains 0%; Phase 9 ACTIVE and Phase 10 LOCKED.** No changes to 12 regions, 48 nodes, 65 roads, seven crossings, 39 geometry solids, protected hero/guard sprites, quests, or the `veilward-hollowreach-v01` save key.

Details: `docs/overworld/HOLLOWREACH_ENVIRONMENT_R15.md`. Actual browser artwork check: `HOLLOWREACH_R15_ESCARPMENT` in `scripts/visual_capture.mjs` and source regression `tests/hollowreach_environment_r15.test.js`. The original reference images `village_v06_clear.jpg` and `wilds_clean.jpg` remain untouched.

## Phase 9 R13 art-acceptance correction — v1.3.20 (November 7, 2026)

Actual Chromium game screenshots exposed poor original-style fidelity in the R13 experimental house sprites: oversized flat roof triangles and boxy outlines. They are **rejected** as production art despite all functional tests passing. v1.3.20 restores the better original painterly 96px cottage art to the normal playable Hollowreach overworld. The four 256px trial sprite designs survive only behind `experimentalArchitecture:true` in an isolated developer preview; the normal game never renders them. The trial is evidence of a technical raster-art pipeline, **not an acceptable visual upgrade**. Screenshot QA and a new default-versus-experimental regression now lock the production art gate.

No world coordinates, 39 physical obstacles, 48 travel anchors, 65 roads, 7 crossings, existing quest/save storage, or protected hero/Warden art changed. Phase 9 is **ACTIVE**, visual acceptance remains **0%**, and Phase 10 stays **LOCKED** until explicit creator inspection and approval of genuine in-game reference-quality illustrated environments. This correction supersedes earlier R13 text that implies the trial houses were promoted.

## Phase 9 R13 — v1.3.19 original 256px architecture pilot (NOT APPROVED)

Four unique full-source-resolution pixel-art winter cottage variants are drawn once into a 1024x256 in-memory raster atlas (`world_architecture_atlas.js`) and stamped onto the SAME source-backed Hollowreach cottage positions. The original 96px pilot image remains as a transparent fallback. Each design has coherent 3/4 roof planes, directionally placed shingles and snowy eaves, timber and stone foundation texture, individually framed warm windows and porch details. A real-browser capture `HOLLOWREACH_R13_COTTAGES` inspects these buildings in actual gameplay. The four originals are source-pixel illustrations implemented as deterministic canvas art, **not** painted pre-production concept frames or a replacement for real modular assets.

No changes were made to 12 macro-regions, 48 travel nodes, 65 roads, seven crossings, 39 physical obstacles, original quest/save keys or protected Wanderer/Warden art. This is one meaningful architectural art step within the existing Phase 9 visual recovery. **Creator visual acceptance stays 0%; Phase 9 remains ACTIVE; Phase 10 LOCKED.** Original painting-quality cliffs, trees, roads, riverbanks and Greenwood are still unfinished. Details: `docs/overworld/HOLLOWREACH_ARCHITECTURE_R13.md`.

## Phase 9 R12 — v1.3.18: source-rooted winter terrain and crisp raster details

The actual playable Hollowreach preview now paints a linked snow-covered west slope using the physical upper/lower cliff polygons and all four authentic collision-backed spruce roots. Village flagstones use clipped imagery from the independent, authored winter stone atlas rather than flat polygon fills; existing winter building/terrain sprites are enlarged with pixel-sharp nearest-neighbor rendering. The R12 source regression and real-browser terrain viewpoint are part of QA. **This is only a structural environmental integration pass.** It does not produce original-reference-level illustrated architecture; Greenwood and much of the overworld remain underdetailed. The 12-region topology, 48 nodes, 65 roads, 7 crossings, 39 physical solids, playable original scenes, saves and protected actor art are unchanged. **Creator visual acceptance remains 0%; Phase 9 ACTIVE and Phase 10 LOCKED.** Source: `docs/overworld/HOLLOWREACH_LANDSCAPE_R12.md`.

# VEILWARD — MANDATORY DEVELOPMENT WORKFLOW

> **GAME PATCHING AFTER FEEDBACK IS A REQUIREMENT — NOT MERELY AUTHORIZATION.**
>
> The developer assistant MUST update the **actual playable game** in this repository in direct response to each user playtest report, bug report, art correction, or development instruction. The assistant MUST do the implementation work before presenting a completed-response summary. The user's feedback is the work order, not an invitation to propose plans.

## Required cycle: user tests → assistant patches → user retests

1. **Read the latest feedback and screenshots carefully.** Diagnose the actual issue in source code and/or assets. Check the live repository, not assumptions from an older response.
2. **Patch the real game immediately.** Modify gameplay code, sprite atlases, assets, CSS, data, or service worker as needed. Do not provide only instructions, a diagnosis, future intent, design mockups, a plan, or a standalone art sheet in place of implemented changes. Do not ask for repeat authorization or defer to another turn.
3. **Follow the specific requested scope.** Keep approved work intact (especially the player-character atlas), preserve gameplay saves, and fix the actual requested issue without gratuitous unrelated rewrites.
4. **Quality-check the result before reporting completion.** Validate code syntax, correct asset dimensions/render paths, and behavior with available tests/simulations. For image bugs, inspect rendered output where feasible; do not claim final on-device visual confirmation without it.
5. **Push all required changes to this repository's GitHub main branch**, preserving history and checking the branch head before updating. Verify the new remote commit ID and source files *after* pushing. Keep iPhone Safari / Add-to-Home-Screen service-worker cache behavior in mind, including versioned assets and update detection.
6. **Return a short patch report, not a proposal.** State the exact modifications made, version/commit if verified, test results and any genuinely unverified device checks, and link to the playable game: https://hdog960.github.io/Vielward/.
7. **Repeat with the next user test.** The user should never have to remind the assistant of this loop.

## Non-negotiable prohibitions

- **Do NOT treat feedback as optional, future work, or merely permission to patch. Patching is mandatory.**
- Do NOT respond with a plan or explanation *instead* of making the patch.
- Do NOT send new sprite art, previews, or concept images as a substitute for updating the actual game.
- Do NOT repeatedly claim tool access is unavailable without first checking tools and actually attempting the repository operation.
- Do NOT claim an update was pushed or deployed if GitHub has not verified the commit; a GitHub push is not itself proof of iPhone cache refresh.
- Do NOT quietly abandon the patch if one method fails; inspect the blocker, try an available valid alternative, and do as much real work as possible.

## Genuine blockers and factual accuracy

If the repository is genuinely inaccessible, a tool fails, or the task is otherwise impossible, report the **verified** specific blocker and what was attempted; never invent a pushed patch or falsely promise asynchronous completion. This is an exception for truthfulness, **not** permission to skip work when tools are available.

## Current outstanding user feedback

- **Warden Hal must be rebuilt from scratch as a distinct character**, NOT merely recolored, painted over, given box-like helmets, or visually cloned from the player. Make a real dedicated sprite asset, wire it into the game, check its aesthetic in the scene, and preserve all Warden interactions and quest logic.
- **The player character must NOT be changed** during Warden work. Keep the approved eight-direction player atlas, movement, and animations untouched.
- **iPhone Home Screen shortcut updates must be reliable.** Verify versioning, service-worker activation and cache refresh on each patch. A closed and reopened app still may show stale assets; fix the update path rather than blaming the player.
- Keep the art faithful to the high-detail three-quarter pixel-art direction in ART_DIRECTION.md and ART_BENCHMARK.md.

## Scope and milestone

Follow PROTOTYPE_ROADMAP.md: perfect the Hollowreach playable slice and obtain explicit creator approval before broad full-game expansion. Prioritize quality of implemented art, controls, grounded sprites and collision over quantity of new content.

This file is the project's canonical agent instruction and applies on each future development turn. When answering from another chat, **read this file and the latest commit before changing the game**.

## Approved overworld rebuild roadmap — mandatory review gate

The creator approved the 22-phase continuous-overworld rebuild with an explicit new checkpoint: **after Phase 9, the creator must review and approve the appearance and geography of the fully built outdoor overworld** before Phase 10 begins. Deliver a real playable iPhone build with regional screenshots/map, not artwork alone. If the creator supplies corrections, patch the live game, push, and resubmit for review. Do not automatically advance. Source of truth: `OVERWORLD_REBUILD_ROADMAP.md`.

Roadmap approval does not override the established **one complete phase per "Continue development"** workflow. No new phase begins without an explicit continuation instruction.


## Overworld rebuild — Phase 1 source-of-truth audit complete (November 5, 2026)

**Completed only Phase 1** of the approved 22-phase plan. See `docs/overworld/ISSUE_REGISTER.md` (34 records, PDF p.1–12), `docs/overworld/WORLD_DESIGN_LOCK.md`, `docs/overworld/ASSET_AND_RUNTIME_INVENTORY.md`, `docs/overworld/COORDINATES_AND_MIGRATION.md`, machine-readable `docs/overworld/issue_register.json` and protected `docs/overworld/protected_assets.json`. Test with `npm run audit:world`. The detailed Phase 1 handoff is `docs/overworld/PHASE1_HANDOFF.md`.

Use `OVERWORLD_REBUILD_ROADMAP.md` as the **current next-development authority**; the old prototype and micro-sprint roadmaps are preserved as history. Phase 1 authorizes documentation-only auditing, not changing the current playable code. **Do not start Phase 2 until the creator says “Continue development”.** Before Phase 10, the creator must approve full overworld appearance after the Phase 9 review build. Continue the original test→notes→actual GitHub patch workflow for gameplay feedback.


## Overworld rebuild — Phase 2 complete (November 5, 2026)

Phase 2 produced a full 12-region connected outdoor **DESIGN BLUEPRINT**, not a playable overhaul. Source of truth: `docs/overworld/world_blueprint.json` (48 named anchors, 65 unique physical links, 7 crossings). Creator map: `docs/overworld/MASTER_MAP.svg`, generated deterministically by `scripts/render_overworld_blueprint.js`. Readable geography: `docs/overworld/MASTER_MAP.md`; QA / implementation handoff: `docs/overworld/PHASE2_TOPOLOGY_AUDIT.md` and `docs/overworld/PHASE2_HANDOFF.md`. Run `npm run audit:topology` and `npm test`.

**Phase 3 is NOT STARTED**. Do not begin it until the creator requests another continuation. Preserve v1.2.6 live gameplay until new streaming is stable. Respect the entire world's Phase 9 appearance approval gate: no Phase 10 work without explicit creator approval of the **actual built playable overworld**, not this planning SVG.


## Overworld Phase 3 (v1.2.7) — playable streaming engine delivered

The actual game includes `world_stream.js`, a lazy, chunk-cached full-global-coordinate engine driven by `docs/overworld/world_blueprint.json`. It is accessible through **Journey Menu → Explore Seamless Overworld (Phase 3 Preview)** and can be exited to the unmodified active quest/saves via the same menu. **Preview terrain is intentionally PROVISIONAL, not creator-approved art.** Combat, quests, inventory and legacy player position do not mutate during the preview. Current world collision is only a preview mask; Phase 4 will co-author real ground/elevation geometry, Phases 5–9 implement the full art/world, then the creator must approve world appearance before Phase 10. Avoid removing old gameplay during staged migration. Check with `npm run audit:streaming` and `npm test`.

**Phase 4 NOT STARTED**. Await creator's next `Continue development` or specific iPhone feedback (which must be patched immediately as always).


## Overworld Phase 4 complete — build v1.2.8 (November 5, 2026)

`world_geometry.js` and `docs/overworld/terrain_geometry.json` now author the *same visible shape and exact foot collision* for region floors, path/stair elevations, bridge/ford/causeway ground, tree trunks, railings, cliff faces and landmark Inspect zones. The actual iPhone game has an optional **Explore Outdoor Terrain (Phase 4 Preview)** mode and **Terrain Geometry Overlay** (Journey Menu; visible only inside preview). All quest/combat/gear/save mechanics remain in the working legacy adventure until subsequent migration. Check `npm run audit:geometry`, `npm run audit:streaming` and `npm test` and **verify Home Screen activation**. Read `docs/overworld/PHASE4_HANDOFF.md` and `docs/overworld/PHASE4_QA.md` before modifying terrain. Important: world preview's provisional graphics have NOT passed user visual approval. Detailed 2.5D pixel-art and foreground occlusion remain Phase 5–9.

**Phase 5 NOT STARTED.** Do not advance without the creator's next continuation or patch specific user feedback immediately. **After Phase 9 stop for the creator's full-overworld playable visual appearance approval before Phase 10.**


## Overworld Phase 5 complete — build v1.2.9 (November 5, 2026)

The **actual playable preview** now runs `terrain_art.js`, a source-authored 16-material×4-variant = 64-frame Canvas atlas, with source-to-game data at `docs/overworld/TERRAIN_MATERIALS.json`. The atlas paints deterministic world-grid snow, thaw, forest, moss, river/lake, stone, timber, rock, canopy and shadows using exactly the Phase 4 `world_geometry.js` floors, paths and blocker coordinates. Source rules: `docs/overworld/TERRAIN_ART_STYLE_GUIDE.md`; test and next phase: `docs/overworld/PHASE5_HANDOFF.md`, `docs/overworld/PHASE5_QA.md`. The real iPhone Journey Menu has **Explore Pixel-Art Terrain (Phase 5 Preview)** and inside it **Visit Next Terrain Material** (Snow→Thawline→Greenwood→Worldscar→Mossmere). Check `npm run audit:art` and `npm test`, and verify the new Home Screen cache `veilward-hollowreach-v129-material-atlas`. Approved player and Warden sprites, actual old village gameplay, and legacy save remain intact. **No separate image-only art deliverables.**

**Phase 6 NOT STARTED.** Next explicit continuation implements the actual Hollowreach integrated outdoor region art/architecture from the approved scene reference. The atlas alone is not full-appearance approval; the creator must inspect the entire real playable outdoor overworld after Phase 9 before Phase 10.


## Phase 6 complete — v1.3.0 continuous twelve-region outdoor landmass

The **actual GitHub Pages game** includes `world_footprint.js` and `docs/overworld/outdoor_footprint.json`, authoring a physical landmass outline, all **12 macro-regions**, 13 distinct scenery hubs, 35 protected clearings, biome-specific deterministic region vegetation and solid obstacles. The *same authored global positions* draw trees/rocks/ruins and block Wanderer feet; background/materials and outside cliff boundary are painted into lazy streamed `terrain_art.js` chunks. The entire **65-road + 7 crossing** geometry remains physically navigable. The iPhone Journey Menu has **Explore Continuous Overworld (Phase 6)** and a **12-stop Visit Next Region survey**. This only changes the optional preview, preserving the existing saved Hollowreach quest, Joren, equipment and approved hero/Warden sprites. New Home Screen cache: `veilward-hollowreach-v130-world-footprint`. Run `npm run audit:footprint` then `npm test`, and read `docs/overworld/PHASE6_HANDOFF.md` and `docs/overworld/PHASE6_QA.md` before any terrain changes.

**Phase 7 NOT STARTED.** Future work improves climate transition, foliage, terrain cohesion, then all-region art. The Phase 6 footprint is not an approved final game-art image. After Phase 9 **STOP for creator's appearance review** and do not enter Phase 10 without explicit approval. Any user feedback requires a real game patch first.


## Overworld Phase 7 complete — v1.3.1 global climate and vegetation

The live preview uses `world_climate.js` to derive continuous regional snow, exposure, elevation and riverbank dampness in global coordinates. Terrain pixel materials and region-specific pine/oak/flower/rock families both consume that source without altering the road colliders, protected approved hero/Warden art or saved Hollowreach adventure. Test `npm run audit:climate` and `npm test`; see `docs/overworld/PHASE7_HANDOFF.md` and `docs/overworld/PHASE7_QA.md`. **Phase 8 NOT STARTED** until the next explicit "Continue development". Creator must see and explicitly approve the whole landscape **after Phase 9 before Phase 10**. Actual iPhone visual approval is still pending.


## Overworld Phase 8 COMPLETE — v1.3.2 physical road and crossing network

The actual live preview now uses `world_routes.js` to render all **65** physical roads, **5** individual bridge decks with colliding painted rails, the dry Stoneford ford and Mossmere east causeway; the lake's east/west bank routes both connect to the walkable island. Source road art and obstacle guard share `world_geometry.js` centerlines and widths. `terrain_art.js` water occupancy uses the physical `geometry.waterAt()` source so shown banks and collision match. Added Journey Menu → Visit Next Crossing to survey seven stops on iPhone. Original saved quest, approved hero/Warden, world climate, lazy cache and earlier features preserved. Full suites: `npm run audit:routes` and `npm test`. Handoff: `docs/overworld/PHASE8_HANDOFF.md`, QA: `docs/overworld/PHASE8_QA.md`, drawing source guide: `docs/overworld/ROAD_NETWORK_ART_GUIDE.md`. **Phase 9 NOT STARTED** until next explicit instruction. After Phase 9 STOP for creator full-overworld appearance approval before Phase 10. Source checks cannot replace on-iPhone visual review.


## Phase 9 delivered — v1.3.3 MANDATORY CREATOR VISUAL GATE (NO PHASE 10)

The current main branch delivers actual-world in-game overview and 12-region true terrain-compositor thumbnails through `world_review.js`, accessed from Journey Menu → Review Full Overworld (Phase 9) → Review World Map & All 12 In-Game Regions or the map icon while in the continuous outdoor preview. Tap to visit physically grounded anchors and inspect on foot. Complete road graph: 48 anchors, 65 real physical links, 7 crossings, every region walkable, climate transitions and preserved original quest/save. The atlas highlights an approved-data Hollowreach → Frostbridge → Thawline → Greenwood → Old Crown → Smugglers test corridor, for focus **after approval**. Run `npm run audit:review` and `npm test`; read `docs/overworld/PHASE9_HANDOFF.md`, `docs/overworld/PHASE9_QA.md` and `docs/overworld/PHASE9_REGION_ATLAS.md`. **STOP ALL PHASE 10+ development until the creator has personally inspected and EXPLICITLY APPROVED the full game overworld appearance/geography.** If feedback is negative or contains requests, patch the actual deployed GitHub game, rerun regressions, resubmit the revised review; do not silently declare acceptance. The existing live runtime atlas is honest; no physical-device FPS or final art fidelity approval inferred from mocked tests.


## CREATOR REJECTED PHASE 9 APPEARANCE — VISUAL RECOVERY R1 ON v1.3.4

**NON-NEGOTIABLE:** Creator explicitly rates the v1.3.3 whole-world visuals **0% acceptance**, while approving the **12-region layout, original 65 roads and seven crossings**. Phase 10 is LOCKED. Do not say Phase 9 art is approved or shift into Phase 10. Detailed snowy/woodland references remain `assets/village_v06_clear.jpg` and `assets/wilds_clean.jpg`. See `docs/overworld/VISUAL_RECOVERY_R1.md` for root cause, concrete code changes, honest visual limitations and R2–R4 remaining visual work.

New `world_illustration.js` is a source-aligned artist layer (shape draft) for tiered pines/oaks, rocks, roofed cottage, landmarks and environmental clusters. `terrain_art.js` uses it to replace the sparse scenery, and `world_climate.js` uses continuous patches instead of individual checkerboard decisions. `world_footprint.js` restores actual collider-bearing trees near landmarks while protecting real route and water corridors. `world_routes.js` renders narrower worn trails inside original physical passability. All four selected region-views now focus on real land-marked anchors and show more visual detail. New version and service worker: v1.3.4 / v134. Run `npm run audit:recovery` and `npm test`. **No source test or generated thumb proves finished art**; only creator approval after actual iPhone review does.


## Visual Recovery R1.1 — v1.3.5 (after real-browser screenshots)

The creator's original v1.3.3 appearance rejection still stands at **0% approval**. Real browser screenshots of R1/v1.3.4 were captured by [GitHub Browser Visual QA](https://github.com/hdog960/Vielward/actions/workflows/visual-qa.yml). **They exposed that the environment was STILL visually inadequate**: Hollowreach/Greenwood too bare, landscapes still noisy, roads wide flat bands, and authentic original scene quality missing. We have not pretended a passing source test means adequate appearance.

R1.1 directly responds: `world_footprint.js` now generates more **collision-backed grove plants** in a deterministic 220-unit global grid, placed only on real land and outside existing roads/river/authorised clearings; passability is still checked against the complete network. `world_illustration.js` draws those groves in proper y-order along with mature trees, with considerably denser planted grass/meadow, wetland reeds and delicate snowbanks. `terrain_art.js` reduces repetitive material speckle by a further ~70% to two background marks / two source motifs; `world_routes.js` trims the stylized visible road strokes without changing physical path geometry or crossing collision. iPhone service worker uses v1.3.5 cache and the browser capture workflow runs again.

**Truthful current status:** More work is required before matching `village_v06_clear.jpg` and `wilds_clean.jpg`; R1.1 is another implemented art-recovery increment, not creator visual acceptance. Phase 10 remains locked. Compare the four new screenshot frames and iterate.



## Visual Recovery R2 — v1.3.6 (Phase 9, not Phase 10)
**Work implemented:** Source-authored and terrain-aware 3/4 world vignettes from `world_setpieces.js` add 29 collision-aware scenery objects across all 13 genuine landmark groups, plus readable pitched cottage roofs and windows, Greenwood shelter, village furnishings, masonry/highland columns and bridgehead details. R2 also replaces flat cliff polygon shading with source-polygon stone strata and enhances the original bridges' plank/nail/parapet grammar without altering rail collision. The ordinary player preview hides its technical status banner; debugger remains available. All 48 original travel nodes, 65 roads and seven crossings stay unchanged. **Creator art acceptance remains 0% unless the creator directly updates that assessment.** R2 is not permission to start Phase 10. Source reference: `docs/overworld/VISUAL_RECOVERY_R2.md`; test: `npm run audit:setpieces`; real pixel evidence: GitHub Actions `Veilward Browser Visual QA` (Hollowreach, Atlas, Greenwood, Coldpine, Frostbridge). New fixed versions v1.3.6 and service-worker cache v136. Next R3 author higher-fidelity environment atlases or patch feedback, NOT Phase 10.


## OVERRIDING ART-GATE CORRECTION — 2026-11-06
The original Hollowreach/Greenwood artwork is the ONLY accepted visual standard. Creator rejected current extended-world geometry art at **0% visual acceptance**; adding polygon cottages, noisy ground, primitive firs and blocky stone was a failed visual strategy, not progress. A source-image swatch repetition experiment also failed real screenshot review and was rolled back. **NO NEW PROCEDURAL PLACEHOLDER DECORATION** should be presented as future authored art. The 12-region road/connectivity/collision work is approved, but the visually rejected `v1.3.6` overworld remains a TECHNICAL MAP TEST ONLY. Preserve the detailed original scene rendering, sprite sets and all saves. The next art work is true authored raster environment sprites/terrain tiles, beginning with ONE complete Hollowreach and ONE Greenwood pilot at the exact quality of `assets/village_v06_clear.jpg` and `assets/wilds_clean.jpg`, with actual gameplay captures and explicit creator signoff. Phase 10 LOCKED. See `docs/overworld/ART_DIRECTION_RESET.md`.



### v1.3.8 raster-art pilot — original style remains the acceptance criterion
The developer has integrated the first three REAL hand-painted pixel environment sprites as a 288×96 transparent PNG in `assets/hollowreach_pilot_sprites_v1.png`: winter fir, timber cottage, snow/ice cliff. `world_raster_pilot.js` stamps these at source-anchored Hollowreach physical object positions, preserving authoritative geometry, travel and quests. It does **not** make the entire 12-region renderer artistically acceptable. Ground, roads, many props and 11 other regions remain temporary. The original approved image backgrounds in `visual.js` remain untouched. **Visual acceptance is 0% until creator approval; Phase 10 is locked.** Required next work: whole playable Hollowreach artist-authored pixel environment, no more polygon decor / crop-and-repeat texture hacks, then a full Greenwood pilot. [Implementation / QA](docs/overworld/HOLLOWREACH_RASTER_PILOT.md).



### Phase 9 R3 v1.3.9 — winter materials and source infrastructure
The Hollowreach pilot now has a **new independent 16-variant snow/cobble/rock ground raster atlas** plus **three hand-painted bridge, stair and lantern sprites**, integrated at physical world cell, source-road and geometry-anchor positions. The actual finished assets are `assets/hollowreach_ground_painted_v2.webp` and `assets/hollowreach_bridge_stairs_lamp_v2.png`, alongside the existing authored 3-object sprite sheet. These replace the old confetti-like snow and some smooth tube-road visuals **only within Hollowreach**; original world geometry and source travel/collision remain untouched. Do not assert the entire environment now matches the original artwork. Check actual browser screenshots for severe seams/tiles and remove rejected art. Artist signoff is still at 0%, Phase 10 LOCKED. Next: a whole cohesive Hollowreach forecourt (not additional orphan props), followed by Greenwood. Details: `docs/overworld/HOLLOWREACH_MATERIALS_R3.md`.


### Phase 9 R6 — v1.3.12 illustrated Hollowreach environment sprites (NOT APPROVED)
A new independently produced eight-cell transparent PNG (`assets/hollowreach_neighborhood_r6.png`) has been incorporated into the **actual optional continuous-world game**, with two snowy fir silhouettes, glacial rock formations, snowy scrub, timber rail and retaining-wall details, and a warm lantern. The painter places these on the existing source-driven trees, rocks, cliff solids, lamps and cottages; polygon-clipped cliffs keep their original physical colliders, cottage frontage remains inside pre-existing building footprints, and original quests, hero/Warden art, 48 waypoints, 65 roads, seven crossings and saves remain protected. The source-art regression is `tests/hollowreach_neighborhood_r6.test.js`; build/cache is v1.3.12 with an updated iPhone service worker. See `docs/overworld/HOLLOWREACH_NEIGHBORHOOD_R6.md`.
**Creator visual acceptance is STILL 0%, Phase 9 is ACTIVE, Phase 10 is LOCKED.** No isolated sprite sheet, QA result or screenshot can substitute for completing a cohesive original-fidelity Hollowreach forecourt and then Greenwood. The artist-authored reference scenes remain the standard, not the new test sprites.



## Current Phase 9 R7 build — v1.3.13
The live source has a depth-sorted Hollowreach winter raster compositor and softer physical-road rendering. Source of truth: `docs/overworld/HOLLOWREACH_DEPTH_R7.md` and `OVERWORLD_REBUILD_ROADMAP.md`. Test with `npm run check` and `npm test`, plus real-browser visual QA. **Still visually rejected at 0% creator approval; Phase 10 stays locked.** Continue improving the actual playable environment, not producing detached concept art. Preserve original sprites and saves. One development slice per creator instruction.


## R8 v1.3.14 — Hollowreach grounded terrace / square integration
The playable overworld now contains **three new genuinely solid source-geometry Hollowreach cliffs** in safe locations off existing roads. Original map topology, 48 nodes, 65 roads and seven crossings are unchanged. The 7 total cliff polygons and 33 total obstacles are rendered from authoritative geometry, not visual-only impostors. A snow cornice/fracture painter follows their real polygon footprints; Hollowreach's paved square, physically anchored cottage approaches and snowy path verges are unified in the same terrain compositor. Versioned app/cache and source geometry query were bumped; R8 tests are part of `npm test` and browser captures now inspect a viewpoint near the actual new cliff surfaces. **Visual creator acceptance is still 0%; no Phase 10.** See `docs/overworld/HOLLOWREACH_TERRACES_R8.md`.



## Phase 9 R9 / v1.3.15 — real Hollowreach western forest edge
Four collision-backed source spruces now form one staggered village-facing western tree belt in `docs/overworld/terrain_geometry.json`. `world_raster_pilot.js` composes a **continuous** snow-covered bank, painted-texture drift and natural underbrush using the true tree coordinates; canopies and village architecture remain in correct boot-Y occlusion. The existing game's source geometry grew from 33 to **37** solids without changing **12 regions, 48 nodes, 65 roads or 7 crossings**. The preserved user save key is `veilward-hollowreach-v01`. R9 source-art, route-integrity and collision QA lives in `tests/hollowreach_shelterbelt_r9.test.js`; the browser capture has a real walkable village forest-edge viewpoint. See `docs/overworld/HOLLOWREACH_SHELTERBELT_R9.md`. **User visual acceptance remains 0% and Phase 10 LOCKED.** The playable art is still far from the approved paintings; do not represent this as artist approval. Continue Phase 9 with holistic village/cliff/stair/riverbank architecture, then Greenwood equivalent.



## R10 v1.3.16 — horizontal source-backed Hollowreach cottage retaining walls (Phase 9)
Two physically impassable illustrated snow/stone retaining wall segments now sit behind the original western Hollowreach cottage approaches; the true pedestrian opening and all **48 nodes/65 roads/7 crossings** remain accessible. The live world contains **39 physical solids** (7 cliffs, 4 newer grove roots, 2 retaining walls, and original structures). The initial art implementation looked like isolated vertical pillars, so real-browser QA forced the wall art and geometry to be reoriented horizontally and joined into one snow-topped wall face. The two original village cottages remain present (automated tests and real Chromium screenshot verify this). Correct actor/roof/wall foreground occlusion is regression-tested. See `docs/overworld/HOLLOWREACH_RETAINING_R10.md`. **Creator visual acceptance = 0% and Phase 10 remains LOCKED.** This is not a finished overworld aesthetic; the next work is holistic illustrated architecture, verified real slopes/stairs, foreground transitions and original-quality Greenwood. Preserve original artwork, gameplay, saves, and all 12 regions.



## Phase 9 R11 — v1.3.17, real-world Hollowreach snow travel impressions

Implemented: the **actual playable streamed world** now overlays subtle paired, alternating worn bootprints on the **authoritative existing village roads only**. These marks follow exact source edge lengths, use stable world-space coordinates across chunk seams, omit buried steps and physically blocked/wet surfaces, and are painted after the road but before trees/cottages. The production sprite renderer and iPhone PWA build are versioned v1.3.17, with a new regression `tests/hollowreach_snowpaths_r11.test.js` in `npm test` plus real Chromium capture `HOLLOWREACH_SNOWPATHS`. No routes, 39 colliders, 48 nodes, seven crossings, 12 regions, original approved hero/Warden art, or save key changed. **This is only a small inhabited-world visual pass, not a major aesthetic recovery**. The real screenshot is still too flat/sparse and visually far below `assets/village_v06_clear.jpg`; Greenwood similarly lacks depth. **Phase 9 remains active; creator visual acceptance 0%, Phase 10 locked**. Next work must be substantial original illustrated interconnected architecture, physical cliff/riverside/stair composition and a redesigned, deeper world environment, not additional geometric placeholder objects. See `docs/overworld/HOLLOWREACH_SNOWPATHS_R11.md`.

