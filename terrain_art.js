/* VEILWARD Phase 9 R25 — grounded woodland floor; originally visual recovery R1: low-noise clustered ground and collision-anchored illustrated scene artwork.
 * 16 source materials × 4 variants, 32×32 native source pixels per cell.
 * No network fetch, image generation at runtime or giant full-world bitmap.
 * Base, shore, road, stairs, props, contact shadow and foliage all use
 * THE SAME terrain_geometry.json coordinates as collision.
 * Phase 5 is a polished MATERIAL PRODUCTION SYSTEM, not approved full world art.
 */
(function(){
"use strict";
const VERSION="1.3.32",TILE=32,VARIANTS=4,COLUMNS=8,WORLD_CELL=96,TAU=Math.PI*2;
const PALETTES={
 snow:{base:"#acbcd0",dark:"#788da9",light:"#e4eced",mid:"#bfcdd9",spark:"#f6f5e8",motif:"drift"},
 frost:{base:"#8fa3b8",dark:"#627590",light:"#cedadd",mid:"#adbbc9",spark:"#e9ece8",motif:"shale"},
 thaw:{base:"#92a69c",dark:"#5e8178",light:"#c7d1c1",mid:"#a9b9ad",spark:"#dde7df",motif:"snowgrass"},
 forest:{base:"#5f826e",dark:"#345b55",light:"#95aa7d",mid:"#749677",spark:"#f0e7ad",motif:"leaf"},
 grass:{base:"#829d70",dark:"#516e58",light:"#b5bf8c",mid:"#94ae79",spark:"#f0e1bb",motif:"flower"},
 moss:{base:"#7f967e",dark:"#485f61",light:"#b4b99a",mid:"#9aa997",spark:"#d8dcc4",motif:"moss"},
 road:{base:"#9b9888",dark:"#5f6f6b",light:"#c7bea0",mid:"#adac9d",spark:"#d9d5ba",motif:"pebble"},
 dirt:{base:"#a48e76",dark:"#6c6960",light:"#c9b69a",mid:"#b9a48c",spark:"#e2d1b0",motif:"pebble"},
 stone:{base:"#898e9b",dark:"#53586d",light:"#bec3c4",mid:"#a2a5ad",spark:"#dbd7d0",motif:"slab"},
 ruin:{base:"#867d93",dark:"#4e536b",light:"#b3adbc",mid:"#9e97a6",spark:"#d7cbe0",motif:"slab"},
 wetland:{base:"#667d71",dark:"#445c63",light:"#a1ad8c",mid:"#869b85",spark:"#c3bc91",motif:"reeds"},
 river:{base:"#426d90",dark:"#264b78",light:"#80afca",mid:"#568aa7",spark:"#c3e8dd",motif:"water"},
 lake:{base:"#345d7c",dark:"#25445f",light:"#79a0b4",mid:"#46748d",spark:"#c0d6cb",motif:"water"},
 cliff:{base:"#5e627e",dark:"#363e58",light:"#9493a7",mid:"#797e93",spark:"#bdbbcd",motif:"shale"},
 arcane:{base:"#796b97",dark:"#494666",light:"#b4a2c2",mid:"#9386aa",spark:"#dcd0e4",motif:"rune"},
 timber:{base:"#856e62",dark:"#473e47",light:"#c5a783",mid:"#a28b70",spark:"#e5c8a1",motif:"plank"}
};
const MATERIALS=Object.freeze(Object.keys(PALETTES));
function hash(x,y,k=0){let n=Math.imul((x|0)^0x4a58,374761393)+Math.imul(y|0,668265263)+Math.imul(k|0,1442695041);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296}
function rgbaPixel(ctx,x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.floor(x),Math.floor(y),Math.max(1,Math.ceil(w)),Math.max(1,Math.ceil(h)))}
function drawMotif(ctx,ox,oy,material,variant){
 const p=PALETTES[material],step=VARIANTS*3+variant;
 rgbaPixel(ctx,ox,oy,TILE,TILE,p.base);
 // Source motifs are deliberately hand composed at pixel scale, not
 // rasterized vector circles or stretched reference scenes.
 for(let i=0;i<2;i++){
  const px=ox+Math.floor(hash(i,step,11)*30),py=oy+Math.floor(hash(i,step,37)*30);
  const w=2+Math.floor(hash(i,step,19)*6),h=1+Math.floor(hash(i,step,49)*3);
  rgbaPixel(ctx,px,py,w,h,i%4===0?p.light:i%3===0?p.dark:p.mid)
 }
 const motif=p.motif;
 for(let j=0;j<2;j++){
  const x=ox+2+Math.floor(hash(j,variant+MATERIALS.indexOf(material)*9,17)*26);
  const y=oy+2+Math.floor(hash(j,variant+MATERIALS.indexOf(material)*9,33)*26);
  if(motif==="drift"){
   rgbaPixel(ctx,x,y,5,1,p.spark);rgbaPixel(ctx,x+2,y+1,5,1,p.light);
   if(j%2===0)rgbaPixel(ctx,x-2,y+3,3,1,p.dark)
  }else if(motif==="snowgrass"){
   rgbaPixel(ctx,x,y,5,3,j%2?p.dark:p.light);
   rgbaPixel(ctx,x+1,y-3,2,4,j%2?p.mid:p.spark)
  }else if(motif==="leaf"||motif==="moss"||motif==="flower"){
   rgbaPixel(ctx,x-1,y,6,2,p.dark);rgbaPixel(ctx,x+1,y-2,3,4,p.mid);
   rgbaPixel(ctx,x,y-1,2,1,p.light);
   if(motif==="flower"||motif==="leaf"&&j%3===0){
    rgbaPixel(ctx,x+2,y-4,2,2,p.spark);
    rgbaPixel(ctx,x+1,y-3,4,1,p.light)
   }
  }else if(motif==="water"){
   rgbaPixel(ctx,x,y,8,1,j%3?p.mid:p.spark);
   rgbaPixel(ctx,x+3,y+1,4,1,p.light);
   if(j%2===0)rgbaPixel(ctx,x-1,y+4,5,1,p.dark)
  }else if(motif==="pebble"||motif==="shale"||motif==="slab"){
   rgbaPixel(ctx,x,y,5,4,p.dark);rgbaPixel(ctx,x+1,y,5,2,p.mid);
   rgbaPixel(ctx,x+1,y-1,3,1,p.spark);
   if(j%2===0)rgbaPixel(ctx,x+4,y+2,2,2,p.light)
  }else if(motif==="reeds"){
   rgbaPixel(ctx,x,y-5,1,6,p.light);rgbaPixel(ctx,x+2,y-4,1,5,p.mid);
   rgbaPixel(ctx,x+4,y-3,1,4,p.dark)
  }else if(motif==="rune"){
   rgbaPixel(ctx,x,y,4,1,p.light);rgbaPixel(ctx,x+1,y-2,1,5,p.mid);
   if(j%2===0)rgbaPixel(ctx,x+4,y-1,2,2,p.spark)
  }else if(motif==="plank"){
   rgbaPixel(ctx,ox+2,oy+Math.floor(j*4),28,1,p.dark);
   rgbaPixel(ctx,ox+5,oy+Math.floor(j*4)+1,17,1,p.mid)
  }
 }
}
function makeAtlas(factory){
 const atlas=factory();atlas.width=8*TILE;atlas.height=8*TILE;
 const ctx=atlas.getContext("2d",{alpha:true});
 if(!ctx)throw Error("Pixel terrain atlas context unavailable");
 ctx.save();ctx.imageSmoothingEnabled=false;
 for(let m=0;m<MATERIALS.length;m++)for(let v=0;v<VARIANTS;v++){
  const i=m*VARIANTS+v,ox=(i%COLUMNS)*TILE,oy=Math.floor(i/COLUMNS)*TILE;
  drawMotif(ctx,ox,oy,MATERIALS[m],v)
 }
 ctx.restore();return atlas
}

/* R25: low-chroma, macro-scale Greenwood material, made ONCE per session.
 * The former 32px "leaf" swatch repeated gold/white squares every 96 world
 * units. This continuous 16-cell plate contains no glyphs, flecks, flowers,
 * or clone-stamped props. Natural root/road painters supply those details.
 * Periodic multi-octave color ramps meet exactly across tile/chunk seams. */
const GREENWOOD_BASE={
 forest:[81,119,96],moss:[112,139,111],grass:[131,157,116],
 river:[55,104,130],
 // The nearby thaw/wetland/rock/soil materials must share the SAME native
 // continuous palette. Otherwise bright legacy squares reappear on land.
 thaw:[117,143,119],wetland:[91,122,108],stone:[99,111,104],
 road:[132,117,99],dirt:[139,120,97]
};
function makeGreenwoodFloorPlates(factory){
 const SIZE=256,steps=16,plates={};
 const wrap=(n,m)=>((n%m)+m)%m;
 const interpolate=t=>t*t*(3-2*t);
 function noise(x,y,span,salt){
  const n=SIZE/span,gx=Math.floor(x/span),gy=Math.floor(y/span),
   fx=interpolate(x/span-gx),fy=interpolate(y/span-gy);
  const at=(dx,dy)=>hash(wrap(gx+dx,n),wrap(gy+dy,n),salt);
  const top=at(0,0)*(1-fx)+at(1,0)*fx,
   bottom=at(0,1)*(1-fx)+at(1,1)*fx;
  return top*(1-fy)+bottom*fy
 }
 for(const [kind,base] of Object.entries(GREENWOOD_BASE)){
  const canvas=factory();canvas.width=SIZE;canvas.height=SIZE;
  const painter=canvas.getContext("2d",{willReadFrequently:true});
  if(!painter?.createImageData||!painter?.putImageData)return null;
  const buffer=painter.createImageData(SIZE,SIZE),d=buffer.data;
  const salt=kind==="forest"?73:kind==="moss"?127:179;
  for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
   const large=noise(x,y,64,salt),
    middle=noise(x,y,16,salt+17),
    grain=noise(x,y,4,salt+29),
    // Periodic natural flow instead of rows of square water glyphs.
    current=kind==="river"?
     (Math.sin((x*6+y*2)*Math.PI*2/SIZE)*1.9+
      Math.cos((x*2-y*5)*Math.PI*2/SIZE)*1.2):0,
    variation=(large-.5)*(kind==="river"?16:22)+
     (middle-.5)*(kind==="river"?7:11)+(grain-.5)*3+current,
    soil=kind==="river"?0:Math.max(0,.48-large)*10,
    i=(y*SIZE+x)*4;
   d[i]=Math.round(base[0]+variation+soil*.56);
   d[i+1]=Math.round(base[1]+variation*.9-soil*.42);
   d[i+2]=Math.round(base[2]+variation*.72-soil*.55);
   d[i+3]=255
  }
  painter.putImageData(buffer,0,0);plates[kind]=canvas
 }
 return plates
}

function create(model,geometry,options={}){
 if(!model||!geometry||!geometry.roads)throw Error("Terrain art requires the authoritative world geometry");
 const factory=options.canvasFactory||(()=>document.createElement("canvas"));
 const atlas=makeAtlas(factory),greenwoodFloor=makeGreenwoodFloorPlates(factory),unit=model.worldDesign.worldUnitScale;
 const footprint=options.footprint||null;
  const climate=options.climate||null;
 const routeArt=options.routeArt||null;
 const illustration=options.illustration||null;
 const raster=options.raster||null;
  const setpieces=options.setpieces||null;
 const surfaces=geometry.surfaces,roads=geometry.roads,solids=geometry.solids;
 const water=model.waterways.map(w=>({...w,
  line:(w.centerline||[]).map(([x,y])=>[x*unit,y*unit]),
  polygon:(w.closedPolygon||[]).map(([x,y])=>[x*unit,y*unit]),
  island:(w.islandPolygon||[]).map(([x,y])=>[x*unit,y*unit])
 }));
 const regions=model.regions;
 const biomeMaterial={
  "alpine-village":"snow","alpine-stone":"frost","alpine-evergreen":"snow",
  "glacial-water":"snow","snowmelt":"thaw","temperate-forest":"forest",
  "waterfall-forest":"moss","lake-wetland":"wetland","meadow":"grass",
  "historic-road":"road","canyon":"cliff","arcane-highland":"arcane"
 };
 function mixMaterial(x,y){
  const px=x/unit,py=y/unit;
  const near=regions.map(r=>({r,d:Math.hypot(px-r.center[0],py-r.center[1])})).sort((a,b)=>a.d-b.d);
  const a=near[0],b=near[1],delta=b.d-a.d;
  const noise=hash(Math.floor(x/WORLD_CELL),Math.floor(y/WORLD_CELL),11);
  if(delta<39&&noise<(39-delta)/75)return biomeMaterial[b.r.biome]||"snow";
  return biomeMaterial[a.r.biome]||"snow"
 }
 function distPoint(x,y,a,b){
  const dx=b[0]-a[0],dy=b[1]-a[1],den=dx*dx+dy*dy;
  const t=den?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/den)):0;
  return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)
 }
 function inPolygon(x,y,poly){
  let yes=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
   const a=poly[i],b=poly[j];
   if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes
  }
  return yes
 }
 function waterAt(x,y){
  // Exact physical shore: no walkable strip on painted river/water.
  const hazard=geometry.waterAt(x,y,0);
  if(hazard)return hazard.id==="mossmere_lake"?"lake":hazard.id==="smugglers_chasm"?"cliff":"river";
  return null
 }
 function legacyWaterAt(x,y){
  for(const w of water){
   if(w.polygon.length&&inPolygon(x,y,w.polygon)&&!inPolygon(x,y,w.island))return "lake";
   if(w.line.length){
    for(let i=1;i<w.line.length;i++)if(distPoint(x,y,w.line[i-1],w.line[i])<(w.id==="smugglers_chasm"?185:205))return w.id==="smugglers_chasm"?"cliff":"river"
   }
  }
  return null
 }
 function materialAt(x,y){
  const w=waterAt(x,y);
  return w||(climate?climate.groundMaterial(x,y):mixMaterial(x,y))
 }
 function tileVariant(gx,gy){return Math.floor(hash(gx,gy,45)*VARIANTS)}
 function atlasRect(name,variant){
  const m=Math.max(0,MATERIALS.indexOf(name)),i=m*VARIANTS+((variant%VARIANTS+VARIANTS)%VARIANTS);
  return [(i%COLUMNS)*TILE,Math.floor(i/COLUMNS)*TILE,TILE,TILE]
 }
 function stamp(ctx,material,gx,gy,x,y,size=WORLD_CELL){
  // Keep all external climates and rivers untouched. Greenwood no longer
  // tiles the tiny bright leaf/flower glyphs visible in R24 screenshots.
  const sourceRegion=footprint?.regionAt(x+size*.5,y+size*.5)?.id;
  // Preserve the already accepted native Greenwood mix, while covering
  // every common original Falls ground-material class with a matching
  // low-noise plate. No weather/climate or road physics changes.
  const originalWoods=sourceRegion==="greenwood"&&
   ["forest","moss","grass"].includes(material);
  const fallsNative=sourceRegion==="greenwood_falls"&&
   ["forest","moss","grass","river","thaw","wetland",
    "stone","road","dirt"].includes(material);
  if(GREENWOOD_BASE[material]&&(originalWoods||fallsNative)){
   const plate=greenwoodFloor?.[material];
   if(plate){
    const sx=((gx%16+16)%16)*16,sy=((gy%16+16)%16)*16;
    ctx.drawImage(plate,sx,sy,16,16,x,y,size,size)
   }else{
    ctx.fillStyle="rgb("+GREENWOOD_BASE[material].join(",")+")";
    ctx.fillRect(x,y,size,size)
   }
   return
  }
  if(raster?.paintGroundCell(ctx,material,gx,gy,x,y,size))return;
  const src=atlasRect(material,tileVariant(gx,gy));
  ctx.drawImage(atlas,...src,x,y,size,size)
 }
 function boundsCells(bounds){
  const [x0,y0,x1,y1]=bounds,arr=[];
  for(let gy=Math.floor(y0/WORLD_CELL);gy<=Math.floor((y1-0.001)/WORLD_CELL);gy++)
   for(let gx=Math.floor(x0/WORLD_CELL);gx<=Math.floor((x1-0.001)/WORLD_CELL);gx++)
    arr.push({gx,gy,x:gx*WORLD_CELL,y:gy*WORLD_CELL});
  return arr
 }
 function sameSourceCell(worldX,worldY){
  return {gx:Math.floor(worldX/WORLD_CELL),gy:Math.floor(worldY/WORLD_CELL),
   material:materialAt(worldX,worldY),variant:tileVariant(Math.floor(worldX/WORLD_CELL),Math.floor(worldY/WORLD_CELL))}
 }
 function climateDetails(ctx,c,material){
  if(!climate||raster?.covers(c.x+WORLD_CELL*.5,c.y+WORLD_CELL*.5)||["river","lake","cliff","arcane","stone","road","timber"].includes(material))return;
  // The R20 Greenwood forest-floor source replaces the old 96px checker
  // speckles; keep weather details in every OTHER region as before.
  if(["greenwood","greenwood_falls"].includes(
   footprint?.regionAt(c.x+WORLD_CELL*.5,c.y+WORLD_CELL*.5)?.id))return;
  const sample=climate.sample(c.x+WORLD_CELL*.5,c.y+WORLD_CELL*.5);
  // Snowflecks, wet moss and plants repeat consistently across chunk edges.
  // Small pixel clusters break the large 96-unit material checkerboard.
  for(let i=0;i<2;i++){
   const n=hash(c.gx*17+i,c.gy*13-i,129);
   const px=c.x+7+Math.floor(hash(c.gx,c.gy+i,101)*76);
   const py=c.y+8+Math.floor(hash(c.gx+i,c.gy,97)*75);
   if(sample.snow>.08&&n<sample.snow*.83){
    ctx.fillStyle=sample.snow>.62?"rgba(226,233,230,.75)":"rgba(211,224,224,.52)";
    ctx.fillRect(px,py,12+(i%3)*5,3+(i%2)*3);
    ctx.fillStyle="rgba(121,147,157,.35)";
    ctx.fillRect(px+4,py+4,7+(i%2)*4,2)
   }else if(sample.wet>.48&&n<sample.wet*.88){
    ctx.fillStyle=sample.wet>.73?"rgba(49,90,96,.30)":"rgba(75,102,84,.24)";
    ctx.fillRect(px,py,17+(i%3)*3,4);
    ctx.fillStyle="rgba(165,183,152,.36)";
    ctx.fillRect(px+6,py-3,3,6)
   }else if(sample.snow<.55){
    ctx.fillStyle=sample.meadow>.5?"rgba(202,193,144,.42)":"rgba(102,143,104,.29)";
    ctx.fillRect(px,py,4+(i%4)*2,8)
   }
  }
 }

 // R35d: the physical Frostbridge River is 180 world units either side
 // of its authoritative centerline. Sampling at a 96-unit square CELL
 // center produced hard blue stair-step edges at Greenwood Falls.
 // Paint the actual continuous channel as one clipped native-material
 // surface; do not change its collision, source point order or crossings.
 const fallsChannel=water.find(w=>w.id==="frostbridge_river")?.line.slice(6)||[];
 const fallsChannelBounds=fallsChannel.length>1?[
  // Include the complete 286-unit dry-bank feather at channel endpoints.
  // A 205-unit water-only cull clipped the outer 81 units on edge tiles.
  Math.min(...fallsChannel.map(p=>p[0]))-300,
  Math.min(...fallsChannel.map(p=>p[1]))-300,
  Math.max(...fallsChannel.map(p=>p[0]))+300,
  Math.max(...fallsChannel.map(p=>p[1]))+300]:null;
 function paintFallsWaterChannel(ctx,bounds){
  if(!fallsChannelBounds||bounds[2]<fallsChannelBounds[0]||
   bounds[0]>fallsChannelBounds[2]||
   bounds[3]<fallsChannelBounds[1]||
   bounds[1]>fallsChannelBounds[3])return 0;
  const sides=[[],[]],half=180;
  for(let i=0;i<fallsChannel.length;i++){
   const p=fallsChannel[i],before=fallsChannel[Math.max(0,i-1)],
    after=fallsChannel[Math.min(fallsChannel.length-1,i+1)],
    dx=after[0]-before[0],dy=after[1]-before[1],
    length=Math.hypot(dx,dy)||1,nx=-dy/length,ny=dx/length;
   sides[0].push([p[0]+nx*half,p[1]+ny*half]);
   sides[1].push([p[0]-nx*half,p[1]-ny*half])
  }
  ctx.save();ctx.beginPath();
  const left=sides[0],right=sides[1],last=fallsChannel.length-1;
  ctx.moveTo(...left[0]);
  for(let i=1;i<left.length;i++)ctx.lineTo(...left[i]);
  const end=fallsChannel[last],prev=fallsChannel[last-1],
   etx=(end[0]-prev[0])/Math.hypot(end[0]-prev[0],end[1]-prev[1]),
   ety=(end[1]-prev[1])/Math.hypot(end[0]-prev[0],end[1]-prev[1]);
  // Rounded endcap approximates the same 180-unit radius hazard.
  if(ctx.quadraticCurveTo)
   ctx.quadraticCurveTo(end[0]+etx*half*1.1,
    end[1]+ety*half*1.1,...right[last]);
  else ctx.lineTo(...right[last]);
  for(let i=last-1;i>=0;i--)ctx.lineTo(...right[i]);
  const first=fallsChannel[0],second=fallsChannel[1],
   fdx=(second[0]-first[0]),fdy=(second[1]-first[1]),
   len=Math.hypot(fdx,fdy)||1;
  if(ctx.quadraticCurveTo)ctx.quadraticCurveTo(
   first[0]-fdx/len*half*1.1,first[1]-fdy/len*half*1.1,...left[0]);
  ctx.closePath();ctx.clip();
  // World grid + original native source palette: no new sprites, no
  // checkerboard at bank edges and no per-chunk local noise origin.
  ctx.fillStyle="#427f92";
  ctx.fillRect(bounds[0],bounds[1],
   bounds[2]-bounds[0],bounds[3]-bounds[1]);
  const plate=greenwoodFloor?.river;
  if(plate)for(const c of boundsCells(bounds)){
   const srcX=((c.gx%16+16)%16)*16,
    srcY=((c.gy%16+16)%16)*16;
   ctx.drawImage(plate,srcX,srcY,16,16,
    c.x,c.y,WORLD_CELL,WORLD_CELL)
  }
  ctx.restore();return 1
 }


 // R40: the R35d water polygon must have a watercolor shoreline, not
 // an unfeathered cyan-to-grass diagonal. ALL station coordinates come
 // from the original Frostbridge centerline and the exact, unchanged
 // 180-unit physical water radius. This is visual pigment only, with
 // smooth fade INTO the river and OUT onto the original dry bank.
 // No noise shifts the actual physical shore, collision or crossing.
 const fallsShoreHalfWidth=180,fallsShoreWaterInset=66,
  fallsShoreDryReach=106;
 function fallsShoreBands(bounds){
  if(!fallsChannelBounds||fallsChannel.length<2||
    bounds[2]<fallsChannelBounds[0]-fallsShoreDryReach||
    bounds[0]>fallsChannelBounds[2]+fallsShoreDryReach||
    bounds[3]<fallsChannelBounds[1]-fallsShoreDryReach||
    bounds[1]>fallsChannelBounds[3]+fallsShoreDryReach)return[];
  // Smooth source-tangent normals at each station, with a miter cap at
  // sharp bends: prevents shoreline wash from forming protruding spikes.
  const normals=fallsChannel.map((p,i)=>{
   const before=fallsChannel[Math.max(0,i-1)],
    at=fallsChannel[i],after=fallsChannel[Math.min(fallsChannel.length-1,i+1)];
   const dx=after[0]-before[0],dy=after[1]-before[1],
    len=Math.hypot(dx,dy)||1;
   const tangent={x:-dy/len,y:dx/len};
   if(i===0||i===fallsChannel.length-1)return tangent;
   const ux=at[0]-before[0],uy=at[1]-before[1],
    vx=after[0]-at[0],vy=after[1]-at[1],
    ul=Math.hypot(ux,uy)||1,vl=Math.hypot(vx,vy)||1,
    bend=(ux*vx+uy*vy)/(ul*vl);
   // Match R35d's exact physical-water polygon normal at every vertex.
   // Switching to a previous-segment normal at a bend makes R40's wash
   // detach from the visible channel and leaves a sharp triangular seam.
   // The source tangent is already unit-length; no miter extrusion occurs.
   return tangent
  });
  const groups=[];
  for(let i=1;i<fallsChannel.length;i++){
   const a=fallsChannel[i-1],b=fallsChannel[i],
    ax=a[0],ay=a[1],bx=b[0],by=b[1],
    n0=normals[i-1],n1=normals[i],
    tx=bx-ax,ty=by-ay,len=Math.hypot(tx,ty)||1;
   // Never invent shore art on a large source road crossing.
   const midx=(ax+bx)*.5,midy=(ay+by)*.5;
   for(const side of [-1,1]){
    const off=fallsShoreHalfWidth,outer=off+fallsShoreDryReach,
     inner=off-fallsShoreWaterInset,
     dryX=midx+(n0.x+n1.x)*side*outer*.5,
     dryY=midy+(n0.y+n1.y)*side*outer*.5;
    if(footprint&&
       !["greenwood","greenwood_falls"].includes(
        footprint.regionAt(dryX,dryY)?.id))continue;
    const minx=Math.min(ax+side*n0.x*outer,bx+side*n1.x*outer,
      ax+side*n0.x*inner,bx+side*n1.x*inner),
     maxx=Math.max(ax+side*n0.x*outer,bx+side*n1.x*outer,
      ax+side*n0.x*inner,bx+side*n1.x*inner),
     miny=Math.min(ay+side*n0.y*outer,by+side*n1.y*outer,
      ay+side*n0.y*inner,by+side*n1.y*inner),
     maxy=Math.max(ay+side*n0.y*outer,by+side*n1.y*outer,
      ay+side*n0.y*inner,by+side*n1.y*inner);
    if(minx>bounds[2]+25||maxx<bounds[0]-25||
       miny>bounds[3]+25||maxy<bounds[1]-25)continue;
    groups.push({
     index:i,side,length:len,
     a:[ax,ay],b:[bx,by],n0,n1,
     dry:[dryX,dryY],
     inner,outer,waterRadius:off,
     nearPhysicalCrossing:!!geometry.nearRoad(
      dryX,dryY,e=>!!e.crossing,65)
    })
   }
  }
  return groups
 }
 function paintFallsShorelineTransition(ctx,bounds){
  if(!ctx?.createLinearGradient||!ctx?.beginPath)return 0;
  let painted=0;
  for(const q of fallsShoreBands(bounds)){
   const{a,b,n0,n1,side,inner,outer}=q;
   // The *true* physical decks and bridge approaches always remain
   // legible: never shade across a constructed crossing.
   if(q.nearPhysicalCrossing)continue;
   const point=(p,n,d)=>[p[0]+n.x*side*d,p[1]+n.y*side*d],
    ai=point(a,n0,inner),bi=point(b,n1,inner),
    bo=point(b,n1,outer),ao=point(a,n0,outer);
   const mid=[(a[0]+b[0])*.5,(a[1]+b[1])*.5],
    // Continuous world-space modulation avoids repeating every-third-panel bands.
    m=.94+.06*Math.sin((mid[0]+mid[1])*.00037),
    norm={x:(n0.x+n1.x)*.5*side,y:(n0.y+n1.y)*.5*side},
    p0=[mid[0]+norm.x*inner,mid[1]+norm.y*inner],
    p1=[mid[0]+norm.x*outer,mid[1]+norm.y*outer];
   const wash=ctx.createLinearGradient(...p0,...p1);
   // No bright white rail or flat teal outline: gradual desaturated
   // aquatic shadow -> wet ochre/moss -> transparent native ground.
   wash.addColorStop(0,"rgba(37,96,111,0)");
   wash.addColorStop(.19,"rgba(59,122,124,"+(.23*m)+")");
   wash.addColorStop(.39,"rgba(82,133,121,"+(.44*m)+")");
   wash.addColorStop(.53,"rgba(105,146,119,"+(.49*m)+")");
   wash.addColorStop(.70,"rgba(72,114,91,"+(.25*m)+")");
   wash.addColorStop(1,"rgba(53,94,76,0)");
   ctx.save();ctx.beginPath();
   ctx.moveTo(...ai);ctx.lineTo(...bi);ctx.lineTo(...bo);
   ctx.lineTo(...ao);ctx.closePath();
   ctx.fillStyle=wash;ctx.fill();
   ctx.restore();painted++
   // Subtle broken current brush strokes remain on the WATER side
   // only, aligned to this same physical channel segment. They are
   // not stepping stones, fixed parallel rails or a fake shore.
   if(q.length>160&&ctx.quadraticCurveTo){
    const dx=b[0]-a[0],dy=b[1]-a[1],
     len=Math.hypot(dx,dy)||1,tx=dx/len,ty=dy/len;
    for(let k=0;k<Math.min(4,Math.floor(q.length/240));k++){
     const seed=hash(q.index*53+k,side*13,405),
      t=.19+(k+.32)*.69/Math.max(1,Math.min(4,Math.floor(q.length/240))),
      x=a[0]+dx*t+norm.x*(112+seed*18),
      y=a[1]+dy*t+norm.y*(112+seed*18),
      streak=17+seed*25;
     if(x<bounds[0]-65||x>bounds[2]+65||
        y<bounds[1]-65||y>bounds[3]+65)continue;
     ctx.save();ctx.beginPath();
     ctx.moveTo(x-tx*streak*.55,y-ty*streak*.55);
     ctx.quadraticCurveTo(x+norm.x*6,y+norm.y*6,
      x+tx*streak*.48,y+ty*streak*.48);
     ctx.strokeStyle="rgba(158,197,182,.14)";
     ctx.lineWidth=1.9;ctx.stroke();ctx.restore()
    }
   }
  }
  return painted
 }

 function drawBase(ctx,bounds){
  const cells=boundsCells(bounds);
  for(const c of cells){
   const cx=c.x+WORLD_CELL*.5,cy=c.y+WORLD_CELL*.5,
    material=materialAt(cx,cy);
   // Replace square-sampled blue pixels with native river geometry. On
   // the dry fringe of the channel the source woodland material remains.
   const renderMaterial=material==="river"&&
    footprint?.regionAt(cx,cy)?.id==="greenwood_falls"?
     (climate?.groundMaterial(cx,cy)||"moss"):material;
   stamp(ctx,renderMaterial,c.gx,c.gy,c.x,c.y);
   climateDetails(ctx,c,renderMaterial)
  }
  // Rock/ice/river/grass transition edges use the SAME world grid on either
  // side of streaming chunk boundaries; no per-chunk seed or white mattes.
  for(const c of cells){
   const m=materialAt(c.x+WORLD_CELL*.5,c.y+WORLD_CELL*.5);
   if(m!=="river"&&m!=="lake")continue;
   // R34b: real physically sampled bankwork replaces square shore rims.
   if(footprint?.regionAt(c.x+WORLD_CELL*.5,c.y+WORLD_CELL*.5)?.id===
      "greenwood_falls")continue;
   ctx.fillStyle=m==="river"?"rgba(205,224,216,.65)":"rgba(160,201,206,.55)";
   const t=7;
   if(!["river","lake"].includes(materialAt(c.x-WORLD_CELL*.45,c.y+WORLD_CELL*.5)))
    ctx.fillRect(c.x,c.y+20,t,WORLD_CELL-35);
   if(!["river","lake"].includes(materialAt(c.x+WORLD_CELL*1.45,c.y+WORLD_CELL*.5)))
    ctx.fillRect(c.x+WORLD_CELL-t,c.y+6,t,WORLD_CELL-25);
   if(!["river","lake"].includes(materialAt(c.x+WORLD_CELL*.5,c.y-WORLD_CELL*.45)))
    ctx.fillRect(c.x+15,c.y,WORLD_CELL-27,t);
   if(!["river","lake"].includes(materialAt(c.x+WORLD_CELL*.5,c.y+WORLD_CELL*1.45)))
    ctx.fillRect(c.x+7,c.y+WORLD_CELL-t,WORLD_CELL-30,t)
  }
 }
 function polygon(ctx,p){
  ctx.beginPath();for(let i=0;i<p.length;i++)i?ctx.lineTo(...p[i]):ctx.moveTo(...p[i]);ctx.closePath()
 }
 function inBounds(points,b,pad=0){
  return points.some(p=>p[0]>=b[0]-pad&&p[0]<=b[2]+pad&&p[1]>=b[1]-pad&&p[1]<=b[3]+pad)
  ||(Math.min(...points.map(p=>p[0]))<b[2]+pad&&Math.max(...points.map(p=>p[0]))>b[0]-pad&&
     Math.min(...points.map(p=>p[1]))<b[3]+pad&&Math.max(...points.map(p=>p[1]))>b[1]-pad)
 }
 function drawSurfaces(ctx,bounds){
  const remap={"packed-snow":"snow","stone-snow":"frost","pale-stone":"stone",
   "stone-road":"road","violet-stone":"arcane","moss-stone":"moss","island-grass":"grass"};
  for(const s of surfaces){
   if(!inBounds(s.polygon,bounds))continue;
   ctx.save();polygon(ctx,s.polygon);ctx.clip();
   const cells=boundsCells([
    Math.max(bounds[0],Math.min(...s.polygon.map(p=>p[0]))),
    Math.max(bounds[1],Math.min(...s.polygon.map(p=>p[1]))),
    Math.min(bounds[2],Math.max(...s.polygon.map(p=>p[0]))),
    Math.min(bounds[3],Math.max(...s.polygon.map(p=>p[1])))
   ]);
   for(const c of cells){
    let surface=remap[s.material]||"stone";
    if(climate&&(s.material==="packed-snow"||s.material==="stone-snow")){
     const snow=climate.sample(c.x+WORLD_CELL*.5,c.y+WORLD_CELL*.5).snow;
     if(s.material==="packed-snow"&&snow<.46)surface=snow>.20?"thaw":"moss";
     if(s.material==="stone-snow"&&snow<.35)surface="stone";
    }
    stamp(ctx,surface,c.gx,c.gy,c.x,c.y);
    climateDetails(ctx,c,surface)
   }
   ctx.restore();
  }
 }
 function path(ctx,path){
  ctx.beginPath();path.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p))
 }
 function stripe(ctx,x,y,dx,dy,size,color){
  const nx=-dy,ny=dx;
  ctx.beginPath();ctx.moveTo(x-nx*size,y-ny*size);ctx.lineTo(x+nx*size,y+ny*size);
  ctx.strokeStyle=color;ctx.lineWidth=10;ctx.stroke()
 }
 function drawRoads(ctx,bounds){
  for(const e of roads){
   if(!inBounds(e.path,bounds,300))continue;
   const timber=!!e.crossing&&e.kind!=="ford"&&e.kind!=="causeway",
    stairs=e.kind==="stairs"||e.slope==="stairs",stone=e.kind==="causeway"||e.kind==="ford";
   const mid=timber?"#967d65":stone?"#aba99d":stairs?"#a5a8a2":
     e.kind.includes("road")?"#a7a08b":"#959886";
   path(ctx,e.path);ctx.lineCap="round";ctx.lineJoin="round";
   ctx.strokeStyle=timber?"#3c3a42":"#545967";ctx.lineWidth=e.halfWidth*2+22;ctx.stroke();
   ctx.strokeStyle=mid;ctx.lineWidth=e.halfWidth*2-12;ctx.stroke();
   // Overlay individually authored plank/tread/stone motifs aligned to
   // the physical travel direction; identical deck width to the collider.
   for(const [a,b,,len] of e.parts){
    const dx=(b[0]-a[0])/len,dy=(b[1]-a[1])/len;
    if(!Number.isFinite(dx))continue;
    const spacing=timber?32:stairs?45:stone?54:105;
    for(let k=spacing*.5;k<len;k+=spacing){
     const x=a[0]+dx*k,y=a[1]+dy*k;
     if(x<bounds[0]-150||x>bounds[2]+150||y<bounds[1]-150||y>bounds[3]+150)continue;
     if(timber||stairs||stone){
      stripe(ctx,x,y,dx,dy,e.halfWidth*.82,
       timber?"#594b47":stairs?"#6e7380":k%2?"#8a8e89":"#b4b4a7");
      const h=hash(Math.floor(x/12),Math.floor(y/12),4);
      ctx.fillStyle=timber?"#d3b18b":stairs?"#ced3ce":"#ded3b3";
      ctx.fillRect(Math.round(x-4-h*8),Math.round(y-2),9,4)
     }else{
      const seed=hash(Math.floor(x/35),Math.floor(y/35),13);
      ctx.fillStyle=seed>.5?"rgba(235,231,207,.65)":"rgba(55,62,65,.32)";
      ctx.fillRect(Math.round(x-7+seed*7),Math.round(y-5),12,4)
     }
    }
   }
   if(timber){
    // Two raised wood edges read as rail deck, NOT a path over water.
    for(let sign of [-1,1]){
     const rail=e.path.map((p,i)=>{
      const other=e.path[Math.min(e.path.length-1,i+1)],prev=e.path[Math.max(0,i-1)];
      const dx=other[0]-prev[0],dy=other[1]-prev[1],d=Math.hypot(dx,dy)||1;
      return[p[0]-dy/d*sign*e.halfWidth*.92,p[1]+dx/d*sign*e.halfWidth*.92]
     });
     path(ctx,rail);ctx.strokeStyle="#3c3940";ctx.lineWidth=15;ctx.stroke();
     path(ctx,rail);ctx.strokeStyle="#d0af8a";ctx.lineWidth=6;ctx.stroke()
    }
   }
  }
 }
 function oval(ctx,x,y,w,h,color){
  ctx.save();ctx.translate(x,y);ctx.scale(w,h);ctx.beginPath();ctx.arc(0,0,1,0,TAU);
  ctx.fillStyle=color;ctx.fill();ctx.restore()
 }
 function tree(ctx,s){
  const x=s.cx,y=s.cy,r=s.radius,pine=s.material==="pine-trunk";
  oval(ctx,x+24,y+18,r*1.16,r*.4,"rgba(22,38,52,.36)");
  // Explicit ground root halo lines up with the actor's physical blocker.
  oval(ctx,x,y,r,r*.44,pine?"#475f65":"#4a6658");
  ctx.fillStyle="#584b48";ctx.fillRect(Math.round(x-r*.18),Math.round(y-r*.9),r*.36,r*.85);
  const levels=pine?5:4;
  for(let j=0;j<levels;j++){
   const width=r*(pine?1.25-j*.11:1.1-j*.06),
    cy=y-r*(pine?1.25:1.0)+j*r*(pine?.15:.18);
   oval(ctx,x-9+j*3,cy,width,r*(pine?.46:.47),pine?j%2?"#314d57":"#3b5960":j%2?"#47674e":"#527357");
   oval(ctx,x-18+j*2,cy-r*.1,width*.69,r*.31,pine?"#638084":"#779365");
   if(pine)for(let k=0;k<4;k++){
    const lx=x-width*.56+k*width*.35,ly=cy-r*.16+(k%2)*r*.17;
    ctx.fillStyle=j<2?"#c1d1d5":"#8ca1a1";
    ctx.fillRect(Math.round(lx),Math.round(ly),Math.ceil(r*.21),Math.ceil(r*.06))
   }else for(let k=0;k<4;k++){
    const lx=x-width*.6+k*width*.34;
    ctx.fillStyle=k%2?"#8fa77b":"#a0b087";
    ctx.fillRect(Math.round(lx),Math.round(cy-r*.22+(k%2)*r*.15),Math.ceil(r*.16),Math.ceil(r*.08))
   }
  }
 }
 function drawProps(ctx,bounds){
  const byY=solids.slice().sort((a,b)=>(a.cy??a.a?.[1]??a.polygon?.[0]?.[1]??0)-(b.cy??b.a?.[1]??b.polygon?.[0]?.[1]??0));
  for(const s of byY){
   if(footprint&&s.id==="joren_building")continue; // painted by dedicated full-size cottage architecture from same collision polygon
   if(raster?.handlesWinterSolid?.(s))continue; // drawn in feet-Y winter scene pass
   const pts=s.polygon||(s.shape==="segment"?[s.a,s.b]:[[s.cx,s.cy]]);
   if(!inBounds(pts,bounds,600))continue;
   const x=s.cx,y=s.cy,r=s.radius;
   if(raster?.drawStatic(ctx,s))continue;
   if(s.material==="cliff-face"&&raster?.drawCliff(ctx,s))continue;
   if(s.material==="cliff-face"&&setpieces?.drawCliff(ctx,s))continue;
   if(s.material==="tree-trunk"||s.material==="pine-trunk"){
    if(illustration?.drawStatic(ctx,s))continue;
    tree(ctx,s);continue
   }
   if(s.shape==="circle"){
    oval(ctx,x+12,y+12,r*1.1,r*.43,"rgba(29,39,54,.36)");
    const c=s.material==="lantern-post"?"#655346":s.material==="ruin-column"?"#6f6879":"#73757d";
    ctx.fillStyle=c;ctx.fillRect(x-r*.8,y-r*.7,r*1.6,r*1.25);
    ctx.fillStyle="#c2bfc6";ctx.fillRect(x-r*.75,y-r*.7,r*1.4,Math.max(5,r*.24));
    if(s.material==="lantern-post"){
     ctx.fillStyle="#e6bd75";ctx.fillRect(x-r*.58,y-r*1.45,r*1.18,r*.66);
     ctx.fillStyle="#fae7b0";ctx.fillRect(x-r*.18,y-r*1.37,r*.36,r*.4);
     oval(ctx,x,y-r*1.2,r*1.25,r*.9,"rgba(247,190,113,.14)")
    }
    continue
   }
   if(s.shape==="segment"){
    ctx.beginPath();ctx.moveTo(...s.a);ctx.lineTo(...s.b);
    ctx.lineWidth=s.radius*2+6;ctx.strokeStyle="#3b4049";ctx.stroke();
    ctx.lineWidth=s.radius*1.45;ctx.strokeStyle=s.material==="railing"?"#967f6a":"#75695c";ctx.stroke();
    const dist=Math.hypot(s.b[0]-s.a[0],s.b[1]-s.a[1]),count=Math.ceil(dist/130);
    for(let i=0;i<=count;i++){
     const t=i/count,x=s.a[0]+(s.b[0]-s.a[0])*t,y=s.a[1]+(s.b[1]-s.a[1])*t;
     ctx.fillStyle="#3e3c43";ctx.fillRect(x-13,y-35,26,45);
     ctx.fillStyle="#bca68b";ctx.fillRect(x-10,y-37,20,9)
    }
    continue
   }
   const p=s.polygon;
   polygon(ctx,p);
   ctx.fillStyle=s.material==="cliff-face"?"#45485a":s.material==="timber-wall"?"#675747":"#777487";ctx.fill();
   ctx.strokeStyle=s.material==="cliff-face"?"#34384b":"#49495a";ctx.lineWidth=18;ctx.stroke();
   const xs=p.map(pt=>pt[0]),ys=p.map(pt=>pt[1]),left=Math.min(...xs),top=Math.min(...ys);
   const ww=Math.max(...xs)-left,hh=Math.max(...ys)-top;
   ctx.fillStyle=s.material==="cliff-face"?"#9294a5":"#c1bbb4";
   ctx.fillRect(left+9,top+4,Math.max(15,ww*.78),Math.max(6,hh*.1));
   if(s.material==="cliff-face")for(let j=0;j<4;j++){
    const px=left+ww*.17+j*ww*.19;
    ctx.fillStyle=j%2?"#62677e":"#596076";
    ctx.fillRect(px,top+hh*.22,Math.max(8,ww*.14),Math.max(12,hh*.7))
   }
  }
 }
 function paintChunk(ctx,bounds,resolution){
  const worldSize=bounds[2]-bounds[0];
  ctx.save();
  ctx.imageSmoothingEnabled=false;
  ctx.scale(resolution/worldSize,resolution/worldSize);
  ctx.translate(-bounds[0],-bounds[1]);
  drawBase(ctx,bounds);
  // R35d: exact-world continuous native river beneath physical paths.
  paintFallsWaterChannel(ctx,bounds);
  if(footprint)footprint.draws(ctx,bounds);
  drawSurfaces(ctx,bounds);
  if(illustration)illustration.drawGround(ctx,bounds);
  // R40: overlay the native water/dry-bank contact AFTER forest floor,
  // BEFORE source road/deck drawing. No physical geometry is touched.
  paintFallsShorelineTransition(ctx,bounds);
  if(raster)raster.drawVillageGround(ctx,bounds,setpieces?.objects||[]);
  if(routeArt)routeArt.draw(ctx,bounds);else drawRoads(ctx,bounds);
  // Actual boots have walked the original snowy roads; never stamp false paths.
  if(raster?.drawWinterFootpaths)raster.drawWinterFootpaths(ctx,bounds);
  if(illustration)illustration.drawFeatures(ctx,bounds,!!raster?.drawWinterScene);
  else if(footprint)footprint.drawScenery(ctx,bounds);
  if(setpieces)setpieces.draw(ctx,bounds,o=>!!raster?.handlesSetpiece(o));
  drawProps(ctx,bounds);
  // Original illustrated elements share physical Y order, no longer a pile
  // of "all trees / all cottages / all lanterns" painted over each other.
  if(raster?.drawWinterScene)raster.drawWinterScene(ctx,bounds,setpieces?.objects||[]);
  else if(raster)raster.drawSetpieces(ctx,bounds,setpieces?.objects||[]);
  if(raster)raster.drawVillageAtmosphere(ctx,bounds,setpieces?.objects||[]);
  ctx.restore()
 }
 function paintForeground(ctx,player){
  if(illustration)illustration.drawForeground(ctx,player);
  else if(footprint)footprint.drawForeground(ctx,player);
  // House roofs with physically nearer footpoints must cover actors BEHIND
  // them; cached chunks are otherwise always underneath the actor sprite.
  if(raster?.drawArchitectureForeground)
   raster.drawArchitectureForeground(ctx,player,setpieces?.objects||[]);
  // Low, genuine stone retaining walls only occlude the Wanderer when a
  // source wall panel is physically in front of the character's boots.
  if(raster?.drawRetainingWallForeground)
   raster.drawRetainingWallForeground(ctx,player);
  // Painter's order: only trees physically *in front* of the player's boots
  // gain a translucent crown overlap. Roots and shadows remain on terrain.
  for(const s of solids){
   if(!["tree-trunk","pine-trunk"].includes(s.material)||s.cy<=player.y||raster?.covers(s.cx,s.cy))continue;
   if(Math.abs(s.cx-player.x)>s.radius*1.15||s.cy-player.y>s.radius*1.45)continue;
   ctx.save();ctx.globalAlpha=.37;
   oval(ctx,s.cx,s.cy-s.radius*.85,s.radius*.88,s.radius*.54,
    s.material==="pine-trunk"?"#3d5961":"#496e56");
   ctx.restore()
  }
 }
 function diagnostics(){return{version:VERSION,atlasWidth:atlas.width,atlasHeight:atlas.height,
  materials:MATERIALS.length,variants:VARIANTS,sourceTilePixels:TILE,worldCellSize:WORLD_CELL,
  biomeCount:Object.keys(biomeMaterial).length,
  continuousFallsWaterR35d:true,fallsPhysicalShoreFeatherR40:true,
  fallsShoreCollisionUntouchedR40:true,landmass:footprint?.stats()??null,climateEnabled:!!climate,routeNetworkEnabled:!!routeArt,illustrationEnabled:!!illustration,setpiecesEnabled:!!setpieces,rasterPilot:!!raster,usesAuthoritativeSolids:true}}
 return{version:VERSION,atlas,materials:MATERIALS,climate,routeArt,illustration,setpieces,raster,paintChunk,paintForeground,
  materialAt,waterAt,sameSourceCell,atlasRect,boundsCells,paintFallsWaterChannel,
  paintFallsShorelineTransition,fallsShoreBands,diagnostics}
}
window.VeilwardTerrainArt={version:VERSION,create,makeGreenwoodFloorPlates,palettes:PALETTES,materials:MATERIALS,
 sourceTileSize:TILE,variants:VARIANTS,worldTileSpan:WORLD_CELL};
})();