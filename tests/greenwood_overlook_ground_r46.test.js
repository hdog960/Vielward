/* Phase 9 R46 — overlook ground shading stays decorative and source-cleared. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const art=fs.readFileSync("world_greenwood_art.js","utf8");
const start=art.indexOf("function paintFallsOverlook(ctx,hub)");
const end=art.indexOf("function paintForestFloor(ctx,bounds)",start);
assert.ok(start>=0&&end>start,"actual overlook painter remains integrated");
const source=art.slice(start,end);
assert.ok(source.includes("R46: retire the final geometric arc"));
assert.ok(source.includes("const groundShoulders=["));
assert.equal((source.match(/shade:"rgba\(/g)||[]).length,4,
 "two differently composed material pockets on each side");
assert.ok(source.includes("for(const fx of [-.86,0,.86])"));
assert.ok(source.includes("for(const fy of [-.86,0,.86])"));
for(const guard of [
 'footprint.regionAt(sx,sy)?.id!=="greenwood_falls"',
 "geometry.waterAt(sx,sy,12)",
 "geometry.nearRoad(sx,sy,()=>true,36)",
 "geometry.obstacle(sx,sy,12)",
 "if(!clear)continue;"
])assert.ok(source.includes(guard),guard);
assert.ok(source.includes('pigment.addColorStop(1,"rgba(83,110,83,0)")'));
assert.ok(!source.includes("ctx.quadraticCurveTo(cx,cy-193,cx+105,cy-123)"),
 "no fake arc behind the original stairs");
assert.ok(source.includes("const talusGardens=["));
assert.ok(source.includes("ctx.drawImage(painted,PAINTED_SIZE*p.cell"));
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
assert.equal(model.nodes.length,48);
assert.equal(model.edges.length,65);
assert.equal(model.edges.filter(e=>e.crossing).length,7);
assert.ok(fs.readFileSync("game.js","utf8").includes('const SAVE="veilward-hollowreach-v01";'));
console.log("R46 PASS: nonphysical source-cleared woodland stone shoulder, original routes and saves");
