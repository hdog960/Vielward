# Vielward — Phase 9 R28 Rooted Greenwood crossroads

## Problem
R27's 72 local forest roots (7 by roads) passed all technical checks, but the real 720×405 gameplay camera still showed a bare Hearth crossroads and only one right-edge tree. Most generated roots were *outside the camera* or had crowns whose tops were above the visible frame.

## Implementation
R28 adds an intentionally asymmetrical set of candidate **physical** oak/pine roots in the existing Greenwood Hearth clearing margins, selecting at most nine after verifying:
- full 65-road centerline + path half-width clearance (no reliance on weak broad-phase road indexing);
- original river, source solids, landscape boundary and biome;
- the current illustrated Hearth cottage, woodpile, sign, mushroom site, Hermit entrance and reserved waypoint clearings;
- absence of any overlapping existing field/grove physical roots and no overlap between newly planted physical roots.

The chosen source roots are returned from `world_footprint.groves()` for the same original painted oak and pine source sprites that other world trees use. Their boot-level hitboxes live in `world_footprint.blocked()` with identical center and radius. There are no floating canopy billboards and no sprite art shortcuts. Everything is stable across chunks and reloads.

### Verification
`npm run audit:greenwood-r28` checks authored count and uniqueness, honest collision, 65 road edges sampled along their centerlines, source building survival, original saved-game key, and actual landscape-frame positioning. In-game Chromium screenshot keys are `GREENWOOD_R28_LIVING_CROSSROADS` and `GREENWOOD_R28_HERMIT_PRESERVED`. Passing tests are not art approval; physical iPhone QA is still required. Phase 9 active, Phase 10 locked.
