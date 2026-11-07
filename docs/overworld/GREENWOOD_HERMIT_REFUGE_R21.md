# VEILWARD v1.3.29 — Phase 9 R21: Greenwood hermit's illustrated refuge

**Status:** integrated in-game original artwork, not final visual acceptance. Phase 9 remains active; Phase 10 is locked.

The existing hermit hub's old three-polygon roof and flat rectangular facade failed the visual reference comparison. A newly painted, independently authored transparent **512×512 RGBA original moss-roof cottage**, with detailed wood roof shingles, stone masonry, vines, mushrooms, lantern, warm windows and walk-up steps, now replaces this specific placeholder in `world_illustration.marker()`. It is a production sprite on the **original** hermit hub (766,364) in blueprint units, not a copied world screenshot. Player route, quests, save key and existing landing position are unchanged. The fallback geometric hut remains only if this independent image fails to decode.

The image lives at `assets/greenwood_hermit_sanctuary_r21.webp` with single-versioned iPhone service-worker loading. `game.js` awaits the image on initial world preview entry before chunk cache generation. `scripts/visual_capture.mjs` inspects a real, walkable `GREENWOOD_R21_HERMIT_COTTAGE` view and asserts the art source is active. `tests/greenwood_hermit_refuge_r21.test.js` verifies image dimensions and positioning, unchanged world waypoints, saves, and artist approval lock.

**Limitations:** The second, separate forest cottage by Greenwood hearth is still older blocky artwork and should get an original different design. The forest also needs greater canopy layering, improved perspective occlusion and reliable iPhone device review. No new collision is introduced by the large illustrated roof; visible architecture versus physical footprint should be rechecked during the next sprite integration pass.

**Creator approval remains 0%. Do not proceed to Phase 10 without explicit user inspection of actual playable game.**