# VEILWARD — Phase 1 Screenshot Issue Register

**Source:** Creator's 12-page `Vielward.pdf`, reviewed page by page including embedded screenshots. Additional creator instruction: full overworld appearance approval after Phase 9. **Code baseline:** v1.2.6 / `dde016f` (November 5, 2026). 

> Observed complaints reflect source PDF screenshots; code evidence reflects source snapshot v1.2.6. This Phase 1 register does not claim any reported visual problem is fixed in current iPhone app.

## Triage legend

- **OPEN / reported**: the screenshot proves that this was experienced; test again after relevant work.
- **Code evidence**: what the current source actually implements, not a claim of visual quality.
- **Acceptance**: observable requirement to close an issue. Every visual issue needs in-game screenshot or device testing, not only path-graph tests.

**34 tracked issues**, including 33 directly grounded in PDF pages and one additional creator approval instruction.

## Page-by-page complaint crosswalk

| PDF page | Tracked IDs | Primary subject |
|---|---|---|
| 1 | VW-001, VW-002, VW-003, VW-026, VW-027 | Snow-to-green portal, continuous Skyrim-like world and art |
| 2 | VW-004, VW-005, VW-031 | Movement detour despite clear-looking path |
| 3 | VW-006, VW-007, VW-008, VW-009, VW-026, VW-028, VW-030 | Enemy visual identity/full sprites and ugly pickups |
| 4 | VW-009, VW-010, VW-026, VW-030, VW-033 | Random props/blue triangular markers |
| 5 | VW-005, VW-011, VW-012, VW-031 | Unreachable path and monument |
| 6 | VW-013, VW-014, VW-027, VW-033 | Enterable workshop and readable notice |
| 7 | VW-001, VW-002, VW-015, VW-016 | Bush teleport and unreachable island |
| 8 | VW-017, VW-018, VW-029 | White-outline flowers and standing on tree |
| 9 | VW-005, VW-009, VW-019, VW-020, VW-031 | Nontraversable stairs and cave bridge |
| 10 | VW-021, VW-022, VW-029, VW-033 | Floating on cliff and fake chest |
| 11 | VW-023, VW-024, VW-033 | Unexplained oval and meaningless-looking magical site |
| 12 | VW-001, VW-003, VW-025, VW-032 | Whole overworld first, then select mechanics slice |

## Actionable issue records

### VW-001 · Overworld · PDF p.1, 7, 12

**Creator's reported problem:** Outdoor biome swap uses a Talk/portal action.

**Current-code evidence:** Confirmed in v1.2.6: village ↔ wilds portal objects call changeZone.

**Fix phases:** P3 · P6 · P7 · P9. **Status:** OPEN / device verification pending.

**Close only when:** Walk from snow through thawline to green forest without a prompt, fade or teleport.

### VW-002 · Overworld · PDF p.1, 7

**Creator's reported problem:** Snowy brush inexplicably becomes lush Greenwood.

**Current-code evidence:** Current scene assets are independently painted JPGs and geographically unrelated.

**Fix phases:** P2 · P7 · P8. **Status:** OPEN / device verification pending.

**Close only when:** Continuous road and gradual climate over believable travel distance.

### VW-003 · Scope · PDF p.1, 12

**Creator's reported problem:** World feels like three isolated scenes rather than an expansive landscape.

**Current-code evidence:** Three exterior-like zones include village, wilds and cave; forge art also exists.

**Fix phases:** P2 · P3 · P6 · P9. **Status:** OPEN / device verification pending.

**Close only when:** Whole proposed outdoor geography built and traversable before local slice refinement.

### VW-004 · Movement · PDF p.2

**Creator's reported problem:** Trying to walk left requires a large irrational detour.

**Current-code evidence:** Local polygon mesh/axis sliding; screenshot illustrates mismatch.

**Fix phases:** P4 · P8 · P10. **Status:** OPEN / device verification pending.

**Close only when:** Traverse visibly clear adjoining ground directly using joystick.

### VW-005 · Navigation · PDF p.2, 5, 9

**Creator's reported problem:** Walkable-looking roads terminate or have invisible barriers.

**Current-code evidence:** Polygon collision separately traced over 900×584 images, not authored together.

**Fix phases:** P4 · P8 · P9 · P10. **Status:** OPEN / device verification pending.

**Close only when:** Every illustrated road leads to a real junction/destination or visible obstruction.

### VW-006 · Enemies · PDF p.3

**Creator's reported problem:** Combat enemies need complete directional sprite sheets.

**Current-code evidence:** Enemy atlas slots are selected static NPC cells with frame bobbing; no full enemy sheets.

**Fix phases:** P17 · P18 · P19. **Status:** OPEN / device verification pending.

**Close only when:** Each initial enemy has idle/walk/attack/stagger/death frames for relevant directions.

### VW-007 · Enemies · PDF p.3

**Creator's reported problem:** Bandit looks like an ordinary civilian or duplicate hero.

**Current-code evidence:** Current bandit uses actors_v07 slot 6; distinct asset quality not creator-approved.

**Fix phases:** P17 · P18. **Status:** OPEN / device verification pending.

**Close only when:** Bandit silhouette, clothing, equipment and animation read clearly as outlaw.

### VW-008 · Enemies · PDF p.3

**Creator's reported problem:** Enemy variety should eventually exceed Skyrim without copying it.

**Current-code evidence:** Current live hostile types: wolf, bandit and wraith only.

**Fix phases:** P17 · P18 · P19. **Status:** OPEN / device verification pending.

**Close only when:** Approved original bestiary with diverse types and distinct completed animation sets.

### VW-009 · Pickups · PDF p.3, 4, 9

**Creator's reported problem:** Bright blue geometric pickup markers violate aesthetic.

**Current-code evidence:** World objects use generic draw and icon primitives; source illustration is not an item atlas.

**Fix phases:** P5 · P16. **Status:** OPEN / device verification pending.

**Close only when:** Handmade pixel-art resource pickups with ground contact and no colored triangles.

### VW-010 · Composition · PDF p.4

**Creator's reported problem:** Objects seem randomly placed simply to look nice.

**Current-code evidence:** Existing backgrounds are static compositions; objects are separately overlaid.

**Fix phases:** P2 · P5 · P13 · P16. **Status:** OPEN / device verification pending.

**Close only when:** Each prop placement justified by trail, ecology, ownership or gameplay role.

### VW-011 · Hollowreach · PDF p.5

**Creator's reported problem:** Snowy northward path cannot be followed.

**Current-code evidence:** Village ground/solids polygons fence off portions of pictured ledges.

**Fix phases:** P4 · P8 · P12. **Status:** OPEN / device verification pending.

**Close only when:** Reach the visually available northern trail without clipping solid walls.

### VW-012 · Hollowreach · PDF p.5

**Creator's reported problem:** Cannot walk around the high monument.

**Current-code evidence:** Current shrine forecourt is a narrow polygon surrounding solid plinth.

**Fix phases:** P4 · P8 · P12. **Status:** OPEN / device verification pending.

**Close only when:** Circumnavigate memorial along visible safe paths without walking on posts.

### VW-013 · Interiors · PDF p.6

**Creator's reported problem:** Joren's visible workshop cannot be entered.

**Current-code evidence:** Forge scene JPG exists but no accessible workshop door object/scene route.

**Fix phases:** P12 · P15. **Status:** OPEN / device verification pending.

**Close only when:** Real Enter interaction at visible workshop threshold and working interior/exit.

### VW-014 · Signs · PDF p.6

**Creator's reported problem:** Trail sign cannot be read.

**Current-code evidence:** Board exists as abstract object at (845,600) with dialogue range; visual correspondence unverified.

**Fix phases:** P12 · P16. **Status:** OPEN / device verification pending.

**Close only when:** Stand near painted notice, use Read and receive meaningful readable text.

### VW-015 · Roads · PDF p.7

**Creator's reported problem:** Path dead-ends in bushes despite a lush-area transition.

**Current-code evidence:** Village→wilds portal on snowy southwestern road, not continuous terrain.

**Fix phases:** P2 · P7 · P8 · P12. **Status:** OPEN / device verification pending.

**Close only when:** Road extends through connected geography with no bush-trigger teleport.

### VW-016 · Water · PDF p.7

**Creator's reported problem:** Prominent river island has no logical access.

**Current-code evidence:** No authored island route or transport interaction is implemented.

**Fix phases:** P2 · P8 · P14. **Status:** OPEN / device verification pending.

**Close only when:** Cross via visible bridge, ford or deliberate transport and land on mapped solid ground.

### VW-017 · Foliage · PDF p.8

**Creator's reported problem:** Flower texture is abruptly cut off and outlined white.

**Current-code evidence:** Bloom clusters are baked into JPG; masking/edge fidelity not validated.

**Fix phases:** P5 · P13. **Status:** OPEN / device verification pending.

**Close only when:** Foliage blends naturally with ground; no matte outline or abrupt rectangular cut.

### VW-018 · Depth · PDF p.8

**Creator's reported problem:** Character stands atop tree/canopy when following misleading route.

**Current-code evidence:** No co-authored tree-footprint/foreground-depth layer; current nav lacks depth data.

**Fix phases:** P4 · P11 · P13. **Status:** OPEN / device verification pending.

**Close only when:** Foot point blocked at trunk; foreground canopy occludes character correctly.

### VW-019 · Verticality · PDF p.9

**Creator's reported problem:** Visible Greenwood stone stairs cannot be climbed.

**Current-code evidence:** Current world has flat 2D ground polygons and no elevation/h-level model.

**Fix phases:** P4 · P8 · P13. **Status:** OPEN / device verification pending.

**Close only when:** Climb actual stair treads to upper ground with correct shadow/elevation.

### VW-020 · Bridges · PDF p.9

**Creator's reported problem:** Smuggler's Hollow rope bridge looks traversable but cannot be crossed.

**Current-code evidence:** Cave bridge polygons historically repaired; iPhone screenshot still reports blockage.

**Fix phases:** P4 · P8 · P15. **Status:** OPEN / device verification pending.

**Close only when:** Walk entire bridge deck bank-to-bank with no rail/collision snag.

### VW-021 · Grounding · PDF p.10

**Creator's reported problem:** Player visibly floats above chasm near lamp/post.

**Current-code evidence:** Actor uses sprite/sole offsets and flat navigation; no per-foot elevation/depth.

**Fix phases:** P4 · P11 · P15. **Status:** OPEN / device verification pending.

**Close only when:** Boot soles and contact shadow align with actual bridge or stone floor.

### VW-022 · Treasure · PDF p.10

**Creator's reported problem:** Chest-looking object seems fake or noninteractive.

**Current-code evidence:** Single code chest is at cave (888,689); other chest-like shapes baked in painting.

**Fix phases:** P15 · P16 · P20. **Status:** OPEN / device verification pending.

**Close only when:** Real chest has reachable hitbox and reward; decorative chest not misleading.

### VW-023 · Ruins · PDF p.11

**Creator's reported problem:** Mysterious oval ground marking can be walked on without explanation.

**Current-code evidence:** No named oval interaction object in current nine-object setup.

**Fix phases:** P15 · P16 · P20. **Status:** OPEN / device verification pending.

**Close only when:** Marking is purposeful puzzle/lore/location or visually clearly ornamental.

### VW-024 · Worldscar · PDF p.11

**Creator's reported problem:** Spectacular violet magical shrine looks pointless.

**Current-code evidence:** Code has Worldscar attunement dialogue + one XP reward, but no designed shrine exploration.

**Fix phases:** P15 · P16 · P20. **Status:** OPEN / device verification pending.

**Close only when:** Site has coherent approach, visual interaction, lore and meaningful one-time reward.

### VW-025 · Process · PDF p.12

**Creator's reported problem:** Full outdoors must precede detailed mechanic slice.

**Current-code evidence:** Old roadmap built only village/forest/cave prototype.

**Fix phases:** P1 · P2 · P6 · P9. **Status:** OPEN / device verification pending.

**Close only when:** Creator gets full outdoor layout to inspect before intensive slice polish.

### VW-026 · Art · PDF p.1, 3, 4

**Creator's reported problem:** Beloved high-detail 3/4 pixel style must remain intact.

**Current-code evidence:** Approved Wanderer atlas exists; scene JPGs have attractive but independent detail.

**Fix phases:** P1 · P5 · P7 · P11. **Status:** OPEN / device verification pending.

**Close only when:** Same material/pixel density/lighting and scaled actors across all region shots.

### VW-027 · Entrances · PDF p.1, 6

**Creator's reported problem:** Enter is appropriate at a real building, cave or ruin only.

**Current-code evidence:** One wilds→cave entry exists, but snow→forest uses same mechanism.

**Fix phases:** P3 · P12 · P15. **Status:** OPEN / device verification pending.

**Close only when:** Exterior walking is seamless; enclosed entrances use believable thresholds.

### VW-028 · Enemy art · PDF p.3

**Creator's reported problem:** Individual monsters must stay consistent from front/back/side and in attacks.

**Current-code evidence:** Wolf/bandit/wraith use atlas NPC cells, unlike protected 8-row player sheet.

**Fix phases:** P17 · P18. **Status:** OPEN / device verification pending.

**Close only when:** Creature remains recognizably same across all required frames.

### VW-029 · Occlusion · PDF p.8, 10

**Creator's reported problem:** Trees, cliff foreground and bridge posts obscure real foot placement.

**Current-code evidence:** Rendering sorts actor by y and uses alpha bounds; no authored roof/rail masks.

**Fix phases:** P4 · P11 · P13 · P15. **Status:** OPEN / device verification pending.

**Close only when:** Character correctly passes behind/in front of foreground geometry.

### VW-030 · Item language · PDF p.3, 4

**Creator's reported problem:** Pickups should be visually integrated and intelligible.

**Current-code evidence:** Objects currently use drawn symbols and simple glow over painted ground.

**Fix phases:** P5 · P16. **Status:** OPEN / device verification pending.

**Close only when:** Dedicated sprites for blueleaf, quest crate and magical pickups.

### VW-031 · Height design · PDF p.2, 5, 9

**Creator's reported problem:** Stairs, bridges and elevation need an integrated coordinate model.

**Current-code evidence:** Current navigation projects image polygons into flat 1850×1200 scene.

**Fix phases:** P2 · P4 · P8 · P10. **Status:** OPEN / device verification pending.

**Close only when:** Each traverse uses shared elevation/nav/visual coauthored path data.

### VW-032 · Scope · PDF p.12

**Creator's reported problem:** Do not build every interior or cave before overworld review.

**Current-code evidence:** Prototype has four scene images; no continuous outdoor streaming.

**Fix phases:** P3 · P6 · P9 · P15. **Status:** OPEN / device verification pending.

**Close only when:** Entire outdoor world walkable for review; interior depth deferred outside test slice.

### VW-033 · Affordances · PDF p.4, 6, 10, 11

**Creator's reported problem:** Prominent props and environmental landmarks must have believable purpose.

**Current-code evidence:** Current object set has board, two herbs, one chest, one Worldscar plus portals.

**Fix phases:** P12 · P16 · P20. **Status:** OPEN / device verification pending.

**Close only when:** Visible usable objects behave consistently with appearance, and ornament is labeled.

### VW-034 · Approval · PDF Creator checkpoint

**Creator's reported problem:** Creator requires appearance review after whole overworld is finished.

**Current-code evidence:** Approved roadmap explicitly locks Phase 10 behind Phase 9 review.

**Fix phases:** P9 · P10 · P22. **Status:** OPEN / device verification pending.

**Close only when:** Stop after Phase 9 with full playable outdoor visual atlas; fix notes before approval.

## Non-regression and approval policy

- Never dismiss a PDF issue because new polygons are connected in automated tests. Compare to **actual rendered scenery and movement on iPhone**.
- Protect approved Wanderer atlas and Warden Hal asset; see `ASSET_AND_RUNTIME_INVENTORY.md` and `WORLD_DESIGN_LOCK.md`.
- **Phase 9 hard stop:** full outdoor appearance/layout review, creator notes patched into the actual game, explicit approval required for Phase 10.
- Keep this JSON issue ID stable in code, PRs, tests and subsequent roadmap phase reports. Update each issue only when the live game patch and its acceptance checks are verifiable.
- Runtime is intentionally unchanged during Phase 1; no screenshots can be claimed as newly fixed.

**Machine-readable register:** [`issue_register.json`](./issue_register.json).
