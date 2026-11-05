/* VEILWARD — GROUNDED TRAVEL LANDMARKS v1.2.3
 * A unified four-pose, eight-facing, 32-frame authored hero atlas.
 * Shared physical proportions, full-body foot anchor, consistent armor/scarf/sword.
 * Combat effects remain enabled; new direction-specific attack/cast sprites are future work.
 */
(function(){
"use strict";
const ROOT="./assets/",ART="20";
const files={village:"village_v06_clear.jpg",wilds:"wilds_clean.jpg",cave:"cave_clean.jpg",forge:"forge.jpg"};
const scene=Object.create(null);
let npcAtlas=null,heroAtlas=null,adultFrontAtlas=null,wardenSprite=null;
const HERO={w:160,h:180,columns:4,rows:8};
const LEGACY_HERO={w:160,h:180,columns:17,rows:8};
const ADULT_FRONT={w:112,h:126,columns:3};
const NPCCELL={w:192,h:176,columns:4};
const NPC={forge:2,guard:3,inn:4,hunter:5,merchant:6,hermit:11,hound:10};
const ENEMY={wolf:8,bandit:7,wraith:9};

const actorCellMetrics=Object.create(null);
const FALLBACK_METRICS=Object.freeze({top:8,bottom:170,left:0,right:192});
function measureCell(image,x,y){
 // Measure illustrated alpha once, not every frame. A different bottom
 // margin on each atlas cell previously made village characters hover.
 try{
  const canvas=document.createElement("canvas");
  canvas.width=NPCCELL.w;canvas.height=NPCCELL.h;
  const c=canvas.getContext("2d",{willReadFrequently:true});
  if(!c)return FALLBACK_METRICS;
  c.clearRect(0,0,NPCCELL.w,NPCCELL.h);
  c.drawImage(image,x,y,NPCCELL.w,NPCCELL.h,0,0,NPCCELL.w,NPCCELL.h);
  const rgba=c.getImageData(0,0,NPCCELL.w,NPCCELL.h).data;
  let l=NPCCELL.w,t=NPCCELL.h,r=-1,b=-1;
  for(let py=0;py<NPCCELL.h;py++)for(let px=0;px<NPCCELL.w;px++){
   if(rgba[(py*NPCCELL.w+px)*4+3]<40)continue;
   if(px<l)l=px;if(px>r)r=px;
   if(py<t)t=py;if(py>b)b=py;
  }
  return r<l?FALLBACK_METRICS:{left:l,top:t,right:r+1,bottom:b+1};
 }catch(error){console.warn("Sprite bounds inspection failed",error);return FALLBACK_METRICS}
}
function measureNpcAtlas(image){
 for(const [role,index] of Object.entries(NPC)){
  if(role==="guard")continue; // Dedicated Hal asset, never the cloned cell.
  actorCellMetrics["npc_"+role]=measureCell(image,
   (index%NPCCELL.columns)*NPCCELL.w,
   Math.floor(index/NPCCELL.columns)*NPCCELL.h);
 }
 for(const [role,index] of Object.entries(ENEMY)){
  actorCellMetrics[role]=measureCell(image,
   (index%NPCCELL.columns)*NPCCELL.w,
   Math.floor(index/NPCCELL.columns)*NPCCELL.h);
 }
}
function actorBottomPadding(kind){
 const bounds=actorCellMetrics[kind]||FALLBACK_METRICS;
 return Math.max(0,NPCCELL.h-bounds.bottom);
}
function actorTopOffset(kind){
 const h=dimensions(kind)[1];
 if(kind==="human")return h;
 const bounds=actorCellMetrics[kind]||FALLBACK_METRICS;
 const bottomGap=NPCCELL.h-bounds.bottom;
 return Math.max(0,h-(bottomGap+bounds.top)*h/NPCCELL.h);
}

// Each art load announces the exact zone. A previous version emitted an Event
// without detail: the game then re-cached "undefined" and never rebuilt the
// solid-color village canvas after images finished loading.
const loadErrors=Object.create(null);
const alternatives={
 village:["village_clean.jpg","village_golden_v05.jpg"],
 wilds:["wilds.jpg"],cave:["cave.jpg"],forge:[]
};
function signal(id,kind,type="veilward-art-loaded"){
 window.dispatchEvent(new CustomEvent(type,{detail:{zone:id,kind}}));
}
function load(id,file,kind,backup=[]){
 const candidates=[file,...backup];let attempt=0;
 function next(){
  const filename=candidates[attempt];
  const image=new Image();
  image.decoding="async";
  image.onload=()=>{
   if(!image.naturalWidth || !image.naturalHeight){failed();return;}
   if(kind==="hero")heroAtlas=image;
   else if(kind==="front")adultFrontAtlas=image;
   else if(kind==="npc"){npcAtlas=image;measureNpcAtlas(image);}
   else if(kind==="warden"){
    if(image.naturalWidth!==NPCCELL.w||image.naturalHeight!==NPCCELL.h){failed();return}
    wardenSprite=image;
    actorCellMetrics.npc_guard=measureCell(image,0,0);
   }
   else scene[id]=image;
   delete loadErrors[id];
   signal(id,kind);
  };
  function failed(){
   console.warn("Veilward image failed:",filename);
   if(++attempt<candidates.length){next();return;}
   loadErrors[id]=filename;
   signal(id,kind,"veilward-art-error");
  }
  image.onerror=failed;
  image.src=ROOT+filename+"?art="+ART;
 }
 next();
}
Object.entries(files).forEach(([id,file])=>load(id,file,"scene",alternatives[id]||[]));
load("actors","actors_v07.png","npc");
load("warden","warden_hal_v13.png","warden");
load("hero","hero_approved_8way_v12.webp","hero",["hero_full_8way_v10.png"]);
load("heroFront","hero_front_adult_v11.png","front");

function sceneReady(zone){
 const img=scene[zone];
 return !!(img&&img.complete&&img.naturalWidth>0&&img.naturalHeight>0);
}
function retryScene(zone){
 if(!files[zone])return;
 delete loadErrors[zone];
 load(zone,files[zone],"scene",alternatives[zone]||[]);
}
function sceneError(zone){return loadErrors[zone]||null}
// Screen-space Y increases toward the bottom. Clockwise sectors:
const SECTOR_TO_ROW=[2,1,0,7,6,5,4,3];
function directionRow(facing){
 if(!facing)return 0; // default south, showing the face
 const x=Number(facing.x)||0,y=Number(facing.y)||0;
 if(Math.abs(x)+Math.abs(y)<.0001)return 0;
 const sector=((Math.round(Math.atan2(y,x)/(Math.PI/4))%8)+8)%8;
 return SECTOR_TO_ROW[sector];
}
function sequence(state){
 if((state?.dodgeV||0)>0)return {start:16,frames:1};
 if((state?.attackV||0)>0) {
   const t=Math.max(0,Math.min(.999,(.18-state.attackV)/.18));
   return {start:11+Math.min(2,Math.floor(t*3)),frames:1};
 }
 if((state?.castV||0)>0){
   const t=Math.max(0,Math.min(.999,(.32-state.castV)/.32));
   return {start:14+Math.min(1,Math.floor(t*2)),frames:1};
 }
 if(state?.moving){
   const cycle=((((Number(state.step)||0)/(Math.PI*2))%1)+1)%1;
   return {start:1+Math.floor(cycle*6),frames:1};
 }
 return {start:0,frames:1};
}
// Movement phase derives from ACTUAL world distance, so no walking in place.
// Reuse the two planted contacts to make a continuous natural four-phase cycle.
function approvedSequence(state){
 if((state?.attackV||0)>0)return 2;
 if((state?.dodgeV||0)>0)return 3;
 if((state?.castV||0)>0)return 0;
 if(state?.moving){
   const cycle=((((Number(state.step)||0)/(Math.PI*2))%1)+1)%1;
   return [1,2,3,2][Math.floor(cycle*4)%4];
 }
 return 0;
}
function legacyFrontColumn(state,sequenceColumn){
 if(!state?.moving)return (state?.attackV||0)>0?2:0;
 return [1,0,2,0,1,2][(Math.max(1,sequenceColumn)-1)%6];
}
function dimensions(kind){
 const dims={human:[150,154],bandit:[165,145],wraith:[170,133],wolf:[164,119],
 npc_forge:[161,149],npc_guard:[160,147],npc_inn:[148,145],
 npc_hunter:[151,144],npc_hermit:[151,144],npc_hound:[154,117],
 npc_merchant:[159,148]};
 return dims[kind]||dims.human;
}

// Pixel-accurate Warden Hal treatment; a separate outfit and cropped haircut.
// Guard edits only: the player hero atlas and movement are deliberately unchanged.
// Warden Hal uses an independent, authored transparent PNG asset. No recoloring,
// canvas-painted geometry, or parts of the playable Wanderer's atlas.

function drawShadow(ctx,x,y,w,kind){
 ctx.save();
 const beast=kind==="wolf"||kind==="npc_hound"||kind==="wraith";
 const hero=kind==="human";
 // Contact shadow is exactly at the physical foot anchor.
 ctx.translate(Math.round(x),Math.round(y)+(hero?0:1));
 ctx.scale(w*(hero?.15:beast?.25:.17),hero?3.2:4);
 const grad=ctx.createRadialGradient(0,0,.01,0,0,1);
 grad.addColorStop(0,hero?"rgba(14,22,35,.35)":"rgba(14,22,35,.22)");
 grad.addColorStop(.5,hero?"rgba(18,25,43,.16)":"rgba(18,25,43,.11)");
 grad.addColorStop(1,"rgba(18,25,43,0)");
 ctx.fillStyle=grad;ctx.beginPath();ctx.arc(0,0,1,0,2*Math.PI);ctx.fill();ctx.restore();
}
function actor(ctx,x,y,kind,step,attack,state){
 const isHero=kind==="human";
 const img=isHero?heroAtlas:(kind==="npc_guard"?wardenSprite:npcAtlas);
 if(!img||!img.complete||!img.naturalWidth)return false;
 const [w,h]=dimensions(kind);
 drawShadow(ctx,x,y,w,kind);
 ctx.save();ctx.imageSmoothingEnabled=true;
 if(isHero){
   const row=directionRow(state?.facing);
   if(img.naturalWidth===HERO.w*HERO.columns&&img.naturalHeight===HERO.h*HERO.rows){
     // Approved source: all eight angles share one anatomy and normalization.
     const col=approvedSequence(state);
     // The approved atlas has 12 source pixels of transparent space below
     // each boot. Shift image DOWN so visible soles touch navigation point y.
     const soleOffset=Math.round(h*12/HERO.h);
     ctx.drawImage(img,col*HERO.w,row*HERO.h,HERO.w,HERO.h,
       Math.round(x-w/2),Math.round(y-h+soleOffset),w,h);
   }else{
     // Resilient offline fallback for the pre-existing 136-frame sprite sheet.
     const col=sequence(state).start;
     if(row===0&&adultFrontAtlas?.complete&&adultFrontAtlas.naturalWidth===ADULT_FRONT.w*ADULT_FRONT.columns){
       const frontCol=legacyFrontColumn(state,col);
       ctx.drawImage(adultFrontAtlas,frontCol*ADULT_FRONT.w,0,ADULT_FRONT.w,ADULT_FRONT.h,
         Math.round(x-w/2),Math.round(y-h),w,h);
     }else{
       const safeCol=col===14||col===15?0:col;
       ctx.drawImage(img,safeCol*LEGACY_HERO.w,row*LEGACY_HERO.h,LEGACY_HERO.w,LEGACY_HERO.h,
         Math.round(x-w/2),Math.round(y-h),w,h);
     }
   }
 }else{
   let index=0;
   if(kind.startsWith("npc_"))index=NPC[kind.slice(4)]??0;
   else index=ENEMY[kind]??0;
   const sx=(index%NPCCELL.columns)*NPCCELL.w;
   const sy=Math.floor(index/NPCCELL.columns)*NPCCELL.h;
   if(kind==="npc_guard"){
     // Dedicated Warden sprite. Its visible sole is pixel y=170 out of 176;
     // use measured alpha, never another arbitrary per-character offset.
     const soleOffset=Math.round(h*actorBottomPadding(kind)/NPCCELL.h);
     ctx.drawImage(img,0,0,NPCCELL.w,NPCCELL.h,
       Math.round(x-w/2),Math.round(y-h+soleOffset),w,h);
   }else{
     // Source NPCs have different transparent margins under their boots.
     const soleOffset=Math.round(h*actorBottomPadding(kind)/NPCCELL.h);
     ctx.drawImage(img,sx,sy,NPCCELL.w,NPCCELL.h,
       Math.round(x-w/2),Math.round(y-h+soleOffset),w,h);
   }
 }
 ctx.restore();
 return true;
}
function background(zone){return sceneReady(zone)?scene[zone]:null}
function glows(ctx,zone,time){
 if(!scene[zone])return;
 const spots=zone==="village"?[[879,279,45],[716,342,32],[1430,1002,38],[797,1160,30]]:
 zone==="forge"?[[1260,420,170]]:zone==="cave"?[[1580,370,150]]:[];
 ctx.save();
 for(let i=0;i<spots.length;i++){
  const [x,y,r]=spots[i],radius=r*(1+.045*Math.sin(time*4+i));
  const gr=ctx.createRadialGradient(x,y-25,0,x,y-25,radius);
  const color=zone==="cave"?"133,109,242":"255,183,96";
  gr.addColorStop(0,"rgba("+color+",.14)");
  gr.addColorStop(1,"rgba("+color+",0)");
  ctx.fillStyle=gr;ctx.fillRect(x-radius,y-25-radius,2*radius,2*radius);
 }
 ctx.restore();
}

function routeGlows(ctx,zone,time){
 // Tiny, ground-level guidance integrated with the painted scenery.
 // These are intentionally SOFT environmental glows, not icon art or
 // artificial floating arrows obscuring the golden reference images.
 if(!sceneReady(zone))return;
 const landmarks={
  village:[[1070,1090,228,188,125]],
  wilds:[[540,1068,160,190,121],[1700,745,207,187,125]],
  cave:[[344,786,173,143,210]]
 };
 const points=landmarks[zone]||[];
 if(!points.length)return;
 ctx.save();
 for(let i=0;i<points.length;i++){
  const [x,y,r,g,b]=points[i],pulse=.89+.11*Math.sin(time*1.8+i*2.3);
  const radius=44*pulse;
  const gradient=ctx.createRadialGradient(x,y-5,2,x,y-5,radius);
  gradient.addColorStop(0,"rgba("+r+","+g+","+b+",.14)");
  gradient.addColorStop(.52,"rgba("+r+","+g+","+b+",.055)");
  gradient.addColorStop(1,"rgba("+r+","+g+","+b+",0)");
  ctx.fillStyle=gradient;
  ctx.fillRect(x-radius,y-5-radius,2*radius,2*radius);
 }
 ctx.restore();
}

function blocked(zone,x,y){return x<65||y<70||x>1815||y>1160}
window.VeilwardArt={
 background,actor,glows,routeGlows,blocked,sceneReady,sceneError,retryScene,
 directionRow,sequence,approvedSequence,actorTopOffset,
 actorMetrics:kind=>({...actorCellMetrics[kind]||FALLBACK_METRICS}),
 sheetDimensions:()=>({...HERO}),
 frontDimensions:()=>({...ADULT_FRONT}),
 adultFrontLoaded:()=>!!(adultFrontAtlas?.complete&&adultFrontAtlas.naturalWidth===336),
 ready:()=>!!(scene.village&&heroAtlas&&npcAtlas&&heroAtlas.complete&&heroAtlas.naturalWidth),
 spritesReady:()=>!!(heroAtlas&&heroAtlas.complete&&heroAtlas.naturalWidth),
 version:"1.2.3"
};
})();