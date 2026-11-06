# VEILWARD — Phase 9 R5 / v1.3.11 winter ground coherence

**UNAPPROVED ART RECOVERY: creator visual acceptance is 0%; Phase 10 remains locked.**

## What is genuinely implemented in the walkable game

The previously painted 4×4 material atlas (`assets/hollowreach_ground_painted_v2.webp`, four distinct snow, road, stone and thaw variants per source row) was previously selected cell-by-cell and scaled onto independent 96-world-unit tiles. Real browser screenshots confirmed this produced harsh square seams and repeated high-contrast texture.

The game now builds four **8×8 native-pixel assembled material plates** (256×256) directly from these independent, authored art variants once at atlas load. A five/six-pixel wrapped seam brush makes each physically adjacent swatch and the plate's repeat boundaries meet without a hard rectangular border. Subtle cool grade stabilizes winter light. Underfoot painting samples the plates by global world cell coordinates, so terrain stays aligned across 1500-unit streamed-chunk boundaries and camera movement. Winter roads use the same assembled stone material plate.

This is NOT cropping/mirroring a photograph or placing the reference full-scene screenshot behind the player. The original background illustrations, tree/cottage/bridge sprite art, hero/Warden atlases, terrain collision, 48 world anchors, 65 roads, seven crossings, gameplay, quests and save key remain unchanged. The offscreen 4×256×256 RGBA atlas is limited in memory and compiled once, not inside every frame. A synthetic test canvas without pixel access falls back safely to the prior source texture.

## Visual and QA requirements

- Run `npm run check`, `npm test`, and `npm run audit:winter-plate`.
- Real-browser screenshot task **must** see `materialPlateMode:"seam-composed"` and capture Hollowreach, Greenwood, Coldpine, Frostbridge, Atlas.
- Compare Hollowreach with the original `assets/village_v06_clear.jpg`; screen-level art may remain visually insufficient despite fewer squares.
- No claim of 100% environmental quality, no user visual approval, no Phase 10 work.
- Further development must author a cohesive snowy neighborhood (cliff, architecture, ground, road, water, vegetation, forecourt) and original-quality Greenwood pilot—not layer procedural placeholder props.
