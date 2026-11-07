/* Veilward Phase 9 -- Hollowreach original-aesthetic raster PILOT smoke.
 * Geometry and quest acceptance are separate from visual signoff.
 */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const file="assets/hollowreach_pilot_sprites_v1.png";
const image=fs.readFileSync(file);
assert.equal(image.toString("hex",0,8),"89504e470d0a1a0a","Real PNG with transparent cutout imagery");
assert.equal(image.readUInt32BE(16),288,"Three independently authored 96px sprites");
assert.equal(image.readUInt32BE(20),96,"Height of painted sprite atlas");
assert.ok(image.includes(Buffer.from("tRNS"))||image[25]===6,"Alpha transparency rather than baked background");
const paths=["world_geometry.js","world_climate.js","world_footprint.js",
 "world_routes.js","world_setpieces.js","world_raster_pilot.js","world_illustration.js",
 "terrain_art.js","world_stream.js","world_review.js"];
const sources=Object.fromEntries(paths.map(p=>[p,fs.readFileSync(p,"utf8")]));
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const geometry=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const footprint=JSON.parse(fs.readFileSync("docs/overworld/outdoor_footprint.json","utf8"));
const calls={draws:0};
const context=()=>({fillStyle:"",strokeStyle:"",lineWidth:1,imageSmoothingEnabled:false,globalAlpha:1,
 fillRect(){},drawImage(){calls.draws++},beginPath(){},moveTo(){},lineTo(){},closePath(){},
 arc(){},fill(){},stroke(){},save(){},restore(){},translate(){},scale(){},clip(){},rect(){},
 setLineDash(){},fillText(){},strokeText(){}});
const canvas=()=>({width:0,height:0,getContext:context});
class ImageMock{
 constructor(){this.naturalWidth=0;this.naturalHeight=0;this.onload=null}
 set src(path){
  const dims=path.includes("hollowreach_pilot_sprites_v1.png")?[288,96]:
    path.includes("hollowreach_bridge_stairs_lamp_v2.png")?[216,72]:
    path.includes("hollowreach_ground_painted_v2.webp")?[128,128]:
    path.includes("hollowreach_neighborhood_r6.png")?[288,144]:null;
  assert.ok(dims,"actual authored raster painting required "+path);
  [this.naturalWidth,this.naturalHeight]=dims;this.onload?.()
 }
}
const host={Image:ImageMock,console:{warn(){},error(){},log(){}}};host.window=host;
for(const path of paths)vm.runInNewContext(sources[path],host,{filename:path});
(async()=>{
 assert.equal(host.VeilwardRasterPilot.ready,false,"Art not available before actual image decode");
 await host.VeilwardRasterPilot.load();
 assert.equal(host.VeilwardRasterPilot.ready,true,"Art asynchronously decoded from real PNG");
 const stream=host.VeilwardWorldStream.create(model,{geometry,footprint,canvasFactory:canvas});
 assert.equal(stream.version,"1.3.27");
 assert.equal(stream.art.version,"1.3.27");
 assert.equal(stream.illustration.version,"1.3.27");
 assert.equal(stream.setpieces.version,"1.3.8");
 assert.equal(stream.raster?.version,"1.3.27","Running game actually uses authored art");
 assert.equal(stream.raster.stats().creatorApproved,false,"Creator's art gate remains pending");
 assert.equal(stream.raster.stats().geometryChanged,false);
 assert.equal(stream.art.diagnostics().rasterPilot,true);
 assert.equal(stream.routeArt.stats().roads,65);
 assert.equal(stream.routeArt.stats().crossings,7);
 // Genuine painted sprite rendering in the Hollowreach area.
 const props=stream.setpieces.objects;
 const hut=props.find(o=>o.anchor==="village"&&o.kind==="snow_cottage");
 assert.ok(hut,"Physical Hollowreach cottage preserved as true setpiece");
 assert.equal(stream.raster.handlesSetpiece(hut),true);
 const distant=props.find(o=>o.anchor==="market"&&o.kind==="market_stall");
 assert.ok(distant&&!stream.raster.handlesSetpiece(distant),"Other regions are NOT falsely counted as finished art");
 const before=calls.draws;
 const scene=[hut.x-280,hut.y-280,hut.x+280,hut.y+280];
 stream.raster.drawSetpieces(context(),scene,props);
 assert.ok(calls.draws>before,"The artist-made cabin is actually drawn in world space");
 const winterTree=stream.footprint.groves([hut.x-1200,hut.y-1200,hut.x+1200,hut.y+1200])
  .find(o=>["pine","oak"].includes(o.kind)&&stream.raster.covers(o.x,o.y));
 assert.ok(winterTree,"Physical Hollowreach trees exist to anchor painted fir sprite");
 assert.equal(stream.raster.drawFeature(context(),winterTree),true);
 // Any R2 shape decorations now invisible must have no phantom blockers.
 const hidden=props.find(o=>o.kind!=="snow_cottage"&&stream.raster.handlesSetpiece(o));
 if(hidden){const x=hidden.x,y=hidden.y;
  assert.equal(stream.setpieces.blocked(x,y,4,o=>stream.raster.handlesSetpiece(o)&&o.kind!=="snow_cottage"),false,
  "Hidden polygon objects cannot cause invisible collision");
 }
 for(const node of model.nodes){
  const [x,y]=node.point.map(q=>q*60);
  assert.equal(stream.blocked(x,y),false,"Approved 48 map endpoints stay clear "+node.id)
 }
 let steps=0;
 for(const road of stream.geometry.roads)
  for(const [a,b,,len] of road.parts){
   const n=Math.max(1,Math.ceil(len/110));
   for(let i=0;i<=n;i++){
    const x=a[0]+(b[0]-a[0])*i/n,y=a[1]+(b[1]-a[1])*i/n;
    assert.equal(stream.blocked(x,y),false,"65 physical road centerlines preserved "+road.id);
    steps++
   }
  }
 assert.ok(steps>3500,"Whole-world physical continuity remains tested");
 const html=fs.readFileSync("index.html","utf8"),
  sw=fs.readFileSync("sw.js","utf8"),
  game=fs.readFileSync("game.js","utf8");
 const assets=["world_raster_pilot.js?v=23","assets/hollowreach_pilot_sprites_v1.png?v=1",
  "assets/hollowreach_bridge_stairs_lamp_v2.png?v=1","assets/hollowreach_ground_painted_v2.webp?v=1",
  "assets/hollowreach_neighborhood_r6.png?v=1",
  "world_stream.js?v=27","terrain_art.js?v=27","world_illustration.js?v=21","game.js?v=48"];
 for(const path of assets){
  assert.ok(html.includes(path)||path.startsWith("assets/"),"Browser loads "+path);
  assert.ok(sw.includes(path),"iPhone service worker caches "+path)
 }
 assert.ok(html.indexOf("world_raster_pilot.js?v=23")<html.indexOf("world_stream.js?v=27"));
 assert.ok(game.includes("await window.VeilwardRasterPilot.load()"),"Real art load precedes streaming");
 assert.ok(game.includes('const SAVE="veilward-hollowreach-v01";'),"Original game save key untouched");
 assert.ok(sw.includes("veilward-hollowreach-v1327-feathered-woodland"));
 console.log("RASTER PILOT SOURCE PASS:",calls.draws,"real PNG draws; ",steps,
  "original roads sampled; 48 node anchors safe; 0% creator approval until review.");
})().catch(err=>{console.error(err);process.exit(1)});
