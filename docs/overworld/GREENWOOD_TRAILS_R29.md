# Vielward Phase 9 R29 — native worn Greenwood tracks

## Why this change
The last actual-play R28d image corrected a tree-canopy overlap but made the intersection appear bare again. The 720×405 camera cannot safely accommodate many more large physical roots near the four-way Hearth; the full physical route network and illustrated cottage correctly prevent trees growing into walkable approach lanes. More fern confetti or fake background trees will not fix this.

## Actual implementation
\`world_routes.js\` now renders a dedicated woodland trail treatment **only when both endpoints belong to Greenwood** and the route is not a crossing. The real original road source geometry and all bridge/ford/stair rules remain unchanged. Every road segment has a gentle, endpoint-zero lateral variation (less than 6 world units), safely within the approved corridor. Five softened and darkened ground strokes create contiguous moss banks, organic packed-earth shoulders and a narrow worn center. Sparse, elongated low-alpha soil/lichen glazes add wear without bright repeated debris chips. Original \`world_greenwood_art.paintRoadVerges\` continues to blend with the material underneath. No geometry, player physics, building or source sprite asset is changed.

## Regression and acceptance
\`npm run audit:greenwood-r29\` checks original 65 roads and 7 crossings, unchanged paths and widths, exact continuity at all four Hearth connections, muted road pigments, non-rectangular patches and original save key. The actual-browser screenshot is \`GREENWOOD_R29_WOODLAND_PATHS\`. Technical tests are not art approval. iPhone hardware validation remains outstanding; Phase 9 ACTIVE, Phase 10 LOCKED.
