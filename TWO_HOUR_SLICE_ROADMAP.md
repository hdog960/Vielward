# VEILWARD — 2-HOUR HOLLOWREACH POLISH ROADMAP

**Status:** APPROVED FOR SEQUENTIAL EXECUTION WHEN USER SAYS "CONTINUE DEVELOPMENT"  
**Baseline:** Playable Veilward v1.2.0 (Warden Hal dedicated NPC sprite)  
**Effort budget:** 120 minutes targeted; acceptable 90–150 minutes total  
**Phase protocol:** Exactly **ONE complete phase per "continue development"** message. Stop after pushing and verifying that phase's commit. Do not automatically proceed to the next phase. User testing/revisions take priority before advancing.  
**Scope:** Improve the existing playable vertical slice, not expand into a full-game roadmap. Existing canonical `PROTOTYPE_ROADMAP.md`, `ART_DIRECTION.md`, `ART_BENCHMARK.md` and `AGENTS.md` remain authoritative.

## Phases and acceptance criteria

### Phase 1 — Character & village visual integrity (25-minute target)
**Status: IMPLEMENTED — code/simulation QA passed; iPhone visual approval pending**
- Inspect the newly built Warden Hal sprite in actual scene context, including natural transparency, proportions, grounding and silhouette. Correct issues only if observed.
- Review the main cast for NPC scale, contact shadows, depth ordering, clipping into bridges/cliffs, interactions and text labels.
- Adjust obvious village-specific visual inconsistencies while preserving the gold-reference scene.
- **Protect:** the approved 32-frame eight-direction Wanderer asset, its movement logic and world positioning.
- **Acceptance:** No glaring misplaced character sprites, hovering feet, box-like art artifacts, unreadable NPC labels or obvious scene layering issues in tested village views.

### Phase 2 — iPhone controls and installed-app reliability (20-minute target)
**Status: IMPLEMENTED — automated QA passed; iPhone Home Screen verification pending**
- Audit current install/update path: GitHub Pages cache versions, service-worker registration, stale Home Screen clients, resume/reload loop safety.
- Make the running build version visible in the pause menu for accurate user verification.
- Check landscape joystick controls, attack/spell/dodge/potion/talk target priority, accidental scrolling, safe-area handling and click/touch overlap.
- **Acceptance:** New build can be identified in the app; no observed code-level update loop; saves persist; directional movement and actions work in simulated or available device tests. Real device confirmation remains user-owned.

### Phase 3 — Traversal and cross-biome environmental coherence (30-minute target)
**Status: REBUILT v1.2.4 — screenshot-specific photo/nav checks and 10 route replays passed; iPhone visual approval pending**
- Walk through the current village → Greenwood → Smuggler's Hollow navigation/transition code and backtracking.
- Fix unsafe spawn points, stuck spots, invisible barriers, portal targeting/range, confusing exits and conspicuous image-to-collision disagreements.
- Refine visibly inconsistent snow/forest/cave visual density, layering and landmarks with small, **implemented** art improvements (not screenshot-only mockups).
- **Acceptance:** Reach and return from all three zones, with understandable travel points, no known progression-blocking collision, and coherent scene framing.

### Phase 4 — Combat responsiveness and fairness (25-minute target)
**Status: IMPLEMENTED v1.2.5 — 99 automated combat checks passed; iPhone playtest pending**
- Polish existing sword hits, player direction handling, attack range feedback, hit reaction, spell/dodge activation, stamina/mana readability and enemy HP.
- Inspect current wolves/bandits/wraiths for premature off-screen attacks, unclear telegraphs, unreachable targets and damage timing.
- Keep this a **polish pass on working systems**; do not falsely claim the separate later Gate 2 systems (bow, shield, 3 spells, elite enemies) are complete.
- **Acceptance:** Existing encounters offer readable warnings, consistent damage and responsive controls with no obvious unfair instant hits or missing action feedback.

### Phase 5 — Introductory quest closure and regression QA (20-minute target)
**Status: NOT STARTED — STOP until user's next continuation**
- Test the actual route from meeting Joren, exploring Greenwood and the bandit cave, retrieving supplies, returning the items and earning rewards.
- Fix observed quest state, NPC dialogue, inventory, loot/reward and save/reload defects; check progression after returning from a zone.
- Run syntax and relevant automated/simulated regression checks for all changed files. Verify assets referenced by service worker and HTML; report device-specific items honestly.
- **Acceptance:** Introductory loop is completable with working progression and consistent saves, with a concise list of remaining Gate 1 art-signoff gaps.

## Time allocation

| Phase | Minutes | Running total |
|---|---:|---:|
| 1. Character & village polish | 25 | 25 |
| 2. iPhone/mobile reliability | 20 | 45 |
| 3. World traversal & cohesion | 30 | 75 |
| 4. Combat feel & fairness | 25 | 100 |
| 5. Quest completion & QA | 20 | 120 |

**All estimates are work-planning budgets, not elapsed-time guarantees or permission to do work in the background.** Each phase is executed only when the user supplies a continuation instruction.

## Every phase must deliver

1. Inspect latest main branch, relevant project requirements and any new user test feedback.
2. Implement phase changes in the **actual playable game** (not as plans or standalone images).
3. Preserve saves, important existing systems and the approved Wanderer art unless explicitly requested otherwise.
4. Test syntax, rendering/collision or gameplay as appropriate and identify what cannot be checked without the user's iPhone.
5. Bump relevant build, JavaScript and service-worker asset versions; ensure Home Screen update path is considered.
6. Commit/push to GitHub, verify the remote head and report the exact commit.
7. Return the playable URL: https://hdog960.github.io/Vielward/.
8. **STOP** and wait for the user to say "continue development" for the next phase.

## Completion and scope boundaries

This two-hour roadmap is a **focused improvement sprint**, not a claim that the complete Hollowreach vertical slice or the full Gate 1–6 roadmap can be completed in two hours. After phase 5, ask for the creator's assessment and prepare the next roadmap only on request. Creator sign-off remains required for the art gate.


## Phase 1 implementation record (November 4, 2026)
- Warden and standard NPCs use alpha-measured sprite bounds for foot alignment. All measurements happen once when the artist-authored assets load, never inside the animation loop.
- One focused nameplate appears **above** the actual visible actor's hair rather than the hard-coded y-96 position that previously bisected Warden Hal's head; handles camera viewport edges.
- Synthetic canvas tests validated 10 alpha-cell scans, six NPC contact anchors within 0.5 world unit of ground, the Warden's 7.2-world-unit label gap, and unchanged protected hero draw branch.
- Preserved character asset files, approved Wanderer animations, the save key, and all quest/interactions; PWA/HTML asset references advanced to v1.2.1.
- Real landscape iPhone testing is **not** complete; bridge rail foreground masking and cliff/collision refinement remain in the later traversal/scene polish phase.
- **Do not begin Phase 2 without the user's next instruction.**


## Phase 2 implementation record (November 4, 2026)
- `game.js`: joystick captures **one pointer only**, ignores other moving fingers, resets on cancellation/lost capture/background/modal, and supports simultaneous attack/talk on the opposite side of the screen. Touch actions fire on pointerdown with suppression of duplicate click; keyboard/mouse click remains available.
- `game.js`: interaction target scoring now prioritizes actual nearby character instead of a distant NPC's larger conversation radius; adds mild penalties for portal and Ash so nearby quest/dialogue NPCs stay easy to talk to.
- `game.js`: save + release movement on background and pagehide before Home Screen worker refresh; checks for updates on load/pageshow/focus/foreground return; one-time version-tagged reload avoids loops.
- `sw.js`: versioned cache `veilward-hollowreach-v122-mobile-reliability`, offline fallback for `?vwbuild=...` navigation, activate-only client update navigation, asset/manifest cache busting and worker message fallback.
- `index.html` and `visual.css`: pause menu displays live JS version `v1.2.2`, narrow-landscape banner and safe-area polish, scrolling retained inside overlays and blocked on game canvas.
- **Tests passed:** 10 synthetic input/pointer scenarios; 6 interaction-priority scenarios; simulated service-worker activation (single navigation, stale-cache cleanup) and offline versioned URL recovery; source consistency and syntax assertions. No iPhone/browser-device test claimed.
- **Protected:** approved Wanderer asset, Warden Hal asset, hero rendering branch, physics/combat tick and save key unchanged.
- **STOP HERE. Phase 3 is not started until creator's next message.**


## Phase 3 implementation record (November 4, 2026)
- **Fully reconnected Smuggler's Hollow:** fixed a cliff/pylon collision footprint that blocked the painted stairway to the upper shrine, turning the isolated platform into a reachable section of the cave rather than allowing collision through the artwork. The cave now has one traversable region.
- **Safe travel returns:** the Greenwood → Frostbridge return now lands at (960,925), not within the village exit's 100-unit interaction radius; cave → Greenwood return lands at (1520,720), not directly on top of the cave entrance. All four round-trip spawn/exit separations exceed 100 world units and each spawn is on valid, connected ground.
- **Reliable transitions:** 1.2-second portal cooldown prevents repeated touch inputs from returning the player to the previous zone; a single delayed travel is retained while the destination image loads. The joystick resets on successful travel; existing saves persist.
- **Collision consistency:** migrated `safePoint` search to the same 8-world-unit collision radius used by player movement, including fallback start points. Kept painted bridge floors and chasm borders impassable except at designed paths.
- **Painted-scene wayfinding:** added very subdued floor-level landmark glows near the four area exits (1 village, 2 Greenwood, 1 cave) and a short fade-out arrival glow drawn *behind* the actors. No player or NPC character art changed; high-detail painted environments are preserved.
- **Automated QA:** sampled 3 navigation graphs and found exactly one walkable component per zone. Verified 18 key anchors (NPCs, entrances, quest objectives, upper shrine) accessible. Replayed 7 routes via `projectMotion` totaling 421 discrete grid steps with no stalls/escapes; passed route-glow render smoke checks (1/2/1/0 across village/wilds/cave/forge). Actual iPhone playtest and screenshot approval remain pending.
- **Updated build/cache:** v1.2.3; `game.js?v=15`, `navigation.js?v=8`, `visual.js?v=30`, `art=20`; canonical `veilward-hollowreach-v01` save key preserved.
- **STOP HERE** for user review; Phase 4 is not started.

## Phase 3 REPEAT — Screenshot-driven rebuild (November 4, 2026)

**The earlier v1.2.3 Phase 3 was NOT visually acceptable.** Its navigation graph tests only checked connectivity, not agreement with the painted scenery. Four creator screenshots exposed physical failures:
1. Smuggler's Hollow: Wanderer physically stood on a raised lantern post at the end of the rope bridge.
2. Frostbridge: Wanderer stood knee-deep in blue river water while the old collision mesh counted that water as snowy ground.
3. Greenwood: Wanderer stood on the raised bridge railing; a separately spawned bandit looked like another copy of the Wanderer.
4. Frostbridge high shrine: Wanderer stood on top of the decorative fence/rock face.

**Root cause:** village polygons in `navigation.js` were authored for an older 707×530 scene and stretched, even though the active screenshot's painted source is 900×584. The resulting polygons silently placed floor over water, fence railings, cliffs, and posts. The cave/forest maps also had overly permissive bridge approach polygons. The previous broad connectivity-only tests could never catch this.

**Actual game changes in v1.2.4:**
- Re-authored the village, Greenwood, and cave traversable polygons **directly in their current artwork's 900×584 coordinates**. Marked the stone shrine fence, icy river, waterfall, wood railings, bridge lantern, dark drop-offs and plinths unwalkable. Bridge travel now follows the wood *deck*, not the top of a rail.
- Moved village/forest/cave exit positions to actual painted floor: village exit `(790,1090)` (southwest snow trail), cave exit `(170,795)` (cave mouth on plank decking), and Greenwood→village return `(1030,675)` (central snowy clearing). Travel return locations remain separated from portals to avoid loops.
- Moved Mira, Eldric, noticepost, one Blueleaf pickup and a wraith onto walkable photographed ground. Joren, Warden Hal, Ash and core quest progression remain unchanged.
- Old saved characters on formerly walkable water/fences are now recovered by `safePoint`. Save schema `sceneVersion=6` upgrades coordinates only as needed; **no forced village reset**, no loss of gold, XP, skills, equipment, items, quest progress or save key.
- Changed only the *bandit enemy's* visual slot from the red-scarfed Wanderer clone to the distinct existing olive-armored axe/hammer-wielding raider. The approved playable eight-angle Wanderer atlas and dedicated Warden Hal art asset are **unchanged**.
- Versioned assets and Home Screen worker to v1.2.4.

**Permanent automated QA:** `tests/phase3_scene_geometry.test.js` tests the native map image point fixtures (including all four screenshots), verifies disallowed screenshot positions and safe old-save relocation, checks the three zones' mesh connectivity, and replays **10 routes / 612 actual projectMotion movement segments**. **1,319 assertions passed** in a simulated runtime against the committed source. A visual iPhone playtest remains REQUIRED; no unsupported "10/10" claim is made.

**Only Phase 3 has been repeated. Phase 4 is still NOT STARTED; stop for user retest.**


## Phase 4 implementation record (November 5, 2026)
- Added `combat.js`, a dedicated pure combat rules module separate from approved character art and world geometry. Sword hits now require the target to be **in front** of the player's actual facing, inside 88 world units, and on an unobstructed line of travel. Corrected an important zero-component facing bug so east/west attacks are not mistakenly treated as diagonal.
- Magic now targets only live foes within 330 world units and within the forward ~70° half-angle **without aiming through solid scenery**; untargeted casts still travel in the current facing direction. Projectiles stop at walls/terrain rather than flying over the landscape's painted chasms.
- Wolves, bandits, and wraiths have individual explicit attack ranges, windup warnings, fixed-aim attack cones, damage, pursuit speeds, and cooldowns. Striking/damaging an enemy interrupts its active warning, and stepping away/sideways or dodging can make an attack miss. Aggro does not engage through nav blockers.
- Added restrained **ground-level wedge telegraphs with shrinking windup rings**, moving enemy HP bars above their true sprite heads, visible resource/cooldown cues and specific out-of-resource notices. Corrected sword damage floaters to display real equipped-weapon bonus. Normalized diagonal dodge velocity, retained the dash's invulnerability window.
- Seven existing enemy spawns verified physically walkable in the newly corrected photo-traced Phase 3 navigation. Hero/Warden source assets, approved Wanderer rendering and movement frame logic, encounter/quest data and save key are preserved.
- Executable `node tests/phase4_combat.test.js` passed **99 assertions** including facing, blockers, hit timing, interruptions, cooldowns, orb collision, player animation guard, script ordering, mobile cache coherency, and enemy spawns. This is a Node/synthetic verification **not an iPhone animation sign-off**.
- Build `v1.2.5`, `combat.js?v=1`, `game.js?v=17`, `navigation.js?v=10`, `visual.js?v=32`, `visual.css?v=9`, `?art=22`, worker cache `veilward-hollowreach-v125-combat-fairness`.
- **Stop at Phase 4**. Phase 5 remains untouched until the creator's next “continue development” instruction.
