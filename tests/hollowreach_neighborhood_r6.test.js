/* VEILWARD Phase 9 / R6. Actual new pixel-art asset must be in the walkable
 * world renderer, not a reference image, CSS decoration, or concept preview.
 */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const buffer=fs.readFileSync("assets/hollowreach_neighborhood_r6.png");
assert.equal(buffer.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
assert.equal(buffer.readUInt32BE(16),288,"four 72px sprite columns");
assert.equal(buffer.readUInt32BE(20),144,"two 72px sprite rows");
assert.ok(buffer.includes(Buffer.from("tRNS"))||buffer[25]===6,
 "Transparent authored pixel cutouts, not white-backed JPEG stickers");
assert.ok(buffer.length>7500&&buffer.length<90000);
const files=["world_geometry.js","world_climate.js","world_footprint.js","world_routes.js",
 "world_setpieces.js","world_raster_pilot.js","world_illustration.js","terrain_art.js","world_stream.js"];
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const geo=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const footprint=JSON.parse(fs.readFileSync("docs/overworld/outdoor_footprint.json","utf8"));
const drawings=[],ctx=()=>({globalAlpha:1,fillStyle:"",strokeStyle:"",lineWidth:1,imageSmoothingEnabled:false,
 beginPath(){},moveTo(){},lineTo(){},closePath(){},arc(){},clip(){},stroke(){},
 fill(){},fillRect(){},save(){},restore(){},scale(){},translate(){},rect(){},
 drawImage(...args){drawings.push(args)},createPattern(){return "#cbd9e1"},
 setLineDash(){},fillText(){},strokeText(){}});
const canvas=()=>({width:0,height:0,getContext:ctx});
class Img{
 constructor(){this.naturalWidth=0;this.naturalHeight=0;this.onload=null}
 set src(path){this.source=path;
  const d=path.includes("pilot_sprites_v1")?[288,96]:
   path.includes("bridge_stairs_lamp_v2")?[216,72]:
   path.includes("ground_painted_v2")?[128,128]:
   path.includes("neighborhood_r6")?[288,144]:null;
  assert.ok(d,"unexpected art asset "+path);
  [this.naturalWidth,this.naturalHeight]=d;
  this.onload?.()
 }
}
const host={Image:Img,console:{warn(){},error(){},log(){}}};host.window=host;
for(const file of files)vm.runInNewContext(fs.readFileSync(file,"utf8"),host,{filename:file});
(async()=>{
 const ras=host.VeilwardRasterPilot;
 assert.equal(ras.ready,false);
 await ras.load();
 assert.ok(ras.ready,"both object atlases, bridge sprites and terrain atlas loaded");
 const game=host.VeilwardWorldStream.create(model,{geometry:geo,footprint,canvasFactory:canvas});
 const summary=game.raster.stats();
 assert.equal(game.version,"1.3.15");
 assert.equal(summary.creatorApproved,false);
 assert.equal(summary.artworkCells,30,"3 original + 3 structures + 16 ground + 8 new");
 assert.equal(summary.neighborhoodSprites,8);
 assert.equal(summary.neighborhoodAtlasReady,true);
 assert.equal(summary.geometryChanged,false);
 assert.equal(summary.fullBackgroundPasted,false);
 assert.equal(summary.winterDepthSorted,true,"winter scene must use source-foot depth composition");
 assert.equal(summary.physicalRoadWeathering,true,"snowy lanes must stay on physical travel graph");
 const a=model.nodes.find(n=>n.id==="village"),[x,y]=a.point.map(v=>v*60);
 for(const [kind,r] of [["pine",55],["boulder",48],["scrub",26]]){
  drawings.length=0;
  assert.equal(game.raster.drawFeature(ctx(),{kind,x,y,radius:r,id:"test-"+kind,variant:.22}),true);
  assert.ok(drawings.some(d=>d[0]?.source?.includes("neighborhood_r6")),
   kind+" must draw physical new in-game sprite pixels")
 }
 const cottage=game.setpieces.objects.find(o=>o.anchor==="village"&&o.kind==="snow_cottage");
 assert.ok(cottage,"actual authored cottage source anchor exists");
 drawings.length=0;game.raster.drawSetpieces(ctx(),[cottage.x-500,cottage.y-500,cottage.x+500,cottage.y+500],[cottage]);
 assert.ok(drawings.some(d=>d[0]?.source?.includes("neighborhood_r6")),
  "cottage forecourt uses real painted timber rail inside house footprint");
 // The new scene painter must actually draw the WHOLE winter composition
 // in a shared physically grounded order, not call standalone art previews.
 drawings.length=0;
 const scene=[x-900,y-900,x+900,y+900];
 const layerCount=game.raster.drawWinterScene(ctx(),scene,game.setpieces.objects);
 assert.ok(layerCount>1,"source-linked winter scene must have multiple depth-sorted layers");
 assert.ok(drawings.some(d=>d[0]?.source?.includes("neighborhood_r6")),
  "winter depth pass must use real source-authored cutout sprites");
 assert.equal(typeof game.raster.drawVillageGround,"function");
 assert.equal(typeof game.raster.handlesWinterSolid,"function");
 assert.ok(fs.readFileSync("terrain_art.js","utf8").includes("raster.drawWinterScene(ctx,bounds"),
  "actual streamed terrain integrates winter depth painter");
 assert.ok(fs.readFileSync("terrain_art.js","utf8").includes("raster?.handlesWinterSolid?.(s)"),
  "winter objects must not be painted twice by fallback geometric renderer");
 assert.ok(fs.readFileSync("world_illustration.js","utf8").includes("skipWinter"),
  "old illustration must yield to unified winter painter");
 // Source-defined paths must be rendered as genuine visually-worn trails
 // without changing the original geometry or adding a fake walkable road.
 const mainRoad=game.geometry.roads.find(e=>e.from==="village"&&e.to==="bridge_w");
 assert.ok(mainRoad,"canonical Frostbridge route remains present");
 assert.equal(game.raster.paintedRoad(ctx(),mainRoad),true);
 // The region map, roads, anchors and all actual physical cross-bank routes
 // must remain EXACTLY the same: decorative pixels cannot bypass geometry.
 assert.equal(game.routeArt.stats().roads,65);
 assert.equal(game.routeArt.stats().crossings,7);
 assert.equal(model.nodes.length,48);
 for(const n of model.nodes){
  const [px,py]=n.point.map(v=>v*60);
  assert.equal(game.blocked(px,py),false,"physical road anchor "+n.id+" is clear")
 }
 const h=fs.readFileSync("index.html","utf8"),sw=fs.readFileSync("sw.js","utf8"),
  src=fs.readFileSync("game.js","utf8");
 assert.ok(h.includes("world_raster_pilot.js?v=10"));
 assert.ok(sw.includes("assets/hollowreach_neighborhood_r6.png?v=1"));
 assert.ok(sw.includes("veilward-hollowreach-v1315-west-spruce-verge"));
 assert.ok(src.includes('const APP_VERSION="1.3.15";'));
 assert.ok(src.includes('const SAVE="veilward-hollowreach-v01";'));
 console.log("R6 PASS: real authored sprite asset, in-game draw source, world topology and save key");
})().catch(e=>{console.error(e);process.exitCode=1});
