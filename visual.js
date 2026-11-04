/* VEILWARD — WARDEN SPRITE ART REPAIR v1.1.2
 * A unified four-pose, eight-facing, 32-frame authored hero atlas.
 * Shared physical proportions, full-body foot anchor, consistent armor/scarf/sword.
 * Combat effects remain enabled; new direction-specific attack/cast sprites are future work.
 */
(function(){
"use strict";
const ROOT="./assets/",ART="15";
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

// Distinct illustrated Warden Hal treatment; preserve source-pixel art fidelity.
// No geometric, generated or hand-overpainted helmet/shield.
function createWardenVariant(img){
 // Use ONLY the project's shaded, organically drawn NPC pixel art.
 // Previous update placed large flat rectangles over the face and produced
 // a comically oversized 'helmet'; that entire overlay has been removed.
 try{
  const canvas=document.createElement("canvas");
  canvas.width=NPCCELL.w;
  canvas.height=NPCCELL.h;
  const c=canvas.getContext("2d",{willReadFrequently:true});
  if(!c)return null;
  c.imageSmoothingEnabled=false;
  const slot=NPC.guard;
  c.drawImage(img,(slot%NPCCELL.columns)*NPCCELL.w,
    Math.floor(slot/NPCCELL.columns)*NPCCELL.h,
    NPCCELL.w,NPCCELL.h,0,0,NPCCELL.w,NPCCELL.h);
  const frame=c.getImageData(0,0,NPCCELL.w,NPCCELL.h);
  const px=frame.data;
  let scarfChanged=0,hairChanged=0,armorChanged=0;
  for(let y=0;y<NPCCELL.h;y++)for(let x=0;x<NPCCELL.w;x++){
   const i=(y*NPCCELL.w+x)*4;
   if(px[i+3]<10)continue;
   const r=px[i],g=px[i+1],b=px[i+2];
   const luminance=.30*r+.59*g+.11*b;
   const warm=r>g*1.20&&r>b*1.28&&g<160;
   // Preserve the *actual textured contours* of every strand of hair.
   // Silver hair and a navy winter scarf give Hal a different identity
   // without replacing his face with geometric placeholder artwork.
   if(y>=7&&y<40&&x>=73&&x<137&&warm){
    px[i]=Math.min(255,luminance*.96+45);
    px[i+1]=Math.min(255,luminance*1.04+57);
    px[i+2]=Math.min(255,luminance*1.18+72);
    hairChanged++;
   }else if(y>=63&&y<116&&warm&&r>g*1.36&&g<125&&
    !(x>83&&x<126&&y<71)){
    px[i]=Math.min(255,luminance*.42+16);
    px[i+1]=Math.min(255,luminance*.73+33);
    px[i+2]=Math.min(255,luminance*1.12+50);
    scarfChanged++;
   }else if(y>=74&&y<146&&
    b>=r*.87&&g>=r*.80&&r>=20&&r<190&&
    !(x>81&&x<126&&y<83)){
    // Cold steel armor treatment, keeping every shaded highlight.
    px[i]=Math.min(255,r*.77+8);
    px[i+1]=Math.min(255,g*.88+11);
    px[i+2]=Math.min(255,b*.99+17);
    armorChanged++;
   }
  }
  c.putImageData(frame,0,0);
  // This is source-sprite recoloring, never an improvised helmet or icon.
  return canvas;
 }catch(error){
  console.warn("Failed to process Warden Hal artwork",error);
  return null;
 }
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
       Math.round(x-w/2),Math.round(y-h),w,h);
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
 version:"1.1.2"
};
})();