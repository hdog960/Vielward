# VEILWARD — Phase 5 Art & Seam Quality Checks

**Build v1.2.9.** This checklist is tied to the actual playable material preview; the five sample locations correspond to existing geography nodes.

| On-device material stop | Expected visible evidence | Not yet claimed |
|---|---|---|
| Hollowreach snow | Cool blue snow-drift pixel clusters and wood/stone framing; approved Wanderer remains adult and foot-anchored | Entire snow village buildings and snowy trees completed in new continuous terrain |
| Thawline camp | Visible snowmelt-to-moss tile transition, safe road and blended terrain identity | Perfect artist-painted melting boundary |
| Greenwood clearing | Lush green leaf/flower soil patterns, warm pebbled trail, rooted tree props | Existing Greenwood illustration fully reconstructed |
| Worldscar standing stones | Purple-gray textured stone, meaningful ruin silhouette and blocked monolith columns | Complete Worldscar shrine art/lighting |
| Mossmere shore | Blue lake/river tile motifs, readable shoreline and footbridge/causeway decks | Complete animated water, seamless depth/splash/reflection |

### Automated coverage

`tests/overworld_phase5_art.test.js` validates the source palette/atlas manifesto; 16 materials × 4 variants; exact frame crop indices; deterministic global-grid source cells, including an intentionally overlapping 1,500-world-unit chunk boundary; terrain draw calls and original collision source; lazy cache, five-region sample materials and jump-to-showcase; GitHub Pages/Home Screen script versions; legacy save key and protected actor assets. Existing tests continue to protect 65 routes, 7 crossings and the 30 authored solid obstacles.

### Later visual acceptance

The five pixel materials still need **user-playtested screenshots** to validate fidelity next to the approved illustrations. In particular, check **pixel density vs hero size, water flow direction, bank edge aliases, snow/grass transition smoothness, tree canopy occlusion vs foot position, colored antialiasing/white matte halos, and readability in iPhone landscape**.

No separate art-only render is a phase deliverable; **all art changes must be committed to the game before being reported**. Do not silently mark the Phase 9 full-overworld appearance gate approved.
