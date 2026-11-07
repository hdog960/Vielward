# Vielward Phase 9 R18 — Painter-authored Greenwood source assets

**Build**: v1.3.25. **Approval**: NOT granted. Phase 9 active, Phase 10 locked.

## Actual playable-world change
Four standalone original transparent sprite paintings are committed to the actual repository: `assets/greenwood_oak_r18.avif` (2,916 bytes), `assets/greenwood_pine_r18.avif` (2,696 bytes), `assets/greenwood_ferns_r18.avif` (3,726 bytes), `assets/greenwood_rock_r18.avif` (2,438 bytes). Each source is exactly 128×128 RGBA AVIF. The paintings are independent sprites, not a screenshot of the intended scene or a frozen background. The production `world_greenwood_art.js` asynchronously decodes the four sources, checks real alpha coverage for each illustration (not just a valid image header), and caches one 512×128 canvas atlas. The normal world-stream bootstrap now awaits this optional raster setup before constructing forest tile caches.

Oak and pine sprites are stamped at **existing** `footprint.cells` and `footprint.groves` anchors and use those anchor foot positions. Source-backed undergrowth and boulders reuse their original positions as well. A deterministic variant rule blends the four new illustrated sources with R17's fifteen more schematic foliage variations to avoid obvious cloned trees. The forest floor and original roads retain their draw order. No new colliders, arbitrary impassable shrubs, imaginary paths or altered region geometry.

## Safeguards
The four AVIF source files have exact SHA-256 hashes enforced in `tests/greenwood_painted_r18.test.js`, and were transferred as separately verified Git blobs after a failed combined asset was rejected. `scripts/visual_capture.mjs` checks actual nontransparent pixels and photographs a genuine passable viewpoint near an existing Greenwood root (`GREENWOOD_R18_PAINTED_TREE`). Unknown browser support, image corruption or blocked offline assets cause a safe fallback to R17 native pixel canopy.

Invariants: all twelve regions, 39 physical solids, 48 walkable anchor nodes, 65 roads, seven crossings, original Wanderer/Warden Hal sprite sheets, quests and `veilward-hollowreach-v01` browser save remain unchanged. The iPhone PWA cache is incremented to v1.3.25 and pre-caches all four new assets.

## Art status
The new illustrations are a meaningful scene-quality improvement relative to the 5× procedural R17 sprites, but the forest remains too sparse at the central crossroad and still lacks the fully integrated architecture, dense foliage variation, layered depth and richly illustrated terrain expected from the original reference. **Creator visual acceptance remains 0%, Phase 9 ACTIVE, Phase 10 LOCKED.** Do not treat screenshot QA as artist approval or claim physical on-device iPhone verification.
