# VEILWARD — Phase 9 R12 / v1.3.18: Rooted Winter Landscape

**Live playable game patch · NOT ART APPROVAL · Phase 10 LOCKED.**

## Objective
The R11 winter footprints made the scene slightly more lived-in, but did not solve its visual flatness. This pass targets integration of physically real terrain features and clean source-image pixel detail, rather than adding decorative props.

## Implemented in the actual renderer
- The Hollowreach western upper escarpment, the four actual physical spruce trunk roots and the lower cliff now define one world-space snow-and-stone landscape spine. The compositor lays a continuous, subdued cold-rock underpainting and independent authored raster snow material beneath their existing physical features. Existing roads and bridge decks are rendered afterward and remain visible/walkable.
- Forecourt flagstones use real **illustrated stone material** from `assets/hollowreach_ground_painted_v2.webp`, clipped to the irregular placed outlines rather than flat Canvas polygon fills. Stone placement respects physical water and building collision.
- The winter sprite renderer now uses nearest-neighbor scaling on its artist-authored sprite atlases to keep pixel clusters and edges sharp, instead of introducing bilinear blur during enlargement.
- `scripts/visual_capture.mjs` adds a real, playable `HOLLOWREACH_R12_LANDSCAPE` browser viewpoint, alongside the previously existing real game screenshots. A new permanent `tests/hollowreach_landscape_r12.test.js` audits physical roots, out-of-region behavior, draw repeatability, topology and saved progress.
- Build number, source URL cache keys and iPhone service-worker cache are advanced to v1.3.18. The original `village_v06_clear.jpg` and `wilds_clean.jpg` paintings remain untouched references.

## Protection
No new colliders, roads, island crossings, fake interiors, teleporters or save migrations. The core world stays **12 regions, 48 nodes, 65 roads, 7 crossings, 39 physical solids**, and `veilward-hollowreach-v01` remains the save key. Approved Wanderer/Warden graphics and core combat/quest logic are protected.

## Acceptance truth
**Creator approval is still 0%; Phase 9 is not complete.** This is one improvement to visual structure, not the major illustrated 32-bit-environment transformation. Hollowreach still requires original richly textured architecture, correctly modeled snow cliffs/rivers/bridge landings, significant depth, carefully animated vegetation and consistent visual treatment. Greenwood needs the same rich asset production. Do not advance to Phase 10 or describe the visuals as ready to inspect solely because tests pass.
