/* VEILWARD Phase 9 R4 — playable neighborhood, not unrelated art stickers. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const code=fs.readFileSync("world_raster_pilot.js","utf8");
const art=fs.readFileSync("terrain_art.js","utf8");
assert.match(code,/drawVillageAtmosphere/);
assert.match(art,/raster\.drawVillageAtmosphere/);
assert.match(art,/raster\?\.covers\(s\.cx,s\.cy\)/,
 "Painter-authored firs must not be covered with geometric ovals");
const files=["world_geometry.js","world_climate.js","world_footprint.js",
 "world_routes.js","world_setpieces.js","world_raster_pilot.js","world_illustration.js",
 "terrain_art.js","world_stream.js"];
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const geometry=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const footprint=JSON.parse(fs.readFileSync("docs/overworld/outdoor_footprint.json","utf8"));
const ops={images:0,clips:0,glows:0};
const context=()=>({fillStyle:"",strokeStyle:"",lineWidth:1,globalAlpha:1,
 imageSmoothingEnabled:true,fillRect(){},drawImage(){ops.images++},
 beginPath(){},moveTo(){},lineTo(){},closePath(){},arc(){},stroke(){},fill(){},
 clip(){ops.clips++},save(){},restore(){},translate(){},scale(){},rect(){},
 setLineDash(){},fillText(){},strokeText(){},createPattern(){return "#aaa"},
 createRadialGradient(){ops.glows++;return{addColorStop(){}}}});
const canvas=()=>({width:0,height:0,getContext:context});
class ImageMock{
 constructor(){this.naturalWidth=0;this.naturalHeight=0}
 set src(p){const dims=p.includes("pilot_sprites")?[288,96]:
  p.includes("bridge_stairs_lamp")?[216,72]:p.includes("ground_painted")?[128,128]:p.includes("neighborhood_r6")?[288,144]:null;
  assert(dims,"unregistered art "+p);[this.naturalWidth,this.naturalHeight]=dims;
  this.onload?.()}
}
const host={Image:ImageMock,console};host.window=host;
for(const f of files)vm.runInNewContext(fs.readFileSync(f,"utf8"),host,{filename:f});
(async()=>{
 await host.VeilwardRasterPilot.load();
 const world=host.VeilwardWorldStream.create(model,{geometry,footprint,canvasFactory:canvas});
 assert.equal(world.version,"1.3.12");
 assert.equal(world.raster.version,"1.3.12");
 assert.equal(world.raster.stats().creatorApproved,false);
 assert.equal(world.routeArt.stats().roads,65);
 assert.equal(world.routeArt.stats().crossings,7);
 const v=model.nodes.find(n=>n.id==="village"),x=v.point[0]*60,y=v.point[1]*60;
 // A long source-defined winter cliff must be built from a composition of real
 // transparent raster artwork, clipped by its original impassable polygon.
 const syntheticCliff={material:"cliff-face",polygon:[[x-400,y-350],[x+400,y-350],
  [x+400,y-50],[x-400,y-50]]};
 const oldImages=ops.images,oldClips=ops.clips;
 assert.equal(world.raster.drawCliff(context(),syntheticCliff),true);
 assert.ok(ops.images-oldImages>=4,"Cliff requires several real painted stamps");
 assert.ok(ops.clips>oldClips,"Cliff art must follow source shape");
 // Lighting is sourced only from physical cottages/lanterns.
 const villageProps=world.setpieces.objects.filter(o=>world.raster.handlesSetpiece(o));
 assert.ok(villageProps.some(o=>o.kind==="snow_cottage"));
 const lights=world.raster.drawVillageAtmosphere(context(),[x-1800,y-1800,x+1800,y+1800],
  villageProps);
 assert.ok(lights>0&&ops.glows>0,"Grounded village ambient lighting present");
 const all=model.nodes.map(n=>world.blocked(n.point[0]*60,n.point[1]*60));
 assert.ok(all.every(v=>v===false),"All 48 outdoor anchors remain walkable");
 const sw=fs.readFileSync("sw.js","utf8"),html=fs.readFileSync("index.html","utf8");
 assert.ok(sw.includes("veilward-hollowreach-v1312-raster-neighborhood"));
 assert.ok(html.includes("world_raster_pilot.js?v=6"));
 assert.ok(html.includes("terrain_art.js?v=11"));
 console.log("R4 PASS: painted cliff composition, source lighting, true tree depth, roads and caches");
})().catch(e=>{console.error(e);process.exitCode=1});
