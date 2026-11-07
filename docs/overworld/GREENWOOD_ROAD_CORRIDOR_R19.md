## Phase 9 R19b — v1.3.27: visual QA rejected geometric verges, replaced with graded forest soil

The first R19 real-browser screenshot confirmed the mature Greenwood tree art improved proportions, but its dark, nearly flat quadrilateral road shoulders did NOT meet the creator's painterly visual standard. R19b removes the harsh block-band appearance by using distance-to-trail **feathered Canvas gradients** that fade at both inner and outer edges of each source-road verge, retaining irregular natural ground outlines and native fern illustration. All existing source geometry, physical travel/collision, PWA saves, original painted sprites and route order are unchanged. Real in-game visual capture `GREENWOOD_R19_ROAD_CORRIDOR` is retained, and `tests/greenwood_verges_r19.test.js` now checks the feathered gradient rendering path.

This is further Phase 9 art recovery, **not visual acceptance**. True large-scale woodland architecture and more sophisticated forest-floor sprite coverage remain unfinished. Visual acceptance 0%, Phase 9 ACTIVE, Phase 10 LOCKED.

# Vielward — Phase 9 R19: Mature Greenwood & Forest Road Integration

**Build:** v1.3.26. **Status:** Phase 9 continues, visual acceptance 0%, Phase 10 locked.

## Problem observed in real gameplay
R18's painted oaks and pines were original and detailed but too small next to the player, with broad flat green terrain and beige paths cutting across it. Repeating more isolated flowers would make the scene worse. This work addresses scale and continuous source-bound ground relationships.

## Implemented
- `world_greenwood_art.js` increases the rendered oaks from 3.3 × 4.2 trunk-radius units to 5.4 × 7.0 and pines from 2.9 × 4.6 to 4.6 × 7.6, leaving the physical source coordinates, collider radii, tree kinds and art cells unchanged.
- `paintRoadVerges(ctx,bounds)` reads the **existing** original `geometry.roads` source. Non-crossing segments whose actual midpoints lie inside Greenwood get two wide, softly colored, irregular ground strips each side of the originally walkable route. The original road image paints AFTER these layers, retaining exact path edges and safe crossing/navigation.
- The painter occasionally uses the existing R18 independently illustrated fern cell at low opacity within the roadside duff, creating true flora-to-route contact rather than unsupported scenery stickers. Greenwood outside the source biome and water/chasm crossings are excluded. No new fake walking paths, buildings, blockers, or world-data changes.
- Test `tests/greenwood_verges_r19.test.js` verifies four verge layers per original segment, non-Greenwood exclusion, no physical mutation, and mature oak/pine placement. Browser QA captures an actual **walkable** `GREENWOOD_R19_ROAD_CORRIDOR` view.

## Safety and quality bar
The full original 12-region world, 39 obstacle solids, 48 grounded traversal nodes, 65 road links, seven crossings, approved hero and Warden sprites, quests and `veilward-hollowreach-v01` player save key remain untouched. Service worker build v1.3.26 refreshes the iPhone Home Screen app automatically when permitted by the OS.

**Do not advance to Phase 10** without explicit user approval of the playable world's visual style. This is a meaningful composition improvement, not the desired fully illustrated premium environment. Physical iPhone performance and appearance still need user/device inspection; browser checks are not a substitute.
