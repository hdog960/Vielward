/* VEILWARD VISUALS v0.6 — live actors with transparent silhouettes and authored snow.
   The creature previously baked into the golden reference was removed in the source asset.
   Each actor draws from its tightly cropped original silhouette, not a 192x150
   rectangle carrying plants, pavement, hard-edged shadow or backdrop pixels. */
(function(){
 "use strict";
 const ASSET_ROOT="./assets/";
 const scenePaths={
  village:"village_v06_clear.jpg",
  wilds:"wilds_clean.jpg",
  cave:"cave_clean.jpg",
  forge:"forge.jpg"
 };
 const scenes=Object.create(null);
 let sheet=null;
 const CELL_W=192,CELL_H=150;
 // Cell-relative cropped, alpha-clean sprite silhouettes (x,y,w,h).
 const crops=[
  [53,31,85,112],[50,31,92,112],[53,31,85,112],[53,31,85,112],
  [53,31,85,112],[78,20,63,123],[62,19,83,119],[55,19,94,121],
  [48,19,108,118],[39,70,122,64],[49,19,115,119],[25,38,142,98]
 ];
 function loadAsset(name,file,isActor=false){
  const img=new Image();
  img.decoding="async";
  img.onload=()=>{
   if(isActor){sheet=img;window.dispatchEvent(new Event("veilward-actors-ready"))}
   else{scenes[name]=img;window.dispatchEvent(new CustomEvent("veilward-art-loaded",{detail:name}))}
  };
  img.onerror=()=>console.warn("Veilward missing art:",file);
  img.src=ASSET_ROOT+file+"?art=6";
 }
 for(const [zone,file] of Object.entries(scenePaths))loadAsset(zone,file);
 loadAsset("actors","actors_silhouette_v06.png",true);
 function background(zone){return scenes[zone]||null}
 function chooseSprite(kind,state){
  if(kind==="wolf"||kind==="npc_hound")return 9;
  if(kind==="bandit")return 10;
  if(kind==="wraith")return 11;
  if(kind.startsWith("npc_")){
   const role=kind.slice(4);
   // Never display the source sheet's incomplete/clipped merchant frame.
   return ({forge:7,inn:6,hunter:8,guard:10,hermit:8,merchant:6})[role]??6;
  }
  return state&&state.moving?1:0;
 }
 function dimensions(kind){
  const dims={
   human:[86,110],
   wolf:[108,70],bandit:[96,113],wraith:[121,95],
   npc_forge:[106,133],npc_inn:[90,119],npc_hunter:[102,127],
   npc_guard:[91,117],npc_hermit:[102,127],npc_merchant:[91,119],
   npc_hound:[104,66]
  };
  return dims[kind]||dims.human;
 }
 function shadow(ctx,x,y,w,kind){
  const rx=w*(kind==="wolf"||kind==="npc_hound"?.39:.29);
  ctx.save();
  ctx.translate(x,y+2);
  ctx.scale(rx,6.2);
  const gr=ctx.createRadialGradient(0,0,0,0,0,1);
  gr.addColorStop(0,"rgba(12,24,44,.24)");
  gr.addColorStop(.52,"rgba(18,30,45,.13)");
  gr.addColorStop(1,"rgba(16,24,34,0)");
  ctx.fillStyle=gr;
  ctx.beginPath();ctx.arc(0,0,1,0,2*Math.PI);ctx.fill();
  ctx.restore();
 }
 function actor(ctx,x,y,kind,step,attack,state){
  if(!sheet||!sheet.complete||!sheet.naturalWidth)return false;
  const idx=chooseSprite(kind,state);
  const rect=crops[idx];
  const [width,height]=dimensions(kind);
  const sx=(idx%4)*CELL_W+rect[0],sy=Math.floor(idx/4)*CELL_H+rect[1];
  // The running pose changes the legs, but feet still align with ground.
  const walk=state&&state.moving&&!kind.startsWith("npc_");
  const bob=walk?Math.abs(Math.sin(step*10))*1.2:0;
  shadow(ctx,x,y,width,kind);
  ctx.save();
  if(state?.facing&&state.facing.x<-.35){
   ctx.translate(x,y);ctx.scale(-1,1);x=0;y=0;
  }
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality="high";
  ctx.drawImage(sheet,sx,sy,rect[2],rect[3],
   Math.round(x-width/2),Math.round(y-height+bob),width,height);
  // Ash is a live hound, not a feral monster: an independent collar.
  if(kind==="npc_hound"){
   ctx.fillStyle="#b94b45";
   const xx=Math.round(x+width*.24),yy=Math.round(y-height*.52+bob);
   ctx.fillRect(xx,yy,Math.max(4,Math.round(width*.075)),3);
  }
  ctx.restore();
  return true;
 }
 function glows(ctx,zone,t){
  if(!scenes[zone])return;
  const spots=zone==="village"?
    [[879,279,45],[716,342,32],[1430,1002,38],[797,1160,30]]:
    zone==="forge"?[[1260,420,170]]:zone==="cave"?[[1580,370,150]]:[];
  ctx.save();
  for(let i=0;i<spots.length;i++){
   const [x,y,r]=spots[i];const radius=r*(1+.045*Math.sin(t*4+i));
   const gr=ctx.createRadialGradient(x,y-25,0,x,y-25,radius);
   const color=zone==="cave"?"133,109,242":"255,183,96";
   gr.addColorStop(0,"rgba("+color+",.14)");
   gr.addColorStop(1,"rgba("+color+",0)");
   ctx.fillStyle=gr;
   ctx.fillRect(x-radius,y-25-radius,2*radius,2*radius);
  }
  ctx.restore();
 }
 function blocked(zone,x,y){
  // Real collision geometry is in navigation.js. Fallback for initial load.
  if(x<65||y<70||x>1815||y>1160)return true;
  return false;
 }
 window.VeilwardArt={background,actor,glows,blocked,
  ready:()=>!!(scenes.village&&sheet&&sheet.complete&&sheet.naturalWidth),
  version:"0.6.0"};
})();