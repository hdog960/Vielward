/* R36b — original R18 lookout rock art is grounded; no four long
 * horizontal stretched fern stripes or duplicate fake square pillars. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs");
const r=p=>fs.readFileSync(p,"utf8");
const a=r("world_greenwood_art.js"),foot=r("world_footprint.js"),ill=r("world_illustration.js");
assert.ok(a.includes("fallsLookoutReducedStripesR36b:true"));
assert.ok(a.includes("const banks=["));
// R43 replaces the old single stretched shelves with independent source
// stone and fern crops. Verify the real current composition, not deleted
// R36b scalar variable names or its retired vector shelf silhouette.
assert.ok(a.includes("{dx:-286,dy:-150,scale:1.13,flip:false"));
assert.ok(a.includes("{dx:262,dy:-184,scale:.88,flip:true"));
assert.ok(a.includes("{dx:0,dy:-12,w:194,h:171,cell:3"));
assert.ok(a.includes("w:109,h:102,cell:2"));
assert.ok(a.includes("if(j===1||j===3)"));
assert.ok(a.includes("geometry.nearRoad(sx,sy,()=>true,24)"));
assert.ok(a.includes("geometry.waterAt(sx,sy,10)"));
assert.ok(!a.includes("stoneW=194*s.scale,stoneH=171*s.scale"));
assert.ok(!a.includes("mossW=290*s.scale,mossH=107*s.scale"));
assert.ok(a.includes("ctx.drawImage(painted,unit*3,0,unit,unit"));
assert.ok(a.includes("ctx.drawImage(painted,unit*2,0,unit,unit"));
assert.ok(!foot.includes('if(h.kind==="watchtower"||h.kind==="lookout")'));
assert.ok(!ill.includes('kind==="watchtower"||kind==="lookout"'));
const model=JSON.parse(r("docs/overworld/world_blueprint.json"));
assert.equal(model.nodes.length,48);assert.equal(model.edges.length,65);
assert.equal(model.edges.filter(e=>e.crossing).length,7);
assert.ok(r("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
for(const p of ["index.html","sw.js"]){
 const s=r(p);
 assert.ok(s.includes("world_greenwood_art.js?v=12&rev=34&falls=34b&landform=35&soft=35b&blend=35c&overlook=36&shape=36b"))
}
assert.ok(r("sw.js").includes("v1336-greenwood-escarpment-r35-r35b-r35c-r35d-r36-overlook-r36b"));
assert.ok(r("scripts/visual_capture.mjs").includes(
 'capture(page,"GREENWOOD_R36B_SCULPTED_OVERLOOK")'));
console.log("R36b PASS: site-composed asymmetric original native-pixel stone and fern banks, not stripe clones; source routes and saves unchanged");
