/* VEILWARD: The Broken Sky — visual runtime v0.7.0.
   A fully rebuilt, audited 192x176 full-body sprite atlas replaces the
   cut-off imagegen concept-sheet fragments (v0.5/0.6). Each actor lives in
   one complete, self-contained cell. The renderer never slices a body by a
   guessed crop rectangle, leaving heads, torsos, arms and shoes intact. */
(function(){
"use strict";
const ASSET_ROOT="./assets/";
const VERSION="7";
const sceneFiles={
 village:"village_v06_clear.jpg",
 wilds:"wilds_clean.jpg",
 cave:"cave_clean.jpg",
 forge:"forge.jpg"
};
const scenes=Object.create(null);
let actors=null,loadingActors=false;
const CELL_W=192,CELL_H=176,GRID_COLUMNS=4;
const SPRITE={
 hero:0,hero_walk:1,joren:2,warden:3,mira:4,hunter:5,merchant:6,
 bandit:7,wolf:8,wraith:9,hound:10,hermit:11
};
function loadAsset(name,filename,actorAsset=false){
 const im=new Image();im.decoding="async";
 im.onload=()=>{
  if(actorAsset){actors=im;loadingActors=false;window.dispatchEvent(new Event("veilward-actors-ready"))}
  else {scenes[name]=im;window.dispatchEvent(new CustomEvent("veilward-art-loaded",{detail:name}))}
 };
 im.onerror=()=>{if(actorAsset)loadingActors=false;console.warn("Veilward art unavailable:",filename)};
 im.src=ASSET_ROOT+filename+"?art="+VERSION;
}
for(const [key,file] of Object.entries(sceneFiles))loadAsset(key,file);
loadingActors=true;loadAsset("actors","actors_v07.png",true);

function roleSprite(kind,state){
 if(kind==="human")return state?.moving?SPRITE.hero_walk:SPRITE.hero;
 if(kind==="wolf")return SPRITE.wolf;
 if(kind==="bandit")return SPRITE.bandit;
 if(kind==="wraith")return SPRITE.wraith;
 const roles={
  npc_forge:SPRITE.joren,npc_guard:SPRITE.warden,
  npc_inn:SPRITE.mira,npc_hunter:SPRITE.hunter,
  npc_hermit:SPRITE.hermit,npc_hound:SPRITE.hound,
  npc_merchant:SPRITE.merchant
 };
 return roles[kind]??SPRITE.hero;
}
function roleDimensions(kind){
 const dims={
  human:[151,142],bandit:[165,145],wraith:[170,133],wolf:[164,119],
  npc_forge:[161,149],npc_guard:[160,147],npc_inn:[148,145],
  npc_hunter:[151,144],npc_hermit:[151,144],npc_hound:[154,117],
  npc_merchant:[159,148]
 };
 return dims[kind]||dims.human;
}
function shadow(ctx,x,y,width,kind){
 const isBeast=kind==="wolf"||kind==="npc_hound"||kind==="wraith";
 const rx=width*(isBeast?.31:.22);
 ctx.save();
 ctx.translate(Math.round(x),Math.round(y)+2);
 ctx.scale(rx,5.6);
 const gradient=ctx.createRadialGradient(0,0,.02,0,0,1);
 gradient.addColorStop(0,"rgba(9,17,34,.25)");
 gradient.addColorStop(.46,"rgba(17,28,43,.16)");
 gradient.addColorStop(1,"rgba(16,26,37,0)");
 ctx.fillStyle=gradient;
 ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.fill();
 ctx.restore();
}
function actor(ctx,x,y,kind,step,attack,state){
 if(!actors||!actors.complete||!actors.naturalWidth)return false;
 const n=roleSprite(kind,state);
 const [w,h]=roleDimensions(kind);
 const walking=!!(state?.moving)&&kind==="human";
 const bob=walking?Math.abs(Math.sin(step*11))*1.1:0;
 shadow(ctx,x,y,w,kind);
 ctx.save();
 if(state?.facing&&state.facing.x<-.3){
  ctx.translate(Math.round(x),Math.round(y));ctx.scale(-1,1);x=0;y=0;
 }
 // Draw the ENTIRE atlas cell; every original shoe, head, hand and weapon fits.
 // No guessed crop rectangles. Every sprite's feet end at cell y=171.
 const sx=(n%GRID_COLUMNS)*CELL_W,sy=Math.floor(n/GRID_COLUMNS)*CELL_H;
 ctx.imageSmoothingEnabled=true;
 ctx.imageSmoothingQuality="high";
 ctx.drawImage(actors,sx,sy,CELL_W,CELL_H,
   Math.round(x-w/2),Math.round(y-h+bob),w,h);
 if(kind==="human"&&attack>0){
  // Weapon swing is rendered independently; never carve it into the hero mask.
  ctx.strokeStyle="rgba(241,227,182,.82)";ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(x+9,y-h*.55,29,-.8,.8);ctx.stroke();
 }
 ctx.restore();
 return true;
}
function background(zone){return scenes[zone]||null}
function glows(ctx,zone,t){
 if(!scenes[zone])return;
 const spots=zone==="village"?[[879,279,45],[716,342,32],[1430,1002,38],[797,1160,30]]:
 zone==="forge"?[[1260,420,170]]:zone==="cave"?[[1580,370,150]]:[];
 ctx.save();
 for(let i=0;i<spots.length;i++){
  const [x,y,r]=spots[i],radius=r*(1+.045*Math.sin(t*4+i));
  const g=ctx.createRadialGradient(x,y-25,0,x,y-25,radius);
  const color=zone==="cave"?"133,109,242":"255,183,96";
  g.addColorStop(0,"rgba("+color+",.14)");g.addColorStop(1,"rgba("+color+",0)");
  ctx.fillStyle=g;ctx.fillRect(x-radius,y-25-radius,2*radius,2*radius);
 }
 ctx.restore();
}
function blocked(zone,x,y){return x<65||y<70||x>1815||y>1160}
window.VeilwardArt={
 background,actor,glows,blocked,
 ready:()=>!!(scenes.village&&actors&&actors.complete&&actors.naturalWidth),
 spritesReady:()=>!!(actors&&actors.complete&&actors.naturalWidth),
 spriteIndex:SPRITE,
 version:"0.7.0"
};
})();