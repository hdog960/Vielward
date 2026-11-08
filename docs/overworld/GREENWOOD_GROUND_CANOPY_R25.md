# VEILWARD Phase 9 R25 — Woodland ground and rooted crown continuity

**Build:** 1.3.32 / R25 hotfix · **Creator acceptance:** 0% · **Phase 10:** locked.

## Actual playable implementation

- Removed the 32-pixel repeating, bright leaf/flower motif from the Greenwood forest/moss/grass **base material**. `terrain_art.js` now creates three bounded 256×256, seamless low-chroma raster-material plates once per game session, sampled in stable world coordinates. The palette shifts gradually at 64-, 16- and 4-pixel scales, with no pale flower icons or off-grid ground debris. It still draws beneath the original physics-backed roads, water, homes and trees.
- `world_greenwood_art.js` may now connect the painted upper crown portions of **pairs of existing** oak/pine roots, using the original independent R18 art. It never creates a trunk, collider, destination or impassable canopy. All three samples along a prospective link must be in Greenwood and away from a real water/road corridor.
- `world_illustration.js` draws these restrained foliage links **before** whole-root trees. They are underpainting, not duplicate houses, new map obstacles or full-screen backdrops.
- GitHub Pages Home Screen refresh uses new cache key `veilward-hollowreach-v1332-source-glade-habitat-r25` and query revision `rev=25`, while retaining stable save key `veilward-hollowreach-v01`.
- Real Chromium screenshot keys `GREENWOOD_R25_GROUND` and `GREENWOOD_R25_CANOPY` compare against the same in-game Hearth and Hermit camera. `npm run audit:greenwood-r25` checks texture alpha, luminance, deterministic output, physical-root links and water/road exclusions.

## What remains

This is a technical/visual recovery revision, not final source-quality painting. The hand-authored cottages remain stronger than the forest floor; Greenwood still needs artistically diverse authored tree/undergrowth variants, richer canopy distribution, geological transitions, and human review of actual gameplay screenshots. Do not claim screenshot tests imply aesthetic approval. **Phase 9 ACTIVE, user visual acceptance 0%, Phase 10 LOCKED; physical iPhone QA outstanding.**
