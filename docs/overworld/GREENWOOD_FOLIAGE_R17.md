# Vielward Phase 9 R17 — Greenwood foliage art recovery

**Build** v1.3.24. **Gate** Phase 9 ongoing; creator visual acceptance 0%; Phase 10 locked.

The previous Greenwood view was sparse and visibly procedural, with large undifferentiated green floor patches, tiny repeated flecks and only a few trees. R17 adds `world_greenwood_art.js`, a deterministic cached 15-cell original native-pixel atlas (192×240 each: 5 oaks, 5 conifers, 5 groundcover clusters). Each sprite contains densely layered leaf pixels, branches and rooted contact shadows. These are **native pixels**, not a rasterized image of a full scene or copied screenshot. Each sprite is stamped exclusively at the existing `footprint.cells` / `footprint.groves` coordinates in the Greenwood region. Surface patches and leaf litter also follow actual roots and paint below original roads, with no new blockers.

Integration: `world_illustration.js` offers existing greenwood features to the R17 compositor first, retains fallback art for unpainted source features, then includes physically positioned forest-floor shade in `drawGround`. `index.html` loads the new renderer before the illustration system; the GitHub Pages service worker pre-caches the source module and updates Home Screen build version. Tests `tests/greenwood_foliage_r17.test.js` and legacy regressions check physical invariant, memory reuse, 15 sprite cells, and unchanged quests/saves. Actual Chromium `GREENWOOD_R17_FOLIAGE` screenshot is available from the browser QA workflow.

Artist note: A separate high-resolution forest sprite sheet was prototyped in ChatGPT, but was **not transferred to GitHub and is not part of this build**. This runtime module uses a different, genuine code-authored pixel asset pipeline. The creator has not accepted these visuals; they may still require wholesale replacement with dedicated premium assets. No change to Phase 10 gate.

Protected: original world connected topology, 12 regions, 39 source solids, 48 anchors, 65 road links, seven crossings, original wanderer/warden art, and `veilward-hollowreach-v01` save.
