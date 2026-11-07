# Veilward Phase 9 R24 — Source-anchored Woodland Habitat

**Build:** v1.3.32 | **Milestone:** Phase 9 still active | **Visual acceptance:** 0% | **Phase 10:** locked

## Why
R23 browser captures showed two attractive, separately illustrated Greenwood cottages, yet their surrounding grass and soil remained flat and obviously disconnected from the architecture. Previous attempts to add random square debris, standalone vegetation and hard geometric shoulder bands were rejected in actual visual review.

## Implemented in the playable terrain compositor
`world_greenwood_art.js` now accepts the original world blueprint through the existing `world_illustration.js` creator. `paintLandmarkHabitat` derives **only** `greenwood_hearth` and `hermit` positions from the authoritative node list, samples two naturally spaced woodland skirts at varied radii, and stamps the **original independent R18 128px fern illustration** in overlapping but non-grid, varied rotations and sizes above soft canopy-shadow light gradients. Every candidate is excluded if it touches a physical road, source water, an authored obstacle, a tree-trunk blocker or a non-Greenwood region. This is low illustration at ground height: all original road widths, collision and walkable approaches remain authoritative and unchanged. The original trees, fern roots, and winter art retain their existing painters.

`scripts/visual_capture.mjs` adds `GREENWOOD_R24_HABITAT`, a **real gameplay** screenshot from the original safe Hearth waypoint. `tests/greenwood_habitat_r24.test.js` checks both named anchor IDs, exclusion from genuine roads, painted source cells, bounded deterministic composition, unchanged node coordinates, and protected `veilward-hollowreach-v01` save storage.

## Truthful acceptance
This is an incremental original-asset forest-floor continuity pass, **not** the fully illustrated premium overworld. Any UI-friendly green foliage or screenshot benchmark must be inspected in-game; automation cannot grant creator approval. Broader unique high-resolution forest canopy, truly detailed cliffs/riverbanks, richer scene-wide architecture and the remaining ten region aesthetics are still open. Preserve the locked R9->R10 visual gate.

**Status:** Phase 9 ACTIVE, creator visual acceptance 0%, Phase 10 LOCKED. Physical iPhone performance/visual QA unverified.
