# VEILWARD — Phase 1 Screenshot Reproduction and Acceptance Matrix

**Evidence:** the creator's 12-page `Vielward.pdf` as supplied in the conversation, including embedded screenshots on pages 1–11 and written project directive on page 12. This file DOES NOT assert that an old screenshot still reproduces identically in the latest v1.2.6 build: some collision and sprites were subsequently patched. Each future fix must be checked in real in-game iPhone rendering.

| Source page / screenshot | Pictured environment or route | Action to reproduce or inspect | Required post-fix in-game evidence | Planned phases |
|---|---|---|---|---|
| **1** | Hollowreach snowy bank and southwest route to Greenwood | Approach the old `Greenwood Trail` travel point from the village | Two or more consecutive in-game frames during a continuous walk along a visible geographically plausible road; no Talk prompt or abrupt biome swap | 2–3, 6–9 |
| **2, top and bottom** | Greenwood bridge exit, sign/flower border, attempted left turn | On the east bridge landing, attempt to walk west/left across apparently open path without detouring around a hidden collider | Before/after movement trail on the game map showing direct locally walkable route; obstruction only where actually drawn | 4, 8–10 |
| **3, upper** | Woodland encounter with human-looking bandit and other creatures | Approach bandit/wolf, inspect front/back/side plus combat movement | In-game animation strips for every initial combatant; outlaw looks distinct from civilians/player; coherent idle/walk/attack/hit/death | 17–19 |
| **4** (also page 3 lower) | Neon-cyan/blue triangular pickups at Greenwood stone stairs, lantern | Approach collectible and observe world-object sprite/interaction | Proper hand-authored pickup image with consistent light, scale, shadow, alpha, taken state; no raw triangle/white matte | 5, 16 |
| **5 upper** | Northern Hollowreach cabin/sign/snow path that appears to continue | Walk along the path past Joren/upper cabin into the implied north trail | Path continues to real destination/junction or has clear physical obstruction; no arbitrary invisible wall | 2, 8, 12 |
| **5 lower** | High village stone monument on a fenced rise | Follow stone stairs and try to circle monument | Full circuit on real snow/stone tread; feet cannot stand atop rail or shrine plinth, depth correct | 4, 8, 11–12 |
| **6 upper** | Joren's workshop cabin/steps and door | Walk to depicted door; press Enter | True enterable physical threshold leading to interior and sensible return; not just Talk to Joren from road | 12, 15 |
| **6 lower** | Trail Noticepost by snowy river | Stand close to depicted sign, choose Read | Screen-readable notice containing relevant route/world information, interact location aligned to sign art | 12, 16 |
| **7 upper** | Snowy riverbank path dead-ending at bushes used for climate teleport | Follow the painted trail and continue outward | Connected road or scenic trail naturally reaches gradual thawline, no nonsensical foliage portal | 2–3, 7–8 |
| **7 lower** | River/water island beyond village bridge | Identify safe crossing and attempt island | Real bridge/ford/transport represented in art; reachable island bank and a reason to go there | 2, 8, 14, 20 |
| **8 upper** | Greenwood river edge with flowers outlined bright white | Follow river edge and inspect foreground flower clumps | Seamless transparent/masked authored foliage without white cutout border, world scale consistent | 5, 13 |
| **8 lower** | Greenwood shrub/tree near path ending | Walk up against the tree/canopy | Trunk blocks movement and canopy occludes correctly; no standing on canopy or inaccessible dead-end trail | 4, 11, 13 |
| **9 upper** | Greenwood decorated stone stairs near lit ancient doorway | Walk the staircase from lower to upper landing | Continuous height transition, climbable stair treads, no transparent wall on visible steps | 4, 8, 13 |
| **9 lower** | Smuggler's Hollow rope bridge and lanterns | Walk entire bridge and reach both stone landings | Foot collision inside boardwalk only; no chasm walk, no lamp-top clipping or path blockage | 4, 8, 15 |
| **10 upper** | Smuggler's Hollow rocky chasm edge and lamp post | Walk and dodge near ledge | Character stands on actual floor elevation; contact shadow attached to boots, not floating in front of cliff | 4, 11, 15 |
| **10 lower** | Bridge-end chest-looking shape and travel marker | Try interacting with visually apparent chest | If container, visible Open action, loot and opened art; otherwise art is unambiguously noninteractive | 15–16, 20 |
| **11 upper** | Strange oval texture on the rock platform | Inspect and walk around/on marking | Oval gets authored meaning (lore, puzzle, magic, decoration) and honest collision/feedback | 15–16, 20 |
| **11 lower** | Violet Worldscar portal/shrine with elaborate stone surroundings | Approach, activate, revisit shrine | Unique interaction and one-time reward, purposeful lore/visual effects, clear consequence on revisit | 15–16, 20 |
| **12 (written directive)** | Entire outdoor region, no single reference screenshot | Traverse the full unified outdoor map before selecting detail slice | Phase 9 map overview + live full-world iPhone roam + region screenshots; creator explicitly approves appearance before Phase 10 | 2–9, hard stop |

## Screenshot capture acceptance protocol

1. Capture **actual game output** on iPhone landscape, not newly generated concept art. Note version and tested location.
2. Include the character's boot/foot point in frame near a problematic boundary, and at least one before/after view if the issue concerns traversability.
3. Compare the screenshot's drawn deck, shadow, stair or object edge against the collision/height debugger; verify the physical route is actually traversable on device.
4. Attach a status for each screenshot: `UNTESTED`, `REPRODUCED`, `PATCHED_AWAITING_IPHONE`, or `CREATOR_APPROVED`. **Do not substitute automated graph checks for actual visual approval.**
5. After a creator correction, **patch the real game and push the commit**, then recapture. Never send an isolated sprite sheet as the claimed fix.
6. Phase 9 additionally requires an overview of the whole proposed geography and distinct real in-game vistas across Hollowreach, snowy heights, Thawline, Greenwood, rivers/islands, and ruins. The creator can reject the layout or art before Phase 10.

## Evidence integrity

The PDF is the primary evidence of **what the creator disliked at the time of capture**. It is not proof that v1.2.6 still has each earlier bug; this distinction prevents stale screenshot complaints from being mislabeled as current verified regressions. Phase 1 performs an audit, not a runtime visual fix.

**Canonical issue IDs:** [`ISSUE_REGISTER.md`](./ISSUE_REGISTER.md). **Protection:** [`protected_assets.json`](./protected_assets.json).
