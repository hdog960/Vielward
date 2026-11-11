/* R35c: no rectangular river shelf overlays or unsupported cliffs. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs");
const read=f=>fs.readFileSync(f,"utf8");
const a=read("world_greenwood_art.js"),route=read("world_routes.js");
assert.ok(a.includes("nonGeometricBankBlendR35c:true"));
assert.ok(!a.includes('ctx.strokeStyle="rgba(43,77,58,.085)"'),
 "retired continuous contour stroke must not return");
assert.ok(a.includes("const pieces=["),
 "R42 source-native staggered stone/fern clusters must remain integrated");
assert.ok(a.includes("geometry.obstacle(xx,yy,8)"),
 "riverbank artwork must respect the real obstacle footprint");
assert.ok(a.includes("const stone=ctx.createRadialGradient(0,0,.05,0,0,1)"));
assert.ok(!a.includes("face.addColorStop("),"no heavy filled gorge face");
assert.ok(!a.includes("smooth(upper.slice().reverse(),false)"),
 "no self-intersecting broad bank fill");
assert.ok(a.includes("sourceFallsBanks()"));
assert.ok(a.includes("paintFallsRiverBanks(ctx,bounds);"));
assert.ok(route.includes("fallsStoneAscent(ctx,e,bounds);return"));
assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
assert.equal(model.nodes.length,48);assert.equal(model.edges.length,65);
assert.equal(model.waterways.length,3);
for(const p of ["sw.js","index.html"])
 assert.ok(read(p).includes(
 "world_greenwood_art.js?v=12&rev=34&falls=34b&landform=35&soft=35b&blend=35c"));
assert.ok(read("sw.js").includes("v1336-greenwood-escarpment-r35-r35b-r35c"));
assert.ok(read("scripts/visual_capture.mjs").includes(
 'capture(page,"GREENWOOD_R35C_NATIVE_SOURCE_SHORE")'));
console.log("R35c PASS: no boxy cliff faces, original source rocks and river, no physics/save change");
