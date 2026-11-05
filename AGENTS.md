# VEILWARD — MANDATORY DEVELOPMENT WORKFLOW

> **GAME PATCHING AFTER FEEDBACK IS A REQUIREMENT — NOT MERELY AUTHORIZATION.**
>
> The developer assistant MUST update the **actual playable game** in this repository in direct response to each user playtest report, bug report, art correction, or development instruction. The assistant MUST do the implementation work before presenting a completed-response summary. The user's feedback is the work order, not an invitation to propose plans.

## Required cycle: user tests → assistant patches → user retests

1. **Read the latest feedback and screenshots carefully.** Diagnose the actual issue in source code and/or assets. Check the live repository, not assumptions from an older response.
2. **Patch the real game immediately.** Modify gameplay code, sprite atlases, assets, CSS, data, or service worker as needed. Do not provide only instructions, a diagnosis, future intent, design mockups, a plan, or a standalone art sheet in place of implemented changes. Do not ask for repeat authorization or defer to another turn.
3. **Follow the specific requested scope.** Keep approved work intact (especially the player-character atlas), preserve gameplay saves, and fix the actual requested issue without gratuitous unrelated rewrites.
4. **Quality-check the result before reporting completion.** Validate code syntax, correct asset dimensions/render paths, and behavior with available tests/simulations. For image bugs, inspect rendered output where feasible; do not claim final on-device visual confirmation without it.
5. **Push all required changes to this repository's GitHub main branch**, preserving history and checking the branch head before updating. Verify the new remote commit ID and source files *after* pushing. Keep iPhone Safari / Add-to-Home-Screen service-worker cache behavior in mind, including versioned assets and update detection.
6. **Return a short patch report, not a proposal.** State the exact modifications made, version/commit if verified, test results and any genuinely unverified device checks, and link to the playable game: https://hdog960.github.io/Vielward/.
7. **Repeat with the next user test.** The user should never have to remind the assistant of this loop.

## Non-negotiable prohibitions

- **Do NOT treat feedback as optional, future work, or merely permission to patch. Patching is mandatory.**
- Do NOT respond with a plan or explanation *instead* of making the patch.
- Do NOT send new sprite art, previews, or concept images as a substitute for updating the actual game.
- Do NOT repeatedly claim tool access is unavailable without first checking tools and actually attempting the repository operation.
- Do NOT claim an update was pushed or deployed if GitHub has not verified the commit; a GitHub push is not itself proof of iPhone cache refresh.
- Do NOT quietly abandon the patch if one method fails; inspect the blocker, try an available valid alternative, and do as much real work as possible.

## Genuine blockers and factual accuracy

If the repository is genuinely inaccessible, a tool fails, or the task is otherwise impossible, report the **verified** specific blocker and what was attempted; never invent a pushed patch or falsely promise asynchronous completion. This is an exception for truthfulness, **not** permission to skip work when tools are available.

## Current outstanding user feedback

- **Warden Hal must be rebuilt from scratch as a distinct character**, NOT merely recolored, painted over, given box-like helmets, or visually cloned from the player. Make a real dedicated sprite asset, wire it into the game, check its aesthetic in the scene, and preserve all Warden interactions and quest logic.
- **The player character must NOT be changed** during Warden work. Keep the approved eight-direction player atlas, movement, and animations untouched.
- **iPhone Home Screen shortcut updates must be reliable.** Verify versioning, service-worker activation and cache refresh on each patch. A closed and reopened app still may show stale assets; fix the update path rather than blaming the player.
- Keep the art faithful to the high-detail three-quarter pixel-art direction in ART_DIRECTION.md and ART_BENCHMARK.md.

## Scope and milestone

Follow PROTOTYPE_ROADMAP.md: perfect the Hollowreach playable slice and obtain explicit creator approval before broad full-game expansion. Prioritize quality of implemented art, controls, grounded sprites and collision over quantity of new content.

This file is the project's canonical agent instruction and applies on each future development turn. When answering from another chat, **read this file and the latest commit before changing the game**.

## Approved overworld rebuild roadmap — mandatory review gate

The creator approved the 22-phase continuous-overworld rebuild with an explicit new checkpoint: **after Phase 9, the creator must review and approve the appearance and geography of the fully built outdoor overworld** before Phase 10 begins. Deliver a real playable iPhone build with regional screenshots/map, not artwork alone. If the creator supplies corrections, patch the live game, push, and resubmit for review. Do not automatically advance. Source of truth: `OVERWORLD_REBUILD_ROADMAP.md`.

Roadmap approval does not override the established **one complete phase per "Continue development"** workflow. No new phase begins without an explicit continuation instruction.


## Overworld rebuild — Phase 1 source-of-truth audit complete (November 5, 2026)

**Completed only Phase 1** of the approved 22-phase plan. See `docs/overworld/ISSUE_REGISTER.md` (34 records, PDF p.1–12), `docs/overworld/WORLD_DESIGN_LOCK.md`, `docs/overworld/ASSET_AND_RUNTIME_INVENTORY.md`, `docs/overworld/COORDINATES_AND_MIGRATION.md`, machine-readable `docs/overworld/issue_register.json` and protected `docs/overworld/protected_assets.json`. Test with `npm run audit:world`. The detailed Phase 1 handoff is `docs/overworld/PHASE1_HANDOFF.md`.

Use `OVERWORLD_REBUILD_ROADMAP.md` as the **current next-development authority**; the old prototype and micro-sprint roadmaps are preserved as history. Phase 1 authorizes documentation-only auditing, not changing the current playable code. **Do not start Phase 2 until the creator says “Continue development”.** Before Phase 10, the creator must approve full overworld appearance after the Phase 9 review build. Continue the original test→notes→actual GitHub patch workflow for gameplay feedback.
