/* VEILWARD 1.2.8 — Phase 4 co-authored outdoor geometry.
 * Coordinates come from terrain_geometry.json + world_blueprint.json.
 * Floor, obstruction, stair and interaction visuals use these SAME shapes.
 * Player sprite geometry is not involved: x/y is always the boot point.
 */
(function(){
"use strict";
const VERSION="1.2.8";
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
function inside(p,poly){
 let result=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if(a[1]>p[1]!==b[1]>p[1]&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])result=!result
 }
 return result
}
function closest(x,y,a,b){
 const dx=b[0]-a[0],dy=b[1]-a[1],den=dx*dx+dy*dy;
 const t=den?clamp(((x-a[0])*dx+(y-a[1])*dy)/den,0,1):0;
 return {x:a[0]+t*dx,y:a[1]+t*dy,t,d:Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)}
}
function trace(x,y,poly){
 let min=Infinity;
 for(let i=0;i<poly.length;i++)min=Math.min(min,closest(x,y,poly[i],poly[(i+1)%poly.length]).d);
 return min
}
function lineDistance(x,y,poly){
 let min=Infinity;for(let i=1;i<poly.length;i++)min=Math.min(min,closest(x,y,poly[i-1],poly[i]).d);
 return min
}
function validate(model,data){
 if(!model||model.schema!=="veilward.world-blueprint.v1")throw Error("Missing outdoor world blueprint");
 if(!data||data.schema!=="veilward.terrain-geometry.v1")throw Error("Missing co-authored terrain geometry");
 const units=model.worldDesign.worldUnitScale;
 if(units!==60)throw Error("Unexpected Phase 4 plan scale");
 const ids=new Set();
 for(const obj of [...data.surfaces,...data.solids,...data.interactions]){
  if(ids.has(obj.id))throw Error("Duplicate terrain element "+obj.id);ids.add(obj.id);
 }
 if(!data.solids.some(s=>s.material==="cliff-face")||!data.solids.some(s=>s.material==="tree-trunk"))throw Error("No real terrain solids");
 if(!data.groundDefaults?.footAnchor?.includes("boots"))throw Error("Independent boot-point contract missing");
 return data
}
const materialColors={
 "packed-snow":"#b5c1c7","stone-snow":"#a8b5b8","pale-stone":"#bbb8ae",
 "stone-road":"#9e968a","violet-stone":"#9689a6","moss-stone":"#718878",
 "island-grass":"#8ba47b","timber-wall":"#57483f","wood-post":"#654e3f",
 "fence":"#6a5f55","pine-trunk":"#394d40","tree-trunk":"#435b48",
 "stone-plinth":"#676c73","railing":"#66626b","lantern-post":"#b39b6d",
 "reed-marker":"#596d48","ruin-column":"#736b79","cliff-face":"#40454c"
};
function create(model,data){
 validate(model,data);
 const unit=model.worldDesign.worldUnitScale,width=model.worldDesign.designWorldUnits[0],height=model.worldDesign.designWorldUnits[1];
 const pt=p=>p.map(v=>v*unit);
 const nodes=new Map(model.nodes.map(n=>[n.id,n]));
 const roads=model.edges.map(e=>{
  const a=nodes.get(e.from),b=nodes.get(e.to),path=[a.point,...(e.via||[]),b.point].map(pt);
  const parts=[],lengths=[];let total=0;
  for(let i=1;i<path.length;i++){const length=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);parts.push([path[i-1],path[i],total,length]);total+=length}
  return {...e,path,parts,total,fromHeight:a.elevation,toHeight:b.elevation,
   halfWidth:e.crossing?data.groundDefaults.crossingHalfWidthWorld:
    e.kind.includes("road")?82:data.groundDefaults.routeFloorHalfWidthWorld};
 });
 const solids=data.solids.map(s=>({...s,
  ...(s.shape==="polygon"?{polygon:s.points.map(pt)}:{}),
  ...(s.shape==="circle"?{cx:s.x*unit,cy:s.y*unit,radius:s.r*unit}:{}),
  ...(s.shape==="segment"?{a:pt(s.a),b:pt(s.b),radius:s.radius*unit}:{})
 }));
 const surfaces=data.surfaces.map(s=>({...s,polygon:s.polygon.map(pt)}));
 const interactions=data.interactions.map(i=>({...i,x:i.at[0]*unit,y:i.at[1]*unit,radius:i.radius*unit}));
 const waters=model.waterways.map(w=>({...w,
  polygon:w.closedPolygon?.map(pt)||[],island:w.islandPolygon?.map(pt)||[],
  line:w.centerline?.map(pt)||[]
 }));
 // Index short roads by world chunk; the legacy 1,536-cell grid is not allocated.
 // Only cells overlapping actual authored roads receive an entry.
 const index=new Map(),stride=model.worldDesign.chunkPlan.worldUnits;
 function addGrid(obj,x0,y0,x1,y1){
  for(let iy=Math.floor(y0/stride);iy<=Math.floor(y1/stride);iy++)
   for(let ix=Math.floor(x0/stride);ix<=Math.floor(x1/stride);ix++){
    const key=ix+":"+iy,cell=index.get(key)||new Set();cell.add(obj);index.set(key,cell)
   }
 }
 for(const road of roads)for(const [a,b] of road.parts){
  const extra=road.halfWidth+25;
  addGrid(road,Math.min(a[0],b[0])-extra,Math.min(a[1],b[1])-extra,Math.max(a[0],b[0])+extra,Math.max(a[1],b[1])+extra)
 }
 const candidates=(x,y,r=0)=>{
  const output=new Set();
  for(let yy=Math.floor((y-r)/stride);yy<=Math.floor((y+r)/stride);yy++)
   for(let xx=Math.floor((x-r)/stride);xx<=Math.floor((x+r)/stride);xx++)
    for(const e of index.get(xx+":"+yy)||[])output.add(e);
  return output
 };
 function nearRoad(x,y,filter=()=>true,offset=0){
  let found=null;
  for(const e of candidates(x,y,105)){
   if(!filter(e))continue;
   let nearest={d:Infinity,t:0};
   for(const [a,b,prior,len] of e.parts){
    const hit=closest(x,y,a,b);
    if(hit.d<nearest.d)nearest={d:hit.d,t:e.total?(prior+hit.t*len)/e.total:0}
   }
   if(nearest.d>e.halfWidth+offset)continue;
   if(!found||nearest.d<found.distance)found={edge:e,distance:nearest.d,t:nearest.t};
  }
  return found
 }
 function inSolid(s,x,y,r){
  if(s.shape==="circle")return Math.hypot(x-s.cx,y-s.cy)<=s.radius+r;
  if(s.shape==="segment")return closest(x,y,s.a,s.b).d<=s.radius+r;
  return inside([x,y],s.polygon)||trace(x,y,s.polygon)<=r
 }
 function obstacle(x,y,r=10){
  for(const s of solids)if(inSolid(s,x,y,r))return s;
  return null
 }
 function waterAt(x,y,r=10){
  const p=[x,y];
  for(const w of waters){
   let hit=false;
   if(w.polygon.length){
    const shore=trace(x,y,w.polygon);
    hit=(inside(p,w.polygon)||shore<=r)&&!inside(p,w.island);
   }else if(w.line.length){
    hit=lineDistance(x,y,w.line)<(w.id==="smugglers_chasm"?160:180)+r;
   }
   if(!hit)continue;
   // A crossing is solid grounded surface only above its explicitly drawn
   // physical deck; distance uses the same half-width as rendered planks.
   const deck=nearRoad(x,y,e=>e.crossing&&e.waterway===w.id,-r);
   if(!deck)return w;
  }
  return null
 }
 function blocked(x,y,r=data.groundDefaults.footRadiusWorld){
  if(x<r||y<r||x>width-r||y>height-r)return true;
  return !!(obstacle(x,y,r)||waterAt(x,y,r))
 }
 function materialAt(x,y){
  const deck=nearRoad(x,y,e=>!!e.crossing);
  if(deck)return deck.edge.kind==="ford"?"fordstone":deck.edge.kind==="causeway"?"causeway":"bridge-timber";
  const stair=nearRoad(x,y,e=>e.kind==="stairs");
  if(stair)return "stone-stairs";
  for(const s of surfaces)if(inside([x,y],s.polygon))return s.material;
  const road=nearRoad(x,y);
  if(road)return "path";
  return "open-ground"
 }
 function elevationAt(x,y){
  const way=nearRoad(x,y);
  if(way){
   // Never snap a character to a painting's Y origin: foot level is derived
   // continuously from the source path's authored end elevations.
   return way.edge.fromHeight+(way.edge.toHeight-way.edge.fromHeight)*way.t
  }
  for(const s of surfaces)if(inside([x,y],s.polygon))return s.height;
  const close=model.regions.map(r=>({r,d:Math.hypot(x/unit-r.center[0],y/unit-r.center[1])})).sort((a,b)=>a.d-b.d).slice(0,3);
  let a=0,b=0;for(const q of close){const weight=1/(18+q.d)**2;a+=weight*q.r.elevationBand;b+=weight}
  return b?a/b:3
 }
 function step(fromX,fromY,toX,toY,r=data.groundDefaults.footRadiusWorld){
  if(blocked(toX,toY,r))return false;
  const delta=Math.abs(elevationAt(toX,toY)-elevationAt(fromX,fromY));
  // A steep discontinuity is a cliff edge, never a one-frame teleport.
  // Stairs, ramps, and switchbacks derive their interpolation from the road.
  return delta<=data.groundDefaults.maxUnrampedHeightDelta
 }
 function safePoint(x,y){
  if(!blocked(x,y))return{x,y};
  for(let rad=15;rad<=540;rad+=15)
   for(let i=0;i<32;i++){
    const a=i*Math.PI/16,nx=x+Math.cos(a)*rad,ny=y+Math.sin(a)*rad;
    if(!blocked(nx,ny))return{x:nx,y:ny}
   }
  return{x:Math.max(10,Math.min(width-10,x)),y:Math.max(10,Math.min(height-10,y))}
 }
 function nearbyInteraction(x,y){
  let best=null;
  for(const i of interactions){
   const d=Math.hypot(x-i.x,y-i.y);
   if(d<=i.radius&&(!best||d<best.distance))best={...i,distance:d}
  }
  return best
 }
 function onScreen(points,bounds,padding=200){
  // Overlap of bounding boxes, not vertex-in-viewport: a long bridge or
  // cliff can cross a chunk while both endpoints are outside its bounds.
  const [x0,y0,x1,y1]=bounds;
  return Math.min(...points.map(p=>p[0]))<=x1+padding &&
   Math.max(...points.map(p=>p[0]))>=x0-padding &&
   Math.min(...points.map(p=>p[1]))<=y1+padding &&
   Math.max(...points.map(p=>p[1]))>=y0-padding
 }
 function polygon(ctx,p){
  ctx.beginPath();p.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath()
 }
 function line(ctx,a,b){
  ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b)
 }
 function drawFloor(ctx,bounds){
  for(const s of surfaces){
   if(!onScreen(s.polygon,bounds,0))continue;
   polygon(ctx,s.polygon);ctx.fillStyle=materialColors[s.material]||"#8f9b96";ctx.globalAlpha=.33;ctx.fill();ctx.globalAlpha=1;
   ctx.lineWidth=18;ctx.strokeStyle="rgba(224,225,203,.26)";ctx.stroke()
  }
  // Steps and ramps are drawn from the same road segments as elevationAt().
  // This is a navigational cue, not a pixel-art replacement.
  for(const e of roads){
   if(!["stairs","switchback"].includes(e.kind)&&e.slope!=="stairs"&&e.slope!=="switchback")continue;
   if(!onScreen(e.path,bounds,200))continue;
   for(const [a,b,,len] of e.parts){
    const dx=(b[0]-a[0])/len,dy=(b[1]-a[1])/len;
    if(!Number.isFinite(dx))continue;
    for(let t=30;t<len;t+=65){
     const x=a[0]+dx*t,y=a[1]+dy*t;
     line(ctx,[x-dy*e.halfWidth*.76,y+dx*e.halfWidth*.76],[x+dy*e.halfWidth*.76,y-dx*e.halfWidth*.76]);
     ctx.lineWidth=12;ctx.strokeStyle="rgba(39,44,47,.22)";ctx.stroke()
    }
   }
  }
 }
 function drawSolids(ctx,bounds){
  for(const s of solids){
   let shapePoints=s.polygon||(s.shape==="segment"?[s.a,s.b]:[[s.cx,s.cy]]);
   if(!onScreen(shapePoints,bounds,250))continue;
   const base=materialColors[s.material]||"#666";
   ctx.fillStyle=base;ctx.strokeStyle="rgba(21,28,34,.82)";ctx.lineWidth=12;
   if(s.shape==="circle"){ctx.beginPath();ctx.arc(s.cx,s.cy,s.radius,0,Math.PI*2);ctx.fill();ctx.stroke()}
   else if(s.shape==="segment"){line(ctx,s.a,s.b);ctx.lineCap="round";ctx.lineWidth=s.radius*2;ctx.strokeStyle=base;ctx.stroke();
    line(ctx,s.a,s.b);ctx.lineWidth=8;ctx.strokeStyle="rgba(20,30,35,.75)";ctx.stroke()}
   else{polygon(ctx,s.polygon);ctx.fill();ctx.stroke()}
   if(s.material==="lantern-post"){
    ctx.beginPath();ctx.arc(s.cx,s.cy,s.radius*.6,0,Math.PI*2);ctx.fillStyle="#d8c28f";ctx.fill()
   }
  }
 }
 function drawDebug(ctx,view,player){
  const x=player.x,y=player.y,stepSize=140;
  ctx.save();
  // Visible local walkability near boots; no massive per-frame map scan.
  for(let dy=-4;dy<=4;dy++)for(let dx=-6;dx<=6;dx++){
   const xx=x+dx*stepSize,yy=y+dy*stepSize;
   if(xx<view[0]||xx>view[2]||yy<view[1]||yy>view[3])continue;
   const bad=blocked(xx,yy);
   ctx.fillStyle=bad?"rgba(249,80,82,.25)":"rgba(57,223,124,.18)";
   ctx.fillRect(xx-15,yy-15,30,30);
  }
  for(const s of solids){
   const pts=s.polygon||(s.shape==="segment"?[s.a,s.b]:[[s.cx,s.cy]]);
   if(!onScreen(pts,view,120))continue;
   ctx.strokeStyle="#ff5d62";ctx.lineWidth=8;ctx.beginPath();
   if(s.shape==="circle")ctx.arc(s.cx,s.cy,s.radius,0,Math.PI*2);
   else if(s.shape==="segment"){ctx.moveTo(...s.a);ctx.lineTo(...s.b)}
   else{polygon(ctx,s.polygon)}
   ctx.stroke()
  }
  for(const e of roads){
   if(!onScreen(e.path,view,40))continue;
   ctx.beginPath();e.path.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));
   ctx.strokeStyle=e.crossing?"rgba(255,248,163,.8)":e.kind==="stairs"?"rgba(178,154,255,.8)":"rgba(99,200,244,.5)";
   ctx.lineWidth=5;ctx.stroke()
  }
  ctx.strokeStyle="#fff3b8";ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,14,0,Math.PI*2);ctx.stroke();
  line(ctx,[x-24,y],[x+24,y]);ctx.stroke();line(ctx,[x,y-24],[x,y+24]);ctx.stroke();
  ctx.font="bold 26px monospace";ctx.textAlign="left";ctx.fillStyle="#fff6d2";
  ctx.fillText("FOOT ("+Math.round(x)+","+Math.round(y)+") ALT "+elevationAt(x,y).toFixed(2),x+30,y-20);
  ctx.restore()
 }
 function stats(){
  return{surfaces:surfaces.length,solids:solids.length,cliffs:solids.filter(s=>s.material==="cliff-face").length,
   interactions:interactions.length,roads:roads.length,crossings:roads.filter(r=>r.crossing).length,indexedCells:index.size}
 }
 return{version:VERSION,model,data,solids,surfaces,roads,blocked,obstacle,waterAt,step,elevationAt,
  materialAt,nearRoad,nearbyInteraction,safePoint,drawFloor,drawSolids,drawDebug,stats};
}
window.VeilwardGeometry={version:VERSION,validate,create,pointInside:inside,closest};
})();