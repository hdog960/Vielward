/* VEILWARD Phase 9 R23 — independently illustrated Greenwood hearth cottage.
 * Only stamps onto the EXISTING 'greenwood_hearth' forest_cottage setpiece.
 * Exact geometry and saved adventure data never change. Fallback is original
 * illustrated timber cottage if image decode fails. Not creator approved.
 */
(function(){
"use strict";
const VERSION="1.3.32",SRC="./assets/greenwood_hearth_cottage_r23.webp?v=1";
const ORIGINAL=256;
let image=null,failed=false,promise=null,stamps=0;
function load(){
 if(promise)return promise;
 promise=new Promise(resolve=>{
  if(typeof Image!=="function"){failed=true;resolve(false);return}
  const candidate=new Image();
  candidate.onload=()=>{
   if(candidate.naturalWidth!==ORIGINAL||candidate.naturalHeight!==ORIGINAL){
    failed=true;resolve(false);return
   }
   image=candidate;resolve(true)
  };
  candidate.onerror=()=>{failed=true;resolve(false)};
  candidate.src=SRC
 });
 return promise
}
function stamp(ctx,o){
 if(!image||!ctx?.drawImage||o?.kind!=="forest_cottage"||
    o.anchor!=="greenwood_hearth")return false;
 // The transparent art's foundation sits on the SAME physical original
 // cottage point (x,y); its upper roof is illustration, NOT extra collision.
 const w=350,h=350,x=Math.round(o.x-w*.5),y=Math.round(o.y-h+10);
 ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
 ctx.drawImage(image,x,y,w,h);
 ctx.restore();stamps++;return true
}
function stats(){
 return{version:VERSION,ready:!!image,failed,stamps,
  sourceSize:ORIGINAL,existingAnchorOnly:true,geometryChanged:false,
  saveKeyChanged:false,creatorApproved:false}
}
window.VeilwardGreenwoodHearth={version:VERSION,load,stamp,stats,
 get ready(){return !!image},get image(){return image}};
})();
