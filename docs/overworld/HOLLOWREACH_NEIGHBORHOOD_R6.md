# VEILWARD v1.3.12 — Phase 9 R6 Hand-Painted Neighborhood Assets
**Status: Live art recovery, not creator-approved. Visual acceptance stays 0%; Phase 10 locked.**

## Production update, not a design mock-up
The optional, physically walkable Hollowreach overworld now loads a fourth independent raster asset: `assets/hollowreach_neighborhood_r6.png` (288×144, eight transparent 72-pixel cells). This asset was authored separately and cropped into proper alpha-backed sprite cells—not copied from the old 900×584 reference scene image. It contains two independently drawn snowy firs, two icy stone/ledge clusters, snow-berry undergrowth, a timber rail, a stone retaining wall, and a warm-lit lantern post.

`world_raster_pilot.js` now decodes the atlas before allowing continuous-world preview. The source-selected winter trees get two distinct winter fir silhouettes; the existing physical rock and cliff objects get varied stacked ice/stone artwork, clipped to their unchanged solid boundaries; source-placed snowy shrubs receive a dedicated illustrated sprite instead of disappearing; source-placed lamps get an illustrated lantern; cottage forecourts receive timber rail art inside their already-colliding building footprint. The original story and player art, 48 landmarks, 65 roads and seven crossings remain untouched.

## Fidelity and scope limitations
These improvements are tangible actual gameplay objects. They are *not* a finished full Hollowreach neighborhood. In particular the same original small cottage image still appears at multiple locations, huge terrain expanses still need site-specific authored landscape, the river/bridge/road layout needs a mature visual art pass, and Greenwood plus the other regions are still non-approved topology artwork. New individual assets are not a substitute for a continuous finished environment.

## Verification and next steps
`npm run check` and `npm test` now include `npm run audit:neighborhood-art`, validating the actual alpha-backed PNG, decode, game rendering branch, unchanged world geometry and save key. Headless real-browser capture must be reviewed for objective quality and clipping, not treated as an automatic pass for art fidelity. The next production slice must continue full village layout cohesion and distinct architecture, then equivalent full-quality Greenwood before creator reinspection.
