/* VEILWARD — HERO AGE/PROPORTION FIX v1.0.2
 * Complete 8-direction, 136-frame hero sheet, built from original full-body
 * front, genuine rear and profile art. No synthetic painted backplate.
 * Each draw samples one complete atlas cell; no destructive masks or crop guesses.
 */
(function(){
"use strict";
const ROOT="./assets/",ART="12";
const files={village:"village_v06_clear.jpg",wilds:"wilds_clean.jpg",cave:"cave_clean.jpg",forge:"forge.jpg"};
const scene=Object.create(null);
let npcAtlas=null,heroAtlas=null,adultFrontAtlas=null;
// New, consistent adult-front art: 3 complete poses, shared between idle, walk and actions.
const ADULT_FRONT={w:112,h:126,columns:3};
const NPCCELL={w:192,h:176,columns:4};
const HERO={w:160,h:180,columns:17,rows:8};
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
   else if(kind==="npc")npcAtlas=image;
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
load("hero","hero_full_8way_v10.png","hero");
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
function adultFrontColumn(state,sequenceColumn){
 if(!state?.moving){
   if((state?.attackV||0)>0)return sequenceColumn%2?1:2;
   if((state?.dodgeV||0)>0)return 2;
   return 0;
 }
 // Always move the legs when traversing ground, without changing body scale.
 // Hold each stride long enough to read clearly on a small iPhone screen.
 return [1,0,2,0,1,2][(Math.max(1,sequenceColumn)-1)%6];
}
function dimensions(kind){
 const dims={human:[150,154],bandit:[165,145],wraith:[170,133],wolf:[164,119],
 npc_forge:[161,149],npc_guard:[160,147],npc_inn:[148,145],
 npc_hunter:[151,144],npc_hermit:[151,144],npc_hound:[154,117],
 npc_merchant:[159,148]};
 return dims[kind]||dims.human;
}
function drawShadow(ctx,x,y,w,kind){
 ctx.save();
 const beast=kind==="wolf"||kind==="npc_hound"||kind==="wraith";
 ctx.translate(Math.round(x),Math.round(y)+2);
 ctx.scale(w*(beast?.28:.19),5);
 const grad=ctx.createRadialGradient(0,0,.02,0,0,1);
 grad.addColorStop(0,"rgba(14,22,35,.24)");
 grad.addColorStop(.55,"rgba(18,25,43,.10)");
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
   const col=sequence(state).start;
   if(row===0&&adultFrontAtlas?.complete&&adultFrontAtlas.naturalWidth===ADULT_FRONT.w*ADULT_FRONT.columns&&adultFrontAtlas.naturalHeight===ADULT_FRONT.h){
     // The prior south row showed a much younger-looking, swordless hero.
     // Use three complete adult front frames instead of deforming/cropping him.
     const frontCol=adultFrontColumn(state,col);
     ctx.drawImage(adultFrontAtlas,frontCol*ADULT_FRONT.w,0,ADULT_FRONT.w,ADULT_FRONT.h,
       Math.round(x-w/2),Math.round(y-h),w,h);
   }else{
     // Original clean full-body profiles and rear atlas stay in place.
     // Old cast cells contain stray cyan marker dots; show a clean
     // full-body pose until their independent combat art is replaced.
     const safeCol=col===14||col===15?0:col;
     ctx.drawImage(img,safeCol*HERO.w,row*HERO.h,HERO.w,HERO.h,
       Math.round(x-w/2),Math.round(y-h),w,h);
   }
 }else{
   let index=0;
   if(kind.startsWith("npc_"))index=NPC[kind.slice(4)]??0;
   else index=ENEMY[kind]??0;
   const sx=(index%NPCCELL.columns)*NPCCELL.w;
   const sy=Math.floor(index/NPCCELL.columns)*NPCCELL.h;
   ctx.drawImage(img,sx,sy,NPCCELL.w,NPCCELL.h,
     Math.round(x-w/2),Math.round(y-h),w,h);
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
 directionRow,sequence,
 sheetDimensions:()=>({...HERO}),
 frontDimensions:()=>({...ADULT_FRONT}),
 adultFrontLoaded:()=>!!(adultFrontAtlas?.complete&&adultFrontAtlas.naturalWidth===336),
 ready:()=>!!(scene.village&&heroAtlas&&npcAtlas&&heroAtlas.complete&&heroAtlas.naturalWidth),
 spritesReady:()=>!!(heroAtlas&&heroAtlas.complete&&heroAtlas.naturalWidth),
 version:"1.0.2"
};
})();