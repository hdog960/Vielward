/* VEILWARD v1.3.3 — Phase 9 full-overworld review atlas.
 * These thumbnails are rendered by the SAME terrain compositor as gameplay.
 * The overview uses world authored land, geography, roads and climate, not a
 * fabricated concept illustration; no outside images or new art references.
 */
(function(){
"use strict";
const VERSION="1.3.7";
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const REGION_NOTES={
 hollowreach:"Snowbound village • the western starting hub",
 northwatch:"Stone memorial • high alpine terraces",
 coldpine:"Fir-covered ridge • northern snowy pass",
 frost_river:"Glacial banks • principal river crossings",
 thawline:"Snowmelt belt • gradual foothill transition",
 greenwood:"Temperate woodland • shaded hearth trails",
 greenwood_falls:"River valley • falls and staircase overlook",
 mossmere:"Wetland basin • two-sided sanctuary island",
 heatherwood:"Open meadow • commons and market roads",
 old_crown:"Ancient stone trade road • ruined watchtower",
 smugglers:"Rocky ravine • physical rope bridge",
 worldscar:"Frosted arcane upland • ring of standing stones"
};
const MAIN_SLICE=Object.freeze([
 "village","bridge_w","bridge_e","thaw_upper","greenwood_gate",
 "greenwood_hearth","greenwood_east","oldroad_w","oldroad_e","ravine_w"
]); // The post-approval mechanics-testing corridor; no teleport segments.
const PALETTE={
 snow:"#c0d1d8",frost:"#97acbf",thaw:"#a2b4a2",forest:"#5f866d",
 grass:"#8fa979",moss:"#829c8c",road:"#a59c86",dirt:"#9c8e7a",
 stone:"#8b929b",ruin:"#827c9c",wetland:"#748a7d",river:"#487da1",
 lake:"#346a8a",cliff:"#616477",arcane:"#8377a0",timber:"#907866"
};
const svgSafe=s=>String(s).replace(/[<>]/g,"");
function create(model,stream,options={}){
 if(!model||model.regions?.length!==12||!stream?.geometry||!stream?.art||!stream?.climate||!stream?.footprint)
  throw Error("Full-world atlas requires the real 12-region streaming world");
 const unit=model.worldDesign.worldUnitScale,world=model.worldDesign.worldBounds,
  geometry=stream.geometry,footprint=stream.footprint,climate=stream.climate,art=stream.art;
 // Curate the actual camera toward a landmark rather than blindly centring
 // on the closest empty road junction. These are original in-world nodes,
 // never hand-painted mock views.
 const REVIEW_ANCHORS={
  hollowreach:"joren",northwatch:"northwatch_plaza",coldpine:"colp_lodge",
  frost_river:"bridge_w",thawline:"thaw_camp",greenwood:"greenwood_hearth",
  greenwood_falls:"falls_overlook",mossmere:"island",heatherwood:"market",
  old_crown:"oldroad_tower",smugglers:"cave_mouth",worldscar:"worldscar_ring"
 };
 const nodeById=Object.fromEntries(model.nodes.map(n=>[n.id,n]));
 for(let i=1;i<MAIN_SLICE.length;i++){
  if(!model.edges.some(e=>(e.from===MAIN_SLICE[i-1]&&e.to===MAIN_SLICE[i])||
   (e.to===MAIN_SLICE[i-1]&&e.from===MAIN_SLICE[i])))
   throw Error("Broken planned Hollowreach → Smugglers mechanics corridor at "+MAIN_SLICE[i]);
 }
 const regions=model.regions.map(r=>{
  let near=null,min=Infinity;
  for(const n of model.nodes){
   if(n.region!==r.id)continue;
   const dist=Math.hypot(n.point[0]-r.center[0],n.point[1]-r.center[1]);
   if(dist<min){near=n;min=dist}
  }
  if(!near)throw Error("Region missing playable anchor "+r.id);
  const focus=REVIEW_ANCHORS[r.id]||near.id;
  if(nodeById[focus]?.region!==r.id)throw Error("Review focus must lie in source region "+r.id);
  return {id:r.id,name:r.name,biome:r.biome,anchor:focus,
   center:[...r.center],notes:REGION_NOTES[r.id]||r.biome};
 });
 function caption(id){
  const r=regions.find(r=>r.id===id);
  if(!r)throw Error("Unknown review region "+id);
  return r
 }
 function safeAnchor(id){
  const r=caption(id),n=nodeById[r.anchor];
  const x=n.point[0]*unit,y=n.point[1]*unit;
  const hit=footprint.safePoint(x,y);
  if(stream.blocked(hit.x,hit.y))throw Error("Unreachable region atlas anchor "+id);
  return {x:hit.x,y:hit.y,node:n.id}
 }
 function paletteAt(x,y){
  // Render pixel overview directly from the game material sampler and the
  // exact water, cliff and approved land-footprint collision authority.
  if(!footprint.onLand(x,y))return "#192934";
  const hazard=geometry.waterAt(x,y,0);
  if(hazard)return hazard.id==="mossmere_lake"?PALETTE.lake:
   hazard.id==="smugglers_chasm"?PALETTE.cliff:PALETTE.river;
  return PALETTE[art.materialAt(x,y)]||PALETTE.thaw
 }
 function paintOverview(canvas,options={}){
  const size=options.width||672;
  const w=canvas.width=size,h=canvas.height=Math.round(size*world[1]/world[0]);
  const ctx=canvas.getContext("2d",{alpha:false});
  if(!ctx)throw Error("Map canvas 2D context unavailable");
  ctx.save();ctx.imageSmoothingEnabled=false;
  ctx.fillStyle="#142534";ctx.fillRect(0,0,w,h);
  const sx=w/world[0],sy=h/world[1],cols=Math.min(110,Math.ceil(w/7));
  const rows=Math.round(cols*world[1]/world[0]);
  for(let iy=0;iy<rows;iy++)for(let ix=0;ix<cols;ix++){
   const px=(ix+.5)*world[0]/cols,py=(iy+.5)*world[1]/rows;
   ctx.fillStyle=paletteAt(px*unit,py*unit);
   ctx.fillRect(Math.floor(ix*w/cols),Math.floor(iy*h/rows),
    Math.ceil((ix+1)*w/cols)-Math.floor(ix*w/cols),
    Math.ceil((iy+1)*h/rows)-Math.floor(iy*h/rows))
  }
  ctx.scale(sx,sy);
  ctx.lineCap="round";ctx.lineJoin="round";
  // All 65 routes appear with their exact authored source plan points.
  for(const e of geometry.roads){
   ctx.beginPath();
   e.path.forEach((p,i)=>i?ctx.lineTo(p[0]/unit,p[1]/unit):ctx.moveTo(p[0]/unit,p[1]/unit));
   ctx.strokeStyle=e.crossing?"#f8c985":"#263c45";ctx.lineWidth=e.crossing?7:5;ctx.stroke();
   ctx.strokeStyle=e.crossing?"#f5e2af":"#e6d1a9";ctx.lineWidth=e.crossing?3:2;ctx.stroke()
  }
  // Mark the selected post-approval test corridor with a distinctive gold
  // thread. Every point is an actual traversable node on the 65-link graph.
  ctx.beginPath();
  MAIN_SLICE.forEach((id,i)=>{
   const [x,y]=nodeById[id].point;
   if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y)
  });
  ctx.strokeStyle="#171e29";ctx.lineWidth=9;ctx.stroke();
  ctx.strokeStyle="#f2c981";ctx.lineWidth=3.5;ctx.stroke();
  // Major landmarks and region labels show actual position, not hand-placed
  // UI-only fictitious roads or unwalkable island entrances.
  for(let i=0;i<regions.length;i++){
   const r=regions[i],x=r.center[0],y=r.center[1];
   ctx.fillStyle="#122232";ctx.fillRect(x-7,y-7,14,14);
   ctx.fillStyle="#f6d496";ctx.fillRect(x-4,y-4,8,8);
   ctx.font="bold 14px sans-serif";ctx.textAlign="center";
   ctx.lineWidth=4;ctx.strokeStyle="#15202b";
   const label=r.name.replace(/ ·.*/,"");
   const yoff=r.id==="thawline"?-21:r.id==="frost_river"?25:r.id==="greenwood_falls"?29:-16;
   if(ctx.strokeText)ctx.strokeText(label,x,y+yoff);
   if(ctx.fillText){ctx.fillStyle="#fff2d0";ctx.fillText(label,x,y+yoff)}
  }
  const selected=options.selected||null;
  if(selected){
   const r=caption(selected),x=r.center[0],y=r.center[1];
   ctx.strokeStyle="#ffefac";ctx.lineWidth=4;
   ctx.beginPath();ctx.arc(x,y,13,0,Math.PI*2);ctx.stroke()
  }
  ctx.restore();
  return {regions:regions.length,roadCount:geometry.roads.length,
   crossingCount:geometry.roads.filter(e=>e.crossing).length,source:"runtime-source-geography"};
 }
 function paintRegion(canvas,id,opts={}){
  const r=caption(id),anchor=safeAnchor(id);
  const pixels=opts.pixels||192,span=opts.span||1250;
  canvas.width=pixels;canvas.height=pixels;
  const ctx=canvas.getContext("2d",{alpha:false});
  if(!ctx)throw Error("Terrain review thumbnail canvas unavailable");
  const x=Math.max(span/2,Math.min(stream.width-span/2,anchor.x));
  const y=Math.max(span/2,Math.min(stream.height-span/2,anchor.y));
  // This is the real material/prop/road/crossing compositor used by the
  // playable tile engine; only the camera and thumbnail resolution differ.
  art.paintChunk(ctx,[x-span/2,y-span/2,x+span/2,y+span/2],pixels);
  return {id:r.id,node:r.anchor,x,y,span,pixels,authentic:true}
 }
 function auditPreview(options={}){
  const stride=options.stride||350;
  const results=[];
  for(const r of regions){
   let land=0,walkable=0,water=0,solid=0;
   const cx=r.center[0]*unit,cy=r.center[1]*unit;
   for(let yy=-7;yy<=7;yy++)for(let xx=-10;xx<=10;xx++){
    const x=cx+xx*stride,y=cy+yy*stride;
    if(!footprint.onLand(x,y))continue;land++;
    if(geometry.waterAt(x,y,10))water++;
    if(stream.blocked(x,y))solid++;else walkable++;
   }
   results.push({id:r.id,name:r.name,land,walkable,water,solid,
    traversablePercent:land?Math.round(100*walkable/land):0});
  }
  return results
 }
 function stats(){return {version:VERSION,regions:regions.length,roads:geometry.roads.length,
  crossings:geometry.roads.filter(e=>e.crossing).length,authoredArt:true,source:"live-gameplay",mainSliceNodes:MAIN_SLICE.length}}
 return{version:VERSION,regions,mainSlice:MAIN_SLICE,caption,safeAnchor,paintOverview,paintRegion,auditPreview,stats}
}
window.VeilwardReview={version:VERSION,create};
})();