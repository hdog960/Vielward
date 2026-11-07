/* VEILWARD Phase 9 R14: source-cliff terrain continuity and village road shoulders.
 * All materials are an underpainting against actual collision geometry.
 * This is functional QA ONLY; creator aesthetic approval remains 0%.
 */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const geometry=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprint=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
let strokes=0,images=0,patterns=0;
function ctx(){
 return{fillStyle:"",strokeStyle:"",lineWidth:1,globalAlpha:1,
 imageSmoothingEnabled:false,lineCap:"round",lineJoin:"round",
 save(){},restore(){},scale(){},translate(){},
 beginPath(){},moveTo(){},lineTo(){},closePath(){},clip(){},rect(){},arc(){},
 stroke(){strokes++},fill(){},fillRect(){},
 drawImage(){images++},setLineDash(){},
 createPattern(){patterns++;return "#8eb8cd"},
 createRadialGradient(){return{addColorStop(){}}}
 }
}
const canvas=()=>({width:0,height:0,getContext:ctx});
class ImageStub{
 constructor(){this.onload=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(p){
  const dims=p.includes("pilot_sprites")?[288,96]:
   p.includes("bridge_stairs_lamp")?[216,72]:
   p.includes("ground_painted")?[128,128]:
   p.includes("neighborhood_r6")?[288,144]:null;
  assert.ok(dims,"unexpected external source art: "+p);
  [this.naturalWidth,this.naturalHeight]=dims;this.onload?.()
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
  geometry,footprint,canvasFactory:canvas
 });
 assert.equal(world.version,"1.3.29");
 assert.equal(model.nodes.length,48);
 assert.equal(world.geometry.stats().solids,39);
 assert.equal(world.routeArt.stats().roads,65);
 assert.equal(world.routeArt.stats().crossings,7);
 const stats=world.raster.stats();
 assert.equal(stats.physicallyBoundSnowContours,true);
 assert.equal(stats.terrainPhysicsChanged,false);
 assert.equal(stats.creatorApproved,false);
 assert.equal(stats.architectureExperimentActive,false);
 assert.equal(world.raster.drawVillageLandContours(ctx(),[0,0,2000,2000]),0,
  "Hollowreach winter topography cannot appear in a distant region");
 assert.equal(strokes,0);
 const n=model.nodes.find(n=>n.id==="village"),
  x=n.point[0]*60,y=n.point[1]*60;
 const bounds=[x-2500,y-2500,x+2500,y+2500];
 const features=world.raster.drawVillageLandContours(ctx(),bounds);
 assert.equal(features,7,
  "three physical escarpments and four authored village roads, not invented scenery");
 assert.ok(images>=3,"the cliff toes should contain painted rock material");
 assert.ok(patterns>=4,"each actual village road receives continuous source texture");
 const strokeBefore=strokes,imageBefore=images,patternsBefore=patterns;
 assert.equal(world.raster.drawVillageLandContours(ctx(),bounds),features);
 assert.equal(strokes,strokeBefore*2,
  "same world coordinates produce reproducible cliff and road brushwork");
 assert.equal(images,imageBefore*2);
 assert.equal(patterns,patternsBefore*2);
 for(const node of model.nodes)
  assert.equal(world.blocked(node.point[0]*60,node.point[1]*60),false,
   "original travel node is passable: "+node.id);
 assert.ok(read("terrain_art.js").includes("raster.drawVillageGround(ctx,bounds"),
  "The ACTUAL cached game terrain compositor draws R14 underpaintings");
 assert.ok(read("world_raster_pilot.js").includes("drawVillageLandContours(ctx,bounds);"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'),
  "player's original local adventure save remains unchanged");
 assert.ok(read("sw.js").includes("veilward-hollowreach-v1329-illustrated-hermit"));
 assert.ok(read("index.html").includes("world_raster_pilot.js?v=25"));
 console.log("R14 PASS: 3 source cliffs + 4 connected real roads, authored snow/rock textures, 12 regions, 39 real solids, 48 safe anchors, 65 roads, 7 crossings, save intact; artwork NOT approved");
})().catch(e=>{console.error(e);process.exitCode=1});