/* VEILWARD Phase 9 R3: authentic painted snow/stone/road materials +
 * source-authored infrastructure, never fake full screenshot background.
 * Build validity != creator visual acceptance.
 */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const bytes=p=>fs.readFileSync(p);
const png=bytes("assets/hollowreach_bridge_stairs_lamp_v2.png");
assert.equal(png.toString("hex",0,8),"89504e470d0a1a0a");
assert.equal(png.readUInt32BE(16),216);
assert.equal(png.readUInt32BE(20),72);
assert.ok(png.includes(Buffer.from("tRNS"))||png[25]===6,
 "Bridge, stairs, lantern are transparent original painted sprites");
const webp=bytes("assets/hollowreach_ground_painted_v2.webp");
assert.equal(webp.toString("ascii",0,4),"RIFF");
assert.equal(webp.toString("ascii",8,12),"WEBP");
assert.ok(webp.length>2500,"real fresh-authored 16-cell winter terrain stored as a binary image");
const paths=["world_geometry.js","world_climate.js","world_footprint.js",
 "world_routes.js","world_setpieces.js","world_raster_pilot.js","world_illustration.js",
 "terrain_art.js","world_stream.js","world_review.js"];
const S=Object.fromEntries(paths.map(p=>[p,fs.readFileSync(p,"utf8")]));
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const geometryData=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const landData=JSON.parse(fs.readFileSync("docs/overworld/outdoor_footprint.json","utf8"));
const ops={image:0,rect:0,stroke:0,patterns:0};
const ctx=()=>({globalAlpha:1,fillStyle:"",strokeStyle:"",imageSmoothingEnabled:true,
 fillRect(){ops.rect++},drawImage(){ops.image++},createPattern(){ops.patterns++;return"painted-roads"},
 beginPath(){},moveTo(){},lineTo(){},closePath(){},stroke(){ops.stroke++},
 fill(){},arc(){},clip(){},save(){},restore(){},translate(){},scale(){},rect(){},
 setLineDash(){},fillText(){},strokeText(){}});
const canvas=()=>({width:0,height:0,getContext:ctx});
class Img{
 constructor(){this.naturalWidth=0;this.naturalHeight=0;this.onload=null}
 set src(s){
  const dims=s.includes("hollowreach_pilot_sprites_v1.png")?[288,96]:
   s.includes("hollowreach_bridge_stairs_lamp_v2.png")?[216,72]:
   s.includes("hollowreach_ground_painted_v2.webp")?[128,128]:
    s.includes("hollowreach_neighborhood_r6.png")?[288,144]:null;
  assert.ok(dims,"unknown source "+s);
  [this.naturalWidth,this.naturalHeight]=dims;this.onload?.()
 }
}
const sandbox={Image:Img,console:{warn(){},error(){},log(){}}};sandbox.window=sandbox;
for(const path of paths)vm.runInNewContext(S[path],sandbox,{filename:path});
(async()=>{
 const pilot=sandbox.VeilwardRasterPilot;
 await pilot.load();assert.ok(pilot.ready,"all 4 real painted atlases loaded");
 const world=sandbox.VeilwardWorldStream.create(model,{geometry:geometryData,footprint:landData,canvasFactory:canvas});
 assert.equal(world.version,"1.3.28");
 assert.equal(world.art.version,"1.3.28");
 assert.equal(world.routeArt.version,"1.3.28");
 assert.equal(world.illustration.version,"1.3.28");
 assert.equal(world.raster.version,"1.3.28");
 assert.equal(world.raster.stats().artworkCells,30,"3+3+16+8 painted objects, infrastructure and terrain");
 assert.equal(world.raster.stats().creatorApproved,false);
 assert.equal(world.raster.stats().fullBackgroundPasted,false);
 assert.equal(world.routeArt.stats().authoredWinterRoads,true);
 const v=model.nodes.find(n=>n.id==="village"),green=model.nodes.find(n=>n.id==="greenwood_hearth");
 const [x,y]=v.point.map(q=>q*60),[gx,gy]=green.point.map(q=>q*60);
 const start=ops.image;
 assert.equal(world.raster.paintGroundCell(ctx(),"snow",101,101,x-48,y-48,96),true,
   "Hollowreach snow uses artist-provided image tiles");
 assert.ok(ops.image>start,"real image draw occurs");
 assert.equal(world.raster.paintGroundCell(ctx(),"forest",101,101,gx-48,gy-48,96),false,
   "Non-winter biomes do not incorrectly acquire snowy art");
 const road=world.geometry.roads.find(e=>e.path.some(p=>world.raster.covers(p[0],p[1]))&&!e.crossing);
 assert.ok(road,"a winter road is available");
 const before=ops.stroke;
 assert.equal(world.raster.paintedRoad(ctx(),road),true);
 assert.ok(ops.stroke>before,"worn stone visual corridor follows true authored walkable centerline");
 const testLantern=world.geometry.solids.find(s=>s.material==="lantern-post"&&world.raster.covers(s.cx,s.cy));
 if(testLantern){
  const before=ops.image;
  assert.equal(world.raster.drawStatic(ctx(),testLantern),true);
  assert.ok(ops.image>before);
 }
 const hood=world.setpieces.objects.filter(o=>world.raster.handlesSetpiece(o));
 assert.ok(hood.length>0,"painted art at real original Hollowreach source anchors");
 for(const prop of hood){
  if(prop.kind==="snow_cottage")assert.equal(world.setpieces.blocked(prop.x,prop.y,4),true,
   "physical cabin remains solid when its visual is repainted");
 }
 assert.equal(world.routeArt.stats().roads,65);
 assert.equal(world.routeArt.stats().crossings,7);
 for(const node of model.nodes){
  const [x,y]=node.point.map(q=>q*60);
  assert.equal(world.blocked(x,y),false,"all 48 original world anchors navigable "+node.id)
 }
 const html=fs.readFileSync("index.html","utf8"),sw=fs.readFileSync("sw.js","utf8");
 for(const asset of ["assets/hollowreach_bridge_stairs_lamp_v2.png?v=1",
 "assets/hollowreach_ground_painted_v2.webp?v=1",
  "assets/hollowreach_neighborhood_r6.png?v=1",
 "world_raster_pilot.js?v=24","world_routes.js?v=23",
 "world_illustration.js?v=22","terrain_art.js?v=28","world_stream.js?v=28","game.js?v=49"]){
  assert.ok(sw.includes(asset),"all iPhone offline assets precached "+asset);
  if(!asset.startsWith("assets/"))assert.ok(html.includes(asset),"game references same updated code "+asset)
 }
 assert.ok(sw.includes("veilward-hollowreach-v1328-rooted-forest-floor"));
 const game=fs.readFileSync("game.js","utf8");
 assert.ok(game.includes('const SAVE="veilward-hollowreach-v01";'),"original adventure saved unchanged");
 assert.ok(game.includes('const APP_VERSION="1.3.28";'));
 console.log("ART MATERIALS R3 PASS",ops,
 "30 authored image elements, real roads and all 48 travel anchors preserved; ART NOT ACCEPTED.");
})().catch(e=>{console.error(e);process.exit(1)});
