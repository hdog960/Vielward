/* R28: curated Hearth woodland is the collision source, not added wallpaper.
 * Technical pass cannot certify the final painted look on a physical iPhone. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const geoData=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const land=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
const originalNodes=JSON.stringify(model.nodes),originalEdges=JSON.stringify(model.edges);
const host={console};host.window=host;
for(const file of ["world_geometry.js","world_climate.js","world_footprint.js","world_setpieces.js"])
 vm.runInNewContext(read(file),host,{filename:file});
const geometry=host.VeilwardGeometry.create(model,geoData),
 climate=host.VeilwardClimate.create(model),
 foot=host.VeilwardFootprint.create(model,geometry,land,{climate}),
 setpieces=host.VeilwardSetpieces.create(model,geometry,{footprint:foot,climate});
const unit=model.worldDesign.worldUnitScale,
 hearth=model.nodes.find(n=>n.id==="greenwood_hearth"),
 cx=hearth.point[0]*unit,cy=hearth.point[1]*unit,
 bounds=[cx-1100,cy-1020,cx+1100,cy+1020],
 trees=foot.groves(bounds,500).filter(o=>o.authoredGrove);
assert.ok(trees.length>=2&&trees.length<=9,
 "curated physically rooted canopy should add genuine limited old growth");
assert.equal(trees.length,foot.stats().hearthRootedOldGrowth);
assert.equal(new Set(trees.map(o=>o.id)).size,trees.length);
let aroundView=0;
for(const o of trees){
 assert.equal(o.solid,true);
 assert.ok(["oak","pine"].includes(o.kind));
 assert.equal(o.biome,"greenwood");
 assert.equal(foot.blocked(o.x,o.y,3),true,"sprite and collider share EXACT root");
 assert.equal(geometry.waterAt(o.x,o.y,o.radius),null,"no water tree");
 assert.equal(geometry.obstacle(o.x,o.y,o.radius),null,"no solid overlap");
 for(const e of geometry.roads)for(const [a,b] of e.parts){
  const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy,
   t=l?Math.max(0,Math.min(1,((o.x-a[0])*dx+(o.y-a[1])*dy)/l)):0;
  assert.ok(Math.hypot(o.x-a[0]-dx*t,o.y-a[1]-dy*t)>e.halfWidth+o.radius+35,
   "the original physical road corridor remains visible and walkable "+e.id);
 }
 if(Math.abs(o.x-cx)<640&&o.y>cy-430&&o.y<cy+650)aroundView++;
}
assert.ok(aroundView>=2,"new trees must materially frame the real landscape camera");
 const visible=trees.filter(o=>Math.abs(o.x-cx)<470&&o.y-cy>155&&o.y-cy<630);
 assert.ok(visible.length>=2,"two source-painted physical canopies must intersect the phone view");
const house=setpieces.objects.filter(o=>o.anchor==="greenwood_hearth"&&o.kind==="forest_cottage");
assert.equal(house.length,1,"original illustrated Hearth cottage remains present");
for(const id of ["greenwood_hearth","hermit"]){
 const n=model.nodes.find(n=>n.id===id);
 assert.equal(foot.blocked(n.point[0]*unit,n.point[1]*unit,12),false);
}
let walkSamples=0;
for(const road of geometry.roads){
 for(const [a,b,,len] of road.parts){
  for(let k=0;k<=len;k+=48){
   const t=k/len,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;
   assert.equal(foot.blocked(x,y,10),false,"real roadway safe "+road.id);
   walkSamples++
  }
 }
}
assert.ok(walkSamples>4000);
assert.equal(JSON.stringify(model.nodes),originalNodes);
assert.equal(JSON.stringify(model.edges),originalEdges);
assert.ok(read("index.html").includes("world_footprint.js?v=5&rev=28b"));
assert.ok(read("sw.js").includes("source-glade-habitat-r25b-r26-r27-r28b"));
assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));

// R28b diagnostic only: world-space root/visible-camera placement audit.
// Not a gameplay change and not evidence of an art acceptance milestone.
const sourceRoots=trees.map(o=>({id:o.id,dx:Math.round(o.x-cx),
 dy:Math.round(o.y-cy),kind:o.kind,r:o.radius}));
const free=[];
function roadGap(x,y){
 let best=Infinity;
 for(const e of geometry.roads)for(const [a,b] of e.parts){
  const dx=b[0]-a[0],dy=b[1]-a[1],d2=dx*dx+dy*dy,
   t=d2?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/d2)):0;
  best=Math.min(best,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t)-e.halfWidth)
 }
 return best
}
const protectedSites=[[-400,160,230],[350,300,158],[-260,280,150],[300,-430,135]];
for(let dy=-160;dy<=640;dy+=65)for(let dx=-585;dx<=585;dx+=65){
 const x=cx+dx,y=cy+dy;
 const pro=Math.min(...protectedSites.map(([px,py,pr])=>Math.hypot(dx-px,dy-py)-pr));
 const center=Math.hypot(dx,dy);
 if(foot.regionAt(x,y)?.id!=="greenwood"||pro<82||center<270||
    roadGap(x,y)<137||foot.blocked(x,y,64)||
    geometry.waterAt(x,y,64)||geometry.obstacle(x,y,64))continue;
 free.push({dx,dy,road:Math.round(roadGap(x,y)),pro:Math.round(pro)});
}
const visible=free.filter(o=>o.dx>-470&&o.dx<470&&o.dy>-80&&o.dy<565);
console.log("R28_VIEW_DEBUG "+JSON.stringify({
 sourceRoots,
 viewFree:visible.slice(0,110),viewFreeCount:visible.length,
 totalCandidateFree:free.length
}));
console.log("R28 PASS: "+trees.length+" real old-growth trees, "+
 aroundView+" in landscape frame; "+walkSamples+
 " source road points; original cottage, save and graph preserved; visual approval 0%");
