/* VEILWARD Art Runtime v0.2 — original environment plates derived from approved in-house concept art.
   Every map below is an actual Canvas world background; interactive objects and actors are drawn by game.js. */
(function(){
 "use strict";
 const BASE="./assets/";
 const maps={village:"village_golden_v05.jpg",wilds:"wilds_clean.jpg",cave:"cave_clean.jpg",forge:"forge.jpg"};
 const scenes={};
 let actors=null;
 const FRAME_W=192,FRAME_H=150;
 function load(name,src,isActor){
  const img=new Image();
  img.decoding="async";
  img.onload=()=>{
    if(isActor){actors=img;window.dispatchEvent(new Event("veilward-actors-ready"))}
    else {scenes[name]=img;window.dispatchEvent(new CustomEvent("veilward-art-loaded",{detail:name}))}
  };
  img.onerror=()=>console.warn("Veilward art load failed",src);
  img.src=BASE+src+"?art=5";
 }
 for(const [name,src] of Object.entries(maps))load(name,src,false);
 load("actors","actors_clean_v05.png",true);
 function background(zone){return scenes[zone]||null}
 function actor(c,x,y,kind,step,att,state){
  if(!actors||!actors.complete||!actors.naturalWidth)return false;
  let n=0;
  if(kind==="wolf")n=9;
  else if(kind==="bandit")n=10;
  else if(kind==="wraith")n=11;
  else if(kind.startsWith("npc_")){
   const role=kind.slice(4);
   n={forge:7,inn:6,hunter:8,guard:10,hermit:8,merchant:5,hound:9}[role]??8;
  }else{
   // Deliberately use only the intact idle/walk frames. Earlier combat/cast
   // frames were truncated by concept-sheet extraction and looked transparent.
   n=(state&&state.moving)?1:0;
  }
  const hound=kind==="npc_hound"||kind==="wolf";
  const width=kind==="npc_forge"?150:kind==="npc_merchant"?116:kind==="npc_inn"?124:kind==="npc_hermit"?137:
    kind==="npc_guard"?118:kind==="npc_hunter"?135:kind==="wolf"?130:kind==="wraith"?138:
    kind==="bandit"?135:hound?110:125;
  const height=kind==="npc_forge"?148:kind==="npc_merchant"?131:kind==="npc_inn"?133:kind==="npc_hermit"?137:
    kind==="npc_guard"?138:kind==="npc_hunter"?140:kind==="wolf"?118:kind==="wraith"?145:
    kind==="bandit"?135:hound?104:145;
  let fx=(n%4)*FRAME_W,fy=Math.floor(n/4)*FRAME_H;
  c.save();
  const moving=state&&state.moving&&!kind.startsWith("npc_");
  const bounce=moving?Math.abs(Math.sin(step*12))*2.1:Math.sin(performance.now()/600)*.3;
  c.globalAlpha=.32;c.fillStyle="#08121c";c.beginPath();c.ellipse(x,y+1,width*.19,4.2,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
  const face=state&&state.facing;
  if(face&&face.x<-.35){c.translate(x,y);c.scale(-1,1);x=0;y=0}
  c.imageSmoothingEnabled=false;
  c.drawImage(actors,fx,fy,FRAME_W,FRAME_H,Math.round(x-width/2),Math.round(y-height+bounce),width,height);
  c.restore();
  return true;
 }
 function glows(c,zone,time){
  if(!scenes[zone])return;
  c.save();
  if(zone==="village"){
    const a=[[879,279,35],[716,342,28],[1430,1002,30],[797,1160,19]];
    for(let i=0;i<a.length;i++){let [x,y,r]=a[i];let n=1+.07*Math.sin(time*4+i*3);let grad=c.createRadialGradient(x,y-25,2,x,y-25,r*n*2);grad.addColorStop(0,"rgba(255,186,86,.17)");grad.addColorStop(1,"rgba(255,168,65,0)");c.fillStyle=grad;c.beginPath();c.arc(x,y-25,r*n*2,0,7);c.fill()}
  }
  if(zone==="forge"){
    let grad=c.createRadialGradient(1260,420,5,1260,420,240);grad.addColorStop(0,"rgba(255,154,42,.22)");grad.addColorStop(1,"rgba(255,130,24,0)");c.fillStyle=grad;c.fillRect(980,160,540,560);
  }
  if(zone==="cave"){
    const grad=c.createRadialGradient(1580,370,15,1580,370,320);grad.addColorStop(0,"rgba(133,93,255,.16)");grad.addColorStop(1,"rgba(110,68,214,0)");c.fillStyle=grad;c.fillRect(1260,50,570,700);
  }
  c.restore()
 }
 function blocked(zone,x,y){
  // Conservative handcrafted gameplay masks: buildings/cliff voids remain blocked,
  // central walkways and bridge paths remain navigable.
  if(zone==="village"){
    if(x<65||y<90)return true;
    if(y<360&&x<700)return true;
    if(y<330&&x>1220)return true;
    if(y>970&&x<800)return true;
    if(y>1030&&x>1300)return true;
    if(x>1680&&y>860)return true;
  }else if(zone==="wilds"){
    if(x<90||y<85)return true;
    if(x>1800&&y<350)return true;
    if(x<500&&y<710)return true; // stream and cliff; bridge lies farther south
    if(y>1090&&x>1350)return true;
  }else if(zone==="cave"){
    if(x<120||y<140)return true;
    if(y>990)return true;
    if(x<570&&y<490)return true;
    if(x>1640&&y>850)return true;
  }else if(zone==="forge"){
    if(x<150||x>1740||y<350||y>1100)return true;
  }
  return false;
 }
 window.VeilwardArt={background,actor,glows,blocked,ready:()=>!!(scenes.village&&actors&&actors.complete&&actors.naturalWidth),version:"0.5.0"};
})();