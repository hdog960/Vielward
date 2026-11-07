/* Veilward Phase 9: entire outdoor geography / actual runtime-art review gate.
 * Node + mock Canvas for source verification, not a creator iPhone approval.
 */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const files=["world_geometry.js","world_climate.js","world_footprint.js","world_routes.js","world_setpieces.js","world_raster_pilot.js","world_illustration.js","terrain_art.js","world_stream.js","world_review.js","game.js","index.html","sw.js","visual.css","visual.js","package.json","OVERWORLD_REBUILD_ROADMAP.md"];
const source=Object.fromEntries(files.map(p=>[p,fs.readFileSync(p,"utf8")]));
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const gd=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const fd=JSON.parse(fs.readFileSync("docs/overworld/outdoor_footprint.json","utf8"));
let checks=0;const yes=(v,m)=>{assert.ok(v,m);checks++},eq=(a,b,m)=>{assert.equal(a,b,m);checks++};
const rendered={fills:0,images:0,strokes:0,clips:0,paths:0};
function context(){return{fillStyle:"",strokeStyle:"",lineWidth:1,imageSmoothingEnabled:false,globalAlpha:1,
 fillRect(){rendered.fills++},drawImage(){rendered.images++},
 beginPath(){rendered.paths++},moveTo(){},lineTo(){},closePath(){},arc(){},fill(){rendered.fills++},
 stroke(){rendered.strokes++},strokeText(){},fillText(){},save(){},restore(){},translate(){},scale(){},clip(){rendered.clips++},setLineDash(){}}
}
const canvas=()=>({width:0,height:0,getContext:()=>context()});
const host={console:{warn(){},log(){},error(){}}};host.window=host;
for(const p of ["world_geometry.js","world_climate.js","world_footprint.js","world_routes.js","world_setpieces.js","world_illustration.js","terrain_art.js","world_stream.js","world_review.js"])
 vm.runInNewContext(source[p],host,{filename:p});
const W=host.VeilwardWorldStream,Review=host.VeilwardReview,stream=W.create(model,{geometry:gd,footprint:fd,canvasFactory:canvas});
const review=Review.create(model,stream),u=model.worldDesign.worldUnitScale;
eq(Review.version,"1.3.6","review module ready");
eq(review.stats().regions,12,"all twelve actual regions in atlas");
eq(review.stats().roads,65,"real complete source path graph in atlas");
eq(review.stats().crossings,7,"all authored physical crossings in atlas");
eq(review.stats().mainSliceNodes,10,"10 real roadway anchors make the post-approval mechanics-testing corridor");
for(let i=1;i<review.mainSlice.length;i++){
 const left=review.mainSlice[i-1],right=review.mainSlice[i];
 yes(model.edges.some(e=>e.from===left&&e.to===right||e.from===right&&e.to===left),
  "selected Hollowreach → Thawline → Greenwood → Smugglers corridor consists only of real road links "+left+"-"+right);
}

yes(review.stats().authoredArt&&review.stats().source==="live-gameplay","in-game source material compositor used, not concept art");
const mapCanvas=canvas();
const mapInfo=review.paintOverview(mapCanvas,{width:504,selected:"hollowreach"});
eq(mapCanvas.width,504,"source map creates supported pixel-canvas width");
eq(mapCanvas.height,336,"map source dimensions preserve 1200:800 plan");
eq(mapInfo.regions,12,"map plots all twelve actual centers");
eq(mapInfo.roadCount,65,"overview plots all source road polylines");
eq(mapInfo.crossingCount,7,"overview covers all crossing destinations");
yes(rendered.fills>2000&&rendered.strokes>60,"actual climate/water/roads/region map drawn");
const ids=new Set(),anchors=new Set();
let previousImages=rendered.images;
for(const r of review.regions){
 yes(!ids.has(r.id),"unique region "+r.id);ids.add(r.id);
 yes(r.name&&r.notes&&r.anchor,"useful actual review label and travel anchor "+r.id);
 const hit=review.safeAnchor(r.id),n=model.nodes.find(q=>q.id===hit.node);
 yes(n?.region===r.id,"actual source region anchor "+r.id);
 yes(!stream.blocked(hit.x,hit.y),"review jump points never land in trees, solid rock or deep lake "+r.id);
 const c=canvas(),out=review.paintRegion(c,r.id,{pixels:120,span:1900});
 eq(c.width,120,"genuine thumbnail output resolution "+r.id);
 eq(c.height,120,"thumbnail squares prevent stretching "+r.id);
 yes(out.authentic&&out.node===r.anchor,"world-preview compositor uses source anchor "+r.id);
 yes(rendered.images>previousImages,"genuine source atlas sprite assets painted "+r.id);
 previousImages=rendered.images;anchors.add(r.anchor);
}
eq(ids.size,12,"all twelve reviews included");
eq(anchors.size,12,"all twelve reviewed areas have an unambiguous source travel anchor");
const scan=review.auditPreview({stride:420});
eq(scan.length,12,"density survey includes each world biome");
for(const r of scan){
 yes(r.land>100,"valid outdoor footprint sampled "+r.id);
 yes(r.walkable>15,"region retains a navigable local area "+r.id);
 yes(r.traversablePercent>=10&&r.traversablePercent<=100,"bounded physical walkability per region "+r.id);
}
const moss=scan.find(r=>r.id==="mossmere");
yes(moss.water>moss.walkable*2,"Mossmere low walkability due to actual lake surface, not missing region");
const graph=new Map(model.nodes.map(n=>[n.id,[]]));
for(const e of model.edges){graph.get(e.from).push(e.to);graph.get(e.to).push(e.from)}
const bfs=start=>{const visited=new Set([start]),queue=[start];while(queue.length){const id=queue.shift();for(const v of graph.get(id))if(!visited.has(v)){visited.add(v);queue.push(v)}}return visited};
for(const r of review.regions)eq(bfs(r.anchor).size,model.nodes.length,"from each of the 12 regions all 48 source landmarks are reachable by real roads");
for(const road of model.edges)yes(!road.teleport,"all road links are real physical continuous outdoors "+road.id);
let steps=0,offAxis=0,blockedSides=0,artMismatch=0;
for(const e of stream.geometry.roads){
 const path=[...e.path];
 for(const [a,b,,length]of e.parts){
  const samples=Math.max(1,Math.ceil(length/70));
  const nx=-(b[1]-a[1])/(length||1),ny=(b[0]-a[0])/(length||1);
  for(let j=0;j<=samples;j++){
   const t=j/samples,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;
   yes(!stream.blocked(x,y),"all centerline route steps pass "+e.id);steps++;
   // Check a narrow, physically legible safe central corridor in both directions.
   // Near intersections and long diagonal switchback bends, lane edges are
   // allowed to have real rocks/hazards; record rather than conceal those.
   for(let k of [-1,1]){
    const xx=x+nx*e.halfWidth*.15*k,yy=y+ny*e.halfWidth*.15*k;
    if(stream.blocked(xx,yy))blockedSides++;
    else offAxis++;
   }
  }
 }
}
yes(steps>5500,"whole-network physical walks sampled at <=70-world-unit steps");
yes(blockedSides<steps*.12,"central road corridor remains comfortably passable; collisions can't consume entire visual road");
yes(offAxis>steps,"most short-offset steps in either direction retain safe passage");
for(const id of ["mossmere_w","island","mossmere_e"]){
 const n=model.nodes.find(n=>n.id===id),x=n.point[0]*u,y=n.point[1]*u;
 yes(!stream.blocked(x,y),"island bank and interior remain physically reachable "+id)
}
for(const e of stream.geometry.roads.filter(e=>e.crossing)){
 const [a,b,,l]=e.parts[0],x=(a[0]+b[0])/2,y=(a[1]+b[1])/2;
 yes(!stream.blocked(x,y),"seven crossing centers remain physically passable "+e.id);
 yes(!stream.geometry.waterAt(x,y,10),"real crossing source removes water/chasm collision on deck "+e.id);
}
for(const r of model.regions){
 const [cx,cy]=r.center.map(q=>q*u);
 for(let iy=-5;iy<=5;iy++)for(let ix=-8;ix<=8;ix++){
  const x=cx+ix*300,y=cy+iy*300;
  if(!stream.footprint.onLand(x,y))continue;
  const hazard=stream.geometry.waterAt(x,y,0),material=stream.art.materialAt(x,y);
  if(hazard){
   const expected=hazard.id==="mossmere_lake"?"lake":hazard.id==="smugglers_chasm"?"cliff":"river";
   if(material!==expected)artMismatch++;
  }
 }
}
eq(artMismatch,0,"physically hazardous water and painted water/cliff materials share a source everywhere tested");
stream.warm(stream.player.x,stream.player.y,1800,1100);
for(const id of review.regions.map(r=>r.id)){
 const anchor=review.safeAnchor(id);
 stream.jumpToNode(anchor.node);stream.render(context(),1136,640,.78,.016);
 yes(stream.stats().cachedTiles<=18,"12-region iPhone preview uses bounded tile cache "+id);
}
yes(rendered.images>250&&rendered.paths>250&&rendered.clips>0,"all in-world snapshots, props, source roads and foregrounds actually draw");
const html=source["index.html"],game=source["game.js"],sw=source["sw.js"],css=source["visual.css"];
for(const item of ["world_review.js?v=4","visual.css?v=15","game.js?v=52","manifest.webmanifest?v=1331"])
 yes(html.includes(item)&&sw.includes(item),"Safari and iPhone PWA share versioned Phase 9 "+item);
yes(html.indexOf("world_stream.js?v=31")<html.indexOf("world_review.js?v=4")&&html.indexOf("world_review.js?v=4")<html.indexOf("game.js?v=52"),"world atlas loads after authoritative streamer and before game");
for(const id of ["reviewAtlasBtn","worldReview","reviewMap","reviewRegionGrid","closeReviewBtn"])
 yes(html.includes('id="'+id+'"')&&game.includes(id),"real interactive iPhone review UI wired "+id);
yes(game.includes("review.paintRegion")&&game.includes("review.paintOverview")&&game.includes("jumpReviewRegion"),"review cards render real in-game art and physically teleport to source anchors for walking");
yes(css.includes(".reviewThumb")&&css.includes("touch-action:pan-y"),"landscape iPhone atlas is scrollable and uses pixelated source snapshots");
yes(game.includes('const SAVE="veilward-hollowreach-v01";')&&game.includes('const APP_VERSION="1.3.31";'),"original adventure saved progress preserved in review build");
yes(sw.includes("veilward-hollowreach-v1331-second-forest-cottage"),"installed iPhone app rotates 1.3.6 cache");
yes(source["visual.js"].includes('load("hero","hero_approved_8way_v12.webp"')&&
 source["visual.js"].includes('load("warden","warden_hal_v13.png"'),"golden reference character sprites remain protected");
yes(source["OVERWORLD_REBUILD_ROADMAP.md"].includes("### MANDATORY CHECKPOINT"),"creator signoff after Phase 9 remains a hard stop");
console.log("Veilward Phase 9 PASS:",checks,"full-world graph, route corridor, water-material coherence, real art atlas & iPhone approval gate;",steps,"route samples;",blockedSides,"narrow-lane blockers");
