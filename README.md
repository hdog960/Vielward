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
