/* VEILWARD v1.3.8 — Hollowreach raster pilot.
 * Authored painted pixel objects in a transparent 288x96 PNG atlas. Draw
 * against real physical world anchors; no composited screenshot backdrops.
 * This is an unapproved FIRST STEP toward the original environment style.
 */
(function(){
"use strict";
const VERSION="1.3.12",URL="./assets/hollowreach_pilot_sprites_v1.png?v=1";
const DETAIL="./assets/hollowreach_bridge_stairs_lamp_v2.png?v=1";
const GROUND="./assets/hollowreach_ground_painted_v2.webp?v=1";
const NEIGHBORHOOD="./assets/hollowreach_neighborhood_r6.png?v=1";

let picture=null,detail=null,ground=null,neighborhood=null,groundPlates=null,pending=null,error=null;
const PLATE_CELLS=8,PLATE_CELL=32,PLATE_SIZE=PLATE_CELLS*PLATE_CELL;
// Hand-selected material variations, used only with the NEW independent
// authored raster atlas. Never sample, mirror, or tile the reference painting.
const WINTER_LAYOUT=[
 [0,2,1,3,2,0,3,1],[3,1,0,2,1,3,2,0],
 [1,3,2,0,3,1,0,2],[2,0,3,1,0,2,1,3],
 [3,0,1,2,1,2,0,3],[1,2,3,0,2,3,1,0],
 [0,3,2,1,3,0,2,1],[2,1,0,3,0,1,3,2]
];
// Assemble each painted material's 8x8 world-scale plate ONCE, in native
// source pixels, with genuinely shared pixels at internal/outer boundaries.
// This prevents each 96-unit cell looking like a separate framed carpet.
function makeGroundPlates(source){
 if(typeof document==="undefined"||!document.createElement)return null;
 const bases=[[202,217,231],[173,182,194],[158,169,184],[165,184,181]];
 const result=[];
 for(let row=0;row<4;row++){
  const c=document.createElement("canvas");c.width=PLATE_SIZE;c.height=PLATE_SIZE;
  const t=c.getContext("2d",{willReadFrequently:true});
  if(!t?.getImageData||!t?.putImageData)return null;
  t.imageSmoothingEnabled=false;
  for(let gy=0;gy<PLATE_CELLS;gy++)for(let gx=0;gx<PLATE_CELLS;gx++){
   const variant=WINTER_LAYOUT[gy][gx];
   t.drawImage(source,variant*PLATE_CELL,row*PLATE_CELL,
    PLATE_CELL,PLATE_CELL,gx*PLATE_CELL,gy*PLATE_CELL,PLATE_CELL,PLATE_CELL)
  }
  const pixels=t.getImageData(0,0,PLATE_SIZE,PLATE_SIZE),original=pixels.data;
  const intermediate=new Uint8ClampedArray(original.length);
  const at=(x,y,ch)=>((y+PLATE_SIZE)%PLATE_SIZE*PLATE_SIZE+
    (x+PLATE_SIZE)%PLATE_SIZE)*4+ch;
  // Seam-only wrapped brush: never blur the artist's native pixel details
  // across the interior of a material swatch. Seam width is 5/32 pixels.
  for(let y=0;y<PLATE_SIZE;y++)for(let x=0;x<PLATE_SIZE;x++){
   const d=Math.min(x%PLATE_CELL,PLATE_CELL-1-x%PLATE_CELL);
   const strength=d<6?(6-d)/6*.88:0;
   for(let ch=0;ch<4;ch++){
    const originalValue=original[at(x,y,ch)];
    if(!strength||ch===3){intermediate[at(x,y,ch)]=originalValue;continue}
    let total=0,weights=0;
    for(let dx=-6;dx<=6;dx++){
     const w=7-Math.abs(dx);total+=original[at(x+dx,y,ch)]*w;weights+=w
    }
    intermediate[at(x,y,ch)]=originalValue*(1-strength)+(total/weights)*strength
   }
  }
  for(let y=0;y<PLATE_SIZE;y++)for(let x=0;x<PLATE_SIZE;x++){
   const d=Math.min(y%PLATE_CELL,PLATE_CELL-1-y%PLATE_CELL);
   const strength=d<6?(6-d)/6*.88:0;
   for(let ch=0;ch<4;ch++){
    const idx=at(x,y,ch),value=intermediate[idx];
    if(ch===3){original[idx]=255;continue}
    let smoothed=value;
    if(strength){
     let total=0,weights=0;
     for(let dy=-6;dy<=6;dy++){
      const w=7-Math.abs(dy);total+=intermediate[at(x,y+dy,ch)]*w;weights+=w
     }
     smoothed=value*(1-strength)+(total/weights)*strength
    }
    // A coherent cool daylight grade counteracts the noisy high-contrast
    // snow checker without replacing the illustrated source with flat fill.
    const grade=[.12,.10,.09,.11][row];
    original[idx]=Math.round(smoothed*(1-grade)+bases[row][ch]*grade)
   }
  }
  t.putImageData(pixels,0,0);result.push(c)
 }
 return result
}

function decode(url,width,height,label){
 return new Promise((resolve,reject)=>{
  if(typeof Image!=="function"){reject(Error("Cannot decode "+label));return}
  const img=new Image();img.decoding="async";
  img.onload=()=>img.naturalWidth===width&&img.naturalHeight===height?
   resolve(img):reject(Error("Wrong "+label+" dimensions: "+img.naturalWidth+"×"+img.naturalHeight));
  img.onerror=()=>reject(Error("Missing "+label+" painted sprite atlas"));
  img.src=url
 })
}
function load(){
 if(picture&&detail&&ground&&neighborhood)return Promise.resolve(picture);
 if(pending)return pending;
 pending=Promise.all([
  decode(URL,288,96,"original winter sprite"),
  decode(DETAIL,216,72,"painted bridge/stairs/lantern"),
  decode(GROUND,128,128,"painted winter terrain"),
  decode(NEIGHBORHOOD,288,144,"eight illustrated Hollowreach environment objects")
 ]).then(images=>{
  [picture,detail,ground,neighborhood]=images;
  // The material stage is optional ONLY in synthetic test canvases. Normal
  // browsers produce four composited plates from the real source art.
  try{groundPlates=makeGroundPlates(ground)}catch(e){
   groundPlates=null;console.warn("Winter plate composition unavailable",e)
  }
  error=null;return picture
 },e=>{error=e;pending=null;throw e});
 return pending
}
function create(model,geometry,options={}){
 if(!picture||!detail||!ground||!neighborhood)throw Error("All Hollowreach painted atlases must load before streaming world");
 const footprint=options.footprint,climate=options.climate;
 if(!geometry||!footprint||!climate)throw Error("Hollowreach art requires physical world geometry");
 const region="hollowreach";
 const winter=(x,y)=>footprint.regionAt(x,y)?.id===region;
 const nodes=new Map(model.nodes.map(n=>[n.id,n]));
 function regionOfAnchor(id){return nodes.get(id)?.region}
 const supported=new Set(["snow_cottage","brazier","bridge_post","sign"]);
 const coveredSetpiece=o=>!!o&&supported.has(o.kind)&&regionOfAnchor(o.anchor)===region;
 const coveredHub=h=>!!h&&regionOfAnchor(h.anchor)===region;
 function stamp(ctx,index,x,y,width,height,flip=false,alpha=1){
  if(!ctx?.drawImage)return false;
  ctx.save();
  ctx.globalAlpha=(typeof ctx.globalAlpha==="number"?ctx.globalAlpha:1)*alpha;
  ctx.imageSmoothingEnabled=true;
  const w=Math.round(width),h=Math.round(height);
  if(flip){
   ctx.translate(Math.round(x),0);
   ctx.scale(-1,1);
   ctx.drawImage(picture,index*96,0,96,96,Math.round(-w/2),Math.round(y-h),w,h)
  }else ctx.drawImage(picture,index*96,0,96,96,Math.round(x-w/2),Math.round(y-h),w,h);
  ctx.restore();return true
 }
 function drawNeighborhood(ctx,index,x,y,width,height,flip=false,alpha=1){
  // Original alpha cutouts: two winter firs, two glacial formations,
  // snow thicket, timber rail, retaining wall, and hanging lantern.
  if(!neighborhood||!ctx?.drawImage||index<0||index>7)return false;
  const w=Math.round(width),h=Math.round(height);
  ctx.save();ctx.imageSmoothingEnabled=true;
  ctx.globalAlpha=(typeof ctx.globalAlpha==="number"?ctx.globalAlpha:1)*alpha;
  if(flip){
   ctx.translate(Math.round(x),0);ctx.scale(-1,1);
   ctx.drawImage(neighborhood,(index%4)*72,Math.floor(index/4)*72,72,72,
    Math.round(-w/2),Math.round(y-h),w,h)
  }else ctx.drawImage(neighborhood,(index%4)*72,Math.floor(index/4)*72,72,72,
    Math.round(x-w/2),Math.round(y-h),w,h);
  ctx.restore();return true
 }
 function winterVariant(o){
  const n=(Math.round(o.x/29)+Math.round(o.y/43)+(o.id?.length||0))>>>0;
  return n%2
 }
 function drawFeature(ctx,o){
  if(!o||!winter(o.x,o.y))return false;
  const r=o.radius||40,flip=(o.variant??0)>.5;
  if(o.kind==="pine"||o.kind==="oak"){
   const h=Math.min(385,Math.max(160,r*3.85));
   return drawNeighborhood(ctx,winterVariant(o),o.x,o.y,h*.73,h,flip)
  }
  if(["boulder","snowstone","cairn","ruin","crystal"].includes(o.kind)){
   const w=Math.min(265,Math.max(88,r*2.8));
   return drawNeighborhood(ctx,2+winterVariant(o),o.x,o.y,w,w*.95,flip)
  }
  if(o.kind==="scrub"||o.kind==="flowerbed"){
   const w=Math.max(50,Math.min(155,r*2.55));
   return drawNeighborhood(ctx,4,o.x,o.y,w,w*.68,flip)
  }
  // No placeholder white flower mats or procedural reeds in winter.
  if(["reeds","fallenlog"].includes(o.kind))return true;
  return false
 }
 function drawDetail(ctx,index,x,y,w,h,flip=false,alpha=1){
  if(!ctx?.drawImage)return false;
  ctx.save();ctx.imageSmoothingEnabled=true;
  ctx.globalAlpha=(typeof ctx.globalAlpha==="number"?ctx.globalAlpha:1)*alpha;
  if(flip){ctx.translate(Math.round(x),0);ctx.scale(-1,1);
   ctx.drawImage(detail,index*72,0,72,72,Math.round(-w/2),Math.round(y-h),Math.round(w),Math.round(h))}
  else ctx.drawImage(detail,index*72,0,72,72,Math.round(x-w/2),Math.round(y-h),Math.round(w),Math.round(h));
  ctx.restore();return true
 }
 function drawStatic(ctx,s){
  if(s?.material==="lantern-post"&&winter(s.cx,s.cy))
   return drawNeighborhood(ctx,7,s.cx,s.cy,108,169);
  if(!s||!["tree-trunk","pine-trunk"].includes(s.material)||!winter(s.cx,s.cy))return false;
  return drawFeature(ctx,{kind:s.material==="pine-trunk"?"pine":"oak",
   x:s.cx,y:s.cy,radius:s.radius,variant:Math.abs(Math.floor(s.cx/73))%2})
 }
 function drawHub(ctx,h){
  if(!coveredHub(h)||h.kind!=="smithy")return false;
  return stamp(ctx,1,h.x,h.y,410,355)
 }
 function drawSetpieces(ctx,bounds,objects){
  let count=0;
  for(const o of objects||[]){
   if(!coveredSetpiece(o))continue;
   if(o.x<bounds[0]-500||o.x>bounds[2]+500||o.y<bounds[1]-500||o.y>bounds[3]+500)continue;
   if(o.kind==="snow_cottage"){
    const w=Math.min(405,330+o.r*.45),h=Math.min(365,295+o.r*.38);
    // A covered cottage-front rail sits inside its EXISTING solid footprint.
    if(stamp(ctx,1,o.x,o.y,w,h,o.seed%2===0))count++;
    drawNeighborhood(ctx,5,o.x,o.y+o.r*.47,o.r*1.37,o.r*.73,o.seed%2===0,.91)
   }
   if(o.kind==="brazier"&&drawNeighborhood(ctx,7,o.x,o.y,89,132))count++;
   if(o.kind==="sign"&&drawDetail(ctx,2,o.x,o.y,66,111))count++;
   if(o.kind==="bridge_post"&&drawDetail(ctx,0,o.x,o.y,230,172))count++
  }
  return count
 }

 function groundRow(material){
  return material==="road"||material==="dirt"?1:
   ["stone","frost","cliff","ruin"].includes(material)?2:
   material==="thaw"?3:0
 }
 function groundIndex(material,gx,gy){
  const row=groundRow(material);
  let n=Math.imul(gx+317,73428767)^Math.imul(gy-29,192486581)^row*0x45d9f3b;
  n=(n^(n>>>16))>>>0;
  return row*4+(n%4)
 }
 function paintGroundCell(ctx,material,gx,gy,x,y,size){
  if(!winter(x+size*.5,y+size*.5)||
    !["snow","frost","stone","cliff","road","dirt","thaw","ruin"].includes(material))return false;
  const row=groundRow(material);
  ctx.save();ctx.imageSmoothingEnabled=true;
  ctx.fillStyle=row===0?"#c4d4e1":row===1?"#aeb4bd":row===2?"#a5afc2":"#b0c1bf";
  ctx.fillRect(x,y,size,size);
  ctx.globalAlpha=row===0?.64:row===1?.67:.72;
  if(groundPlates?.[row]){
   // Global modulo means the exact same source pixels meet across EVERY
   // streamed chunk; no chunk-local randomness or repeating 96px frames.
   const px=((gx%PLATE_CELLS)+PLATE_CELLS)%PLATE_CELLS*PLATE_CELL;
   const py=((gy%PLATE_CELLS)+PLATE_CELLS)%PLATE_CELLS*PLATE_CELL;
   ctx.drawImage(groundPlates[row],px,py,PLATE_CELL,PLATE_CELL,x,y,size,size)
  }else{
   const cell=groundIndex(material,gx,gy);
   ctx.drawImage(ground,(cell%4)*32,row*32,32,32,x,y,size,size)
  }
  ctx.restore();return true
 }
 let stonePattern=null;
 function paintedRoad(ctx,e){
  const m=e.path[Math.floor(e.path.length/2)];
  if(!m||!winter(m[0],m[1])||e.crossing)return false;
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  function stroke(color,width){ctx.beginPath();e.path.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));
   ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
  // Real illustrated stone textures replace a smooth concrete-tube ribbon.
  // Visual width stays INSIDE the existing collision corridor.
  stroke("rgba(56,68,91,.11)",e.halfWidth*.84+6);
  stroke("#c2ccd8",e.halfWidth*.76);
  if(!stonePattern&&typeof ctx.createPattern==="function"&&
    typeof document!=="undefined"&&document.createElement){
   const tile=groundPlates?.[1]||document.createElement("canvas");
   if(!groundPlates?.[1]){
    tile.width=32;tile.height=32;
    const c=tile.getContext("2d");
    c.drawImage(ground,32,32,32,32,0,0,32,32)
   }
   stonePattern=ctx.createPattern(tile,"repeat")
  }
  ctx.globalAlpha=.64;
  stroke(stonePattern||"#a7a9af",e.halfWidth*.57);
  ctx.globalAlpha=.13;
  stroke("#d6dce1",e.halfWidth*.16);
  ctx.restore();return true
 }
 function decorateRoute(ctx,e,bounds){
  if(e.crossing&&e.kind==="bridge"){
   const center=e.path[Math.floor(e.path.length/2)];
   if(center&&winter(center[0],center[1])&&e.total<820)
    drawDetail(ctx,0,center[0],center[1],e.halfWidth*2.15,e.halfWidth*1.56)
  }
  if(e.kind!=="stairs"&&e.slope!=="stairs")return;
  for(const [a,b,,len] of e.parts){
   const x=(a[0]+b[0])/2,y=(a[1]+b[1])/2;
   if(!winter(x,y)||x<bounds[0]-350||x>bounds[2]+350||
    y<bounds[1]-350||y>bounds[3]+350)continue;
   drawDetail(ctx,1,x,y,Math.max(170,e.halfWidth*1.6),Math.min(300,Math.max(160,len*.6)))
  }
 }
 function drawCliff(ctx,s){
  if(!s||s.material!=="cliff-face"||!s.polygon?.length)return false;
  const pts=s.polygon,cx=pts.reduce((sum,p)=>sum+p[0],0)/pts.length,
    cy=pts.reduce((sum,p)=>sum+p[1],0)/pts.length;
  if(!winter(cx,cy))return false;
  const left=Math.min(...pts.map(p=>p[0])),right=Math.max(...pts.map(p=>p[0])),
    top=Math.min(...pts.map(p=>p[1])),foot=Math.max(...pts.map(p=>p[1]));
  const span=right-left,segments=Math.max(1,Math.min(30,Math.ceil(span/155)));
  const width=Math.min(340,Math.max(195,span/segments*1.4));
  // The art follows and is clipped by the ORIGINAL impassable cliff polygon.
  // No single stretched boulder, extra colliders, or detached shape overlays.
  ctx.save();ctx.beginPath();
  pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
  ctx.closePath();ctx.clip();
  for(let i=0;i<segments;i++){
    const x=left+span*(i+.5)/segments;
    const shift=((i%3)-1)*Math.min(16,(foot-top)*.08);
    const height=Math.max(195,Math.min(350,width*.93));
    drawNeighborhood(ctx,2+i%2,x,foot+shift,width,height,i%2===1,.95)
  }
  ctx.restore();return true
 }
 function drawForeground(ctx,player){
  if(!winter(player.x,player.y))return false;
  const bounds=[player.x-310,player.y-270,player.x+310,player.y+300];
  for(const o of [...footprint.cells(bounds),...footprint.groves(bounds)]){
   if(!["pine","oak"].includes(o.kind)||o.y<=player.y||
    o.y-player.y>o.radius*1.4||Math.abs(o.x-player.x)>o.radius*1.25)continue;
   // Soft canopy occlusion only when a tree lies physically in front of hero.
   drawNeighborhood(ctx,winterVariant(o),o.x,o.y,Math.min(385,Math.max(160,o.radius*3.85))*.73,
    Math.min(385,Math.max(160,o.radius*3.85)),(o.variant??0)>.5,.19)
  }
  return true
 }
 function drawVillageAtmosphere(ctx,bounds,objects=[]){
  // Warm light belongs to the painted village structures and physical lamps:
  // one cohesive environment layer, never fake illuminated proxy buildings.
  if(typeof ctx.createRadialGradient!=="function")return 0;
  const sources=[];
  for(const o of objects){
    if(!coveredSetpiece(o)||!["snow_cottage","brazier","sign"].includes(o.kind))continue;
    sources.push({x:o.x+(o.kind==="snow_cottage"?o.r*.28:0),
      y:o.y-(o.kind==="snow_cottage"?o.r*.95:65),
      power:o.kind==="snow_cottage"?.15:.19,r:o.kind==="snow_cottage"?230:155})
  }
  for(const s of geometry.solids||[]){
    if(s.material==="lantern-post"&&winter(s.cx,s.cy))
      sources.push({x:s.cx,y:s.cy-100,power:.18,r:140})
  }
  let painted=0;
  for(const {x,y,r,power} of sources){
    if(x+r<bounds[0]||x-r>bounds[2]||y+r<bounds[1]||y-r>bounds[3])continue;
    ctx.save();
    const glow=ctx.createRadialGradient(x,y,2,x,y,r);
    glow.addColorStop(0,"rgba(255,200,117,"+power+")");
    glow.addColorStop(.42,"rgba(247,186,122,"+(power*.42)+")");
    glow.addColorStop(1,"rgba(238,182,136,0)");
    ctx.fillStyle=glow;ctx.fillRect(x-r,y-r,r*2,r*2);
    ctx.restore();painted++
  }
  return painted
 }
 function stats(){return{version:VERSION,source:"authored raster assets (3 object + 3 infrastructure + 16 ground)",
  artworkCells:30,pilotRegion:region,materialPlateSize:PLATE_SIZE,
  neighborhoodAtlasReady:!!neighborhood,neighborhoodSprites:8,
  materialPlateMode:groundPlates?"seam-composed":"single-cell fallback",geometryChanged:false,
  fullBackgroundPasted:false,creatorApproved:false}}
 return{version:VERSION,drawFeature,drawStatic,drawHub,drawSetpieces,drawDetail,
  drawCliff,drawForeground,drawVillageAtmosphere,paintGroundCell,paintedRoad,decorateRoute,handlesSetpiece:coveredSetpiece,
  handlesHub:coveredHub,covers:winter,stats}
}
window.VeilwardRasterPilot={version:VERSION,load,create,
 get ready(){return !!picture&&!!detail&&!!ground&&!!neighborhood},
 get materialPlateMode(){return groundPlates?"seam-composed":"single-cell fallback"},
 get error(){return error}};
})();