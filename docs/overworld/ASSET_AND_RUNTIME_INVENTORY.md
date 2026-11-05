# VEILWARD — Phase 1 Current Build and Asset Inventory

**Source audited:** `main` at `dde016f184223eae9bc90a8f427905f3f13cdeb4` (v1.2.6, November 5, 2026). Numbers are from actual files, not feature promises. **No live runtime files changed by this audit.**

## Runtime architecture snapshot

| Component | Present implementation | Limitation to resolve |
|---|---|---|
| Hosting and install | Static GitHub Pages; HTML/CSS/Canvas JS; landscape PWA with `sw.js` and manifest | iPhone caching and asset streaming will need stable version changes |
| Scene renderer | `visual.js` loads four individual scene JPGs and draws each at 1850×1200 in a cached canvas | No seamless outdoor world / chunk paging |
| Camera | Fixed 3/4 painted camera, `WORLD_ZOOM=.78`, per-zone camera bounds | Zone snap and reset during transitions |
| Local world | Every zone shares local `1850×1200` coordinates, without global outdoor origin | Cannot walk from village to Greenwood in a shared coordinate system |
| Navigation | `navigation.js` polygon `ground`/ `solids`, radius-8 `canWalk`, safePoint, axis sliding `projectMotion` | No authored height/elevation, foreground depth/overlays, global nav grid |
| World interactions | 9 object records + 6 NPCs. Search nearest within role-specific radius; `Talk` can change zones | Portal should be kept only at physical cave/interior thresholds |
| Enemies | 7 initial enemies: wilds 3 wolves + 1 bandit; cave 2 bandits + 1 wraith | No 8-direction combat sprite sheets or varied enemy families |
| Combat | `combat.js`: forward melee, spell projectile, dodge; per-type warning arcs | Combat actor art uses static actor cells and effects rather than full animation |
| Quest state | `quest.js`: Joren supplies, 2 Blueleaf, Worldscar, sword purchase; persistent one-time states | Quest data anchored to zone-local NPC and object coordinates |
| Save | `localStorage` key **`veilward-hollowreach-v01`**; player object saved | Need non-destructive versioned migration to future global position and persistent outdoor world objects |
| Source tests | 3 active suites for scene geometry, combat, quest flows (plus CI) | These tests prove code behavior, not iPhone visual fidelity |

### Existing authored visual source files (currently loaded)

| Zone key | Display label | Current active scene image | Type |
|---|---|---|---|
| `village` | Hollowreach · Frostbridge Outpost | `assets/village_v06_clear.jpg` | Exterior, snow village and river/bridge |
| `wilds` | Greenwood · Eastern Trail | `assets/wilds_clean.jpg` | Exterior, flowers, road, stone stairs, bridge |
| `cave` | The Smuggler's Hollow | `assets/cave_clean.jpg` | Underground cave/bridges, should remain an intentional interior transition |
| `forge` | Hollowreach · Joren's Forge | `assets/forge.jpg` | Existing authored interior image, **not currently reachable by a proper workshop door** |

These are *full-scene illustrations*, not composable tile atlases. `visual.js` loads one image per zone, while `navigation.js` separately supplies polygons. This is the central source-of-truth mismatch to eliminate in later phases.

### Existing image files: preserve instead of deleting

- Scene history: `assets/village.jpg`, `assets/village_clean.jpg`, `assets/village_golden_v05.jpg`, `assets/village_v06_clear.jpg`, `assets/wilds.jpg`, `assets/wilds_clean.jpg`, `assets/cave.jpg`, `assets/cave_clean.jpg`, `assets/forge.jpg`.
- Generic actor history: `assets/actors.webp`, `actors_clean.png`, `actors_clean_v05.png`, `actors_silhouette_v06.png`, `actors_silhouette_v062.png`, `actors_v07.png`.
- Player art evolution: `hero_front_adult_v11.png` + JSON, `hero_full_8way_v10.png` + JSON, `hero_back_strides_v09.webp`, and the **approved** `hero_approved_8way_v12.webp` + JSON.
- Dedicated guard and companion: `warden_hal_v13.png` + JSON and `husky_clean_v06.png`.

**Protection SHA IDs are Git blob object hashes from the audited main tree.** Do not overwrite a protected asset without express direction.

| Protection | Active file | Git blob SHA | Note |
|---|---|---|---|
| **LOCKED — playable Wanderer** | `assets/hero_approved_8way_v12.webp` | `6c41591697ca4e5b39185b110f7332b676e3c25d` | 640×1440 = 4 columns × 8 directions; 160×180 frames; idle 0 + walk 1–3 only |
| **LOCKED — hero metadata** | `assets/hero_approved_8way_v12.json` | `030a88bae31c5c0f1b2db03767429b6c35949d3f` | Foot Y 168, render-world size 150×154 |
| **LOCKED — Warden Hal** | `assets/warden_hal_v13.png` | `d9a4a505cfc1804b01ab31e9146b075a823b23e7` | Distinct independent sprite, 192×176; foot at (96,170) |
| **LOCKED — Warden metadata** | `assets/warden_hal_v13.json` | `01e6756023833861158300185274e7f36c9b3791` | Render size 160×147 world units |
| Reference / preserve | `assets/village_v06_clear.jpg` | `d88c861f990a2624a8e7941fbac7bc634d5732e6` | Current Hollowreach scene; do not replace without art review |
| Reference / preserve | `assets/wilds_clean.jpg` | `a5e5aa08c7b9d8c8b949854f63608e13058060bf` | Current Greenwood scene |
| Reference / preserve | `assets/cave_clean.jpg` | `04d431eaae85f2517cef1f4875426e2048e4364d` | Current cave scene |
| Reference / preserve | `assets/actors_v07.png` | `481d047bbda4bb100213e4c02322af3671d02839` | 4-column NPC cell atlas, used by current non-hero actors |

**Important art truth:** Approved hero is a 32-cell 8-direction sheet (**idle and walking**). It is NOT a completed attack/cast/death action atlas. Enemies use individual **static cells** from `actors_v07.png` and do not yet have full directional attack/stagger/death sheets. Do not claim those animation requirements are already implemented.

### Active character catalog (source of truth: `game.js`)

| ID | NPC | Local zone | Foot point (world) | Current role |
|---|---|---|---|---|
| `joren` | Joren · Blacksmith | village | (885,520) | `forge`, quest starter/turn-in, vendor dialogue |
| `mira` | Mira · Innkeeper | village | (1210,665) | `inn`, potion trade, rest |
| `eldric` | Eldric · Hunter | village | (720,1015) | `hunter`, information |
| `guard` | Warden Hal | village | (1290,595) | `guard`, dedicated image |
| `hound` | Ash · Village Hound | village | (1075,705) | `hound`, companion dialogue |
| `hermit` | The Green Hermit | wilds | (1275,543) | `hermit` |

### Existing enemies

| Zone | Family | Home spawn points (local world coordinates) |
|---|---|---|
| wilds | wolf ×3 | (850,690), (1100,640), (1480,850) |
| wilds | bandit ×1 | (1245,667) |
| cave | bandit ×2 | (1050,670), (1425,650) |
| cave | wraith ×1 | (1435,525) |

**No guards or civilians are intended to be combat enemies** in the current roster. The "bandit should look like a bandit" screenshot remains a creator art-acceptance issue.

### Entire 9-record world-object registry

| Type | Zone | Foot point | Result or role |
|---|---|---|---|
| portal | village | (790,1090) → wilds (735,991) | **Must become seamless outdoors travel** |
| board | village | (845,600) | Trail Noticepost, currently scripted interaction |
| portal | wilds | (540,1068) → village (1030,675) | **Must become seamless outdoors travel** |
| portal | wilds | (1700,745) → cave (775,741) | Retain as real cave entrance, move to visible threshold |
| herb | wilds | (500,920) | `blueleaf-west`, one-time |
| herb | wilds | (1190,714) | `blueleaf-east`, one-time |
| scar | wilds | (1480,420) | Worldscar one-time attunement |
| portal | cave | (170,795) → wilds (1520,720) | Cave exit should align to a physically believable doorway |
| chest | cave | (888,689) | Bandit Supplies, one-time recovered crate |

A "fake treasure chest" in the painted cave background is **not automatically** this actual chest; the screenshot must be reconciled against both art and object data before closure.

## Existing software and runtime files

`index.html` (Canvas + touch controls), `visual.css` (UI), `game.js` (world state / tick / render / NPC / interactions), `navigation.js` (collision), `visual.js` (asset loader and sprites), `combat.js`, `quest.js`, `sw.js` (cache and update lifecycle), `manifest.webmanifest`, `icon.svg`. Scripts load in order via HTML; **do not introduce a broken browser module build** during migration.

The current service-worker cache is `veilward-hollowreach-v126-quest-closure`. Existing tests: `tests/phase3_scene_geometry.test.js`, `tests/phase4_combat.test.js`, `tests/phase5_quest.test.js`, GitHub Actions `.github/workflows/verify.yml`.

## Documents and contradictions to handle consciously

- **Current next-work authority:** `OVERWORLD_REBUILD_ROADMAP.md` (approved, 22 phases). Creator requires appearance approval immediately after Phase 9 before Phase 10.
- **Canonical agent workflow:** `AGENTS.md` — patch-and-push the actual game for gameplay feedback, one full phase per continuation, preserve approved assets and saves.
- `PROTOTYPE_ROADMAP.md`, `ART_BENCHMARK.md`, and `ART_DIRECTION.md` contain **historical v0.1 status paragraphs**. Their quality bar/golden reference remain relevant; old statements that the CURRENT build is v0.1 procedural are stale.
- `TWO_HOUR_SLICE_ROADMAP.md` describes the **already implemented** v1.2.6 five-phase micro-sprint, not the new overworld overhaul.

## Next phase entry conditions

Phase 2 needs a master geography/road topology blueprint with connected routes. **Do not assign irreversible global coordinates until Phase 2's map is reviewed.** Phase 1 only freezes evidence, constraints, protection hashes and deficiencies.
