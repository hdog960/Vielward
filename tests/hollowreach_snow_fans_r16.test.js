/* Vielward Phase 9 R16: source-cliff-bound snow deposition, not new
 * physics, routes, buildings or visual acceptance. */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const geometry=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprint=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
let patterns=0,clips=0,strokes=0,rects=0;
function ctx(){return {lineWidth:1,globalAlpha:1,save(){},restore(){},
 translate(){},scale(){},beginPath(){},moveTo(){},lineTo(){},
 closePath(){},clip(){clips++},fill(){},fillRect(){rects++},
 drawImage(){},stroke(){strokes++},arc(){},setLineDash(){},
 createPattern(){patterns++;return "#aabbcc"},
 createRadialGradient(){return {addColorStop(){}}}
}}
class ImageStub{
 constructor(){this.onload=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(p){
  const size=p.includes("pilot_sprites")?[288,96]:
   p.includes("bridge_stairs_lamp")?[216,72]:
   p.includes("ground_painted")?[128,128]:
   p.includes("neighborhood_r6")?[288,144]:
   p.includes("environment_r15")?[576,144]:null;
  assert.ok(size,"Only original raster assets may load "+p);
  [this.naturalWidth,this.naturalHeight]=size;this.onload?.()
 }
}
const host={Image:ImageStub,console};host.window=host;
for(const f of ["world_geometry.js","world_climate.js","world_footprint.js",
 "world_routes.js","world_setpieces.js","world_raster_pilot.js",
 "world_illustration.js","terrain_art.js","world_stream.js"])
 vm.runInNewContext(read(f),host,{filename:f});
(async()=>{
 await host.VeilwardRasterPilot.load();
 const world=host.VeilwardWorldStream.create(model,{geometry,footprint,
  canvasFactory:()=>({width:0,height:0,getContext:ctx})});
 assert.equal(world.version,"1.3.29");
 assert.equal(model.nodes.length,48);
 assert.equal(world.geometry.stats().solids,39);
 assert.equal(world.routeArt.stats().roads,65);
 assert.equal(world.routeArt.stats().crossings,7);
 const stats=world.raster.stats();
 assert.equal(stats.sourceLinkedSnowFans,true);
 assert.equal(stats.distantSnowRenderRadius,2650);
 assert.equal(stats.creatorApproved,false);
 assert.equal(stats.geometryChanged,false);
 assert.equal(stats.architectureExperimentActive,false);
 // World constructor may prepaint cached chunks; isolate this renderer test
 // from unrelated background drawing that occurs at creation time.
 patterns=clips=strokes=rects=0;
 assert.equal(world.raster.drawSourceSnowFans(ctx(),[0,0,1500,1400]),0);
 assert.equal(rects,0);
 const node=model.nodes.find(n=>n.id==="village");
 const x=node.point[0]*60,y=node.point[1]*60;
 const bounds=[x-2700,y-2700,x+2700,y+2700];
 assert.equal(world.raster.drawSourceSnowFans(ctx(),bounds),3,
  "three actual north/west escarpments, not invented landscape blockers");
 assert.equal(clips,3,"each real rock footprint feathers into its own source snow fan");
 assert.equal(patterns,3,"each snow fan uses native authored snow source");
 assert.ok(strokes>=3&&rects>=6,"real cliff toes have painted shadow and powder");
 const old=[clips,patterns,strokes,rects];
 assert.equal(world.raster.drawSourceSnowFans(ctx(),bounds),3);
 assert.deepEqual([clips,patterns,strokes,rects],
  old.map(n=>n*2),"deterministic world-space snow painting");
 assert.ok(read("world_raster_pilot.js").includes("drawSourceSnowFans(ctx,bounds);"));
 assert.ok(read("terrain_art.js").includes("raster.drawVillageGround(ctx,bounds"));
 assert.ok(read("sw.js").includes("veilward-hollowreach-v1329-illustrated-hermit"));
 assert.ok(read("index.html").includes("world_raster_pilot.js?v=25"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 for(const anchor of model.nodes)
  assert.equal(world.blocked(anchor.point[0]*60,anchor.point[1]*60),false,
   "all original route nodes remain walkable: "+anchor.id);
 console.log("R16 PASS: three cliff source fans, existing snowy atlas, no new collision, 39 solids, 48 safe nodes, 65 roads, seven crossings, save key intact; art still unapproved");
})().catch(e=>{console.error(e);process.exitCode=1});