/* Phase 9 R38 — camera-meaningful physical Falls forest composition */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const data=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const fp=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
let images=[];
let clips=0;
const ctx=()=>({globalAlpha:1,save(){},restore(){},clip(){clips++},rect(){},translate(){},scale(){},
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

 assert.ok(terrain>=2&&canopy>=1,"native understory and canopy");
 assert.ok(clips>0,"Falls woodland painting must clip to actual dry forest source");
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
  assert.ok(read(p).includes("&overlook=36&forest=37"));
 }
 assert.ok(read("scripts/visual_capture.mjs").includes(
  'capture(page,"GREENWOOD_R38_COMPOSED_FALLS_FOREST")'));
 console.log("R38 PASS: "+visible.length+" foreground physical roots, "+foreground+" native planted details, original 65 roads and saves intact; roots="+JSON.stringify(visible.map(o=>[Math.round(o.x-x),Math.round(o.y-y)])));
})().catch(e=>{console.error(e);process.exitCode=1});
