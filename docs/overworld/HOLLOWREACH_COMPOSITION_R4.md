# VEILWARD v1.3.10 — Phase 9 R4 Hollowreach Neighborhood Integration

**State: unapproved art-recovery slice. Visual acceptance stays at 0% and Phase 10 remains LOCKED.**

## Implemented in the actual playable iPhone game
- Hollowreach icy rock/cliff faces use several adjoining, slightly staggered source-painted transparent sprites clipped to their existing impassable polygon. The previous single stretched rocky sticker per large cliff is gone.
- Winter roads have lighter, less tube-like perimeter and center strokes while staying within already authored traversable corridors. Existing 65 roads and seven crossings are untouched.
- A shared low-opacity ambient lighting pass is physically sourced from actual painted village cottages, braziers, signs, and geometry-defined lantern posts. It does not add imaginary objects, new collision, or detached mock art.
- No primitive foreground oval is painted over the very same winter tree that already has real sprite canopy occlusion.
- Service worker, scripts and build identification advance to v1.3.10. Old approved Hero/Warden art, original illustrated Hollowreach and Greenwood screens, quest data and localStorage key remain intact.

## Still required
This **does not yet amount to a finished hand-illustrated village**, nor does it restore all 12 extended-world regions to the original painting quality. Next: inspect real-browser screenshots for cliff repeats, road flatness, size and occlusion; replace any failures and hand-compose the larger snow terrain, architecture, cliff, stairway and vegetation ensemble together. After a complete Hollowreach scene is genuinely good, implement a similar Greenwood pilot, and only then expand to other regions.

Automated checks: `npm run check`, `npm test`, `npm run audit:composition`. Browser and iPhone visual signoff are separate and mandatory.
