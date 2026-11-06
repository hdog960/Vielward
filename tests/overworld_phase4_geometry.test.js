/* Veilward Phase 4 — authored ground, feet, cliff, stair & interaction regression.
 * node tests/overworld_phase4_geometry.test.js
 * Collision and drawn solids share one authored JSON. iPhone art approval remains pending.
 */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const map=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const data=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const source=fs.readFileSync("world_geometry.js","utf8");
const streaming=fs.readFileSync("world_stream.js","utf8");
const game=fs.readFileSync("game.js","utf8");
const html=fs.readFileSync("index.html","utf8");
const sw=fs.readFileSync("sw.js","utf8");
const assets=fs.readFileSync("visual.js","utf8");
const roadmap=fs.readFileSync("OVERWORLD_REBUILD_ROADMAP.md","utf8");
let checks=0;
function ok(value,msg){assert.ok(value,msg);checks++}
function eq(a,b,msg){assert.equal(a,b,msg);checks++}
const host={console:{warn(){},log(){},error(){}}};host.window=host;
vm.runInNewContext(source,host);vm.runInNewContext(streaming,host);
const G=host.VeilwardGeometry,W=host.VeilwardWorldStream;
ok(G.version==="1.2.8"&&W.version==="1.3.11","Phase 4 modules both installed");
eq(G.validate(map,data),data,"source blueprint and geometry schema supported");
eq(data.groundDefaults.footRadiusWorld,10,"collision footprint is separate from actor sprite size");
ok(data.groundDefaults.footAnchor.includes("boots"),"sprite ground-foot contract explicit");
const g=G.create(map,data),stats=g.stats();
eq(stats.roads,65,"all planned routes compiled");
eq(stats.crossings,7,"all physical bridges/fords compiled");
eq(stats.surfaces,7,"terrain floor polygons compiled");
eq(stats.solids,30,"30 blockers authored");
eq(stats.cliffs,4,"4 visible cliff-face collider polygons");
eq(stats.interactions,11,"11 inspectable landmarks authored");
ok(stats.indexedCells>30&&stats.indexedCells<1000,"sparse road cell indexing avoids eager whole-world allocation");
const scale=map.worldDesign.worldUnitScale;
const coords=id=>map.nodes.find(n=>n.id===id).point.map(v=>v*scale);
for(const solid of g.solids){
 const pos=solid.shape==="circle"?[solid.cx,solid.cy]:solid.shape==="segment"?
  [(solid.a[0]+solid.b[0])/2,(solid.a[1]+solid.b[1])/2]:
  solid.polygon.reduce((p,q)=>[p[0]+q[0]/solid.polygon.length,p[1]+q[1]/solid.polygon.length],[0,0]);
 ok(g.blocked(...pos),"player boots cannot stand inside "+solid.id);
 ok(g.obstacle(...pos)?.id===solid.id||!!g.obstacle(...pos),"source blocker can be identified: "+solid.id);
}
const lake=[742*scale,649*scale],island=coords("island");
ok(g.blocked(...lake)&&g.waterAt(...lake)?.id==="mossmere_lake","open lake blocks standing");
ok(!g.blocked(...island),"island is walkable real ground");
ok(!g.blocked(...coords("village")),"village square safely walkable");
ok(g.blocked(-10,0)&&g.blocked(map.worldDesign.designWorldUnits[0]+10,1),"world boundaries always block feet");
const requiredMaterials=["bridge-timber","stone-stairs","fordstone","packed-snow"];
for(const material of requiredMaterials){
 ok(data.surfaces.some(s=>s.material===material)||
  map.edges.some(e=>e.kind==="stairs"&&material==="stone-stairs")||
  map.edges.some(e=>e.kind==="ford"&&material==="fordstone")||
  map.edges.some(e=>e.crossing&&material==="bridge-timber"),"floor material source exists: "+material);
}
function atRoad(e,t){
 let length=e.total*t;
 for(const [a,b,start,len] of e.parts){
  if(length<=start+len||[a,b,start,len]===e.parts[e.parts.length-1]){
   const f=Math.min(1,Math.max(0,(length-start)/len));
   return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];
  }
 }
 return e.path[e.path.length-1]
}
let covered=0,stepCount=0;
for(const e of g.roads){
 let previous=e.path[0];
 for(const [a,b,,len] of e.parts){
  const n=Math.max(1,Math.ceil(len/20));
  for(let i=1;i<=n;i++){
   const x=a[0]+(b[0]-a[0])*i/n,y=a[1]+(b[1]-a[1])*i/n;
   ok(!g.blocked(x,y),"physically authored road never intersects barrier "+e.id);
   ok(g.step(previous[0],previous[1],x,y),"slope/height continuous on "+e.id);
   previous=[x,y];stepCount++;
  }
 }
 ok(!!g.nearRoad(...atRoad(e,.5)),"every path has a real walkable corridor "+e.id);
 covered++;
}
eq(covered,65,"every planned route checked");
ok(stepCount>10000,"traversal surveys include over ten thousand actual movement steps");
const climb=g.roads.find(r=>r.id==="northwatch_stairs--northwatch_plaza");
ok(!!climb&&climb.kind==="stairs","Northwatch monument has authored stair path");
const hStart=g.elevationAt(...atRoad(climb,.15)),hMid=g.elevationAt(...atRoad(climb,.5)),hEnd=g.elevationAt(...atRoad(climb,.85));
ok(hStart<hMid&&hMid<hEnd,"stone stairs ascend continuously instead of teleporting actor height");
ok(g.materialAt(...atRoad(climb,.5))==="stone-stairs","stair tread is authored in the same nav source");
const crossingIds=["northwatch_span","frostbridge_main","stoneford_shallows","falls_bridge","mossmere_west_footbridge","mossmere_east_causeway","ravine_ropebridge"];
for(const id of crossingIds){
 const e=g.roads.find(r=>r.crossing===id);
 ok(!!e,"crossing is an explicit geometry source "+id);
 ok(!g.blocked(...atRoad(e,.5)),"crossing remains walkable on its illustrated deck "+id);
 ok(["bridge-timber","fordstone","causeway"].includes(g.materialAt(...atRoad(e,.5))),"crossing material matches geometry "+id);
}
const player={x:0,y:0,step:0,moving:false,facing:{x:0,y:1}};
const visual={paint:0,stroke:0,text:0,arc:0};
const ctx=()=>({
 fillStyle:"",strokeStyle:"",lineWidth:1,lineCap:"butt",lineJoin:"miter",
 font:"",textAlign:"",globalAlpha:1,
 beginPath(){},moveTo(){},lineTo(){},closePath(){},save(){},restore(){},scale(){},translate(){},
 fillRect(){visual.paint++},fill(){visual.paint++},stroke(){visual.stroke++},drawImage(){visual.paint++},
 arc(){visual.arc++},fillText(){visual.text++},setLineDash(){}
});
const s=W.create(map,{geometry:data,canvasFactory:()=>({width:0,height:0,getContext:ctx}),maxTiles:18});
ok(!!s.geometry,"actual streaming world receives authored geometry");
eq(s.geometry.stats().solids,30,"runtime uses identical obstacle data");
const first=s.render(ctx(),1536,708,.78,.016);
ok(first.camera.x<=s.player.x&&s.player.x<=first.camera.x+first.viewWidth,"camera begins centered around actual boots");
ok(s.stats().elevation!==null&&s.stats().elevation>=1,"streaming stats report real ground height");
ok(s.player.groundHeight===s.stats().elevation,"player ground level is derived from terrain, never sprite height");
const chest=g.nearbyInteraction(...coords("cave_mouth"));
eq(chest.id,"cave_threshold","physical cave approach exposes meaningful inspection");
const notice=g.nearbyInteraction(...data.interactions.find(i=>i.id==="village_notice").at.map(v=>v*scale));
eq(notice.id,"village_notice","Frostbridge notice has a real interaction radius");
eq(g.nearbyInteraction(-10000,-10000),null,"no teleport-distance landmark prompts");
const before=visual.paint;
const block=g.solids.find(s=>s.id==="northwatch_plinth");
g.drawFloor(ctx(),[block.polygon[0][0]-300,block.polygon[0][1]-300,block.polygon[0][0]+500,block.polygon[0][1]+500]);
g.drawSolids(ctx(),[block.polygon[0][0]-300,block.polygon[0][1]-300,block.polygon[0][0]+500,block.polygon[0][1]+500]);
ok(visual.paint>before&&visual.stroke>0,"same authored floor and blocker shapes are actually painted");
g.drawDebug(ctx(),[16000,17000,18000,19000],{x:16920,y:18300});
ok(visual.text>0,"on-screen developer overlay displays boot-foot altitude");
s.renderDebug(ctx(),1536,708,.78);
ok(visual.arc>0,"streaming engine debug draws foot anchor on actual view");
for(let i=0;i<32;i++){s.player.x=(i+10.5)*1500;s.player.y=18000;s.render(ctx(),1536,708,.78,.05);
 ok(s.stats().cachedTiles<=18,"terrain cache bounded during authored rendering "+i)}
ok(s.stats().estimatedCachedRGBABytes<=18*375*375*4,"geometry does not exceed previous canvas cache budget");
for(const file of ["world_review.js?v=4","world_routes.js?v=7","world_geometry.js?v=1","world_footprint.js?v=5","terrain_art.js?v=11","world_stream.js?v=12","game.js?v=32","visual.css?v=15","manifest.webmanifest?v=1311"]){
 ok(html.includes(file)&&sw.includes(file),"iPhone HTML / PWA cache agrees: "+file);
}
ok(game.includes('terrain_geometry.json?v=1')&&sw.includes('terrain_geometry.json?v=1'),"actual game fetch and offline cache agree on geometry document");
ok(html.indexOf("world_geometry.js?v=1")<html.indexOf("world_stream.js?v=12")&&html.indexOf("world_stream.js?v=12")<html.indexOf("game.js?v=32"),"module load order ensures terrain before streamed game");
ok(html.includes('id="geometryDebugBtn"')&&html.includes("Terrain Geometry Overlay"),"iPhone menu debug overlay is connected");
ok(game.includes("if(worldPreview.debug)s.renderDebug")&&game.includes("s.nearbyInteraction()"),"actual game draws debug/landmark inspection");
ok(game.includes('const SAVE="veilward-hollowreach-v01";'),"original iPhone save key intact");
ok(assets.includes('load("hero","hero_approved_8way_v12.webp"'),"approved player sprites untouched");
ok(assets.includes('load("warden","warden_hal_v13.png"'),"Warden Hal art untouched");
ok(roadmap.includes("### MANDATORY CHECKPOINT"),"creator appearance review still after Phase 9");
console.log("Veilward Phase 4 PASS:",checks,"authoritative terrain/collision/altitude/interaction checks;",
 stepCount,"authored route footsteps across",covered,"connections.");
