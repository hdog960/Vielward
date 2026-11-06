# Veilward Phase 9 — Whole-World Travel, Visual Atlas and Approval QA

**Release:** v1.3.3. **Source checks:** `npm run audit:review`, `npm test`. **Approval required:** actual iPhone review before Phase 10.

| Place/system | Source-level checks | Physical iPhone and creator review |
|---|---|---|
| Twelve-region terrain atlas | 12 real renderer snapshots, 12 named map centers, all authored roads | Compare every region with reference pixel-art quality and intended sense of place |
| Whole route graph | All 48 nodes mutually reachable via the 65 true paths | Roads should visually lead somewhere and read as real travel routes |
| Hollowreach, Coldpine, Northwatch | Snow and alpine climate, safe foot anchors | Village, slopes, evergreen silhouettes and boots feel grounded |
| Frostbridge, Stoneford | Traversable deck/banks and physical-water exclusion | Bridge/ford art exactly matches walkable path |
| Thawline/Greenwood | Continuous blended climate, connected travel paths | Snow/moss/trees progress gradually, not in a fake scene cut |
| Greenwood Falls | Overlook stair and real river access | Depth and rock layers clear, no floating waterfall path |
| Mossmere | Two physical island crossings and dry island | Walk from west shore onto island and exit via east causeway |
| Heatherwood/Old Crown | Meadows, real road, ruined tower routes | Landscapes worth exploring, believable landmark density |
| Smugglers' Ravine | Chasm and timber-rope deck are real collision geometry | Danger/drop and railing visually comprehensible |
| Worldscar | Cold arcane uplands and reachable rune ring | Magical setting matches larger art style |
| Physical water/land | Sampled render material equals `geometry.waterAt` hazard | No apparent walking into water or crossing cliffs |
| PWA and saved adventure | 18-tile max, versioned HTML/worker, same localStorage save | Installed Home Screen updates and quests survive |
| Creator approval | Roadmap and handoff explicitly prohibit Phase 10 | Creator must say they approve, or provide patch notes |

**How to review:** Journey Menu → Review Full Overworld (Phase 9) → Review World Map & All 12 In-Game Regions. Tap each actual terrain thumbnail, then walk using the normal joystick. Tap the map icon ◈ to reopen the atlas. Use the existing Visit Next Crossing tour and optional Terrain Geometry Overlay.

**Not claimed:** iPhone hardware rendering/fps proven by Node tests, final look meeting the creator's exact standard, real-world photo screenshots from device, all future NPCs/dungeons/quests complete. **STOP until creator's explicit full-overworld approval.**
