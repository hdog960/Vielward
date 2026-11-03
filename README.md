# VEILWARD: THE BROKEN SKY

## Hollowreach — live prototype v0.2.1 (illustrated graphics update)

**Hosted through the user's GitHub Pages repository:** https://hdog960.github.io/Vielward/

This release replaces the previous procedural-looking play areas with actual illustrated Hollowreach, Greenwood, forge and cave scenes based on the approved concept direction. It also introduces alpha-cutout character animation/action poses, a richer HUD, ambient light glows, new area and interior placement, and versioned cache refresh. It is a genuine interactive browser build; the scenes and actors are rendered in the real game Canvas and existing mechanics still operate.

### What is playable
- Four connected areas: winter village, green forest, illustrated blacksmith interior and ancient cave.
- iPhone landscape touch joystick, attack, spell, dodge, interaction, potions; WASD/keyboard option.
- Blacksmith quest and missing supplies, inn rest/merchants, gathering, enemy encounters, journal, gold, experience and local saves.
- Direction and quest updates as player travels between scenes.
- No paid game engine, Vercel, backend, API, or account requirement.

### Controls
On iPhone Safari, rotate to landscape; use left thumb joystick and the right-hand action circles. Keyboard: WASD/arrow keys move, E/F interact, Space/J attack, Q/K spell, Shift dodge, I inventory, H potion.

### Art implementation and limits
The current visuals are **illustrated static scene plates with movable foreground characters**, not yet a world assembled from collision-aware modular tiles. Background villagers and environmental effects painted into the source scenes are not independently simulated characters. The player and several NPC/enemy actors are separate transparent sprites and can be animated or interacted with as game logic permits. The hero atlas currently reuses distinct attack/cast/dodge poses; a true direction-based frame-by-frame sprite animation system is still outstanding.

The art quality gate remains open; future passes will need full tileability, correct roof/cliff occlusion, animated rivers/fire, improved hitboxes, independent props and actors, detailed interiors, camera and UI QA on physical iPhone. Never claim the game matches the final screenshot quality until the creator approves actual gameplay screenshots. See ART_DIRECTION.md and PROTOTYPE_ROADMAP.md for acceptance criteria.

### GitHub Pages
For the repository `hdog960/Vielward`, Pages should serve `main` from `/(root)`. After publishing, open https://hdog960.github.io/Vielward/. The in-game game title is `Veilward`; repository spelling is `Vielward`.

### Cache notes
The service worker uses network-first caching and v0.2.1 cache names. Online users should receive the updated build on the next load. If an installed home-screen copy shows old artwork, fully close and reopen once while online (or visit the Pages URL in Safari).

## Status
Graphics update committed. Basic runtime interaction and save tests passed in code-level simulations; final device screenshots, touch testing and full level playthrough are not yet independently verified.
