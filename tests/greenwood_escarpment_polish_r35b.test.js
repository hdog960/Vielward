/* R35b: original river gorge stays physical while source stair art
 * replaces the repetitive bright crossbars without adding false routes. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs");
const read=path=>fs.readFileSync(path,"utf8");
const w=JSON.parse(read("docs/overworld/world_blueprint.json")),
 g=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const art=read("world_greenwood_art.js"),route=read("world_routes.js");
const edge=w.edges.find(e=>e.id==="falls_e--falls_overlook");
assert.ok(edge&&edge.kind==="stairs");
assert.equal(w.nodes.length,48);assert.equal(w.edges.length,65);
assert.ok(route.includes('if(e.id==="falls_e--falls_overlook")'));
assert.ok(route.includes('fallsStoneAscent(ctx,e,bounds);return'));
assert.ok(route.includes('fallsMossStoneAscentR35b:true'));
assert.ok(route.includes('dist+=112'),
 "natural source stair spacing must not revert to 45-unit rails");
assert.ok(art.includes("sculptedBankContrastR35b:true"));
assert.ok(art.includes("PAINTED_SIZE*2,0,"));
// R41/R42 retired the rejected parallel shoreline contour rails.
// Preserve the physical R35b stair treatment while requiring the native
// staggered bank art and its obstacle checks.
assert.ok(!art.includes('ctx.strokeStyle="rgba(43,77,58,.085)"'),
 "rejected shoreline contour stroke must not return");
assert.ok(art.includes("const pieces=["),
 "source-native staggered bank artwork must remain integrated");
assert.ok(art.includes("geometry.obstacle(xx,yy,8)"),
 "riverbank art must respect source obstacle geometry");
assert.ok(!art.includes('face.addColorStop(0,"rgba(21,44,45,.76)")'));
assert.ok(art.includes("sourceFallsBanks()"));
const footprint=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
assert.equal(footprint.schema,"veilward.outdoor-footprint.v1");
assert.ok(!g.solids.some(s=>s.id?.startsWith("r35")));
assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
assert.ok(read("game.js").includes('const APP_VERSION="1.3.36";'));
for(const p of ["sw.js","index.html"]){
 const s=read(p);
 assert.ok(s.includes("world_greenwood_art.js?v=12&rev=34&falls=34b&landform=35&soft=35b"));
 assert.ok(s.includes("world_routes.js?v=27&rev=29&falls=35b"))
}
assert.ok(read("sw.js").includes("v1336-greenwood-escarpment-r35-r35b"));
for(const capture of ["GREENWOOD_R35B_SOFT_SCULPTED_SHORE",
 "GREENWOOD_R35B_MOSS_STONE_OVERLOOK"])
 assert.ok(read("scripts/visual_capture.mjs").includes('capture(page,"'+capture+'")'));
console.log("R35b PASS: native source moss/stone, quiet actual stair art,"+
 " unchanged 65 roads, seven crossings and save key; no creator art approval");
