/* Phase 9 R47: source-safe painted woodland apron composition. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const art=fs.readFileSync("world_greenwood_art.js","utf8");
const start=art.indexOf("function paintFallsOverlook(ctx,hub)");
const end=art.indexOf("function paintForestFloor(ctx,bounds)",start);
assert.ok(start>=0&&end>start,"real overlook painter exists");
const src=art.slice(start,end);
assert.ok(src.includes("const woodlandAprons=["));
const apron=src.slice(src.indexOf("const woodlandAprons=["));
assert.equal((apron.match(/\{ox:/g)||[]).length,2,"two independent apron banks");
assert.equal((apron.match(/\[[-\d]+,[-\d]+,\d+,\d+,[23],\.\d+\]/g)||[]).length,12,"twelve original painted crops");
for(const guard of ['footprint.regionAt(sx,sy)?.id!=="greenwood_falls"',
 'geometry.waterAt(sx,sy,12)',
 'geometry.nearRoad(sx,sy,()=>true,38)',
 'geometry.obstacle(sx,sy,12)',
 'if(!safe)continue;',
 'ctx.drawImage(painted,PAINTED_SIZE*cell'])assert.ok(apron.includes(guard),guard);
assert.ok(src.includes('hub?.kind!=="lookout"'));
assert.ok(!apron.includes("geometry.addObstacle"));
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
assert.equal(model.nodes.length,48);
assert.equal(model.edges.length,65);
assert.equal(model.edges.filter(e=>e.crossing).length,7);
console.log("R47 PASS: 12 source-checked painted apron fragments, 48 nodes, 65 routes, 7 crossings");
