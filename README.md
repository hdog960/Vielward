## Phase 9 R40af — unify original painted Greenwood Falls tree crowns (2026-11-10)

Changed actual `world_greenwood_art.js` so all source-rooted oak/pine trees in `greenwood_falls` select the original R18 painted atlas when available, rather than periodically substituting the distinctly styled procedural crown for variant 1. Existing fallback remains if painted images fail to decode. This is a scoped visual-consistency change, not the full scene composition overhaul; no source tree positions, collision, routes, waterways, quests, or saves were edited. Renderer commit `7eb97eb4441d6596d0b481c2e07514f04caa2297`; HTML cache commit `653136ea6da5e921cba15a8dcd8b0329871b66f2`; worker cache commit `93af9a27b2b6956c6575cc93bf02bce5d8ee338a`. Full regression, browser screenshot, Pages publication and iPhone testing are **not verified**. **Phase 9 active; creator visual acceptance 0%; Phase 10 locked.** Next: inspect real browser screenshots and pursue substantive forest composition and cliff-to-forest transitions.

## Phase 9 R40ae — canopy-link corridor visibility (2026-11-10)

Updated the actual Greenwood renderer's painted tree-to-tree canopy links. The previous three centreline checks could miss narrow diagonal roads, river bends, or collidable scenery under broad overhanging foliage. The candidate link now samples 13 longitudinal stations at five transverse offsets, checking source forest, water, roads, and obstacles before drawing. This deliberately omits a painted link when its footprint is unsafe; it does not change source trees, collision, world geometry, routes, quests, or saves. Renderer commit `e0cb1814263dca852a808ce7ea141f17bb3297e2`; HTML cache `cfe8f0a990c3d771525513ecde75096c28dff9c7`; service worker `3fb627150037121523d31c38fe89d00a79c1c035`. JavaScript syntax checks passed in the connector runtime for renderer and service worker. Full gameplay regression, actual browser screenshot, Pages publication, and physical iPhone test have not been verified for this revision. **Phase 9 active, creator acceptance 0%, Phase 10 locked.** Next: verify CI and screenshot-based composition, then pursue substantive forest artwork rather than repeated small safety patches.

## Phase 9 R40ad — preserve native painted canopy proportions (2026-11-10)

In `world_greenwood_art.js`, corrected the Greenwood Falls R40ab canopy compositor to render both oak and pine upper-crown crops at the original R18 source image aspect ratio (90/128). Previously pine used 0.82, visibly elongating the source artwork, despite the locked prohibition on stretched foliage. Existing physically rooted source trees, 25-point road/water/region checks, source canopy images, crossings, collisions, quests and saves remain unchanged. This is a limited source-art fidelity correction, not the substantial forest redesign still needed. Full regression, browser screenshot, Pages publication and physical iPhone test remain unverified at writing. **Phase 9 active, creator visual acceptance 0%, Phase 10 locked.** Next: verify CI and actual gameplay captures, then prioritize a cohesive large forest composition pass.

## Phase 9 R40ac — protect diagonal trails under Falls canopy (2026-11-10)

In the actual `world_greenwood_art.js` R40ab Falls canopy renderer, replaced five-point canopy-footprint clearance with a 5-by-5 source-ground sampling grid. Narrow diagonal physical trails or river edges could slip between the previous samples and receive an opaque painted canopy despite being traversable. Each painted crown tier is now omitted if any sampled visible footprint overlaps a source road, water, or non-Greenwood region. This is a visibility correction to existing original R18 painted canopy assets, **not** a new landmark, collision, road, river, bridge, quest, or save modification. Renderer commit `b8a537bb1497575467deb5d1a1991dfb1b5be26a`; HTML cache `743a24eb38af6b49e80a2bc8ef2dc42469d51f01`; service worker `85ecee392ecf1d2152731637aa19636bb546091d`. Renderer and worker passed JavaScript syntax compilation in the connector runtime. Complete regression, actual-game screenshots, R40ac Pages deployment, and iPhone testing remain unverified at note time. **Phase 9 active; creator acceptance 0%; Phase 10 locked.** Next: verify CI/Pages and inspect real Falls gameplay screenshots, then prioritize a substantial original-art forest composition pass.

## Phase 9 R40ab — layered native Greenwood Falls canopy boughs (2026-11-10)

Changed the **actual** `world_greenwood_art.js` Falls bough compositor: each original physically anchored R37 old-growth root can now contribute up to two staggered, differently sized R18 painted crown tiers rather than one identical flat canopy strip. Each candidate checks its center and four footprint locations against the authoritative forest region, source water and source roads, and keeps the original Falls overlook approach clear. No tree colliders, paths, river geometry, crossings, quests, actors, or save logic were modified. The game asset URL and installed-app service-worker cache were rotated. Source commit `2b410283c4509823b56a1d746cb881dcd108dcf4`; HTML `1d8a98eec2232efe0dfba131d7985110bf812d2f`; worker `f0d3fcf6afc0145141e1968ec172aadb1dd10042`. Renderer and service-worker JavaScript syntax compiled in the connector runtime. **Not yet verified:** full regression, actual browser screenshots, this revision's Pages deployment, physical iPhone visual quality. This is a composition-oriented integrated art pass, not creator approval. **Phase 9 active; creator visual acceptance 0%; Phase 10 locked.** Next: inspect actual Greenwood Falls gameplay captures for foliage coverage and road visibility, verify CI/Pages, then pursue coherent forest/cliff composition with original illustrated assets.

## Phase 9 R40aa — continuous elliptical Greenwood canopy pigment (2026-11-09)

In actual `world_greenwood_art.js`, fixed a visible rendering mismatch in R40z: a circular radial gradient was clipped by a separately drawn ellipse, producing an abrupt ellipse-shaped cutoff instead of genuinely feathered forest-floor light. The gradient and shape now share a single translated, rotated, vertically scaled Canvas coordinate system, so the pigment reaches transparent at its elliptical perimeter. This is a small integrated environment-art correction, **not** the needed major forest-composition overhaul. The existing source-road/water perimeter exclusions, source tree roots, all geometry, crossings, quests and saves are untouched. Renderer JavaScript syntax compiled with `new Function` before commit. Updated `index.html` asset query and `sw.js` offline cache for installed clients. Renderer commit `268cc8471f66e7bc25f70e0a5021d138ebfa91da`, HTML `25d6093493b861b6c46ba39e2a99ca367e08e327`, worker `999f488998f388379acd6e3a53ef7329970ec8f7`. Full regression, live screenshot, GitHub Pages publication and physical iPhone verification still require independent confirmation. **Phase 9 active; creator acceptance 0%; Phase 10 locked.** Next: verify workflows, capture real Greenwood Falls screenshots, prioritize original illustrated dense canopy and scene composition.

## Phase 9 R40z — source-road-safe Greenwood Falls canopy light (2026-11-09)

Inspected current main R40y, locked art direction, current renderer and recent Pages workflow. The R40y light pool called `geometry.nearRoad(x,y,110)` without the required predicate argument; unlike existing correct calls, this did not reliably enforce source-road clearance. In actual `world_greenwood_art.js`, fixed the API invocation and added 12 perimeter samples of each elliptical light pool against source biome, physical water and roads before painting. This prevents diffuse canopy light from visibly washing across walkable routes, bridges and water; original tree anchors, all geometry, collision, crossings, quests and saves are unchanged. Renderer `725d8000b14cc12273fdc3035b2348dea8942b14`, HTML `a1de5d4812bd99953bab181a4f23f051f7397472`, worker `ac7c398a84af5b01e240a1df14d94e81b1f07cbd`. Source parsed with JavaScript Function constructor before commit. Previous R40y Pages workflow 42739308247 succeeded; R40z regression, Pages publication, actual-game screenshots and physical iPhone remain unverified at time of writing. This is a correctness and visual-coherence improvement, **not** a major forest art overhaul. **Phase 9 active, creator acceptance 0%, Phase 10 locked.** Next: inspect actual Greenwood Falls screenshots and CI, then prioritize cohesive original painted canopy and forest composition.

## Phase 9 R40y — source-rooted filtered light in Greenwood Falls (2026-11-09)

Added three subtly offset, elliptical translucent canopy-light pools beneath each *existing* authored Greenwood Falls old-growth oak/pine root in the actual `world_greenwood_art.js` forest-floor compositor. Pools use deterministic per-root variation, skip existing water and road proximity, render beneath original riverbanks/paths/actors, and add no new trunks, colliders, geometry, quests, or saves. The intention is a more coherent forest-light composition instead of additional isolated cliff strokes; actual visual quality still requires live screenshots and creator review. Updated `index.html` and `sw.js` asset/cache references for installed clients. Renderer commit `ba44b211de2006b31363f555cc3f0a25e3aad007`, HTML `8c19d10814171563c2c44b81d21d12313e99d577`, service worker `a7bbdf9e9aa725fb607ff2c359b399a7e2f87e44`. Retrieved final renderer and service worker; both passed JavaScript syntax compilation. At inspection, GitHub regression and Pages workflows for `a7bbdf9` were queued; successful tests, deployment, browser screenshots and physical iPhone review remain **unverified**. **Phase 9 active; creator visual acceptance 0%; Phase 10 locked.** Next: review real browser visual captures and regression, correct any forest-light road spill, then prioritize substantive native canopy/cliff compositions.

## Phase 9 R40x — broken shale and moss ledges inside original Greenwood Falls cliff polygons (2026-11-09)

At main R40w, inspected art direction, roadmap, prior renderer, test harness and recent commits. In `terrain_art.js`, added 8–12 deterministic short curved shale shelves, with sparse moss-lit accents, **only** inside the original Greenwood Falls cliff-face polygons via the existing clip and source-region check. The marks vary in world position and contour rather than adding freestanding cuboids or stretched continuous bands. No collision polygon, physical river, bridge, route, quest, character, or save code changed. Renderer commit `40beb7959851d8d14539fb00942614854b8b7b79`; HTML cache reference `b780f9e87a61e23763c4876dc04064467fc11d77`; service worker `f2307a0f12bdc1778335bfe2dde7ba233ef2375c`. Renderer and service-worker JavaScript passed syntax compilation in connector runtime. **Not verified:** full regression, actual-game screenshot inspection, Pages deployment, physical iPhone test or aesthetic success. Phase 9 remains active, creator visual acceptance 0%, Phase 10 locked. Next: check CI/Pages and obtain real Greenwood captures; prioritize substantial forest composition and avoid spending further sessions on isolated small cliff strokes.

## Phase 9 R40w — variable source-clipped Greenwood cliff folds (2026-11-09)

Inspected latest main (R40v), the locked art direction, Phase 9 roadmap, existing Greenwood shoreline test, and the actual `terrain_art.js` cliff renderer. The R40u cliff painter still rendered exactly five nearly evenly spaced facets in every physical cliff face. R40w now deterministically varies each cliff polygon's fold count from three to seven, offsets each center asymmetrically, and selects mineral tones by a world-seeded hash rather than a repeating three-color sequence. All painting stays clipped to the **unchanged original cliff polygon**; no new obstacle, bridge, road, water, quest, player, or save change. Updated `index.html` and `sw.js` references for the installed iPhone client. Renderer JavaScript passed a `new Function` syntax compilation before write. Commits: renderer `4d4f60fb71812223c3919887bad310d84bb3566d`, HTML `67b42e2348a6af907a51670b1a17ab5dbfb274a5`, service worker `119da39b6700f06910cde83fcc15c45f57ffe197`. Container clone was blocked by DNS resolution; complete local regression, live screenshot inspection, Pages publication, and iPhone hardware testing **are not verified**. This is a limited real renderer improvement, not the major forest/cliff composition overhaul. **Phase 9 active, creator acceptance 0%, Phase 10 locked.** Next: inspect GitHub Actions outcomes and actual-game captures, then prioritize scene-wide forest and cliff art.

## Phase 9 R40v — shoreline art regression exercises grounded fern shadows (2026-11-09)

Inspected current main R40u, art gate and latest Actions regression logs. The R40u regression workflow `42707554293` failed at `tests/greenwood_falls_shoreline_r40.test.js` because the test Canvas mock lacked `ellipse()`, now used by actual R40r contact shadows. Updated that test's Canvas mock to count `ellipse()` calls, added `bezierCurveTo()` support for the real fern paths, and asserted that at least one ground-contact ellipse is exercised by the shoreline audit. Test commit `bd5a3fc6f24483113bd1e0359a73afcfe5295c90`. This is **regression coverage repair, not new artwork**. The existing playable renderer, 48 nodes, 65 roads, seven crossings, collisions, quests and saves were not modified. Container clone failed (network), so local Node execution is **not verified**; new Actions regression `42717123332` was queued when checked. Recheck its outcome and the actual browser captures before visual work. **Phase 9 active, creator acceptance 0%, Phase 10 locked.** Next: if CI passes, prioritize substantial Greenwood Falls forest and cliff composition rather than additional micro-decoration.

## Phase 9 R40u — varied clipped cliff folds and regression compatibility (2026-11-09)

After inspecting the latest R40s main and actual Actions logs, fixed the synthetic Canvas mock in `tests/overworld_phase5_art.test.js` (commit `d44b4ced78309226499ba08b8feb31d1daea040d`); its run passed the Phase 5 art audit (333 assertions) but then failed the Phase 6 footprint audit at the same missing `quadraticCurveTo` mock method. R40u now also provides a Canvas-compatible straight-segment fallback for those synthetic contexts while preserving true curved artwork in real browsers. More importantly, the actual `terrain_art.js` cliff painter now varies each clipped mineral fold's width, height, lateral lean, seams and highlights deterministically per physical cliff polygon, reducing five repeated column-like facets. Physical cliff polygon, world nodes, roads, crossings, collisions, quests and saves remain unchanged. Commits: renderer `bb2113361f6c82e71a98a41a585e225b5745c118`, HTML `2301cb2ef170da1ced6bb386debfac26e1ece004`, SW `640ca9d9f51216e4879290c10376057aca6a09cf`. R40s Pages workflow `42697630574` succeeded; R40u full regression, screenshot, deployment and iPhone hardware remain unverified pending Actions. **Phase 9 active; creator acceptance 0%; Phase 10 locked.** Next: inspect fresh CI and actual Greenwood Falls captures; pursue substantial forest/cliff compositions, not small patches alone.

## Phase 9 R40t — restore cliff-art regression coverage (2026-11-09)

Inspected R40s main, art-direction gate and live Actions results. The R40s Pages workflow `42697630574` **succeeded**, but regression `42697630563` **failed** at `tests/overworld_phase5_art.test.js` because its synthetic Canvas context lacked `quadraticCurveTo`, which the R40s source-clipped curved cliff facets now use. Updated only that test's mock to implement and count `quadraticCurveTo` and `bezierCurveTo`, allowing the real R40s painter to execute in the established geometry/compositing regression rather than weakening or bypassing its assertions. Test-harness commit `d44b4ced78309226499ba08b8feb31d1daea040d`. This is a real CI compatibility repair, **not new artwork**; source rendering, crossings, 48 nodes, 65 roads, seven bridges, quests, saves and physical collisions were not changed. The new regression and Pages runs were in progress at inspection and must be checked before claiming success. No new actual-game screenshot or iPhone test. **Phase 9 active, creator visual acceptance 0%, Phase 10 locked.** Next: confirm regression passes, inspect actual Greenwood Falls capture, then implement substantial authored forest/cliff composition rather than additional small details.

## Phase 9 R40s — organic clipped cliff-face strata (2026-11-09)

Replaced the four conspicuous axis-aligned rectangular columns inside the actual `terrain_art.js` cliff-face polygon painter with five asymmetrical curved stone facets and restrained mineral seams, clipped to the **original physical polygon**. This is a visual-only source-art change; no cliff collision, traversable routes, river crossings, world topology, quests, or saves were edited. Updated `index.html` terrain script cache query and `sw.js` offline cache revision for installed clients. Renderer commit `03d46f2c202d50bcd2b411b1bd9fd6871153d5ff`, HTML `330eecec0d2245133f98cce95785248c42d3d9fe`, service worker `9d75d647016fdfe1a1b66085c5dbeb52aebf50bd`. JavaScript source parsed with Function constructor after push; full regression, actual-game screenshots, Pages deployment and iPhone testing remain unverified. **Phase 9 active; creator visual acceptance 0%; Phase 10 locked.** Next: check CI/Pages, inspect real Greenwood captures, then address dense forest/cliff composition and remaining block-like setpieces.

## Phase 9 R40r — grounded riparian leaf rosettes (2026-11-09)

At the verified R40q main head, added five small asymmetrical painted ground leaves and a soft elliptical contact shadow beneath each existing source-aligned Greenwood Falls fern tuft in `terrain_art.js`. Placement inherits R40p's original source riverbank, footprint, road and crossing guards; marks are decorative, not new geometry, collision or landmarks. The change addresses floating-looking fern roots without introducing repeating square props. Rotated the `index.html` terrain script query and `sw.js` cache name/query for installed clients. JavaScript syntax compilation passed for renderer and service worker in the connector runtime. Commits: renderer `2873ed835dd4c99962b0ea9b9b25d33f3f60d022`, HTML `1dcd551f659f5717ce1758398a8935e51762b59e`, SW `82fae738904d03eac91ba77de75c2b6496694785`. Full regression, real gameplay screenshot, Pages deployment and physical iPhone tests are not yet verified. This is a modest environmental art improvement, not creator acceptance. **Phase 9 active; creator acceptance 0%; Phase 10 locked.** Next: verify CI/Pages and inspect actual Greenwood Falls captures, then prioritize substantial forest and cliff composition.

## Phase 9 R40q — repair failing shoreline regression invariant (2026-11-09)

Inspected latest main at R40p (`d1940bd49f72ac9849c443f5ad54b198c7493d74`), source renderer, art direction and actual GitHub Actions failures. The R40p regression workflow `42671569546` fails in `tests/greenwood_falls_shoreline_r40.test.js:75` because its old assertion requires a 172-unit gradient even at river bends. The R40l renderer intentionally uses an interpolated, unnormalized source-bank normal to keep pigment aligned with the actual source-bank polygon; at bends its gradient length is naturally less than 172. Updated the test to require finite, visible, non-oversized gradient spans instead of incorrectly forcing renormalization. Test commit `00c4328fe426df36298f9267f4e5f1941ee0d061`; changed file: `tests/greenwood_falls_shoreline_r40.test.js`. This is a regression-gate repair, **not** new environment artwork. Previous R40p Pages workflow `42671570143` also concluded failure, so deployment of the latest art is **not verified**. Await fresh CI results and inspect remaining failures before any further renderer changes. No gameplay, save, route, crossing or geometry files changed. No actual-game screenshot or physical iPhone test completed. Phase 9 active; creator acceptance 0%; Phase 10 locked. Next: verify CI and Pages, then capture and review real Greenwood Falls gameplay and implement a substantial forest/cliff composition pass.

## Phase 9 R40p — native-bank fern fronds and crossing-gap clearance (2026-11-09)

In the actual `terrain_art.js` Greenwood Falls shoreline painter, added small deterministic lateral fern fronds with individually curved leaflet strokes, layered over existing asymmetric riparian tufts. Kept foliage confined to existing dry-bank stations; skip vegetation on and immediately adjacent to source-bank sections rejected by physical bridge clearance, avoiding fronds at real crossing gaps. No changes to physical river, routes, terrain geometry, quests, saves, or collision. Rotated HTML and offline service-worker terrain query and cache key. JavaScript syntax compilation passed in the tool runtime before writing. Full gameplay regression, actual browser screenshot, Pages publication, and iPhone hardware remain unverified. This is incremental integrated art, not creator visual acceptance. Phase 9 active; creator acceptance 0%; Phase 10 locked. Next: inspect real Greenwood screenshots and prioritize major forest/cliff composition.

## Phase 9 R40o — organic world-anchored dry-bank wash contour (2026-11-09)

Changed actual `terrain_art.js` Greenwood Falls watercolor outer edge from a strictly straight interpolated bank line to a continuous world-coordinate two-frequency contour (10+5 world-unit amplitudes). Adjacent short wash sections calculate the same contour at shared endpoints, avoiding section-edge discontinuities. The inner edge, 180-unit physical waterline, river centerline, crossing clearance, roads, geometry, collision, quests and saves are unchanged. Rotated `index.html` terrain script query and `sw.js` offline cache key/query for iPhone Home Screen clients. Renderer commit `7e2c0dbe04ca6ad3c138be88f0c1b0d97b23af8a`; HTML `c0150a113e773b69b312a24af5ae196c37064132`; service worker `53326e9712287eaf6e664f4e7c419fa2bcc4790a`. JavaScript syntax compilation passed before write. **Not verified:** complete regression suite, actual browser screenshot, Pages deployment, iPhone hardware. This is a localized in-game bank-shape refinement, not a major forest/cliff composition pass or creator approval. Phase 9 active, creator acceptance 0%, Phase 10 locked. Next: inspect real Greenwood screenshots and prioritize substantial native forest/cliff composition.

## Phase 9 R40n — asymmetric source-bank riparian leaves (2026-11-09)

Changed actual `terrain_art.js` Greenwood riparian brush tufts from three repeated identical stems into small deterministic asymmetric leaf silhouettes. Each source-aligned tuft now varies stem height, spread and curvature; two stems receive translucent curved leaves. Original river stations, physical 180-unit water radius, road/crossing guards, region filter, bounds, collision, world topology, quests and saves are untouched. Rotated `index.html` asset URL and `sw.js` offline cache. Commits: renderer `1fc9e3546d25ecb6e09cf0b997a334acc59a3981`, HTML `095dac223dc3d1912e2de6415a93af07e0b78145`, service worker `41d59d12b204040f000a5b8f2c439afd9716c375`. Syntax compiled via JavaScript Function constructor before writing. **Not verified:** complete npm tests, actual browser capture, Pages deployment or iPhone hardware. Small integrated environmental artwork improvement only, not creator acceptance. Phase 9 active, creator acceptance 0%, Phase 10 locked. Next: inspect real Greenwood screenshots and prioritize major forest/cliff compositions.

## Phase 9 R40m — organic source-bank riparian inkwork (2026-11-09)

Added short curved, three-blade native-color riparian brush tufts on the dry side of the actual Greenwood Falls channel in `terrain_art.js`. Placement uses the existing river station normals, deterministic world seeds, real Greenwood footprint and authoritative road/crossing clearance. Tufts are decorative only, not collision objects or new landmarks; the 180-unit water radius, physical bridge geometry, routes, quests and saves remain untouched. Script references and offline cache rotated in `index.html` and `sw.js`. Commits: renderer `9a2bdf8df66c797dd0e2d95336fa1d0314aabbc0`, HTML `d6f6f26df787e24b321264e19886b14e2659b409`, service worker `0237685af36d1ca86a1406210d76d7b8de9315ff`. Re-fetched renderer and passed JavaScript syntax compilation in the tool runtime. **Not verified:** actual browser screenshot, complete npm regression, Pages publication, iPhone hardware. This is a small integrated environmental detail, not creator visual approval. Phase 9 remains active; creator acceptance 0%; Phase 10 locked. Next: inspect actual Greenwood Falls captures and pursue substantial native forest/cliff composition work.

## Phase 9 R40l — bend-consistent Greenwood shoreline pigment (2026-11-09)

Fixed an actual `terrain_art.js` paint-coordinate inconsistency: source-bank polygon vertices use interpolated (not renormalized) station normals, but its color-gradient axis was renormalized at each midpoint. At bends this moved watercolor stops away from the source-aligned painted shoreline. The gradient now uses the same interpolated normal as the polygon, without changing the source river, bridges, collision, roads, quests or saves. Renderer `4c05fa4b1bda96027e63aeb33ddcd3d7f5ef1bd7`; HTML cache `ee9641f52be0dedd52b4ad9b97edc924d7ff62d6`; service-worker cache `e2c13f71f5f0bde3a4af73bb5fcad774451effdc`. This is a narrow rendering fix, not a substitute for dense forest/cliff composition work. Actual-game screenshots, full regression, Pages deployment and iPhone hardware test are unverified for this revision. Phase 9 remains active; creator acceptance 0%; Phase 10 locked. Next: obtain real Greenwood Falls screenshots, inspect source-based riverbank and forest/cliff quality, and pursue substantial illustrated composition improvements.

## Phase 9 R40k — full shoreline visibility bounds (2026-11-09)

Corrected an early renderer visibility check in `terrain_art.js`: it previously expanded the source-channel bounding box by only the 106-unit dry reach, despite painted banks extending 180+106=286 units from the channel. Streamed tile edges could therefore omit visible watercolor near Greenwood Falls. The guard now uses the complete 286-unit extent on all four sides. Physical river geometry, crossings, collisions, paths, quests and saves are untouched. Source commit `7e21409c5a1147745973d900417a7bbee03e4bc0`; HTML cache revision `09a1ec7c5573ef18ac9ac3b0841e3ba27bd1b2cf`; service-worker revision `935e4549e177e8caa3a49d9e0b7ba51d3040a32e`. No live browser screenshot, full regression, Pages deployment or physical iPhone test verified in this run. **Phase 9 active, creator acceptance 0%, Phase 10 locked.** Next: check CI and actual Greenwood Falls capture; prioritize substantive forest and cliff artwork.

## Phase 9 R40h — local shoreline wash around real bridges (2026-11-09)

R40f skipped a whole source-channel shoreline segment whenever any part touched a crossing, leaving potentially large bare rectangular banks beside bridge approaches. R40h updates the actual `terrain_art.js` renderer to divide each existing bank segment into at least eight short wash sections, check each section's endpoints and midpoint at three source-aligned bank depths against the authoritative crossing geometry, and render only the safe portions. Sections beside a crossing receive reduced pigment opacity to soften the abrupt edge. No world centerline, bridge, water hazard, collision, path, quest or save data was modified. The existing water-current stroke crossing guard remains. `index.html` and `sw.js` use a new cache query; the service-worker cache key was rotated for installed iPhone clients.

Commits: renderer `a2cc6e4ef101687f0352d0113300b36161be5e1b`, HTML `228959d142ce24d47638553af949776a31992743`, service worker `af862e872d3ce4c10c4fc488b9a259c56150f87d`. Re-fetched updated source and parsed JavaScript successfully using `new Function` (syntax only); full regression, real browser screenshots, deployment and physical iPhone tests require separate verification. **Phase 9 remains active; creator visual acceptance remains 0%; Phase 10 locked.** Next: review actual Greenwood Falls capture, especially bridge-bank feather and forest/cliff composition; do not treat a syntax check as visual approval.

## Phase 9 R40f — source-aligned shoreline crossing clearance (2026-11-09)

The previous R40e shoreline painter skipped a wash panel only if its dry-bank midpoint overlapped a crossing. Long panels could still tint a real bridge approach elsewhere along the source segment. R40f checks five stations across each panel at the inner water edge, physical waterline (180 units), and outer dry-bank edge against authoritative crossing geometry before applying the gradient. This only omits decorative pigment where crossing overlap is possible; physical water, river centerlines, routes, bridge decks, collision, quests and saves remain untouched. `terrain_art.js` code commit `03ac6bc860767229c5738a568b3c082dbc01d834`; HTML cache reference `4ae6bcab2917e8e7cf0e8c3b2a3d53c6ddd1e7bb`; service worker `fdd006d35719b761b15f26846c01cf932842ca4f`. Verify latest regression, visual QA, and Pages workflow before claiming success. No real browser screenshot or physical iPhone test performed in this run. **Phase 9 active; creator visual acceptance 0%; Phase 10 locked.** Next: inspect actual Greenwood Falls screenshots and improve the larger forest/cliff/river composition rather than relying on source assertions alone.

## Phase 9 R42 — cap shoreline wash normals at sharp source bends (2026-11-08)

Changed the actual Greenwood Falls `terrain_art.js` shoreline normal computation: at near-hairpin turns in the existing source channel, use the incoming segment's perpendicular instead of the averaged station tangent, preventing an exaggerated wash protrusion into unrelated ground. This affects visual shoreline pigment only; no world geometry, collisions, crossings, routes, saves or quests changed. Updated the terrain script cache query in `index.html` and `sw.js`, plus the service-worker cache key. Source commit `fcf6ba1d671ded5349371350667a37bb7ff3d0bf`; cache commits `cdebcf506c35b805690130a7420b654c76f6f17d`, `544e8879ed8dd9646ffbfcd9117cbebd859ad132`. Static exact-target assertions passed before write. **Not verified:** node tests, browser rendering, GitHub Pages deployment, physical iPhone. Phase 9 active, Phase 10 locked; creator visual approval remains 0%. Next: real screenshot and regression tests of R42 source-channel turns.

## Phase 9 R41 — remove periodic shoreline wash banding (2026-11-08)

The existing R40 river-to-forest wash used `q.index % 3` to dim every third bank panel, which could introduce a repeated visual seam along the Frostbridge River. R41 replaces this abrupt every-third-panel multiplier with a smoothly varying world-position pigment modulation (0.88–1.0), keeping the original water-to-land gradient and the source-aligned 180-unit water hazard untouched. Updated `terrain_art.js`, rotated its script URL in `index.html` and `sw.js`, and changed the offline service-worker cache key so Home Screen clients can retrieve the new art. No topology, collisions, saves, gameplay, crossing or Phase 10 code was edited.

Commits: artwork `eed970e46a56af3fd4142a958b8f039e31157aa7`; HTML cache reference `e45467ffe9bfaceefd3c34e8b116a734133500df`; service worker `4aff706892289fcd223653457eec6e9e48cdfab7`. Re-fetched all three files from GitHub and verified the continuous modulation replaced the old index-modulo expression and both PWA references and cache version changed. **Not verified:** full npm tests, actual rendered screenshots, GitHub Pages publication, physical iPhone performance. This is a targeted in-game artwork adjustment, not visual approval. Phase 9 remains active; Phase 10 locked; creator acceptance 0%. Next: real browser capture and source shoreline review, check waterline for remaining sharp diagonal joins.

## Phase 9 R40 — source-water shoreline blend, native grounded riverbank forest (November 8, 2026)

R39c's gameplay screenshot showed a sharply clipped blue diagonal river despite correct physical water. R40 adds source-aligned 114–286-unit translucent water-to-woodland pigment across the *unchanged* 180-unit Frostbridge River hazard and gives selected verified dry-bank rocks restrained native R18 ground ferns. Both original river sides, crossings, walkable routes and all actor/source collisions remain authoritative. The native forest floor is composed first, shoreline feather second, actual paths and decks afterward. Tests `tests/greenwood_falls_shoreline_r40.test.js`, real browser screenshot `GREENWOOD_R40_FEATHERED_RIVERBANK`, details `docs/overworld/GREENWOOD_FALLS_SHORELINE_R40.md`. **Phase 9 active, Phase 10 locked, creator art acceptance 0%, physical iPhone testing outstanding.**

## Phase 9 R39 — original illustrated stone/forest floor and real riverbank gorge (2026-11-08)

Source-native low-relief geology is now authored **around the actual Falls overlook view** rather than scattering more trees. Eight asymmetric bedrock/fern masses from original R18 pixel illustrations connect the R38d rooted forest and authentic stair. The physically separate Frostbridge River channel receives additional source-backed dry-bank rock ledges. Both are world-anchored, native-material ground painters; **no fabricated impassable cliff, collision change, false road, save migration or new asset file**. Tests: `tests/greenwood_falls_geology_r39.test.js`; browser screenshots: `GREENWOOD_R39_BEDROCK_OVERLOOK`, `GREENWOOD_R39_SOURCE_RIVER_GORGE`; detailed notes: `docs/overworld/GREENWOOD_FALLS_GEOLOGY_R39.md`. **Phase 9 active, Phase 10 locked, visual signoff 0%, hardware iPhone validation outstanding.**

## Phase 9 R38 — foreground Greenwood Falls composition (Nov 8, 2026)
R38 closes R37's visible composition gap by proposing physically validated trees specifically in the overlook's actual screen-left and screen-right edges BEFORE distant grove candidates. Original R18 native fern beds join rooted forest floor and follow real stair-side ground from the source path, without new rocks, fake roads, collision changes or save changes. The project retains 48 nodes, 65 roads, 7 crossings, and the earlier approved character art. `tests/greenwood_falls_composition_r38.test.js`, `GREENWOOD_R38_COMPOSED_FALLS_FOREST` live capture and `docs/overworld/GREENWOOD_FALLS_COMPOSITION_R38.md` document validation. **Artist signoff 0%; Phase 9 active; Phase 10 locked; iPhone hardware check not yet complete.**

## Phase 9 R37 — Greenwood Falls rooted woodland composition (November 8, 2026)
R37 is an actual-game artwork and physical-source slice. Up to 14 individually collision-audited native oak/pine roots surround the genuine Falls overlook. Native R18 painted forest-floor moss and tree canopy are rendered from those same tree roots, preserving original player depth/occlusion, roads, stairs, water and save data. Files: `world_footprint.js`, `world_greenwood_art.js`, `world_illustration.js`; tests: `tests/greenwood_rooted_falls_r37.test.js`; live capture: `GREENWOOD_R37_ROOTED_FOREST_CLIFF`. Full details: `docs/overworld/GREENWOOD_ROOTED_FALLS_R37.md`.

**Phase 9 remains active; creator visual acceptance 0%; Phase 10 locked; physical iPhone testing outstanding.**

## Phase 9 R36b — actual-game correction to the Falls overlook's native stone shapes

The first real R36 screenshot proved the original fake gray cubes were removed, but the four enlarged native fern stamps created **unacceptable stretched horizontal stripes** above the player. R36b corrects the visual composition, not just the tests. The site uses two deliberately asymmetric, continuous low-profile scalloped moss-and-stone masses instead of four repeated horizontal fern bands. Each mass is hand-contoured with a softly lit upper cap and an eroded rock face, carries one **full-height original R18 painted native stone image**, and has only one small native fern accent at its physical ground foot. The central approach remains visually and physically clear, with no freestanding false rock-wall collider.

The two linked gameplay captures are `GREENWOOD_R36_PAINTED_FALLS_OVERLOOK` (source removal checkpoint) and `GREENWOOD_R36B_SCULPTED_OVERLOOK` (final visible composition). `tests/greenwood_lookout_shape_r36b.test.js` rejects horizontally stretched four-stripe scenery and requires real native stone/fern cutouts, unchanged 48 map nodes, original 65 roads/seven crossings, unchanged player saves and no older square lookout placeholders. The PWA source and cache receive a fresh R36b revision.

**Phase 9 stays active, creator artistic acceptance 0%, Phase 10 locked and physical iPhone playtesting outstanding.**
## Phase 9 R36 — replace the actual Falls overlook's five identical block placeholders

The **real R35d Chromium screenshot** exposed five uniformly spaced square grey pillars immediately above the Wanderer, despite the river itself now following true continuous physical geometry. Source inspection confirmed this was **duplicate placeholder artwork in two independent world renderers**: `world_illustration.marker` and `world_footprint.hubDraw`, both of which painted five fake, nonphysical cuboid columns at every lookout. These were *not* authored collisions. R36 removes both versions specifically for the existing Falls `lookout`, leaving other regions and their paths unchanged.

The replacement is a site-specific, asymmetric, low-profile landscape with four original R18 transparent painted stone and fern masses, hand-shaped moss contact shadows and a shallow open carved-lookout apron. The left and right compositions frame rather than obstruct the physical `falls_e → falls_overlook` staircase. All source anchors remain in the world blueprint; the painted native stone/moss has no new collider or false stair. `world_greenwood_art.paintFallsOverlook` handles artwork with a non-blocky gradient fallback, while `world_illustration.marker` uses it in the same real gameplay pass. `world_footprint.hubDraw` no longer draws five squares for lookouts.

The live-game browser capture `GREENWOOD_R36_PAINTED_FALLS_OVERLOOK` and regression `tests/greenwood_overlook_r36.test.js` confirm original-source artwork is drawn, the two old placeholder paths are gone, and all 48 nodes, 65 roads, seven crossings, quests, and the original save key remain intact. The installable GitHub Pages iPhone game stays on **v1.3.36 with a rotated R36 service-worker cache**, so Home Screen users load the actual new code.

**Art gate remains unapproved (0%). Phase 9 stays active and Phase 10 stays locked.** This is one substantive source-art recovery slice; Greenwood Falls still needs much richer forest and river compositions. Desktop browser captures are not physical iPhone testing.
## Phase 9 R35d — continuous real Frostridge/Frostbridge water boundary

Browser screenshots after R35c still showed blue rectangular staircase gaps in the Greenwood Falls river. This was not caused by decorative rock art: **the old terrain base sampled river-vs-land at the center of every 96-unit square**, creating a stepped shore while the true physical river is a continuous 180-unit-radius channel. R35d replaces those inaccurate Falls-only sampled-blue base squares with original climate-adjacent *dry soil*, then paints the river as one *world-source-clipped*, curved channel following the exact last Greenwood Falls reaches of the Frostbridge River blueprint. The bank is formed from the existing source centerline normals and natural rounded ends; the inside is filled with the existing seamless, native 256px river-water plate on its original world grid, preserving visual continuity across streamed chunks. This does NOT move a single physical water hazard, bridge, ford, shore collision, or walking coordinate.

The new R35d capture `GREENWOOD_R35D_CONTINUOUS_WATER` is from **the real playable game**, and `tests/greenwood_source_water_r35d.test.js` audits physical source geometry, unchanged routing, and the original saved game key. Greenwood proper, Hollowreach snow, quests, original hero sprites and 12-region travel are untouched; a new PWA cache revision delivers this within v1.3.36.

This is foundational terrain improvement, not proof that the original forest and snowy reference aesthetic is achieved. **Phase 9 active, visual acceptance 0%, Phase 10 locked; physical iPhone testing outstanding.**
## Phase 9 R35c — remove dark rectangular riverbank seams from the actual renderer

The R35b real playable screenshot still exposed straight-edged rectangular patches where a broad cliff-fill shader met the independently streamed terrain. This was visually unacceptable even with correct water collision. **The offending bank-face polygons have been fully retired.** R35c now uses only subtle, organically shaped world-space source-linked shelf contours (subtle longitudinal moss/stone strokes), smooth transparent radial stone contact shadows anchored to genuine dry banks, and the original painted R18 fern and rock sources. Unlike a flat filled face, these layers cannot imprint artificial square clip borders across the water. Visual geology respects the original hydrology and bridges; no invented 3D collider or traversal change is implied.

The previously corrected natural stair at Falls overlook and real physical boulders remain intact. Every change is integrated into the real iPhone-ready canvas game, with browser screenshot `GREENWOOD_R35C_NATIVE_SOURCE_SHORE` and `tests/greenwood_source_blend_r35c.test.js`; the iPhone service-worker cache has a new R35c key, retaining the v1.3.36 client build. **Phase 9 active, creator visual acceptance 0%, Phase 10 locked.** A successful browser screenshot alone cannot sign off the larger aesthetic or physical-device performance.
## Phase 9 R35b — correcting the over-dark gorge and rail-like Falls ascent

The **actual R35 game screenshots**, not a mockup, caught two visually unacceptable results: an unnaturally wide, dark geometrical riverbank, and the existing Falls ascent looking like a line of repeated bright railway ties. R35b is an explicit artistic correction, not a new decorative embellishment. The riverbank's source-linked upper face now meanders more naturally in world coordinates and uses substantially lighter, feathered stone/vegetation transparency; the existing water hazard and bridges stay exactly intact. The low stone strata remain distinct but don't form an opaque charcoal corridor. Collidable real boulders at Greenwood Falls gain original R18 native fern feet to anchor them visually in forest soil rather than looking like detached gray boxes.

The sole authorized **Falls east bank ↔ Falls overlook stair route** now receives a dedicated, subtler mossy-stone material with widely spaced, staggered irregular flagstones inside the existing physical stair corridor, instead of the generic 45-unit high-contrast rail-like bars. All other 64 roads retain their current route rendering. These changes are built into the **actual playable scene**, and comparison captures are `GREENWOOD_R35B_SOFT_SCULPTED_SHORE` and `GREENWOOD_R35B_MOSS_STONE_OVERLOOK`, in addition to the unchanged R35 perspectives.

New cache revision R35b serves the updated source painters to the existing **v1.3.36 iPhone Home Screen app**. No adjustments to physical routes, crossings, terrain collision, save keys, quests or the original hero art. **Phase 9 remains active; visual approval remains 0%; Phase 10 locked.** Approval is based on actual gameplay, not the existence of a passing render test.
## Phase 9 R35 — three-plane Greenwood Falls escarpment, source-linked geometry (v1.3.36)

This is the first of the larger composition-development slices following the creator's request for a realistic art convergence estimate. Actual R34c gameplay was cleaner but still had flat, straight shoreline bands, a single scattered gray rock and insufficient environmental depth. Instead of repeating ground details, **R35 replaces the prior ruler-straight bank lines** with an interconnected, curved, low-relief escarpment along the physically authored Frostbridge River, using only verified dry bank anchors from `sourceFallsBanks()` on the lower Greenwood Falls reaches. Adjacent dry anchors form continuous world-space runs, segmented at real bridges, roads and discontinuities. These runs produce three transparent illustrated planes: water-facing dark stone, warm mid-face rock stratum, and feathered upper moss cap. Smooth quadratic boundaries, shaded faces, fractures, and finely worn foam create perceived terrain depth. Original R18 transparent rock and substantial fern masses sit on safe dry source banks, not invented cliffs or blocked passage.

**Safety and fidelity:** Scene artwork is rendered below source routes and real crossings, never changes water or road collision, and preserves the existing 48 nodes, 65 roads, seven crossings, accepted character/Hollowreach art, quests, and original local save key. Continuous source paths do not restart at chunk edges, and far-off banks are culled. The real-browser capture suite now checks both **`GREENWOOD_R35_SCULPTED_RIVERBANK`** and the actual playable **`GREENWOOD_R35_FALLS_OVERLOOK`** view, rather than presenting a concept mockup. `tests/greenwood_escarpment_r35.test.js` audits physical sources, grouped bank curvature, native artwork, and unchanged world/save metadata. iPhone PWA cache rotates to v1.3.36.

**Not signed off:** This is a major landscape composition iteration, *not* an assertion the whole biome or art has reached the original reference. Phase 9 remains active; artistic acceptance is still 0%, Phase 10 locked, and physical iPhone testing remains outstanding.
## Phase 9 R34c — finish removing square-textured land at Greenwood Falls

The real playable R34b screenshot confirmed the river currents had become coherent but **the adjacent land was still full of ugly, repeated square flecks**. Its climate-driven `thaw` and `wetland` materials, along with source rock/soil/road classes, were bypassing the new 256px native plate. This is fixed at the actual `terrain_art.stamp()` source: the *Falls-only* path now paints **all nine relevant material classes** as low-noise, seamless native ground plates, sharing stable world-grid coordinates at every streamed chunk seam. The 2013-looking 32px tile glyphs cannot reappear simply because the climate changed wetness or elevation.

Existing Greenwood proper keeps its original source palette choices; distant winter biomes are untouched. The physical Frostbridge River, seven crossings, 65 authored roads, 48 map nodes, native painted canopies, all quest and save data remain intact. The browser capture `GREENWOOD_R34C_ALL_NATIVE_SURFACES` shows the **real walking game**, not concept art. This is still not a finished waterfall landscape or creator-approved aesthetic.

**Phase 9 active, visual acceptance 0%, Phase 10 locked, physical iPhone testing outstanding.**
## Phase 9 R34b — seamless native Greenwood Falls water and forest-floor recovery

The first actual R34 gameplay screenshot revealed an **unacceptable patchwork of repeating bright square water/ground motifs**, even though the real riverbank stones were correctly source-linked. R34b replaces those legacy materials throughout the original *Greenwood Falls biome* with the continuous, native R25 forest-plate technology. Its smooth 256×256 periodized blue-green river surface has natural directional currents, not blocky glyphs, while moss, soil and woodland grass use the same macro-scale native forest-floor palette. All components sample a stable global world grid, removing tile and streaming-seam repetition.

The redundant water-square edge strokes and tiny faux grass rectangles are disabled **only** for Greenwood Falls, leaving winter and other biomes untouched. The original R18 painted oak/pine sprites and root-linked understory now extend across the Falls, with the correct live 2.5D front/back tree sorting inherited from R33b. R34 authentic mossy bank ledges and original crossings continue painting over their correct water hazard/land boundary. No fake river, new ford, missing collision, changes to 48 waypoints/65 roads/seven crossings, or save migration were introduced.

The updated real-browser game screenshot is `GREENWOOD_R34B_SEAMLESS_FALLS`. It is not concept art. **Phase 9 remains active, visual approval 0%, Phase 10 locked, physical iPhone testing outstanding.**
## Phase 9 R34 — Greenwood Falls grounded, continuous mossy riverbanks (v1.3.35)

The original forest reference includes high-quality river-and-bridge geology. Rather than filling the clearing with more random tiny speckles, R34 expands the **actual playable world** to Greenwood Falls. The game now locates the lower reaches of the *existing Frostbridge River centerline*, samples its authoritative non-crossing water hazard, and traces **connected, low-relief banks** onto genuinely dry shoreline. Soft shaded moss, natural rock-edge treatment, understated foam and the existing independent R18 painted rock asset form a continuous water-to-land transition. Every visual source is grounded in the *original river boundary*, not a fake shortcut, free-floating billboard cliff, invented waterfall crossing or new collision wall. Source bridge/ford decks still paint afterward, so natural bankwork cannot hide or replace them.

`world_greenwood_art.js` implements `fallsBankSources()` and `paintFallsRiverBanks()`, integrated into the same world-space chunk renderer under existing physical crossings and tree-depth layers. Its deterministic shoreline samples are cached, culled per chunk, and filtered against actual roads, water, physical scenery and land polygons. A dedicated real-game screenshot `GREENWOOD_R34_FALLS_RIVERBANK` and regression `tests/greenwood_falls_r34.test.js` check water-to-bank sourcing, native R18 rock sampling, original 65 roads/seven crossings, all 48 waypoints and the unchanged save key. The iPhone Home Screen cache is rotated and files versioned to v1.3.35.

**Phase 9 remains active. Visual acceptance is 0%; Phase 10 remains locked.** This is a single authentic riverbank/landscape slice, *not* artist approval or completed world art. Desktop Chromium capture cannot substitute for a physical iPhone playtest.
## Phase 9 R33b — true live foreground/background woodland, replacing treetop overlap

The first actual R33 screenshot showed an unacceptable result: the Wanderer visually appeared *on top of* an opaque tree canopy despite being on valid ground. A translucent leaf overlay alone cannot fix a tree baked into the opaque background. R33b corrects the root cause. **The exact original collidable oak and pine trees are omitted from Greenwood's static terrain chunks and drawn as native live sprites sorted by their real physical Y footpoints relative to the actor.** Trees behind the player remain fully illustrated; those in front are drawn above the Wanderer and softly fade to 24% only where their real upper crown intersects the character, revealing actual walkable ground and keeping the player readable. Existing R18 oak/pine source paintings, R31c side eaves and R32 upper-canopy artwork remain in the same real forest painter. No tree is a billboard; no new source roots or invisible obstacles are invented.

The live renderer caches nearby physical tree queries, only paints visible forest sprites, uses the same global world position as source collision, retains all original routes and cottages, and does not change any saves. Browser capture `GREENWOOD_R33B_LIVE_DEPTH` tests an actual walkable position beneath an old-growth source oak. This repair also eliminates duplicate fake oval shading that appeared when trees and characters intersected. **Phase 9 active, aesthetic acceptance 0%, Phase 10 locked.** Check actual screenshots against the original forest reference before creator reinspects, and do not confuse a successful technical test with artistic acceptance. Physical iPhone testing outstanding.

## Phase 9 R33 — real tree-canopy actor depth (v1.3.34)

The actual R32 phone-proportioned Chromium capture confirmed the woodland upper frame was improving, but its tree crowns remained flattened into background chunks while the Wanderer was always rendered above them. **R33 fixes the 2.5D physical layering**, not by creating new fake background art: the original independent 128-pixel AVIF oak/pine paintings are redrawn in the foreground *only where the Wanderer's head and torso actually intersect the visible upper crown of an existing, solid, Greenwood tree whose physical footpoint is in front of the actor*. The source width/height, flipping and native cutout are matched to the same sprite already painted in the world chunk. The obsolete green/turquoise oval overlay in Greenwood is removed.

The real-time painter `paintForegroundCanopy` caches nearby physical root lookups over multiple animation frames, culls offscreen/unrelated trees, skips non-solid flowers/procedural fallback mismatches, and never changes movement/collision. A genuine browser gameplay capture `GREENWOOD_R33_REAL_CANOPY_DEPTH` repositions the *actual Wanderer* on proven walkable ground under a real tree and verifies the source-only overlay. The dedicated `tests/greenwood_depth_r33.test.js` locks positive and negative occlusion cases, cache efficiency, source crop, and intact saves. iPhone PWA version and cache advance to v1.3.34.

**The forest composition and the snowy world still require major original-art work.** Creator acceptance stays at **0%**. Phase 9 is active; Phase 10 is locked until explicit actual-device approval. Browser simulation is not physical iPhone verification.

## Phase 9 R32 — source-rooted Greenwood upper woodland (v1.3.33)

Real R31c landscape gameplay still showed a mostly exposed, empty northern crossroads, even with excellent original illustrated cottages and a few narrow canopy slivers. R32 therefore introduces a **three-quarter-view upper woodland gallery**, cropped from the original transparent R18 oak/pine paintings. It grows only from **six existing physically collidable Hearth oak/pine roots**: four north-facing mature trees and two side oaks. Each rooted tree supplies proportionate upper boughs that extend toward the walkable camera rather than unrelated fern confetti or detached wallpaper. These are drawn behind complete tree sprites and the real house scenery. The actor's central clearway and all original roads, crossings and land geometry remain physically unchanged. No invented trunk, collider, entrance or changed save key.

The updated actual-world browser capture is `GREENWOOD_R32_UPPER_FOREST` and `tests/greenwood_upper_forest_r32.test.js` protects original R18 image crops, fixed physical sources, viewport culling and the historical `veilward-hollowreach-v01` save identifier. The iPhone PWA cache and live build are updated to **v1.3.33**. **This is a substantial forest-composition iteration, NOT creator art approval:** compare the actual mobile-scale screenshot to the reference and keep Phase 9 active, aesthetic acceptance 0%, Phase 10 locked. A desktop Chromium screenshot is not physical iPhone QA.

## Phase 9 R31c — physically rooted illustrated canopy eaves

R31b added three genuine physical forest edge trees, but the real phone screenshot showed only narrow crown slivers. R31c extends **original R18 transparent oak canopy artwork** as two proportionate interlocking upper boughs growing from each of the two specific, collision-backed side oaks. No fake trunks, static forest background, detached sprite billboard, hero overlap, new roads, or changed saves. The center of the real Hearth crossroads remains readable; rooted trees and original cottage are preserved. Final Chromium capture: GREENWOOD_R31C_ILLUSTRATED_CANOPY. Creator aesthetic acceptance still 0%, Phase 10 locked.

## Phase 9 R31b — physically rooted illustrated woodland edges

R31 showed additional original forest but left the crossroads largely empty. R31b adds a small number of full R18 painted oak/pine trees along actual physical forest margins beside the Hearth, selected under every existing road, water, house, root and player-clearance rule. Trees use the same original footprint for art and collision: no pasted wallpaper or fake trunks. Real-browser scene GREENWOOD_R31B_PAINTED_FOREST_EDGE; visual acceptance remains 0%, Phase 10 locked.

## Phase 9 R31 — original rooted woodland in Greenwood landscape framing

The R30 actual gameplay image showed an empty crossroad because the compact landscape camera cropped the existing physical oak and pine forest just south of Hearth. R31 composes the camera to reveal those original illustrated, collidable roots by easing the small landscape zoom to 0.70 and positioning the Wanderer 42% from the top. No fake tree art, roads, hitboxes or saved positions are created. The Hermit, close-cottage, portrait and desktop camera rules are unchanged. Actual browser screenshot: GREENWOOD_R31_REAL_FOREST_FRAME. Phase 9 active, user visual acceptance 0%, Phase 10 locked.

## Phase 9 R30 — grounded overstory light and shadow, not more fern confetti

The R29 live-browser review confirmed the paths improved but Greenwood Hearth remained visually flat and open. A physical-root audit found that the four Hearth roads, buildings, and source forest trunk spacing leave almost no safe on-camera location for additional large mature trees. Rather than invent non-collidable canopy wallpaper, R30 adds a **broad woodland overstory floor projection** anchored only to original physical mature oak/pine roots near the Hearth. The paint blends elliptical, asymmetrically positioned crown shadows, two broken leaf-filtered sun pools per tree, and only source-safe root-to-root shade bridges. There are no new visible trunks, blank repeated texture squares, impassable props, paths, or hitboxes. Original 65 road segments, seven crossings, cottages, save identifier and sprite-sheet gameplay remain unchanged. Source roads are still painted above the shade, preserving readability. Real-browser capture: \`GREENWOOD_R30_OVERSTORY_LIGHT\`.

This is a Phase 9 **art-in-progress** recovery, not creator approval. Phase 10 remains locked; iPhone hardware QA outstanding.


## Phase 9 R29 — worn woodland trails, not pale ruler-straight highways

Actual R28d gameplay captures revealed the Hearth remained visually empty in spite of physically valid old-growth trees; a source audit found almost no safe locations for more collision-backed trunks in the small camera frame. Rather than fabricate impassable forest wallpaper, R29 paints **only the original Greenwood road network** as narrower, subtly winding, native-earth/lichen tracks. Each 65-road geometry centerline remains authoritative, endpoints remain exact, all seven bridges/fords/causeways retain their individual art, and woodland winding is limited to a handful of world units inside the existing physically walkable corridor. The painter draws soft forest edges, subdued dirt and sparse organic worn glazes **without** repeated bright pebbles or rectangular chips. This changes visuals, not route topology, collision, skills, equipment, saves or other biome styling. Real Chromium review capture: \`GREENWOOD_R29_WOODLAND_PATHS\`; Phase 9 active, Phase 10 locked, artistic acceptance 0%.


## Phase 9 R28d — correct oak crown depth at the Hearth

The real R28c gameplay screenshot found a genuine **art regression**: a beautiful broad source-painted oak was placed so close to the camera center that the Wanderer appeared to stand on its foliage. R28d preserves the original artwork and physical collision-backed trees, but prioritizes roots at the actual forest *edges*, with a new source-space projected-crown exclusion around the hero. This keeps the Hearth roads legible and still allows painted old-growth to frame the scene. A dedicated regression plus Chromium `GREENWOOD_R28D_CLEAR_FOREST_BORDER` assert the original spawn is unblocked and no near-camera rooted canopy occupies the hero's silhouette. Full roadmap and saves unchanged; Phase 9 active, Phase 10 locked, aesthetic approval still 0%.

## Phase 9 R28c — painterly oak-canopy depth at the Hearth

Browser R28b proved real tree crowns now intersect the phone camera view, but a narrow pine still dominated the scene. R28c uses the existing independently illustrated oak at the now-verified Hearth roadside physical root, preserves the original asset proportions while modestly scaling curated old-growth (not generic trees), and broadens safe physical-root canopy links in forest areas without touching roads. Full-window painting still uses real collision-backed roots. Chromium captures `GREENWOOD_R28C_LAYERED_OAK`; technical tests verify the source oak, all original route segments, historic saves and physical cottage approach. The developer-diagnostic duplicate variable was also fixed so it cannot mask regression results. Phase 9 remains unapproved, Phase 10 locked.

## Phase 9 R28b — paint physically rooted old growth that is actually visible

The first R28 real-browser gameplay screenshot was **unchanged** from R27 despite four valid trees. An audit showed all four physical roots fell outside the useful phone landscape frame. R28b prioritizes safe south-side forest-edge positions confirmed by the world-space audit, relaxes unnecessary clear trunk spacing while retaining all road/water/house/anchor safety checks, and renders these featured trees only with the original R18 painted oak/pine artwork. All trees remain grounded in the real collision world. Actual browser verification now requires at least two on-camera rooted crowns and captures `GREENWOOD_R28B_VISIBLE_CROWNS`. No art approval or physical iPhone certification is implied; Phase 9 remains active and Phase 10 locked.

## Phase 9 R28 — Rooted old-growth framing at Greenwood Hearth

The previous real-browser R27 screenshot remained open because most new scenery roots sat beyond the phone landscape viewport. R28 adds a **small curated selection of original oak/pine roots** around the Hearth margins, admitting candidates only when confirmed safe from all physical road segments, water, obstacles, existing trees, the cottage and entrances. These roots appear in the same `footprint.groves()` source consumed by the art painter and `footprint.blocked()` collision—not a fake background layer. The new browser capture is `GREENWOOD_R28_LIVING_CROSSROADS`, with `GREENWOOD_R28_HERMIT_PRESERVED` as a no-regression scene. The 12-region road network, quests and save identifier remain unchanged. Creator visual acceptance remains 0% and Phase 10 locked.

## Phase 9 R27 — Greenwood physical forest at real road edges

Greenwood's excessive *extra* road and hub-clearance buffers are reduced only for this biome, admitting more collision-backed oak/pine roots alongside existing roads. Explicit protected zones preserve the original Hearth cottage and four setpieces plus the Hermit entrance. Roads, water, source sprite art, scenes, quests and saved character state are unchanged. Actual browser screenshot keys: `GREENWOOD_R27_WOODED_CROSSROADS` and `GREENWOOD_R27_HERMIT_EDGE`; dedicated test checks source footpoints and routes. The appearance remains **not approved**; Phase 9 active, Phase 10 locked.

## Phase 9 R26 — continuous Greenwood undergrowth and rooted forest light

R26 joins *existing* source-landmark fern mats into continuous safe forest-floor beds only when all interior samples lie off the physical roads, water and buildings. Wider, subdued canopy-filtered shadow and sun patches remain attached to original collision-backed oak/pine roots. There are **no new tree trunks, obstacles, paths, waypoints or gameplay changes**, and the existing save key is untouched. Final real-Chromium images: \`GREENWOOD_R26_CONNECTED_GLADE\` and \`GREENWOOD_R26_HERMIT_CANOPY\`. This is an improvement-in-progress, not art approval. Phase 9 remains ACTIVE; Phase 10 locked.


## Phase 9 R25b — remove synthetic clearing chip ring and bright road dashes (visual QA pending)

Actual browser A/B captures isolated two independent sources of distracting pale rectangles: `world_illustration.marker(kind="clearing")` stamped 32 pastel rectangles around the original landmark, and `world_routes.ribbon` stamped small high-contrast gravel dashes along woodland roads. R25b deletes the false circular waypoint markers and skips woodland-only synthetic path flecks; the original route corridors, source roads, canopy, illustrated cottages and all physics/saves are preserved. The R25 base plates remain unchanged. Actual Chromium `GREENWOOD_R25B_CLEAN_CLEARING` screenshot and regression must be checked; this is *not* creator signoff. Phase 9 remains ACTIVE and Phase 10 locked.

## Phase 9 R25 — Greenwood seamless ground and source-root canopy (visual approval pending)

Removed Greenwood's small repeating pale leaf/flower motif from its base material and replaced it with three cached, low-chroma, world-aligned ground material plates; connected existing painted oak/pine upper crowns only when original physical roots, road margins and river boundaries allow. No new obstacles, roads, trees, quests, sprite swaps or save migration. R25 actual-play screenshots: `GREENWOOD_R25_GROUND` and `GREENWOOD_R25_CANOPY`. Technical tests are not creator approval; visual acceptance remains 0%, Phase 9 ACTIVE, Phase 10 LOCKED. See `docs/overworld/GREENWOOD_GROUND_CANOPY_R25.md`.

## Phase 9 R24 — Greenwood landmark forest-floor habitat, v1.3.32

R23's real screenshots show sophisticated source-painted houses sitting against largely empty, uncomposed green ground. R24 adds walkable, independent R18 painted fern material around **the two original waypoints** `greenwood_hearth` and `hermit` in the actual streamed Greenwood painter. Non-grid golden-angle clusters vary scale, spacing and rotation, with low-opacity forest canopy light/contact shadow, and check the authoritative original physical water, road corridor, obstacle and tree-trunk occupancy before drawing. This is ground-only artwork beneath the real road and building passes; it creates **no roads, obstacles, building duplicates, or new tree colliders**.

The new `tests/greenwood_habitat_r24.test.js` locks the unchanged world nodes, one-authored-fern-source painting, exclusion near roads, and user save-key stability; `GREENWOOD_R24_HABITAT` captures the **actual playable Hearth scene**, not the concept art. **These tests do not establish beauty or approval.** The original R18 oak/pine/fern/rock paintings, R21 moss-roof hermit, R23 blue-roof Hearth, character sprites, all region geometry, quest flow and `veilward-hollowreach-v01` save key remain unchanged. Greenwood still needs cohesive large-scale canopy, unique landscape layers, scene-level atmosphere, and more original art. **Visual acceptance 0%; Phase 9 ACTIVE; Phase 10 LOCKED until your actual playable-world inspection and approval.** iPhone hardware verification remains outstanding.

## Phase 9 R23 — v1.3.31: distinct illustrated Greenwood hearth cottage

The existing **single, collision-backed** `greenwood_hearth-forest_cottage-91` receives an original, separate, transparent **256 × 256 WebP** building sprite: blue slate roof, warm windows, timber porch, bell cupola, flower boxes and wood store, independent from the hermit's moss-roof refuge. The native binary `assets/greenwood_hearth_cottage_r23.webp` was transferred and validated byte-for-byte via Git object SHA, and the renderer `world_greenwood_hearth.js` loads it BEFORE original world chunk cache construction. `world_setpieces.draw` stamps it only at the existing Greenwood hearth setpiece, with the earlier real cottage art available as a decode-failure fallback. No placement, original collider radius, physical routes, quests or save key changed. R23b also smoothly frames the entire original 350-unit cottage and Wanderer only when they approach that building in phone landscape, retaining ordinary Greenwood crossroads/other-region camera behavior.

The regression test `tests/greenwood_hearth_cottage_r23.test.js` checks the genuine RIFF/WebP source, loaded dimensions, rendering position, source-only stamp predicate, legacy fallback, and original saving/world structure. Real Chromium `GREENWOOD_R23_HEARTH_COTTAGE` gameplay screenshot asserts both new painting and genuine physical screen-space roof/actor bounds. This is a SOURCE production art milestone, **not creator signoff**. Phase 9 stays ACTIVE, creator visual acceptance **0%**, Phase 10 LOCKED. Real iPhone hardware testing remains unverified. The broader Greenwood forest remains notably sparse versus premium references and Hollowreach/other regions still need substantial illustration work.

## Phase 9 R22 — v1.3.30: non-cropping Greenwood hermit framing

Real-browser R21 gameplay showed the original 512px painted hermit's refuge roof was partly clipped by the small landscape viewport. R22 changes ONLY the optional streaming-world preview camera. When a player approaches the **existing hermit node**, a smooth distance-derived, landscape-only camera composition looks ahead vertically and adjusts zoom to keep both the roof and Wanderer's feet visible; elsewhere, and on portrait screens, the original camera remains unchanged. It reuses the exact physical hub, 12 world regions, 39 existing solids, 48 waypoints, 65 roads, seven crossings, approved player sprites, quests, and `veilward-hollowreach-v01` save key.

The new real browser `GREENWOOD_R22_FULL_ROOF` capture tests actual pixel-space framing *after* changing to 720×405 and allowing the camera to settle. `tests/greenwood_hermit_framing_r22.test.js` verifies small-screen composition, desktop landscape behavior, portrait fallback, route position, and original saves. No invisible new obstacles or unrelated illustrated decorations are created.

**Not an aesthetic sign-off:** the second Greenwood cottage is still an older placeholder, and forest canopy/environment layers remain incomplete. Creator visual acceptance remains **0%**; Phase 9 ACTIVE; Phase 10 LOCKED pending explicit creator inspection and approval. Browser QA is not physical iPhone testing.

## Phase 9 R20 — v1.3.28: rooted Greenwood forest-floor tapestry

Real Chromium screenshots of R19 showed the individual R18 painted trees improved, but tiny forest specks and shallow green backgrounds still made Greenwood visibly artificial. R20 retires Greenwood's three competing micro-decoration layers (96-unit climate speckles, 112-unit isolated grass/flowers, and the 460-unit zone's detached rectangular leaf flecks), replacing them with larger existing original R18 illustrated fern-and-moss artwork planted exclusively around the **same actual original Greenwood oak/pine/flowerbed root objects**. The native world still generates the art, road verges remain physically bound to the 65 source routes, water is avoided, and no new fake collider/road/house is authored. The painter draws these soft low ground layers before the real roads and trees; other biomes retain their previous treatment. An extra true-game `GREENWOOD_R20_HERMIT_FLOOR` capture audits the walkable hermit's clearing.

R20 improves a source-grounded illustration system rather than declaring the visual target achieved. **Visual acceptance remains 0%, Phase 9 ACTIVE, Phase 10 LOCKED until the creator approves actual game screenshots/playable world.** Original Hollowreach painterly buildings, original R18 Greenwood oak/pine/fern/rock AVIFs, Wanderer/Warden art, 12 regions, 39 solid geometries, 48 anchors, 65 roads, seven crossings, quests and `veilward-hollowreach-v01` save remain protected. Browser gameplay tests are not physical iPhone tests. More work is required on truly dense 2.5D canopy architecture, hermit sanctuary illustration and layered forest environment.

## Phase 9 R19b — v1.3.27: visual QA rejected geometric verges, replaced with graded forest soil

The first R19 real-browser screenshot confirmed the mature Greenwood tree art improved proportions, but its dark, nearly flat quadrilateral road shoulders did NOT meet the creator's painterly visual standard. R19b removes the harsh block-band appearance by using distance-to-trail **feathered Canvas gradients** that fade at both inner and outer edges of each source-road verge, retaining irregular natural ground outlines and native fern illustration. All existing source geometry, physical travel/collision, PWA saves, original painted sprites and route order are unchanged. Real in-game visual capture `GREENWOOD_R19_ROAD_CORRIDOR` is retained, and `tests/greenwood_verges_r19.test.js` now checks the feathered gradient rendering path.

This is further Phase 9 art recovery, **not visual acceptance**. True large-scale woodland architecture and more sophisticated forest-floor sprite coverage remain unfinished. Visual acceptance 0%, Phase 9 ACTIVE, Phase 10 LOCKED.

## Phase 9 R19 — v1.3.26: mature Greenwood forest and road corridor integration

Actual gameplay reviews of R18 revealed under-scaled trees (roughly Wanderer-sized) and flat, sharply separated tan roads. R19 raises the **illustrated oak and pine crowns to mature tree proportions** while keeping their exact pre-existing physical root coordinates and collider sizes. The new `paintRoadVerges` stage builds two subdued, irregular moss-and-forest-duff layers along **the real Greenwood route geometry**, with small, low-opacity reuse of the R18 original painted fern texture inside those verges. It runs in `paintForestFloor` before the authoritative roads are rendered, does not create a route or solid, and is skipped in other biomes / water / distant chunks. R19 visual QA includes a new actual playable `GREENWOOD_R19_ROAD_CORRIDOR` screenshot and a deterministic source regression.

The original R18 oak, pine, fern and rock AVIFs are unchanged. All 12 regions, 39 source physical solids, 48 nodes, 65 road links, seven crossings, quests and the `veilward-hollowreach-v01` save are protected. **This is not a final art acceptance claim:** Greenwood needs substantially more large-scale cohesive original forest-floor textures and architecture, Hollowreach and other regions remain unfinished; user visual acceptance 0%, Phase 9 ACTIVE, Phase 10 LOCKED. Physical iPhone testing is not implied.

## Phase 9 R18 — v1.3.25: independent high-detail Greenwood paintings (still unapproved)

Replaced the purely procedural look of many Greenwood canopy roots with four **real transparent illustrated asset files**: oak, pine, fern bed, and moss-covered rock, each an original 128×128 AVIF with verified Git blob hash and SHA-256. These are composited once into a cached 512×128 atlas and drawn only at Greenwood's original physical scenery positions; the other five-per-kind R17 source variations are retained for variety and as an offline/old-browser fallback. The hermit clearing, original path edges, all region boundaries and all player-interaction/collision geometry stay intact. The new loader deliberately refuses empty/transparent decoded sprites (the first combined transfer was detected and rejected) and will instead keep the previously working pixel canopy. Actual browser QA captured `GREENWOOD_R18_PAINTED_TREE` from a walkable, real rooted-tree location; a separate SHA-256 and geometry regression documents the same assets.

The player HUD/character remains clearer than the world art; the **original reference quality is NOT reached**. Greenwood crossroads and forest architecture still need richer continuous illustrated composition, and Hollowreach remains incomplete. **Visual acceptance 0%; Phase 9 remains ACTIVE; Phase 10 LOCKED pending creator review.** No new obstructing geometry, path edits, save migration, quests, or actor sprite changes. See `docs/overworld/GREENWOOD_PAINTED_R18.md`.

## Phase 9 R17 — v1.3.24: grounded Greenwood foliage atlas

Greenwood now has 15 original cached native-pixel foliage variants (five broadleaf oaks, five pines, five fern/flower clusters), implemented as a 192×240 source pixel atlas rendered once per browser session by `world_greenwood_art.js`. Each sprite reuses the **existing real Greenwood footprint root** and draws in the same world painter order as other physical vegetation; no new blocked cell, object collider, destination, path, or disguised overlay is created. Forest-floor canopy shadows and leaf-litter motifs likewise derive from original trees, paint beneath the actual roads and exclude water and road crossings. Hollowreach's painterly cottages and existing winter cliffs are unchanged. A special live-game `GREENWOOD_R17_FOLIAGE` screenshot and `tests/greenwood_foliage_r17.test.js` audit actual registration, rooted placement, topology and save protection.

**Important:** The alternative photoreal/detailed experimental sprite sheet generated during planning was NOT successfully uploaded to the repository, so do not represent it as live art. The deployed asset is the original source-rendered foliage atlas described above. This remains a step toward, not a guarantee of, the gold reference standard; art approval is **0%**, Phase 9 remains **ACTIVE**, and Phase 10 remains **LOCKED**. The 12 regions, 39 authored solids, 48 node anchors, 65 roads, seven water crossings, protected actor sprites and original save key are unchanged.

## Phase 9 R16 — v1.3.23: physically rooted snow-field deposition

The playable Hollowreach terrain now draws connected painted ground-relief fans from the **same three collision-backed rock escarpments** already in the 12-region map. Each fan uses the original seamless snow material atlas, soft depth shading, an irregular continuous cliff-to-ground edge and a strict physical source reference. The four existing village roads are drawn **above** these underpaintings. There are no new arbitrary decorations, walls, invisible obstacles or invented walkable corridors. Distant terrain chunks near these cliffs now receive the scenery even outside the former 1,280-world-unit village-square paint cutoff; plaza-only detail is still skipped there to limit iPhone draw work. The new `HOLLOWREACH_R16_SNOW_FANS` browser capture and `tests/hollowreach_snow_fans_r16.test.js` check the actual source bound to gameplay.

**This is a source/landscape continuity pass, NOT art approval**. Greenwood still has insufficient illustration detail, and much of Hollowreach remains sparse. Original painterly cottages, accepted hero/Warden sprite sheets, all 39 solids, 48 anchors, 65 roads, seven crossings, quests, and original `veilward-hollowreach-v01` save key are unchanged. Creator visual acceptance remains **0%, Phase 9 ACTIVE, Phase 10 LOCKED**.

## Phase 9 R15 — v1.3.22: independent source winter escarpment sprites (November 7, 2026)

Actual playable Hollowreach now draws new original four-cell 144px transparent RGBA winter environment artwork from `assets/hollowreach_environment_r15.webp` (576×144, 27,178 bytes). Its two cliff illustrations are attached ONLY to the three existing source collision-backed snowy cliff polygons; its low snow-drift and brush artwork appears at those same cliff fronts and along the four physically placed spruce roots. Painterly original cottages are PROTECTED; the rejected R13 geometric cottage experiments remain disabled in normal gameplay. R14 connected snow/road contours remain underneath and the same authoritative roads paint over them.

No screenshot backdrop is used. The independent sprite art was generated for this game, transparency-cleaned, compacted, and verified as a real GitHub binary. Real Chromium screenshots and automated tests cover the source artwork in the actual build; **that is not user visual approval**. The R15 screenshots still reveal too much empty snow and incomplete integration, and Greenwood is still under-detailed. **Creator visual acceptance remains 0%; Phase 9 ACTIVE and Phase 10 LOCKED.** No changes to 12 regions, 48 nodes, 65 roads, seven crossings, 39 geometry solids, protected hero/guard sprites, quests, or the `veilward-hollowreach-v01` save key.

Details: `docs/overworld/HOLLOWREACH_ENVIRONMENT_R15.md`. Actual browser artwork check: `HOLLOWREACH_R15_ESCARPMENT` in `scripts/visual_capture.mjs` and source regression `tests/hollowreach_environment_r15.test.js`. The original reference images `village_v06_clear.jpg` and `wilds_clean.jpg` remain untouched.

## Phase 9 R13 art-acceptance correction — v1.3.20 (November 7, 2026)

Actual Chromium game screenshots exposed poor original-style fidelity in the R13 experimental house sprites: oversized flat roof triangles and boxy outlines. They are **rejected** as production art despite all functional tests passing. v1.3.20 restores the better original painterly 96px cottage art to the normal playable Hollowreach overworld. The four 256px trial sprite designs survive only behind `experimentalArchitecture:true` in an isolated developer preview; the normal game never renders them. The trial is evidence of a technical raster-art pipeline, **not an acceptable visual upgrade**. Screenshot QA and a new default-versus-experimental regression now lock the production art gate.

No world coordinates, 39 physical obstacles, 48 travel anchors, 65 roads, 7 crossings, existing quest/save storage, or protected hero/Warden art changed. Phase 9 is **ACTIVE**, visual acceptance remains **0%**, and Phase 10 stays **LOCKED** until explicit creator inspection and approval of genuine in-game reference-quality illustrated environments. This correction supersedes earlier R13 text that implies the trial houses were promoted.

## Phase 9 R13 — v1.3.19 original 256px architecture pilot (NOT APPROVED)

Four unique full-source-resolution pixel-art winter cottage variants are drawn once into a 1024x256 in-memory raster atlas (`world_architecture_atlas.js`) and stamped onto the SAME source-backed Hollowreach cottage positions. The original 96px pilot image remains as a transparent fallback. Each design has coherent 3/4 roof planes, directionally placed shingles and snowy eaves, timber and stone foundation texture, individually framed warm windows and porch details. A real-browser capture `HOLLOWREACH_R13_COTTAGES` inspects these buildings in actual gameplay. The four originals are source-pixel illustrations implemented as deterministic canvas art, **not** painted pre-production concept frames or a replacement for real modular assets.

No changes were made to 12 macro-regions, 48 travel nodes, 65 roads, seven crossings, 39 physical obstacles, original quest/save keys or protected Wanderer/Warden art. This is one meaningful architectural art step within the existing Phase 9 visual recovery. **Creator visual acceptance stays 0%; Phase 9 remains ACTIVE; Phase 10 LOCKED.** Original painting-quality cliffs, trees, roads, riverbanks and Greenwood are still unfinished. Details: `docs/overworld/HOLLOWREACH_ARCHITECTURE_R13.md`.

## Phase 9 R12 — v1.3.18: source-rooted winter terrain and crisp raster details

The actual playable Hollowreach preview now paints a linked snow-covered west slope using the physical upper/lower cliff polygons and all four authentic collision-backed spruce roots. Village flagstones use clipped imagery from the independent, authored winter stone atlas rather than flat polygon fills; existing winter building/terrain sprites are enlarged with pixel-sharp nearest-neighbor rendering. The R12 source regression and real-browser terrain viewpoint are part of QA. **This is only a structural environmental integration pass.** It does not produce original-reference-level illustrated architecture; Greenwood and much of the overworld remain underdetailed. The 12-region topology, 48 nodes, 65 roads, 7 crossings, 39 physical solids, playable original scenes, saves and protected actor art are unchanged. **Creator visual acceptance remains 0%; Phase 9 ACTIVE and Phase 10 LOCKED.** Source: `docs/overworld/HOLLOWREACH_LANDSCAPE_R12.md`.

# VEILWARD v1.3.9 — phase 9 original-style terrain and infrastructure pilot

**Visual acceptance still 0% — NOT READY FOR CREATOR REINSPECTION.** Hollowreach now uses new painted terrain materials (snow, stone, paths, rocky cliff transitions) alongside real illustrated cabin, pine, icy rock, lantern, stairs and bridge sprites. This is a prototype of the *asset pipeline*, not a finished full map. The original richly illustrated adventure and all saves are unchanged.

[Play the current technical build](https://hdog960.github.io/Vielward/) · [Art direction and development milestones](./docs/overworld/HOLLOWREACH_MATERIALS_R3.md)

**Phase 10 remains locked.** The next requirement is a coherent finished Hollowreach scene, reviewed against the original golden-reference screenshot before doing all biomes.

---

# VEILWARD v1.3.8 — original-style pixel-art pilot

The extended 12-region world is still **visually unapproved**. Rather than adding more polygon scenery, we have begun integrating genuine authored pixel sprites into **Hollowreach**: snow-laden fir, lit timber cottage and icy cliff cutouts. They sit in the existing physical world with the old travel layout, collision, quests and saves protected. This first three-asset pilot is not yet a complete scene and **not 100% visual acceptance**. The original richly illustrated Hollowreach gameplay is unchanged.

[Play Veilward](https://hdog960.github.io/Vielward/) · [Pilot source/next milestones](./docs/overworld/HOLLOWREACH_RASTER_PILOT.md) · [Sprite atlas](./assets/hollowreach_pilot_sprites_v1.png)

**Phase 9 remains on hold for art; Phase 10 is locked** until the creator approves the complete illustrated overworld.

---

# Veilward — Art direction protected, no false visual acceptance

**The original illustrated Hollowreach/Greenwood game remains our standard.** The v1.3.6 12-region exterior is still a visually REJECTED topology test (0% art approval), and **Phase 10 is locked**. After reviewing actual screenshots, the v1.3.7 idea of repeating source-painting swatches was rejected and rolled back rather than released as an artistic improvement. A production-quality landscape/sprite atlas is still required, first for a complete Hollowreach pilot and then Greenwood. Original adventure environments and progress are unchanged.

[Art-direction correction and mandatory new asset workflow](./docs/overworld/ART_DIRECTION_RESET.md) · [Play the preserved game](https://hdog960.github.io/Vielward/) · [Real-world vs approved-source browser screenshots](https://github.com/hdog960/Vielward/actions/workflows/visual-qa.yml)

---

# VEILWARD v1.3.6 — VISUAL RECOVERY R2 (ART ACCEPTANCE STILL 0%)

**Playable visual development:** 29 physically validated fantasy village, forest, bridge and highland compositions were added on the EXISTING 12-region source map. Source-accurate rock faces now have cliff-strata shading; all seven bridges have finer wood and stone construction; normal travel no longer has the obstructive debug label. The previously accepted 48 locations, 65 roads and 7 crossings, saves, quests and original approved sprites are preserved.

[Play the new v1.3.6 Veilward build](https://hdog960.github.io/Vielward/) → Journey Menu → **Review Visual Recovery R2 (Phase 9)** → **Review World Map & All 12 In-Game Regions**. Walk Hollowreach, Greenwood, Coldpine, Northwatch and Frostbridge and inspect the original-game screenshots; the source test and browser images never substitute for the creator's visual judgment.

[Visual Recovery R2 implementation, QA and limitations](./docs/overworld/VISUAL_RECOVERY_R2.md) · [Source landmark compositions](./world_setpieces.js) · [Physical scene QA](./tests/visual_recovery_r2.test.js) · [Five actual browser screenshots](https://github.com/hdog960/Vielward/actions/workflows/visual-qa.yml).

**Phase 10 LOCKED.** This is a substantial R2 art pass, but not final 32-bit illustration acceptance. The creator's last expressed rating is 0%; all remaining art-focused R3+ revisions occur inside Phase 9 until explicit approval.

---

# VEILWARD v1.3.5 — VISUAL RECOVERY R1.1 (Creator appearance approval pending)

The first recovered renderer (v1.3.4) passed functional tests but actual browser captures still showed barren crossroads, speckled ground and oversized roads. This update produces collision-backed groves closer to travel, denser illustrated foliage and grass, far fewer scattered texture dots, and narrower roads while keeping the 12 regions, 65 road links, seven crossings, character art and local saved adventure intact. These are real game changes; **not yet approved final 32-bit illustration quality.**

**Play and compare:** [Open Veilward](https://hdog960.github.io/Vielward/) → Journey Menu → **Review Visual Recovery R1.1 (Phase 9)** → **Review World Map & All 12 In-Game Regions**. Confirm **v1.3.5**. Browser capture QA: [four actual rendered screenshots](https://github.com/hdog960/Vielward/actions/workflows/visual-qa.yml) (download job artifact). See [Visual Recovery R1–R1.1 engineering log](./docs/overworld/VISUAL_RECOVERY_R1.md).

**Phase 10 remains locked while visual acceptance is 0%.** Our original high-detail snowy and Greenwood assets remain protected as the art targets.

---

# VEILWARD v1.3.4 — VISUAL RECOVERY R1 (ART ACCEPTANCE PENDING)

The creator accepted the 12-region geometry/travel layout but explicitly rejected the Phase 9 appearance (0% visual acceptance). The latest playable build replaces part of the over-simplified 32px noise/pipe-road/empty-shape terrain renderer with world-coordinate clustered ground, narrower natural trails, visually richer climate-dependent tree/rock structures, a real footprint-anchored three-quarter cottage and 13 source-grounded landmark compositions, and a zoomed closer atlas with landmark-framed region previews. This is an **initial actual code/art change**; it is not yet a complete high-fidelity match to the approved reference JPGs.

**Review the changed game:** [Open Veilward](https://hdog960.github.io/Vielward/) → Journey Menu → **Review Visual Recovery R1 (Phase 9)** → **Review World Map & All 12 In-Game Regions**. Confirm v1.3.4; compare Hollowreach, Greenwood, Coldpine and Frostbridge in the world and by walking rather than trusting a mock concept. The other eight biomes retain map continuity.

**[R1 engineering handoff, remaining R2–R4 art tasks and truthful limitations](./docs/overworld/VISUAL_RECOVERY_R1.md)** · [Actual environment painter](./world_illustration.js) · [R1 source/regression verification](./tests/visual_recovery_r1.test.js).

**Phase 10 BLOCKED pending explicit creator acceptance.** Original adventures, progress storage, routes, bridge collision and original asset images are preserved.

---

# VEILWARD v1.3.3 — Phase 9 Review Build · FULL OVERWORLD APPEARANCE APPROVAL REQUIRED

**Phase 9 implementation:** Source-built 12-region visual atlas and a whole-world map with all 65 physical routes and seven crossings, rendered from the **actual playable world** (not conceptual illustrations). Every region has a true 160×160 terrain-art screenshot and a tap-to-visit source anchor. Graph/land-water/crossing/road collision checks, seasonal foliage, real outdoor geography and original gameplay preserved.

**iPhone Safari / Home Screen:** [Play Veilward](https://hdog960.github.io/Vielward/). Journey Menu → **Review Full Overworld (Phase 9)**, then **Review World Map & All 12 In-Game Regions**. Tap one of the twelve real-world thumbnails to jump and walk, use the map icon ◈ to reopen the atlas, and Visit Next Crossing to review all seven river/chasm traversals.

- [Phase 9 truthful playable-world handoff](./docs/overworld/PHASE9_HANDOFF.md)
- [Region-by-region in-game atlas index](./docs/overworld/PHASE9_REGION_ATLAS.md)
- [Physical/world art approval checklist](./docs/overworld/PHASE9_QA.md)
- [Full graph, shoreline/material, road lane and genuine-rendered-atlas regression tests](./tests/overworld_phase9_review.test.js)

The gold path marks the future Hollowreach → Thawline → Greenwood → Smugglers testing corridor, not a substitute for the remaining world. The original adventure, Warden Hal and approved Wanderer are unchanged. **This is an appearance-review build, not an entirely complete RPG. Development MUST STOP after Phase 9 until the creator explicitly approves the entire exterior look and map. No Phase 10 yet.**

---

# Veilward v1.3.2 — Phase 8: Real Roads, Bridges, Stairs & Island Network

**Updated playable iPhone world:** The optional continuous overworld now draws all 65 authored roads using their actual movement/collision positions; snow roads, forest tracks, switchbacks and stone stairs follow the same source geography. Five visually differentiated and physically guarded bridges, the Stoneford dry ford and Mossmere's east stone causeway are built. The island has both east/west physical entrances instead of a travel portal. Road palette follows Phase 7's gradual regional climate. Streamed terrain's water/chasm material uses the actual physical hazard mask.

**Playtest:** [Play Veilward](https://hdog960.github.io/Vielward/) → Journey Menu → **Explore Roads & Crossings (Phase 8)**. Inside the preview use **Visit Next Crossing** to inspect all seven structures, and **Visit Next Region** for 12-region roads and stairs. The original saved Hollowreach adventure remains independent.

- [Phase 8 handoff, iPhone testing and remaining limitations](./docs/overworld/PHASE8_HANDOFF.md)
- [Physical road art source and five guarded bridge structures](./world_routes.js)
- [Road network and crossing QA](./docs/overworld/PHASE8_QA.md)
- [Full crossing art/physics and iPhone version regression suite](./tests/overworld_phase8_routes.test.js)

**Next:** Phase 9 whole-outdoor navigability survey and creator appearance review build. **STOP after Phase 9 for creator's explicit approval of the full exterior landscape before Phase 10.** Full in-game visual fidelity is not certified by source-only tests.

---

# Veilward v1.3.1 — Phase 7: Climate-Blended Continuous World

**Real playable update:** A global climate sampler now connects snowy Hollowreach and Northwatch through exposed pine slopes, patchy snowmelt, damp moss and temperate Greenwood. The Mossmere shore gets moisture gradients, and high eastern Worldscar retains a frost-capable rock canopy. Existing authored pixel material families, detailed tile-level patches, and deterministic regional trees/flowers/rocks all read this common climate data; roads, terrain collision, and the original quest remain intact.

**iPhone test:** [Play Veilward](https://hdog960.github.io/Vielward/) → **Journey Menu → Explore Climate-Blended Overworld (Phase 7)**. Walk along roads across Thawline or use **Visit Next Region** to inspect all twelve anchor locations. The terrain overlay still shows real collision. Return to Hollowreach to recover the unchanged saved adventure.

- [Climate and regional weather profiles](./world_climate.js)
- [Phase 7 handoff, playtest and next-phase notes](./docs/overworld/PHASE7_HANDOFF.md)
- [Phase 7 source and creator visual acceptance matrix](./docs/overworld/PHASE7_QA.md)
- [Climate regression suite](./tests/overworld_phase7_climate.test.js)

**Phase 7 complete in source, awaiting on-device art assessment.** Phase 8 will finish detailed physical roads, bridges, stairs and island access; Phase 9 will survey and present the complete outdoor environment. **Hard stop after Phase 9 for your explicit overworld appearance approval before Phase 10.**

---

# Veilward v1.3.0 — Phase 6: Twelve-Region Outdoor Landmass

**Real playable update:** The continuous outdoor preview now uses a **single 29-point physical landmass outline** and authored environment composition across **all 12 approved regions**. It retains **65 connected roads and 7 physical crossings**, adds **13 landmark environments, 35 deliberately clear travel/hub areas**, and places region-specific trees, rocks, cairns, flowers, reeds and ruins using deterministic world coordinates. The same natural object source is used for its visible shape and collision.

**iPhone test:** [Play Veilward](https://hdog960.github.io/Vielward/) → **Journey Menu → Explore Continuous Overworld (Phase 6)**. Inside the preview use **Visit Next Region** to inspect 12 areas, or walk between them continuously. Use **Terrain Geometry Overlay** to inspect true natural collision. Return to the original Hollowreach quest without touching your saved progress.

- [Phase 6 implementation and real-device test checklist](./docs/overworld/PHASE6_HANDOFF.md)
- [Physical landmass, 12 biomes, 13 landmarks and wilderness source data](./docs/overworld/outdoor_footprint.json)
- [One-source natural solid art / movement engine](./world_footprint.js)
- [Phase 6 acceptance limitations and QA](./docs/overworld/PHASE6_QA.md)

This is **not** the finished visually approved 12-region overworld. Climate continuity, detailed 2.5D scenes, richer local landmarks and regional architectural depth come next in Phases 7–9. **The complete playable overworld appearance must be reviewed and explicitly approved after Phase 9, before Phase 10.** Approved player/Warden art and the legacy adventure save are unchanged.

---

# Veilward v1.2.9 — Phase 5 Playable Pixel-Art Terrain Preview

**Actual game update:** A new 16-material / 64-source-tile pixel-art terrain atlas now renders inside the opt-in seamless outdoor preview, composed from the actual Phase 4 collision/road/elevation data. Snow, snowmelt, forest, grass, stone, river/lake water, cliffs, bridges, tree props, lamp posts and shadowing are no longer solely flat-colored debug surfaces. The approved Wanderer and Warden sprites remain unchanged.

**How to test on iPhone:** Open [Veilward](https://hdog960.github.io/Vielward/) → **Journey Menu → Explore Pixel-Art Terrain (Phase 5 Preview)**. Inside the preview, use **Visit Next Terrain Material** to jump between Hollowreach snow, Thawline, Greenwood forest, Worldscar stone and Mossmere lake. Each stop is a real streaming-world position, but preview travel never alters your original quest/save. **Return to Hollowreach Adventure** when finished.

- [Actual in-game source material atlas and rendering](./terrain_art.js)
- [16 material signatures, variations and pixel-source manifest](./docs/overworld/TERRAIN_MATERIALS.json)
- [Pixel-art environment reference and compositing style guide](./docs/overworld/TERRAIN_ART_STYLE_GUIDE.md)
- [Phase 5 QA and 5-stop screenshot checklist](./docs/overworld/PHASE5_QA.md)
- [Completed Phase 5 → Phase 6 technical handoff](./docs/overworld/PHASE5_HANDOFF.md)

**Scope note:** This ships a functioning source-art and compositing system; it does not mean the full 12-region world has been painted to the same detail as the original background illustrations. Full location art comes in Phases 6–8, with a strict **creator appearance review after Phase 9 before Phase 10**. No separate art-only deliverable substitutes for patching the actual game.

---

# Veilward v1.2.8 — Phase 4: Real Ground, Collision and Elevation Preview

**Actual game patch deployed to the GitHub source branch.** The playable outdoor preview now loads **co-authored terrain geometry** with one source for visible floors, tree trunks, physical blockers, bridge decks, stair grades, river/chasm/lake hazards and named inspection zones. There are 7 authored floor patches, 30 grounded solids and 11 inspectable locations; 65 roads and 7 planned crossings retain continuous movement.

**On iPhone:** Open [Veilward](https://hdog960.github.io/Vielward/) → **Journey Menu → Explore Outdoor Terrain (Phase 4 Preview)**. Inside the preview, ☰ → **Terrain Geometry Overlay: ON** to inspect foot anchors, height, colliders and paths; use **✋ Inspect** near a named landmark. ☰ → **Return to Hollowreach Adventure** resumes the existing quest/save. This is a REAL gameplay engine update, but the preview's schematic terrain art is **not** yet the final rich pixel-art environment.

- [Phase 4 technical handoff / on-device checklist](./docs/overworld/PHASE4_HANDOFF.md)
- [Authoritative physical geometry source](./docs/overworld/terrain_geometry.json)
- [Phase 4 geometry QA report](./docs/overworld/PHASE4_QA.md)
- [Automated movement/collision/altitude regression](./tests/overworld_phase4_geometry.test.js)
- [Approved Phase 2 full-world master map](./docs/overworld/MASTER_MAP.svg)

**Next:** Phase 5 pixel-art terrain and compositing workflow — only upon next Continue development. **Appearance review remains mandatory after Phase 9, before Phase 10.** Existing player/Warden sprite assets and saved adventure state were not changed.

---

# Veilward v1.2.7 — Phase 3: Playable Streaming World Preview

**An actual game patch is now available.** The existing Hollowreach v1.2.6 experience remains intact, with a separate playable **Phase 3 world-streaming preview** accessible from the Journey Menu. It demonstrates continuous global walking across nearby lazy-loaded outdoor chunks, smooth camera and low-memory culling across the approved 12-region geography.

**To test on iPhone:** Open the usual Home Screen shortcut or [GitHub Pages game](https://hdog960.github.io/Vielward/), open **Journey Menu → Explore Seamless Overworld (Phase 3 Preview)**. Move with the normal iPhone joystick; use **Journey Menu → Return to Hollowreach Adventure** to resume the untouched quest and saved position. The preview uses the approved Wanderer atlas, but disables combat, NPC interaction and inventory changes to preserve your saved adventure.

- [Phase 3 implementation and QA handoff](./docs/overworld/PHASE3_HANDOFF.md)
- [Phase 3 source tests](./tests/overworld_phase3_streaming.test.js)
- [Approved 12-region outdoor blueprint](./docs/overworld/MASTER_MAP.md)

**Visual disclaimer:** The streaming preview uses TEMPORARY procedural terrain textures and schematic roads/water from the blueprint. These are NOT the approved finished detailed pixel-art environment. Actual visually coherent terrain and coauthored collision/elevation are Phase 4–8 work; the creator's explicit *appearance approval* remains due after Phase 9 before Phase 10.

---

# Veilward Overworld Rebuild — Phase 2 Complete Topology (November 5, 2026)

**Implemented in repository design assets, not game runtime.** A complete continuous outdoor planning map with **12 regions, 48 named route anchors, 65 connected walkable travel links, 7 physically designed water/chasm crossings and three independently passable Hollowreach→Greenwood options** is now source-controlled and validated. Natural snow-to-green transitions are planned across distance and elevation; cave/workshop doors remain true indoor thresholds.

- [**Open the new complete master map (SVG design schematic)**](./docs/overworld/MASTER_MAP.svg)
- [Creator-readable geography, regions, roads, crossings, elevations and route timing](./docs/overworld/MASTER_MAP.md)
- [World-coordinate JSON with all roads, polygons, paths, streams and landmarks](./docs/overworld/world_blueprint.json)
- [Phase 2 geometry / topology audit](./docs/overworld/PHASE2_TOPOLOGY_AUDIT.md)
- [Phase 3 technical handoff](./docs/overworld/PHASE2_HANDOFF.md)
- [Approved 22-phase roadmap and full-overworld visual review gate after Phase 9](./OVERWORLD_REBUILD_ROADMAP.md)

The map schematic is **not a gameplay screenshot or concept art approval request**. The actual v1.2.6 iPhone game and its sprites, scenes, saves and service worker remain unchanged during this design phase. Next, upon user request, Phase 3 implements the real global outdoor coordinate system and chunk-streaming foundation without breaking the current working game. After Phase 9 the creator reviews the complete **playable** outdoor appearance before Phase 10.

---

## Approved Continuous Overworld Rebuild — Phase 1 Audit (November 5, 2026)

The approved **22-phase** world rebuild has begun. **Phase 1 is a code-and-art audit only**: registered 34 creator issues covering all 12 pages of `Vielward.pdf`, established the visual design contract, inventoried all current scenes/NPCs/enemies/props, documented global-coordinate/save-migration rules, and pinned the approved Wanderer and Warden Hal assets. Run `npm run audit:world` for source baseline/protection assertions.

Start here:
- [All 34 screenshot/design issues and acceptance criteria](./docs/overworld/ISSUE_REGISTER.md)
- [Existing scene, NPC, enemy, object and asset inventory](./docs/overworld/ASSET_AND_RUNTIME_INVENTORY.md)
- [Screenshot-by-screenshot acceptance matrix](./docs/overworld/SCREENSHOT_ACCEPTANCE_MATRIX.md)
- [Machine-readable old scene coordinates and portals](./docs/overworld/legacy_scene_anchors.json)
- [Phase 1 completed audit and handoff](./docs/overworld/PHASE1_HANDOFF.md)
- [Locked design pillars and Phase 9 appearance review gate](./docs/overworld/WORLD_DESIGN_LOCK.md)
- [Existing local coordinates and future save migration contract](./docs/overworld/COORDINATES_AND_MIGRATION.md)
- [Approved 22-phase roadmap](./OVERWORLD_REBUILD_ROADMAP.md)

**The playable game remains v1.2.6.** Nothing in this phase edits or claims to fix runtime movement, world art, collision or NPC behavior. Next requested phase: **Phase 2 — complete terrain blueprint and physical overworld topology**, without prematurely replacing a working build. **Creator must review the complete outdoor overworld's appearance after Phase 9 before Phase 10.**

---

# Veilward v1.2.6 — Phase 5: Closed introductory quest and complete sprint regression

**Playable update implemented on GitHub:**
- Joren's missing supplies can be recovered only after accepting the quest and defeating at least one raider in the cave. The chest gives +30 gold once; Joren's hand-in gives +80 gold once and removes the quest item. The Worldscar follow-up completes at quest stage 5, even if attuned early.
- Persisted **collection flags separately from item counts**: Blueleaf nodes remain harvested after trading them to Mira, the stolen-supplies chest remains empty after delivery, defeated cave bandits stay defeated after relaunch while surviving raiders remain alive, and the Worldscar cannot grant repeated XP.
- Save migration preserves older playthroughs, including players already holding/delivering supplies; normal quest, level, weapons, gold and herb inventory survive the upgrade. Reset starts a genuinely fresh playable state with all world pickups restored.
- Improved Journal status, guarded-chest instructions, Joren dialogue, finished quest feedback, and shop duplicate purchase prevention.
- Versioned Home Screen app update \`v1.2.6\` and new \`quest.js\` loaded before game code; existing player/Warden art assets, winter/forest/cave backgrounds, original save key and combat logic untouched.
- **Verified in automated simulated QA:** [Phase 5 test suite](./tests/phase5_quest.test.js) 92 assertions. Reran [Phase 3 map traversal](./tests/phase3_scene_geometry.test.js) 1,319 assertions and [Phase 4 combat](./tests/phase4_combat.test.js) 100 assertions. All **1,511** code-level assertions passed. Actual iPhone/screenshot acceptance is still pending.
- Test all three suites with \`npm test\` (no runtime dependencies).

**Sprint summary:** All five planned implementation phases are complete, but **Gate 1 art approval and real iPhone playtest are NOT complete**. Further development awaits the creator's evaluation, not automatic Phase 6.

[Detailed Phase 5 regression and iPhone checklist](./tests/phase5_quest_qa.md)

---

# Veilward v1.2.5 — Phase 4: Responsive, readable combat

**New playable-game combat improvements:**
- Dedicated `combat.js` rule engine implementing a properly aimed 88-unit forward sword cone. The old sword could hit enemies behind/beside the player and through scenery; it now respects the exact eight-direction Wanderer facing and actual painted terrain collisions.
- Spell aim selects only visible nearby foes inside a forward ~70° half-angle; a closer enemy at 90° no longer redirects the spell sideways. Fireballs stop on wall/cliff boundaries instead of sailing through rocks.
- All three active foes (wolves, bandits, wraiths) now give readable, differently timed **ground wedge windup warnings** and use distinct attack damage/range/cooldown profiles. Telegraph aim freezes at warning start, so sidestepping/dodging can avoid hits. Sword and spell staggers cancel attacks instead of allowing stunned foes to still strike.
- Enemy health bars are positioned above illustrated heads, not across the bodies; resource bars and ability controls visibly indicate low stamina, low mana and cooldowns. Touch action behavior from Phase 2 is preserved.
- Accurate sword damage numbers include equipment bonuses; diagonal dodges travel at normalized speed.
- **Protected assets:** approved Wanderer eight-direction sprite, Warden Hal's original independent image, all zone art. Original save key `veilward-hollowreach-v01` and quest state remain intact.
- **Verified in simulated Node QA:** [tests/phase4_combat.test.js](./tests/phase4_combat.test.js), 99 assertions passed. Real physical iPhone combat appearance/feel is not yet verified.
- Updated game/visual/UI/source and installed-app worker to `v1.2.5` with versioned assets. **Phase 5 remains NOT STARTED.**

Detailed acceptance instructions: [tests/phase4_combat_qa.md](./tests/phase4_combat_qa.md).

---

# Veilward v1.2.4 — Phase 3 completely rebuilt against actual screenshot evidence

The v1.2.3 world-traversal pass failed visual acceptance. Its connected-region tests did not ensure that walkable polygons coincided with the actual scenery. The Wanderer was shown on **river water**, a **shrine fence**, a **bridge railing**, and a **cave lantern post**. These were real environment/collision bugs.

**The v1.2.4 playable update addresses these four screenshots in the game code:**

- Replaced all three outdoor/dungeon walkable meshes with **image-native 900×584 floor and obstruction polygons**. The village's outdated 707×530 coordinate transform (the main cause of the misplaced river/bridge polygons) has been removed.
- Gave narrow, foot-safe bridge decking and actual no-walk rails, posts, stone plinths, cliff faces, river regions and water channels. All three scenic zones retain connected gameplay routes.
- Relocated the **Greenwood Trail marker** to the village's snowy southwest road and the **cave return marker** to the left end of the bridge; placed village return on open snow rather than a bridge post. Both sides of portal travel are now visually coherent and safe.
- Moved Mira, Eldric, noticepost, one Blueleaf pickup, and a wraith out of visually inaccessible locations. NPC interactions and all quest completion rules preserved.
- Updated old-save navigation schema to 6 without resetting the user's position when it remains legal; forbidden river/fence saves auto-relocate to the closest available safe walkable ground.
- Bandit visual now uses the existing distinct olive-armored raider, not a third red-scarfed hero. **Player Wanderer source art, player animations, Warden Hal authored portrait/sprite, save key, quest data and player combat math were NOT changed.**
- Upgraded `game.js?v=16`, `navigation.js?v=9`, `visual.js?v=31`, `manifest.webmanifest?v=124`, `?art=21`, and service-worker cache `veilward-hollowreach-v124-painted-ground-geometry`.

**Verification:** `node tests/phase3_scene_geometry.test.js` is now a durable, runnable regression suite with **1,319 assertions and 10 complete path replays (612 motion segments)**, including positive and prohibited screenshot-matched coordinates and stale-save recovery. Tests pass in a simulated execution of the committed JavaScript modules. **Real iPhone rendering and movement approval remains pending**; we are not claiming the painted depth-order quality is fully signed off.

**Status:** Repeated Phase 3 only. **Phase 4 is not started.** Full details: [Phase 3 redo QA](./tests/phase3_redo_qa.md).

---

# Veilward v1.2.3 — Hollowreach polish sprint: Phase 3

**Playable-world changes pushed to GitHub:**
- Reopened the **upper Smuggler's Hollow shrine** by correcting the overly broad stone-pylon collider. Cave arrival, stolen supplies, both cave exits and the shrine now share the same walkable network; no new walk-through-void shortcut was added.
- Moved cave → Greenwood return spawn to `1520,720` and Greenwood → village return spawn to `960,925`, avoiding instant re-entry into the portal while keeping painted ground underfoot.
- Added a short post-travel portal cooldown, queued destination-image loading (no overlapping requests), and a safe joystick reset on travel.
- Unified save-spawn safety with the actual player radius (8 units) and added gentle floor-level route/arrival lighting that stays behind character sprites.
- All scene JPGs and **both approved hero/NPC sprite assets are unchanged**. Village, forest and cave game images remain their authored painted backgrounds.
- Bumped navigation/visual/game and service-worker cache to `v1.2.3`; no save-key migration or quest reset.

**Verification:** All three zone collision regions connected; all 15 listed destination/objective anchors walkable and graph-connected; seven 8-radius `projectMotion` route replays including the formerly inaccessible shrine passed without stuck steps. Rendered glow initialization smoke tests passed. Real iPhone playtest pending; bridge-rail occlusion and hand-drawn foreground depth should still be visually reviewed on the device, not falsely declared perfect.

[Detailed Phase 3 traversal QA](./tests/phase3_traversal_qa.md). Next on user's command: Phase 4 — combat feel/fairness. Phase 4 not started.

---

# Veilward v1.2.2 — Hollowreach polish sprint: Phase 2

**Actual playable-game improvements (iPhone controls + Home Screen reliability):**
- Lock joystick control to one pointer; other thumb can freely press action buttons. Release on pointerup/cancel/lostpointercapture, blur, pause, inventory, dialogue, and app background.
- Trigger touch actions on press, suppress followup synthetic duplicate click, keep mouse/keyboard clicks.
- Choose nearest interactable by physical distance (slightly de-prioritize portal/hound) to favor the NPC being approached.
- Autosave when the app backgrounds or navigates. Restart on service-worker update only once per version and check for updates on load, resume, and focus.
- Fix offline Home Screen reloads with versioned launch URLs; keep HTML/JS network-first and assets offline-cached.
- Surface live running **v1.2.2** in Journey Menu, improve narrow-landscape safe area/HUD fit and modal scrolling.
- Protected the approved Wanderer sprite atlas, Warden Hal art, all hero animation selection, player physics/combat tick, inventory/quest data, and `veilward-hollowreach-v01` save key.
- **Synthetic QA passed** (touch 10, targeting 6, SW activation/offline); device-level iPhone testing is pending. Phase 3 not started.

**Full checklist:** [tests/phase2_mobile_qa.md](./tests/phase2_mobile_qa.md). **Next:** Phase 3 — traversal & environment cohesion, only after user says continue.

---

# Veilward v1.2.1 — Hollowreach polish sprint: Phase 1

**Implemented and tested (simulated Canvas):**
- Added transparent-alpha footprint measurement for the 10 existing NPC/enemy atlas cells and Warden Hal's separate authored `assets/warden_hal_v13.png`. NPCs now use their **own measured transparent sole padding** to place feet on the navigation ground consistently rather than a one-size-fits-all offset.
- Corrected floating NPC name labels: only the currently interactable NPC displays an in-world name; it is placed above the **measured** visible head, drawn after all actors so depth-sorted sprites don't cover it, and clamped within the landscape camera. The old hard-coded y-96 Warden label bisected his head.
- Warden Hal source `192×176` alpha bbox `(32,11,160,170)` confirmed; foot margin `6px`. No edits to his dedicated art file.
- **Approved Wanderer source, the eight-direction animation-selection/render branch, player navigation and movement, NPC interactions, game saves and quests are unchanged.**
- Bumped `visual.js?v=28`, `game.js?v=13`, asset `?art=18` and service worker `veilward-hollowreach-v121-character-grounding` to propagate through iOS Home Screen installation.

**QA:** All modified JavaScript passed syntax checks. Mock-canvas alpha tests checked 10 cell measurements and 6 grounded NPC roles: all feet landed within 0.5 world unit of their target; Warden label plate ends 7.2 world units above the detected top of his head. Actual iPhone screenshot inspection is **pending the user's next test**. Bridge-rail foreground occlusion remains a known later art/depth task.

**Sprint:** Phase 1 complete in code; **stop here**, do not proceed to Phase 2 before "Continue development".

---

# ACTIVE DEVELOPMENT PLAN — Two-hour Hollowreach polish sprint

Five sequential, testable phases totaling **120 minutes planned effort** (acceptable 90–150). One entire phase per user **"continue development"** message; patch the actual game, verify the GitHub commit, then stop for feedback. **Phase 1 has not begun.** See [TWO_HOUR_SLICE_ROADMAP.md](./TWO_HOUR_SLICE_ROADMAP.md) for phase requirements and acceptance checks. The existing long-term [PROTOTYPE_ROADMAP.md](./PROTOTYPE_ROADMAP.md) stays in force.

---

# Veilward v1.2.0 — Warden Hal rebuilt as his own character (November 4, 2026)

**Actual game asset rebuild.** The screenshot with Warden Hal's still-squared hair prompted a full replacement instead of another hair/armor color filter.

- New original transparent sprite `assets/warden_hal_v13.png` (192×176 pixels) with a middle-aged bearded Warden, tightly pulled-back dark hair/topknot, fur-lined navy-blue commander cloak, gold clasp, engraved blue tabard, layered brown-metal armor and a substantial sword. Distinct body, face, clothes, hair and weapon silhouette from the younger brown-haired Wanderer.
- Warden is now **loaded as its own file** in `visual.js`. The original `createWardenVariant()` painted/recolored guard routine has been completely deleted. He does not share a hero frame, reuse a player pose, or use an overpainted NPC swordfighter.
- Warden ground foot anchoring adjusted by six source pixels; existing character layering and shadow kept.
- **Player untouched**: no changes to hero sprite file or its rendering branches, movement, attack controls, HP, quest, game saves or navigation.
- PWA bumped to version 1.2.0 and cache `veilward-hollowreach-v120-warden-original`; Safari and Home Screen assets use versioned URLs. UI pause panel version updated.
- Source art is extracted and reworked from an original Warden Hal-specific RPG scene created for this revision, not from the Wanderer or old guard cell. Dedicated sprite has transparent cutout.

**QA:** reviewed cropped sprite and source alpha; JavaScript syntax and source wiring checked. Real Safari/iPhone visual verification is the player's next playtest.

---
# REQUIRED WORKFLOW — READ BEFORE DEVELOPING

**Patching the real, playable game after each user feedback report is a REQUIREMENT, not an authorization or suggestion.** The user tests → the assistant patches the GitHub game → the user retests. Do not send plans, diagnostics, or standalone art instead of an update. See [AGENTS.md](./AGENTS.md) for the mandatory, persistent operational contract and the outstanding Warden Hal work order.

---

# Veilward v1.1.3 — Real Home Screen patch and Warden repair

- The previous assistant incorrectly asserted GitHub access was unavailable instead of checking; this release contains an actual commit.
- **iOS Home Screen update:** new registration checks updates on app load, on visibility return and when returning from background; `updateViaCache:"none"` bypasses cached service-worker script; controller changes reload once per build. The new worker removes older caches and attempts to navigate already-open old clients on activation. JavaScript/HTML are fetched with `cache:"no-store"`, while scenes and sprites retain offline caching.
- **Warden only:** removed arbitrary rectangular recoloring boundaries, changed to per-pixel hair/clothing classification, and cropped hair tips toward a short ash-gray military style instead of the original spiky Wanderer hair. No box helmet, shield icon, or hard-edged hair overlay. This is a conservative repair using existing textured art, not a claim of a completely new hand-drawn NPC.
- The **approved player sprite atlas** and all player movement and collision routines remain unchanged; same local save key.
- Manual iPhone Home Screen testing remains required; service-worker updates can only propagate once the device checks online.

---
# Veilward 1.1.2 — Warden Hal art repair (Nov 4, 2026)

The user found that the prior guard 'helmet' looked like a giant pixel crate/chest rather than a human head. Root cause: code was using broad hard-edged Canvas rectangles, clipping the artist-authored hair and covering the face with a box-shaped overlay, then adding an oversimplified icon shield. This violates Veilward's authored-pixel-art requirements.

**Implemented, not a mockup:**
- Deleted the entire fake block helmet, geometric visor and icon shield renderer.
- Preserved the original fully illustrated 192×176 NPC atlas guard, including expressive face, natural hair, detailed armor and sword, with transparent silhouette.
- Applied source-pixel color remapping only: silver/ash hair; midnight-blue and cold-steel clothing/armor, preserving each pixel's inherent shading and contours. Hal remains distinguishable from the red-scarfed player without flat icon elements.
- Removed the ungrounded Warden vertical sprite offset; all NPCs keep consistent foot anchoring.
- Bumped visual.js and PWA cache/asset versions while preserving existing saves and game logic.

**Still required:** visual approval on the iPhone. This corrective patch does not claim that the warden art has reached the final art-quality gate.

---

# Veilward v1.1.1 — iPhone playtest corrections (November 4, 2026)

- **Boot contact:** The approved 32-frame hero sheet has 12px transparent bottom padding per 180px cell. The renderer now offsets all eight facings by 10 world units so the visible boots actually touch the navigation/ground anchor instead of floating above it.
- **Shadow:** The wide detached shadow was reduced to a tight, lower-profile contact shadow centered on that same world anchor. The world-space collider and movement code remain untouched.
- **Warden Hal:** NPC atlas index 3 was essentially a clone of the hero (same red scarf, brown hair, armor and sword). Its displayed sprite is now turned into a distinct dark-blue armored village warden with a closed segmented steel helmet, slit visor, gold trim and kite shield. The transformation runs only once after the existing NPC atlas loads; other NPC art is unchanged. This is part of the real Canvas actor renderer, not an art-only illustration.
- **PWA:** New query strings, script version and offline cache key. Same save key and quest state.

Simulated renderer checks are expected; actual iPhone review remains the visual acceptance test.

---

# Veilward — v1.1.0 approved unified eight-direction character (November 4, 2026)

The creator approved the newly rendered 8-row × 4-column hero spritesheet and required that it be integrated into the playable game, not supplied as a detached illustration.

**Actual game implementation**
- Added `assets/hero_approved_8way_v12.webp`: the approved hero artwork converted into 32 aligned sprite cells. Rows S, SE, E, NE, N, NW, W, SW; columns idle, three distinct walk poses.
- Removed the mixed-art south-facing override when the new atlas loads. **All eight directions use the same source artwork, armor, face proportions, scarf and sword.**
- Player keeps the same `150×154` game-world rendering bounds and common foot anchor while turning. Walk animation uses distance actually traveled to choose real authored frames.
- Preserved original mobile controls, game logic, combat effects, interaction, collision, saves, quests, and NPCs. The old 136-frame sprite atlas and supplemental front strip remain strictly as an offline fallback when the new asset fails.
- Advanced `visual.js`, sprite asset query, and service worker cache versions to force iPhone PWA updates.

**Limits:** This sheet includes 8 directions × (1 idle + 3 walk frames); dedicated directional combat, cast, damage, and dodge poses have **not** been authored in the new sheet. Existing gameplay effects work, but a fully independent combat atlas is still a future art gate. No physical iPhone frame-by-frame verification yet.

**Verification:** Sprite normalization produces 32 nonempty cells; browser canvas drawing coordinates, directions and animation indices are checked in a simulated runtime. The user must approve actual updated iPhone gameplay screenshots before we claim final 10/10 art signoff.

---

# Veilward — v1.0.2 hero age/proportion correction (November 4, 2026)

The November 4 mobile screenshots showed a juvenile-looking, swordless hero facing south/down, while left/right showed an adult armored wanderer. **The original 136-cell atlas is real, but the south row is not visually consistent with the side rows.**

- Added a separate **three-pose adult south-facing sprite strip** (`assets/hero_front_adult_v11.png`). It includes an idle, left stride and right stride, with the adult's full armor, red scarf, sword, boots and fixed ground anchor. It replaces the problematic south row at render time for movement, stationary facing and short action poses. Other seven directions continue to use the existing full atlas.
- Kept consistent on-screen hero dimensions (`150 × 154` world units) and foot position **for all directions**, with no intentional shrink/stretch when direction changes. Actual world-distance animation is unchanged.
- Replaced stray blue-dot cast cells (in the inherited atlas) with a clean pose pending a dedicated combat atlas. **This is not a complete redrawing of all eight directional attack animations.**
- Bumped visual assets and offline worker versions so iPhone home-screen users receive the artwork on a refreshed load. Saves, world terrain and quest progression are unchanged.
- Source art: a newly authored adult-forward 3-frame strip. The original `assets/hero_full_8way_v10.png` remains in use for the other directions. The supplemental strip is a temporary art-correction until all 8 facings have equally polished, independently animated frame sequences.

**Validation:** Asset layout and renderer wiring reviewed, cache dependencies enumerated. Physical iPhone/animation playtesting still requires creator verification. No gate or broader roadmap is declared complete.

---

# Veilward — v1.0 Complete Hero Sprite Sheet

The Wanderer now uses a real **8-row × 17-column sprite atlas**, not generated torso rectangles painted on top of front-facing sprites.

- 8 direction slots with a full 136-frame atlas: S, SE, E, NE, N, NW, W, SW.
- Dedicated artwork for the front, actual rear and side views; mirrored/nearest-angle views are used for some diagonal slots.
- Frame groups: idle (1), walk (6), run (4), sword attack (3), cast (2), dodge (1) for each direction.
- The new renderer draws complete frame cells directly, with animation driven by world movement distance, facing, and action state.
- All frames have transparent surrounding space and keep a common ground anchor. No ad-hoc removal of legs or old generated blue square backplate.
- Physical iPhone quality control still needed; this is the first complete sprite atlas, not a promise of final polished 8-angle hand-drawn animation.

Source: `assets/hero_full_8way_v10.png`. Frame-layout documentation: `assets/hero_full_8way_v10.json`.

---

## v0.8 — Directional walking (November 3, 2026)

## v0.9 — Rear-facing character animation correction

The prior v0.8 back-facing animation was procedurally painted over the front sprite with an angular brown hair silhouette and a rectangular blue armor plate. That shortcut is removed. The game now loads a separately authored, transparent six-pose rear-view sprite sheet at `assets/hero_back_strides_v09.webp`, retaining textured hair, fitted plated armor, crossed leather straps, and the scarf. Rear sprites are drawn only when moving north; the other directions keep their established artwork.

Walking timing now advances approximately 9 frames per second instead of one pose per second. The iPhone service-worker cache is versioned to v0.9; existing saves and quest progress are unaffected.

Verified in a simulated game runtime: 103 rendered player frames, both front and rear rows, all six rear walk frames, uninterrupted scene rendering, successful save. Not yet confirmed on a physical iPhone.

---

- Fixed the stationary/sliding player: a cached **four-direction, six-frame animation** is generated from the complete v0.7 hero artwork.
- Walking **up shows the back** of the character; down shows the front, and left/right face in the correct directions. Direction follows keyboard or touch joystick movement.
- Legs alternate during walking while keeping full-body pixels and consistent foot anchoring; no earlier cropped animation cells are reused.
- Animation advances based on real distance traveled, rather than elapsed time or merely holding a direction while blocked.
- Character immediately returns to the correct directional idle pose after stopping, and existing quest/progression saves remain compatible.
- All four directions, idle, menus, combat controls, animation construction, and 24 cached frame renders passed simulated game-runtime smoke checks.

**Scope:** Only movement presentation was addressed in this pass. Other NPCs currently remain mostly static; deeper directional combat animations and modular environment art are future refinement work. Physical iPhone screenshots have not yet been verified.

---

# Veilward — Hollowreach v0.6.2

## Artifact repair update

This release directly addresses the defects reported in the November 3 playtest screenshots.

- **Blue crystalline creature removed:** Replaced the baked-in creature from the original golden-reference village background with reconstructed matching snow texture. It is no longer a static ghost image behind the player.
- **Live actor masks rebuilt:** Hero, Warden, Joren, hunter, innkeeper, and enemies are drawn from tightly cropped transparent sprite silhouettes instead of wide atlas boxes containing leftover flowers, snow and ground debris.
- **Warden's snow-strip issue:** Removed separate disconnected atlas components under boots (including ground-like rectangular and horizontal streaks). The renderer creates its own soft radial shadows.
- **Friendly village hound:** Replaced the damaged wild-wolf sprite used for Ash with a separate clean seated husky sprite, cut out without the original snow background.
- **Animation and scale:** Aligned actor foot positions at a consistent baseline and improved source cropping so sprites occupy their actual body bounds.
- **Old saves retained:** No changes to localStorage save key or quest state and no required save reset.
- **iPhone cache:** Versioned visual.js and service-worker cache keys so Home Screen installations can refresh the new imagery.

### Verified before commit
- Programmatic browser-runtime simulation passed startup, movement, attacks, casting, saving, Joren dialogue, Warden dialogue, Ash interaction and travel to Greenwood.
- Every file referenced by the new game and offline service worker was verified in GitHub.
- Isolated sprite masks and the replacement snow area were visually inspected from the source assets.

### Remaining design limitations
This is a significant **asset-cleanup pass**, not the full graphical completion milestone. The village is still a single illustrated background plate instead of individually layered, animated pixel tiles; advanced animation sets, natural NPC schedules and full environmental occlusion remain pending. A physical iPhone and live GitHub Pages rendering test were not available from this chat session. Do not claim those tests occurred.

### Repository
`hdog960/Vielward` on branch `main`, published through the user's GitHub Pages configuration.

---

## Previous release notes

# Veilward — v0.5 clean scene reset

This commit is a **real game update**, not a concept-art deliverable.

### Improvements
- Replaced the damaged old Frostbound Village backdrop with a clean, small
  Frostbridge Outpost scene drawn directly from the project's golden visual
  reference; two baked-in human figures were removed. No oval-snow patches,
  floating cut-out trees or disconnected forge scene composites are part of
  this new village background.
- Rebuilt the active character atlas with normalized full-body sprites,
  consistent pivots/feet, removed loose visual artifacts, and replaced broken
  cast/dodge frames with intact poses (dedicated directional animations remain
  a later production requirement).
- Created a new scene-specific navigation mesh for cottage steps, courtyard,
  shrine stairway, wooden bridge and snowy exit trail.
- Repositioned real Joren, Warden Hal, Mira, Eldric, Ash and interaction points
  onto visible paths. The old standalone forge remains retired.
- Migrates existing character saves and preserves quest, XP, equipment and gold.
  Former forge interior saves return to the outdoor outpost.
- Increased the service-worker cache version for iPhone Home Screen installs.

### Verified in programmatic gameplay checks
New-game start, v0.4 save migration, retired forge migration, dialogue with
Joren, supply quest hand-in, travel from Frostbridge to Greenwood, and return
from Greenwood. All destination foot positions are on legal walkable terrain.

### Remaining limitations (do not misrepresent as finished)
The new Frostbridge scene is **an edited image derived from the creator-supplied
golden reference**, temporarily used to validate look, proportions, navigation
and UI. It is still a single scene image, not a licensed or original modular
tile system with independent props, occlusion and fully animated creatures.
Before the prototype is approved for wider public release, replace this
reference-derived plate with fully original authorized game art. Outdoor
crafting still needs a proper interactive set of modular forge props.
There has been no physical iPhone performance test of this build.

---

# VEILWARD: THE BROKEN SKY

## Hollowreach v0.4 — Live NPCs, cleaner environments, consistent forge, zoomed-out camera

The creator's approved pixel-art scenes are now represented by **character-free playable scene plates** in the winter village, Greenwood forest, and cave. Visible quest NPCs are rendered as separate interactive sprite actors in front of the scenery instead of being painted-in nonfunctional humans.

### Changes in v0.4
- Painted-in people and enemy figures removed from the three active scene backgrounds, and replaced with live sprites. Some artwork cleanup remains imperfect around formerly occupied scenery.
- Player rendering uses complete idle and walk sprite cells rather than the broken/cropped attack and cast cells. Combat and spell effects are still generated dynamically.
- World camera zoom = **0.78** (22% farther out); HUD stays full size for iPhone readability.
- Joren's **visible outdoor blacksmith stand is the real forge**: talk to him there to begin/complete the quest and access his shop. The inconsistent portal beside a villager has been removed.
- Legacy saves trapped in the separate unused forge interior are safely relocated to the village without deleting character progress.
- Added a live friendly village hound, with petting interaction.
- Kept authored walkable boundaries, transitions, combat, inventory, and saving from v0.3.1. Bumped asset and service-worker versions to prevent stale iPhone Home Screen builds.

### QA
JavaScript runtime simulations: eight passes covering fresh start, older forge save, speaking to Joren, turning in stolen supplies, petting the hound, eastern travel, cave entry, and quest-item retrieval. All tests rendered the zoomed camera and live actors without script exceptions. A physical iPhone graphics and touch playtest has not been independently completed.

### Outstanding work
- The cleaned images contain occasional reconstructed texture patches; long-term art needs true layered tiles/occlusion and consistent terrain geometry.
- Only complete idle/walk poses are enabled for the player; full directional attack, spell, and dodge animation atlases need to be authored without cropped frames.
- The standalone illustrated forge interior is temporarily inaccessible because the available exterior has no architecturally matching entrance. It can return when we build one that makes sense.
- Not yet the approved finished vertical slice.

---



## Hollowreach — live prototype v0.3.1 (navigation and interaction repair)

This release is the **gameplay repair pass** following the illustrated visual overhaul. It uses authored walkable-ground polygons for the four illustrated scenes rather than allowing free movement anywhere in the painted backgrounds. The same collision geometry is used for the player, dodges, and enemy movement.

### Fixed in v0.3.1
- Prevent walking on the forge workbench, snow-covered roofs, stone cliff edges, streams, and other painted non-floor areas.
- Make village blacksmith entry, forge exit, forest bridge travel, cave entry/exit and caravan supply pickup accessible with **Talk/E**, without surprise automatic teleports.
- Stop drawing duplicate NPC character sprites over NPCs already present in illustrated scenes; retain their live dialogues.
- Reposition unreachable quest/NPC/interaction anchors and wolves/wraiths onto valid ground.
- Migrate old saves that loaded inside walls or on tables to the nearest walkable ground without wiping progress.
- Add reliable art loading fallback, explicit versioned assets and refreshed offline cache.
- Debug navigation in-game with `?debugNav=1` appended to the site URL.

### Testing notes
Simulated mobile-canvas runtime checks passed for new/old saves, forge access, speaking with Joren, world transitions, and cave supply recovery. Programmatic route searches verify traversability of the first quests and all location exits at player collision radius. Actual physical iPhone playtesting and end-to-end user approval are still outstanding.

### Important visual limitation
The beautiful environment images are currently **illustrated scene plates**—not fully modular layered tilemaps. Actors and interactive markers are live over those plates, while some background figures are not animated. This repair prevents major walk-through and duplicated-actor problems but is not the fully finished Skyrim-scale RPG.

---



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
