/* VEILWARD v1.3.8 — Hollowreach raster pilot.
 * Authored painted pixel objects in a transparent 288x96 PNG atlas. Draw
 * against real physical world anchors; no composited screenshot backdrops.
 * This is an unapproved FIRST STEP toward the original environment style.
 */
(function(){
"use strict";
const VERSION="1.3.8",URL="./assets/hollowreach_pilot_sprites_v1.png?v=1";
let picture=null,pending=null,error=null;
function load(){
 if(picture)return Promise.resolve(picture);
 if(pending)return pending;
 pending=new Promise((resolve,reject)=>{
  if(typeof Image!=="function"){reject(Error("No image decoder for pilot art"));return}
  const img=new Image();img.decoding="async";
  img.onload=()=>{
   if(img.naturalWidth!==288||img.naturalHeight!==96){
    error=Error("Hollowreach authored sprites must be 3 x 96 pixels");pending=null;reject(error);return
   }
   picture=img;error=null;resolve(img)
  };
  img.onerror=()=>{error=Error("Hollowreach authored sprite PNG unavailable");pending=null;reject(error)};
  img.src=URL
 });
 return pending
}
function create(model,geometry,options={}){
 if(!picture)throw Error("Hollowreach raster image must load before constructing world");
 const footprint=options.footprint,climate=options.climate;
 if(!geometry||!footprint||!climate)throw Error("Hollowreach art requires physical world geometry");
 const region="hollowreach";
 const winter=(x,y)=>footprint.regionAt(x,y)?.id===region;
 const nodes=new Map(model.nodes.map(n=>[n.id,n]));
 function regionOfAnchor(id){return nodes.get(id)?.region}
 const coveredSetpiece=o=>!!o&&regionOfAnchor(o.anchor)===region;
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
 function drawStatic(ctx,s){
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
   if(o.kind==="snow_cottage"&&stamp(ctx,1,o.x,o.y,375,327))count++
  }
  return count
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
 function stats(){return{version:VERSION,source:"authored transparent pixel-raster PNG",
  artworkCells:3,pilotRegion:region,geometryChanged:false,
  fullBackgroundPasted:false,creatorApproved:false}}
 return{version:VERSION,drawFeature,drawStatic,drawHub,drawSetpieces,
  drawCliff,drawForeground,handlesSetpiece:coveredSetpiece,
  handlesHub:coveredHub,covers:winter,stats}
}
window.VeilwardRasterPilot={version:VERSION,load,create,get ready(){return !!picture},get error(){return error}};
})();