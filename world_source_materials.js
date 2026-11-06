/* VEILWARD R3 ART-PIPELINE RESET — v1.3.7.
 * MATERIAL SOURCE: the ACTUAL approved Hollowreach and Greenwood paintings.
 * Author the outdoor WORLD using an atlas of reusable raster materials,
 * not by covering the screen with the full painting as a fake background.
 * This is a foundation for artist-cut object atlases; never call this "approved".
 */
(function(){
"use strict";
const VERSION="1.3.7",S=96,VARIANTS=4,COLUMNS=8;
const ROOT="./assets/";
const FILES={village:"village_v06_clear.jpg",wilds:"wilds_clean.jpg"};
const MATR=[
 "snow","frost","thaw","forest","grass","moss","road","dirt",
 "stone","ruin","wetland","river","lake","cliff","arcane","timber"
];
// The 900 x 584 ORIGINAL PAINTINGS contain deliberate painted ground texture,
// not empty vector colors. Crop deliberately from natural ground, bank stones,
// snow, river and authored wooden bridges; never the hero, HUD or full scene.
// Each material has four distinct patches to break cyclic stamping.
const CUTS={
 snow:[["village",492,255],["village",570,265],["village",507,305],["village",181,499]],
 frost:[["village",689,190],["village",657,273],["village",615,155],["village",755,282]],
 thaw:[["village",434,440],["village",482,435],["village",562,472],["wilds",302,432]],
 forest:[["wilds",289,319],["wilds",357,260],["wilds",340,392],["wilds",580,297]],
 grass:[["wilds",329,330],["wilds",378,355],["wilds",634,280],["wilds",290,482]],
 moss:[["wilds",214,212],["wilds",349,313],["wilds",97,409],["wilds",630,307]],
 road:[["village",467,296],["village",557,306],["village",593,305],["village",484,331]],
 dirt:[["wilds",507,264],["wilds",554,276],["wilds",471,307],["wilds",618,279]],
 stone:[["village",653,131],["village",605,166],["village",703,214],["village",665,335]],
 ruin:[["wilds",693,116],["wilds",728,137],["wilds",791,185],["wilds",746,92]],
 wetland:[["wilds",226,277],["wilds",187,344],["wilds",286,313],["wilds",130,365]],
 river:[["village",117,273],["village",182,283],["village",604,410],["village",650,455]],
 lake:[["wilds",138,298],["wilds",197,314],["wilds",210,379],["wilds",626,474]],
 cliff:[["village",136,153],["village",198,166],["wilds",157,136],["wilds",120,177]],
 arcane:[["wilds",734,81],["wilds",783,101],["wilds",746,179],["wilds",657,91]],
 timber:[["wilds",463,410],["wilds",516,405],["village",345,418],["village",378,402]]
};
let cache=null,loading=null,loadError=null;
function load(){
 if(cache)return Promise.resolve(cache);
 if(loading)return loading;
 loading=Promise.all(Object.entries(FILES).map(([id,file])=>new Promise((resolve,reject)=>{
  const img=new Image();img.decoding="async";
  img.onload=()=>img.naturalWidth===900&&img.naturalHeight===584?
   resolve([id,img]):reject(Error("Authored source changed size "+file));
  img.onerror=()=>reject(Error("Missing approved source "+file));
  img.src=ROOT+file+"?world-art="+VERSION;
 }))).then(parts=>(cache=Object.fromEntries(parts)),e=>{loadError=e;loading=null;throw e});
 return loading
}
function makeTile(ctx,im,sx,sy,ox,oy){
 // Build a seamless 96px material tile from FOUR MIRRORED 48px patches.
 // The source remains the hand-illustrated raster; mirroring protects seams
 // without replacing its brushwork with generated pixel noise.
 const T=S/2;
 for(let row=0;row<2;row++)for(let col=0;col<2;col++){
  ctx.save();
  ctx.translate(ox+col*T+(col?T:0),oy+row*T+(row?T:0));
  ctx.scale(col?-1:1,row?-1:1);
  ctx.drawImage(im,sx,sy,T,T,0,0,T,T);
  ctx.restore()
 }
}
function create(factory){
 if(!cache)throw Error("Approved pixel-art materials must load before world creation");
 const make=factory||(()=>document.createElement("canvas"));
 const atlas=make();atlas.width=8*S;atlas.height=8*S;
 const ctx=atlas.getContext("2d",{alpha:false});
 if(!ctx)throw Error("Material atlas canvas missing");
 ctx.imageSmoothingEnabled=false;
 for(let m=0;m<MATR.length;m++)for(let v=0;v<VARIANTS;v++){
  const name=MATR[m],sample=CUTS[name][v],im=cache[sample[0]],i=m*VARIANTS+v;
  makeTile(ctx,im,sample[1],sample[2],(i%COLUMNS)*S,Math.floor(i/COLUMNS)*S)
 }
 const cutouts={};
 function pattern(context,name){
  if(typeof context.createPattern!=="function")return null;
  const m=MATR.indexOf(name);if(m<0)return null;
  if(!cutouts[name]){
   const c=make();c.width=S;c.height=S;
   const cc=c.getContext("2d",{alpha:false});
   cc.drawImage(atlas,(m*4%COLUMNS)*S,Math.floor((m*4)/COLUMNS)*S,S,S,0,0,S,S);
   cutouts[name]=c
  }
  return context.createPattern(cutouts[name],"repeat")
 }
 return{version:VERSION,atlas,pattern,source:"existing approved original painting assets",
  labels:MATR.slice(),originalReferences:Object.values(FILES),reusableMaterialTiles:64,
  backgroundScreenshotUsed:false,creatorApproved:false}
}
window.VeilwardSourceMaterials={version:VERSION,load,create,get ready(){return !!cache},
 get error(){return loadError},palette:MATR};
})();