# VEILWARD — Phase 8: Complete Physical Outdoor Route Network (v1.3.2)

**Status:** Implemented in the real GitHub Pages iPhone game, in the optional continuous overworld preview. Device art/behavior approval remains pending. **Next phase:** Phase 9 world navigability and creator appearance-review build. **Do not enter Phase 10 without explicit creator approval.**

## What was actually built

The existing Phase 2/4 source defines 48 named outdoor anchors, 65 physical road links, 7 waterways/chasm crossings and 12 regions. The Phase 8 update paints all links from exactly those `world_geometry.js` road paths and their physical width/elevation metadata, rather than creating separate visible roads by guessing over a background painting.

New `world_routes.js` source-art module derives and draws:
- Real packed-road and woodland footpath bands with climatically appropriate shoulders, pebbles, wear and edge details. The actual visible tread uses each route's authored half-width; junctions and the single intentional endpoint at Joren's workshop use small inlaid route markers.
- Distinct alpine/highland, thaw, forest, wetland and upland road palettes, sampled from Phase 7's existing `world_climate.js`.
- Five bridge construction variants: Northwatch stone/timber, Frostbridge timber, Greenwood Falls stone, Mossmere west wood/rope and Smugglers' Ravine timber/rope.
- One physically raised **Stoneford crossing**, with dry, contiguous stepping caps and no fictitious swimming.
- One solid **Mossmere east stone causeway**. Together with the west footbridge, these create two distinct entrances/exits to the same navigable island sanctuary.
- Explicit stone treads on the actual stairs, switchback riser/readability cues, and visually marked bank landing aprons at both ends of each crossing.

### Footprint and rail honesty

The five bridged crossings' two rendered rails use the **same source geometry and lateral offset** as the `routeArt.edgeGuard()` collision check inside `world_stream.js`. The rail occupies the visual side of the bridge, while central deck lanes remain passable. The starting/final 7% of each crossing are intentionally open as landings. Both non-railed passages remain unguarded. The pre-existing geometry/collision, road graph, route elevation, water exclusion, cliffs and natural object blockers are preserved.

The existing `terrain_art.js` now samples water/chasm occupancy directly from `geometry.waterAt()`, resolving a former 205-versus-180-world-unit **visual water-versus-physical hazard disagreement**. Crossing decks remain drawn above the physical banks. It does not unlock swimming.

## iPhone playtest

1. Open **[Veilward](https://hdog960.github.io/Vielward/)** from Safari or installed Home Screen shortcut. Confirm **v1.3.2**.
2. Open **Journey Menu → Explore Roads & Crossings (Phase 8)**.
3. In the preview, open Journey Menu → **Visit Next Crossing · 7 Physical Bridges, Fords & Causeways**. Walk across each one from the near bank to the far bank with the normal joystick. The seven sites are Northwatch, village Frostbridge, Stoneford, Greenwood Falls, Mossmere west, Mossmere east and Smugglers' Ravine.
4. Check bridge planks/stone foot surfaces, landing aprons, raised bridge rails and in-situ foot shadows. On five railed bridges, stepping into a visible railing must fail; feet should walk across the central deck without standing on its top. At Stoneford and the eastern causeway, cross without a swim/teleport and inspect the visible dry ground.
5. From **Mossmere west**, cross the west footbridge into the island, then leave over the **east causeway**. The two connections are part of the same 12-region outdoor coordinate space; there are no exterior portal prompts.
6. Use **Visit Next Region** for Northwatch/Coldpine switchbacks, the Old Crown watchtower steps and Worldscar stone ascent. Check treads lead somewhere and no new false traversability appears.
7. Enable **Terrain Geometry Overlay** to compare rail guarding, bridge deck and water. Return to the original Hollowreach adventure; verify quests, gold, equipment, inventory and save unchanged. Close/reopen the installed iPhone app and confirm v1.3.2.

## Source QA and exclusions

The regression `npm run audit:routes` verifies all 48 anchors reachable by physical graph traversal from Hollowreach; all 65 drawn roads with short-step walkability/elevation; seven independently styled crossing decks and bank anchors; island connected from both sides; real rail guarding versus dry crossings; source-shared shoreline hazard visuals; actual Canvas drawing; preview cache and iPhone version parity; and unchanged approved assets/save key. Run `npm test` for Phase 1–8 plus legacy quest/combat/navigation checks.

**Not claimed:** Final illustrated production quality, player-test-verified collision on iPhone, every interior enterability, enemy/combat integration with the seamless world, complete NPC population, or final art approval. Future Phase 9 must survey *the entire world at playable speed*, fix discovered navigability/art mismatches and present the *actual in-game full-overworld screenshots/map* for creator approval before Phase 10.

## Files to read next

- `world_routes.js` — all 65 route materials, seven physically authentic deck types, lateral rail guards, junctions and debug
- `world_stream.js` — authoritative preview uses one `routeArt` instance for rendering and boot collision
- `terrain_art.js` — overlays route art after authored material/physical surfaces
- `docs/overworld/world_blueprint.json` — protected geography, 65 links, 7 crossings, node identities
- `tests/overworld_phase8_routes.test.js` — permanent route, shoreline, island and in-game UI regression
- `docs/overworld/PHASE8_QA.md` — device visual acceptance checklist

**Stop at Phase 8.** Wait for the creator's next `Continue development`. At Phase 9 deliver a real playable full-overworld visual approval build then STOP pending the creator's sign-off.
