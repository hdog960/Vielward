/* VEILWARD v1.3.8 — Hollowreach raster pilot.
 * Authored painted pixel objects in a transparent 288x96 PNG atlas. Draw
 * against real physical world anchors; no composited screenshot backdrops.
 * This is an unapproved FIRST STEP toward the original environment style.
 */
(function(){
"use strict";
const VERSION="1.3.14",URL="./assets/hollowreach_pilot_sprites_v1.png?v=1";
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
  // Crop transparent cell margins around the tall firs: keep the actual
  // winter canopy proportion rather than shrinking it into a narrow pole.
  const srcX=(index%4)*72+(index<2?10:0),
   srcY=Math.floor(index/4)*72,srcW=index<2?52:72;
  ctx.save();ctx.imageSmoothingEnabled=true;
  ctx.globalAlpha=(typeof ctx.globalAlpha==="number"?ctx.globalAlpha:1)*alpha;
  if(flip){
   ctx.translate(Math.round(x),0);ctx.scale(-1,1);
   ctx.drawImage(neighborhood,srcX,srcY,srcW,72,
    Math.round(-w/2),Math.round(y-h),w,h)
  }else ctx.drawImage(neighborhood,srcX,srcY,srcW,72,
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
    // Three distinct existing solid footprints receive distinct proportions
    // and a connected painted porch edge, not a detached fence in the square.
    const type=o.seed%3,flipped=type===1,
     w=Math.min(415,330+o.r*.45+(type-1)*19),
     h=Math.min(380,295+o.r*.38+(type===2?15:0));
    if(stamp(ctx,1,o.x,o.y,w,h,flipped))count++;
    const accent=type===1?6:5,side=type===1?-.40:.40;
    drawNeighborhood(ctx,accent,o.x+o.r*side,o.y-o.r*.06,
     o.r*(type===1?.72:.96),o.r*(type===1?.61:.67),flipped,.89);
    if(type!==2)drawNeighborhood(ctx,4,o.x-o.r*.62,o.y-o.r*.06,
     o.r*.66,o.r*.42,type===1,.9)
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
 function paintedRoad(ctx,e,bounds){
  const m=e.path[Math.floor(e.path.length/2)];
  if(!m||!winter(m[0],m[1])||e.crossing)return false;
  // R7: a worn snowbound lane follows the EXACT original route, never a new
  // invented walking corridor. Tiny visual bends stay well within its bounds.
  const center=[];
  for(const [a,b,prior,len] of e.parts){
   if(len<1)continue;
   const dx=(b[0]-a[0])/len,dy=(b[1]-a[1])/len,
    nx=-dy,ny=dx,n=Math.max(1,Math.ceil(len/70));
   for(let i=0;i<=n;i++){
    if(center.length&&i===0)continue;
    const t=i/n,dist=prior+t*len;
    const bend=Math.sin(Math.PI*t)*(Math.sin(dist*.019+e.id.length*.71)*4+
     Math.sin(dist*.041+e.id.length*.27)*2);
    center.push([a[0]+dx*len*t+nx*bend,a[1]+dy*len*t+ny*bend])
   }
  }
  if(center.length<2)return false;
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  function stroke(color,width,opacity=1){
   ctx.globalAlpha=opacity;
   ctx.beginPath();
   center.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
   ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()
  }
  // Bleed the illustrated road material into the snow with layered, low-
  // contrast shoulders, not an uninterrupted white-edged concrete ribbon.
  stroke("#8797ac",e.halfWidth*1.23,.075);
  stroke("#dbe1e5",e.halfWidth*1.02,.17);
  stroke("#91a0b0",e.halfWidth*.84,.19);
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
  stroke(stonePattern||"#a7acb6",e.halfWidth*.60,.51);
  stroke("#d9e0e5",e.halfWidth*.20,.13);
  // Brushed snow berms are aligned to the EXACT existing physical route;
  // continuous roadside brush strokes visually connect the route to the
  // weathered winter ground without adding unwalkable decorative fences.
  const villageNode=nodes.get("village");
  const localCenter=villageNode?.point.map(v=>v*model.worldDesign.worldUnitScale);
  if(localCenter){
   for(const [a,b,prior,len] of e.parts){
    if(!len)continue;
    const segments=Math.ceil(len/108),dx=(b[0]-a[0])/len,
     dy=(b[1]-a[1])/len,nx=-dy,ny=dx;
    for(let i=0;i<=segments;i++){
     const u=i/segments,wx=a[0]+(b[0]-a[0])*u,wy=a[1]+(b[1]-a[1])*u;
     if(Math.hypot(wx-localCenter[0],wy-localCenter[1])>2050)continue;
     if(bounds&&(wx<bounds[0]-130||wx>bounds[2]+130||
       wy<bounds[1]-130||wy>bounds[3]+130))continue;
     const n=Math.sin((prior+len*u)*.033+e.id.length*.59);
     if(n<-.4)continue;
     for(const sign of [-1,1]){
      const side=e.halfWidth*.52+12,xx=wx+nx*side*sign,yy=wy+ny*side*sign;
      if(geometry.waterAt(xx,yy,0)||geometry.obstacle(xx,yy,0))continue;
      const ww=22+12*(1+n),hh=7+3.5*(1+n);
      ctx.save();ctx.translate(xx,yy);ctx.scale(ww,hh);
      ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);
      ctx.fillStyle="rgba(64,92,122,.15)";ctx.fill();
      ctx.restore();
      ctx.save();ctx.translate(xx-4,yy-5);ctx.scale(ww*.94,hh*.83);
      ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);
      ctx.fillStyle="rgba(226,236,239,.43)";ctx.fill();
      ctx.restore()
     }
    }
   }
  }
  ctx.restore();
  return true
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
  const span=right-left,segments=Math.max(1,Math.min(40,Math.ceil(span/148)));
  const width=Math.min(330,Math.max(185,span/segments*1.45));
  // A wide, soft-grounded shadow and snow wash bind this real rock mass to
  // the surrounding winter terrain. Only the original polygon is solid.
  if(typeof ctx.createRadialGradient==="function"){
   ctx.save();ctx.translate(cx,foot+8);
   ctx.scale(Math.max(130,span*.77),Math.max(70,(foot-top)*.54));
   const shade=ctx.createRadialGradient(0,0,.08,0,0,1);
   shade.addColorStop(0,"rgba(43,69,103,.24)");
   shade.addColorStop(.48,"rgba(82,111,143,.13)");
   shade.addColorStop(1,"rgba(149,174,200,0)");
   ctx.fillStyle=shade;ctx.fillRect(-1,-1,2,2);ctx.restore()
  }
  ctx.save();ctx.beginPath();
  pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
  ctx.closePath();ctx.clip();
  // An escarpment is one source-backed rock mass, not independent sticker props:
  // stagger painted glacial rock beneath a continuous snow cornice. Everything
  // is clipped to the same impassable polygon that the player collides with.
  ctx.fillStyle="#394c63";ctx.fillRect(left,top,right-left,foot-top);
  for(let i=0;i<segments;i++){
   const x=left+span*(i+.5)/segments;
   const shift=((i%3)-1)*Math.min(12,(foot-top)*.06);
   const height=Math.max(195,Math.min(350,width*.95));
   drawNeighborhood(ctx,2+i%2,x,foot+shift,width,height,i%2===1,.98)
  }
  // Deep cracks run through (not outside) the actual rock collider.
  for(let i=0;i<segments*2;i++){
   const x=left+(i+.42)*span/(segments*2),fract=Math.sin(i*7.37+cx*.013);
   const y=top+(foot-top)*(.36+.36*((fract+1)*.5));
   ctx.beginPath();ctx.moveTo(x-12,y-28);ctx.lineTo(x+fract*12,y-3);
   ctx.lineTo(x+fract*8+4,y+18);
   ctx.strokeStyle="rgba(31,48,67,.31)";ctx.lineWidth=3.5;ctx.stroke()
  }
  // Top snow is a continuous terrace lip across source edge 0→1.
  const a=pts[0],b=pts[1],dx=b[0]-a[0],dy=b[1]-a[1];
  const ledgeLength=Math.hypot(dx,dy),steps=Math.max(3,Math.ceil(ledgeLength/48));
  ctx.beginPath();
  for(let i=0;i<=steps;i++){
   const t=i/steps,px=a[0]+dx*t,py=a[1]+dy*t;
   const drift=Math.sin(t*Math.PI*6+cx*.019)*3.5+Math.cos(t*Math.PI*13)*2;
   i?ctx.lineTo(px,py+24+drift):ctx.moveTo(px,py+24+drift)
  }
  for(let i=steps;i>=0;i--){
   const t=i/steps,px=a[0]+dx*t,py=a[1]+dy*t;
   const drift=Math.sin(t*Math.PI*5+cx*.011)*3;
   ctx.lineTo(px,py+4+drift)
  }
  ctx.closePath();ctx.fillStyle="rgba(204,224,236,.91)";ctx.fill();
  ctx.beginPath();
  for(let i=0;i<=steps;i++){
   const t=i/steps,px=a[0]+dx*t,py=a[1]+dy*t;
   const drift=Math.sin(t*Math.PI*5+cx*.011)*3;
   i?ctx.lineTo(px,py+4+drift):ctx.moveTo(px,py+4+drift)
  }
  ctx.strokeStyle="rgba(248,251,246,.89)";ctx.lineWidth=7;ctx.stroke();
  ctx.restore();
  // Irregular snow skirting lies on existing ground outside the physical
  // escarpment, so there is no invisible extra wall at the stone/snow seam.
  if(pts.length>=4){
   const l=pts[3],r=pts[2],dx=r[0]-l[0],dy=r[1]-l[1];
   const steps=Math.max(3,Math.ceil(Math.hypot(dx,dy)/54));
   ctx.beginPath();
   for(let i=0;i<=steps;i++){
    const t=i/steps,xx=l[0]+dx*t,yy=l[1]+dy*t;
    const frost=Math.sin(t*15+cx*.007)*5+Math.cos(t*23+cy*.015)*3;
    i?ctx.lineTo(xx,yy-5+frost):ctx.moveTo(xx,yy-5+frost)
   }
   for(let i=steps;i>=0;i--){
    const t=i/steps,xx=l[0]+dx*t,yy=l[1]+dy*t;
    const frost=Math.sin(t*17+cx*.014)*6;
    ctx.lineTo(xx,yy+17+frost)
   }
   ctx.closePath();ctx.fillStyle="rgba(221,231,236,.67)";ctx.fill();
   ctx.beginPath();ctx.moveTo(l[0],l[1]-6);
   ctx.lineTo(r[0],r[1]-6);
   ctx.strokeStyle="rgba(245,249,246,.48)";ctx.lineWidth=4;ctx.stroke()
  }
  return true
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
 function handlesWinterSolid(s){
  if(!s)return false;
  if(["pine-trunk","tree-trunk","lantern-post"].includes(s.material))
   return Number.isFinite(s.cx)&&winter(s.cx,s.cy);
  if(s.material==="cliff-face"&&s.polygon?.length){
   const cx=s.polygon.reduce((total,p)=>total+p[0],0)/s.polygon.length;
   const cy=s.polygon.reduce((total,p)=>total+p[1],0)/s.polygon.length;
   return winter(cx,cy)
  }
  return false
 }
 function drawWinterScene(ctx,bounds,objects=[]){
  // A SINGLE physical feet-Y painter order for authored firs, cliffs,
  // cottages, lanterns and source-defined geometry. Previously cottages
  // were all rendered on top of every tree regardless of actual position.
  const tasks=[];
  const visible=(x,y,pad=440)=>x>=bounds[0]-pad&&x<=bounds[2]+pad&&
    y>=bounds[1]-pad&&y<=bounds[3]+pad;
  const seen=new Set();
  const features=[...footprint.cells(bounds,460),...footprint.groves(bounds,460)];
  for(const o of features){
   if(!winter(o.x,o.y)||!visible(o.x,o.y))continue;
   if(seen.has(o.id))continue;seen.add(o.id);
   tasks.push({y:o.y,id:"a"+o.id,paint:()=>drawFeature(ctx,o)})
  }
  for(const h of footprint.source.hubs){
   if(regionOfAnchor(h.anchor)!==region||h.kind!=="smithy")continue;
   const n=nodes.get(h.anchor);if(!n)continue;
   const x=n.point[0]*model.worldDesign.worldUnitScale;
   const y=n.point[1]*model.worldDesign.worldUnitScale;
   if(visible(x,y,530))tasks.push({y,id:"h"+h.anchor,
    paint:()=>drawHub(ctx,{...h,x,y})})
  }
  for(const o of objects){
   if(!coveredSetpiece(o)||!visible(o.x,o.y,540))continue;
   tasks.push({y:o.y,id:"o"+o.id,paint:()=>drawSetpieces(ctx,bounds,[o])})
  }
  for(const s of geometry.solids||[]){
   if(!handlesWinterSolid(s))continue;
   const points=s.polygon||null;
   const x=points?points.reduce((a,p)=>a+p[0],0)/points.length:s.cx;
   const y=points?Math.max(...points.map(p=>p[1])):s.cy;
   if(!visible(x,y,650))continue;
   tasks.push({y,id:"s"+s.id,paint:()=>s.material==="cliff-face"?
     drawCliff(ctx,s):drawStatic(ctx,s)})
  }
  tasks.sort((a,b)=>a.y-b.y||a.id.localeCompare(b.id));
  for(const task of tasks)task.paint();
  return tasks.length
 }
 function drawVillageGround(ctx,bounds,objects=[]){
  // A source-authored square and connected cottage thresholds: NO painted
  // background, invented route, changed collider or free-floating art cards.
  const node=nodes.get("village");if(!node)return false;
  const unit=model.worldDesign.worldUnitScale,x=node.point[0]*unit,y=node.point[1]*unit;
  const reach=720;
  if(x+reach<bounds[0]||x-reach>bounds[2]||
    y+reach<bounds[1]||y-reach>bounds[3])return false;
  function oval(px,py,rx,ry,color){
   ctx.save();ctx.translate(px,py);ctx.scale(rx,ry);
   ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);
   ctx.fillStyle=color;ctx.fill();ctx.restore()
  }
  // Cool recessed snow in a continuous gathering apron, feathered at edges.
  if(typeof ctx.createRadialGradient==="function"){
   ctx.save();ctx.translate(x,y);ctx.scale(1,.67);
   const g=ctx.createRadialGradient(0,0,35,0,0,475);
   g.addColorStop(0,"rgba(82,106,128,.22)");
   g.addColorStop(.38,"rgba(115,135,152,.18)");
   g.addColorStop(.69,"rgba(177,197,214,.075)");
   g.addColorStop(1,"rgba(213,228,240,0)");
   ctx.fillStyle=g;ctx.fillRect(-480,-480,960,960);ctx.restore()
  }
  // Hand-laid winter flagstones: coherent bands and missing stones, not
  // isolated random pixel confetti. Most are partly submerged in snow.
  const stoneColors=["rgba(89,110,132,.29)","rgba(111,126,142,.28)",
   "rgba(146,160,175,.28)","rgba(85,104,124,.24)"];
  for(let gy=-5;gy<=5;gy++)for(let gx=-7;gx<=7;gx++){
   const key=(gx*53+gy*101),h=Math.sin(key*2.17+19)*43758.5453;
   const f=h-Math.floor(h);
   const px=x+gx*51+(gy%2)*24+(f-.5)*13;
   const py=y+gy*43+(f-.5)*9;
   const rr=Math.pow((px-x)/415,2)+Math.pow((py-y)/290,2);
   if(rr>1||f<.11||geometry.waterAt(px,py,0)||geometry.obstacle(px,py,3))continue;
   const ww=29+f*16,hh=10+f*7,skew=(f-.5)*6;
   ctx.beginPath();ctx.moveTo(px-ww*.49,py-hh*.28);
   ctx.lineTo(px-ww*.26+skew,py-hh*.6);
   ctx.lineTo(px+ww*.47,py-hh*.23);
   ctx.lineTo(px+ww*.5,py+hh*.39);
   ctx.lineTo(px-ww*.27,py+hh*.5);ctx.closePath();
   ctx.fillStyle=stoneColors[Math.abs(key)%stoneColors.length];
   ctx.fill();
   ctx.beginPath();ctx.moveTo(px-ww*.34,py-hh*.22);
   ctx.lineTo(px+ww*.23,py-hh*.15);
   ctx.strokeStyle="rgba(236,242,244,.26)";ctx.lineWidth=3;ctx.stroke()
  }
  // Architecture ground shadows and worn entry landings tie real cottages to
  // the square. Use only existing placed, collision-backed cottage footprints.
  for(const o of objects){
   if(!coveredSetpiece(o)||o.kind!=="snow_cottage")continue;
   if(Math.abs(o.x-x)>1800||Math.abs(o.y-y)>1450)continue;
   if(o.x+235<bounds[0]||o.x-235>bounds[2]||
     o.y+240<bounds[1]||o.y-300>bounds[3])continue;
   oval(o.x+15,o.y+14,o.r*1.7,o.r*.67,"rgba(45,64,84,.13)");
   oval(o.x-5,o.y+o.r*.62,o.r*1.36,o.r*.59,"rgba(116,138,159,.12)");
   const side=o.seed%2?1:-1;
   // Two staggered bands of entrance paving immediately OUTSIDE the structure.
   for(let k=0;k<9;k++){
    const px=o.x+(k-4)*28+side*3,py=o.y+o.r*.60+(k%3)*24;
    if(geometry.obstacle(px,py,3)||geometry.waterAt(px,py,3))continue;
    oval(px,py,12+(k%3)*3,5+(k%2)*2,
     k%2?"rgba(116,132,151,.27)":"rgba(223,233,236,.23)")
   }
   // A few contiguous drift lobes around the cottage foundation.
   for(const k of [-1,0,1]){
    const xx=o.x+k*o.r*.75,yy=o.y+o.r*.16+(k%2)*11;
    oval(xx,yy+9,o.r*.42,o.r*.18,"rgba(69,100,134,.13)");
    oval(xx-4,yy,o.r*.44,o.r*.16,"rgba(235,241,240,.38)")
   }
  }
  return true
 }
 function stats(){return{version:VERSION,source:"authored raster assets (3 object + 3 infrastructure + 16 ground)",
  artworkCells:30,pilotRegion:region,materialPlateSize:PLATE_SIZE,
  neighborhoodAtlasReady:!!neighborhood,neighborhoodSprites:8,
  winterDepthSorted:true,physicalRoadWeathering:true,
  winterTerraces:true,forecourtPaving:true,groundedCottageApproaches:true,
  materialPlateMode:groundPlates?"seam-composed":"single-cell fallback",geometryChanged:false,
  fullBackgroundPasted:false,creatorApproved:false}}
 return{version:VERSION,drawFeature,drawStatic,drawHub,drawSetpieces,drawDetail,
  drawCliff,drawForeground,drawVillageAtmosphere,drawWinterScene,drawVillageGround,handlesWinterSolid,paintGroundCell,paintedRoad,decorateRoute,handlesSetpiece:coveredSetpiece,
  handlesHub:coveredHub,covers:winter,stats}
}
window.VeilwardRasterPilot={version:VERSION,load,create,
 get ready(){return !!picture&&!!detail&&!!ground&&!!neighborhood},
 get materialPlateMode(){return groundPlates?"seam-composed":"single-cell fallback"},
 get error(){return error}};
})();