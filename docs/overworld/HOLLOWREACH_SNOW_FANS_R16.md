# Vielward — Phase 9 R16 (v1.3.23)

## Why this slice exists
The v1.3.22 browser screenshot showed a more detailed painted cliff at the extreme left of the image and a long flat snowfield between that cliff and the actual road. Adding more isolated bushes or rocks would repeat the problem the creator previously rejected.

## Real in-game change
`drawSourceSnowFans(ctx,bounds)` now derives three broad snow deposition fans **only** from the original polygon-foot locations of `hollowreach_west_snow_terrace`, `hollowreach_north_terrace`, and `hollowreach_west_lower_lip`. Wind-disturbed natural curves use the bounding shape of each real rock formation to define an overlapping, seamless material patch. Native authored winter material texture and cool contact gradients blend the cliff toes into their surrounding walkable ground. The original roads are painted later, so physically marked paths remain readable and unobstructed.

The ground background painter now runs this escarpment work for chunks within 2,650 world units of Hollowreach, not only the old 1,280-unit square. The existing plaza stones, cottage entrance art and original source building sprites are processed only for nearby square chunks, avoiding excessive draw workload for distant tiles.

## QA
Added `tests/hollowreach_snow_fans_r16.test.js` to the existing full `npm test`. It verifies: no distant map contamination; exactly three real cliff-deposition shapes; atlas patterns and clipping; deterministic repeatable rendering; unchanged 12 regions, 39 solids, 48 original passable nodes, 65 routes, seven crossings, and saved quest key. Also added the real player-view `HOLLOWREACH_R16_SNOW_FANS` capture to browser QA, which must inspect a genuinely walkable location near the escarpment.

## Acceptance
**Phase 9 remains active. Visual acceptance remains 0%. Phase 10 remains locked.** This is a physically grounded environmental continuity correction, not a final illustrated 32-bit scene. Greenwood and the rest of the large map still need cohesive original, pixel-rich assets, building/landscape integration, depth and ambience. Physical iPhone QA is not established by Chromium tests.
