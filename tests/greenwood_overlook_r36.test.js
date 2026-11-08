/* R36: replace duplicated, uniformly spaced fake grey overlook pylons
 * with original R18 low-profile rock and fern landscape at the real source. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const data=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprintData=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
let images=[];
const ctx=()=>({globalAlpha:1,save(){},restore(){},translate(){},scale(){},
 drawImage(...p){images.push(p)},beginPath(){},arc(){},moveTo(){},lineTo(){},
 quadraticCurveTo(){},stroke(){},fill(){},fillRect(){},clearRect(){},
 createRadialGradient(){return{addColorStop(){}}}});
class SourceImage{constructor(){this.onload=null;this.naturalWidth=128;this.naturalHeight=128}
 set src(v){assert.ok(v.includes("greenwood_")&&v.includes(".avif"));this.onload?.()}}
const host={console,Image:SourceImage,document:{createElement:()=>({
 width:0,height:0,getContext:()=>ctx()})}};host.window=host;
for(const path of ["world_geometry.js","world_climate.js",
 "world_footprint.js","world_greenwood_art.js"])
 vm.runInNewContext(read(path),host,{filename:path});
(async()=>{
 const source=host.VeilwardGreenwoodArt;
 assert.equal(await source.loadPainted(),true);
 const geo=host.VeilwardGeometry.create(model,data),
  climate=host.VeilwardClimate.create(model),
  footprint=host.VeilwardFootprint.create(model,geo,footprintData,{climate}),
  painter=source.create({model,geometry:geo,footprint});
 const node=model.nodes.find(n=>n.id==="falls_overlook");
 assert.ok(node);
 const h={x:node.point[0]*60,y:node.point[1]*60,kind:"lookout"};
 const prev=JSON.stringify({model,data,footprintData});
 images=[];
 const n=painter.paintFallsOverlook(ctx(),h);
 assert.ok(n>=2,"native Falls landmark mass must paint");
 assert.ok(images.length>=4,"original painted rocks and moss rendered");
 assert.ok(images.every(i=>i.length===9),"native R18 source sprite crop");
 assert.ok(images.some(i=>i[1]===384),"native painted stone");
 assert.ok(images.some(i=>i[1]===256),"native painted forest moss");
 assert.equal(painter.paintFallsOverlook(ctx(),{...h,kind:"watchtower"}),0);
 assert.equal(painter.paintFallsOverlook(ctx(),{...h,x:0,y:0}),0);
 assert.ok(painter.stats().fallsOriginalLookoutR36);
 assert.ok(footprint.stats().fallsPlaceholderPylonsRemovedR36);
 assert.equal(painter.stats().creatorApproved,false);
 const oldFoot=read("world_footprint.js"),
  oldIllustration=read("world_illustration.js");
 assert.ok(!oldFoot.includes('if(h.kind==="watchtower"||h.kind==="lookout")'));
 assert.ok(!oldIllustration.includes('kind==="watchtower"||kind==="lookout"'));
 assert.ok(oldIllustration.includes("greenwood?.paintFallsOverlook(ctx,h)"));
 assert.equal(JSON.stringify({model,data,footprintData}),prev,
  "source geometry and physical obstacles not mutated");
 assert.equal(model.nodes.length,48);assert.equal(model.edges.length,65);
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 for(const p of ["index.html","sw.js"]){
  const s=read(p);
  assert.ok(s.includes("world_footprint.js?v=5&rev=31c&overlook=36"));
  assert.ok(s.includes("world_illustration.js?v=28&rev=33b&falls=34b&overlook=36"));
  assert.ok(s.includes("world_greenwood_art.js?v=12&rev=34&falls=34b&landform=35&soft=35b&blend=35c&overlook=36"))
 }
 assert.ok(read("scripts/visual_capture.mjs").includes(
  'capture(page,"GREENWOOD_R36_PAINTED_FALLS_OVERLOOK")'));
 console.log("R36 PASS: original native R18 forest rock/fern overlook,"+
  " five nonphysical cuboids retired; original routes, collisions and saves");
})().catch(e=>{console.error(e);process.exitCode=1});
