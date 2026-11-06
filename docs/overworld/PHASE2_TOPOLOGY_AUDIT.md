# VEILWARD — Phase 2 Geography / Traversal Audit

**Audit status:** Source-geometry topology passed; **not actual game collision, character grounding or iPhone art sign-off**.  
**Source:** `world_blueprint.json`, rendered master schematic `MASTER_MAP.svg`, creator PDF complaint register and approved roadmap.

## Validation summary

The complete world model has **12 macro-regions**, **48 permanent route/landmark anchors**, **65 unique physical travel links**, **3 waterways/chasm systems**, **7 purpose-built crossings**, and **3 deliberately distinct village-to-forest journeys**. The JSON is the source of truth; the vector map is deterministically regenerated using `scripts/render_overworld_blueprint.js`. Running `node tests/overworld_phase2_topology.test.js` validates the graph, crossings, geography, approval checkpoints and map/output parity.

### Checks and what they actually prove

| Topic | Phase 2 check | Limit |
|---|---|---|
| World coverage | Every approved region has a named representative anchor; all 48 anchors are reachable from Hollowreach in a 65-edge undirected travel graph | Edges are designed, not yet actual walking surfaces |
| No dead-end illusions | Only a real building doorway is a degree-one trail endpoint; scenic points and cave/market nodes participate in real routes | Painted paths and collider alignment still must be authored |
| Multiple routes | Three distinct Hollowreach→Greenwood itineraries cross via different bridges/ford; after disabling one crossing the village and forest remain connected | Route geometry/grade needs actual ground mesh before on-device acceptance |
| River crossing honesty | Geometric segment intersection against Frostbridge River centerline rejects unmarked line crossings | A centerline test doesn't guarantee riverbank artwork is correct |
| Lake and island | Lake shore edges avoid lake polygon; island sits inside its own land polygon; bridges/causeway are the only links to island | Physical edge texture, splash/ford mechanics and foot shadow await runtime |
| Ravine bridge | Chasm centerline cannot be crossed by a road that lacks an explicit real span | Drawn platform, elevation and foreground ropes still unimplemented |
| Height | Six elevation levels; any level-changing edge must name a ramp, switchback or stair; invalid cliff shortcuts are rejected in planning | Does not assert stair collision in the current game |
| Pacing | Route length from authored coordinates/waypoints × 60 ÷ 165 walking speed produces planning minutes | Not measured time; encounters and user exploration are excluded |
| Visual map fidelity | Renderer output is byte-for-byte identical to a map reconstructed from structured geography | Diagram is **not** production pixel-art terrain |
| Protection | Baseline save key recorded, no actual gameplay source written in Phase 2; creator review gate after Phase 9 | Real migration and device QA belong to subsequent phases |

**Source validation:** 943 topology/design assertions passed in a simulated Node-compatible harness before GitHub commit; after push the GitHub Actions workflow runs the Node scripts. The number represents checks of the **planning model**, not 943 real in-game movement or visual acceptance tests.

## River and barrier geometry

- **Frostbridge River:** starts in the Coldpine snowfields, descends to Mossmere Basin. Four dedicated crossings: Northwatch span, main Frostbridge, raised Stoneford and Greenwood Falls crossing.
- **Mossmere Lake:** closed water body with small island polygon. The island is reached only by a western footbridge and an eastern causeway. The lake perimeter route follows land outside the lake polygon, not an invisible interior dry route.
- **Smuggler's Chasm:** dry steep ravine, not a tributary. The wood/rope bridge is the one designated rim-to-rim crossing. A separate lower southern trail passes around the rim toward Heatherwood.
- **Elevation and realism:** no free movement across glacier/river/lake, cliff or cavern void. All planned routes use available ground or explicit crossing/stairs. Source route coordinates are a macro topology only; do not extract final walkability masks from mere render pixels.

## Route calculations

| Plan | Polyline length (map drawing units) | Scale | Ideal walking time |
|---|---:|---|---:|
| Hollowreach via Frostbridge main road → Greenwood | 471 | 60 game units per map unit | ~2.85 min |
| Hollowreach via Northwatch highland route → Greenwood | 733 | 60 | ~4.44 min |
| Hollowreach via raised Stoneford southern route → Greenwood | 700 | 60 | ~4.24 min |
| Hollowreach → Smuggler's Hollow cave mouth, direct quest road | 1,040 | 60 | ~6.30 min |
| Entire planned map width, hypothetical direct unobstructed line | 1,200 | 60 | ~7.27 min |
| Entire planned map height, hypothetical direct unobstructed line | 800 | 60 | ~4.85 min |

Calculations assume constant walk speed **165 world units/second**; no combat, gathering, paths taken in reverse, user detours, menus, weather, collision or slowdown. Pacing is deliberately provisional. The world can feel far larger on exploratory loops without padding it with empty terrain. Phase 9 will calibrate routes based on real-world playtime and actual physical movement on iPhone.

## Preliminary terrain and encounter density

- The grid is **48×32 chunks** of a **proposed 1,500 world units each**. **1,536 planning cells** must NOT be interpreted as created PNGs, tile atlases, or preloaded textures.
- Per ten wilderness chunks passed, aim for **4–7 environment vignettes**, **2–5 gather opportunities**, **1–3 encounters**, and **0–1 optional secret**, adjusted by region.
- Town streets have zero random hostile spawns. Highland predators, Greenwood wilderness creatures, old-road bandits, ravine outlaws and sparse Worldscar anomalies should arise from ecology and story rather than evenly distributed filler.
- Major roads need visual orientation, encounter spacing and legitimate destinations. Forest understory and valley switchbacks create authored variety; never artificially gate a visibly open route.

## Explicitly unresolved

These findings do **not** certify that the current prototype's blocked paths, tree canopies, cave lanterns, stairs, fake treasure shapes, Worldscar shrine, enemy sprites, or floating shadow have been fixed. Every creator PDF issue remains open until its implementation phase and real screenshot/device verification.

**Next phase: Phase 3, upon creator instruction.** Begin global-coordinate/chunk streaming implementation incrementally while keeping v1.2.6 playable, import planning boundaries as data **but do not use overlapping region influence polygons as final collision**, and continue mandatory save compatibility.

**Mandatory hard stop:** After Phase 9, creator reviews actual full overworld appearance and layout; Phase 10 is locked until explicit approval.
