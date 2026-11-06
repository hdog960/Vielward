# Veilward — Phase 9 Hollowreach Authored Raster Pilot (v1.3.8)

**Creator visual acceptance remains 0% until the creator explicitly reviews and approves actual screenshots. Phase 10 remains locked.**

## Why the strategy changed

The creator compared the expanded overworld to the original game. The old map's primitive Canvas trees, road tubes, empty terrain and polygon cabins were plainly inconsistent with the painterly pixel-art depth and handcrafted architecture of the original game. More procedural decoration is not acceptable as a substitute for finished assets.

## What is now implemented in the ACTUAL playable overworld

A transparent **288×96 PNG raster sheet** at `assets/hollowreach_pilot_sprites_v1.png` contains three distinct hand-illustrated environment sprites: (1) a snow-heavy winter evergreen, (2) a shingled timber cottage with warm windows, (3) an icy cliff/rock formation. They are real PNG pixels with transparency, not full-scene backgrounds, CSS stickers, Canvas polygon buildings, or crops of the original complete location painting.

`world_raster_pilot.js` decodes the real PNG before a world-preview session may load. It places the winter sprites **at already existing source physical positions**. `world_illustration.js` routes Hollowreach mature and young trees, rock features and physical smithy through the new painter. `terrain_art.js` draws Hollowreach winter cliff faces using the raster asset, while `world_setpieces.js` can selectively suppress old primitive geometry when raster replacement is active. `world_stream.js` verifies physical boundaries and preserves all authoritative routes; old procedural Hollowreach decorations that are hidden cannot leave invisible polygon colliders.

**Crucial scope:** This is an ART PILOT for the Hollowreach region only, not a finished environment. Some old ground, bridges, broad roads, extra foliage, stones and other parts of the map are still placeholder-quality. All other regions are functional map topology tests, **not 100% complete visual work**.

## Protections and QA

- 12 source regions, 48 named world travel nodes, 65 physical roads and seven crossings preserved.
- Original fully illustrated Hollowreach adventure/Greenwood scenes and approved hero/NPC sprites unchanged.
- Original `veilward-hollowreach-v01` quest/localStorage key unchanged; no save data migration.
- Versioned iPhone service worker rotates cache `v138-hollowreach-raster`, precaches the new PNG and script, so the Home Screen app can update.
- `npm run audit:raster-pilot` checks that the PNG is transparent and correctly dimensioned, that it is loaded and rendered in the real world, source collision and roads are unchanged, and iPhone/browser asset parity.
- Existing Phase 1–9 and R1/R2 regression tests remain active; five real-browser captures are required as an independent visual check. Passing tests do **not** mean the artwork matches the source benchmark.

## Acceptance and next development slices

1. Verify playable in-game Hollowreach screenshots side-by-side with the original `assets/village_v06_clear.jpg` and fix sprite scaling, ground integration, relative roof/tree scale, occlusion and palette, while keeping all roads intact.
2. Replace the remaining primitive underfoot terrain with genuine authored **large seamless pixel-art** snow/path/stone/cliff/water tiles; no random crop-and-mirror mosaic experiment.
3. Create the rest of the actual standalone Hollowreach object atlas: fences, stair modules, lamps, snowy shrubs, bushes, house variations and bridges. Decommission matching old procedural objects.
4. Obtain the creator's explicit visual acceptance of a complete coherent Hollowreach playable area (not just a single nice sprite).
5. Repeat as one finished Greenwood pilot, then the remaining 10 regions. Only after whole-world art approval resume Phase 10.

**Version note:** v1.3.8 is only the first binary asset/mapping integration; visual acceptance must not be increased from 0% without the user's evaluation.
