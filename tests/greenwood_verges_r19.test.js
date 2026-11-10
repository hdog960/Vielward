/* VEILWARD Phase 9 R19 — grounded mature canopies / forest-road verges.
 * Functional source regression ONLY. Creator visual acceptance remains 0%. */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const read=p=>fs.readFileSync(p,"utf8");
const src=read("world_greenwood_art.js");
const images=[],contexts=[];
function ctx(){
 const c={
  fillStyle:"",globalAlpha:1,imageSmoothingEnabled:false,
  beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){c.fills++},
  drawImage(...args){images.push(args)},
  save(){},restore(){},translate(){},scale(){},stroke(){},arc(){},
  fillRect(){},clearRect(){},lineCap:"round",lineJoin:"round",
  get fills(){return c._fills||0},set fills(v){c._fills=v},
  createRadialGradient(){return{addColorStop(){}}},
  createLinearGradient(){c.gradients++;return{addColorStop(){}}},
  get gradients(){return c._gradients||0},set gradients(v){c._gradients=v}
 };
 contexts.push(c);return c;
}
const host={document:{createElement:()=>({width:0,height:0,getContext:ctx})},console};
class ImageStub{
 constructor(){this.naturalWidth=0;this.naturalHeight=0;this.onload=null}
 set src(url){assert.ok(url.includes("greenwood_"),"source only uses authored woodland images");
  this.naturalWidth=128;this.naturalHeight=128;this.onload?.()}
}
host.Image=ImageStub;host.window=host;
vm.runInNewContext(src,host,{filename:"world_greenwood_art.js"});
(async()=>{
 const painter=host.VeilwardGreenwoodArt;
 assert.equal(painter.version,"1.3.32");
 assert.equal(await painter.loadPainted(),true);
 const original={path:[[0,0],[320,0]],halfWidth:54,crossing:false};
 const forbidden={path:[[900,0],[1200,0]],halfWidth:54,crossing:false};
 const geo={
  roads:[original,forbidden],
  waterAt(){return null},
  nearRoad(){return null},
  // Match the real VeilwardGeometry API. This test represents open woodland,
  // so no existing solid blocks the sampled decorative fern footprints.
  obstacle(){return null}
 };
 const footprint={regionAt(x,y){return{x,y,id:x>500?"hollowreach":"greenwood"}}};
 const art=painter.create({geometry:geo,footprint});
 assert.equal(art.stats().physicsChanged,false);
 assert.equal(art.stats().roadVergesFromSource,true);
 assert.ok(art.stats().matureTreeCanopyScale>=1.6);
 const origin=JSON.stringify(geo.roads),can=ctx();
 assert.equal(art.paintRoadVerges(can,[-200,-240,480,240]),1,
  "one genuine Greenwood road receives natural woodland verges");
 assert.ok(can.fills>=4,"both sides carry organic moss/forest-duff layers");
 assert.ok(can.gradients>=4,"all four source-bound ground bands feather into existing forest soil");
 assert.equal(art.stats().featheredRoadEdges,true);
 assert.ok(images.length>=2,"roadside ground uses existing original fern painting");
 assert.equal(JSON.stringify(geo.roads),origin,"paint-only changes never alter geometry");
 assert.equal(art.paintRoadVerges(ctx(),[850,-200,1400,210]),0,
  "painting doesn't spill into adjacent non-Greenwood regions");
 images.length=0;
 assert.equal(art.paintFeature(ctx(),{
  kind:"oak",x:100,y:100,radius:50,variant:.34}),true);
 const oak=images[images.length-1];
 assert.equal(oak[7],270,"R19 adult oak width based on original rooted tree");
 assert.equal(oak[8],350,"R19 adult oak height visibly towers over player");
 assert.equal(art.paintFeature(ctx(),{
  kind:"pine",x:200,y:100,radius:50,variant:.34}),true);
 const pine=images[images.length-1];
 assert.equal(pine[7],230);assert.equal(pine[8],380);
 assert.equal(art.paintFeature(ctx(),{
  kind:"oak",x:1000,y:100,radius:50,variant:.34}),false,
  "no Greenwood art can be stamped in another source biome");
 assert.equal(art.stats().creatorApproved,false);
 const html=read("index.html"),worker=read("sw.js"),game=read("game.js");
 assert.ok(html.includes("world_greenwood_art.js?v=12"));
 assert.ok(worker.includes("veilward-hollowreach-v1336-greenwood-escarpment-r35"));
 assert.ok(game.includes('const SAVE="veilward-hollowreach-v01";'));
 console.log("R19 PASS: source-road woodland margins, mature 270x350 oak / 230x380 pine at original roots, preserved route geometry and save, forest still unapproved");
})().catch(err=>{console.error(err);process.exitCode=1});