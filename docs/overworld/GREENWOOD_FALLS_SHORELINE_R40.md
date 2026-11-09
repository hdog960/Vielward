# Veilward — Phase 9 / R40 native physical shoreline recovery

**Base:** R39c `d4c502c`. **Status:** Implementation, not creator art approval. Phase 9 active, Phase 10 locked.

## Root cause found in actual gameplay screenshot
The Falls river looked like a straight cyan diagonal because R35d clipped its correct physical 180-unit river polygon and filled all the way to its dry-bank boundary in a sharply contrasting blue-green material. The R39 native dry-bank rocks correctly lay on land, but they could not fix a hard paint join beneath them. Widening the water *collision* or shifting shore points would have made the art lie about traversal.

## R40: actual rendering changes
- New `terrain_art.fallsShoreBands(bounds)` builds both original river banks from the R35d Frostbridge centerline, sharing the same vertex normals. At each source section the cross-bank paint spans **114–286 world units** from the channel centerline, feathered around the unchanged physical **180-unit water limit**. Paint fades from transparent blue-green water through desaturated wet moss and back to transparent original dry woodland; no cyan/white outline, square checkerboard or arbitrary parallel waterway.
- The blend is painted after the original source forest floor and before physical paths/decks, so the route remains legible and the forest-and-water contact is integrated in the real streamed world. Sections are culled in world-space, never tile-local. No new static textures, no image generation, and no added collision.
- A few subtle, short, flow-aligned current accents may appear only on the water side; there are no apparent stepping stones or alternate walks.
- The original R39 dry riverbank rock treatment now attaches restrained, un-stretched R18 painted fern clusters on the verified landward side of selected real bank rocks. Source geom, forest roots, crossings and water are unchanged.
- All PWA cache URLs for `terrain_art.js` and `world_greenwood_art.js` and the service-worker version rotate, so the iPhone Home Screen loads this pass as one consistent unit.

## QA gates
- `npm run audit:greenwood-r40` checks the same 180-unit hazard, geometric band coordinates, both sides, actual gradient calls, cross-tile culling, other regions untouched, 48/65/7 source network, save key and script/cache parity.
- `scripts/visual_capture.mjs` records **`GREENWOOD_R40_FEATHERED_RIVERBANK`** from the *real game* at R39's already proven physically dry riverbank actor point. Browser check validates the actual terrain painter, source river, dry player location and unmodified crossings.
- Full npm regression, JS syntax, real Playwright screenshots and Pages build must pass before claiming deployment verified.
- **Acceptance is still withheld** pending physical iPhone review and the creator's inspection. Passing tests does not mean aesthetics are approved.

## Next priority
Inspect the actual R39 vs R40 river screenshots. If hard line remains, refine the exact-source water mask and original-bank atlas blending without inventing phantom cliffs or disconnected props. Then complete the wider 2.5D forest-and-cliff art composition.
