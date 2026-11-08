/* R31b: authentic illustrated forest edges have real source roots. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=f=>fs.readFileSync(f,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const host={console};host.window=host;
for(const f of ["world_geometry.js","world_climate.js","world_footprint.js"])
 vm.runInNewContext(read(f),host,{filename:f});
const geo=host.VeilwardGeometry.create(model,JSON.parse(read("docs/overworld/terrain_geometry.json")));
const climate=host.VeilwardClimate.create(model);
const f=host.VeilwardFootprint.create(model,geo,JSON.parse(read("docs/overworld/outdoor_footprint.json")),{climate});
const n=model.nodes.find(o=>o.id==="greenwood_hearth"),unit=60,cx=n.point[0]*unit,cy=n.point[1]*unit;
const roots=f.groves([cx-1250,cy-1100,cx+1250,cy+1100],650).filter(o=>o.authoredGrove);
const added=roots.filter(o=>Number(o.id.slice("hearth_root_".length))>=20);
assert.ok(added.length>=1,"a genuine new illustrated woodland-edge tree required");
assert.ok(roots.length<=10,"do not overfill the glade with repetitive trees");
for(const o of roots){
 assert.ok(f.blocked(o.x,o.y,4),"visible tree must have an honest boot collision root");
 assert.ok(!geo.waterAt(o.x,o.y,o.radius+15),"no trunks in rivers");
 assert.ok(!geo.obstacle(o.x,o.y,o.radius+30),"no root inside authored house");
 for(const road of geo.roads)for(const [a,b] of road.parts){
  const dx=b[0]-a[0],dy=b[1]-a[1],sq=dx*dx+dy*dy,
   t=sq?Math.max(0,Math.min(1,((o.x-a[0])*dx+(o.y-a[1])*dy)/sq)):0;
  assert.ok(Math.hypot(o.x-a[0]-dx*t,o.y-a[1]-dy*t)>road.halfWidth+o.radius+35,
   "original physical 65-road corridor remains open");
 }
 const x=o.x-cx,y=o.y-cy,scale=o.kind==="oak"?1.20:1.08,
  width=o.radius*(o.kind==="oak"?5.4:4.6)*scale,
  height=o.radius*(o.kind==="oak"?7:7.6)*scale;
 assert.ok(!(y>=-25&&Math.abs(x)<width/2+38&&y-height<46),
  "original hero cannot appear on top of a broad canopy");
}
assert.equal(f.blocked(cx,cy,10),false);
assert.equal(geo.roads.length,65);
assert.ok(read("index.html").includes("world_footprint.js?v=5&rev=31c"));
assert.ok(read("sw.js").includes("world_footprint.js?v=5&rev=31c"));
assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
console.log("R31b PASS: "+added.length+" actual source-rooted woodland edge trees, "+roots.length+" total curated and all roads/actor/saves protected");
