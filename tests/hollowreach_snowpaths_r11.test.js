/* VEILWARD Phase 9 R11: actual connected winter boot tracks follow only
 * source-defined walkable village roads, across streamed chunk boundaries.
 * No invented travel links, colliders, actor footprints or artist signoff. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const geo=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprint=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
const made=[];
function fakeCtx(){
 let line=[];
 return{fillStyle:"",strokeStyle:"",lineWidth:1,globalAlpha:1,
 imageSmoothingEnabled:false,save(){},restore(){},scale(){},translate(){},
 beginPath(){line=[]},moveTo(x,y){line.push([x,y])},
 lineTo(x,y){line.push([x,y])},closePath(){},
 fill(){made.push(line.map(p=>[...p]))},stroke(){},
 fillRect(){},drawImage(){},arc(){},clip(){},rect(){},setLineDash(){},
 createPattern(){return "#aac"},createRadialGradient(){return{addColorStop(){}}}
 }
}
const canvas=()=>({width:0,height:0,getContext:fakeCtx});
class ImageStub{
 constructor(){this.onload=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(p){
  const d=p.includes("pilot_sprites")?[288,96]:
   p.includes("bridge_stairs_lamp")?[216,72]:
   p.includes("ground_painted")?[128,128]:
   p.includes("neighborhood_r6")?[288,144]:null;
  assert.ok(d,"only source-authored illustrated atlases may load");
  [this.naturalWidth,this.naturalHeight]=d;this.onload?.()
 }
}
const sandbox={Image:ImageStub,console};sandbox.window=sandbox;
for(const p of ["world_geometry.js","world_climate.js","world_footprint.js",
 "world_routes.js","world_setpieces.js","world_raster_pilot.js",
 "world_illustration.js","terrain_art.js","world_stream.js"])
 vm.runInNewContext(read(p),sandbox,{filename:p});
(async()=>{
 await sandbox.VeilwardRasterPilot.load();
 const world=sandbox.VeilwardWorldStream.create(model,{
  geometry:geo,footprint,canvasFactory:canvas
 });
 assert.equal(world.version,"1.3.32");
 assert.equal(world.geometry.stats().solids,39);
 assert.equal(world.routeArt.stats().roads,65);
 assert.equal(world.routeArt.stats().crossings,7);
 assert.equal(model.nodes.length,48);
 const n=model.nodes.find(x=>x.id==="village"),
  x=n.point[0]*60,y=n.point[1]*60;
 assert.equal(world.raster.drawWinterFootpaths(fakeCtx(),
  [100,100,800,800]),0,"far away zones have no invented impressions");
 const bounds=[x-1800,y-1800,x+1900,y+1900];
 made.length=0;
 const painted=world.raster.drawWinterFootpaths(fakeCtx(),bounds);
 assert.ok(painted>=20,"village source streets should tell a visible travel story");
 assert.equal(made.length,painted,
  "each individual actual compressed boot imprint has one complete mask");
 const samples=made.map(points=>{
  assert.ok(points.length>=4,"paired heel/toe imprint needs an irregular outline");
  const sx=points.reduce((a,p)=>a+p[0],0)/points.length,
   sy=points.reduce((a,p)=>a+p[1],0)/points.length;
  assert.ok(!world.geometry.waterAt(sx,sy,0),
   "no snow boots should appear on open water");
  assert.ok(!world.geometry.obstacle(sx,sy,0),
   "no snow boots should be buried in the source house/rock collision");
  assert.ok(world.geometry.nearRoad(sx,sy,()=>true),
   "every visual imprint remains on a real authorized road");
  return points.map(p=>p.map(v=>Math.round(v*100)/100))
 });
 made.length=0;
 assert.equal(world.raster.drawWinterFootpaths(fakeCtx(),bounds),painted);
 const repeat=made.map(points=>points.map(p=>p.map(v=>Math.round(v*100)/100)));
 assert.deepEqual(samples,repeat,"same world chunk always paints identical boots");
 assert.equal(world.raster.stats().inhabitedSnowRoadImpressions,true);
 assert.equal(world.raster.stats().sourceBoundWinterFootpaths,true);
 assert.equal(world.raster.stats().geometryChanged,false);
 assert.equal(world.raster.stats().creatorApproved,false);
 assert.ok(read("terrain_art.js").includes("raster.drawWinterFootpaths(ctx,bounds)"),
  "REAL chunk renderer must paint impressions after the existing roads");
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 assert.ok(read("sw.js").includes("veilward-hollowreach-v1334-source-tree-depth-r33"));
 assert.ok(read("index.html").includes("world_raster_pilot.js?v=28"));
 for(const anchor of model.nodes)
  assert.equal(world.blocked(anchor.point[0]*60,anchor.point[1]*60),false,
   "all original travel anchor boots remain open: "+anchor.id);
 console.log("R11 PASS: "+painted+" deterministic source-road boot marks, no impossible paths, 48 nodes, 65 roads, 7 crossings, saves intact");
})().catch(e=>{console.error(e);process.exitCode=1});
