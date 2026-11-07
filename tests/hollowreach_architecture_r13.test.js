/* Phase 9 R13: authored winter architecture actually used by the world.
 * Tests structure and physics, NOT aesthetic acceptance. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const terrain=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprint=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
let operations=0,draws=[];
function ctx(){
 return{fillStyle:"",strokeStyle:"",lineWidth:1,globalAlpha:1,imageSmoothingEnabled:false,
 save(){},restore(){},translate(){},scale(){},clearRect(){},beginPath(){},moveTo(){},
 lineTo(){},closePath(){},clip(){},rect(){},setLineDash(){},fill(){operations++},
 fillRect(){operations++},stroke(){operations++},
 drawImage(...args){draws.push(args)},
 createPattern(){return "#aaa"},createRadialGradient(){return{addColorStop(){}}}
 }
}
function canvas(){return{width:0,height:0,getContext:ctx}}
class ImageStub{
 constructor(){this.onload=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(p){
  const wh=p.includes("pilot_sprites")?[288,96]:
   p.includes("bridge_stairs_lamp")?[216,72]:
   p.includes("ground_painted")?[128,128]:
   p.includes("neighborhood_r6")?[288,144]:null;
  assert.ok(wh,"No new unknown or external art images");
  [this.naturalWidth,this.naturalHeight]=wh;this.onload?.()
 }
}
const host={Image:ImageStub,document:{createElement:canvas},console};host.window=host;
for(const p of ["world_geometry.js","world_climate.js","world_footprint.js",
 "world_routes.js","world_setpieces.js","world_architecture_atlas.js",
 "world_raster_pilot.js","world_illustration.js","terrain_art.js","world_stream.js"])
 vm.runInNewContext(read(p),host,{filename:p});
(async()=>{
 const atlas=host.VeilwardArchitectureAtlas;
 assert.equal(atlas.version,"1.3.19");
 assert.equal(atlas.sourceSize,256);
 assert.equal(atlas.count,4);
 assert.equal(atlas.ready,false);
 assert.ok(atlas.load(),"Four cottage variants must rasterize");
 assert.equal(atlas.ready,true);
 assert.ok(operations>2000,"High-detail pixel source authoring is more than four flat shapes");
 let first=[];draws.length=0;
 for(let i=0;i<4;i++){
  assert.equal(atlas.stamp(ctx(),i,100,200,330,300),true);
  first.push(draws[draws.length-1][1])
 }
 assert.deepEqual(first,[0,256,512,768],"Four distinct full-resolution source art cells");
 await host.VeilwardRasterPilot.load();
 const world=host.VeilwardWorldStream.create(model,{
  geometry:terrain,footprint,canvasFactory:canvas
 });
 assert.equal(world.version,"1.3.31");
 assert.equal(world.geometry.stats().solids,39);
 assert.equal(model.nodes.length,48);
 assert.equal(world.routeArt.stats().roads,65);
 assert.equal(world.routeArt.stats().crossings,7);
 assert.equal(world.raster.stats().architectureRasterReady,true);
 assert.equal(world.raster.stats().architectureExperimentActive,false,
  "The user's original painted cottage art must be the live default");
 assert.equal(world.raster.stats().sourceCottageVariants,4);
 assert.equal(world.raster.stats().sourceCottagePixels,256);
 const homes=world.setpieces.objects.filter(o=>
  o.kind==="snow_cottage"&&o.anchor==="village");
 assert.equal(homes.length,2,"Original physical village houses preserved");
 draws.length=0;
 const n=model.nodes.find(n=>n.id==="village"),x=n.point[0]*60,y=n.point[1]*60;
 assert.equal(world.raster.drawSetpieces(ctx(),[x-1000,y-1000,x+1000,y+1000],homes),2);
 const legacyDraws=draws.filter(d=>d[3]===96&&d[4]===96);
 assert.ok(legacyDraws.length>=2,
  "Unapproved geometric architecture must NOT replace painterly original homes");
 // The original authored architecture source is preserved only for isolated
 // future art refinement, never shown to ordinary creator playtests.
 const dev=host.VeilwardWorldStream.create(model,{
  geometry:terrain,footprint,canvasFactory:canvas,experimentalArchitecture:true
 });
 assert.equal(dev.raster.stats().architectureExperimentActive,true);
 draws.length=0;
 assert.equal(dev.raster.drawSetpieces(ctx(),[x-1000,y-1000,x+1000,y+1000],
  dev.setpieces.objects.filter(o=>o.kind==="snow_cottage"&&o.anchor==="village")),2);
 const sourceDraws=draws.filter(d=>d[3]===256&&d[4]===256);
 assert.ok(sourceDraws.length>=2,
  "Unapproved 256px experimental art is still accessible in isolated R13 QA");
 for(const node of model.nodes)
  assert.equal(world.blocked(node.point[0]*60,node.point[1]*60),false,
   "All original travel waypoints remain passable");
 const html=read("index.html"),sw=read("sw.js");
 assert.ok(html.indexOf("world_architecture_atlas.js?v=1")<
  html.indexOf("world_raster_pilot.js?v=27"),"Raster art source loads before world compositor");
 assert.ok(sw.includes('"./world_architecture_atlas.js?v=1"'));
 assert.ok(sw.includes("veilward-hollowreach-v1331-second-forest-cottage"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 assert.equal(world.raster.stats().creatorApproved,false);
 console.log("R13 PASS: protected painterly original default; four 256px variants remain experimental only; 39 obstacles, 48 anchors, 65 roads, 7 crossings, original saves");
})().catch(e=>{console.error(e);process.exitCode=1});