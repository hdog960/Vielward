/* VEILWARD Phase 9 R12 — physically anchored winter illustration QA.
 * Does not imply creator approval of the appearance. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const geo=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprint=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
let strokes=0,stamps=0;
function fakeCtx(){
 return{fillStyle:"",strokeStyle:"",lineWidth:1,globalAlpha:1,
 imageSmoothingEnabled:false,save(){},restore(){},scale(){},translate(){},
 beginPath(){},moveTo(){},lineTo(){},closePath(){},stroke(){strokes++},
 fill(){},fillRect(){},drawImage(){stamps++},arc(){},clip(){},rect(){},
 setLineDash(){},createPattern(){return "#b8ccda"},
 createRadialGradient(){return{addColorStop(){}}}
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
  assert.ok(d,"R12 must reuse the original independent painted atlases");
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
 const stats=world.raster.stats();
 assert.equal(stats.sourceRootedLandscape,true);
 assert.equal(stats.paintedStoneFlagstones,true);
 assert.equal(stats.crispRasterSprites,true);
 assert.equal(stats.creatorApproved,false);
 assert.equal(stats.geometryChanged,false);
 const n=model.nodes.find(n=>n.id==="village"),x=n.point[0]*60,y=n.point[1]*60;
 const ctx=fakeCtx();
 assert.equal(world.raster.drawVillageTerrainSpine(ctx,[0,0,1400,1400]),0,
  "winter escarpment must not appear in other regions");
 assert.equal(strokes,0);
 const bounds=[x-1700,y-1700,x+1000,y+1500];
 assert.equal(world.raster.drawVillageTerrainSpine(ctx,bounds),6,
  "all terrain knots come from two existing cliffs and four original grove roots");
 const first=strokes;
 assert.ok(first>=5,"one connected source-textured slope has multiple integrated depth bands");
 assert.equal(world.raster.drawVillageTerrainSpine(ctx,bounds),6);
 assert.equal(strokes-first,first,"same source geometry yields identical draw instructions");
 for(const node of model.nodes)
  assert.equal(world.blocked(node.point[0]*60,node.point[1]*60),false,
   "original travel anchor stays open: "+node.id);
 assert.ok(read("world_raster_pilot.js").includes("drawVillageTerrainSpine(ctx,bounds);"));
 assert.ok(read("world_raster_pilot.js").includes("ctx.drawImage(ground,(Math.abs(key)%4)*32,64"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 assert.ok(read("sw.js").includes("veilward-hollowreach-v1332-source-glade-habitat"));
 assert.ok(read("index.html").includes("world_raster_pilot.js?v=28"));
 console.log("R12 PASS: continuous cliff-to-grove snow terrain, painted stone, sharp raster, 39 solids, 48 nodes, 65 routes, 7 crossings, save protected");
})().catch(e=>{console.error(e);process.exitCode=1});
