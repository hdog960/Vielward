# Vielward — Phase 9 R15: Source-anchored Hollowreach winter illustrations

**Build:** v1.3.22 · **Status:** deployed technical art increment, **NOT creator-approved** · **Gate:** Phase 9 active; Phase 10 locked.

## What changed in the playable game

R13's newly coded box-shaped houses failed the visual comparison and were deliberately gated off. R14 integrated natural snow shading along physical landforms. R15 goes beyond new polygon strokes by introducing an **original independent raster environment sprite sheet**, in the actual `world_raster_pilot.js` renderer. Its source is `assets/hollowreach_environment_r15.webp` (four transparent 144×144 cells in one 576×144, 27,178-byte WebP file).

The asset was generated specifically for Vielward, then separated from its sheet background and optimized for web/mobile use. It is not a pasted painting or the user's golden-reference image; it has no borrowed game characters or brands. Its actual four cells are: an alpine snow-and-stone cliff with high firs, a smaller sloped stone cliff, snowy low brush, and a shallow snow drift with sparse grass.

**Placement discipline:**
- Cliff paintings replace the previous lower-fidelity cliff drawing **only** for `hollowreach_west_snow_terrace`, `hollowreach_north_terrace`, and `hollowreach_west_lower_lip`. These are real, already impassable source polygons; no other obstacles are added.
- The brush illustration follows the four existing physical western spruce roots along the shelterbelt and reuses their original spatial coordinates and safe placement checks.
- The low drifting snow sits on the already traversable apron of each authored cliff and draws behind the real roads. Its image does not add any collider, stair or false passage.
- In a browser where the R15 asset does not decode, the previous painted cliff and brush fallback remains available. The original cottage sprite remains the ONLY default cottage; the rejected R13 polygon-roof designs are development-only.
- The R14 connected snow and road material underpainting stays active. Existing physical cliff draw order, foreground roofs, and world-grid streaming are preserved.

## Technical evidence

The build is static and remains compatible with iPhone Safari / GitHub Pages. The service worker now caches `hollowreach_environment_r15.webp?v=1` under build v1.3.22 and refreshes an installed Home Screen PWA without altering its local save. `tests/hollowreach_environment_r15.test.js` checks real WebP file dimensions, four correct source cutouts, source-backed placement at physical cliffs, small passable drifts, and preservation of 12 regions, 39 source geometry solids, 48 travel anchors, 65 roads, seven crossing links and the existing original save. It does not claim full art satisfaction.

Browser visual capture `HOLLOWREACH_R15_ESCARPMENT` was completed through the actual world streamer, alongside village, original cottages, all-region atlas, Greenwood and crossings. The new escarpment can be seen at the upper-left portion of the screenshot; the view also demonstrates that much of the snowfield remains too empty. No physical iPhone test has been performed in this chat.

## Unfinished acceptance work

The screenshot still differs substantially from the source aesthetic. Major remaining effort: richly integrated terrain relief beyond three local cliffs; roads and village thresholds melting naturally into terrain; 3/4 roof/rock proportions with cohesive value ramps; stronger lighting and texture density; carefully placed non-repetitive natural features that do not imply fake collision; high-quality Greenwood and other biome imagery; proper iPhone physical inspection.

**Visual acceptance: 0%. Phase 9 must NOT be signed off; Phase 10 must NOT be started until the creator sees and approves the actual playable world.**
