/* VEILWARD v1.3.8 — Hollowreach raster pilot.
 * Authored painted pixel objects in a transparent 288x96 PNG atlas. Draw
 * against real physical world anchors; no composited screenshot backdrops.
 * This is an unapproved FIRST STEP toward the original environment style.
 */
(function(){
"use strict";
const VERSION="1.3.9",URL="./assets/hollowreach_pilot_sprites_v1.png?v=1";
const DETAIL="./assets/hollowreach_bridge_stairs_lamp_v2.png?v=1";
const GROUND="./assets/hollowreach_ground_painted_v2.webp?v=1";

let picture=null,detail=null,ground=null,pending=null,error=null;
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
 if(picture&&detail&&ground)return Promise.resolve(picture);
 if(pending)return pending;
 pending=Promise.all([
  decode(URL,288,96,"original winter sprite"),
  decode(DETAIL,216,72,"painted bridge/stairs/lantern"),
  decode(GROUND,128,128,"painted winter terrain")
 ]).then(images=>{
  [picture,detail,ground]=images;error=null;return picture
 },e=>{error=e;pending=null;throw e});
 return pending
}
function create(model,geometry,options={}){
 if(!picture||!detail||!ground)throw Error("All Hollowreach painted atlases must load before streaming world");
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
 function drawFeature(ctx,o){
  if(!o||!winter(o.x,o.y))return false;
  const r=o.radius||40,flip=(o.variant??0)>.5;
  if(o.kind==="pine"||o.kind==="oak"){
   const h=Math.min(385,Math.max(160,r*3.85));
   return stamp(ctx,0,o.x,o.y,h*.77,h,flip)
  }
  if(["boulder","snowstone","cairn","ruin","crystal"].includes(o.kind)){
   const w=Math.min(265,Math.max(88,r*2.8));
   return stamp(ctx,2,o.x,o.y,w,w*.85,flip)
  }
  // No more procedural flowers, mud, or bush piles sold as original art in
  // the pilot. Real painted shrubs will be added as distinct raster assets.
  if(["scrub","reeds","flowerbed","fallenlog"].includes(o.kind))return true;
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
   return drawDetail(ctx,2,s.cx,s.cy,80,134);
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
   if(o.kind==="snow_cottage"&&stamp(ctx,1,o.x,o.y,375,327))count++;
   if(o.kind==="brazier"&&drawDetail(ctx,2,o.x,o.y,74,121))count++;
   if(o.kind==="sign"&&drawDetail(ctx,2,o.x,o.y,66,111))count++;
   if(o.kind==="bridge_post"&&drawDetail(ctx,0,o.x,o.y,230,172))count++
  }
  return count
 }

 function groundIndex(material,gx,gy){
  const row=material==="road"||material==="dirt"?1:
   ["stone","frost","cliff","ruin"].includes(material)?2:
   material==="thaw"?3:0;
  let n=Math.imul(gx+317,73428767)^Math.imul(gy-29,192486581)^row*0x45d9f3b;
  n=(n^(n>>>16))>>>0;
  return row*4+(n%4)
 }
 function paintGroundCell(ctx,material,gx,gy,x,y,size){
  if(!winter(x+size*.5,y+size*.5)||
    !["snow","frost","stone","cliff","road","dirt","thaw","ruin"].includes(material))return false;
  const cell=groundIndex(material,gx,gy);
  ctx.save();ctx.imageSmoothingEnabled=true;
  ctx.fillStyle=material==="snow"?"#cbd7e8":material==="road"?"#acacc0":"#a2acc1";
  ctx.fillRect(x,y,size,size);
  ctx.globalAlpha=material==="snow"?.70:.73;
  ctx.drawImage(ground,(cell%4)*32,Math.floor(cell/4)*32,32,32,x,y,size,size);
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
  stroke("rgba(56,68,91,.22)",e.halfWidth*.91+8);
  stroke("#c8d2e0",e.halfWidth*.84+1);
  if(!stonePattern&&typeof ctx.createPattern==="function"&&
    typeof document!=="undefined"&&document.createElement){
   const tile=document.createElement("canvas");tile.width=32;tile.height=32;
   const c=tile.getContext("2d");
   c.drawImage(ground,32,32,32,32,0,0,32,32);
   stonePattern=ctx.createPattern(tile,"repeat")
  }
  ctx.globalAlpha=.58;
  stroke(stonePattern||"#a7a9af",e.halfWidth*.60);
  ctx.globalAlpha=.22;
  stroke("#d6dce1",e.halfWidth*.26);
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
   foot=Math.max(...pts.map(p=>p[1]));
  const width=Math.min(400,Math.max(175,(right-left)*.72));
  return stamp(ctx,2,(left+right)*.5,foot,width,width*.9)
 }
 function drawForeground(ctx,player){
  if(!winter(player.x,player.y))return false;
  const bounds=[player.x-310,player.y-270,player.x+310,player.y+300];
  for(const o of [...footprint.cells(bounds),...footprint.groves(bounds)]){
   if(!["pine","oak"].includes(o.kind)||o.y<=player.y||
    o.y-player.y>o.radius*1.4||Math.abs(o.x-player.x)>o.radius*1.25)continue;
   // Soft canopy occlusion only when a tree lies physically in front of hero.
   stamp(ctx,0,o.x,o.y,Math.min(385,Math.max(160,o.radius*3.85))*.77,
    Math.min(385,Math.max(160,o.radius*3.85)),(o.variant??0)>.5,.21)
  }
  return true
 }
 function stats(){return{version:VERSION,source:"authored raster assets (3 object + 3 infrastructure + 16 ground)",
  artworkCells:22,pilotRegion:region,geometryChanged:false,
  fullBackgroundPasted:false,creatorApproved:false}}
 return{version:VERSION,drawFeature,drawStatic,drawHub,drawSetpieces,drawDetail,
  drawCliff,drawForeground,paintGroundCell,paintedRoad,decorateRoute,handlesSetpiece:coveredSetpiece,
  handlesHub:coveredHub,covers:winter,stats}
}
window.VeilwardRasterPilot={version:VERSION,load,create,get ready(){return !!picture&&!!detail&&!!ground},get error(){return error}};
})();