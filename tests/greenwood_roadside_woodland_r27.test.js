/* R27: source-backed closer Greenwood trees must stay physically true.
 * Technical / synthetic render checks are not artist or iPhone approval. */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const terrain=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const data=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
const beforeNodes=JSON.stringify(model.nodes),beforeRoads=JSON.stringify(model.edges);
const env={console,Math};env.window=env;
for(const path of ["world_geometry.js","world_climate.js","world_footprint.js","world_setpieces.js"])
 vm.runInNewContext(read(path),env,{filename:path});
const geo=env.VeilwardGeometry.create(model,terrain),
 climate=env.VeilwardClimate.create(model),
 foot=env.VeilwardFootprint.create(model,geo,data,{climate}),
 scene=env.VeilwardSetpieces.create(model,geo,{footprint:foot,climate});
const hearth=model.nodes.find(n=>n.id==="greenwood_hearth"),unit=60,
 cx=hearth.point[0]*unit,cy=hearth.point[1]*unit;
const b=[cx-1250,cy-1150,cx+1250,cy+1150];
const trees=[...foot.cells(b,450),...foot.groves(b,450)]
 .filter(o=>["oak","pine"].includes(o.kind)&&foot.regionAt(o.x,o.y)?.id==="greenwood");
let roadside=0;
for(const o of trees){
 assert.ok(foot.blocked(o.x,o.y,4),"painted tree always has genuine physical root");
 assert.ok(!geo.waterAt(o.x,o.y,o.radius+12),"tree never anchored in water");
 assert.ok(!geo.nearRoad(o.x,o.y,()=>true,o.radius+24),
  "physical road clear past the whole tree root");
 if(geo.nearRoad(o.x,o.y,()=>true,o.radius+105))roadside++;
}
assert.ok(trees.length>=4,"several rooted Greenwood trees needed near the crossroads");
assert.ok(roadside>=1,"at least one source tree frames a real road shoulder");
const cottage=scene.objects.filter(o=>o.anchor==="greenwood_hearth"&&o.kind==="forest_cottage");
assert.equal(cottage.length,1,"original source-painted cottage must remain in the world");
for(const o of scene.objects.filter(o=>o.anchor==="greenwood_hearth"))
 assert.equal(foot.blocked(o.x,o.y,10),false,"original setpiece location unobstructed "+o.id);
for(const anchor of ["greenwood_hearth","hermit"]){
 const n=model.nodes.find(n=>n.id===anchor);
 assert.equal(foot.blocked(n.point[0]*unit,n.point[1]*unit,10),false,
  "original waypoint walkable "+anchor);
}
let samples=0;
for(const road of geo.roads.filter(e=>
 ["greenwood_hearth","hermit"].includes(e.from)||
 ["greenwood_hearth","hermit"].includes(e.to)))
 for(const [a,c,,len] of road.parts)
  for(let k=0;k<=len;k+=32){
   const t=k/len;
   assert.equal(foot.blocked(a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t,10),
    false,"source roadway must remain open "+road.id);
   samples++;
  }
assert.ok(samples>20);
assert.equal(JSON.stringify(model.nodes),beforeNodes);
assert.equal(JSON.stringify(model.edges),beforeRoads);
assert.ok(read("index.html").includes("world_footprint.js?v=5&rev=31c"));
assert.ok(read("sw.js").includes("world_footprint.js?v=5&rev=31c"));
assert.ok(read("sw.js").includes("source-tree-depth-r33-r26-r27-r28d"));
assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
console.log("R27 PASS: "+trees.length+" real Greenwood roots, "+
 roadside+" on protected road shoulders, "+samples+
 " route checks, cottage and save safe; visual approval still 0%");
