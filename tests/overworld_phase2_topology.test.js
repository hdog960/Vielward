/* VEILWARD Phase 2 — complete global outdoor blueprint topology tests.
 * Plan-level only. These checks cannot substitute for in-game collision
 * or creator art approval. Run: node tests/overworld_phase2_topology.test.js
 */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs");
const render=require("../scripts/render_overworld_blueprint.js").render;
const map=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const roadmap=fs.readFileSync("OVERWORLD_REBUILD_ROADMAP.md","utf8");
const readme=fs.readFileSync("docs/overworld/MASTER_MAP.md","utf8");
const svg=fs.readFileSync("docs/overworld/MASTER_MAP.svg","utf8");
const source=fs.readFileSync("game.js","utf8");
const legacy=JSON.parse(fs.readFileSync("docs/overworld/legacy_scene_anchors.json","utf8"));
let checks=0;const yes=(condition,message)=>{assert.ok(condition,message);checks++};
const eq=(a,b,message)=>{assert.equal(a,b,message);checks++};
const uniq=a=>new Set(a).size===a.length;
const world=map.worldDesign;
const byNode=new Map(map.nodes.map(n=>[n.id,n]));
const byRegion=new Map(map.regions.map(r=>[r.id,r]));
const byEdge=new Map(map.edges.map(e=>[e.id,e]));
const hydro=new Map(map.waterways.map(w=>[w.id,w]));
const pointOK=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&p[0]>=0&&p[1]>=0&&p[0]<=world.worldBounds[0]&&p[1]<=world.worldBounds[1];
function segments(points){return points.slice(1).map((p,i)=>[points[i],p])}
function crosses(a,b,c,d){
 const side=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
 return side(a,b,c)*side(a,b,d)<0 && side(c,d,a)*side(c,d,b)<0;
}
function inside(p,polygon){
 let result=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j];
  if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])result=!result;
 }return result;
}
const polyEdges=polygon=>polygon.map((p,i)=>[p,polygon[(i+1)%polygon.length]]);
const routePoints=e=>[byNode.get(e.from).point,...(e.via||[]),byNode.get(e.to).point];
const routeSegments=e=>segments(routePoints(e));
const pathLength=e=>routeSegments(e).reduce((v,[a,b])=>v+Math.hypot(a[0]-b[0],a[1]-b[1]),0);
function lookup(a,b){return map.edges.find(e=>(e.from===a&&e.to===b)||(e.from===b&&e.to===a))}
function reachable(start,disabled=new Set()){
 const seen=new Set([start]),stack=[start];
 while(stack.length){const n=stack.pop();for(const e of map.edges){
  if(disabled.has(e.id))continue;
  const next=e.from===n?e.to:e.to===n?e.from:null;
  if(next&&!seen.has(next)){seen.add(next);stack.push(next)}
 }}return seen;
}
function pathLengthInWorld(path){return path.slice(1).reduce((dist,id,i)=>{const e=lookup(path[i],id);if(!e)throw Error("missing road to "+id);return dist+pathLength(e)*world.worldUnitScale},0)}
function pathDistance(path){let dist=0;for(let i=1;i<path.length;i++){const e=lookup(path[i-1],path[i]);yes(!!e,"expected connected itinerary segment "+path[i-1]+"→"+path[i]);dist+=pathLength(e)}return dist;}
eq(map.schema,"veilward.world-blueprint.v1","versioned map schema");
eq(map.phase,2,"Phase 2 only");
eq(map.baseGameVersion,"1.2.6","v1.2.6 remains the runtime baseline");
yes(map.status.includes("not implemented in live game"),"plan never claims to be a playable overhaul");
eq(map.regions.length,12,"all 12 approved macro regions");
eq(map.nodes.length,48,"48 named global world anchors");
eq(map.edges.length,65,"65 physically planned travel links");
eq(map.waterways.length,3,"river, lake and canyon authored");
yes(uniq(map.regions.map(r=>r.id)),"unique region IDs");
yes(uniq(map.nodes.map(n=>n.id)),"unique node IDs");
yes(uniq(map.edges.map(e=>e.id)),"unique road/bridge IDs");
yes(uniq(map.waterways.map(w=>w.id)),"unique waterway IDs");
eq(world.designWorldUnits[0],world.worldBounds[0]*world.worldUnitScale,"global width agrees with map scale");
eq(world.designWorldUnits[1],world.worldBounds[1]*world.worldUnitScale,"global height agrees with map scale");
eq(world.designWorldUnits[0],world.chunkPlan.columns*world.chunkPlan.worldUnits,"planned chunk grid spans width");
eq(world.designWorldUnits[1],world.chunkPlan.rows*world.chunkPlan.worldUnits,"planned chunk grid spans height");
eq(world.chunkPlan.totalPlannedCells,world.chunkPlan.columns*world.chunkPlan.rows,"planned chunk count exact");
yes(world.chunkPlan.renderAssetsNotBuilt===true,"chunks not misrepresented as produced art");
yes(world.playerWalkingSpeedAssumption>0,"travel estimate clearly has movement assumption");
for(const r of map.regions){
 yes(pointOK(r.center),"valid region marker "+r.id);
 yes(r.purpose.length>15,"intentional regional purpose "+r.id);
 yes(r.influencePolygon.length>=4&&r.influencePolygon.every(pointOK),"region influence outline "+r.id);
 yes(r.elevationBand>=1&&r.elevationBand<=6,"altitude region "+r.id);
}
const mandatory=["hollowreach","northwatch","coldpine","frost_river","thawline","greenwood",
 "greenwood_falls","mossmere","heatherwood","old_crown","smugglers","worldscar"];
for(const id of mandatory)yes(byRegion.has(id),"all approved regions present: "+id);
for(const node of map.nodes){
 yes(pointOK(node.point),"point inside world "+node.id);
 yes(byRegion.has(node.region),"belongs to known region "+node.id);
 yes(Number.isInteger(node.elevation)&&node.elevation>=1&&node.elevation<=6,"height band "+node.id);
 yes(node.purpose.length>5,"named landmark purpose "+node.id);
}
const degree=new Map(map.nodes.map(n=>[n.id,0]));
const undirectedEdges=new Set();
for(const edge of map.edges){
 yes(byNode.has(edge.from)&&byNode.has(edge.to),"endpoints exist "+edge.id);
 yes(edge.from!==edge.to,"no self roads "+edge.id);
 const undirected=[edge.from,edge.to].sort().join("|");
 yes(!undirectedEdges.has(undirected),"no duplicate reverse road "+edge.id);
 undirectedEdges.add(undirected);
 yes(edge.walkable===true,"all planned outdoor paths walkable "+edge.id);
 yes(edge.kind!=="portal","no invisible outdoor travel action "+edge.id);
 yes((edge.via||[]).every(pointOK),"waypoints valid "+edge.id);
 const a=byNode.get(edge.from),b=byNode.get(edge.to);
 yes(Math.abs(a.elevation-b.elevation)<=1||["stairs","switchback"].includes(edge.slope),
  "elevation change uses grade/stairway "+edge.id);
 if(a.elevation!==b.elevation)yes(!!edge.slope,"changed elevation has explicit ramp/stair/switchback "+edge.id);
 degree.set(edge.from,degree.get(edge.from)+1);degree.set(edge.to,degree.get(edge.to)+1);
}
for(const n of map.nodes){
 const d=degree.get(n.id);yes(d>=1,"no isolated landmark node "+n.id);
 if(d===1)yes(["joren","market","cave_mouth"].includes(n.id),"only real endpoints permitted "+n.id);
}
eq(reachable("village").size,map.nodes.length,"every global landmark connected to Hollowreach");
for(const r of map.regions)yes(map.nodes.some(n=>n.region===r.id&&reachable("village").has(n.id)),"all 12 regions reachable "+r.id);
yes(map.edges.length>=map.nodes.length+8,"road topology contains multiple loops");
const crossings=map.edges.filter(e=>e.crossing);
eq(crossings.length,7,"exactly seven named river, lake and canyon crossings");
yes(uniq(crossings.map(e=>e.crossing)),"each crossing has a permanent ID");
for(const e of crossings){
 yes(hydro.has(e.waterway),"crossing names real water/chasm "+e.id);
 yes(e.bankTransition&&e.bankTransition.length===2,"crossing has two named physical sides "+e.id);
 yes(["bridge","ford","causeway"].includes(e.kind),"water/chasm cross via a physical mechanism "+e.id);
}
const glacial=hydro.get("frostbridge_river"),lake=hydro.get("mossmere_lake"),chasm=hydro.get("smugglers_chasm");
yes(glacial.centerline.length>=6&&glacial.flow.includes("north")&&glacial.flow.includes("south"),"river has believable upstream/downstream chain");
yes(lake.closedPolygon.length>=5&&lake.islandPolygon.length>=4,"lake with authored central island");
yes(inside(byNode.get("island").point,lake.islandPolygon),"the destination is ON the lake island");
yes(!inside(byNode.get("mossmere_w").point,lake.closedPolygon),"west landing stands on land, not water");
yes(!inside(byNode.get("mossmere_e").point,lake.closedPolygon),"east landing stands on land, not water");
const riverSegments=segments(glacial.centerline),chasmSegments=segments(chasm.centerline),lakeSides=polyEdges(lake.closedPolygon);
let markedRiver=0;
for(const e of map.edges){
 const polyline=routeSegments(e);
 for(const [a,b] of polyline){
  const crossesRiver=riverSegments.some(([c,d])=>crosses(a,b,c,d));
  if(crossesRiver){yes(e.waterway==="frostbridge_river"&&!!e.crossing,"no unmarked crossing of the main river "+e.id);markedRiver++}
  const intoLake=inside([(a[0]+b[0])/2,(a[1]+b[1])/2],lake.closedPolygon)||lakeSides.some(([c,d])=>crosses(a,b,c,d));
  if(intoLake)yes(e.waterway==="mossmere_lake"&&!!e.crossing,"no dry road cut through Mossmere lake "+e.id);
  const overChasm=chasmSegments.some(([c,d])=>crosses(a,b,c,d));
  if(overChasm)yes(e.waterway==="smugglers_chasm"&&!!e.crossing,"chasm crossing requires real rope bridge "+e.id);
 }
}
yes(markedRiver>=4,"four explicit river bridges/fords cross main river");
const islandLinks=map.edges.filter(e=>e.from==="island"||e.to==="island");
eq(islandLinks.length,2,"island has exactly two described access crossings");
yes(islandLinks.every(e=>e.waterway==="mossmere_lake"&&!!e.crossing),"no invisible shore→island link");
const noIslandBridges=new Set(islandLinks.map(e=>e.id));
yes(!reachable("village",noIslandBridges).has("island"),"island cannot be reached without a visible causeway/bridge");
const alt=world.alternateSnowForestRoutes;
eq(alt.length,3,"three creator-requested Hollowreach→Greenwood approaches");
const altCrossings=[];
for(const [i,p]of alt.entries()){
 eq(p[0],"village","route starts in Hollowreach #"+i);
 eq(p[p.length-1],"greenwood_hearth","route reaches Greenwood #"+i);
 const distance=pathDistance(p);
 yes(distance>250,"route is nontrivial, not portal teleport #"+i);
 const routeEdges=p.slice(1).map((node,j)=>lookup(p[j],node));
 const list=routeEdges.filter(e=>!!e.crossing).map(e=>e.crossing);
 eq(list.length,1,"each main alternate route has one actual river crossing #"+i);
 altCrossings.push(list[0]);
}
yes(uniq(altCrossings),"three different physical crossing choices");
for(const crossing of altCrossings){
 const disabled=new Set(map.edges.filter(e=>e.crossing===crossing).map(e=>e.id));
 yes(reachable("village",disabled).has("greenwood_hearth"),"Greenwood remains reachable if "+crossing+" is disabled");
}
const estimates=world.travelEstimates;
eq(estimates.villageToGreenwood.length,3,"three route travel clocks");
for(const e of estimates.villageToGreenwood){
 yes(Math.abs(e.projectedMinutes-pathLengthInWorld(e.path)/world.playerWalkingSpeedAssumption/60)<.025,
  "route minute arithmetic "+e.id)
}
for(const [region,[min,max]] of Object.entries(world.travelDensityPlan.encountersByRegion)){
 yes(byRegion.has(region)&&min>=0&&max>=min&&max<=5,"environmental encounter guideline "+region)
}
const quest=world.mainQuestRoute;
eq(quest[0],"village","quest starts in village");
eq(quest[quest.length-1],"cave_mouth","intro quest ends at real cave threshold");
pathDistance(quest);
yes(byNode.get("cave_mouth").kind==="entrance","quest ends at physical cave entrance");
yes(byNode.get("joren").kind==="threshold","workshop is real doorway, not an outdoor portal");
yes(map.environment.contours.some(c=>c.name.includes("Thawline")),"snowmelt contour authored");
yes(map.environment.climateGradient.thawline.includes("Blended"),"natural winter→forest transition");
yes(map.environment.elevationBands.length===6,"six height bands to co-author with geometry");
yes(map.environment.resources.length>=5,"named harvestable/purpose inventory");
yes(map.environment.waterRules.swimmingImplemented===false,"water is non-traversable except named crossings");
yes(roadmap.includes("### MANDATORY CHECKPOINT")&&roadmap.includes("Phase 10 is locked"),"creator overworld appearance review gate preserved");
yes(map.creatorAppearanceReviewGate.afterPhase===9&&map.creatorAppearanceReviewGate.beforePhase===10,"blueprint records same hard stop");
yes(source.includes("const APP_VERSION="),"runtime versioned; topology test remains valid for future versions");
eq(legacy.legacySaveKey,"veilward-hollowreach-v01","legacy save anchor preserved for future mapping");
yes(readme.includes("DESIGN BLUEPRINT")&&readme.includes("Phase 3"),"master map notes plainly mark implementation status");
yes(svg.includes("<svg")&&svg.includes("BLUEPRINT")&&svg.includes("Hollowreach"),"creator-readable master plan render exists");
eq(svg,render(map),"SVG deterministic parity with authoring geography");
yes(svg.includes("Northwatch")&&svg.includes("Mossmere")&&svg.includes("Worldscar"),"map shows named regions");
console.log("Veilward Phase 2 PASS:",checks,"topology/design assertions; 12 regions, 48 anchors, 65 links, 7 crossings, 3 independent routes.");
