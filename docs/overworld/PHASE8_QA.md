# Veilward Phase 8 — Full Outdoor Roads, Crossings and Island QA

**Build:** v1.3.2 · **Test:** `npm run audit:routes` + `npm test`  
**Code-level regression is distinct from a real landscape-iPhone visual review.**

| Area | Technical checks | On-device review outstanding |
|---|---|---|
| Whole outdoor graph | 48/48 anchor nodes reachable; all 65 physical links represented | All roads lead to meaningful destinations, no sudden path cut |
| Road/bridge alignment | Visible tread and collision source are the same global paths/widths | Feet do not walk on rail tops, floating posts or in visible river |
| Northwatch stone-timber span | Raised stone deck with timber details and clear rails | Two landings, natural alpine depth |
| Frostbridge main timber bridge | Full wood planks, rails and walkable center | Cross from village bank to Thawline without prompts |
| Stoneford dry ford | Continuous raised stone floor; no fake rails | Walk entirely over stones with logical shoreline |
| Greenwood Falls stone bridge | Authored stone/steps and bank transition | Stairs and overlook clearly accessible from real path |
| Mossmere west footbridge | Wood/rope construction and physical island landing | Walk from west lake bank to island |
| Mossmere east causeway | Stone dry crossing, no fictitious side rails | Walk from island to eastern bank |
| Smugglers' Ravine rope bridge | A distinct rope/timber deck over the dry chasm | No movement on ropes or void, both ledges reachable |
| Full slopes and staircases | Complete source stair/switchback routes have treads/risers | Switchback turns and elevation depth visually convincing |
| Shoreline | Water material now samples the geometry hazard mask | No drawn water counted as safe ground |
| Road art coherence | Climatic material variation with 65 linked source paths | Rich reference-consistent pixel density at close range |
| iPhone Home Screen | HTML/service-worker asset revisions agree; cache remains 18 tiles | Reload without stale art, flicker, frame drop or black tiles |
| Quest/save/approved sprites | Legacy save key unchanged; approved hero/Warden unchanged | After preview return, actual quest progress intact |

### Remaining known review gate

Phase 9 performs a full playable outdoor survey and fixes found issues, then publishes a full-region screenshot/map atlas and the actual 12-region iPhone roaming build. **The creator must inspect and explicitly approve the complete overworld's appearance and geography before Phase 10.** Do not treat this Phase 8 test suite as approval.
