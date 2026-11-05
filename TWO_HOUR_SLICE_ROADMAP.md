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
**Status: NOT STARTED — next phase; STOP until user continues**
- Audit current install/update path: GitHub Pages cache versions, service-worker registration, stale Home Screen clients, resume/reload loop safety.
- Make the running build version visible in the pause menu for accurate user verification.
- Check landscape joystick controls, attack/spell/dodge/potion/talk target priority, accidental scrolling, safe-area handling and click/touch overlap.
- **Acceptance:** New build can be identified in the app; no observed code-level update loop; saves persist; directional movement and actions work in simulated or available device tests. Real device confirmation remains user-owned.

### Phase 3 — Traversal and cross-biome environmental coherence (30-minute target)
**Status: NOT STARTED**
- Walk through the current village → Greenwood → Smuggler's Hollow navigation/transition code and backtracking.
- Fix unsafe spawn points, stuck spots, invisible barriers, portal targeting/range, confusing exits and conspicuous image-to-collision disagreements.
- Refine visibly inconsistent snow/forest/cave visual density, layering and landmarks with small, **implemented** art improvements (not screenshot-only mockups).
- **Acceptance:** Reach and return from all three zones, with understandable travel points, no known progression-blocking collision, and coherent scene framing.

### Phase 4 — Combat responsiveness and fairness (25-minute target)
**Status: NOT STARTED**
- Polish existing sword hits, player direction handling, attack range feedback, hit reaction, spell/dodge activation, stamina/mana readability and enemy HP.
- Inspect current wolves/bandits/wraiths for premature off-screen attacks, unclear telegraphs, unreachable targets and damage timing.
- Keep this a **polish pass on working systems**; do not falsely claim the separate later Gate 2 systems (bow, shield, 3 spells, elite enemies) are complete.
- **Acceptance:** Existing encounters offer readable warnings, consistent damage and responsive controls with no obvious unfair instant hits or missing action feedback.

### Phase 5 — Introductory quest closure and regression QA (20-minute target)
**Status: NOT STARTED**
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
