# Vielward — Phase 9 R30, Physically Rooted Forest Overstory

The R29 screenshot shows a crossroads that looks like an open grassy lawn with softened tracks, despite the original mature illustrated trees around it. R30 deliberately does not solve the problem by adding fake forest walls or more repeating procedural shrub stamps.

## Production change
- Source mature oak and pine objects from \`footprint.cells\` and \`footprint.groves\` around the approved Hearth anchor. Deduplicate by original physical object ID, filter to original Greenwood and land, and cache deterministically for seamless streamed chunks.
- Paint large low-chroma, asymmetrical elliptical crown-shadow volumes under the roads. Their shapes scale with real rooted canopy radius and oak/pine type. Subtle filtered sunlight cuts into each shade with curved organic taper; no floating white flecks or canvas-square marks.
- Where two genuinely rooted tree crowns meet, paint restrained passable shade linking only across existing land, outside water and the original travel lanes. The link adds **no tree trunk, gameplay collider, false doorway, route, or sprite**.
- Continue to paint the source R18 illustrated oak/pine trunks and the actual road compositor above this ground shading, retaining the approved sprite proportions and correct foreground character clearance from R28d.

## Test contract
\`npm run audit:greenwood-r30\` validates one-pass deterministic world coordinates, root sourcing, softly blended rather than repeated square elements, no extra image sprites or collision, no changes to the 48 node / 65 road map and the unchanged save identifier. Browser QA captures the **actual playable game** as \`GREENWOOD_R30_OVERSTORY_LIGHT\`, in the same Hearth camera. Neither source tests nor screenshot completion are creator visual acceptance. Physical iPhone test remains outstanding. Keep Phase 9 ACTIVE, Phase 10 LOCKED, creator visual acceptance at 0%.
