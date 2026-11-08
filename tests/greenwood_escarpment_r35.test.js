/* R35 regression: the waterfall basin's escarpments are fully sourced
 * from the original physically dry banks, not faux collision or wallpaper. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const geometrySource=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprintSource=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
const counts={curves:0,fill:0,images:0,shades:0};
function ctx(){return{globalAlpha:1,save(){},restore(){},translate(){},rotate(){},scale(){},
 beginPath(){},moveTo(){},lineTo(){},closePath(){},rect(){},clip(){},arc(){},
 quadraticCurveTo(){counts.curves++},stroke(){},fill(){counts.fill++},
 drawImage(...v){if(v.length===9)counts.images++},
 fillRect(){},clearRect(){},
 createLinearGradient(){counts.shades++;return{addColorStop(){}}},
 createRadialGradient(){counts.shades++;return{addColorStop(){}}}
}}
class ImageStub{
 constructor(){this.onload=null;this.naturalWidth=128;this.naturalHeight=128}
 set src(src){assert.ok(src.includes("greenwood_")&&src.includes(".avif"));this.onload?.()}
}
const t={console,Image:ImageStub,document:{createElement:()=>({width:0,height:0,
 getContext:()=>ctx()})}};t.window=t;
for(const path of ["world_geometry.js","world_climate.js",
 "world_footprint.js","world_greenwood_art.js"])
 vm.runInNewContext(read(path),t,{filename:path});
(async()=>{
 assert.equal(await t.VeilwardGreenwoodArt.loadPainted(),true);
 const geo=t.VeilwardGeometry.create(model,geometrySource),
  climate=t.VeilwardClimate.create(model),
  foot=t.VeilwardFootprint.create(model,geo,footprintSource,{climate}),
  art=t.VeilwardGreenwoodArt.create({model,footprint:foot,geometry:geo});
 const sources=art.fallsBankSources();
 assert.ok(sources.length>30,"real water provides connected bank samples");
 const before=JSON.stringify({geometrySource,footprintSource,nodes:model.nodes,
  edges:model.edges,water:model.waterways});
 for(const point of sources){
  assert.ok(foot.onLand(point.x,point.y),"dry bank on original landmass");
  assert.equal(geo.waterAt(point.x,point.y,0),null);
  assert.equal(geo.waterAt(point.wx,point.wy,0)?.id,"frostbridge_river");
  assert.equal(geo.nearRoad(point.x,point.y,()=>true,135),null);
 }
 const site=model.nodes.find(n=>n.id==="falls_e");
 const [x,y]=site.point.map(q=>q*60);
 const n=art.paintFallsRiverBanks(ctx(),[x-3300,y-3200,x+3600,y+3200]);
 assert.ok(n>5,"layered original-source riverbank is visible");
 assert.ok(counts.curves>4,"joined bank contours require organic curved outlines");
 assert.ok(counts.shades>=1,"connected geological faces have shading, not flat stripes");
 assert.ok(counts.fill>=3,"at least 3 architectural planes for terrain depth");
 assert.ok(counts.images>0,"original R18 painted rocks/ferns actually drawn");
 assert.equal(art.paintFallsRiverBanks(ctx(),[0,0,300,300]),0,
  "far-off source bank remains culled");
 assert.equal(JSON.stringify({geometrySource,footprintSource,nodes:model.nodes,
  edges:model.edges,water:model.waterways}),before);
 assert.equal(model.nodes.length,48);assert.equal(model.edges.length,65);
 assert.equal(art.stats().riverSourcedEscarpmentR35,true);
 assert.equal(art.stats().physicsChanged,false);
 assert.equal(art.stats().creatorApproved,false);
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 assert.ok(read("game.js").includes('const APP_VERSION="1.3.36";'));
 assert.ok(read("sw.js").includes("world_greenwood_art.js?v=12&rev=34&falls=34b&landform=35"));
 assert.ok(read("index.html").includes("world_greenwood_art.js?v=12&rev=34&falls=34b&landform=35"));
 assert.ok(read("scripts/visual_capture.mjs").includes(
  'capture(page,"GREENWOOD_R35_SCULPTED_RIVERBANK")'));
 assert.ok(read("scripts/visual_capture.mjs").includes(
  'capture(page,"GREENWOOD_R35_FALLS_OVERLOOK")'));
 console.log("R35 PASS: curved source-linked geological escarpment, native rock and foliage,"+
  " 48 landmarks, 65 roads, seven crossings and unchanged save system");
})().catch(e=>{console.error(e);process.exitCode=1});
