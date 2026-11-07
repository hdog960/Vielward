/* VEILWARD Phase 9 R10: a physical village retaining wall is also the
 * exact illustrated wall; an intentional gap stays walkable. Passing this
 * source test is NOT creator approval or a real-browser art inspection. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const source=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprint=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
const ids=["hollowreach_west_retaining_upper","hollowreach_west_retaining_lower"];
assert.equal(source.solids.length,39);
assert.equal(source.solids.filter(x=>x.material==="retaining-wall").length,2);
assert.equal(source.solids.filter(x=>x.material==="cliff-face").length,7);
assert.equal(model.nodes.length,48);assert.equal(model.edges.length,65);
let drawn=0,stroked=0;
const context=()=>({fillStyle:"",strokeStyle:"",globalAlpha:1,lineWidth:1,
 imageSmoothingEnabled:false,lineCap:"round",save(){},restore(){},translate(){},
 scale(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},arc(){},clip(){},
 fill(){},fillRect(){},stroke(){stroked++},drawImage(){drawn++},setLineDash(){},
 createPattern(){return "#aaa"},createRadialGradient(){return{addColorStop(){}}}
});
const canvas=()=>({width:0,height:0,getContext:context});
class ImageStub{
 constructor(){this.onload=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(p){
  const d=p.includes("pilot_sprites")?[288,96]:
   p.includes("bridge_stairs_lamp")?[216,72]:
   p.includes("ground_painted")?[128,128]:
   p.includes("neighborhood_r6")?[288,144]:null;
  assert.ok(d,"Only source-authored winter illustration atlas permitted: "+p);
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
  geometry:source,footprint,canvasFactory:canvas
 });
 assert.equal(world.version,"1.3.27");
 assert.equal(world.geometry.stats().solids,39);
 assert.equal(world.routeArt.stats().roads,65);
 assert.equal(world.routeArt.stats().crossings,7);
 const villageHouses=world.setpieces.objects.filter(o=>
  o.anchor==="village"&&o.kind==="snow_cottage");
 assert.equal(villageHouses.length,2,
  "both original collision-backed Hollowreach cottages must survive new retaining walls");
 const walls=ids.map(id=>world.geometry.solids.find(w=>w.id===id));
 assert.ok(walls.every(Boolean));
 for(const w of walls){
  assert.equal(w.material,"retaining-wall");assert.equal(w.shape,"segment");
  const midX=(w.a[0]+w.b[0])*.5,midY=(w.a[1]+w.b[1])*.5;
  assert.ok(world.blocked(midX,midY),"stonework must have honest physical collision");
  assert.equal(world.raster.handlesWinterSolid(w),true);
  const start=drawn;
  assert.equal(world.raster.drawRetainingWall(context(),w),true);
  assert.ok(drawn>=start+2,"stonework repeats genuine authored sprite cutouts");
  assert.equal(world.geometry.nearRoad(midX,midY,()=>true,w.radius+80),null,
   "wall must not narrow any authored roadway");
 }
 const village=model.nodes.find(n=>n.id==="village");
 const centerX=village.point[0]*60,centerY=village.point[1]*60;
 assert.equal(world.blocked(centerX-425,centerY),false,
  "intentional western lane opening remains safe for the Wanderer");
 assert.equal(world.raster.drawRetainingWallGround(context(),
  [centerX-1200,centerY-1100,centerX+1000,centerY+900]),2);
 const front=walls[0],fx=front.a[0],fy=(front.a[1]+front.b[1])*.5-40;
 const painted=drawn;
 assert.ok(world.raster.drawRetainingWallForeground(context(),{x:fx,y:fy})>0,
  "physical frontmost stonework can correctly occlude an actor behind it");
 assert.ok(drawn>painted);
 assert.equal(world.raster.drawRetainingWallForeground(context(),
  {x:fx,y:Math.max(...walls.map(w=>Math.max(w.a[1],w.b[1])))+180}),0,
  "when actor feet are in FRONT of both walls, neither wall hides them");
 assert.ok(read("terrain_art.js").includes("raster.drawRetainingWallForeground(ctx,player)"),
  "the playable scene calls the real foreground renderer");
 assert.ok(read("world_raster_pilot.js").includes("drawRetainingWall(ctx,s):drawStatic(ctx,s)"),
  "the existing source-foot Y-order renders the real stone collider");
 for(const n of model.nodes)
  assert.equal(world.blocked(n.point[0]*60,n.point[1]*60),false,
   "all 48 original world anchors remain reachable: "+n.id);
 assert.equal(world.raster.stats().retainingWallSegments,2);
 assert.equal(world.raster.stats().continuousRetainingFace,true);
 assert.equal(world.raster.stats().creatorApproved,false);
 assert.equal(world.raster.stats().geometryChanged,false);
 const html=read("index.html"),worker=read("sw.js"),game=read("game.js");
 assert.ok(worker.includes("veilward-hollowreach-v1327-feathered-woodland"));
 assert.ok(html.includes("world_raster_pilot.js?v=23"));
 assert.ok(game.includes('terrain_geometry.json?v=4'));
 assert.ok(game.includes('const SAVE="veilward-hollowreach-v01";'));
 console.log("R10 PASS: two physically painted village walls, clear western lane, roof/wall actor depth, original roads and saves");
})().catch(e=>{console.error(e);process.exitCode=1});
