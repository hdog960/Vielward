/* Phase 9 R40 — actual Frostbridge water-to-forest bank without collision lies */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const read=f=>fs.readFileSync(f,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json")),
 terrain=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const host={console};host.window=host;
vm.runInNewContext(read("world_geometry.js"),host);
vm.runInNewContext(read("terrain_art.js"),host);
const geo=host.VeilwardGeometry.create(model,terrain);
let fills=0,gradients=[],strokes=0;
function canvasContext(){
 return{save(){},restore(){},fillRect(){fills++},drawImage(){},
  translate(){},scale(){},moveTo(){},lineTo(){},closePath(){},beginPath(){},
  arc(){},clip(){},stroke(){strokes++},quadraticCurveTo(){},fill(){fills++},
  createImageData(w,h){return{data:new Uint8ClampedArray(w*h*4)}},
  putImageData(){},
  createLinearGradient(...coordinates){
   const g={coordinates,stops:[],addColorStop(t,color){this.stops.push([t,color])}};
   gradients.push(g);return g
  }}
}
const art=host.VeilwardTerrainArt.create(model,geo,{
 canvasFactory:()=>({width:0,height:0,getContext:()=>canvasContext()})
});
const channel=model.waterways.find(w=>w.id==="frostbridge_river"),
 line=channel.centerline.slice(6).map(p=>p.map(x=>x*60));
assert.ok(line.length>=3,"same original R35d physical Frostbridge source");
const zone=[Math.min(...line.map(p=>p[0]))-500,
 Math.min(...line.map(p=>p[1]))-500,
 Math.max(...line.map(p=>p[0]))+500,
 Math.max(...line.map(p=>p[1]))+500];
const bands=art.fallsShoreBands(zone);
assert.ok(bands.length>=6,"world-aligned bank sections on both source shore sides");
assert.ok(bands.some(q=>q.side===-1)&&bands.some(q=>q.side===1));

// R40b: the wash must share the SAME vertex normal as the R35d river
// polygon, including bends; otherwise a triangular hard edge appears
// between the visible water mask and the gradient.
for(const q of bands){
 const centerline=line;
 for(const [vertex,normal] of [[q.index-1,q.n0],[q.index,q.n1]]){
  const before=centerline[Math.max(0,vertex-1)],
   after=centerline[Math.min(centerline.length-1,vertex+1)];
  const dx=after[0]-before[0],dy=after[1]-before[1],
   len=Math.hypot(dx,dy)||1;
  assert.ok(Math.abs(normal.x+dy/len)<1e-9&&
   Math.abs(normal.y-dx/len)<1e-9,
   "shoreline normal must coincide with physical water mask at every bend");
 }
}

assert.ok(bands.every(q=>q.waterRadius===180&&q.inner===114&&q.outer===286),
 "R40 transitions cover both sides of unchanged 180-unit physical shore");
for(const q of bands){
 assert.ok(q.index>0&&q.index<line.length);
 assert.ok(q.length>0);
 assert.ok(geo.waterAt(...q.a,0)?.id==="frostbridge_river",
  "water center remains the same collision-backed source");
 const n=q.n0,inner=[q.a[0]+q.side*n.x*q.inner,
  q.a[1]+q.side*n.y*q.inner];
 // At ordinary (non-crossing) source sites the water half of R40's
 // feather still lies within the UNCHANGED physical water hazard.
 if(!q.nearPhysicalCrossing&&q.length>180)
  assert.ok(!!geo.waterAt(...inner,0),
   "the aquatic half of the gradient is genuinely physical water");
}
const n=art.paintFallsShorelineTransition(canvasContext(),zone);
assert.ok(n>=4,"the real shoreline is shaded continuously across the zone");
assert.ok(gradients.length>=n,"every segment uses a native local cross-bank gradient");
// R40q: pigment follows the *interpolated* source-bank normal at bends.
// Its magnitude may be shorter than 172 units where adjacent normals
// diverge; demanding exactly 172 would force renormalization and detach
// the watercolor stops from the physical bank polygon (R40l regression).
// Reject a collapsed or oversized gradient without imposing a false
// unit-normal invariant on curved source geometry.
for(const gradient of gradients){
 const [x0,y0,x1,y1]=gradient.coordinates;
 const span=Math.hypot(x1-x0,y1-y0);
 assert.ok(Number.isFinite(span)&&span>20&&span<=172+1e-6,
  "bank gradient must remain finite, visible and within the source bank width");
}

assert.ok(gradients.some(g=>g.stops.length===6&&g.stops[0][1].endsWith(",0)")&&
 g.stops[g.stops.length-1][1].endsWith(",0)")),
 "both ends of shore pigment return to source terrain without a hard boundary");
assert.equal(art.paintFallsShorelineTransition(canvasContext(),[0,0,500,500]),0,
 "painting cannot leak onto unrelated regions");
assert.equal(art.fallsShoreBands([0,0,500,500]).length,0);
assert.ok(art.diagnostics().fallsPhysicalShoreFeatherR40);
assert.ok(art.diagnostics().fallsShoreCollisionUntouchedR40);
assert.equal(model.nodes.length,48);
assert.equal(model.edges.length,65);
assert.equal(model.edges.filter(e=>e.crossing).length,7);
// R40e: current strokes must check the full quadratic footprint against
// the authoritative physical crossing, not only their center sample.
const source=read("terrain_art.js");
assert.ok(source.includes("const startX=x-tx*streak*.55,startY=y-ty*streak*.55"));
assert.ok(source.includes("const curveTouchesCrossing=[0,.25,.5,.75,1].some(t=>{"),
 "R40g checks five positions ON the actual quadratic water stroke");
assert.ok(source.includes("sx=u*u*startX+2*u*t*controlX+t*t*endX")&&
 source.includes("sy=u*u*startY+2*u*t*controlY+t*t*endY"),
 "crossing checks follow the painted Bezier curve, not an off-curve handle");
assert.ok(source.includes("if(curveTouchesCrossing)continue;"),
 "strokes intersecting an original bridge must be skipped");
for(const path of ["index.html","sw.js"])
 assert.ok(read(path).includes("&brush=40e"),"R40e cache key matches deployed source");
assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
for(const path of ["index.html","sw.js"]){
 const t=read(path);
 assert.ok(t.includes("terrain_art.js?v=32&rev=25&falls=34b&palette=34c&channel=35d&shore=40&bend=40c"),
 "PWA and web use the same R40 terrain script");
}
const capture=read("scripts/visual_capture.mjs");
assert.ok(capture.includes('capture(page,"GREENWOOD_R40_FEATHERED_RIVERBANK")'));
assert.ok(capture.includes("R40_PHYSICAL_SHORELINE_GRADIENT"));
console.log("R40 PASS: "+n+" watercolor native shoreline panels at original physical water edge, "+
 gradients.length+" cross-bank gradients, zero topology/collision/save changes");
