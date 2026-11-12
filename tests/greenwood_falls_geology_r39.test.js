/* Phase 9 R39 — original bedrock and physically sourced river escarpment */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const data=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const fp=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
let images=[];
let dryClipCount=0;
const ctx=()=>({globalAlpha:1,save(){},restore(){},clip(){dryClipCount++},rect(){},translate(){},scale(){},
 beginPath(){},closePath(){},arc(){},ellipse(){},moveTo(){},lineTo(){},
 quadraticCurveTo(){},fill(){},stroke(){},fillRect(){},clearRect(){},
 drawImage(...a){images.push(a)},
 createRadialGradient(){return{addColorStop(){}}}});
class SourceImage{
 constructor(){this.onload=null;this.naturalWidth=128;this.naturalHeight=128}
 set src(v){assert.ok(v.includes("greenwood_")&&v.includes(".avif"));this.onload?.()}
}
const host={console,Image:SourceImage,
 document:{createElement:()=>({width:0,height:0,getContext:()=>ctx()})}};
host.window=host;
for(const path of ["world_geometry.js","world_climate.js","world_footprint.js","world_greenwood_art.js"])
 vm.runInNewContext(read(path),host,{filename:path});
(async()=>{
 assert.equal(await host.VeilwardGreenwoodArt.loadPainted(),true);
 const geo=host.VeilwardGeometry.create(model,data),
 climate=host.VeilwardClimate.create(model),
 footprint=host.VeilwardFootprint.create(model,geo,fp,{climate}),
 art=host.VeilwardGreenwoodArt.create({model,geometry:geo,footprint});
 const n=model.nodes.find(n=>n.id==="falls_overlook");
 const x=n.point[0]*60,y=n.point[1]*60;
 const bounds=[x-1800,y-1600,x+1800,y+1700],
 roots=footprint.groves(bounds,350).filter(o=>o.authoredFallsGrove);
 assert.ok(roots.length>=2,"actual collidable Falls grove must populate");
 assert.equal(roots.length,footprint.stats().fallsRootedGroveR37);
 const visible=roots.filter(o=>o.authoredFallsFrameR38);
 assert.equal(visible.length,footprint.stats().fallsCompositionTreesR38);
 assert.ok(visible.length>=3,"R38 must anchor foreground-screen trees");
 assert.ok(visible.some(o=>o.x<x-280&&Math.abs(o.y-y)<800),
  "R38 needs forest frame on left edge of overlook");
 assert.ok(visible.some(o=>o.x>x+280&&Math.abs(o.y-y)<800),
  "R38 needs forest frame on right edge of overlook");
 const ids=new Set();
 for(const o of roots){
  assert.ok(!ids.has(o.id));ids.add(o.id);
  assert.equal(footprint.regionAt(o.x,o.y).id,"greenwood_falls");
  assert.ok(o.solid&&o.authoredGrove);
  assert.ok(footprint.blocked(o.x,o.y,4),"rendered tree has physical collider");
  assert.ok(!geo.waterAt(o.x,o.y,o.radius+35),"tree is not in river");
  assert.ok(!geo.nearRoad(o.x,o.y,()=>true,o.radius+90),"roads stay clear");
  assert.ok(Math.hypot(o.x-x,o.y-y)>430,"viewpoint and stairs stay open");
 }
 assert.ok(!footprint.blocked(x,y,14),"lookout arrival retains clear ground");
 images=[];
 const terrain=art.paintFallsRootedGorge(ctx(),bounds),
 canopy=art.paintFallsCanopyBoughs(ctx(),bounds,roots),
 foreground=art.paintFallsComposedGround(ctx(),bounds);
 assert.ok(foreground>=4,"native source-rooted forest floor and real stair margins");
 assert.ok(art.stats().fallsLandscapeCompositionR38);
 assert.ok(art.stats().fallsStairShoulderNativeR38);

 const shelves=art.fallsRockCandidates();
 assert.equal(shelves.length,8,"eight original-art low-relief bedrock groupings");
 assert.ok(shelves.every(o=>o.groundOnly&&Number.isFinite(o.x)&&
   Number.isFinite(o.y)),"R39 never invents inaccessible cliff geometry");
 const prior=images.length;
 const ledges=art.paintFallsEscarpmentFloor(ctx(),bounds);
 assert.ok(ledges>=4,"R39 actual overlook has anchored bedrock");
 const nativeLedges=images.slice(prior);
 assert.ok(nativeLedges.some(a=>a[1]===384),
  "original R18 rock art frames the overlook");
 assert.ok(nativeLedges.some(a=>a[1]===256),
  "original R18 fern art connects the stone to forest");
 assert.ok(nativeLedges.every(a=>a.length===9),
  "original unaltered painted atlas crops, no fake textures");
 assert.equal(art.paintFallsEscarpmentFloor(ctx(),[0,0,500,500]),0,
  "R39 does not contaminate other regions");
 const realBanks=art.fallsBankSources();
 assert.ok(realBanks.length>=20,"original physically dry riverbanks intact");
 const riverBounds=[Math.min(...realBanks.map(o=>o.x))-300,
  Math.min(...realBanks.map(o=>o.y))-300,
  Math.max(...realBanks.map(o=>o.x))+300,
  Math.max(...realBanks.map(o=>o.y))+300];
 const riverLedges=art.paintFallsRiverNativeLedges(ctx(),riverBounds);
 assert.ok(riverLedges>=2,"native R18 rock drawn at real riverbank");
 assert.equal(art.paintFallsRiverNativeLedges(ctx(),[0,0,500,500]),0,
  "no river rock art outside physical river");
 // R41: the genuine dry-bank escarpment is no longer painted as four
 // broad parallel contour rails. The river painter instead places
 // original R18 rock/fern fragments at individually verified source
 // bank positions. This guards against reintroducing rejected stripes.
 const bankSprites=[],bankStrokes=[];
 const bankCtx={...ctx(),drawImage(...a){bankSprites.push(a)},
  stroke(){bankStrokes.push(this.lineWidth||0)}};
 const bankPass=art.paintFallsRiverBanks(bankCtx,riverBounds);
 assert.ok(bankPass>=1,"source-bank artwork must remain visible");
 assert.ok(bankSprites.some(a=>a[1]===384),
  "original painted stone fragments replace the rejected broad rails");
 assert.ok(bankSprites.every(a=>a.length===9),
  "bank fragments use original unaltered transparent source crops");
 assert.ok(bankStrokes.every(w=>w<80),
  "no 85/116-unit continuous parallel bank rails");

 assert.ok(art.stats().fallsLowReliefSourceBedrockR39);
 assert.ok(art.stats().fallsRealRiverNativeLedgesR39);
 assert.equal(art.stats().physicsChanged,false);

 assert.ok(dryClipCount>0,"source-ground forest and gorge washes must use real Canvas clipping");
 assert.ok(terrain>=2&&canopy>=1,"native understory and canopy");
 assert.ok(images.some(a=>a[1]===256),"native R18 fern art");
 assert.ok(images.some(a=>a[1]===0||a[1]===128),"native R18 tree crown art");
 assert.ok(images.every(a=>a.length===9),"native R18 source sprite crops");
 assert.equal(art.paintFallsCanopyBoughs(ctx(),bounds,[]),0);
 assert.ok(art.stats().fallsCollisionRootedGorgeR37);
 assert.ok(art.stats().fallsNativeCanopyFrameR37);
 assert.equal(art.stats().creatorApproved,false);
 assert.equal(model.nodes.length,48);
 assert.equal(model.edges.length,65);
 assert.equal(model.edges.filter(e=>e.crossing).length,7);
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 for(const p of ["index.html","sw.js"]){
  assert.ok(read(p).includes("&shape=36b&gorge=37&frame=38"));
  assert.ok(read(p).includes("&frame=38&rock=39"));
  assert.ok(read(p).includes("&overlook=36&forest=37"));
 }
 assert.ok(read("scripts/visual_capture.mjs").includes(
  'capture(page,"GREENWOOD_R38_COMPOSED_FALLS_FOREST")'));
 assert.ok(read("scripts/visual_capture.mjs").includes(
  'capture(page,"GREENWOOD_R39_BEDROCK_OVERLOOK")'));
 assert.ok(read("scripts/visual_capture.mjs").includes(
  'capture(page,"GREENWOOD_R39_SOURCE_RIVER_GORGE")'));
 console.log("R39 PASS: "+ledges+" source-native overlook ground brush layers, "+riverLedges+" actual riverbank strata, 48 nodes, 65 roads, seven crossings, saves unchanged");
})().catch(e=>{console.error(e);process.exitCode=1});
