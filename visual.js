/* VEILWARD visual runtime v0.9 — authored rear-facing sprite & six-frame strides.
 * The original complete v0.7 character art is preserved. Hero poses are built
 * as cached 6-frame strides from that intact sprite, not broken alpha cutouts.
 * No paid services, extra dependencies, or new sprite downloads needed. */
(function(){
"use strict";
const ROOT="./assets/",ASSET_VERSION="9";
const sceneFiles={village:"village_v06_clear.jpg",wilds:"wilds_clean.jpg",cave:"cave_clean.jpg",forge:"forge.jpg"};
const scenes=Object.create(null);
let actors=null,animation=null,rearFrames=null;
const CELL_W=192,CELL_H=176,COLUMNS=4,STRIDE=6;
const SPRITE={hero:0,joren:2,warden:3,mira:4,hunter:5,merchant:6,bandit:7,wolf:8,wraith:9,hound:10,hermit:11};

function loadAsset(id,file,isActor){
 const image=new Image();image.decoding="async";
 image.onload=()=>{
  if(isActor){actors=image;try{buildAnimation()}catch(error){console.warn("Veilward walk frame build failed",error)}
    window.dispatchEvent(new Event("veilward-actors-ready"))}
  else{scenes[id]=image;window.dispatchEvent(new CustomEvent("veilward-art-loaded",{detail:id}))}
 };
 image.onerror=()=>console.warn("Veilward art unavailable:",file);
 image.src=ROOT+file+"?art="+ASSET_VERSION;
}
for(const [zone,file] of Object.entries(sceneFiles))loadAsset(zone,file,false);
loadAsset("actors","actors_v07.png",true);
// A full-body rear view is now a dedicated game art asset. Never paint over
// the character's face with rectangular chest and hair polygons again.
const rearImage=new Image();rearImage.decoding="async";
rearImage.onload=()=>{
 rearFrames=rearImage;
 try{buildAnimation()}catch(error){console.warn("Veilward rear animation build failed",error)}
 window.dispatchEvent(new Event("veilward-rear-ready"));
};
rearImage.onerror=()=>console.warn("Veilward rear sprite unavailable");
rearImage.src=ROOT+"hero_back_strides_v09.webp?art="+ASSET_VERSION;

function canvas(w=CELL_W,h=CELL_H){
 const el=document.createElement("canvas");el.width=w;el.height=h;return el;
}
function path(ctx,points){
 ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
 for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();
}
const LEFT=[[41,121],[79,121],[77,138],[76,174],[38,174],[37,146]];
const RIGHT=[[78,121],[110,121],[113,151],[111,174],[77,174],[77,142]];
function maskLayer(source,polygon){
 const c=canvas(),g=c.getContext("2d");
 g.drawImage(source,0,0);
 g.globalCompositeOperation="destination-in";g.fillStyle="#fff";path(g,polygon);g.fill();
 g.globalCompositeOperation="source-over";
 return c;
}
function bodyWithoutLegs(source){
 const c=canvas(),g=c.getContext("2d");
 g.drawImage(source,0,0);g.globalCompositeOperation="destination-out";
 g.fillStyle="#fff";path(g,LEFT);g.fill();path(g,RIGHT);g.fill();
 g.globalCompositeOperation="source-over";return c;
}
function frame(source,phase,isIdle){
 if(isIdle)return source;
 const left=maskLayer(source,LEFT),right=maskLayer(source,RIGHT),torso=bodyWithoutLegs(source);
 const c=canvas(),g=c.getContext("2d");
 const sway=Math.sin(phase),lift=Math.abs(Math.cos(phase));
 g.save();g.translate(64,125);g.rotate(sway*.13);g.translate(-64,-125);
 g.drawImage(left,sway*2.2,-Math.max(0,-sway)*2.5);g.restore();
 g.save();g.translate(93,125);g.rotate(-sway*.13);g.translate(-93,-125);
 g.drawImage(right,-sway*2.2,-Math.max(0,sway)*2.5);g.restore();
 g.drawImage(torso,0,-lift*.8);
 return c;
}
function flip(source){
 const c=canvas(),g=c.getContext("2d");g.translate(CELL_W,0);g.scale(-1,1);g.drawImage(source,0,0);return c
}
function buildAnimation(){
 if(!actors||!actors.naturalWidth)return;
 const source=canvas(),g=source.getContext("2d");
 g.imageSmoothingEnabled=false;g.drawImage(actors,0,0,CELL_W,CELL_H,0,0,CELL_W,CELL_H);
 // Rear-facing poses are sourced from the separately authored WEBP sheet.
 // Row 0 forward (down), row 1 left, row 2 right, row 3 away (up).
 animation=canvas(CELL_W*STRIDE,CELL_H*4);
 const dest=animation.getContext("2d");dest.imageSmoothingEnabled=false;
 for(let direction=0;direction<3;direction++){
  for(let i=0;i<STRIDE;i++){
   let f=frame(source,i*Math.PI*2/STRIDE,i===0);
   if(direction===2)f=flip(f);
   dest.drawImage(f,i*CELL_W,direction*CELL_H);
  }
 }
 // Rear frames are preauthored and checked at native 192x176 resolution.
 // Preserve the actual rendered shoulder, scarf, hair and boots in each frame.
 if(rearFrames&&rearFrames.complete&&rearFrames.naturalWidth){
  for(let i=0;i<STRIDE;i++){
   dest.drawImage(rearFrames,i*CELL_W,0,CELL_W,CELL_H,i*CELL_W,3*CELL_H,CELL_W,CELL_H);
  }
 }else{
  // Temporary image-loading fallback, replaced immediately on rear load.
  for(let i=0;i<STRIDE;i++){
   dest.drawImage(source,i*CELL_W,3*CELL_H,CELL_W,CELL_H);
  }
 }
}
function facingRow(face){
 if(!face)return 0;
 const x=face.x||0,y=face.y||0;
 if(Math.abs(x)>Math.abs(y)*.8)return x>0?2:1;
 return y<0?3:0;
}
function frameIndex(step){
 // About 9 distinct poses per second; previous version took >1 second
 // just to advance one pose, which looked like sliding.
 return ((Math.floor((step||0)*9)%STRIDE)+STRIDE)%STRIDE;
}
function roleSprite(kind){
 if(kind==="wolf")return SPRITE.wolf;
 if(kind==="bandit")return SPRITE.bandit;
 if(kind==="wraith")return SPRITE.wraith;
 const npc={npc_forge:SPRITE.joren,npc_guard:SPRITE.warden,npc_inn:SPRITE.mira,
  npc_hunter:SPRITE.hunter,npc_hermit:SPRITE.hermit,npc_hound:SPRITE.hound,npc_merchant:SPRITE.merchant};
 return npc[kind]??SPRITE.hero;
}
function dimensions(kind){
 const dims={human:[151,142],bandit:[165,145],wraith:[170,133],wolf:[164,119],
  npc_forge:[161,149],npc_guard:[160,147],npc_inn:[148,145],npc_hunter:[151,144],
  npc_hermit:[151,144],npc_hound:[154,117],npc_merchant:[159,148]};
 return dims[kind]||dims.human
}
function shadow(ctx,x,y,w,kind){
 const beast=kind==="wolf"||kind==="npc_hound"||kind==="wraith";
 ctx.save();ctx.translate(Math.round(x),Math.round(y)+2);ctx.scale(w*(beast?.31:.22),5.6);
 const gr=ctx.createRadialGradient(0,0,.02,0,0,1);
 gr.addColorStop(0,"rgba(9,17,34,.25)");gr.addColorStop(.46,"rgba(17,28,43,.16)");
 gr.addColorStop(1,"rgba(16,26,37,0)");
 ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.fill();ctx.restore()
}
function actor(ctx,x,y,kind,step,attack,state){
 if(!actors||!actors.complete||!actors.naturalWidth)return false;
 const [w,h]=dimensions(kind);
 shadow(ctx,x,y,w,kind);
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(kind==="human"&&animation){
  // Full-body frames anchor all boots at the same baseline.
  const row=facingRow(state?.facing);
  const col=state?.moving?frameIndex(step):0;
  ctx.drawImage(animation,col*CELL_W,row*CELL_H,CELL_W,CELL_H,
    Math.round(x-w/2),Math.round(y-h),w,h);
 }else{
  // Non-player NPC and enemy sprites remain intact, with no crop masking.
  const n=roleSprite(kind),sx=n%4*CELL_W,sy=Math.floor(n/4)*CELL_H;
  ctx.drawImage(actors,sx,sy,CELL_W,CELL_H,Math.round(x-w/2),Math.round(y-h),w,h);
 }
 if(kind==="human"&&attack>0){
  ctx.strokeStyle="rgba(241,227,182,.82)";ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(x+9,y-h*.55,29,-.8,.8);ctx.stroke()
 }
 ctx.restore();return true
}
function background(zone){return scenes[zone]||null}
function glows(ctx,zone,time){
 if(!scenes[zone])return;
 const spots=zone==="village"?[[879,279,45],[716,342,32],[1430,1002,38],[797,1160,30]]:
  zone==="forge"?[[1260,420,170]]:zone==="cave"?[[1580,370,150]]:[];
 ctx.save();
 for(let i=0;i<spots.length;i++){
  const [x,y,r]=spots[i],radius=r*(1+.045*Math.sin(time*4+i));
  const gr=ctx.createRadialGradient(x,y-25,0,x,y-25,radius);
  const color=zone==="cave"?"133,109,242":"255,183,96";
  gr.addColorStop(0,"rgba("+color+",.14)");gr.addColorStop(1,"rgba("+color+",0)");
  ctx.fillStyle=gr;ctx.fillRect(x-radius,y-25-radius,2*radius,2*radius);
 }
 ctx.restore()
}
function blocked(zone,x,y){return x<65||y<70||x>1815||y>1160}
window.VeilwardArt={
 background,actor,glows,blocked,ready:()=>!!(scenes.village&&actors&&actors.complete&&actors.naturalWidth),
 spritesReady:()=>!!(actors&&actors.complete&&actors.naturalWidth),
 directionRow:facingRow,walkFrame:frameIndex,animationReady:()=>!!animation,
 rearReady:()=>!!(rearFrames&&rearFrames.complete&&rearFrames.naturalWidth),
 version:"0.9.0"
};
})();