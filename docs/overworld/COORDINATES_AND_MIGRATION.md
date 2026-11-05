# VEILWARD — Coordinate System and Save-Migration Contract (Phase 1)

**Baseline confirmed in source:** v1.2.6 / `dde016f`. **Future architecture:** proposed contract for later implementation; no code change made today.

## A. What currently exists

- `game.js`: `WORLD={w:1850,h:1200}`, `WORLD_ZOOM=.78`. Player state: `p.zone` plus local `p.x,p.y`. Current outdoor IDs are `village`, `wilds`; `cave` and `forge` are enclosed/illustrated scenes.
- `visual.js`: active painted images for `village`, `wilds`, `cave`, `forge`; rendered into same `1850×1200` world canvas regardless of source image.
- `navigation.js`: polygons traced at **900×584 reference-image coordinates** and projected via:
  
  `worldX = imageX * (1850/900)`  
  `worldY = imageY * (1200/584)`
  
  For visual-frame-specific comparison, invert the formula `imageX = worldX * 900/1850`, `imageY = worldY * 584/1200`. Never mix one zone's coordinates with another zone's.
- Collision: `canWalk(zone,x,y,radius)` usually radius 8; `projectMotion` moves substeps and slides axis-wise. It has **no height** or layered-depth field.
- Save: JSON serialized to `localStorage["veilward-hollowreach-v01"]`. Current saved player contains `zone,x,y,sceneVersion,navVersion,questVersion,artVersion` and many progression fields.
- Current zone transitions: 4 portal objects; village↔wilds MUST become uninterrupted exterior movement; wilds↔cave may remain via an authored doorway. Existing `changeZone` resets camera and places player at a separate destination point.
- Source scene polygons are manual and distinct from the raster painting. This is why a connected nav graph alone **cannot** prove safe visually grounded movement.

## B. Phase 2 design space (to establish before coding)

Propose a single **global outdoor coordinate system** with the following conventions, subject to layout sign-off:

- One origin for the whole outdoor world; X increases east, Y increases south; coordinates are in one stable integer/subpixel world-unit scale.
- Every outdoor chunk has an ID and known global offset, size, image/geometry metadata, layer masks, and neighbor IDs.
- Coauthor path/nav areas from the same terrain definition as the image chunks. Each walkable surface has ground height, surface ID/material, footprint and optional slope/stair links; foreground occlusion is separate from walking collision.
- Outdoor biome blend layers describe continuous regional gradients, not hard scene swaps. Water and river crossings are explicit navigable graph edges with named bridge/ford locations.
- Entrances carry world-space threshold/return anchors to separate enclosed scenes. Only **real threshold interactions** should trigger a mode/scene transition.
- Unique world objects use stable IDs (not merely their `x,y` coordinates), permitting independent persistent harvesting/opening/activation and scene chunk streaming.
- Save world layout/version is explicit and migration is one-way, backward-tolerant and **non-destructive**.

**Do NOT choose chunk dimensions, tile cell size, geographic offsets, travel time or number of chunks in Phase 1.** Those belong to Phase 2's mapped blueprint and iPhone performance budget.

## C. Safe migration sequence for later phases

1. Preserve original key and copy of current save fields in memory; never call a reset to simplify migration.
2. Detect current save shape and validated legacy zone. For `zone=village` and `zone=wilds`, use a **hand-authored mapping** from existing local foot position to the corresponding new outdoor global ground. Do not naively map two painted scenes by equal X/Y ranges or assume they were geographically adjacent.
3. Preserve interior `cave` position and unique interior instance/door-return anchor. For `forge`, inspect old code's save behavior (current startup remaps forge→village); do not silently discard any future interior save.
4. Move the mapped spawn to the nearest safe walkable floor *on the intended side of a river/cliff*, with correct elevation and foot height. A generic nearest Euclidean floor across a chasm is NOT an acceptable migration.
5. Carry all progression fields: health, magicka, stamina, maxima, level, XP, gold, kills, `quest`, `skills`, weapon/armor, potions, `supplies`, `suppliesRecovered`, `suppliesDelivered`, `caveBanditCleared`, `herbs`, `herbHarvested`, `scarAttuned`, `defeatedEnemies`, `lastSave` and any newer source fields.
6. Keep unique NPC/enemy/object identities by semantic, stable ID. Implement a crosswalk from existing `cave:bandit:homeX:homeY` style kill IDs so legacy defeated enemies do not respawn or duplicate rewards after new chunk spawning.
7. Save the new schema atomically, with either a recoverable original backup or compatibility fallback; test forced close / reload / offline Home Screen cases.
8. Only deprecate legacy zone portals after seamless new-world outdoor navigation and real entrance thresholds are tested on iPhone.
9. On migration failure, retain old playable save and show a specific error; never silently start new progression.

## D. Invariants / proposed automated tests

- `legacyQuestThenMigrate`: Joren's quest milestones, bandit defeated and recovered crate still correct.
- `legacyHerbTrade`: both harvest flags and the potion trade remain correct after moving between chunks.
- `legacyWorldscar`: no duplicate attunement rewards after relocation.
- `legacyEquipment`: same weapon/armor, gold, XP and skill ranks.
- `legacyRiverSide`: a former foot position doesn't jump onto inaccessible opposite bank or onto a bridge post.
- `crossChunkWalk`: no camera snap, black image or input interruption on boundary.
- `interiorRoundTrip`: named door returns to nearby physical exterior threshold.
- `appearanceGate`: actual Phase 9 in-game screenshots + creator approval, independent of passing path tests.

## E. Source-of-truth and issue links

This contract complements the approved [22-phase roadmap](../../OVERWORLD_REBUILD_ROADMAP.md). The registered evidence and failures are in [ISSUE_REGISTER.md](./ISSUE_REGISTER.md); active scene, item, enemy, NPC and sprite catalogs are in [ASSET_AND_RUNTIME_INVENTORY.md](./ASSET_AND_RUNTIME_INVENTORY.md).

**Phase 1 does not change existing world coordinates, player save data, assets or gameplay.**
