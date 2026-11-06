# VEILWARD — ART DIRECTION IS LOCKED
## Phase 9 visual failure; approved source reference comparison

**The creator's November 6 comparison is the definitive quality standard.** The top screenshot of the extended 12-region overworld looked like crude tiled paint and blocky props. The lower screenshot of the ORIGINAL Hollowreach outpost has actual artist-authored pixel scenery: natural nonrepeating snowy ground, icy cliffs, stone stairs, ornate timber cottage, tiny snow-laden plants, glacial water and a convincing three-quarter perspective. That original style, NOT the procedural preview, is Veilward's approved visual direction.

**Visual acceptance: 0%. Phase 9 art gate FAILED; Phase 10 remains locked.**

## Technical root cause — never repeat this failure

The original game scenes are complete illustrated 900×584 paintings loaded by `visual.js` for Hollowreach and Greenwood. The extended overworld instead uses `terrain_art.js`, `world_illustration.js`, `world_routes.js` and `world_setpieces.js` to draw low-detail canvas tiles, line roads and polygon structures. The R1 and R2 patches merely layered on more procedural geometry. They did not create the missing illustrated source assets, so they could not reach the original quality. Some objects also represented new collision, and the world looked worse as they accumulated.

### Rejected R3 experiment (rolled back)
An attempt in v1.3.7 to sample small terrain textures directly from the approved painting used mirrored raster swatches in the continuous-world renderer. It was previewed through ACTUAL in-browser screenshots. **It failed**: the ground became a repeating collage with sharp checkerboard fragments and the remaining scenery still lacked height and organic detail. This was explicitly rejected by the assistant on visual inspection, not presented as progress. **The unapproved v1.3.7 implementation was reverted; stable executable baseline remains v1.3.6** with the full original adventure unaffected. The source-vs-world browser QA captures of the approved original paintings remain available. Do not resurrect that crop-and-mirror shortcut.

## The only acceptable next art-production approach

1. **Hand-authored sprites and seamless terrain atlases, not primitive Canvas graphics.** Produce genuine raster pixel art, with finished lighting and material texture, directly matched to `assets/village_v06_clear.jpg` and `assets/wilds_clean.jpg`. Needed independently isolated objects: snow-draped spruce/deciduous trees, varied snowy boulders and shrub/grass clusters, modular cabin roof/eaves/walls, timber rail fences, stone walls and stacked ice/cliff edges, flowing water/riverbanks, bridge deck/rails, village details, lantern lights and clear shadows. Match color ramps, lighting direction, grain, elevated three-quarter perspective and player-to-object scale in the approved original.
2. **Start with a single genuinely illustrated playable Hollowreach slice.** Reconstruct its forecourt/terrain *without* pasting the full approved scene behind the player. Show correct snow-to-rock transitions, layered cliff elevation, stairs, house depth and foreground occlusion. Validate real source screenshots side by side, including player movement, object collision and iPhone performance. Do not extrapolate across 12 regions until this single slice is creator-approved.
3. **Repeat one similarly finished Greenwood playable slice** with forest canopy, tiny flowers, mossy rocks, water and wooden paths, matching the same full-quality art grammar.
4. **Only after the two pilots are approved**, extend reusable authored asset families across the remaining 10 regions without breaking their approved roads. Audit real runtime screenshots (not mocked pixel-operations tests) on an iPhone before presenting a candidate for acceptance.
5. **Never use the original painting as a fake full map backdrop** or a pasted screenshot. The original painted scenes are the reference, not a substitute for real navigable tile, sprite and collision data.

## Navigation and game protections

Preserve the 12-region blueprint, 48 travel nodes, 65 source-grounded roads, all seven water crossings, topology and collisions; original hero and Warden sprite assets, the 4 illustrated original location scenes, quests, controls and save key. Work on visually isolated art modules. Never write "Phase 9 complete" or "art accepted" based on passing CI. No new polygon houses, circular trees or tube roads shall be presented as acceptable future world art.

## Current truthful status

The v1.3.6 extended-world preview remains a **functional but visually rejected topology test**. The original illustrated gameplay is still intact. A complete high-quality terrain/sprite asset pipeline has **not** been delivered; it must be the next work, rather than new filler props or procedurally reused JPEG patches.

[Play the unchanged original game and optional topology preview](https://hdog960.github.io/Vielward/) · [Browser source/scene comparison workflow](https://github.com/hdog960/Vielward/actions/workflows/visual-qa.yml)
