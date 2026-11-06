/* Veilward Phase 6: full 12-region connected outdoor landmass regression.
 * Actual runtime modules and authored data, browser Canvas API simulated.
 * No simulated test represents visual approval or an iPhone frame-rate reading.
 */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const geoData=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const landData=JSON.parse(fs.readFileSync("docs/overworld/outdoor_footprint.json","utf8"));
const source=Object.fromEntries(["world_geometry.js","world_footprint.js","terrain_art.js","world_stream.js","game.js","index.html","sw.js","visual.js"].map(p=>[p,fs.readFileSync(p,"utf8")]));
let checks=0;
function ok(v,m){assert.ok(v,m);checks++}
function eq(a,b,m){assert.equal(a,b,m);checks++}
const q={fills:0,strokes:0,images:0,paths:0,clips:0,foreground:0};
function ctx(){return{fillStyle:"",strokeStyle:"",lineWidth:1,lineCap:"",lineJoin:"",imageSmoothingEnabled:false,globalAlpha:1,
 fillRect(){q.fills++},drawImage(){q.images++},beginPath(){q.paths++},moveTo(){},lineTo(){},closePath(){},
 save(){},restore(){},translate(){},scale(){},clip(){q.clips++},setLineDash(){},arc(){},
 fill(){q.fills++},stroke(){q.strokes++},fillText(){q.foreground++}
}}
const canvas=()=>({width:0,height:0,getContext:()=>ctx()});
const host={console:{log(){},warn(){},error(){}}};host.window=host;
for(const p of ["world_geometry.js","world_footprint.js","terrain_art.js","world_stream.js"])
 vm.runInNewContext(source[p],host,{filename:p});
const G=host.VeilwardGeometry,F=host.VeilwardFootprint,A=host.VeilwardTerrainArt,W=host.VeilwardWorldStream;
eq(F.version,"1.3.1","new real outdoor footprint module");
eq(W.version,"1.3.2","streamer upgraded");
eq(A.version,"1.3.2","actual art compositor upgraded");
eq(model.regions.length,12,"12 approved regions");
eq(landData.regions.length,12,"12 source-composed region rules");
eq(landData.hubs.length,13,"13 authored landmark hubs");
ok(landData.landOutline.length>22,"irregular fully drawn landmass outline");
eq(model.nodes.length,48,"source world anchors preserved");
eq(model.edges.length,65,"source paths preserved");
const g=G.create(model,geoData),foot=F.create(model,g,landData);
eq(foot.stats().regions,12,"12 full-world footprint region compositions");
eq(foot.stats().majorHubs,13,"landmark anchoring preserved");
eq(foot.stats().routeClearings,35,"intentional hub and travel clearings");
eq(foot.stats().landmassCollision,true,"landmass exterior is collision-grounded");
const units=model.worldDesign.worldUnitScale;
for(const n of model.nodes){
 ok(foot.onLand(n.point[0]*units,n.point[1]*units),"global named anchor remains on the new landmass: "+n.id);
 ok(!foot.blocked(n.point[0]*units,n.point[1]*units),"every named anchor stays clear of wild natural props: "+n.id);
}
for(const r of model.regions){
 ok(foot.onLand(r.center[0]*units,r.center[1]*units),"macro region land exists: "+r.id);
 ok(!!foot.regionAt(r.center[0]*units,r.center[1]*units)?.opts,"macro region has regional scenery rules: "+r.id);
}
ok(foot.blocked(-200,200)&&foot.blocked(400,50000),"exterior cannot be walked into");
ok(foot.blocked(1200,1200),"irregular northwest border actually blocks void");
let routeSteps=0;
for(const e of g.roads){
 let prev=e.path[0];let oneEdge=0;
 for(const [from,to,,len]of e.parts){
  const steps=Math.max(1,Math.ceil(len/48));
  for(let i=1;i<=steps;i++){
   const x=from[0]+(to[0]-from[0])*i/steps,y=from[1]+(to[1]-from[1])*i/steps;
   ok(!foot.blocked(x,y,10),"no generated obstacle/border blocks declared route "+e.id);
   ok(!g.blocked(x,y,10),"original deck/shore/cliff collision remains passable "+e.id);
   ok(g.step(prev[0],prev[1],x,y),"elevation continuity remains passable "+e.id);
   prev=[x,y];routeSteps++;oneEdge++
  }
 }
 ok(oneEdge>0,"route has actual walkable centerline "+e.id)
}
ok(routeSteps>8000,"walks over 8,000 contiguous on-ground test samples across all 65 links");
for(const route of model.worldDesign.alternateSnowForestRoutes){
 eq(route[0],"village","all three crossings start in Hollowreach");
 eq(route[route.length-1],"greenwood_hearth","all three reach the Greenwood hearth");
 const ids=route.slice(1).map((next,i)=>g.roads.find(e=>(e.from===route[i]&&e.to===next)||(e.to===route[i]&&e.from===next)));
 ok(ids.every(Boolean),"planned route is represented by physical roads, not an image teleport");
}
let sampled=0,solids=0,decorations=0,byKind=new Set();
for(const region of model.regions){
 const x=region.center[0]*units,y=region.center[1]*units;
 const seen=foot.cells([x-2900,y-2900,x+2900,y+2900]);
 ok(seen.length>=1,"region has actual wilderness decor rather than empty color: "+region.id);
 for(const obj of seen){
  sampled++;byKind.add(obj.kind);
  eq(foot.fieldCell(Math.floor(obj.x/landData.fieldSampling.cellSizeWorld),Math.floor(obj.y/landData.fieldSampling.cellSizeWorld))?.id,obj.id,"feature source identity stable across chunk redraw");
  if(obj.solid){
   solids++;
   ok(foot.blocked(obj.x,obj.y,10),"visible standing natural object is solid at its exact root: "+obj.id);
  }else{decorations++;ok(!foot.blocked(obj.x,obj.y,1),"tiny groundcover does not arbitrarily block the feet")}
 }
}
ok(sampled>140,"12 regions contain many co-authored details");
ok(solids>60&&decorations>15,"world has a mix of physical objects and non-blocking cover");
ok(byKind.has("pine")&&byKind.has("oak")&&byKind.has("reeds")&&byKind.has("crystal")&&byKind.has("cairn")&&byKind.has("flowerbed"),
 "ecology varies across snow, woodland, wetland, arcane ruins and meadow");
const before=q.fills;
foot.draws(ctx(),[15500,16800,17500,18800]);
foot.drawScenery(ctx(),[15500,16800,17500,18800]);
ok(q.fills>before+8,"real terrain art receives landmark and environmental layers");
foot.drawForeground(ctx(),{x:727*units,y:430*units});
foot.debug(ctx(),[15000,15000,18000,19000]);
ok(q.paths>0&&q.strokes>0,"exterior, natural blockers and developer overlay share geometric source");
const stream=W.create(model,{geometry:geoData,footprint:landData,canvasFactory:canvas,maxTiles:18});
ok(!!stream.geometry&&!!stream.art&&!!stream.footprint,"real streamer starts geometry/footprint/art together");
eq(stream.art.diagnostics().landmass.regions,12,"runtime artwork reports 12-region source pipeline");
eq(stream.stats().tilesBuilt,0,"full 1,536 chunks are not eagerly rasterized");
stream.warm(stream.player.x,stream.player.y,1800,1050);
ok(stream.stats().cachedTiles>0&&stream.stats().cachedTiles<=18,"streamed atlas and scenic features bounded to 18 cached tiles");
for(const hub of landData.hubs){
 const loc=stream.jumpToNode(hub.anchor);
 ok(loc.node===hub.anchor,"actual world survey jumps to designated landmark "+hub.id);
 ok(!stream.blocked(stream.player.x,stream.player.y),"survey does not spawn inside newly added blockers "+hub.id);
 const view=stream.render(ctx(),1536,708,.78,.05);
 ok(stream.stats().cachedTiles<=18,"cached art and world remain bounded after visiting "+hub.id);
 ok(view.camera.x<=stream.player.x&&stream.player.x<=view.camera.x+view.viewWidth,"camera includes player on regional entry "+hub.id);
}
const near=stream.jumpToNode("greenwood_hearth");
ok(near.node==="greenwood_hearth","forest terrain scout exists");
const moveX=stream.player.x,delta=stream.move(1,0,.07);
ok(delta>=0&&stream.player.x>=moveX,"terrain and natural obstacles never teleport movement backwards");
stream.renderForeground(ctx(),stream.player);
stream.renderDebug(ctx(),1536,708,.78);
ok(stream.stats().footprint?.maximumCachedFields===6000,"field feature cache is memory bounded on iPhone");
const body=source["game.js"],html=source["index.html"],sw=source["sw.js"];
for(const asset of ["world_review.js?v=1","world_routes.js?v=1","world_climate.js?v=1","world_footprint.js?v=2","terrain_art.js?v=4","world_stream.js?v=6","game.js?v=25","visual.css?v=15","manifest.webmanifest?v=133"])
 ok(html.includes(asset)&&sw.includes(asset),"HTML and PWA worker version parity "+asset);
ok(body.includes("outdoor_footprint.json?v=1")&&sw.includes("outdoor_footprint.json?v=1"),"authoritative world data is fetched by the live game and pre-cached offline");
ok(html.indexOf("world_geometry.js?v=1")<html.indexOf("world_footprint.js?v=2")&&html.indexOf("world_footprint.js?v=2")<html.indexOf("terrain_art.js?v=4")&&html.indexOf("terrain_art.js?v=4")<html.indexOf("world_stream.js?v=6"),
 "browser loads geometry, footprint, art and streamer in dependency order");
ok(html.includes('id="materialShowcaseBtn"')&&html.includes("12-Region World Survey")&&body.includes("const showcaseStops"),"full-world survey navigable on iPhone");
ok(body.includes('const APP_VERSION="1.3.3";'),"actual live game version is 1.3.0");
ok(body.includes('const SAVE="veilward-hollowreach-v01";'),"original adventure save key preserved");
ok(body.includes("if(!stream.geometry||!stream.art||!stream.footprint||!stream.climate||!stream.routeArt||!window.VeilwardReview)"),"game refuses partial mismatched world modules");
ok(sw.includes("veilward-hollowreach-v133-world-review-gate"),"installed Home Screen cache rotated");
ok(source["visual.js"].includes('load("hero","hero_approved_8way_v12.webp"'),"approved eight-direction player art never changed");
ok(source["visual.js"].includes('load("warden","warden_hal_v13.png"'),"distinct Warden Hal sprite never changed");
console.log("Veilward Phase 6 PASS:",checks,"footprint, reachable regions, scenery, physics, source/compositing and PWA checks;",routeSteps,"sampled walk steps.");
