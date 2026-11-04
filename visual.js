/* VEILWARD — GROUNDED HERO & DISTINCT WARDEN v1.1.1
 * A unified four-pose, eight-facing, 32-frame authored hero atlas.
 * Shared physical proportions, full-body foot anchor, consistent armor/scarf/sword.
 * Combat effects remain enabled; new direction-specific attack/cast sprites are future work.
 */
(function(){
"use strict";
const ROOT="./assets/",ART="14";
const files={village:"village_v06_clear.jpg",wilds:"wilds_clean.jpg",cave:"cave_clean.jpg",forge:"forge.jpg"};
const scene=Object.create(null);
let npcAtlas=null,heroAtlas=null,adultFrontAtlas=null,wardenSprite=null;
const HERO={w:160,h:180,columns:4,rows:8};
const LEGACY_HERO={w:160,h:180,columns:17,rows:8};
const ADULT_FRONT={w:112,h:126,columns:3};
const NPCCELL={w:192,h:176,columns:4};
const NPC={forge:2,guard:3,inn:4,hunter:5,merchant:6,hermit:11,hound:10};
const ENEMY={wolf:8,bandit:7,wraith:9};
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
   else if(kind==="npc"){npcAtlas=image;wardenSprite=createWardenVariant(image);}
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

// Build one distinctive Warden Hal sprite from shaded source pixel art.
// His helm, shield and midnight-blue mantle replace the hero-like appearance.
function createWardenVariant(img){
 try{
  const canvas=document.createElement("canvas");
  canvas.width=192;canvas.height=176;
  const c=canvas.getContext("2d",{willReadFrequently:true});
  if(!c)return null;
  c.imageSmoothingEnabled=false;
  c.drawImage(img,576,0,192,176,0,0,192,176);
  const pixels=c.getImageData(0,0,192,176),data=pixels.data;
  for(let y=0;y<176;y++)for(let x=0;x<192;x++){
   const i=4*(y*192+x);if(!data[i+3])continue;
   const r=data[i],g=data[i+1],b=data[i+2];
   // Shift the distinctive red scarf to desaturated dark blue, retaining
   // every original highlight and shadow.
   if(!(x>74&&x<119&&y<76)&&y<122&&r>g*1.25&&r>b*1.2&&g<146){
    const lum=r*.32+g*.52+b*.16;
    data[i]=Math.min(255,lum*.49+14);
    data[i+1]=Math.min(255,lum*.66+28);
    data[i+2]=Math.min(255,lum*.92+49);
   }
  }
  c.putImageData(pixels,0,0);
  // Hair is fully concealed by a steel greathelm and slotted visor.
  c.clearRect(67,4,63,29);
  const t=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
  t(86,5,25,5,"#162637");t(79,10,38,7,"#293d53");
  t(74,17,47,9,"#41596b");t(70,26,56,11,"#34495b");
  t(67,37,61,9,"#192d41");t(70,46,55,9,"#2b4052");
  t(76,55,43,9,"#233749");t(83,64,30,4,"#132637");
  t(81,9,30,3,"#8597a2");t(77,17,36,3,"#9db0b4");
  t(74,23,46,2,"#71889b");t(70,33,56,3,"#c8aa73");
  t(69,38,58,3,"#152432");
  t(76,43,17,3,"#aec6d3");t(102,43,17,3,"#aec6d3");
  t(92,39,9,20,"#b4a88c");t(94,46,5,12,"#536878");
  t(80,52,33,3,"#81909a");t(78,57,38,4,"#172635");
  t(74,44,5,18,"#7a8d96");t(117,43,5,18,"#516b7b");
  t(86,5,11,3,"#d5b67b");t(95,3,4,20,"#bf9f65");
  t(97,6,3,9,"#f0d49c");
  // A Warden's kite shield gives him a different silhouette and equipment.
  c.beginPath();c.moveTo(40,80);c.lineTo(70,75);c.lineTo(83,83);
  c.lineTo(81,119);c.lineTo(66,142);c.lineTo(46,129);
  c.lineTo(40,113);c.closePath();c.fillStyle="#122332";c.fill();
  c.beginPath();c.moveTo(44,84);c.lineTo(69,79);c.lineTo(79,85);
  c.lineTo(77,118);c.lineTo(65,136);c.lineTo(49,125);
  c.lineTo(44,111);c.closePath();c.fillStyle="#c1a978";c.fill();
  c.beginPath();c.moveTo(48,87);c.lineTo(69,83);c.lineTo(75,89);
  c.lineTo(73,116);c.lineTo(64,130);c.lineTo(52,121);
  c.lineTo(48,110);c.closePath();c.fillStyle="#3d5b74";c.fill();
  t(52,89,3,27,"#7492a1");t(57,85,2,31,"#54798a");
  t(69,89,3,31,"#29445a");t(54,117,16,3,"#2e5066");
  t(58,98,13,5,"#d8ba80");t(62,94,5,15,"#d8ba80");
  t(63,97,3,10,"#f6ddaa");t(51,90,4,3,"#b8c8cb");
  return canvas;
 }catch(error){console.warn("Warden variant could not be built",error);return null;}
}

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
 const img=isHero?heroAtlas:npcAtlas;
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
   if(kind==="npc_guard"&&wardenSprite){
     ctx.drawImage(wardenSprite,0,0,NPCCELL.w,NPCCELL.h,
       Math.round(x-w/2),Math.round(y-h+Math.round(h*8/NPCCELL.h)),w,h);
   }else{
     ctx.drawImage(img,sx,sy,NPCCELL.w,NPCCELL.h,
       Math.round(x-w/2),Math.round(y-h),w,h);
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
function blocked(zone,x,y){return x<65||y<70||x>1815||y>1160}
window.VeilwardArt={
 background,actor,glows,blocked,sceneReady,sceneError,retryScene,
 directionRow,sequence,approvedSequence,
 sheetDimensions:()=>({...HERO}),
 frontDimensions:()=>({...ADULT_FRONT}),
 adultFrontLoaded:()=>!!(adultFrontAtlas?.complete&&adultFrontAtlas.naturalWidth===336),
 ready:()=>!!(scene.village&&heroAtlas&&npcAtlas&&heroAtlas.complete&&heroAtlas.naturalWidth),
 spritesReady:()=>!!(heroAtlas&&heroAtlas.complete&&heroAtlas.naturalWidth),
 version:"1.1.1"
};
})();