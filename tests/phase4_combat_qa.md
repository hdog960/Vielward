# Veilward Phase 4 — Combat/Balance QA (v1.2.5)

This phase improves **the existing playable sword, single spell, dodge and enemy behaviors**. It does **not** claim the future Gate 2 bow, shield, extra spells or elite encounters are implemented.

## Repaired bugs
- Old sword hit all enemies within an 82-unit circle if their dot product exceeded -8, including sideways and slightly behind the player, and ignored wall collision. Now uses a directionally correct forward cone (88 units, cosine >=0.43) plus collision-tested line-of-sight.
- Both `game.js` and `combat.js` had an initial bug with `facing.y || 1`: zero turned into 1, so horizontal sword swings falsely acted diagonal. Corrected to nullish defaults `??`.
- The previous enemy loop decreased `stun` but still processed `wind` later in the same frame, making stunned enemies strike anyway. New single-state combat step cancels windup on stagger/stun.
- Enemy damage used the player's *current* position at the end of a short timer without locked aiming or solid terrain visibility. Each enemy now locks its attack arc when starting the windup, and misses if the player moves away or around a blocking wall.
- Enemy chase/attack through photo-traced blockers removed by terrain-checked pursuit and LOS.
- Spell previously auto-targeted the absolute nearest foe, including one behind the player or on the far side of stone. Targeting is constrained by range, a forward cone (cosine 0.34; ~70° half-angle), and LOS; the projectile itself samples terrain in substeps.
- HP bars were fixed at Y−64, covering some character artwork. Now they use actual alpha-based head height.
- Stamina/MP cooldowns were functional but poorly communicated. Added visual control states and resource warnings without disabling controls.

## New gameplay values

| Mechanic | Value |
|---|---|
| Sword reach | 88 world units, frontal cone |
| Sword stamina | 12 |
| Spell mana | 16 |
| Spell targeting reach | 330 world units |
| Spell projectile speed | 360 units/sec |
| Dodge stamina | 24 |
| Dodge brief invulnerability | 0.34 seconds |
| Wolf windup / cooldown | 0.72 / 1.85 seconds |
| Bandit windup / cooldown | 0.88 / 2.05 seconds |
| Wraith windup / cooldown | 1.00 / 2.30 seconds |

## Automated verification

Run `node tests/phase4_combat.test.js` from the repository root. Uses Node built-ins only, no package installation.

**99 passing assertions:** all four cardinal directions (forward/back/flank/range), diagonal facing, sword LOS, spell targeting range/facing/LOS, dead-target exclusion; each enemy's windup, fixed aim, dodge/sidestep/retreat, cooldown, wall invisibility, stagger cancel, pursuit on open ground; projectile terrain impact and lifetime; all seven existing enemy spawn positions; no unauthorized changes to Wanderer/Warden art; game integration, HTML script order and service-worker cache coherence.

`game.js`, `combat.js`, `navigation.js`, `sw.js` and `visual.js` passed JavaScript syntax checks. Release assets were inspected for matching versioned references.

## Manual iPhone acceptance (not yet performed)

1. Open the Home Screen Veilward shortcut; check **Running build v1.2.5** in Journey Menu.
2. In Greenwood, face toward and away from a wolf. Sword should only strike when close and in the facing direction.
3. Stand near a safe stone/wall and cast at an enemy on the other side; orb must stop at the obstruction rather than hitting through it.
4. Approach wolves, bandits and the cave wraith. Expect distinctive warning cone/ring on the ground **before** any hit. Move sideways or dodge outside the cone to avoid damage.
5. Strike or spell a winding-up foe; its warning must cancel. Foes cannot swing through cliffs, cave lantern posts or railings.
6. Test low stamina/mana, potion count, and cooldown buttons; bars/buttons should make unavailable actions clear.
7. Confirm enemy HP bars are above their heads and do not cover sprites.
8. Return to village and reload the app; approved hero animation, existing saves, quest progress, and Warden Hal art must remain intact.

**Stop after Phase 4.** Phase 5 requires the creator's next explicit development instruction. Actual on-device validation is pending.
