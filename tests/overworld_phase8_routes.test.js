/* Veilward Phase 8 — every road, stairs, bridge, ford, causeway and
 * complete lake-island physical route checks (Node/Canvas simulation).
 * Passing source QA is NOT an iPhone screenshot or appearance signoff.
 */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const geometryData=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const footprintData=JSON.parse(fs.readFileSync("docs/overworld/outdoor_footprint.json","utf8"));
const files=["world_geometry.js","world_climate.js","world_footprint.js","world_routes.js","terrain_art.js","world_stream.js","game.js","index.html","sw.js","visual.js","package.json"];
const source=Object.fromEntries(files.map(p=>[p,fs.readFileSync(p,"utf8")]));
let checks=0;
const yes=(v,msg)=>{assert.ok(v,msg);checks++},eq=(a,b,msg)=>{assert.equal(a,b,msg);checks++};
const paint={fill:0,stroke:0,images:0,paths:0,clips:0,colors:new Set()};
function context(){
 const q={fillStyle:"",strokeStyle:"",lineWidth:1,globalAlpha:1,lineCap:"",lineJoin:"",imageSmoothingEnabled:false,
 fillRect(){paint.fill++;paint.colors.add(this.fillStyle)},drawImage(){paint.images++},clip(){paint.clips++},
 beginPath(){paint.paths++},moveTo(){},lineTo(){},closePath(){},arc(){},save(){},restore(){},translate(){},scale(){},setLineDash(){},
 fill(){paint.fill++;paint.colors.add(this.fillStyle)},stroke(){paint.stroke++;paint.colors.add(this.strokeStyle)},fillText(){}};
 return q
}
const factory=()=>({width:0,height:0,getContext:()=>context()});
const host={console:{log(){},warn(){},error(){}}};host.window=host;
for(const file of ["world_geometry.js","world_climate.js","world_footprint.js","world_routes.js","terrain_art.js","world_stream.js"])
 vm.runInNewContext(source[file],host,{filename:file});
const G=host.VeilwardGeometry,C=host.VeilwardClimate,F=host.VeilwardFootprint,R=host.VeilwardRoutes,A=host.VeilwardTerrainArt,W=host.VeilwardWorldStream;
eq(R.version,"1.3.13","dedicated road network is versioned");
eq(W.version,"1.3.13","real streamer includes new roads");
eq(A.version,"1.3.13","terrain renderer composes new roads");
const geo=G.create(model,geometryData),climate=C.create(model);
const routes=R.create(model,geo,{climate}),land=F.create(model,geo,footprintData,{climate});
const art=A.create(model,geo,{canvasFactory:factory,climate,footprint:land,routeArt:routes});
const stream=W.create(model,{geometry:geometryData,footprint:footprintData,canvasFactory:factory});
eq(geo.roads.length,65,"65 approved road geometry edges");
eq(routes.stats().roads,65,"all 65 paths use co-authored route renderer");
eq(routes.stats().crossings,7,"seven physically authored crossing types");
eq(routes.stats().bridges,5,"five distinct bridge surfaces");
eq(routes.stats().fords,1,"one raised dry ford");
eq(routes.stats().causeways,1,"one stone causeway");
yes(routes.stats().stairs>=4,"stone stair routes exist");
yes(routes.stats().switchbacks>=4,"cliff switchback routes exist");
yes(art.diagnostics().routeNetworkEnabled&&stream.routeArt&&stream.stats().routeNetwork.crossings===7,"actual streaming preview constructs and uses network art");
yes(stream.stats().cachedTiles===0,"world art stays lazy on startup");
const units=model.worldDesign.worldUnitScale,nodes=Object.fromEntries(model.nodes.map(n=>[n.id,n]));
// Topological BFS over authored physical edges: every road and named region
// must be reachable without outdoor background/portal swaps.
const graph=new Map(model.nodes.map(n=>[n.id,new Set()]));
for(const e of model.edges){graph.get(e.from).add(e.to);graph.get(e.to).add(e.from)}
const visited=new Set(["village"]),queue=["village"];
while(queue.length)for(const v of graph.get(queue.shift()))if(!visited.has(v)){visited.add(v);queue.push(v)}
eq(visited.size,model.nodes.length,"all 48 named exterior anchors connected from Hollowreach");
yes(visited.has("island")&&graph.get("island").has("mossmere_w")&&graph.get("island").has("mossmere_e"),"Mossmere island has two distinct physical connections");
yes(graph.get("cave_mouth").size>=2&&graph.get("worldscar_ring").size>=2,"ruin and cave threshold routes are connected, not dead-end fake backgrounds");
eq(routes.stats().terminals.length,1,"only authored workshop doorway is a route dead-end");
eq(routes.stats().terminals[0],"joren","the lone terminal is a genuine workshop door");
let steps=0;const centerSamples=[];
for(const e of geo.roads){
 let last=e.path[0];
 for(const [a,b,,len] of e.parts){
  const count=Math.max(1,Math.ceil(len/55));
  for(let j=1;j<=count;j++){
   const x=a[0]+(b[0]-a[0])*j/count,y=a[1]+(b[1]-a[1])*j/count;
   yes(!stream.blocked(x,y),"protected centerline remains free: "+e.id);
   yes(geo.step(last[0],last[1],x,y),"road elevation remains continuous: "+e.id);
   last=[x,y];steps++;if(j===Math.floor(count/2))centerSamples.push([x,y]);
  }
 }
}
yes(steps>6900,"complete path network sampled at short physical-foot intervals");
const crossings=routes.crossings;
eq(crossings.length,7,"real seven crossing survey records available");
const surveyedIds=new Set(),deckStyles=new Set();
for(const crossing of crossings){
 const e=geo.roads.find(q=>q.id===crossing.id);
 yes(!!e&&e.crossing&&e.waterway,"crossing has authored water/chasm ownership: "+crossing.id);
 surveyedIds.add(crossing.id);deckStyles.add(crossing.deck);
 yes(!!R.deckTypes[crossing.deck],"crossing has distinct authored construction grammar "+crossing.deck);
 eq(crossing.start,e.from,"crossing start matches approved bank");
 eq(crossing.end,e.to,"crossing end matches approved bank");
 const [a,b,,len]=e.parts[0],x=(a[0]+b[0])/2,y=(a[1]+b[1])/2;
 const nx=-(b[1]-a[1])/len,ny=(b[0]-a[0])/len;
 yes(!stream.blocked(x,y),"central crossing deck is physical ground "+crossing.id);
 yes(!geo.waterAt(x,y,10),"source hazard is removed ONLY over physical crossing deck "+crossing.id);
 for(const side of [-1,1]){
  const inner=e.halfWidth*.42,outer=e.halfWidth*.87;
  yes(!stream.blocked(x+side*nx*inner,y+side*ny*inner),"two-lane crossing interior safe "+crossing.id);
  if(e.kind==="bridge")yes(stream.blocked(x+side*nx*outer,y+side*ny*outer),"painted bridge rail collides with boots "+crossing.id);
  else yes(!routes.edgeGuard(x+side*nx*outer,y+side*ny*outer),"ford/causeway has no fictitious bridge railing "+crossing.id);
 }
 const px=x-225,py=y-225;
 const before=paint.stroke;
 routes.draw(context(),[px,py,px+450,py+450]);
 yes(paint.stroke>before,"crossing has actual rendered deck, treads or stone slabs: "+crossing.id);
}
eq(deckStyles.size,7,"seven crossing types retain individually defined decks");
eq(surveyedIds.size,7,"seven crossing list contains no duplicates");
for(const id of ["mossmere_w","island","mossmere_e"]){
 const point=nodes[id].point.map(v=>v*units);
 yes(!stream.blocked(...point),"island circuit bank or island marker is real walkable land: "+id);
 yes(!!geo.nearRoad(...point),"island circuit lands on a visible authored path: "+id);
}
yes(art.materialAt(742*units,649*units)==="lake","lake remains painted and physically prohibited off the deck");
yes(art.materialAt(758*units,690*units)!=="lake","Mossmere island sanctuary remains dry ground");
const nearChasm=art.materialAt(1041*units,569*units);
yes(A.materials.includes(nearChasm),"ravine crossing paints a legitimate authored terrain material");
const prior=paint.stroke;
for(const node of model.nodes){
 const [x,y]=node.point.map(v=>v*units);
 routes.draw(context(),[x-200,y-200,x+200,y+200]);
}
yes(paint.stroke>prior&&paint.colors.size>15,"paths, switchbacks, bridge textures and region-specific palettes draw rather than just documenting routes");
stream.warm(stream.player.x,stream.player.y,1900,1100);
yes(stream.stats().cachedTiles>0&&stream.stats().cachedTiles<=18,"iPhone raster memory capped with roads");
for(const stop of ["village","bridge_w","ford_w","falls_w","mossmere_w","island","ravine_bridge_w"]){
 stream.jumpToNode(stop);
 stream.render(context(),1024,600,.78,.016);
 yes(stream.stats().cachedTiles<=18,"the actual iPhone crossing survey does not blow up tile cache at "+stop);
 yes(!stream.blocked(stream.player.x,stream.player.y),"crossing survey arrival has safe feet at "+stop);
}
stream.renderDebug(context(),1024,600,.78);
yes(paint.paths>20&&paint.images>0&&paint.stroke>20,"new road renderer and overlay execute in simulated Canvas");
const html=source["index.html"],sw=source["sw.js"],game=source["game.js"];
for(const asset of ["world_climate.js?v=4","world_footprint.js?v=5","world_routes.js?v=8","terrain_art.js?v=12","world_stream.js?v=13","game.js?v=34","manifest.webmanifest?v=1313"])
 yes(html.includes(asset)&&sw.includes(asset),"Safari and PWA both pin new file "+asset);
yes(html.indexOf("world_routes.js?v=8")<html.indexOf("world_stream.js?v=13"),"browser constructs route engine before real streamer");
yes(game.includes('const APP_VERSION="1.3.13";')&&game.includes('const SAVE="veilward-hollowreach-v01";'),"new build and original user saves intact");
yes(game.includes('if(!stream.geometry||!stream.art||!stream.footprint||!stream.climate||!stream.routeArt||!stream.illustration||!stream.setpieces||!stream.raster||!window.VeilwardReview)'),"game rejects incomplete physical road runtime");
yes(game.includes('id,name')&&game.includes('crossingStops')&&game.includes('cycleCrossingShowcase')&&game.includes('crossingShowcaseBtn'),"real seven-stop iPhone crossing menu wired");
yes(html.includes('id="crossingShowcaseBtn"')&&html.includes("Visit Next Crossing"),"crossing tour actually offered inside iPhone Journey Menu");
yes(sw.includes('veilward-hollowreach-v1313-winter-scene-depth'),"installed Home Screen service worker version rotated");
yes(source["visual.js"].includes('load("hero","hero_approved_8way_v12.webp"'),"approved eight-direction Wanderer kept");
yes(source["visual.js"].includes('load("warden","warden_hal_v13.png"'),"independent Warden art kept");
console.log("Veilward Phase 8 PASS:",checks,"full connected roads, seven different decks, island roundtrip, grounded rails, rich render, PWA; route steps:",steps);
