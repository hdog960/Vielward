# Phase 9 R37 — Greenwood Falls rooted forest and cliff composition

**Status:** Integrated source art, not creator-approved. Phase 9 active; Phase 10 locked.

R36b corrected fake stone pylons and repeated fern stripes, but left the Falls overlook visually isolated. R37 establishes physically grounded old-growth vegetation around the authentic `falls_overlook` source node. A reproducible asymmetric distribution proposes up to 14 original oak/pine tree locations. Each position must pass land, original road-buffer, source water, obstacle, existing root and landmark clearing checks. The player and central real staircase remain open; each accepted new trunk is a **real collision footprint**, never an unblocked painted false tree.

The continuous forest painter `world_greenwood_art.paintFallsRootedGorge` uses root-origin shade and modest native R18 fern painting as woodland ground beneath actual trunks. `paintFallsCanopyBoughs` adds original R18 upper-crown art attached to those same physical trees in the live, player-depth-sorted native canopy layer. Nothing is a static screenshot behind actors. Every shadow and image is world-anchored, making streaming chunk borders consistent.

**Verification:** `npm run audit:greenwood-r37` checks native source image crops, tree collider presence, water and source road setbacks, central vista safety, saved-game key and the 48-node/65-road/7-crossing invariant. The visual QA script captures `GREENWOOD_R37_ROOTED_FOREST_CLIFF` from the actual playable browser game alongside its R36b baseline.

**Outstanding:** inspect the real composition for monotony at iPhone scale; refine rock/river-to-forest cohesion beyond the overlook. Physical iPhone QA and creator aesthetic signoff remain outstanding. Visual approval stays 0%. Existing original illustrated scenes and quest/save progress remain protected.
