# Phase 9 R39 — Greenwood Falls source-native bedrock and river escarpment

**Implementation checkpoint:** Original source-asset scenic improvement. This does not confer creator approval (still 0%), does not unlock Phase 10, and does not replace physical iPhone testing.

## Why this is the next slice

In the R38d *actual browser game capture*, the two physically rooted forest silhouettes improved the camera's edge composition, but the intervening ground was broad and flat. The real Frostbridge channel is geographically distant from the overlook; painting a sheer impassable cliff beside the player without the matching source collision would be dishonest. R39 therefore treats these as two separate but related art tasks:

1. **Overlook's walkable, shallow geology:** eight curated asymmetric low-relief stone/moss terraces. The **existing real R18 painted rock/fern atlas** remains the visual material. Each stone has an organically feathered base plus subdued native rock and fern detail, not standalone bright blocks or repetitive banded stripes. Terrain locations are world-anchored to the unchanged `falls_overlook` node, screen-composed around the R38 planted old-growth forest and real staircase. Original route surfaces draw above the brush; no path or collider changes.
2. **Real river gorge:** original native painted rock ledges on the dry `frostbridge_river` bank locations validated by the existing R34 source sampling. These stay away from physical water and source roads, with conservative alpha and no invented river geometry or shortcuts.

## Acceptance and controls

- New painter `paintFallsEscarpmentFloor(ctx,bounds)`: renders low-relief source R18 native rock and fern groupings only on the actual Greenwood Falls landmass, while protecting existing water/geometry/roads. The exports `fallsRockCandidates()` document the original eight world-anchored compositions.
- New painter `paintFallsRiverNativeLedges(ctx,bounds)`: uses **only existing dry source riverbank coordinates**. No changes to water/crossings.
- Both are integrated into `paintForestFloor` beneath the actual routes. No new images, dependencies, runtime network requests, actors, building edits, animations, save key changes, or collision mutations.
- `npm run audit:greenwood-r39` checks original R18 atlas crops, site culling, 48 node/65 road/7 crossing topology, unchanged save, and existing artist lock.
- `scripts/visual_capture.mjs` checks physical-source coverage and captures two **real playable in-browser scenes**: `GREENWOOD_R39_BEDROCK_OVERLOOK` and `GREENWOOD_R39_SOURCE_RIVER_GORGE`. These are not assistant-generated before/after concept images.
- GitHub Pages PWA service-worker cache rotates to the new R39 asset URL.

## Next art slice

Inspect the true 720px landscape screenshots. If the terracing remains visually repetitive or makes the walkable ground look blocked, revise native image masses and edge transitions rather than accepting by passing programmatic tests. Preserve the original beautiful high-resolution pixel illustration direction, character silhouettes and routes. Physical iPhone playtesting and creator art approval remain outstanding.

## R39c screenshot-driven polish and QA correction

The real R39b overlook frame showed that several original bedrock groupings remained off-camera or visually too faint. R39c re-anchors the eight original painted rock beds around the **actual live 720px overlook view**, retaining native source proportions and improving opacity while leaving the approach corridor visible. The real-bank browser review previously attempted to stand the Wanderer at a dry *bank painting source pixel*, which is not necessarily a safe character-foot coordinate. The updated QA camera follows the original bank's water-to-land normal until it finds a collision-verified, fully dry player location. This is an **in-memory browser QA-only repositioning**, not a gameplay map or collision edit.

The PWA asset URL and cache key were rotated again to ensure actual iPhone Home Screen users receive the new art rather than the older cached shader.
