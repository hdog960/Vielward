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

## R25b correction: actual A/B screenshot source attribution
Real Chromium base-plus-one-stage screenshot captures isolated the bright 32-dot ring to `world_illustration.js`'s **clearing waypoint marker**, not the native R18 fern, climate tile atlas, physical tree art or cottage. The mark ring never represented collision or a valid collectible. It has been retired from the normal drawn world. The softer Greenwood forest-floor composition and original landmark remain. Road-only A/B showed short pale rectangular gravel marks produced by `world_routes.ribbon` on the physical corridors; those decorative fragments are now skipped in mature low-snow forest only, leaving road geometry unchanged. All debugging A/B painter masks have been removed from the normal QA capture, and the final screenshot is named `GREENWOOD_R25B_CLEAN_CLEARING`. **No visual approval or iPhone hardware claim.**

## R26: safe, connected leaf-bed composition (creator approval pending)

Retains R25b's removal of fake bright clearing chips. Greenwood's original 54-per-hub, deterministic painterly fern candidates are now evaluated in global world coordinates before chunk culling; nearby accepted mats are connected by low-alpha rounded soil/leaf-bed strokes **only when repeated samples confirm existing forest biome, no physical road, no water, no static obstacle and no rooted collision**. Connections have no walkability implications. Existing physical oak/pine roots receive wider directional dark/soft sun filtered-light underpainting; no invented decorative tree or impassable-looking forest wall. Covers actual Hearth/Hermit gameplay and unchanged road network. An R26-specific mock painter audit tests deterministic counts, all-road and all-water exclusion, anchors, original save key, and unchanged world nodes. GitHub browser QA captures \`GREENWOOD_R26_CONNECTED_GLADE\` and \`GREENWOOD_R26_HERMIT_CANOPY\`; technical QA is **not** creator's visual sign-off.
