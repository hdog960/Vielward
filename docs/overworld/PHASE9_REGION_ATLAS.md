# Veilward — Source-authored Phase 9 Region Atlas

The **playable v1.3.3 atlas is the visual artifact**, not this text page. Open the game, enter continuous overworld preview, and select **Review World Map & All 12 In-Game Regions**. Its twelve 160×160 previews are rendered directly from `terrain_art.paintChunk`, the same pixel/material/scenery compositor as gameplay, sampled at each real map anchor. They are not generated concepts. Tap any region for a true in-world visit and walk.

| Region | Atlas source anchor | What the creator should evaluate |
|---|---|---|
| Hollowreach · Frostbridge | village | Snowy settlement forecourt, mountain paths, village-scale art |
| Northwatch Heights | northwatch_plaza | Memorial stone terrace, height, ice and rock |
| Coldpine Ridge | colp_ridge | Alpine evergreens, northern pass and sightlines |
| Frostbridge River | bridge_e | Glacial water and broad village crossing |
| The Thawline | thaw_camp | Gradual patchy snow, meltwater and moss |
| Greenwood | greenwood_hearth | Rich temperate canopy, forest roads, herbs |
| Greenwood Falls | falls_e | River, waterfall-adjacent stone and overlook |
| Mossmere Basin | island | Lake island sanctuary, wetlands, two crossing decks |
| Heatherwood Commons | commons | Open meadows, market road and settlement placement |
| Old Crown Road | oldroad_w | Broken stone trade roads, watchtower and ruined edges |
| Smuggler's Ravine | ravine_bridge_w | Dry gorge, rope/timber bridge and side trails |
| Worldscar Uplands | worldscar_ring | Frozen eastern upland, glowing stones and arcane character |

The **gold overview path** is the proposed future, geographically real mechanics testing slice: `village → bridge_w → bridge_e → thaw_upper → greenwood_gate → greenwood_hearth → greenwood_east → oldroad_w → oldroad_e → ravine_w` (**Hollowreach → Frostbridge → Thawline → Greenwood → Old Crown → Smugglers**). All outdoor regions remain on the same physical map.

## Required approval
The creator should approve or request changes to the *entire actual rendered outdoor visual world*, including the art style, map scale, biome composition, crossings, scenery density and accessibility. This is the mandatory Phase 9 checkpoint. Automated screenshots of Canvas mocks and programmatic route tests do not grant approval. **Phase 10 must not begin until the creator explicitly says so following this visual review.**
