# VEILWARD — World Design Lock (Phase 1)

**Status:** APPROVED DIRECTION / ARCHITECTURAL CONSTRAINTS LOCKED; actual global terrain layout is Phase 2 work.  
**Evidence:** Creator's `Vielward.pdf` (12 pages) + creator's approved `OVERWORLD_REBUILD_ROADMAP.md` and mandatory Phase 9 review instruction.  
**Baseline:** Live v1.2.6; this document is not a claim that the new world already exists.

## One-sentence game promise

A big, beautiful, geographically convincing, **Skyrim-inspired** exploratory fantasy RPG in a richly detailed **2.5D three-quarter pixel-art world**, where every visible road, crossing, elevation and interesting landmark makes physical and interactive sense, and where traveling between outdoor regions is continuous.

## Non-negotiable design pillars

### 1. The wilderness is one world, not a gallery of rooms

Snowy Hollowreach, thawline, Greenwood, foothills, rivers, ruins and other proposed outdoor regions will occupy one **continuous outdoor coordinate space**. No dialog box, travel icon or fake entrance is allowed simply to switch outdoor backgrounds. Caves, occupied structures, ruins with true interior thresholds and other enclosed places MAY use an intentional enter/exit interaction.

The camera stays with the Wanderer; climate change is shown along distance, elevation and vegetation, not by instantly replacing a snowy painting with a green painting. Crossing from one outdoor chunk to another must not reset movement, enemies, journal, or camera.

### 2. Geography precedes fine gameplay polish

**Phases 1–9: build the entire outdoor region first.** Phase 2 specifies the geography and paths, Phase 3 builds streaming, Phase 4 defines honest collision, Phase 5 locks art production, Phases 6–8 finish the world and route network, Phase 9 surveys and prepares an **appearance review build**. Only after explicit creator approval does the team proceed to Phase 10's detailed selected-slice movement refinements.

"The entire overworld" here means a complete coherent outdoor landmass. It explicitly does NOT mean finished interiors for every visible house, finished dungeons for every cave, or completed world-wide quests and combat ecology.

### 3. Art fidelity is a product requirement, not decoration

- Source of visual truth: creator's established high-detail snowy cottage/bridge reference and the existing rich painted winter/green/cave aesthetic, adapted into a consistent production asset pipeline.
- Camera: elevated three-quarter view; clearly readable roofs, cliffs, bridge sides, stair elevation and character-to-building scale.
- Materials: dense hand-authored pixel clusters and coherent stone/wood/snow/grass/moss/water textures. Avoid giant 8-bit squares, flat polygon substitutes, white-matte plants, repeating checkerboard rock and pasted cutouts.
- Lighting: cool shadowed environments punctuated by warm lanterns/hearth/window light; vegetation/light changes smoothly by climate and altitude.
- Grounding: the player's actual boots and contact shadow remain on the correctly elevated walkable surface. Railings, trees and cliffs must occlude in the correct direction.
- Consistency: forest and cave must look as lovingly authored as the snowy village; no sudden mismatch of pixel density, size or visual era.
- Scope protection: **do not change or replace the approved Wanderer eight-direction sheet or Warden Hal's dedicated art** as part of terrain work. New enemy art requires full sprites, not a reused hero with a palette swap.

### 4. Physical affordances must be truthful

Every visible route, door, staircase, river crossing, island, bridge and monument is either physically usable or has an understandable visual restriction. A narrow bridge's walkable area is its **deck**, not its railing or torch. An elevation jump requires a visible stair/ramp. A stone plinth is not a floor. Trees obstruct at trunks and occlude at canopy. A painted chest that looks usable must actually be a container or be redrawn as unmistakable scenery.

A sign should be readable when intentionally offered; water is blocked unless a separate swimming/fording action is implemented; an island must have a real visible access method and worthwhile discovery.

### 5. Exploration is earned, not wallpaper

- Trails lead to an authentic waypoint, view, shortcut, ruin, resource, settlement, secret or believable closure.
- The riverside island, high monument, oval marking, chest(s), and Worldscar get distinctive and understandable roles.
- Gatherables and rewards use authored, scaled, grounded pixel-art objects rather than blue triangle markers.
- World objects have unique stable IDs for persistent collection / opened state; live quest data survives streaming and saves.

### 6. Enemies have a readable ecology

Skyrim's breadth is an **inspiration for categories**, not permission to copy names, models or art. Original outlaw, animal, undead, spectral, subterranean, magical and elite enemy families will have identifiable habitats, purpose, rewards and movement/combat. The ultimate variety goal is broader than Skyrim while maintaining original identity. Quality first: every initial combatant must receive a full coherent set of relevant directional idle, movement, attack, hit/stagger and death frames. A sheet of one static NPC cell does not qualify.

### 7. iPhone is the authoritative playtest target

- Static GitHub Pages deployment, iPhone Safari and Add to Home Screen remain supported.
- Joystick and action buttons must work simultaneously; app backgrounds/resumes without losing progress.
- Chunks are loaded/prefetched/cullable to avoid enormous iPhone memory consumption.
- Every phase updates game/code/data/docs/tests as needed, commits to GitHub, and reports what was verified vs what still needs **actual iPhone user review**.
- A generated concept still or isolated sheet does **not** count as game implementation.

## Proposed regions from the approved roadmap — planning names, not existing terrain

1. **Hollowreach / Frostbridge:** alpine snow village and primary hub.
2. **Northwatch Heights:** memorial, ledges and snowy overlooks.
3. **Coldpine Ridge:** evergreen alpine slopes and predator paths.
4. **Frostbridge River:** glacier-fed stream, gorge and intentional crossings.
5. **The Thawline:** plausible snow-to-moss progression.
6. **Greenwood:** temperate woods, blooms, forgotten roads and harvest.
7. **Greenwood Falls:** waterfall, stairs, riverside trail.
8. **Mossmere Basin:** lake, wetlands and reachable island.
9. **Heatherwood Commons:** meadows / foothill crossroad.
10. **Old Crown Road:** historic route connecting hubs and ruins.
11. **Smuggler's Ravine:** canyon and cave mouth.
12. **Worldscar Uplands:** ancient mystery, ruins and meaningful magical destination.

**Positions and area sizes are intentionally NOT fixed yet.** Phase 2 must create the actual master map, reliable road network, travel distances, biome/elevation routing, river direction, entrances and return loops. Do not mistake this region list for a generated world or final topology.

## Phase 9 mandatory visual-approval handoff

**Hard stop after Phase 9.** Deliver (1) an actual live iPhone walkable continuous **full outdoor overworld**; (2) an overview/map of every region; (3) representative real in-game screenshots of snow, thawline, Greenwood, river/island, ruins/bridges, village and travel roads; (4) a list of known visual limitations and what is still only baseline quality. The creator gets to inspect appearance, geography, aesthetic, scale, density and how traversal looks.

**If the creator rejects or revises any visual portion, patch the playable world and resubmit it.** Do not start Phase 10 until the creator explicitly approves the overworld appearance. Initial approval of the roadmap is **not** approval of the final artwork/world.

## Protected baseline and technical invariants

- Hero: `assets/hero_approved_8way_v12.webp` and `.json`; eight directions and unchanged approved frame art.
- Warden: `assets/warden_hal_v13.png` and `.json`; independent character.
- Retain existing scene art as quality references, not as ready-to-stream infinite tiles.
- Preserve all quest, XP, gold, health, weapon, skill, potion, collectible/loot and NPC progression across migration.
- Preserve legacy storage key `veilward-hollowreach-v01` for reading and compatibility. New versioned saved data may supplement it only with a documented, atomic, tested migration path.
- Current portal crossings may be supported during staged implementation, but the **approved final outdoor world must not depend on them**. Cave and workshop doors use real scene thresholds.
- One implementation phase per creator instruction; no hidden phase advancement after passing code-only tests.

## Next step: Phase 2's design gate

A creator-readable, coherent master outdoor map with credible road, river, island and stair topology and explicitly traversable connections between every proposed region. No large flat placeholders accepted as finished terrain, and no gameplay-slice polishing before the full outdoor frame exists.

**Cross-references:** [Issue register](./ISSUE_REGISTER.md) · [Current build inventory](./ASSET_AND_RUNTIME_INVENTORY.md) · [Coordinates & migration](./COORDINATES_AND_MIGRATION.md) · [Approved roadmap](../../OVERWORLD_REBUILD_ROADMAP.md).
