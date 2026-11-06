# Veilward — Visual Recovery R2 (v1.3.6)
**Development lane:** mandatory post-Phase-9 environmental visual recovery; Phase 10 remains locked. Creator's last stated visual acceptance was **0%**. Passing tests or publishing this slice does NOT establish any change to that rating.

## What caused the v1.3.5 scenery to stay bare
Actual browser render captures showed the Wanderer standing at a safe road junction while key buildings were authored hundreds or thousands of world units away, outside the camera. The landscape had working collision, climate, bridges and trees, but still lacked cohesive *scene composition* at the character's scale. Existing `world_illustration.js` rendered a simple lodge/well and source timber building without any complementary nearby homes. Bridges also read as long geometric strips and cliffs were a single filled polygon with four rows of colored blocks.

## R2 implemented in playable source

**New `world_setpieces.js` (v1.3.6):** 38 hand-authored candidate offsets referenced to the actual, unchanged 13 landmark nodes. Unsafe candidates are rejected after checking authored land, full water/rock/route boundaries and existing trees. Source geometry currently accepts **29 distinct fixtures across 13 landmarks**: four shaded winter cottages, a Greenwood cottage, two open market stalls, a winter forge stall, a Thawline canvas tent, timber piles, village signs, Northwatch and Worldscar obelisks, ruins/stone walls, braziers, a real Frostbridge post and mushroom rings. They are pixel-detailed layered 3/4 silhouettes with roofing/shingles/stone footings/warm windows and shadows; they are NOT copied screenshots. Solid scenery has footprint collision inside the actual `world_stream.blocked()` movement path. Tiny mushrooms remain nonblocking.

**`terrain_art.js`** now draws those physical site compositions inside the actual streamed, globally aligned terrain tiles and replaces one-tone collision cliff fills with sandstone-like stepped stone strata, chips and snow crown detail clipped to the *same source cliff polygons*. Source collision shape not modified. Weather, other stones and all existing region roads remain.

**`world_routes.js`** now gives all five source bridges layered structural shadows, additional plank woodgrain/nails and chipped stone joints, and more readable multi-layer parapets. Rails remain rooted at the **exact same physical 87%-halfwidth centerline** used for collision. The dry ford and Mossmere east causeway remain open.

**`world_illustration.js`** keeps the R1.1 physical trees and hides the redundant flat Coldpine lodge graphic when the actual source-composed snow cottage is present. **`game.js`** now hides the intrusive top debug status in normal preview mode, retaining the Terrain Geometry Overlay switch for QA, so scenery is not obscured by a giant developer-text panel. The closer 224px real-compositor atlas still links to the correct footpoint.

**Protected:** 12 distinct region sources, 48 named travel anchors, all 65 authored paths, all 7 physical crossings, climbing and water collision, original Warden/Hero artwork, legacy adventure save key and all future roadmap phases. No invented teleport scenes. The art is new code, not a UI mockup.

## Test procedures
`npm run audit:setpieces` verifies all placed building/artwork footprint checks, actual movement collision, no travel-graph differences, safe narrow walking lanes along the entire 65-road network, material rendering/bridge rails, canvas draw calls and iPhone HTML/worker asset parity. `npm test` executes all legacy and new suites. Browser capture QA saves **five actual game-browser images**: Hollowreach starting preview, atlas, Greenwood, Coldpine and Frostbridge. The screenshot workflow is under `.github/workflows/visual-qa.yml`. Screenshots are evidence of actual browser pixels, **not physical iPhone frame rate or creator's final art approval**.

## User review and next R3
On iPhone open <https://hdog960.github.io/Vielward/>, confirm **v1.3.6**; Journey Menu → **Review Visual Recovery R2 (Phase 9)** → **Review World Map & All 12 In-Game Regions**. Tap Hollowreach, Greenwood, Coldpine, Northwatch and Frostbridge and roam slowly. Compare the actual road/roof/tree relationships and scene atmosphere against `assets/village_v06_clear.jpg` and `assets/wilds_clean.jpg`.

If still below the standard, **continue R3 rather than Phase 10**: individually authored higher-definition tile/sprite sheets, building-to-camera scale and silhouette refinement, a dedicated full village forecourt composition, richer vegetation canopy depth, bridge and river atmospheric art, performance QA on iPhone. Current procedural Canvas drawings remain an incremental artist draft, not proof of reference-matched final 32-bit quality.

**Approval gate:** only an explicit creator judgment based on the ACTUAL running game changes visual acceptance. Until then, stay in Phase 9 Visual Recovery and keep all geometric layout untouched.
