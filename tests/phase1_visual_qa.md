# Phase 1 — Character and Village Visual QA

Target: Veilward 1.2.1. This file records **simulated renderer checks**, not visual acceptance on iPhone.

## Pre-push checks
- JavaScript syntax verified for `visual.js`, `game.js`, and `sw.js`.
- Hero rendering between `if(isHero){` and the NPC branch compared byte-for-byte against the previous version: **unchanged**.
- Source sprite `warden_hal_v13.png` dimensions: 192×176 pixels; alpha bounds `left 32, top 11, right 160, bottom 170`. Art asset not modified.
- Mock image/canvas: all 10 existing NPC/enemy source cells measured and mapped to their correct role.
- Mock draw calls: Warden Hal, Ash, Joren, Mira, Eldric and the Hermit land visible boots at target ground Y=600 to within 0.5 world pixels; Warden foot is at 599.99.
- Mock nameplate check: Warden top of visible hair 467.20 at example ground Y=600; nameplate ends at Y=460 (7.20 world pixels of clearance).
- Existing player `150×154` draw rect retained. No hero atlas files updated.
- Verify `index.html` and `sw.js` both reference game v13, visual v28, and asset art18.

## Remaining on-device acceptance checks
1. Open installed Home Screen shortcut, enter village and confirm `v1.2.1` in pause menu.
2. Walk around Warden Hal: his label remains above (not on) hair, and his soles sit on the same ground as the Wanderer.
3. Walk near Ash, Joren, Mira, Eldric, and the bridge-side Hermit; each correctly grounded, only nearest interactable NPC is labeled.
4. Approach and leave the river bridge and cliff steps to look for baked-background rail or ledge occlusion. Report these as later art/environment work if observed.
5. Save/reopen the app and verify quest state and hero appearance remain unchanged.

**Result:** Renderer simulation checks passed. Real iPhone approval pending. Phase 2 NOT started.
