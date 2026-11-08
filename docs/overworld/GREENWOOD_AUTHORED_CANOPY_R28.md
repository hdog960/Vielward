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

## R28b: camera-visible root correction

Actual browser R28 Hearth screenshot was pixel-identical before and after planting. A diagnostic produced rooted offsets `[-350,-350], [-85,-405], [530,-310], [420,610]`, confirming roots were not near the visible crown region of the landscape camera. The source walkability audit found nine unblocked sites along the southern woodland edge including `[65,360]`, `[-65,490]`, `[195,490]` and `[-130,555]`. R28b prioritizes these physical, safe roots. Separation is loosened only between rooted tree bases so source-painted crowns can grow into a coherent edge; all roads, water, original buildings and saved positions remain protected. Dedicated CI and browser QA now require at least two rooted canopies intersecting the compact phone screenshot. R28b captures `GREENWOOD_R28B_VISIBLE_CROWNS` from actual playable state, not a concept plate. Art acceptance 0% until the creator judges it.
