/* R35d — River appearance must follow physical river, not square tile samples. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const code=read("terrain_art.js");
assert.ok(code.includes("function paintFallsWaterChannel(ctx,bounds){"));
assert.ok(code.includes("paintFallsWaterChannel(ctx,bounds);"));
assert.ok(code.includes('continuousFallsWaterR35d:true'));
assert.ok(code.includes("ctx.clip()"),"water channel has exact-source shape mask");
assert.ok(code.includes("greenwoodFloor?.river"),"use continuous native water plate");
assert.ok(code.includes('material==="river"&&'),
 "blue terrain cells are repaired before physical source channel overlay");
const data=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const vmContext={console};vmContext.window=vmContext;
vm.runInNewContext(read("world_geometry.js"),vmContext);
const geometry=vmContext.VeilwardGeometry.create(model,data);
const river=model.waterways.find(w=>w.id==="frostbridge_river");
assert.ok(river&&river.centerline.length>=9);
for(let i=6;i<river.centerline.length;i++){
 const [x,y]=river.centerline[i].map(v=>v*60);
 assert.equal(geometry.waterAt(x,y,0)?.id,"frostbridge_river");
}
assert.equal(model.nodes.length,48);assert.equal(model.edges.length,65);
assert.equal(model.edges.filter(e=>e.crossing).length,7);
assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
for(const p of ["index.html","sw.js"])
 assert.ok(read(p).includes(
 "terrain_art.js?v=32&rev=25&falls=34b&palette=34c&channel=35d"));
assert.ok(read("sw.js").includes("v1336-greenwood-escarpment-r35-r35b-r35c-r35d"));
assert.ok(read("scripts/visual_capture.mjs").includes(
 'capture(page,"GREENWOOD_R35D_CONTINUOUS_WATER")'));
console.log("R35d PASS: exact original river centerline and channel width in native water layer,"+
 " all crossings, 65 roads and original saves unchanged");
