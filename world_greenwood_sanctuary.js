/* VEILWARD Phase 9 R21 — original illustrated Greenwood hermit's refuge.
 * The authored 512px RGBA sprite is a real in-game object, not a background
 * screenshot. Existing hub position, physics, quests and saves stay intact.
 * Creator appearance approval remains 0%; preserve fallback on image error.
 */
(function(){
"use strict";
const V="1.3.32",SRC="./assets/greenwood_hermit_sanctuary_r21.webp?v=1";
let img=null,pending=null,failed=false;
function load(){
 if(pending)return pending;
 pending=new Promise(resolve=>{
  if(typeof Image!=="function"){failed=true;resolve(false);return}
  const candidate=new Image();
  candidate.onload=()=>{
   if(candidate.naturalWidth!==512||candidate.naturalHeight!==512){
    failed=true;resolve(false);return
   }
   img=candidate;resolve(true)
  };
  candidate.onerror=()=>{failed=true;resolve(false)};
  candidate.src=SRC
 });
 return pending
}
function stamp(ctx,x,y,w=424,h=424){
 if(!img||!ctx?.drawImage)return false;
 const xx=Math.round(x-w*.5),yy=Math.round(y-h);
 ctx.save();ctx.imageSmoothingEnabled=true;
 ctx.imageSmoothingQuality="high";
 ctx.drawImage(img,xx,yy,Math.round(w),Math.round(h));
 ctx.restore();return true
}
function stats(){return{version:V,ready:!!img,failed,
 sourceWidth:512,sourceHeight:512,originalWorldAnchors:true,
 physicalGeometryChanged:false,creatorApproved:false}}
window.VeilwardGreenwoodSanctuary={version:V,load,stamp,stats,
 get ready(){return !!img},get image(){return img}};
})();