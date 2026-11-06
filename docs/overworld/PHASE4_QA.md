# Veilward Phase 4 — Geometry QA / Reproduction Contract

**Automated source QA:** 41,955 checks including 20,864 route-footstep checks, authored floor material, geometry collision, seven crossing decks, six elevation bands, independent foot anchor and 11 inspection zones. These automated assertions are not on-device visual approval.

| User-reported issue theme | Real source fix or present status | Creator validation still required |
|---|---|---|
| Standing on cliff/railing/lantern | Added terrain blockers sharing painted preview geometry | Check actual iPhone art alignment as later terrain chunks are authored |
| Walking onto river/lake/chasm | Foot-ground water collision and only seven named physical bridges/fords/causeways | Inspect riverbank and bridge appearance at full resolution |
| Suddenly hovering while walking | Ground elevation derived from authored slope, player foot anchor is independent of sprite height | Verify next pixel-art terrain perspective and shadows; no new hero sprite art |
| Unclimbable stairs / shrine inaccessible | Northwatch stair link and terrace level, continuous elevation; major stair/route centerlines checked | Check authored physical stair treads/occlusion and entire shrine walk |
| Trees clipping / white outlines | Tree-trunk footprints blocked using coauthored shapes | Detailed canopy occlusion, alpha cleanup and visual art remain Phase 5+ |
| Dead-end world / teleport exits | All outdoor anchors joined by 65 continuous physical edges | Complete world art and broader traversal still Phases 6–9 |
| Interactive shapes are misleading | 11 places have genuine read-only Inspect actions with source-defined radius/descriptions | Real quest rewards/objects and final source art in later phases |
| Device shortcut shows stale update | PWA build/cache bumped to v1.2.8 and scripts/geometry precached | Home Screen version still needs the creator's verification |

### Required checks on each follow-up patch

1. `node tests/overworld_phase4_geometry.test.js` — authored shapes, slopes, cross routes and actual preview render calls.
2. `node tests/overworld_phase3_streaming.test.js` — lazy chunk allocation, movement continuity, UI integration, save preservation.
3. `npm test` — old navigation, combat, quest, asset protection and geography topology.
4. Check asset refs and the running Pages build; ask for actual iPhone screenshot only if needed to verify a visual issue.
5. Never change the original Wanderer or Warden art without explicit user instruction.

**Exit note:** Technical geometry is in the game, but **visual confidence is not 10/10 until creator's later actual game screenshots and Phase 9 review**.
