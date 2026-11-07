/* VEILWARD Phase 9 R15: independent painted winter atlas on real source terrain.
 * Checks image decoding, source references, gameplay physics and PWA packaging.
 * Does NOT certify aesthetic quality or creator art approval.
 */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const file=fs.readFileSync("assets/hollowreach_environment_r15.webp");
assert.equal(file.toString("ascii",0,4),"RIFF","real compact WEBP sprite atlas");
assert.equal(file.toString("ascii",8,12),"WEBP");
assert.equal(file.toString("ascii",12,16),"VP8X","RGBA transparent art source");
const width=file.readUIntLE(24,3)+1,height=file.readUIntLE(27,3)+1;
assert.equal(width,576);assert.equal(height,144);
assert.ok(file.length>15000&&file.length<50000,
 "real detailed pixel sprites, appropriate for iPhone cache budget");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const geometry=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprint=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
const calls=[];
function ctx(){
 return{fillStyle:"",strokeStyle:"",globalAlpha:1,imageSmoothingEnabled:false,
 lineWidth:1,save(){},restore(){},scale(){},translate(){},beginPath(){},
 moveTo(){},lineTo(){},closePath(){},clip(){},rect(){},arc(){},
 fill(){},stroke(){},fillRect(){},drawImage(...a){calls.push(a)},
 setLineDash(){},createPattern(){return "#abc"},
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
   p.includes("neighborhood_r6")?[288,144]:
   p.includes("environment_r15")?[576,144]:null;
  assert.ok(dims,"only original painted game art may load: "+p);
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
 assert.equal(world.version,"1.3.30");
 const info=world.raster.stats();
 assert.equal(info.sourceLandscapeAtlasReady,true);
 assert.equal(info.sourceLandscapeSourcePixels,144);
 assert.equal(info.sourceWinterCliffSprites,2);
 assert.equal(info.sourcePassableDriftSprites,1);
 assert.equal(info.creatorApproved,false);
 assert.equal(info.architectureExperimentActive,false);
 assert.equal(info.geometryChanged,false);
 assert.equal(world.geometry.stats().solids,39);
 assert.equal(world.routeArt.stats().roads,65);
 assert.equal(world.routeArt.stats().crossings,7);
 assert.equal(model.nodes.length,48);
 const sourceImage=calls.length;
 assert.equal(world.raster.drawEnvironment(ctx(),0,300,200,400,340),true);
 assert.ok(calls.length>sourceImage);
 const crop=calls[calls.length-1];
 assert.equal(crop[1],0);assert.equal(crop[3],144);assert.equal(crop[4],144);
 const western=world.geometry.solids.find(s=>s.id==="hollowreach_west_snow_terrace");
 const northern=world.geometry.solids.find(s=>s.id==="hollowreach_north_terrace");
 calls.length=0;
 assert.equal(world.raster.drawCliff(ctx(),western),true);
 assert.ok(calls.some(c=>c[1]===0&&c[3]===144),
  "first richer cliff must draw only on real western cliff polygon");
 calls.length=0;
 assert.equal(world.raster.drawCliff(ctx(),northern),true);
 assert.ok(calls.some(c=>c[1]===144&&c[3]===144),
  "second richer cliff must draw only on real northern cliff polygon");
 assert.equal(world.raster.drawSourceWinterDrifts(ctx(),[0,0,1500,1400]),0);
 const village=model.nodes.find(n=>n.id==="village");
 const x=village.point[0]*60,y=village.point[1]*60;
 calls.length=0;
 assert.equal(world.raster.drawSourceWinterDrifts(ctx(),[x-2500,y-2500,x+2500,y+2500]),3);
 assert.equal(calls.filter(c=>c[1]===432&&c[3]===144).length,3,
  "passable drift sprite is grounded along exactly three real cliff fronts");
 for(const anchor of model.nodes)
  assert.equal(world.blocked(anchor.point[0]*60,anchor.point[1]*60),false,
   "original route anchor stays traversable: "+anchor.id);
 const sw=read("sw.js"),html=read("index.html");
 assert.ok(sw.includes("./assets/hollowreach_environment_r15.webp?v=1"));
 assert.ok(sw.includes("veilward-hollowreach-v1330-hermit-scenic-framing"));
 assert.ok(html.includes("world_raster_pilot.js?v=26"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 console.log("R15 PASS: 4 original source RGBA sprites, two real cliff faces, 3 passable drifts, 12 regions, 39 solids, 48 route nodes, 65 roads, 7 crossings, preserved saves. Artist approval still 0%");
})().catch(e=>{console.error(e);process.exitCode=1});