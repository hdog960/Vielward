# Veilward Phase 5 — Quest, Loot, Rewards, Saves and Regression QA

Build: **v1.2.6**. Tested with actual \`game.js\` dialogue and quest functions in mocked browser sessions. The screenshots and real touch feel must still be tested on iPhone.

## Complete playable introductory journey

1. Spawn in **Hollowreach** and speak to **Joren**: The Missing Supplies begins (quest 0→1).
2. Travel to **Greenwood** (quest 1→2). The Journal instructs the player to defeat a cave raider.
3. Enter the **Smuggler's Hollow**. The stolen-supplies chest refuses early interaction, explaining why. Defeat at least one live **cave bandit** (not only a wolf or forest bandit); the milestone saves automatically.
4. Recover Joren's crate **once** (+30 gold, +20 survival XP). Crate stays empty even after a reload; quest advances to 3. The pack contains the physical stolen supplies.
5. Return through Greenwood to Joren; explicitly choose **Return the supplies**. Quest item is removed and +80 gold, +75 survival XP are awarded once; quest advances to 4 (or 5 if Worldscar attuned earlier).
6. Visit the glowing **Worldscar** in Greenwood. First touch restores magicka, adds 35 sorcery XP, and advances to stage 5. Further touches are dialogue-only.
7. Optional: gather both distinct Blueleaf plants, bring to Mira to trade for one potion; patches remain exhausted after trading. Buy Joren's sword once; it cannot be purchased again at the same price.

## Permanent persistence behavior

| State | Separate from current inventory? | After reload |
|---|---|---|
| Cave bandit killed | Yes: stable enemy ID | Defeated raider stays dead; surviving raider stays alive |
| Caravan supplies taken | Yes: suppliesRecovered | Chest remains empty |
| Supplies returned | Yes: suppliesDelivered | Reward/hand-in not available again |
| Individual Blueleaf collected | Yes: herbHarvested IDs | Plants stay harvested even if herbs traded |
| Worldscar attuned | Yes: scarAttuned | Does not repeat XP |
| Tempered sword acquired | Weapon equipped state | Does not charge gold again |
| Current quest/stats/gold | Original save key | Preserved |

Old v1.2.5 saves are migrated in place without deleting progress: quest 4+ implies already delivered supplies, quest 3 with previously recovered items restores the hand-in quest item, earlier herb quantities are mapped to identified patches when no old pickup list exists. Past Blueleaf **trades cannot be fully inferred** from older saves that never recorded harvest IDs; this limitation is disclosed rather than guessing.

## Automated test results

| Suite | Assertions | Result |
|---|---:|---|
| \`node tests/phase3_scene_geometry.test.js\` | 1,319 | PASS |
| \`node tests/phase4_combat.test.js\` | 100 | PASS |
| \`node tests/phase5_quest.test.js\` | 91 | PASS |
| **Total** | **1,511** | **PASS** |

Phase 5 tests execute the production game logic (not a fake reimplementation) under a mocked browser canvas, DOM, navigation, and storage; they reopen the same serialized save in separate mock app instances and inspect in-game dialogue choices, current gold, stage, world pickups, equipment, quest and NPC status. Scenarios include full normal journey, early Worldscar attunement, completed-quest legacy saves, active-delivery legacy save repair, vendor purchase, herb trade, and reset.

All six relevant JS files pass syntax checks. HTML/PWA cache references agree on versioned quest/combat/game/visual/navigation scripts; no new external dependencies introduced.

## Actual iPhone review still required

1. Launch the **Home Screen** installation and confirm **v1.2.6** in Journey Menu. Report if the Home Screen icon still loads an older version than Safari.
2. Start/restart a new journey. Speak to Joren and follow the visible southwest snow trail into Greenwood, then the correct bridge/cave entrance.
3. Defeat a raider **inside** the cave, retrieve supplies and return to Joren; verify the clear progression and reward on-screen, especially on iPhone after suspending and reopening.
4. Revisit the emptied cave chest and spent Blueleaf plants after a relaunch; no duplicates.
5. Visit Worldscar; check the new journal status and ability to continue exploring.
6. Verify sword facing/dodge/telegraphs visually and confirm enemy damage is not passing through scenery.
7. Inspect foreground bridge railings, lantern posts, village shrine fences, vertical cliff edges, indoor art and player/NPC depth in village, Greenwood and cave, including any lingering floating/jumping depth visuals.
8. Check save/reload and reset on the Home Screen launch; do **not** uninstall the icon to clear cache without first reporting its version.

## Longer-term Gate 1/vertical-slice gaps — not approved

The 2-hour planned-work sprint is complete, **not** a guarantee of 2 elapsed hours or of creator approval. Existing canonical \`PROTOTYPE_ROADMAP.md\` and art benchmark require:
- actual user-approved iPhone screenshots, including consistent village/forest/cave lighting, foot grounding and character scale;
- dependable foreground bridge/rail/roof masks and believable cliff elevation and world-depth ordering;
- a fully explorable and illustrated interior(s), real tile-art pipeline and remaining UI/animation polish;
- Gate 2 bow/shield/multiple spells and later side quests, NPC schedules, and full RPG systems remain out of scope.

**STOP after Phase 5.** Await the creator's evaluation and explicit next roadmap before expanding the game.
