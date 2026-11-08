## Phase 9 R28b — paint physically rooted old growth that is actually visible

The first R28 real-browser gameplay screenshot was **unchanged** from R27 despite four valid trees. An audit showed all four physical roots fell outside the useful phone landscape frame. R28b prioritizes safe south-side forest-edge positions confirmed by the world-space audit, relaxes unnecessary clear trunk spacing while retaining all road/water/house/anchor safety checks, and renders these featured trees only with the original R18 painted oak/pine artwork. All trees remain grounded in the real collision world. Actual browser verification now requires at least two on-camera rooted crowns and captures `GREENWOOD_R28B_VISIBLE_CROWNS`. No art approval or physical iPhone certification is implied; Phase 9 remains active and Phase 10 locked.

## Phase 9 R28 — Rooted old-growth framing at Greenwood Hearth

The previous real-browser R27 screenshot remained open because most new scenery roots sat beyond the phone landscape viewport. R28 adds a **small curated selection of original oak/pine roots** around the Hearth margins, admitting candidates only when confirmed safe from all physical road segments, water, obstacles, existing trees, the cottage and entrances. These roots appear in the same `footprint.groves()` source consumed by the art painter and `footprint.blocked()` collision—not a fake background layer. The new browser capture is `GREENWOOD_R28_LIVING_CROSSROADS`, with `GREENWOOD_R28_HERMIT_PRESERVED` as a no-regression scene. The 12-region road network, quests and save identifier remain unchanged. Creator visual acceptance remains 0% and Phase 10 locked.

## Phase 9 R27 — Greenwood physical forest at real road edges

Greenwood's excessive *extra* road and hub-clearance buffers are reduced only for this biome, admitting more collision-backed oak/pine roots alongside existing roads. Explicit protected zones preserve the original Hearth cottage and four setpieces plus the Hermit entrance. Roads, water, source sprite art, scenes, quests and saved character state are unchanged. Actual browser screenshot keys: `GREENWOOD_R27_WOODED_CROSSROADS` and `GREENWOOD_R27_HERMIT_EDGE`; dedicated test checks source footpoints and routes. The appearance remains **not approved**; Phase 9 active, Phase 10 locked.

## Phase 9 R26 — continuous Greenwood undergrowth and rooted forest light

R26 joins *existing* source-landmark fern mats into continuous safe forest-floor beds only when all interior samples lie off the physical roads, water and buildings. Wider, subdued canopy-filtered shadow and sun patches remain attached to original collision-backed oak/pine roots. There are **no new tree trunks, obstacles, paths, waypoints or gameplay changes**, and the existing save key is untouched. Final real-Chromium images: \`GREENWOOD_R26_CONNECTED_GLADE\` and \`GREENWOOD_R26_HERMIT_CANOPY\`. This is an improvement-in-progress, not art approval. Phase 9 remains ACTIVE; Phase 10 locked.


## Phase 9 R25b — remove synthetic clearing chip ring and bright road dashes (visual QA pending)

Actual browser A/B captures isolated two independent sources of distracting pale rectangles: `world_illustration.marker(kind="clearing")` stamped 32 pastel rectangles around the original landmark, and `world_routes.ribbon` stamped small high-contrast gravel dashes along woodland roads. R25b deletes the false circular waypoint markers and skips woodland-only synthetic path flecks; the original route corridors, source roads, canopy, illustrated cottages and all physics/saves are preserved. The R25 base plates remain unchanged. Actual Chromium `GREENWOOD_R25B_CLEAN_CLEARING` screenshot and regression must be checked; this is *not* creator signoff. Phase 9 remains ACTIVE and Phase 10 locked.

## Phase 9 R25 — Greenwood seamless ground and source-root canopy (visual approval pending)

Removed Greenwood's small repeating pale leaf/flower motif from its base material and replaced it with three cached, low-chroma, world-aligned ground material plates; connected existing painted oak/pine upper crowns only when original physical roots, road margins and river boundaries allow. No new obstacles, roads, trees, quests, sprite swaps or save migration. R25 actual-play screenshots: `GREENWOOD_R25_GROUND` and `GREENWOOD_R25_CANOPY`. Technical tests are not creator approval; visual acceptance remains 0%, Phase 9 ACTIVE, Phase 10 LOCKED. See `docs/overworld/GREENWOOD_GROUND_CANOPY_R25.md`.

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

# VEILWARD v1.3.9 — phase 9 original-style terrain and infrastructure pilot

**Visual acceptance still 0% — NOT READY FOR CREATOR REINSPECTION.** Hollowreach now uses new painted terrain materials (snow, stone, paths, rocky cliff transitions) alongside real illustrated cabin, pine, icy rock, lantern, stairs and bridge sprites. This is a prototype of the *asset pipeline*, not a finished full map. The original richly illustrated adventure and all saves are unchanged.

[Play the current technical build](https://hdog960.github.io/Vielward/) · [Art direction and development milestones](./docs/overworld/HOLLOWREACH_MATERIALS_R3.md)

**Phase 10 remains locked.** The next requirement is a coherent finished Hollowreach scene, reviewed against the original golden-reference screenshot before doing all biomes.

---

# VEILWARD v1.3.8 — original-style pixel-art pilot

The extended 12-region world is still **visually unapproved**. Rather than adding more polygon scenery, we have begun integrating genuine authored pixel sprites into **Hollowreach**: snow-laden fir, lit timber cottage and icy cliff cutouts. They sit in the existing physical world with the old travel layout, collision, quests and saves protected. This first three-asset pilot is not yet a complete scene and **not 100% visual acceptance**. The original richly illustrated Hollowreach gameplay is unchanged.

[Play Veilward](https://hdog960.github.io/Vielward/) · [Pilot source/next milestones](./docs/overworld/HOLLOWREACH_RASTER_PILOT.md) · [Sprite atlas](./assets/hollowreach_pilot_sprites_v1.png)

**Phase 9 remains on hold for art; Phase 10 is locked** until the creator approves the complete illustrated overworld.

---

# Veilward — Art direction protected, no false visual acceptance

**The original illustrated Hollowreach/Greenwood game remains our standard.** The v1.3.6 12-region exterior is still a visually REJECTED topology test (0% art approval), and **Phase 10 is locked**. After reviewing actual screenshots, the v1.3.7 idea of repeating source-painting swatches was rejected and rolled back rather than released as an artistic improvement. A production-quality landscape/sprite atlas is still required, first for a complete Hollowreach pilot and then Greenwood. Original adventure environments and progress are unchanged.

[Art-direction correction and mandatory new asset workflow](./docs/overworld/ART_DIRECTION_RESET.md) · [Play the preserved game](https://hdog960.github.io/Vielward/) · [Real-world vs approved-source browser screenshots](https://github.com/hdog960/Vielward/actions/workflows/visual-qa.yml)

---

# VEILWARD v1.3.6 — VISUAL RECOVERY R2 (ART ACCEPTANCE STILL 0%)

**Playable visual development:** 29 physically validated fantasy village, forest, bridge and highland compositions were added on the EXISTING 12-region source map. Source-accurate rock faces now have cliff-strata shading; all seven bridges have finer wood and stone construction; normal travel no longer has the obstructive debug label. The previously accepted 48 locations, 65 roads and 7 crossings, saves, quests and original approved sprites are preserved.

[Play the new v1.3.6 Veilward build](https://hdog960.github.io/Vielward/) → Journey Menu → **Review Visual Recovery R2 (Phase 9)** → **Review World Map & All 12 In-Game Regions**. Walk Hollowreach, Greenwood, Coldpine, Northwatch and Frostbridge and inspect the original-game screenshots; the source test and browser images never substitute for the creator's visual judgment.

[Visual Recovery R2 implementation, QA and limitations](./docs/overworld/VISUAL_RECOVERY_R2.md) · [Source landmark compositions](./world_setpieces.js) · [Physical scene QA](./tests/visual_recovery_r2.test.js) · [Five actual browser screenshots](https://github.com/hdog960/Vielward/actions/workflows/visual-qa.yml).

**Phase 10 LOCKED.** This is a substantial R2 art pass, but not final 32-bit illustration acceptance. The creator's last expressed rating is 0%; all remaining art-focused R3+ revisions occur inside Phase 9 until explicit approval.

---

# VEILWARD v1.3.5 — VISUAL RECOVERY R1.1 (Creator appearance approval pending)

The first recovered renderer (v1.3.4) passed functional tests but actual browser captures still showed barren crossroads, speckled ground and oversized roads. This update produces collision-backed groves closer to travel, denser illustrated foliage and grass, far fewer scattered texture dots, and narrower roads while keeping the 12 regions, 65 road links, seven crossings, character art and local saved adventure intact. These are real game changes; **not yet approved final 32-bit illustration quality.**

**Play and compare:** [Open Veilward](https://hdog960.github.io/Vielward/) → Journey Menu → **Review Visual Recovery R1.1 (Phase 9)** → **Review World Map & All 12 In-Game Regions**. Confirm **v1.3.5**. Browser capture QA: [four actual rendered screenshots](https://github.com/hdog960/Vielward/actions/workflows/visual-qa.yml) (download job artifact). See [Visual Recovery R1–R1.1 engineering log](./docs/overworld/VISUAL_RECOVERY_R1.md).

**Phase 10 remains locked while visual acceptance is 0%.** Our original high-detail snowy and Greenwood assets remain protected as the art targets.

---

# VEILWARD v1.3.4 — VISUAL RECOVERY R1 (ART ACCEPTANCE PENDING)

The creator accepted the 12-region geometry/travel layout but explicitly rejected the Phase 9 appearance (0% visual acceptance). The latest playable build replaces part of the over-simplified 32px noise/pipe-road/empty-shape terrain renderer with world-coordinate clustered ground, narrower natural trails, visually richer climate-dependent tree/rock structures, a real footprint-anchored three-quarter cottage and 13 source-grounded landmark compositions, and a zoomed closer atlas with landmark-framed region previews. This is an **initial actual code/art change**; it is not yet a complete high-fidelity match to the approved reference JPGs.

**Review the changed game:** [Open Veilward](https://hdog960.github.io/Vielward/) → Journey Menu → **Review Visual Recovery R1 (Phase 9)** → **Review World Map & All 12 In-Game Regions**. Confirm v1.3.4; compare Hollowreach, Greenwood, Coldpine and Frostbridge in the world and by walking rather than trusting a mock concept. The other eight biomes retain map continuity.

**[R1 engineering handoff, remaining R2–R4 art tasks and truthful limitations](./docs/overworld/VISUAL_RECOVERY_R1.md)** · [Actual environment painter](./world_illustration.js) · [R1 source/regression verification](./tests/visual_recovery_r1.test.js).

**Phase 10 BLOCKED pending explicit creator acceptance.** Original adventures, progress storage, routes, bridge collision and original asset images are preserved.

---

# VEILWARD v1.3.3 — Phase 9 Review Build · FULL OVERWORLD APPEARANCE APPROVAL REQUIRED

**Phase 9 implementation:** Source-built 12-region visual atlas and a whole-world map with all 65 physical routes and seven crossings, rendered from the **actual playable world** (not conceptual illustrations). Every region has a true 160×160 terrain-art screenshot and a tap-to-visit source anchor. Graph/land-water/crossing/road collision checks, seasonal foliage, real outdoor geography and original gameplay preserved.

**iPhone Safari / Home Screen:** [Play Veilward](https://hdog960.github.io/Vielward/). Journey Menu → **Review Full Overworld (Phase 9)**, then **Review World Map & All 12 In-Game Regions**. Tap one of the twelve real-world thumbnails to jump and walk, use the map icon ◈ to reopen the atlas, and Visit Next Crossing to review all seven river/chasm traversals.

- [Phase 9 truthful playable-world handoff](./docs/overworld/PHASE9_HANDOFF.md)
- [Region-by-region in-game atlas index](./docs/overworld/PHASE9_REGION_ATLAS.md)
- [Physical/world art approval checklist](./docs/overworld/PHASE9_QA.md)
- [Full graph, shoreline/material, road lane and genuine-rendered-atlas regression tests](./tests/overworld_phase9_review.test.js)

The gold path marks the future Hollowreach → Thawline → Greenwood → Smugglers testing corridor, not a substitute for the remaining world. The original adventure, Warden Hal and approved Wanderer are unchanged. **This is an appearance-review build, not an entirely complete RPG. Development MUST STOP after Phase 9 until the creator explicitly approves the entire exterior look and map. No Phase 10 yet.**

---

# Veilward v1.3.2 — Phase 8: Real Roads, Bridges, Stairs & Island Network

**Updated playable iPhone world:** The optional continuous overworld now draws all 65 authored roads using their actual movement/collision positions; snow roads, forest tracks, switchbacks and stone stairs follow the same source geography. Five visually differentiated and physically guarded bridges, the Stoneford dry ford and Mossmere's east stone causeway are built. The island has both east/west physical entrances instead of a travel portal. Road palette follows Phase 7's gradual regional climate. Streamed terrain's water/chasm material uses the actual physical hazard mask.

**Playtest:** [Play Veilward](https://hdog960.github.io/Vielward/) → Journey Menu → **Explore Roads & Crossings (Phase 8)**. Inside the preview use **Visit Next Crossing** to inspect all seven structures, and **Visit Next Region** for 12-region roads and stairs. The original saved Hollowreach adventure remains independent.

- [Phase 8 handoff, iPhone testing and remaining limitations](./docs/overworld/PHASE8_HANDOFF.md)
- [Physical road art source and five guarded bridge structures](./world_routes.js)
- [Road network and crossing QA](./docs/overworld/PHASE8_QA.md)
- [Full crossing art/physics and iPhone version regression suite](./tests/overworld_phase8_routes.test.js)

**Next:** Phase 9 whole-outdoor navigability survey and creator appearance review build. **STOP after Phase 9 for creator's explicit approval of the full exterior landscape before Phase 10.** Full in-game visual fidelity is not certified by source-only tests.

---

# Veilward v1.3.1 — Phase 7: Climate-Blended Continuous World

**Real playable update:** A global climate sampler now connects snowy Hollowreach and Northwatch through exposed pine slopes, patchy snowmelt, damp moss and temperate Greenwood. The Mossmere shore gets moisture gradients, and high eastern Worldscar retains a frost-capable rock canopy. Existing authored pixel material families, detailed tile-level patches, and deterministic regional trees/flowers/rocks all read this common climate data; roads, terrain collision, and the original quest remain intact.

**iPhone test:** [Play Veilward](https://hdog960.github.io/Vielward/) → **Journey Menu → Explore Climate-Blended Overworld (Phase 7)**. Walk along roads across Thawline or use **Visit Next Region** to inspect all twelve anchor locations. The terrain overlay still shows real collision. Return to Hollowreach to recover the unchanged saved adventure.

- [Climate and regional weather profiles](./world_climate.js)
- [Phase 7 handoff, playtest and next-phase notes](./docs/overworld/PHASE7_HANDOFF.md)
- [Phase 7 source and creator visual acceptance matrix](./docs/overworld/PHASE7_QA.md)
- [Climate regression suite](./tests/overworld_phase7_climate.test.js)

**Phase 7 complete in source, awaiting on-device art assessment.** Phase 8 will finish detailed physical roads, bridges, stairs and island access; Phase 9 will survey and present the complete outdoor environment. **Hard stop after Phase 9 for your explicit overworld appearance approval before Phase 10.**

---

# Veilward v1.3.0 — Phase 6: Twelve-Region Outdoor Landmass

**Real playable update:** The continuous outdoor preview now uses a **single 29-point physical landmass outline** and authored environment composition across **all 12 approved regions**. It retains **65 connected roads and 7 physical crossings**, adds **13 landmark environments, 35 deliberately clear travel/hub areas**, and places region-specific trees, rocks, cairns, flowers, reeds and ruins using deterministic world coordinates. The same natural object source is used for its visible shape and collision.

**iPhone test:** [Play Veilward](https://hdog960.github.io/Vielward/) → **Journey Menu → Explore Continuous Overworld (Phase 6)**. Inside the preview use **Visit Next Region** to inspect 12 areas, or walk between them continuously. Use **Terrain Geometry Overlay** to inspect true natural collision. Return to the original Hollowreach quest without touching your saved progress.

- [Phase 6 implementation and real-device test checklist](./docs/overworld/PHASE6_HANDOFF.md)
- [Physical landmass, 12 biomes, 13 landmarks and wilderness source data](./docs/overworld/outdoor_footprint.json)
- [One-source natural solid art / movement engine](./world_footprint.js)
- [Phase 6 acceptance limitations and QA](./docs/overworld/PHASE6_QA.md)

This is **not** the finished visually approved 12-region overworld. Climate continuity, detailed 2.5D scenes, richer local landmarks and regional architectural depth come next in Phases 7–9. **The complete playable overworld appearance must be reviewed and explicitly approved after Phase 9, before Phase 10.** Approved player/Warden art and the legacy adventure save are unchanged.

---

# Veilward v1.2.9 — Phase 5 Playable Pixel-Art Terrain Preview

**Actual game update:** A new 16-material / 64-source-tile pixel-art terrain atlas now renders inside the opt-in seamless outdoor preview, composed from the actual Phase 4 collision/road/elevation data. Snow, snowmelt, forest, grass, stone, river/lake water, cliffs, bridges, tree props, lamp posts and shadowing are no longer solely flat-colored debug surfaces. The approved Wanderer and Warden sprites remain unchanged.

**How to test on iPhone:** Open [Veilward](https://hdog960.github.io/Vielward/) → **Journey Menu → Explore Pixel-Art Terrain (Phase 5 Preview)**. Inside the preview, use **Visit Next Terrain Material** to jump between Hollowreach snow, Thawline, Greenwood forest, Worldscar stone and Mossmere lake. Each stop is a real streaming-world position, but preview travel never alters your original quest/save. **Return to Hollowreach Adventure** when finished.

- [Actual in-game source material atlas and rendering](./terrain_art.js)
- [16 material signatures, variations and pixel-source manifest](./docs/overworld/TERRAIN_MATERIALS.json)
- [Pixel-art environment reference and compositing style guide](./docs/overworld/TERRAIN_ART_STYLE_GUIDE.md)
- [Phase 5 QA and 5-stop screenshot checklist](./docs/overworld/PHASE5_QA.md)
- [Completed Phase 5 → Phase 6 technical handoff](./docs/overworld/PHASE5_HANDOFF.md)

**Scope note:** This ships a functioning source-art and compositing system; it does not mean the full 12-region world has been painted to the same detail as the original background illustrations. Full location art comes in Phases 6–8, with a strict **creator appearance review after Phase 9 before Phase 10**. No separate art-only deliverable substitutes for patching the actual game.

---

# Veilward v1.2.8 — Phase 4: Real Ground, Collision and Elevation Preview

**Actual game patch deployed to the GitHub source branch.** The playable outdoor preview now loads **co-authored terrain geometry** with one source for visible floors, tree trunks, physical blockers, bridge decks, stair grades, river/chasm/lake hazards and named inspection zones. There are 7 authored floor patches, 30 grounded solids and 11 inspectable locations; 65 roads and 7 planned crossings retain continuous movement.

**On iPhone:** Open [Veilward](https://hdog960.github.io/Vielward/) → **Journey Menu → Explore Outdoor Terrain (Phase 4 Preview)**. Inside the preview, ☰ → **Terrain Geometry Overlay: ON** to inspect foot anchors, height, colliders and paths; use **✋ Inspect** near a named landmark. ☰ → **Return to Hollowreach Adventure** resumes the existing quest/save. This is a REAL gameplay engine update, but the preview's schematic terrain art is **not** yet the final rich pixel-art environment.

- [Phase 4 technical handoff / on-device checklist](./docs/overworld/PHASE4_HANDOFF.md)
- [Authoritative physical geometry source](./docs/overworld/terrain_geometry.json)
- [Phase 4 geometry QA report](./docs/overworld/PHASE4_QA.md)
- [Automated movement/collision/altitude regression](./tests/overworld_phase4_geometry.test.js)
- [Approved Phase 2 full-world master map](./docs/overworld/MASTER_MAP.svg)

**Next:** Phase 5 pixel-art terrain and compositing workflow — only upon next Continue development. **Appearance review remains mandatory after Phase 9, before Phase 10.** Existing player/Warden sprite assets and saved adventure state were not changed.

---

# Veilward v1.2.7 — Phase 3: Playable Streaming World Preview

**An actual game patch is now available.** The existing Hollowreach v1.2.6 experience remains intact, with a separate playable **Phase 3 world-streaming preview** accessible from the Journey Menu. It demonstrates continuous global walking across nearby lazy-loaded outdoor chunks, smooth camera and low-memory culling across the approved 12-region geography.

**To test on iPhone:** Open the usual Home Screen shortcut or [GitHub Pages game](https://hdog960.github.io/Vielward/), open **Journey Menu → Explore Seamless Overworld (Phase 3 Preview)**. Move with the normal iPhone joystick; use **Journey Menu → Return to Hollowreach Adventure** to resume the untouched quest and saved position. The preview uses the approved Wanderer atlas, but disables combat, NPC interaction and inventory changes to preserve your saved adventure.

- [Phase 3 implementation and QA handoff](./docs/overworld/PHASE3_HANDOFF.md)
- [Phase 3 source tests](./tests/overworld_phase3_streaming.test.js)
- [Approved 12-region outdoor blueprint](./docs/overworld/MASTER_MAP.md)

**Visual disclaimer:** The streaming preview uses TEMPORARY procedural terrain textures and schematic roads/water from the blueprint. These are NOT the approved finished detailed pixel-art environment. Actual visually coherent terrain and coauthored collision/elevation are Phase 4–8 work; the creator's explicit *appearance approval* remains due after Phase 9 before Phase 10.

---

# Veilward Overworld Rebuild — Phase 2 Complete Topology (November 5, 2026)

**Implemented in repository design assets, not game runtime.** A complete continuous outdoor planning map with **12 regions, 48 named route anchors, 65 connected walkable travel links, 7 physically designed water/chasm crossings and three independently passable Hollowreach→Greenwood options** is now source-controlled and validated. Natural snow-to-green transitions are planned across distance and elevation; cave/workshop doors remain true indoor thresholds.

- [**Open the new complete master map (SVG design schematic)**](./docs/overworld/MASTER_MAP.svg)
- [Creator-readable geography, regions, roads, crossings, elevations and route timing](./docs/overworld/MASTER_MAP.md)
- [World-coordinate JSON with all roads, polygons, paths, streams and landmarks](./docs/overworld/world_blueprint.json)
- [Phase 2 geometry / topology audit](./docs/overworld/PHASE2_TOPOLOGY_AUDIT.md)
- [Phase 3 technical handoff](./docs/overworld/PHASE2_HANDOFF.md)
- [Approved 22-phase roadmap and full-overworld visual review gate after Phase 9](./OVERWORLD_REBUILD_ROADMAP.md)

The map schematic is **not a gameplay screenshot or concept art approval request**. The actual v1.2.6 iPhone game and its sprites, scenes, saves and service worker remain unchanged during this design phase. Next, upon user request, Phase 3 implements the real global outdoor coordinate system and chunk-streaming foundation without breaking the current working game. After Phase 9 the creator reviews the complete **playable** outdoor appearance before Phase 10.

---

## Approved Continuous Overworld Rebuild — Phase 1 Audit (November 5, 2026)

The approved **22-phase** world rebuild has begun. **Phase 1 is a code-and-art audit only**: registered 34 creator issues covering all 12 pages of `Vielward.pdf`, established the visual design contract, inventoried all current scenes/NPCs/enemies/props, documented global-coordinate/save-migration rules, and pinned the approved Wanderer and Warden Hal assets. Run `npm run audit:world` for source baseline/protection assertions.

Start here:
- [All 34 screenshot/design issues and acceptance criteria](./docs/overworld/ISSUE_REGISTER.md)
- [Existing scene, NPC, enemy, object and asset inventory](./docs/overworld/ASSET_AND_RUNTIME_INVENTORY.md)
- [Screenshot-by-screenshot acceptance matrix](./docs/overworld/SCREENSHOT_ACCEPTANCE_MATRIX.md)
- [Machine-readable old scene coordinates and portals](./docs/overworld/legacy_scene_anchors.json)
- [Phase 1 completed audit and handoff](./docs/overworld/PHASE1_HANDOFF.md)
- [Locked design pillars and Phase 9 appearance review gate](./docs/overworld/WORLD_DESIGN_LOCK.md)
- [Existing local coordinates and future save migration contract](./docs/overworld/COORDINATES_AND_MIGRATION.md)
- [Approved 22-phase roadmap](./OVERWORLD_REBUILD_ROADMAP.md)

**The playable game remains v1.2.6.** Nothing in this phase edits or claims to fix runtime movement, world art, collision or NPC behavior. Next requested phase: **Phase 2 — complete terrain blueprint and physical overworld topology**, without prematurely replacing a working build. **Creator must review the complete outdoor overworld's appearance after Phase 9 before Phase 10.**

---

# Veilward v1.2.6 — Phase 5: Closed introductory quest and complete sprint regression

**Playable update implemented on GitHub:**
- Joren's missing supplies can be recovered only after accepting the quest and defeating at least one raider in the cave. The chest gives +30 gold once; Joren's hand-in gives +80 gold once and removes the quest item. The Worldscar follow-up completes at quest stage 5, even if attuned early.
- Persisted **collection flags separately from item counts**: Blueleaf nodes remain harvested after trading them to Mira, the stolen-supplies chest remains empty after delivery, defeated cave bandits stay defeated after relaunch while surviving raiders remain alive, and the Worldscar cannot grant repeated XP.
- Save migration preserves older playthroughs, including players already holding/delivering supplies; normal quest, level, weapons, gold and herb inventory survive the upgrade. Reset starts a genuinely fresh playable state with all world pickups restored.
- Improved Journal status, guarded-chest instructions, Joren dialogue, finished quest feedback, and shop duplicate purchase prevention.
- Versioned Home Screen app update \`v1.2.6\` and new \`quest.js\` loaded before game code; existing player/Warden art assets, winter/forest/cave backgrounds, original save key and combat logic untouched.
- **Verified in automated simulated QA:** [Phase 5 test suite](./tests/phase5_quest.test.js) 92 assertions. Reran [Phase 3 map traversal](./tests/phase3_scene_geometry.test.js) 1,319 assertions and [Phase 4 combat](./tests/phase4_combat.test.js) 100 assertions. All **1,511** code-level assertions passed. Actual iPhone/screenshot acceptance is still pending.
- Test all three suites with \`npm test\` (no runtime dependencies).

**Sprint summary:** All five planned implementation phases are complete, but **Gate 1 art approval and real iPhone playtest are NOT complete**. Further development awaits the creator's evaluation, not automatic Phase 6.

[Detailed Phase 5 regression and iPhone checklist](./tests/phase5_quest_qa.md)

---

# Veilward v1.2.5 — Phase 4: Responsive, readable combat

**New playable-game combat improvements:**
- Dedicated `combat.js` rule engine implementing a properly aimed 88-unit forward sword cone. The old sword could hit enemies behind/beside the player and through scenery; it now respects the exact eight-direction Wanderer facing and actual painted terrain collisions.
- Spell aim selects only visible nearby foes inside a forward ~70° half-angle; a closer enemy at 90° no longer redirects the spell sideways. Fireballs stop on wall/cliff boundaries instead of sailing through rocks.
- All three active foes (wolves, bandits, wraiths) now give readable, differently timed **ground wedge windup warnings** and use distinct attack damage/range/cooldown profiles. Telegraph aim freezes at warning start, so sidestepping/dodging can avoid hits. Sword and spell staggers cancel attacks instead of allowing stunned foes to still strike.
- Enemy health bars are positioned above illustrated heads, not across the bodies; resource bars and ability controls visibly indicate low stamina, low mana and cooldowns. Touch action behavior from Phase 2 is preserved.
- Accurate sword damage numbers include equipment bonuses; diagonal dodges travel at normalized speed.
- **Protected assets:** approved Wanderer eight-direction sprite, Warden Hal's original independent image, all zone art. Original save key `veilward-hollowreach-v01` and quest state remain intact.
- **Verified in simulated Node QA:** [tests/phase4_combat.test.js](./tests/phase4_combat.test.js), 99 assertions passed. Real physical iPhone combat appearance/feel is not yet verified.
- Updated game/visual/UI/source and installed-app worker to `v1.2.5` with versioned assets. **Phase 5 remains NOT STARTED.**

Detailed acceptance instructions: [tests/phase4_combat_qa.md](./tests/phase4_combat_qa.md).

---

# Veilward v1.2.4 — Phase 3 completely rebuilt against actual screenshot evidence

The v1.2.3 world-traversal pass failed visual acceptance. Its connected-region tests did not ensure that walkable polygons coincided with the actual scenery. The Wanderer was shown on **river water**, a **shrine fence**, a **bridge railing**, and a **cave lantern post**. These were real environment/collision bugs.

**The v1.2.4 playable update addresses these four screenshots in the game code:**

- Replaced all three outdoor/dungeon walkable meshes with **image-native 900×584 floor and obstruction polygons**. The village's outdated 707×530 coordinate transform (the main cause of the misplaced river/bridge polygons) has been removed.
- Gave narrow, foot-safe bridge decking and actual no-walk rails, posts, stone plinths, cliff faces, river regions and water channels. All three scenic zones retain connected gameplay routes.
- Relocated the **Greenwood Trail marker** to the village's snowy southwest road and the **cave return marker** to the left end of the bridge; placed village return on open snow rather than a bridge post. Both sides of portal travel are now visually coherent and safe.
- Moved Mira, Eldric, noticepost, one Blueleaf pickup, and a wraith out of visually inaccessible locations. NPC interactions and all quest completion rules preserved.
- Updated old-save navigation schema to 6 without resetting the user's position when it remains legal; forbidden river/fence saves auto-relocate to the closest available safe walkable ground.
- Bandit visual now uses the existing distinct olive-armored raider, not a third red-scarfed hero. **Player Wanderer source art, player animations, Warden Hal authored portrait/sprite, save key, quest data and player combat math were NOT changed.**
- Upgraded `game.js?v=16`, `navigation.js?v=9`, `visual.js?v=31`, `manifest.webmanifest?v=124`, `?art=21`, and service-worker cache `veilward-hollowreach-v124-painted-ground-geometry`.

**Verification:** `node tests/phase3_scene_geometry.test.js` is now a durable, runnable regression suite with **1,319 assertions and 10 complete path replays (612 motion segments)**, including positive and prohibited screenshot-matched coordinates and stale-save recovery. Tests pass in a simulated execution of the committed JavaScript modules. **Real iPhone rendering and movement approval remains pending**; we are not claiming the painted depth-order quality is fully signed off.

**Status:** Repeated Phase 3 only. **Phase 4 is not started.** Full details: [Phase 3 redo QA](./tests/phase3_redo_qa.md).

---

# Veilward v1.2.3 — Hollowreach polish sprint: Phase 3

**Playable-world changes pushed to GitHub:**
- Reopened the **upper Smuggler's Hollow shrine** by correcting the overly broad stone-pylon collider. Cave arrival, stolen supplies, both cave exits and the shrine now share the same walkable network; no new walk-through-void shortcut was added.
- Moved cave → Greenwood return spawn to `1520,720` and Greenwood → village return spawn to `960,925`, avoiding instant re-entry into the portal while keeping painted ground underfoot.
- Added a short post-travel portal cooldown, queued destination-image loading (no overlapping requests), and a safe joystick reset on travel.
- Unified save-spawn safety with the actual player radius (8 units) and added gentle floor-level route/arrival lighting that stays behind character sprites.
- All scene JPGs and **both approved hero/NPC sprite assets are unchanged**. Village, forest and cave game images remain their authored painted backgrounds.
- Bumped navigation/visual/game and service-worker cache to `v1.2.3`; no save-key migration or quest reset.

**Verification:** All three zone collision regions connected; all 15 listed destination/objective anchors walkable and graph-connected; seven 8-radius `projectMotion` route replays including the formerly inaccessible shrine passed without stuck steps. Rendered glow initialization smoke tests passed. Real iPhone playtest pending; bridge-rail occlusion and hand-drawn foreground depth should still be visually reviewed on the device, not falsely declared perfect.

[Detailed Phase 3 traversal QA](./tests/phase3_traversal_qa.md). Next on user's command: Phase 4 — combat feel/fairness. Phase 4 not started.

---

# Veilward v1.2.2 — Hollowreach polish sprint: Phase 2

**Actual playable-game improvements (iPhone controls + Home Screen reliability):**
- Lock joystick control to one pointer; other thumb can freely press action buttons. Release on pointerup/cancel/lostpointercapture, blur, pause, inventory, dialogue, and app background.
- Trigger touch actions on press, suppress followup synthetic duplicate click, keep mouse/keyboard clicks.
- Choose nearest interactable by physical distance (slightly de-prioritize portal/hound) to favor the NPC being approached.
- Autosave when the app backgrounds or navigates. Restart on service-worker update only once per version and check for updates on load, resume, and focus.
- Fix offline Home Screen reloads with versioned launch URLs; keep HTML/JS network-first and assets offline-cached.
- Surface live running **v1.2.2** in Journey Menu, improve narrow-landscape safe area/HUD fit and modal scrolling.
- Protected the approved Wanderer sprite atlas, Warden Hal art, all hero animation selection, player physics/combat tick, inventory/quest data, and `veilward-hollowreach-v01` save key.
- **Synthetic QA passed** (touch 10, targeting 6, SW activation/offline); device-level iPhone testing is pending. Phase 3 not started.

**Full checklist:** [tests/phase2_mobile_qa.md](./tests/phase2_mobile_qa.md). **Next:** Phase 3 — traversal & environment cohesion, only after user says continue.

---

# Veilward v1.2.1 — Hollowreach polish sprint: Phase 1

**Implemented and tested (simulated Canvas):**
- Added transparent-alpha footprint measurement for the 10 existing NPC/enemy atlas cells and Warden Hal's separate authored `assets/warden_hal_v13.png`. NPCs now use their **own measured transparent sole padding** to place feet on the navigation ground consistently rather than a one-size-fits-all offset.
- Corrected floating NPC name labels: only the currently interactable NPC displays an in-world name; it is placed above the **measured** visible head, drawn after all actors so depth-sorted sprites don't cover it, and clamped within the landscape camera. The old hard-coded y-96 Warden label bisected his head.
- Warden Hal source `192×176` alpha bbox `(32,11,160,170)` confirmed; foot margin `6px`. No edits to his dedicated art file.
- **Approved Wanderer source, the eight-direction animation-selection/render branch, player navigation and movement, NPC interactions, game saves and quests are unchanged.**
- Bumped `visual.js?v=28`, `game.js?v=13`, asset `?art=18` and service worker `veilward-hollowreach-v121-character-grounding` to propagate through iOS Home Screen installation.

**QA:** All modified JavaScript passed syntax checks. Mock-canvas alpha tests checked 10 cell measurements and 6 grounded NPC roles: all feet landed within 0.5 world unit of their target; Warden label plate ends 7.2 world units above the detected top of his head. Actual iPhone screenshot inspection is **pending the user's next test**. Bridge-rail foreground occlusion remains a known later art/depth task.

**Sprint:** Phase 1 complete in code; **stop here**, do not proceed to Phase 2 before "Continue development".

---

# ACTIVE DEVELOPMENT PLAN — Two-hour Hollowreach polish sprint

Five sequential, testable phases totaling **120 minutes planned effort** (acceptable 90–150). One entire phase per user **"continue development"** message; patch the actual game, verify the GitHub commit, then stop for feedback. **Phase 1 has not begun.** See [TWO_HOUR_SLICE_ROADMAP.md](./TWO_HOUR_SLICE_ROADMAP.md) for phase requirements and acceptance checks. The existing long-term [PROTOTYPE_ROADMAP.md](./PROTOTYPE_ROADMAP.md) stays in force.

---

# Veilward v1.2.0 — Warden Hal rebuilt as his own character (November 4, 2026)

**Actual game asset rebuild.** The screenshot with Warden Hal's still-squared hair prompted a full replacement instead of another hair/armor color filter.

- New original transparent sprite `assets/warden_hal_v13.png` (192×176 pixels) with a middle-aged bearded Warden, tightly pulled-back dark hair/topknot, fur-lined navy-blue commander cloak, gold clasp, engraved blue tabard, layered brown-metal armor and a substantial sword. Distinct body, face, clothes, hair and weapon silhouette from the younger brown-haired Wanderer.
- Warden is now **loaded as its own file** in `visual.js`. The original `createWardenVariant()` painted/recolored guard routine has been completely deleted. He does not share a hero frame, reuse a player pose, or use an overpainted NPC swordfighter.
- Warden ground foot anchoring adjusted by six source pixels; existing character layering and shadow kept.
- **Player untouched**: no changes to hero sprite file or its rendering branches, movement, attack controls, HP, quest, game saves or navigation.
- PWA bumped to version 1.2.0 and cache `veilward-hollowreach-v120-warden-original`; Safari and Home Screen assets use versioned URLs. UI pause panel version updated.
- Source art is extracted and reworked from an original Warden Hal-specific RPG scene created for this revision, not from the Wanderer or old guard cell. Dedicated sprite has transparent cutout.

**QA:** reviewed cropped sprite and source alpha; JavaScript syntax and source wiring checked. Real Safari/iPhone visual verification is the player's next playtest.

---
# REQUIRED WORKFLOW — READ BEFORE DEVELOPING

**Patching the real, playable game after each user feedback report is a REQUIREMENT, not an authorization or suggestion.** The user tests → the assistant patches the GitHub game → the user retests. Do not send plans, diagnostics, or standalone art instead of an update. See [AGENTS.md](./AGENTS.md) for the mandatory, persistent operational contract and the outstanding Warden Hal work order.

---

# Veilward v1.1.3 — Real Home Screen patch and Warden repair

- The previous assistant incorrectly asserted GitHub access was unavailable instead of checking; this release contains an actual commit.
- **iOS Home Screen update:** new registration checks updates on app load, on visibility return and when returning from background; `updateViaCache:"none"` bypasses cached service-worker script; controller changes reload once per build. The new worker removes older caches and attempts to navigate already-open old clients on activation. JavaScript/HTML are fetched with `cache:"no-store"`, while scenes and sprites retain offline caching.
- **Warden only:** removed arbitrary rectangular recoloring boundaries, changed to per-pixel hair/clothing classification, and cropped hair tips toward a short ash-gray military style instead of the original spiky Wanderer hair. No box helmet, shield icon, or hard-edged hair overlay. This is a conservative repair using existing textured art, not a claim of a completely new hand-drawn NPC.
- The **approved player sprite atlas** and all player movement and collision routines remain unchanged; same local save key.
- Manual iPhone Home Screen testing remains required; service-worker updates can only propagate once the device checks online.

---
# Veilward 1.1.2 — Warden Hal art repair (Nov 4, 2026)

The user found that the prior guard 'helmet' looked like a giant pixel crate/chest rather than a human head. Root cause: code was using broad hard-edged Canvas rectangles, clipping the artist-authored hair and covering the face with a box-shaped overlay, then adding an oversimplified icon shield. This violates Veilward's authored-pixel-art requirements.

**Implemented, not a mockup:**
- Deleted the entire fake block helmet, geometric visor and icon shield renderer.
- Preserved the original fully illustrated 192×176 NPC atlas guard, including expressive face, natural hair, detailed armor and sword, with transparent silhouette.
- Applied source-pixel color remapping only: silver/ash hair; midnight-blue and cold-steel clothing/armor, preserving each pixel's inherent shading and contours. Hal remains distinguishable from the red-scarfed player without flat icon elements.
- Removed the ungrounded Warden vertical sprite offset; all NPCs keep consistent foot anchoring.
- Bumped visual.js and PWA cache/asset versions while preserving existing saves and game logic.

**Still required:** visual approval on the iPhone. This corrective patch does not claim that the warden art has reached the final art-quality gate.

---

# Veilward v1.1.1 — iPhone playtest corrections (November 4, 2026)

- **Boot contact:** The approved 32-frame hero sheet has 12px transparent bottom padding per 180px cell. The renderer now offsets all eight facings by 10 world units so the visible boots actually touch the navigation/ground anchor instead of floating above it.
- **Shadow:** The wide detached shadow was reduced to a tight, lower-profile contact shadow centered on that same world anchor. The world-space collider and movement code remain untouched.
- **Warden Hal:** NPC atlas index 3 was essentially a clone of the hero (same red scarf, brown hair, armor and sword). Its displayed sprite is now turned into a distinct dark-blue armored village warden with a closed segmented steel helmet, slit visor, gold trim and kite shield. The transformation runs only once after the existing NPC atlas loads; other NPC art is unchanged. This is part of the real Canvas actor renderer, not an art-only illustration.
- **PWA:** New query strings, script version and offline cache key. Same save key and quest state.

Simulated renderer checks are expected; actual iPhone review remains the visual acceptance test.

---

# Veilward — v1.1.0 approved unified eight-direction character (November 4, 2026)

The creator approved the newly rendered 8-row × 4-column hero spritesheet and required that it be integrated into the playable game, not supplied as a detached illustration.

**Actual game implementation**
- Added `assets/hero_approved_8way_v12.webp`: the approved hero artwork converted into 32 aligned sprite cells. Rows S, SE, E, NE, N, NW, W, SW; columns idle, three distinct walk poses.
- Removed the mixed-art south-facing override when the new atlas loads. **All eight directions use the same source artwork, armor, face proportions, scarf and sword.**
- Player keeps the same `150×154` game-world rendering bounds and common foot anchor while turning. Walk animation uses distance actually traveled to choose real authored frames.
- Preserved original mobile controls, game logic, combat effects, interaction, collision, saves, quests, and NPCs. The old 136-frame sprite atlas and supplemental front strip remain strictly as an offline fallback when the new asset fails.
- Advanced `visual.js`, sprite asset query, and service worker cache versions to force iPhone PWA updates.

**Limits:** This sheet includes 8 directions × (1 idle + 3 walk frames); dedicated directional combat, cast, damage, and dodge poses have **not** been authored in the new sheet. Existing gameplay effects work, but a fully independent combat atlas is still a future art gate. No physical iPhone frame-by-frame verification yet.

**Verification:** Sprite normalization produces 32 nonempty cells; browser canvas drawing coordinates, directions and animation indices are checked in a simulated runtime. The user must approve actual updated iPhone gameplay screenshots before we claim final 10/10 art signoff.

---

# Veilward — v1.0.2 hero age/proportion correction (November 4, 2026)

The November 4 mobile screenshots showed a juvenile-looking, swordless hero facing south/down, while left/right showed an adult armored wanderer. **The original 136-cell atlas is real, but the south row is not visually consistent with the side rows.**

- Added a separate **three-pose adult south-facing sprite strip** (`assets/hero_front_adult_v11.png`). It includes an idle, left stride and right stride, with the adult's full armor, red scarf, sword, boots and fixed ground anchor. It replaces the problematic south row at render time for movement, stationary facing and short action poses. Other seven directions continue to use the existing full atlas.
- Kept consistent on-screen hero dimensions (`150 × 154` world units) and foot position **for all directions**, with no intentional shrink/stretch when direction changes. Actual world-distance animation is unchanged.
- Replaced stray blue-dot cast cells (in the inherited atlas) with a clean pose pending a dedicated combat atlas. **This is not a complete redrawing of all eight directional attack animations.**
- Bumped visual assets and offline worker versions so iPhone home-screen users receive the artwork on a refreshed load. Saves, world terrain and quest progression are unchanged.
- Source art: a newly authored adult-forward 3-frame strip. The original `assets/hero_full_8way_v10.png` remains in use for the other directions. The supplemental strip is a temporary art-correction until all 8 facings have equally polished, independently animated frame sequences.

**Validation:** Asset layout and renderer wiring reviewed, cache dependencies enumerated. Physical iPhone/animation playtesting still requires creator verification. No gate or broader roadmap is declared complete.

---

# Veilward — v1.0 Complete Hero Sprite Sheet

The Wanderer now uses a real **8-row × 17-column sprite atlas**, not generated torso rectangles painted on top of front-facing sprites.

- 8 direction slots with a full 136-frame atlas: S, SE, E, NE, N, NW, W, SW.
- Dedicated artwork for the front, actual rear and side views; mirrored/nearest-angle views are used for some diagonal slots.
- Frame groups: idle (1), walk (6), run (4), sword attack (3), cast (2), dodge (1) for each direction.
- The new renderer draws complete frame cells directly, with animation driven by world movement distance, facing, and action state.
- All frames have transparent surrounding space and keep a common ground anchor. No ad-hoc removal of legs or old generated blue square backplate.
- Physical iPhone quality control still needed; this is the first complete sprite atlas, not a promise of final polished 8-angle hand-drawn animation.

Source: `assets/hero_full_8way_v10.png`. Frame-layout documentation: `assets/hero_full_8way_v10.json`.

---

## v0.8 — Directional walking (November 3, 2026)

## v0.9 — Rear-facing character animation correction

The prior v0.8 back-facing animation was procedurally painted over the front sprite with an angular brown hair silhouette and a rectangular blue armor plate. That shortcut is removed. The game now loads a separately authored, transparent six-pose rear-view sprite sheet at `assets/hero_back_strides_v09.webp`, retaining textured hair, fitted plated armor, crossed leather straps, and the scarf. Rear sprites are drawn only when moving north; the other directions keep their established artwork.

Walking timing now advances approximately 9 frames per second instead of one pose per second. The iPhone service-worker cache is versioned to v0.9; existing saves and quest progress are unaffected.

Verified in a simulated game runtime: 103 rendered player frames, both front and rear rows, all six rear walk frames, uninterrupted scene rendering, successful save. Not yet confirmed on a physical iPhone.

---

- Fixed the stationary/sliding player: a cached **four-direction, six-frame animation** is generated from the complete v0.7 hero artwork.
- Walking **up shows the back** of the character; down shows the front, and left/right face in the correct directions. Direction follows keyboard or touch joystick movement.
- Legs alternate during walking while keeping full-body pixels and consistent foot anchoring; no earlier cropped animation cells are reused.
- Animation advances based on real distance traveled, rather than elapsed time or merely holding a direction while blocked.
- Character immediately returns to the correct directional idle pose after stopping, and existing quest/progression saves remain compatible.
- All four directions, idle, menus, combat controls, animation construction, and 24 cached frame renders passed simulated game-runtime smoke checks.

**Scope:** Only movement presentation was addressed in this pass. Other NPCs currently remain mostly static; deeper directional combat animations and modular environment art are future refinement work. Physical iPhone screenshots have not yet been verified.

---

# Veilward — Hollowreach v0.6.2

## Artifact repair update

This release directly addresses the defects reported in the November 3 playtest screenshots.

- **Blue crystalline creature removed:** Replaced the baked-in creature from the original golden-reference village background with reconstructed matching snow texture. It is no longer a static ghost image behind the player.
- **Live actor masks rebuilt:** Hero, Warden, Joren, hunter, innkeeper, and enemies are drawn from tightly cropped transparent sprite silhouettes instead of wide atlas boxes containing leftover flowers, snow and ground debris.
- **Warden's snow-strip issue:** Removed separate disconnected atlas components under boots (including ground-like rectangular and horizontal streaks). The renderer creates its own soft radial shadows.
- **Friendly village hound:** Replaced the damaged wild-wolf sprite used for Ash with a separate clean seated husky sprite, cut out without the original snow background.
- **Animation and scale:** Aligned actor foot positions at a consistent baseline and improved source cropping so sprites occupy their actual body bounds.
- **Old saves retained:** No changes to localStorage save key or quest state and no required save reset.
- **iPhone cache:** Versioned visual.js and service-worker cache keys so Home Screen installations can refresh the new imagery.

### Verified before commit
- Programmatic browser-runtime simulation passed startup, movement, attacks, casting, saving, Joren dialogue, Warden dialogue, Ash interaction and travel to Greenwood.
- Every file referenced by the new game and offline service worker was verified in GitHub.
- Isolated sprite masks and the replacement snow area were visually inspected from the source assets.

### Remaining design limitations
This is a significant **asset-cleanup pass**, not the full graphical completion milestone. The village is still a single illustrated background plate instead of individually layered, animated pixel tiles; advanced animation sets, natural NPC schedules and full environmental occlusion remain pending. A physical iPhone and live GitHub Pages rendering test were not available from this chat session. Do not claim those tests occurred.

### Repository
`hdog960/Vielward` on branch `main`, published through the user's GitHub Pages configuration.

---

## Previous release notes

# Veilward — v0.5 clean scene reset

This commit is a **real game update**, not a concept-art deliverable.

### Improvements
- Replaced the damaged old Frostbound Village backdrop with a clean, small
  Frostbridge Outpost scene drawn directly from the project's golden visual
  reference; two baked-in human figures were removed. No oval-snow patches,
  floating cut-out trees or disconnected forge scene composites are part of
  this new village background.
- Rebuilt the active character atlas with normalized full-body sprites,
  consistent pivots/feet, removed loose visual artifacts, and replaced broken
  cast/dodge frames with intact poses (dedicated directional animations remain
  a later production requirement).
- Created a new scene-specific navigation mesh for cottage steps, courtyard,
  shrine stairway, wooden bridge and snowy exit trail.
- Repositioned real Joren, Warden Hal, Mira, Eldric, Ash and interaction points
  onto visible paths. The old standalone forge remains retired.
- Migrates existing character saves and preserves quest, XP, equipment and gold.
  Former forge interior saves return to the outdoor outpost.
- Increased the service-worker cache version for iPhone Home Screen installs.

### Verified in programmatic gameplay checks
New-game start, v0.4 save migration, retired forge migration, dialogue with
Joren, supply quest hand-in, travel from Frostbridge to Greenwood, and return
from Greenwood. All destination foot positions are on legal walkable terrain.

### Remaining limitations (do not misrepresent as finished)
The new Frostbridge scene is **an edited image derived from the creator-supplied
golden reference**, temporarily used to validate look, proportions, navigation
and UI. It is still a single scene image, not a licensed or original modular
tile system with independent props, occlusion and fully animated creatures.
Before the prototype is approved for wider public release, replace this
reference-derived plate with fully original authorized game art. Outdoor
crafting still needs a proper interactive set of modular forge props.
There has been no physical iPhone performance test of this build.

---

# VEILWARD: THE BROKEN SKY

## Hollowreach v0.4 — Live NPCs, cleaner environments, consistent forge, zoomed-out camera

The creator's approved pixel-art scenes are now represented by **character-free playable scene plates** in the winter village, Greenwood forest, and cave. Visible quest NPCs are rendered as separate interactive sprite actors in front of the scenery instead of being painted-in nonfunctional humans.

### Changes in v0.4
- Painted-in people and enemy figures removed from the three active scene backgrounds, and replaced with live sprites. Some artwork cleanup remains imperfect around formerly occupied scenery.
- Player rendering uses complete idle and walk sprite cells rather than the broken/cropped attack and cast cells. Combat and spell effects are still generated dynamically.
- World camera zoom = **0.78** (22% farther out); HUD stays full size for iPhone readability.
- Joren's **visible outdoor blacksmith stand is the real forge**: talk to him there to begin/complete the quest and access his shop. The inconsistent portal beside a villager has been removed.
- Legacy saves trapped in the separate unused forge interior are safely relocated to the village without deleting character progress.
- Added a live friendly village hound, with petting interaction.
- Kept authored walkable boundaries, transitions, combat, inventory, and saving from v0.3.1. Bumped asset and service-worker versions to prevent stale iPhone Home Screen builds.

### QA
JavaScript runtime simulations: eight passes covering fresh start, older forge save, speaking to Joren, turning in stolen supplies, petting the hound, eastern travel, cave entry, and quest-item retrieval. All tests rendered the zoomed camera and live actors without script exceptions. A physical iPhone graphics and touch playtest has not been independently completed.

### Outstanding work
- The cleaned images contain occasional reconstructed texture patches; long-term art needs true layered tiles/occlusion and consistent terrain geometry.
- Only complete idle/walk poses are enabled for the player; full directional attack, spell, and dodge animation atlases need to be authored without cropped frames.
- The standalone illustrated forge interior is temporarily inaccessible because the available exterior has no architecturally matching entrance. It can return when we build one that makes sense.
- Not yet the approved finished vertical slice.

---



## Hollowreach — live prototype v0.3.1 (navigation and interaction repair)

This release is the **gameplay repair pass** following the illustrated visual overhaul. It uses authored walkable-ground polygons for the four illustrated scenes rather than allowing free movement anywhere in the painted backgrounds. The same collision geometry is used for the player, dodges, and enemy movement.

### Fixed in v0.3.1
- Prevent walking on the forge workbench, snow-covered roofs, stone cliff edges, streams, and other painted non-floor areas.
- Make village blacksmith entry, forge exit, forest bridge travel, cave entry/exit and caravan supply pickup accessible with **Talk/E**, without surprise automatic teleports.
- Stop drawing duplicate NPC character sprites over NPCs already present in illustrated scenes; retain their live dialogues.
- Reposition unreachable quest/NPC/interaction anchors and wolves/wraiths onto valid ground.
- Migrate old saves that loaded inside walls or on tables to the nearest walkable ground without wiping progress.
- Add reliable art loading fallback, explicit versioned assets and refreshed offline cache.
- Debug navigation in-game with `?debugNav=1` appended to the site URL.

### Testing notes
Simulated mobile-canvas runtime checks passed for new/old saves, forge access, speaking with Joren, world transitions, and cave supply recovery. Programmatic route searches verify traversability of the first quests and all location exits at player collision radius. Actual physical iPhone playtesting and end-to-end user approval are still outstanding.

### Important visual limitation
The beautiful environment images are currently **illustrated scene plates**—not fully modular layered tilemaps. Actors and interactive markers are live over those plates, while some background figures are not animated. This repair prevents major walk-through and duplicated-actor problems but is not the fully finished Skyrim-scale RPG.

---



**Hosted through the user's GitHub Pages repository:** https://hdog960.github.io/Vielward/

This release replaces the previous procedural-looking play areas with actual illustrated Hollowreach, Greenwood, forge and cave scenes based on the approved concept direction. It also introduces alpha-cutout character animation/action poses, a richer HUD, ambient light glows, new area and interior placement, and versioned cache refresh. It is a genuine interactive browser build; the scenes and actors are rendered in the real game Canvas and existing mechanics still operate.

### What is playable
- Four connected areas: winter village, green forest, illustrated blacksmith interior and ancient cave.
- iPhone landscape touch joystick, attack, spell, dodge, interaction, potions; WASD/keyboard option.
- Blacksmith quest and missing supplies, inn rest/merchants, gathering, enemy encounters, journal, gold, experience and local saves.
- Direction and quest updates as player travels between scenes.
- No paid game engine, Vercel, backend, API, or account requirement.

### Controls
On iPhone Safari, rotate to landscape; use left thumb joystick and the right-hand action circles. Keyboard: WASD/arrow keys move, E/F interact, Space/J attack, Q/K spell, Shift dodge, I inventory, H potion.

### Art implementation and limits
The current visuals are **illustrated static scene plates with movable foreground characters**, not yet a world assembled from collision-aware modular tiles. Background villagers and environmental effects painted into the source scenes are not independently simulated characters. The player and several NPC/enemy actors are separate transparent sprites and can be animated or interacted with as game logic permits. The hero atlas currently reuses distinct attack/cast/dodge poses; a true direction-based frame-by-frame sprite animation system is still outstanding.

The art quality gate remains open; future passes will need full tileability, correct roof/cliff occlusion, animated rivers/fire, improved hitboxes, independent props and actors, detailed interiors, camera and UI QA on physical iPhone. Never claim the game matches the final screenshot quality until the creator approves actual gameplay screenshots. See ART_DIRECTION.md and PROTOTYPE_ROADMAP.md for acceptance criteria.

### GitHub Pages
For the repository `hdog960/Vielward`, Pages should serve `main` from `/(root)`. After publishing, open https://hdog960.github.io/Vielward/. The in-game game title is `Veilward`; repository spelling is `Vielward`.

### Cache notes
The service worker uses network-first caching and v0.2.1 cache names. Online users should receive the updated build on the next load. If an installed home-screen copy shows old artwork, fully close and reopen once while online (or visit the Pages URL in Safari).

## Status
Graphics update committed. Basic runtime interaction and save tests passed in code-level simulations; final device screenshots, touch testing and full level playthrough are not yet independently verified.
