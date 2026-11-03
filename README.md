# VEILWARD: THE BROKEN SKY

## Hollowreach — playable prototype foundation v0.1

A **first playable engineering and visual-art pass** of an original open-world, top-down fantasy RPG. This repository is the user's GitHub Pages project; it is intentionally free of paid hosting, external libraries and online gameplay services.

**Important:** The creator's user-supplied snowy 3/4-view artwork remains our golden art benchmark. The current runtime renders its **own procedural pixel-style graphics** and is **not yet the finished graphical quality** approved for the prototype. This build is the foundation, not the completed vertical slice.

### Playing

On GitHub Pages, open the site in iPhone Safari, rotate to landscape, and tap **Enter Hollowreach**. Use the virtual joystick and the attack, spell, dodge, talk, and potion controls. Desktop controls: WASD, E interact, Space attack, Q spell, Shift dodge, I inventory, H potion.

Talk to the blacksmith Joren, travel east from Hollowreach village through Greenwood, fight the bandits, explore Smuggler's Cave to recover the stolen supplies, then investigate the strange Worldscar. You can also gather blueleaf, trade with the innkeeper, rest, purchase an improved sword, and save your progress.

### Implemented in the first code pass

- Three traversable maps: snowy village, forest, and cave, with camera, environmental details, simple collision and transitions.
- Canvas-rendered pixel-style scenery and character shapes, water, roads, elevated timber houses, snow pines, bridges and lanterns.
- Keyboard and mobile touch controls, sword combat, ranged spell attacks, dodge, enemy HP/telegraphs and three enemy types.
- NPC interaction and dialogue, introductory quest, environmental Worldscar, inventory, journal, mini-map menu, XP/leveling, healing and gold.
- Local autosave and manual save; standalone PWA metadata with network-first offline fallback.

### Not finished

Hand-authored sprite/terrain asset sheets, true frame animation, sophisticated collision and AI, enterable interiors, NPC schedules, branching quests, smithing, alchemy and cooking, full crafting, expanded roleplay choices, high-fidelity lighting, sound design, phone-device performance tests and the fully polished 30–60-minute vertical slice remain upcoming. **Do not consider the prototype finished until the user has reviewed and approved the in-game visual standard.**

See [ART_BENCHMARK.md](ART_BENCHMARK.md) for the nonnegotiable visual quality gate.

### GitHub Pages setup

Under **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then save. The playable URL normally takes the form `https://hdog960.github.io/Vielward/` after GitHub Pages finishes publishing. The repository's displayed name `Vielward` is retained; the game title is spelled **Veilward**.
