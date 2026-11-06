# VEILWARD — Complete Overworld Master Map

**Phase 2 status: DESIGN BLUEPRINT — NOT THE LIVE GAME.** Prepared November 5, 2026. This is the source-controlled, editable layout behind the planned **continuous outdoor world**. The currently playable v1.2.6 still uses separate village, Greenwood and cave imagery. Phases 3–9 will turn this blueprint into real outdoor terrain, streaming, geometry, lighting and art.

**Open the schematic master map:** [MASTER_MAP.svg](./MASTER_MAP.svg) · **Structured authoring data:** [world_blueprint.json](./world_blueprint.json) · [Phase 2 validation](./PHASE2_TOPOLOGY_AUDIT.md)

## The geography, in plain language

The player begins in **Hollowreach**, a snowy upland village on the west side of an alpine river. The river starts high in **Coldpine Ridge**, winds past the village and mountain crossings, descends through a long **Thawline**, and empties into **Mossmere Basin** farther south-east. The winter-to-green transition follows distance, descent and sun exposure rather than a magic wall.

To the north, snowy **Coldpine Ridge** connects to **Northwatch Heights**, where the monument is circled by navigable paths instead of standing behind an unapproachable fence. Northwatch's east descent leads toward Greenwood. **Greenwood** is a whole forest region with real road forks, a hermit, herb pockets, natural riverside terrain, bridges and **Greenwood Falls**. Past the eastern woods, the **Old Crown Road** runs along the ruins toward the stone ascent to the **Worldscar Uplands**. The same road continues south toward **Smuggler's Ravine**, where a physically illustrated cave mouth leads to the separately enclosed Smuggler's Hollow.

The south has its own loop: a stone ford leads from the southern snowy trail to lower Greenwood; downstream, waterfalls flow into a lake, whose **Mossmere island** is reached by an explicit western wooden footbridge and eastern stone causeway. Trails around the lake lead into the meadow roads of **Heatherwood Commons**, then join the eastern ravine and Crown Road approaches. The world is a connected network of routes and returns, not a row of isolated art cards.

## Source layout and proposed scale

| Design parameter | Phase 2 proposal | Explanation |
|---|---|---|
| Map drawing coordinates | 0–1,200 east × 0–800 south | Editable diagram positions; **not** coordinates in the old 900×584 JPGs |
| Future world coordinate scale | 60 game-world units per diagram unit | Derived proposal; subject to later art/performance validation |
| Full outdoor bounding area | 72,000 × 48,000 world units | One exterior coordinate space, not a pile of four scenes |
| Preliminary streaming grid | 48 × 32 logical chunks | 1,500 world units/chunk, **1,536 planned cells**, *not 1,536 finished images* |
| Elevation | 6 interconnected height bands | Stairs, ramps and switchbacks explicitly change elevation |
| Major anchors | 48 | Named intersections, entrances, overlooks, crossings and hubs |
| Planned links | 65 | Every link is a physical path, road, stair, bridge, ford or causeway |
| Water/chasm systems | 3 | Glacier-fed Frostbridge River, Mossmere Lake and Smugglers' Chasm |
| Physical crossings | 7 | 4 river crossings, 2 lake-island crossings and 1 canyon rope bridge |
| Macro-regions | 12 | All approved regions represented in the full outdoor surface |

The **1,500-unit logical chunk** is a preliminary performance and authoring target. It is NOT a promise of 1,536 giant textures resident in memory; Phase 3 must set art-resolution budgets, stream/cull regions, and profile actual iPhone memory. The area is intentionally larger than a stretched screenshot but its final inhabited density and travel clock remain adjustable through real playtesting.

## All 12 regions and their purposes

| Region | Height / terrain | Exploration purpose and logical connections |
|---|---|---|
| **Hollowreach · Frostbridge** | Level 4; snow settlement | Joren's workshop, inn, guard, noticeboard, village square; roads north, south and across the river |
| **Northwatch Heights** | Levels 5–6; alpine stone and snow | Circling monument, summit lookout, proper stairs, highland return loop; northern span and east ridge descent |
| **Coldpine Ridge** | Levels 5–6; alpine evergreen | Predator ecology, mountain herbs, lodge, pass view; north route linked to village and span |
| **Frostbridge River** | Levels 1–6; running glacier water | Riverbanks, fishing spots, real decks and fords; begins on ridge, drains into lake |
| **The Thawline** | Levels 2–4; snowmelt belt | Gradually retreats from frozen ground to moss and grass; connecting roads and safe camp |
| **Greenwood** | Level 2–3; green woodland | Herbs, hermit, old roads, differentiated trails and reliable non-colliding foliage |
| **Greenwood Falls** | Levels 2–3; cascade valley | River lookout, stone crossing, stair routes and lower riverbank trail |
| **Mossmere Basin** | Level 1; marsh and lake | Walkable shore loop, two real island crossings, isolated but accessible discovery site |
| **Heatherwood Commons** | Level 2; meadow | Trade camp, crossroads, meadow side routes and southern return loop |
| **Old Crown Road** | Levels 3–4; historic stone road | Watchtower, road junctions and access to the upland ruin/canyon approaches |
| **Smuggler's Ravine** | Levels 3–4; broken canyon | Rope bridge, canyon rim, cave threshold and a southern return to the meadow route |
| **Worldscar Uplands** | Levels 4–5; ancient stone/arcane | Elevated switchbacks, ring of stones, meaningful magical site and a second return route |

Region **influence polygons overlap intentionally** where weather, vegetation and terrain blend. They are macro-geography guidance, *not* final collision/roof/flower masks. The single exterior world should use source terrain layers for collision, elevation and visuals rather than overlay guesses on painted JPGs.

## Three different Hollowreach → Greenwood journeys

| Route | Physical crossing | Blueprint itinerary | Uninterrupted walking estimate* |
|---|---|---|---:|
| **Main road** | Frostbridge timber deck | Hollowreach → Frostbridge west/east landing → upper Thawline → Greenwood gate → clearing | ~2.85 min |
| **Northern scenic loop** | Northwatch stone-and-timber bridge | Hollowreach north trail → bridge → climb Northwatch monument stairs → ridge return → Greenwood north approach → clearing | ~4.44 min |
| **Southern lower road** | Raised Stoneford stepping stones | Hollowreach south road → meltwater camp → lower Thawline → Stoneford west/east landing → South Greenwood → clearing | ~4.24 min |

*Estimates are mathematical planning-only values: authored node-and-waypoint centerline length × 60 world units per diagram unit ÷ 165 assumed walking units/second. They exclude combat, looking around, slopes, gathering, revisits, and real collision. They are not timings measured from an iPhone build, and do not represent a guaranteed game length. The direct schematic main-quest walk from the village to the ravine cave mouth is ~6.3 minutes under the same assumptions.*

All three routes cross the **same river at separately designed, visible structures**. If the main bridge cannot be traversed, the northern and southern alternatives still connect Hollowreach to Greenwood. There is **no outdoor Enter marker** on any of these routes.

## Seven named crossings with physically believable endpoints

| Crossing | Type and purpose | Footing / rule |
|---|---|---|
| Northwatch span | Stone/timber river bridge upstream | West snow bank ⇄ east highland bank; true bridge deck |
| Frostbridge main | Wooden village river crossing | West village approach ⇄ east Thawline road |
| Stoneford shallows | Raised stone ford/steps | South Thawline ⇄ south Greenwood; stones above water remain a guaranteed walk route |
| Greenwood Falls crossing | Small stone pedestrian bridge | Upper west riverbank ⇄ eastern lookout stairs |
| Mossmere west footbridge | Wood and rope over lake | West shore ⇄ island; no swimming shortcut |
| Mossmere east causeway | Stone path through shallow bay | Island ⇄ eastern shore; visible landing |
| Smugglers' ravine rope bridge | Timber deck over a dry canyon | West canyon rim ⇄ east cave approach; no chasm shortcut |

Two tempting false paths have already been rejected at the design level: a road across the Thawline river without a bridge, and a lake-shore route drawn straight through water. The blueprint **tests intersections** against river and lake planning geometry. This isn't a replacement for terrain-grid collider authoring, but it prevents committing fundamentally impossible routes.

## Travel and exploration density — preliminary production targets

For an average wilderness stretch of **10 traversed planned chunks**, the *design guideline*, not implemented content, is:

| Feature class | Intended range |
|---|---:|
| Hand-composed terrain vignettes / environmental cues | 4–7 |
| Harvestable or useful resource opportunities | 2–5 |
| Wilderness encounters | 1–3 |
| Optional discoveries/secrets | 0–1 |

These are pacing targets rather than a promise of hundreds of already authored enemies and art assets. **Hollowreach** is a safe settlement and has zero hostile ambient encounters in its town streets. **Coldpine** uses predators more frequently; Greenwood has forest wildlife and outlaws; **Smugglers' Ravine** is comparatively hostile; **Worldscar** favors fewer, distinctive magical threats.

The map currently has **12 major regional anchors, 13 explicitly designated landmark/lookout/entrance nodes and 7 physical crossings**. That is a *macro route and geometry blueprint*, not the complete micro-POI or enemy placement schedule. Fine-scale placement must be authored within actual terrain chunks in Phases 5–8, not auto-distributed uniformly.

### Terrain composition and vegetation continuity

- **Upper bands 5–6:** alpine snow, ice, stony treelines, cold wind exposure and narrow passes. Cliffs are not walkable surfaces.
- **Village band 4:** compact snow roads, real porch/stair thresholds, undercut river edge, bridge decks and guard posts.
- **Thaw band 3:** patchy snow → wet stones → moss → hardy grass; gradual shade-exposure transition, no instantaneous landscape swap.
- **Greenwood and meadow band 2:** forest soil, tall trees with real trunk footprint, flowering edges, believable streams, ruins over older roads.
- **Basin band 1:** wetland mud, reeds, rock shoals, authored lake shore, two-sided island crossing.

The alpine Worldscar site can have high-altitude snow remnants **despite being far east**; geography should justify weather, not merely X-position. Five sketched major contour routes are stored in the editable source data. They are not yet finished navigable mesh layers.

## Entrances, landmarks, and player feedback

**Physical thresholds:** Joren's workshop door and Smuggler's Hollow cave mouth are authored as real doorway nodes. They will trigger intentional enters in later phases, not outward background swaps. A cave exit must return beside its exterior doorway, not to an unrelated teleport pad.

**Monument:** Northwatch's stone stairs, memorial plaza and back terrace form a walkable circle, solving the screenshot's inaccessible shrine complaint.

**Island:** The two authored crossings make the island reachable and make it easy to leave. It must reward the detour in Phase 20.

**Worldscar:** The accessible standing-stone ring is approached by road/stairs and has a loop back to the Crown Road, rather than being unreachable scenery. Gameplay consequences will be refined later without duplicating existing attunement rewards.

**Road ends:** Joren's workshop is a deliberate *doorway endpoint*. Market/cave/overlooks have paths in both directions or loops, and no path advertised as walkable stops mysteriously in bushes.

## Scope boundary and next steps

- **Delivered now:** `world_blueprint.json`, source-generated `MASTER_MAP.svg`, readable layout and physical routing plan, explicit river/island crossings, elevation/climate hierarchy, migration anchors and topology validation.
- **Not delivered yet:** visual pixel-art overworld, actual outdoor chunk files, collision-grade height map, playable seamless traversal, physical cave/door entrance updates, animated enemy sheets, full quest integration. No runtime/source/game asset modification happened in Phase 2.
- **Phase 3 (next continuation):** prototype the *real* global coordinate/chunk-streaming runtime **without discarding the current stable playable game**, introducing an incremental, testable migration path. On success, next phases co-author terrain geometry and art from the same source data.
- **Phase 9 (mandatory stop):** creator must inspect **the actual complete playable outdoor overworld appearance** and approve its regions/layout before Phase 10. This Phase 2 blueprint alone is NOT that visual approval.

**Source:** [Creator's Phase 1 requirements](./ISSUE_REGISTER.md) and [approved roadmap](../../OVERWORLD_REBUILD_ROADMAP.md).
