/* VEILWARD v1.3.6 — Visual Recovery R2: 3/4 local compositions, source cliffs and bridges; NO art signoff. */
(()=>{
"use strict";
const $=id=>document.getElementById(id),cv=$("game"),g=cv.getContext("2d",{alpha:false});
let vw=innerWidth,vh=innerHeight,last=0,terrainCache={},decorCache={},active=false,modal=false,toastTime=0,hint="",shake=0,night=0;
const WORLD={w:1850,h:1200};
const WORLD_ZOOM=.78;
const viewWidth=()=>vw/WORLD_ZOOM,viewHeight=()=>vh/WORLD_ZOOM;let cam={x:0,y:0},keys={},joy={x:0,y:0,pid:null},effects=[],projectiles=[],particles=[],weather=[];
const C={village:{ground:"#8293a0",pale:"#c0ccdd",dark:"#4d6879",path:"#a4aab1",label:"Hollowreach · Frostbridge Outpost"},
 wilds:{ground:"#496b4f",pale:"#7c9770",dark:"#294b3c",path:"#a49172",label:"Greenwood · Eastern Trail"},
 cave:{ground:"#4b5156",pale:"#727777",dark:"#292e3a",path:"#555961",label:"The Smuggler's Hollow"},
forge:{ground:"#493e3f",pale:"#ae9383",dark:"#292630",path:"#817078",label:"Hollowreach · Joren's Forge"}};
const APP_VERSION="1.3.6";
const SAVE="veilward-hollowreach-v01";
const Q=window.VeilwardQuest;
const DEFAULT={zone:"village",x:925,y:620,artVersion:2,navVersion:4,sceneVersion:6,hp:100,mp:70,st:100,hpMax:100,mpMax:70,lv:1,xp:0,gold:26,quest:0,kills:0,herbs:0,supplies:false,loot:false,weapon:"Worn Steel Sword",armor:"Traveler's Mantle",potions:3,herbHarvested:[],defeatedEnemies:[],suppliesRecovered:false,suppliesDelivered:false,caveBanditCleared:false,scarAttuned:false,questVersion:1,skills:{blade:1,sorcery:1,survival:1},lastSave:0};
let pendingTravel=null,travelCooldown=0,arrivalPulse=0,lastCombatNotice=-100;
const worldPreview={enabled:false,loading:false,stream:null,lastDt:.016,debug:location.search.includes("debugWorld"),showcaseIndex:-1,crossingIndex:-1,review:null};
const showcaseStops=[
 ["village","Hollowreach · Frostbridge Village"],
 ["northwatch_plaza","Northwatch · Memorial Heights"],
 ["colp_ridge","Coldpine · Alpine Pass"],
 ["bridge_e","Frostbridge · River Landing"],
 ["thaw_camp","Thawline · Snowmelt Foothills"],
 ["greenwood_hearth","Greenwood · Forest"],
 ["falls_overlook","Greenwood Falls · River Lookout"],
 ["island","Mossmere · Accessible Lake Island"],
 ["commons","Heatherwood · Meadow Roads"],
 ["oldroad_tower","Old Crown Road · Watchtower"],
 ["ravine_w","Smugglers' Ravine · Canyon Approach"],
 ["worldscar_ring","Worldscar · Standing Stones"]
];
function cycleTerrainShowcase(){
 if(!worldPreview.enabled||!worldPreview.stream){notify("Enter the outdoor material preview first");return}
 worldPreview.showcaseIndex=(worldPreview.showcaseIndex+1)%showcaseStops.length;
 const [id,name]=showcaseStops[worldPreview.showcaseIndex];
 worldPreview.stream.jumpToNode(id);
 clearJoystick();closeAll();
 notify("Overworld region survey: "+name+" · Continue walking to explore")
}

const crossingStops=[
 ["north_bridge_w","Northwatch · Highland Stone-Timber Bridge"],
 ["bridge_w","Frostbridge · Village Timber Bridge"],
 ["ford_w","Stoneford · Raised Stepping-Stone Ford"],
 ["falls_w","Greenwood Falls · Mossy Stone Footbridge"],
 ["mossmere_w","Mossmere · West Island Footbridge"],
 ["island","Mossmere · East Island Stone Causeway"],
 ["ravine_bridge_w","Smugglers' Ravine · Rope Crossing"]
];
function cycleCrossingShowcase(){
 if(!worldPreview.enabled||!worldPreview.stream?.routeArt){notify("Enter the outdoor road network preview first");return}
 worldPreview.crossingIndex=(worldPreview.crossingIndex+1)%crossingStops.length;
 const [id,name]=crossingStops[worldPreview.crossingIndex];
 worldPreview.stream.jumpToNode(id);clearJoystick();closeAll();
 notify("Physical crossing "+(worldPreview.crossingIndex+1)+"/7: "+name+" · Walk across to verify")
}
const reviewState={epoch:0};
function closeReviewAtlas(){
 reviewState.epoch++;
 closeAll();
}
function jumpReviewRegion(id){
 const review=worldPreview.review;
 if(!worldPreview.enabled||!review)return;
 const target=review.safeAnchor(id);
 worldPreview.stream.jumpToNode(target.node);
 clearJoystick();closeReviewAtlas();
 notify("Now reviewing "+review.caption(id).name+" · Explore the real outdoor terrain");
}
function openReviewAtlas(){
 const s=worldPreview.stream,review=worldPreview.review;
 if(!worldPreview.enabled||!s||!review){
  notify("Enter the continuous overworld first, then open its review atlas");return
 }
 clearJoystick();closeAll();modal=true;
 const panel=$("worldReview");panel.style.display="block";
 const map=$("reviewMap");
 review.paintOverview(map);
 $("reviewSummary").textContent="TECHNICAL REGION PREVIEW · 12 connected areas, 65 roads, 7 crossings; current scenery DOES NOT match original Veilward art. Acceptance 0%.";
 const grid=$("reviewRegionGrid");grid.innerHTML="";
 const epoch=++reviewState.epoch;
 // Create the 12 cards first; render one authentic world-art thumbnail per
 // animation frame to avoid allocating full-res world tiles on iPhone.
 const canvases=[];
 review.regions.forEach((r,i)=>{
  const card=document.createElement("button");
  card.className="reviewRegion";
  card.type="button";
  card.setAttribute("aria-label","Explore "+r.name);
  const canvas=document.createElement("canvas");
  canvas.className="reviewThumb";
  canvas.width=160;canvas.height=160;
  const title=document.createElement("b");title.textContent=(i+1)+". "+r.name;
  const note=document.createElement("small");note.textContent=r.notes;
  const go=document.createElement("span");go.textContent="VISIT REGION";
  card.appendChild(canvas);card.appendChild(title);card.appendChild(note);card.appendChild(go);
  card.addEventListener("click",()=>jumpReviewRegion(r.id));
  grid.appendChild(card);canvases.push({canvas,id:r.id})
 });
 const renderNext=i=>{
  if(epoch!==reviewState.epoch||!worldPreview.enabled||panel.style.display==="none")return;
  if(i>=canvases.length)return;
  const item=canvases[i];
  try{
   review.paintRegion(item.canvas,item.id,{pixels:224,span:1250});
  }catch(error){
   console.warn("Overworld review region render failed",item.id,error);
   item.canvas.getContext("2d").fillStyle="#6d7e79";
   item.canvas.getContext("2d").fillRect(0,0,160,160);
  }
  if(i+1<canvases.length)requestAnimationFrame(()=>renderNext(i+1))
 };
 requestAnimationFrame(()=>renderNext(0));
}
function showWorldPreviewStatus(show){
 const label=$("streamStatus");
 if(label)label.style.display=show&&worldPreview.debug?"block":"none";
 const quest=$("quest");if(quest)quest.style.display=show?"none":"";
 const actions=$("actions");if(actions)actions.classList.toggle("preview-actions",show);
 const inspect=$("interactBtn");if(inspect)inspect.innerHTML=show?"✋<small>Inspect</small>":"✋<small>Talk</small>";
 const overlayBtn=$("geometryDebugBtn");
 if(overlayBtn){overlayBtn.style.display=show?"block":"none";overlayBtn.textContent="Terrain Geometry Overlay: "+(worldPreview.debug?"ON":"OFF")}
 const showcase=$("materialShowcaseBtn");
 if(showcase)showcase.style.display=show?"block":"none";
 const crossings=$("crossingShowcaseBtn");if(crossings)crossings.style.display=show?"block":"none";
 const reviewButton=$("reviewAtlasBtn");if(reviewButton)reviewButton.style.display=show?"block":"none";
 const option=$("worldPreviewBtn");
 if(option)option.textContent=show?"Return to Hollowreach Adventure":"Test World Connections (Art Unfinished)";
}
async function toggleWorldPreview(){
 if(worldPreview.enabled){
  worldPreview.enabled=false;clearJoystick();closeAll();showWorldPreviewStatus(false);
  $("location").textContent=C[p.zone].label;
  notify("Returned to your saved Hollowreach adventure · No quest progress altered");
  return;
 }
 if(worldPreview.loading)return;
 if(!window.VeilwardWorldStream||!window.VeilwardGeometry||!window.VeilwardTerrainArt||!window.VeilwardFootprint||!window.VeilwardClimate||!window.VeilwardRoutes||!window.VeilwardReview||!window.VeilwardIllustration||!window.VeilwardSetpieces||typeof fetch!=="function"){
  notify("Outdoor preview module unavailable; your adventure is safe");return
 }
 worldPreview.loading=true;
 const button=$("worldPreviewBtn");
 if(button)button.textContent="Preparing streaming-world preview…";
 try{
  const [response,geometryResponse,footprintResponse]=await Promise.all([
   fetch("./docs/overworld/world_blueprint.json?v=1",{cache:"default"}),
   fetch("./docs/overworld/terrain_geometry.json?v=1",{cache:"default"}),
   fetch("./docs/overworld/outdoor_footprint.json?v=1",{cache:"default"})
  ]);
  if(!response.ok||!geometryResponse.ok||!footprintResponse.ok)throw Error("Full outdoor terrain source unavailable");
  const [blueprint,geometry,footprint]=await Promise.all([response.json(),geometryResponse.json(),footprintResponse.json()]);
  const stream=window.VeilwardWorldStream.create(blueprint,{geometry,footprint});
  if(!stream.geometry||!stream.art||!stream.footprint||!stream.climate||!stream.routeArt||!stream.illustration||!stream.setpieces||!window.VeilwardReview)throw Error("Phase 6 full world could not initialize");
  await new Promise(resolve=>requestAnimationFrame(resolve));
  stream.warm(stream.player.x,stream.player.y,viewWidth()+320,viewHeight()+320);
  worldPreview.stream=stream;worldPreview.review=window.VeilwardReview.create(blueprint,stream);
   worldPreview.enabled=true;worldPreview.lastDt=.016;worldPreview.showcaseIndex=-1;worldPreview.crossingIndex=-1;
  clearJoystick();closeAll();showWorldPreviewStatus(true);
  $("location").textContent="STREAMING PREVIEW · "+stream.regionName();
  notify("Technical map preview only · Original pixel-art environment rebuild REQUIRED");
 }catch(error){
  console.error("Veilward outdoor preview failed safely",error);
  notify("World preview could not load; the existing adventure is unaffected");
 }finally{
  worldPreview.loading=false;
  showWorldPreviewStatus(worldPreview.enabled);
 }
}
function tickWorldPreview(dt){
 const s=worldPreview.stream;if(!s)return;
 worldPreview.lastDt=dt;
 let x=Number(!!(keys.KeyD||keys.ArrowRight))-Number(!!(keys.KeyA||keys.ArrowLeft))+joy.x;
 let y=Number(!!(keys.KeyS||keys.ArrowDown))-Number(!!(keys.KeyW||keys.ArrowUp))+joy.y;
 const length=Math.hypot(x,y);if(length>1){x/=length;y/=length}
 s.move(x,y,dt);
 worldTime+=dt;
 const label=$("streamStatus"),state=s.stats();
 if(label)label.textContent="TECHNICAL OVERWORLD ONLY · ART 0% ACCEPTED • "+s.regionName()+
  " • Altitude "+state.elevation?.toFixed(1)+" • Snow "+Math.round((state.climate?.snow??0)*100)+"% • "+state.material+
  " • "+state.cachedTiles+" streamed chunks";
 $("location").textContent="OVERWORLD PREVIEW · "+s.regionName();
 const item=s.nearbyInteraction();
 // Keep the scenery unobstructed during free exploration; only display
  // an interaction cue when the player's boots are close to a real object.
  setHint(item?"✋ Inspect "+item.name:"");
}
function renderWorldPreview(){
 const s=worldPreview.stream;if(!s)return;
 g.setTransform(1,0,0,1,0,0);
 g.fillStyle="#748f8f";g.fillRect(0,0,vw,vh);
 const view=s.render(g,vw,vh,WORLD_ZOOM,worldPreview.lastDt);
 g.save();g.scale(WORLD_ZOOM,WORLD_ZOOM);
 g.translate(-Math.floor(view.camera.x),-Math.floor(view.camera.y));
 const spriteState={...p,facing:s.player.facing,moving:s.player.moving,step:s.player.step,
  attackV:0,castV:0,dodgeV:0};
 if(!window.VeilwardArt?.actor?.(g,s.player.x,s.player.y,"human",s.player.step,0,spriteState)){
  g.fillStyle="#2c3642";g.fillRect(s.player.x-10,s.player.y-37,20,37);
  g.fillStyle="#bd9b75";g.fillRect(s.player.x-6,s.player.y-50,12,13);
 }
 s.renderForeground(g,s.player);
 g.restore();
 if(worldPreview.debug)s.renderDebug(g,vw,vh,WORLD_ZOOM);
 if(toastTime>0){toastTime-=worldPreview.lastDt;if(toastTime<=0)$("toast").style.display="none"}
}

let p=JSON.parse(JSON.stringify(DEFAULT)),enemies={village:[],wilds:[],cave:[],forge:[]},npc=[],objects=[],worldTime=0,invTab="pack",attacks=[],autosaveClock=0;
function rand(seed){let x=Math.sin(seed*127.1+78.233)*43758.5453;return x-Math.floor(x)}
function rng(n){return rand(n*1.931+0.321)}
function rr(x){return Math.floor(x)}
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(rr(x),rr(y),Math.ceil(w),Math.ceil(h))}
function poly(c,points,fill,stroke){c.beginPath();c.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)c.lineTo(points[i][0],points[i][1]);c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}}
function stroke(c,points,w,color){c.beginPath();c.moveTo(...points[0]);points.slice(1).forEach(t=>c.lineTo(...t));c.strokeStyle=color;c.lineWidth=w;c.lineJoin="round";c.lineCap="round";c.stroke()}
function circle(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=color;c.fill()}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function imgText(c,t,x,y,size=12,color="#f0e4c7",align="center"){c.font="bold "+size+"px Georgia";c.textAlign=align;c.strokeStyle="#15202a";c.lineWidth=3;c.strokeText(t,x,y);c.fillStyle=color;c.fillText(t,x,y)}
function resize(){vw=innerWidth;vh=innerHeight;cv.width=vw;cv.height=vh;g.imageSmoothingEnabled=false}
addEventListener("resize",resize);resize();
function notify(s){$("toast").textContent=s;$("toast").style.display="block";toastTime=2.7}
function setHint(s){hint=s;$("hint").textContent=s;$("hint").style.display=s?"block":"none"}
function save(silent=false){try{p.lastSave=Date.now();localStorage.setItem(SAVE,JSON.stringify(p));if(!silent)notify("Journey saved at Hollowreach")}catch(e){if(!silent)notify("Saving is unavailable in this browser")}}
function load(){try{let v=JSON.parse(localStorage.getItem(SAVE));if(v&&v.zone&&C[v.zone])p={...JSON.parse(JSON.stringify(DEFAULT)),...v,skills:{...DEFAULT.skills,...(v.skills||{})}}}catch(e){}}
function reset(){
 if(worldPreview.enabled){worldPreview.enabled=false;worldPreview.stream=null;showWorldPreviewStatus(false)}
 localStorage.removeItem(SAVE);p=Q.migrate(JSON.parse(JSON.stringify(DEFAULT)));
 pendingTravel=null;travelCooldown=0;arrivalPulse=0;clearJoystick();
 projectiles=[];particles=[];effects=[];enemies={village:[],wilds:[],cave:[],forge:[]};
 setup();closeAll();
 cam.x=clamp(p.x-viewWidth()/2,0,Math.max(0,WORLD.w-viewWidth()));
 cam.y=clamp(p.y-viewHeight()/2,0,Math.max(0,WORLD.h-viewHeight()));
 $("location").textContent=C[p.zone].label;
 save(true);notify("A new journey begins in Hollowreach")
}
function clearJoystick(){
 joy={x:0,y:0,pid:null};
 const knob=$("knob");if(knob)knob.style.transform="";
}
function newEnemy(x,y,type,zone){return{x,y,homeX:x,homeY:y,type,zone,hp:type==="bandit"?70:type==="wraith"?95:40,max:type==="bandit"?70:type==="wraith"?95:40,atk:0,wind:0,stun:0,dead:false,dir:1,step:0,loot:false}}
function setup(){
enemies={village:[],wilds:[
newEnemy(850,690,"wolf","wilds"),newEnemy(1100,640,"wolf","wilds"),
newEnemy(1245,667,"bandit","wilds"),newEnemy(1480,850,"wolf","wilds")],
cave:[newEnemy(1050,670,"bandit","cave"),newEnemy(1425,650,"bandit","cave"),
newEnemy(1435,525,"wraith","cave")],forge:[]};
npc=[
 {id:"joren",name:"Joren · Blacksmith",zone:"village",x:885,y:520,homeX:885,homeY:520,color:"#9b6244",role:"forge"},
 {id:"mira",name:"Mira · Innkeeper",zone:"village",x:1210,y:665,homeX:1210,homeY:665,color:"#987db7",role:"inn"},
 {id:"eldric",name:"Eldric · Hunter",zone:"village",x:720,y:1015,homeX:720,homeY:1015,color:"#547f65",role:"hunter"},
 {id:"guard",name:"Warden Hal",zone:"village",x:1290,y:595,homeX:1290,homeY:595,color:"#6d87ae",role:"guard"},
 {id:"hound",name:"Ash · Village Hound",zone:"village",x:1075,y:705,homeX:1075,homeY:705,color:"#c3ced5",role:"hound"},
 {id:"hermit",name:"The Green Hermit",zone:"wilds",x:1275,y:543,homeX:1275,homeY:543,color:"#5f9771",role:"hermit"}
];
objects=[
 // Native image is the original golden cabin-and-bridge, with no painted
 // characters: every named character now has its own live rendering and dialog.
 {zone:"village",type:"portal",x:790,y:1090,to:"wilds",tx:735,ty:991,label:"Greenwood Trail"},
 {zone:"village",type:"board",x:845,y:600,label:"Trail Noticepost"},
 {zone:"wilds",type:"portal",x:540,y:1068,to:"village",tx:1030,ty:675,label:"Frostbridge Outpost"},
 {zone:"wilds",type:"portal",x:1700,y:745,to:"cave",tx:775,ty:741,label:"Smuggler's Cave"},
 {zone:"wilds",type:"herb",id:"blueleaf-west",x:500,y:920,label:"Blueleaf Sprig"},
 {zone:"wilds",type:"herb",id:"blueleaf-east",x:1190,y:714,label:"Blueleaf Sprig"},
 {zone:"wilds",type:"scar",x:1480,y:420,label:"Shimmering Worldscar"},
 {zone:"cave",type:"portal",x:170,y:795,to:"wilds",tx:1520,ty:720,label:"Greenwood Trail"},
 {zone:"cave",type:"chest",x:888,y:689,label:"Bandit Supplies"}
];
// Restored progress is not inferred from items currently carried. A traded
// herb or handed-in quest crate must never respawn on later app launches.
Q.sync(p,objects,enemies);
updateUI()
}
function generate(zone){
const visual=window.VeilwardArt?.background(zone);
if(window.VeilwardArt){
const t=document.createElement("canvas");t.width=WORLD.w;t.height=WORLD.h;
const c=t.getContext("2d");
if(visual){c.imageSmoothingEnabled=true;c.drawImage(visual,0,0,WORLD.w,WORLD.h)}
else{c.fillStyle=C[zone]?.dark||"#1a2537";c.fillRect(0,0,WORLD.w,WORLD.h)}
// Track which actual image was used. The map can load after the game starts,
// so a solid-color temporary canvas must NEVER become permanently cached.
t._sceneImage=visual||null;
terrainCache[zone]=t;decorCache[zone]=[];return;
}
const t=document.createElement("canvas");t.width=WORLD.w;t.height=WORLD.h;const c=t.getContext("2d");c.imageSmoothingEnabled=false;
const z=C[zone];rect(c,0,0,WORLD.w,WORLD.h,z.ground);
for(let i=0;i<56000;i++){let x=rng(i+5+zone.length*1000)*WORLD.w,y=rng(i+100004+zone.length*3000)*WORLD.h,d=rng(i+84000),col=zone==="village"?(d>.72?"#a4b6c9":d>.3?"#758b9e":"#647b93"):zone==="wilds"?(d>.76?"#7c9971":d>.31?"#527c58":"#315b48"):(d>.68?"#70787c":d>.4?"#383f48":"#62676a");rect(c,x,y,1+rng(i+4)*3,1+rng(i+7)*2,col)}
if(zone==="village"){
// Icy stream carving the southwest edge, complete with a bridge crossing.
const river=[[15,475],[100,572],[175,670],[225,790],[310,908],[410,1042],[470,1200]];
stroke(c,river,208,"#485c73");stroke(c,river,178,"#264765");stroke(c,river,130,"#285679");stroke(c,river,95,"#36708c");
for(let i=0;i<340;i++){let x=30+rng(i+144)*520,y=480+rng(i+94)*720;if(Math.abs(y-(x*1.15+430))<105){rect(c,x,y,3+rng(i+20)*18,1+rng(i+28)*4,"#a1c6d3")}}
const roads=[[[380,715],[750,725],[1080,745],[1440,727],[1830,720]],[[800,740],[840,570],[970,460],[1140,340]],[[1325,760],[1330,980]],[[700,720],[440,850]]];
roads.forEach(a=>{stroke(c,a,142,"#8793a2");stroke(c,a,128,"#aab4c0");stroke(c,a,110,"#b7bfca");stroke(c,a,93,"#afb8c2")});
for(let i=0;i<2800;i++){let x=300+rng(i+209)*1470,y=330+rng(i+707)*750;if((Math.abs(y-720)<78)||(Math.abs(x-820)<76&&y<780)){rect(c,x,y,2+rng(i+34)*5,1+rng(i+89)*4,rng(i+551)>.5?"#798999":"#dbe4eb")}}
drawBridge(c,370,840); // river crossing
for(let i=0;i<290;i++){let x=rng(i+133)*WORLD.w,y=rng(i+532)*WORLD.h;if(y>300&&y<1000&&x>330&&x<1540)continue;drawSnowPatch(c,x,y,8+rng(i+234)*22)}
}else if(zone==="wilds"){
const river=[[245,-30],[300,125],[260,280],[390,510],[410,780],[535,940],[600,1230]];
stroke(c,river,165,"#294e50");stroke(c,river,132,"#296780");stroke(c,river,104,"#4285a0");stroke(c,river,92,"#36768c");
for(let i=0;i<300;i++){let x=190+rng(i+43)*440,y=rng(i+120)*1200;if(Math.abs(x-(270+y*.24))<85)rect(c,x,y,4+rng(i+22)*16,1+rng(i+44)*5,"#a0c9c4")}
const roads=[[[30,710],[410,700],[710,620],[980,670],[1270,540],[1660,315]],[[920,660],[1110,940],[1660,990]]];
roads.forEach(a=>{stroke(c,a,118,"#5c7654");stroke(c,a,91,"#998a69");stroke(c,a,73,"#b7a17b");stroke(c,a,62,"#a79574")});
drawBridge(c,388,713); 
for(let i=0;i<700;i++){let x=rng(i+1028)*WORLD.w,y=rng(i+4525)*WORLD.h;if(rng(i+21)>.6){circle(c,x,y,2+rng(i+65)*7,rng(i+19)>.5?"#486a43":"#72895d");if(rng(i+55)>.6)rect(c,x,y,2,3,"#d0a77a")}}
}else{
// Stone floor with large organic cracks, broken floor plates and cavern voids.
for(let i=0;i<1150;i++){let x=rng(i+42)*WORLD.w,y=rng(i+66)*WORLD.h,w=10+rng(i+331)*70,h=6+rng(i+716)*32;rect(c,x,y,w,h,rng(i+9)>.55?"#575d63":"#505760");rect(c,x,y,w,2,"#7d8080")}
for(let i=0;i<80;i++){let x=rng(i+461)*WORLD.w,y=rng(i+662)*WORLD.h;stroke(c,[[x,y],[x+15,y+4],[x+24,y+15]],1+rng(i+3)*2,"#292e39")}
}
terrainCache[zone]=t;
decorCache[zone]=createDecor(zone);
}
function drawSnowPatch(c,x,y,r){circle(c,x,y,r,"#b5c5d5");circle(c,x+3,y-3,r*.7,"#d1daea");for(let i=0;i<8;i++)rect(c,x-r+rng(i+x)*r*2,y-r+rng(i+y)*r*2,2,2,"#e7eaf0")}
function drawBridge(c,x,y){
rect(c,x-86,y-26,172,57,"#3b3b42");
for(let i=0;i<11;i++){let xx=x-82+i*15;rect(c,xx,y-23,12,51,i%3?"#8b6950":"#a17c57");rect(c,xx+2,y-18,2,40,"#c19569")}
for(let i=0;i<5;i++){let xx=x-85+i*43;rect(c,xx,y-36,9,83,"#594b42");rect(c,xx-2,y-43,13,9,"#d2d9df");rect(c,xx,y+36,13,6,"#e0e7ee")}
rect(c,x-86,y-34,172,5,"#6c645e");rect(c,x-86,y+37,172,5,"#6c645e")
}
function createDecor(zone){let arr=[];let seed=zone==="village"?33:zone==="wilds"?87:105;
for(let i=0;i<(zone==="cave"?125:240);i++){
let x=60+rng(i*7+seed)*1720,y=45+rng(i*11+seed)*1090;
if(zone==="village"&&x>300&&x<1650&&y>320&&y<980)continue;
if(zone==="wilds"&&((Math.abs(y-700)<100)||(x>950&&x<1400&&y>380&&y<800)))continue;
arr.push({kind:zone==="cave"?"rock":rng(i+90)>.18?"pine":"rock",x,y,s:zone==="cave"?0.5+rng(i+22):0.5+rng(i+22)*1.3,seed:i+seed})}
if(zone==="village"){
arr.push(...[{kind:"house",type:"forge",x:1050,y:590,w:290,h:190},{kind:"house",type:"lodge",x:530,y:590,w:275,h:188},{kind:"house",type:"inn",x:1462,y:590,w:292,h:196},{kind:"house",type:"watch",x:1175,y:300,w:158,h:158},
{kind:"tree",x:350,y:465,s:1.1},{kind:"tree",x:615,y:350,s:1.5},{kind:"tree",x:1540,y:376,s:1.4},{kind:"tree",x:1620,y:920,s:1.2},
{kind:"lamppost",x:720,y:672},{kind:"lamppost",x:1180,y:716},{kind:"lamppost",x:1520,y:799},{kind:"fence",x:698,y:600},{kind:"fence",x:1262,y:601},
{kind:"sign",x:900,y:870},{kind:"well",x:720,y:897},{kind:"cart",x:1000,y:850},{kind:"woodpile",x:1230,y:930},
{kind:"stone",x:430,y:970},{kind:"stone",x:1360,y:1000},{kind:"bush",x:610,y:886},{kind:"bush",x:1380,y:842},
{kind:"tree",x:1660,y:510,s:1},{kind:"bush",x:833,y:950},{kind:"tree",x:200,y:350,s:1.5}]);
for(let i=0;i<85;i++){let x=280+rng(i+860)*1400,y=340+rng(i+945)*660;if(Math.abs(y-724)<100||Math.abs(x-900)<95)continue;arr.push({kind:rng(i+14)>.72?"bush":"pine",x,y,s:.3+rng(i+126)*.35,seed:1900+i})}
}else if(zone==="wilds"){
arr.push(...[{kind:"stone",x:1320,y:309,s:2},{kind:"stone",x:1250,y:268,s:1.6},{kind:"stone",x:1540,y:255,s:2.1},
{kind:"ruin",x:1210,y:305},{kind:"ruin",x:1610,y:320},{kind:"camp",x:1325,y:690},{kind:"lamppost",x:1550,y:755},{kind:"bush",x:880,y:890},{kind:"stone",x:1000,y:250,s:1.4},
{kind:"pine",x:690,y:300,s:1.65},{kind:"tree",x:1020,y:420,s:1.3},{kind:"tree",x:1590,y:820,s:1.5},{kind:"tree",x:760,y:1000,s:1.6},
{kind:"rock",x:800,y:450,s:2.1},{kind:"log",x:860,y:850},{kind:"rock",x:1500,y:540,s:1.4}]);
for(let i=0;i<85;i++){let x=550+rng(i+463)*1110,y=30+rng(i+632)*1030;if(Math.abs(y-700)<100)continue;arr.push({kind:rng(i+17)>.47?"pine":"tree",x,y,s:.5+rng(i+222)*1.1,seed:1200+i})}
}else{arr.push(...[{kind:"ruin",x:850,y:310},{kind:"ruin",x:1490,y:440},{kind:"camp",x:900,y:600},{kind:"stone",x:1420,y:790,s:2},{kind:"stone",x:1030,y:960,s:1.4}])}
return arr.sort((a,b)=>a.y-b.y)
}
function drawPine(c,x,y,s=1,seed=0,green=false){
c.save();c.translate(rr(x),rr(y));c.scale(s,s);
circle(c,1,4,36,"#14243144");rect(c,-5,-17,10,24,"#594738");rect(c,-2,-9,2,22,"#967d65");
for(let k=0;k<5;k++){let yy=-20-k*18,wide=44-k*7;
poly(c,[[-wide,yy+19],[0,yy-31],[wide,yy+19],[wide-8,yy+15],[0,yy-20],[-wide+8,yy+15]],green?"#233f36":"#283e4c");
poly(c,[[-wide+5,yy+11],[0,yy-28],[wide-5,yy+11],[0,yy-17]],green?"#38634b":"#42617b");
for(let j=0;j<9;j++){let xx=(rng(seed+k*11+j)*2-1)*wide*.75,py=yy-5+rng(seed*3+j*4+k)*19;rect(c,xx,py,3+rng(j+seed)*7,2,green?"#668e66":"#a9bfd4")}
}
if(!green)for(let i=0;i<10;i++){rect(c,-28+rng(i+seed)*56,-94+rng(i*8+seed)*70,5+rng(i+4)*8,3+rng(i+12)*3,"#dce6ee")}
c.restore()
}
function drawTree(c,x,y,s=1,seed=2,autumn=false){
c.save();c.translate(rr(x),rr(y));c.scale(s,s);
circle(c,2,2,43,"#1c303355");rect(c,-8,-55,15,66,"#654e3d");rect(c,-5,-50,3,63,"#a28869");
for(let i=0;i<28;i++){let dx=(rng(i*7+seed)-.5)*103,dy=(rng(i*13+seed)-.5)*50-76,r=14+rng(i*19+seed)*23;
circle(c,dx,dy,r,autumn?(rng(i+seed)>.5?"#b37137":"#dda657"):(rng(i+seed)>.4?"#376b55":"#487b5c"))}
for(let i=0;i<100;i++){let dx=(rng(i*7+seed)-.5)*117,dy=(rng(i*13+seed)-.5)*67-80;rect(c,dx,dy,3+rng(i*8+seed)*5,2+rng(i+88)*3,autumn?"#e5bd77":"#a6bc83")}
c.restore()
}
function drawRock(c,x,y,s=1,seed=0){c.save();c.translate(rr(x),rr(y));c.scale(s,s);poly(c,[[-32,0],[-40,-15],[-22,-38],[3,-48],[33,-31],[43,-4],[28,6]],"#424d57");poly(c,[[-34,-12],[-21,-34],[4,-42],[27,-28],[10,-12]],"#84929d");poly(c,[[10,-12],[27,-28],[40,-4],[24,2]],"#52606c");stroke(c,[[-17,-28],[-7,-25],[-5,-15]],2,"#b8c1ce");for(let i=0;i<16;i++)rect(c,-30+rng(i+seed)*65,-36+rng(i*7+seed)*35,2+rng(i+11)*3,2,rng(i+3)>.5?"#9ca8ae":"#455662");if(p.zone==="village"){poly(c,[[-35,-9],[-24,-33],[5,-44],[22,-30],[10,-23],[-12,-25]],"#d1dce6")}c.restore()}
function drawBuilding(c,o,tm){let {x,y,w=250,h=170,type="lodge"}=o,left=x-w/2,top=y-h;
c.save();c.translate(rr(left),rr(top));
circle(c,w*.52,h+4,w*.53,"#1b293357");
rect(c,9,45,w-18,h-48,"#5b514a");rect(c,9,61,w-18,h-71,"#777066");
for(let i=0;i<480;i++){let xx=rng(i*13+w)*w,yy=55+rng(i*9+h)*(h-59);rect(c,xx,yy,3+rng(i)*9,2,rng(i+3)>.5?"#92857a":"#5c5451")}
for(let j=0;j<Math.floor(w/23);j++){rect(c,12+j*23,60,7,h-61,"#4e3e32");rect(c,15+j*23,61,2,h-63,"#9b7b58")}
rect(c,8,h-13,w-16,14,"#3b4147");rect(c,10,h-15,w-20,4,"#a8a9a4");
const roof=type==="watch"?"#494f63":"#4d5366";
poly(c,[[-18,66],[w*.45,-19],[w+17,66],[w*.55,105]],"#303a47");
poly(c,[[-14,54],[w*.45,-24],[w+15,54],[w*.55,89]],roof);
for(let row=0;row<10;row++){let sy=8+row*8,span=w*(.30+row*.055),sx=(w-span)/2;for(let col=0;col<Math.ceil(span/19);col++){let px=sx+col*19+(row%2)*9;rect(c,px,sy,17,5,rng(col*14+row+o.x)>.5?"#5c6479":"#657386");rect(c,px+2,sy,11,2,"#93a4b8");if(p.zone==="village")rect(c,px+3,sy-2,11,3,"#d6dce7")}}
poly(c,[[0,54],[w*.45,-25],[w+16,54]],null,"#d2dbe6");
for(let k=0;k<3;k++){let wx=w*(.22+k*.28);rect(c,wx,h-76,27,39,"#332c2b");rect(c,wx+4,h-72,19,31,"#dfb05d");rect(c,wx+7,h-68,13,21,tm>.7?"#ad7654":"#f9d17c");rect(c,wx+12,h-73,3,32,"#4b3d37");rect(c,wx,h-57,27,3,"#473f3b")}
rect(c,w*.46,h-64,35,63,"#3c302d");rect(c,w*.48,h-61,30,57,"#704d3b");rect(c,w*.61,h-62,3,58,"#382f32");circle(c,w*.59,h-32,2,"#dcc17b");
rect(c,w*.12,14,24,48,"#62616c");rect(c,w*.14,8,19,10,"#8e92a1");rect(c,w*.14,1,18,7,p.zone==="village"?"#d9e5ec":"#71747f");
for(let i=0;i<5;i++){circle(c,w*.20+i*5,-10-i*11,6+i*2,"#c8cdd5"+(tm>.7?"55":"7a"))}
if(type==="forge"){rect(c,0,h-34,55,31,"#4d453a");rect(c,4,h-29,45,23,"#a95531");for(let j=0;j<8;j++)circle(c,8+j*5,h-19+rng(j)*8,5,"#e1a348");rect(c,w-61,h-25,56,13,"#494e55");rect(c,w-39,h-37,24,15,"#787d82");for(let k=0;k<6;k++)rect(c,w-25-k*4,h-37-k*2,2,6,"#f1c976")}
if(type==="inn"){rect(c,78,h-155,47,52,"#5c4d34");rect(c,82,h-151,40,39,"#b3915f");imgText(c,"✦",101,h-127,20,"#4d3533")}
if(type==="watch"){rect(c,15,h-152,w-30,20,"#53647d");rect(c,25,h-170,10,32,"#767d91")}
c.restore()}
function drawProp(c,o,t){let x=o.x,y=o.y;
switch(o.kind){
case"pine":drawPine(c,x,y,o.s,o.seed,p.zone==="wilds");break;
case"tree":drawTree(c,x,y,o.s,o.seed,p.zone==="wilds");break;
case"rock":case"stone":drawRock(c,x,y,o.s||.8,o.seed||0);break;
case"house":drawBuilding(c,o,t);break;
case"bush":for(let i=0;i<6;i++)circle(c,x-21+rng(i+x)*44,y-5-rng(i+y)*16,7+rng(i)*8,p.zone==="village"?"#9cbbc6":"#42735d");for(let i=0;i<10;i++)rect(c,x-18+rng(i+7)*33,y-20+rng(i*3)*23,2,3,p.zone==="village"?"#e1e5eb":"#d7b2bb");break;
case"lamppost":rect(c,x-3,y-83,6,84,"#5d4d43");rect(c,x-10,y-80,19,6,"#9e8b73");rect(c,x-7,y-73,14,23,"#4a413b");rect(c,x-4,y-70,8,17,"#f7d18c");circle(c,x,y-61,24,"#ffbd5b16");rect(c,x-10,y-77,19,5,"#b7a38b");break;
case"fence":for(let j=0;j<7;j++){let xx=x-72+j*24;rect(c,xx,y-37,9,45,"#6b5746");rect(c,xx,y-39,9,7,p.zone==="village"?"#d5dde8":"#9b886d");}rect(c,x-72,y-20,150,6,"#876f55");rect(c,x-72,y-4,150,5,"#685744");break;
case"sign":rect(c,x-33,y-67,68,51,"#594b3f");rect(c,x-29,y-63,60,44,"#ad9b75");for(let k=0;k<4;k++){rect(c,x-23,y-56+k*9,43,1,"#6d5848");rect(c,x-23,y-59+k*9,6,4,"#ddceaa")}rect(c,x-36,y-69,74,6,p.zone==="village"?"#d5dce2":"#81725f");break;
case"well":circle(c,x,y-7,38,"#424c55");circle(c,x,y-12,26,"#273f4c");for(let k=0;k<12;k++){let a=k*Math.PI/6;circle(c,x+32*Math.cos(a),y-12+22*Math.sin(a),7,"#87919d")}rect(c,x-28,y-65,7,62,"#6a5344");rect(c,x+21,y-65,7,62,"#6a5344");poly(c,[[x-44,y-65],[x,y-99],[x+45,y-65]],"#5b6470");break;
case"cart":rect(c,x-54,y-31,100,34,"#755943");for(let k=0;k<7;k++)rect(c,x-47+k*13,y-27,9,22,"#a27f58");circle(c,x-39,y+4,18,"#493d35");circle(c,x+36,y+4,18,"#493d35");circle(c,x-39,y+4,8,"#ac9063");circle(c,x+36,y+4,8,"#ac9063");break;
case"woodpile":for(let k=0;k<16;k++) {let xx=x-45+(k%8)*12,yy=y-Math.floor(k/8)*14;rect(c,xx,yy-10,12,10,"#77583c");circle(c,xx+5,yy-5,5,"#b89c73")}break;
case"ruin":for(let k=0;k<3;k++){let xx=x-65+k*64;rect(c,xx,y-100-k*12,24,105+k*12,"#515f65");for(let j=0;j<9;j++)rect(c,xx+2+rng(j+k)*16,y-85+j*11,9,3,"#939ea5");rect(c,xx-5,y-102-k*12,34,14,"#82898f")}stroke(c,[[x-76,y-100],[x,y-143],[x+87,y-111]],12,"#7a8488");break;
case"camp":circle(c,x,y,23,"#372d30");for(let k=0;k<9;k++)circle(c,x+20*Math.cos(k),y+12*Math.sin(k),7,"#77716a");poly(c,[[x-8,y],[x+1,y-40],[x+13,y]],"#e37d37");poly(c,[[x-2,y],[x+6,y-27],[x+9,y]],"#f6d47e");break;
case"log":rect(c,x-50,y-19,95,18,"#65503b");rect(c,x-45,y-15,82,7,"#927453");circle(c,x+40,y-10,10,"#c1a47c");break;
}}
function drawHero(c,x,y,d=0,step=0,color="#6a8da2",enemy=false,kind="human",att=0){
if(window.VeilwardArt?.actor(c,x,y,kind,step,att,kind==="human"?p:null))return;
c.save();c.translate(rr(x),rr(y));
circle(c,0,3,16,"#14242c66");
let sway=Math.sin(step*12)*3,arms=Math.sin(step*12)*5;
if(kind==="wolf"){poly(c,[[-23,-9],[-13,-25],[14,-23],[23,-6],[13,2],[-12,2]],"#4a5b61");poly(c,[[-17,-26],[-26,-39],[-5,-28]],"#6d8187");poly(c,[[8,-26],[16,-42],[21,-22]],"#7d8789");rect(c,-13,-7,8,14,"#313f49");rect(c,10,-7,8,14,"#313f49");rect(c,-23,-19,14,12,"#8a8e84");rect(c,-19,-18,3,3,"#eab477");rect(c,-22,-5,8,3,"#acaaa0");c.restore();return}
if(kind==="wraith"){circle(c,0,-37,14,"#7ea0be");poly(c,[[-12,-35],[12,-35],[26,2],[-25,2]],"#354e68");poly(c,[[-13,-36],[-4,-55],[11,-35]],"#597995");rect(c,-6,-42,4,2,"#dcf6ff");rect(c,3,-42,4,2,"#dcf6ff");c.restore();return}
let walk=Math.sin(step*11)*4;
rect(c,-11,-9+walk,8,13,"#40342e");rect(c,3,-9-walk,8,13,"#40342e");rect(c,-12,0+walk,10,6,"#26242a");rect(c,2,0-walk,10,6,"#26242a");
poly(c,[[-17,-24],[-13,-39],[12,-39],[18,-19],[13,-4],[-14,-4]],enemy?"#6c4641":color);
rect(c,-12,-30,24,14,enemy?"#894c47":"#536473");rect(c,-11,-20,22,3,"#bf9870");rect(c,-3,-25,6,8,"#a88c5f");
rect(c,-16,-30,5,18,"#91795b");rect(c,12,-31,5,18,"#91795b");
rect(c,-19,-22+arms,7,13,enemy?"#6d4941":"#c6a082");rect(c,13,-22-arms,7,13,enemy?"#6d4941":"#c6a082");
rect(c,-9,-49,18,17,"#bd9675");rect(c,-9,-52,18,9,enemy?"#55443d":"#433b37");rect(c,-10,-45,3,12,"#5e4136");rect(c,7,-45,3,12,"#5e4136");
rect(c,-5,-41,2,2,"#292c32");rect(c,4,-41,2,2,"#292c32");rect(c,-3,-36,7,2,"#805e50");
if(!enemy){poly(c,[[-14,-27],[-22,-30],[-27,-10],[-9,-6]],"#874647");rect(c,8,-32,4,24,"#c7b7a2");rect(c,6,-39,8,10,"#767b8b");rect(c,4,-44,12,5,"#b2b8bf")}
else{rect(c,13,-28,4,20,"#aab2b3");rect(c,10,-31,10,4,"#75624c")}
if(att>0){c.strokeStyle=enemy?"#e79980":"#f7e0b4";c.lineWidth=4;c.beginPath();c.arc(0,-22,39,-.8,1.05);c.stroke()}
c.restore()
}

function drawFocusedNpcName(c,e){
 if(!e||!e.role||e.zone!==p.zone)return;
 const kind="npc_"+e.role;
 const top=window.VeilwardArt?.actorTopOffset?.(kind)||
   (e.role==="hound"?92:133);
 const title=e.name.split(" · ")[0];
 c.save();
 c.font="bold 13px Georgia,serif";
 c.textAlign="center";
 const width=Math.ceil(c.measureText(title).width)+20;
 // Name tag cannot clip against the phone's visible landscape viewport.
 const x=clamp(e.x,cam.x+width/2+8,cam.x+viewWidth()-width/2-8);
 const y=clamp(e.y-top-12,cam.y+22,cam.y+viewHeight()-8);
 c.fillStyle="rgba(10,20,33,.76)";
 c.strokeStyle="rgba(194,157,97,.88)";
 c.lineWidth=1;
 c.fillRect(Math.round(x-width/2),Math.round(y-16),width,21);
 c.strokeRect(Math.round(x-width/2)+.5,Math.round(y-16)+.5,width-1,20);
 c.fillStyle="#f6dfad";
 c.strokeStyle="#081420";
 c.lineWidth=2.5;
 c.strokeText(title,Math.round(x),Math.round(y-2));
 c.fillText(title,Math.round(x),Math.round(y-2));
 c.restore();
}

function drawHealth(c,e){
 if(e.hp>=e.max&&dist(e,p)>255&&e.wind<=0)return;
 const top=window.VeilwardArt?.actorTopOffset?.(e.type)||112;
 const y=Math.round(e.y-top-14),x=Math.round(e.x-29);
 rect(c,x,y,58,9,"#111a2ae8");
 rect(c,x+2,y+2,54*clamp(e.hp/e.max,0,1),5,e.type==="wraith"?"#9b88dc":e.type==="bandit"?"#e39c71":"#bfda8c");
 c.strokeStyle="#bda77c";c.lineWidth=1;c.strokeRect(x+.5,y+.5,57,8);
}
function drawEnemyTelegraph(c,e){
 if(!e.wind||e.stun>0||e.dead||!e.aim)return;
 const r=window.VeilwardCombat?.RULES[e.type];if(!r)return;
 const angle=Math.atan2(e.aim.y,e.aim.x);
 const phase=1-clamp(e.wind/r.wind,0,1);
 const tint=e.type==="wraith"?"159,130,232":e.type==="bandit"?"232,139,102":"235,182,111";
 c.save();c.beginPath();c.moveTo(e.x,e.y-5);
 c.arc(e.x,e.y-5,r.range,angle-Math.acos(r.arc),angle+Math.acos(r.arc));
 c.closePath();c.fillStyle="rgba("+tint+","+(0.08+.11*phase)+")";c.fill();
 c.strokeStyle="rgba("+tint+","+(0.45+.45*phase)+")";c.lineWidth=2.5;
 c.beginPath();c.arc(e.x,e.y-5,r.range,angle-Math.acos(r.arc),angle+Math.acos(r.arc));c.stroke();
 c.strokeStyle="rgba("+tint+",.76)";c.lineWidth=1.6;
 c.beginPath();c.arc(e.x,e.y-5,8+(1-phase)*(r.range-13),0,2*Math.PI);c.stroke();
 c.restore();
}
function combatNotice(message){
 if(worldTime-lastCombatNotice>1.1){lastCombatNotice=worldTime;notify(message)}
}
function occupied(x,y,zone=p.zone){
 return window.VeilwardNav ? !window.VeilwardNav.canWalk(zone,x,y,8) : (window.VeilwardArt?.blocked(zone,x,y)??false);
}
function safePosition(zone,x,y){
 return window.VeilwardNav?.safePoint(zone,x,y)||{x,y};
}
function changeZone(z,tx,ty){
 if(!C[z])return;
 // Queue one travel when an illustrated world image has not loaded yet.
 if(window.VeilwardArt&&!window.VeilwardArt.sceneReady(z)){
  if(pendingTravel?.z===z)return;
  pendingTravel={z,tx,ty};
  notify("Loading "+C[z].label+"...");
  if(window.VeilwardArt.sceneError(z))window.VeilwardArt.retryScene(z);
  return;
 }
 pendingTravel=null;
 const safe=safePosition(z,tx,ty);
 p.zone=z;p.x=safe.x;p.y=safe.y;p.dodgeTime=0;p.dodgeV=0;p.invuln=1;
 // Combined with safer spawns, avoids double tap returning immediately.
 travelCooldown=1.2;arrivalPulse=.95;
 clearJoystick();
 p.navVersion=4;
 particles=[];projectiles=[];effects=[];
 cam.x=clamp(p.x-viewWidth()/2,0,Math.max(0,WORLD.w-viewWidth()));
 cam.y=clamp(p.y-viewHeight()/2,0,Math.max(0,WORLD.h-viewHeight()));
 if(!terrainCache[z])generate(z);
 $("location").textContent=C[z].label;
 notify("Arrived: "+C[z].label);save(true)
}
function updateUI(){
$("hp").style.width=clamp(p.hp/p.hpMax*100,0,100)+"%";$("mp").style.width=clamp(p.mp/p.mpMax*100,0,100)+"%";$("st").style.width=clamp(p.st,0,100)+"%";$("level").textContent="LV "+p.lv;
 // Live ability affordability and cooldowns: players can read at a glance
 // whether Strike, Spell, or Dodge will work before they tap.
 $("mp").classList.toggle("resource-low",p.mp<16);
 $("st").classList.toggle("resource-low",p.st<24);
 [["attackBtn",p.st<12,p.attackCd>0],["spellBtn",p.mp<16,p.spellCd>0],
  ["dodgeBtn",p.st<24,p.dodgeCd>0],["potionBtn",p.potions<=0||p.hp>=p.hpMax,false]]
  .forEach(([id,cost,cooling])=>{
   const button=$(id);
   button.classList.toggle("combat-unavailable",!!cost);
   button.classList.toggle("combat-cooling",!!cooling);
  });
const q=[["A Cold Welcome","Speak with Joren the village blacksmith."],["The Missing Supplies","Follow the eastern trail into Greenwood."],["The Missing Supplies","Defeat the bandit raider and find Joren's stolen supplies."],["The Missing Supplies","Return the supplies to Joren in Hollowreach."],["A Whisper in the Stone","Investigate the glowing Worldscar in Greenwood."],["The Frontier Awaits","Explore Hollowreach, recover herbs, and uncover the cave's secret."]];
const qq=q[clamp(p.quest,0,q.length-1)];
 $("questTitle").textContent=qq[0];
 $("questText").textContent=p.quest===2&&p.caveBanditCleared?
  "The cave raider is defeated. Recover Joren's stolen supplies.":qq[1]
}
function giveXP(n,skill){p.xp+=n;if(skill)p.skills[skill]=(p.skills[skill]||1)+.06;while(p.xp>=p.lv*70){p.xp-=p.lv*70;p.lv++;p.hpMax+=10;p.mpMax+=5;p.hp=p.hpMax;p.mp=p.mpMax;notify("LEVEL "+p.lv+" — your legend grows")}updateUI()}
function attack(){
 if(modal||!active||p.attackCd>0)return;
 const combat=window.VeilwardCombat;
 if(p.st<combat.MELEE.stamina){combatNotice("Not enough stamina to strike");return}
 p.attackCd=.42;p.attackV=.18;p.st-=combat.MELEE.stamina;p.skills.blade+=.015;
 const face=combat.unit(p.facing?.x??0,p.facing?.y??1);
 effects.push({x:p.x+face.x*46,y:p.y-26+face.y*36,t:.22,type:"slash",angle:Math.atan2(face.y,face.x)});
 const damage=22+p.lv*3+(p.weapon==="Tempered Steel Sword"?13:0);
 for(const e of enemies[p.zone]){
  if(!combat.swordCanHit(p,e,window.VeilwardNav))continue;
  e.hp=Math.max(0,e.hp-damage);
  combat.stagger(e,.32);
  particles.push({x:e.x,y:e.y-39,t:.68,text:"−"+damage,color:"#ffe8b1"});
  if(e.hp<=0)killEnemy(e);
 }
 updateUI()
}
function spell(){
 if(modal||!active||p.spellCd>0)return;
 const combat=window.VeilwardCombat;
 if(p.mp<combat.SPELL.mana){combatNotice("Need 16 magicka to cast");return}
 p.castV=.32;p.mp-=combat.SPELL.mana;p.spellCd=.64;p.skills.sorcery+=.03;
 const target=combat.chooseSpellTarget(p,enemies[p.zone],window.VeilwardNav);
 const d=target?combat.unit(target.x-p.x,target.y-p.y):
  combat.unit(p.facing?.x??0,p.facing?.y??1);
 projectiles.push({x:p.x,y:p.y-26,vx:d.x*combat.SPELL.speed,
  vy:d.y*combat.SPELL.speed,age:0,blocked:false});
 updateUI()
}
function dodge(){
 if(modal||!active||p.dodgeCd>0)return;
 if(p.st<24){combatNotice("Need 24 stamina to dodge");return}
 p.dodgeV=.29;p.st-=24;p.dodgeCd=.7;p.invuln=.34;
 const input=Math.hypot(joy.x,joy.y)>.1?joy:(p.facing||{x:0,y:1});
 const d=window.VeilwardCombat.unit(input.x,input.y);
 p.dvx=d.x*350;p.dvy=d.y*350;p.dodgeTime=.18;
 updateUI()
}
function potion(){if(modal||p.potions<=0||p.hp>=p.hpMax)return;p.potions--;p.hp=Math.min(p.hpMax,p.hp+60);notify("Restored 60 health");updateUI();save(true)}
function killEnemy(e){
 if(e.dead)return;
 e.dead=true;Q.recordDefeat(p,e);
 p.gold+=e.type==="bandit"?14:5;p.kills++;
 giveXP(e.type==="bandit"?28:14,"blade");
 effects.push({x:e.x,y:e.y,t:.6,type:"burst"});
 if(p.quest===2&&e.type==="bandit"&&e.zone==="cave")
  notify("Cave raider defeated · Retrieve the stolen supplies");
 else notify("Enemy defeated · Gold found");
 updateUI();save(true)
}
function nearest(){
 let list=[...npc.filter(n=>n.zone===p.zone).map(n=>({...n,interaction:n.role})),
           ...objects.filter(o=>o.zone===p.zone&&!o.taken).map(o=>({...o,interaction:o.type}))];
 // Painted figures can be talked to from the path beside a fence or anvil.
 // Physical pick-ups have shorter radii so they cannot be collected from afar.
 const reach={forge:185,inn:140,hunter:133,guard:135,hermit:145,hound:100,
              portal:100,board:112,herb:75,scar:150,chest:90};
 // Prefer the character genuinely standing closest to the player.
 // Portal/hound penalties avoid stealing nearby dialogue and quest targets.
 const priority={portal:24,hound:12,board:5};
 list=list.map(n=>({...n,reach:reach[n.interaction]||100,dist:dist(n,p)}))
          .filter(n=>n.dist<=n.reach)
          .sort((a,b)=>(a.dist+(priority[a.interaction]||0))-
                       (b.dist+(priority[b.interaction]||0)));
 return list[0]||null
}
function interact(){if(worldPreview.enabled){
  const feature=worldPreview.stream?.nearbyInteraction();
  if(!feature){notify("No nearby terrain landmark · Look for a named destination");return}
  showDialog(feature.name,feature.description,[{text:"Continue exploring",action:closeAll}]);
  return
 }if(modal||!active)return;let target=nearest();if(!target){notify("No one nearby to interact with");return}if(target.interaction==="portal"){if(travelCooldown>0||pendingTravel)return;changeZone(target.to,target.tx,target.ty);return}
if(target.interaction==="herb"){
 const item=objects.find(o=>o.zone===target.zone&&o.id===target.id);
 if(!item||!Q.harvest(p,item.id)){notify("Already gathered this blueleaf");return}
 item.taken=true;giveXP(13,"survival");updateUI();
 notify("Gathered Blueleaf Sprig");save(true);return
}
if(target.interaction==="chest"){
 const state=Q.chestState(p);
 if(state==="unassigned"){notify("Joren's seal is on the crate. Speak to him first.");return}
 if(state==="guarded"){notify("Defeat a raider inside the cave before collecting the supplies");return}
 if(state==="opened"){notify("These supplies have already been recovered");return}
 if(!Q.takeSupplies(p))return;
 const chest=objects.find(o=>o.type==="chest");
 if(chest)chest.taken=true;
 giveXP(20,"survival");updateUI();save(true);
 notify("Recovered Joren's supplies · +30 gold");
 return
}
if(target.interaction==="scar"){
 const already=p.scarAttuned;
 showDialog("The Worldscar",already?
  "The fracture is quiet now. Its strange resonance has already awakened within you.":
  "A crystalline fracture hums with impossible light. For a moment you see another sky, behind this one.",
  already?[{text:"Step away",action:closeAll}]:[
   {text:"Touch the fracture",action:()=>{
    if(Q.attune(p)){giveXP(35,"sorcery");save(true);closeAll();notify("Veilcraft awakened · Magicka restored")}
    else closeAll();
   }},
   {text:"Leave the anomaly undisturbed",action:closeAll}
  ]);return
}
if(target.interaction==="board"){showDialog("Frostbridge Trail Notices","WANTED: Raiders along the eastern road. Also needed: medicinal blueleaf for the inn.",[{text:"Read the notice",action:()=>{notify("Roadward bounty recorded in your journal");closeAll()}},{text:"Step away",action:closeAll}]);return}
if(target.interaction==="forge"){
 if(Q.begin(p)){updateUI();save(true)}
 const ready=p.quest===3&&p.supplies;
 const speech=ready?
  "By the Skybreak — you found my stolen caravan supplies! You have my thanks.":
  p.quest>=5?"The supplies are restored, and the strange light is quiet. Hollowreach owes you a debt.":
  p.quest===4?"You found the missing supplies. The violet light near Greenwood's old stones may reveal more.":
  p.quest===1?"My stock was stolen east toward Greenwood. Follow the trail past the bridge.":
  p.quest===2?"Find the bandits' cave. Drive back at least one raider and recover my missing crate.":
  "Raiders took my tools and ore. Would you help an old smith?";
 const choices=ready?[
  {text:"Return the supplies (+80 gold)",action:()=>{
   if(Q.handIn(p)){
    giveXP(75,"survival");updateUI();save(true);closeAll();
    notify("Quest complete: The Missing Supplies · +80 gold");
   }else{closeAll();notify("The supplies were already delivered")}
  }},
  {text:"Keep the supplies for now",action:closeAll}
 ]:[
  {text:"Show me your wares",action:()=>shop("Joren's Forge")},
  {text:"I'll investigate",action:closeAll}
 ];
 showDialog("Joren the Blacksmith",speech,choices);return
}
if(target.interaction==="inn"){
 showDialog("Mira the Innkeeper",p.herbs>=2?
  "Those two blueleaf sprigs would make excellent medicine. I'll trade you a fresh potion.":
  "If you're headed beyond the bridge, take care. The forest hasn't been right since the storm.",
  [{text:p.herbs>=2?"Trade 2 Blueleaf for a healing potion":"Buy a healing potion (20 gold)",action:()=>{
   if(Q.herbTrade(p))notify("Traded 2 blueleaf sprigs for a potion");
   else if(p.gold>=20){p.gold-=20;p.potions++;notify("Purchased a healing potion")}
   else notify("Not enough gold");
   updateUI();save(true);closeAll()
  }},
  {text:"Rest by the hearth (restore health)",action:()=>{
   p.hp=p.hpMax;p.mp=p.mpMax;updateUI();save(true);closeAll();
   notify("Rested at Frostbridge campfire")
  }},
  {text:"Goodbye",action:closeAll}]);return
}
if(target.interaction==="hunter"){showDialog("Eldric the Hunter","I lost a friend near the old stones in Greenwood. If you find tracks or clues, bring back word.",[{text:"Tell me about the forest",action:()=>showDialog("Eldric the Hunter","Wolves haunt the eastern groves. There's a strange light near the ruined altar, and a cave the guards won't enter.",[{text:"Thank you",action:closeAll}])},{text:"Farewell",action:closeAll}]);return}
if(target.interaction==="guard"){showDialog("Warden Hal","Hollowreach is peaceful enough — unless you travel beyond the eastern trail. Keep that blade ready.",[{text:"Where should I explore?",action:()=>showDialog("Warden Hal","The bridge leads east to Greenwood, and a broken tower guards the northern heights. Old stories speak of a fissure in the sky.",[{text:"Understood",action:closeAll}])},{text:"Take care",action:closeAll}]);return}
if(target.interaction==="hound"){showDialog("Ash the Village Hound","The gray hound wags his tail curiously.",[{text:"Pet Ash",action:()=>{closeAll();notify("Ash seems pleased.")}},{text:"Continue",action:closeAll}]);return}
if(target.interaction==="hermit"){showDialog("The Green Hermit","The land remembers what the sky has forgotten. Seek the glowing stones at the old altar. They know your name.",[{text:"I will investigate",action:closeAll}]);return}
}
function shop(title){
 showDialog(title,Q.hasSword(p)?
  "That tempered blade should serve you well in the wilds.":
  "Joren offers a keenly balanced blade, forged here in Hollowreach.",
  [
   {text:Q.hasSword(p)?"Tempered Sword equipped":"Buy Tempered Sword (65 gold)",
    action:()=>{
     if(Q.buySword(p)){save(true);closeAll();notify("Equipped: Tempered Steel Sword")}
     else{closeAll();notify(Q.hasSword(p)?"You already own this sword":"Not enough gold")}
    }},
   {text:"Leave the forge",action:closeAll}
  ])
}
function showDialog(title,body,choices){clearJoystick();modal=true;$("dialogTitle").textContent=title;$("dialogText").textContent=body;const root=$("choices");root.innerHTML="";for(let ch of choices){let b=document.createElement("button");b.className="choice";b.textContent=ch.text;b.onclick=ch.action;root.appendChild(b)}$("dialog").style.display="block"}
function closeAll(){modal=false;reviewState.epoch++;for(let id of ["dialog","pause","inventory","worldReview"])$(id).style.display="none"}
function openInv(tab="pack"){if(!active)return;clearJoystick();closeAll();modal=true;invTab=tab;$("inventory").style.display="block";renderInventory()}
function renderInventory(){document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("selected",t.dataset.tab===invTab));let s="",b=$("inventoryBody");
if(invTab==="pack"){s='<p style="font-size:12px;color:#c1ba9d">Gold: '+p.gold+' ✦ &nbsp; • &nbsp; Equipped: '+p.weapon+'</p>';
for(let [n,info] of [[p.weapon,"Equipped · Weapon"],[p.armor,"Equipped · Armor"],["Healing Potion × "+p.potions,"Restores 60 Health"],["Blueleaf Sprig × "+p.herbs,"Alchemical Herb"],...(p.supplies?[["Stolen Caravan Supplies","Return these to Joren"]]:[])])s+='<div class="item"><b>'+n+'</b><span>'+info+'</span></div>';
s+='<p style="font-size:12px">Equipment and gathered resources persist automatically.</p>'}
if(invTab==="skills"){s='<p>Skills improve through use. '+p.xp+' / '+(p.lv*70)+' experience to your next level.</p>';
for(let [n,val]of Object.entries(p.skills))s+='<div class="item"><b>'+n[0].toUpperCase()+n.slice(1)+'</b><span>Rank '+Math.floor(val)+'</span></div>';
s+='<div class="item"><b>Level '+p.lv+'</b><span>Health '+p.hpMax+' · Magicka '+p.mpMax+'</span></div>'}
if(invTab==="journal"){
 const progress=Q.summary(p);
 s='<h3 style="color:#dfc086">'+$("questTitle").textContent+'</h3>';
 s+='<p>'+$("questText").textContent+'</p>';
 s+='<div class="item"><b>Caravan supplies</b><span>'+
  (progress.suppliesDelivered?"Delivered to Joren":progress.suppliesRecovered?"In your pack":progress.caveBanditCleared?"Cave raider defeated":"Not yet recovered")+'</span></div>';
 s+='<div class="item"><b>Blueleaf herbs</b><span>'+
  progress.herbsInBag+' in pack · '+progress.herbsHarvested+'/2 found</span></div>';
 s+='<div class="item"><b>Worldscar</b><span>'+
  (progress.scarAttuned?"Attuned":"Not yet attuned")+'</span></div>';
 s+='<p>Enemies defeated: '+p.kills+' · Gold: '+p.gold+'</p>'
}
if(invTab==="map"){s='<p>Hollowreach Province — your explored locations</p><div style="width:100%;height:145px;position:relative;border:2px solid #79654b;background:radial-gradient(circle at 45% 45%,#869c8a 0,#425e57 65%,#213a42 100%);overflow:hidden"><div style="position:absolute;left:9%;top:24%;font-size:13px">🏠 Hollowreach</div><div style="position:absolute;left:47%;top:55%;font-size:13px">🌲 Greenwood</div><div style="position:absolute;left:75%;top:13%;font-size:13px">◈ Cave</div><div style="position:absolute;left:58%;top:77%;font-size:11px;color:#ecd7a4">✦ You are in '+p.zone+'</div></div><p style="font-size:11px">Travel east from the village to reach Greenwood. Find the cave in the northeast forest.</p>'}b.innerHTML=s}
function bind(){
 const move=$("move"),knob=$("knob");
 const upd=e=>{
  const b=move.getBoundingClientRect();
  const dx=e.clientX-(b.left+b.width/2),dy=e.clientY-(b.top+b.height/2);
  const m=Math.hypot(dx,dy),rad=b.width*.33;
  joy.x=m>rad?dx/m:dx/rad;
  joy.y=m>rad?dy/m:dy/rad;
  knob.style.transform="translate("+joy.x*rad+"px,"+joy.y*rad+"px)";
 };
 move.addEventListener("pointerdown",e=>{
  if(!active||modal||joy.pid!==null)return;
  e.preventDefault();
  joy.pid=e.pointerId;
  try{move.setPointerCapture(e.pointerId)}catch(error){}
  upd(e);
 },{passive:false});
 move.addEventListener("pointermove",e=>{
  if(joy.pid!==e.pointerId)return;
  e.preventDefault();upd(e);
 },{passive:false});
 function releasePointer(e){if(joy.pid===e.pointerId)clearJoystick();}
 move.addEventListener("pointerup",releasePointer);
 move.addEventListener("pointercancel",releasePointer);
 move.addEventListener("lostpointercapture",releasePointer);
 // Touch actions are immediate, with the corresponding click consumed once.
 function bindActionButton(id,fn){
  const button=$(id);
  let lastTouch=-1e9;
  button.addEventListener("pointerdown",e=>{
   if(e.pointerType==="mouse")return;
   e.preventDefault();lastTouch=performance.now();fn();
  },{passive:false});
  button.addEventListener("click",e=>{
   e.preventDefault();
   if(performance.now()-lastTouch<650)return;
   fn();
  });
 }
[["attackBtn",()=>worldPreview.enabled?notify("Combat remains in your main adventure"):attack()],
 ["spellBtn",()=>worldPreview.enabled?notify("Magic remains in your main adventure"):spell()],
 ["dodgeBtn",()=>worldPreview.enabled?notify("Dodge belongs to the full gameplay slice"):dodge()],
 ["interactBtn",interact],
 ["potionBtn",()=>worldPreview.enabled?notify("Your potions are safe in the main adventure"):potion()],
 ["bagBtn",()=>worldPreview.enabled?notify("Inventory is safe in the main adventure"):openInv()],
 ["mapBtn",()=>worldPreview.enabled?openReviewAtlas():openInv("map")],
 ["worldPreviewBtn",toggleWorldPreview],["materialShowcaseBtn",cycleTerrainShowcase],["crossingShowcaseBtn",cycleCrossingShowcase],["reviewAtlasBtn",openReviewAtlas],["closeReviewBtn",closeReviewAtlas],
 ["geometryDebugBtn",()=>{
  if(!worldPreview.enabled){notify("Open the terrain preview to inspect its geometry");return}
  worldPreview.debug=!worldPreview.debug;showWorldPreviewStatus(true);
 }],["pauseBtn",()=>{clearJoystick();modal=true;$("pause").style.display="block"}],["closeDialog",closeAll],["closeInventory",closeAll],["closePause",closeAll],["resumeBtn",closeAll],["saveBtn",()=>save()],["resetBtn",()=>{if(confirm("Erase the journey on this device and begin again?"))reset()}],["beginBtn",()=>{
  if(window.VeilwardArt&&!window.VeilwardArt.sceneReady(p.zone)){
   const failed=window.VeilwardArt.sceneError(p.zone);
   $("beginBtn").textContent=failed?"RETRY LOADING THE WORLD":"LOADING HOLLOWREACH…";
   if(failed){window.VeilwardArt.retryScene(p.zone);notify("Retrying the snowy village artwork...")}
   return;
  }
  active=true;$("start").style.display="none";notify("Welcome to Hollowreach")
 }]].forEach(([id,fn])=>bindActionButton(id,fn));
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>{invTab=t.dataset.tab;renderInventory()}));
addEventListener("keydown",e=>{if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code))e.preventDefault();keys[e.code]=true;if(e.repeat)return;if(e.code==="Escape"){closeAll();return}if(!active||modal)return;
 if(worldPreview.enabled){
  if(e.code==="KeyE"||e.code==="KeyF"){interact();return}
  if(["Space","KeyJ","KeyQ","KeyK","ShiftLeft","ShiftRight","KeyH"].includes(e.code))
   notify("Terrain preview only · Return to the adventure for combat and quests");
  return
 }
 if(e.code==="Space"||e.code==="KeyJ")attack();if(e.code==="KeyQ"||e.code==="KeyK")spell();if(e.code==="KeyE"||e.code==="KeyF")interact();if(e.code==="ShiftLeft"||e.code==="ShiftRight")dodge();if(e.code==="KeyI"||e.code==="Tab")openInv();if(e.code==="KeyH")potion()});
addEventListener("keyup",e=>{keys[e.code]=false});addEventListener("blur",()=>{keys={};clearJoystick()});
 addEventListener("pagehide",()=>{clearJoystick();save(true)});
 document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="hidden"){keys={};clearJoystick();save(true)}
 });
document.addEventListener("touchmove",e=>{
  if(!e.target.closest("#inventory,#dialog,#pause,#start,#worldReview"))e.preventDefault();
 },{passive:false});
}
function tick(dt){
if(!active||modal)return;
if(worldPreview.enabled){tickWorldPreview(dt);return}
travelCooldown=Math.max(0,travelCooldown-dt);
arrivalPulse=Math.max(0,arrivalPulse-dt);
worldTime+=dt;night=(Math.sin(worldTime*.018-.6)+1)/2;
p.attackCd=Math.max(0,(p.attackCd||0)-dt);p.spellCd=Math.max(0,(p.spellCd||0)-dt);p.dodgeCd=Math.max(0,(p.dodgeCd||0)-dt);p.invuln=Math.max(0,(p.invuln||0)-dt);p.attackV=Math.max(0,(p.attackV||0)-dt);
p.st=Math.min(100,p.st+dt*18);p.mp=Math.min(p.mpMax,p.mp+dt*1.1);
p.castV=Math.max(0,(p.castV||0)-dt);p.dodgeV=Math.max(0,(p.dodgeV||0)-dt);
let ax=Number(!!(keys.KeyD||keys.ArrowRight))-Number(!!(keys.KeyA||keys.ArrowLeft))+joy.x,ay=Number(!!(keys.KeyS||keys.ArrowDown))-Number(!!(keys.KeyW||keys.ArrowUp))+joy.y,m=Math.hypot(ax,ay);if(m>1){ax/=m;ay/=m}
const previousX=p.x,previousY=p.y;
let speed=165;
if(p.dodgeTime>0){ax=p.dvx/350;ay=p.dvy/350;speed=390;p.dodgeTime-=dt}
else if(m>.05){p.facing={x:ax,y:ay}}
const moved=window.VeilwardNav?.projectMotion(p.zone,p.x,p.y,ax*speed*dt,ay*speed*dt,8);
if(moved){p.x=moved.x;p.y=moved.y}
else{const nx=clamp(p.x+ax*speed*dt,35,WORLD.w-35),ny=clamp(p.y+ay*speed*dt,72,WORLD.h-25);if(!occupied(nx,p.y))p.x=nx;if(!occupied(p.x,ny))p.y=ny}
// Animate by ACTUAL travel distance: walking in place against a wall is no longer possible.
const travelled=Math.hypot(p.x-previousX,p.y-previousY);
p.moving=travelled>.3;
if(p.moving)p.step=((p.step||0)+travelled*Math.PI*2/68)%(Math.PI*200);
const combat=window.VeilwardCombat;
for(const e of enemies[p.zone]){
 if(e.dead)continue;
 const action=combat.enemyStep(e,p,dt,window.VeilwardNav);
 if(action.damage>0&&p.invuln<=0){
  p.hp=Math.max(0,p.hp-action.damage);
  p.invuln=.58;shake=6;
  particles.push({x:p.x,y:p.y-55,t:.72,text:"−"+action.damage,color:"#f0a19f"});
  if(p.hp<=0){
   p.hp=p.hpMax;p.mp=p.mpMax;p.gold=Math.max(0,p.gold-12);
   changeZone("village",925,620);
   notify("You awaken in Hollowreach · −12 gold");save(true);
   break;
  }
 }
}
for(const b of projectiles){
 if(!combat.projectileStep(b,dt,window.VeilwardNav,p.zone)){
  if(b.blocked)effects.push({x:b.x,y:b.y,t:.2,type:"burst"});
  continue;
 }
 for(const e of enemies[p.zone]){
  if(e.dead||Math.hypot(e.x-b.x,e.y-25-b.y)>=32)continue;
  const damage=35+p.lv*3;
  e.hp=Math.max(0,e.hp-damage);combat.stagger(e,.48);b.age=10;
  particles.push({x:e.x,y:e.y-38,t:.7,text:"−"+damage,color:"#83dcff"});
  if(e.hp<=0)killEnemy(e);
  break;
 }
}
projectiles=projectiles.filter(b=>b.age<1.4);
effects.forEach(f=>f.t-=dt);effects=effects.filter(f=>f.t>0);particles.forEach(f=>{f.t-=dt;f.y-=dt*24});particles=particles.filter(f=>f.t>0);
const t=nearest();setHint(t?(t.interaction==="portal"?"✋ Travel to "+t.label:"✋ "+(t.label||t.name||"Interact")):"");
// Area travel is explicit: show a prompt and wait for player to tap Talk / press E. No accidental portal loops.
if(p.zone==="wilds"&&Q.enterForest(p)){updateUI();save(true);notify("New objective: Defeat the cave raider and recover supplies")}
if(p.quest===4&&p.zone==="wilds"){p.quest=4;updateUI()}
autosaveClock+=dt;if(autosaveClock>20){autosaveClock=0;save(true)}
updateUI()
}
function render(){
if(worldPreview.enabled){renderWorldPreview();return}
g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,vw,vh);
const sceneImage=window.VeilwardArt?.background(p.zone);
if(!terrainCache[p.zone]||(sceneImage&&terrainCache[p.zone]._sceneImage!==sceneImage))generate(p.zone);
const viewW=viewWidth(),viewH=viewHeight();
const targetX=clamp(p.x-viewW*.5,0,Math.max(0,WORLD.w-viewW)),targetY=clamp(p.y-viewH*.51,0,Math.max(0,WORLD.h-viewH));cam.x+=(targetX-cam.x)*.13;cam.y+=(targetY-cam.y)*.13;
g.save();g.scale(WORLD_ZOOM,WORLD_ZOOM);g.translate(-Math.floor(cam.x)+(Math.random()-.5)*shake,-Math.floor(cam.y)+(Math.random()-.5)*shake);
g.drawImage(terrainCache[p.zone],0,0);
window.VeilwardArt?.glows(g,p.zone,worldTime);
window.VeilwardArt?.routeGlows?.(g,p.zone,worldTime);
 for(const e of enemies[p.zone])if(e.wind>0&&!e.dead)drawEnemyTelegraph(g,e);
// Soft arrival cue is drawn at the feet, blending into painted terrain.
if(arrivalPulse>0){
 const alpha=Math.min(.13,arrivalPulse*.13);
 const rgb=p.zone==="village"?"238,207,150":p.zone==="wilds"?"146,201,154":"167,141,238";
 const halo=g.createRadialGradient(p.x,p.y-4,4,p.x,p.y-4,86);
 halo.addColorStop(0,"rgba("+rgb+","+alpha+")");
 halo.addColorStop(1,"rgba("+rgb+",0)");
 g.fillStyle=halo;g.fillRect(p.x-86,p.y-90,172,172);
}

if(typeof location!=="undefined"&&location.search.includes("debugNav"))window.VeilwardNav?.drawDebug(g,p.zone);

let visible=decorCache[p.zone].filter(o=>o.x>cam.x-250&&o.x<cam.x+viewW+250&&o.y>cam.y-250&&o.y<cam.y+viewH+250);
const ents=[...visible.map(o=>({...o,renderType:"prop"})),...npc.filter(n=>n.zone===p.zone).map(n=>({...n,renderType:"npc"})),...enemies[p.zone].filter(e=>!e.dead).map(e=>({...e,renderType:"enemy"})),{...p,renderType:"player"}];
for(const o of objects)if(o.zone===p.zone&&!o.taken){if(o.type==="scar"||o.type==="herb"||o.type==="chest"||o.type==="portal")ents.push({...o,renderType:"object"})}
ents.sort((a,b)=>a.y-b.y);
for(let e of ents){if(e.renderType==="prop")drawProp(g,e,night);else if(e.renderType==="npc"){
  drawHero(g,e.x,e.y,0,worldTime*.25,e.color,false,"npc_"+e.role);
 }
 else if(e.renderType==="enemy"){drawHero(g,e.x,e.y,0,e.step,"",true,e.type,0);drawHealth(g,e)}
else if(e.renderType==="player"){drawHero(g,e.x,e.y,0,e.step||0,"#637f96",false,"human",e.attackV||0)}
else if(e.renderType==="object"){if(e.type==="scar"){for(let k=0;k<5;k++){let xx=e.x+(k-2)*17,yy=e.y-14-Math.abs(2-k)*13;poly(g,[[xx-9,yy],[xx,yy-40-5*Math.sin(worldTime*2+k)],[xx+9,yy],[xx,yy+4]],k%2?"#7b7aca":"#62bdca");rect(g,xx-2,yy-26,3,13,"#d6e7ff")}}
if(e.type==="herb"){for(let k=0;k<5;k++){stroke(g,[[e.x,e.y],[e.x+(k-2)*6,e.y-15-rng(k)*12]],2,"#549c91");circle(g,e.x+(k-2)*5,e.y-21-rng(k)*8,3,"#8ad9d0")}}
if(e.type==="chest"){rect(g,e.x-21,e.y-18,42,24,"#634a34");rect(g,e.x-22,e.y-22,44,12,"#947052");rect(g,e.x-4,e.y-21,8,25,"#ddbd74")}
if(e.type==="portal"){
 circle(g,e.x,e.y,15,"#f7d78722");
 g.lineWidth=2;g.strokeStyle="#ecd19a";g.beginPath();g.arc(e.x,e.y-11,13,0,Math.PI*2);g.stroke();
 poly(g,[[e.x,e.y-28],[e.x+8,e.y-12],[e.x,e.y-4],[e.x-8,e.y-12]],"#f2c477");
 if(dist(e,p)<210)imgText(g,e.label,e.x,e.y-40,11)
}}
}
for(const b of projectiles){circle(g,b.x,b.y,11,"#75c9f3");circle(g,b.x,b.y,6,"#e2f7ff");for(let k=1;k<4;k++)circle(g,b.x-b.vx*.014*k,b.y-b.vy*.014*k,4,"#5aa5d6")}
for(let fx of effects){if(fx.type==="slash"){g.strokeStyle="#f3e5ba";g.lineWidth=7;g.beginPath();g.arc(fx.x,fx.y,29,fx.angle-.9,fx.angle+.9);g.stroke();g.strokeStyle="#9ed2f1";g.lineWidth=2;g.stroke()}else for(let k=0;k<8;k++){let a=k*Math.PI/4;rect(g,fx.x+Math.cos(a)*25,fx.y+Math.sin(a)*25,5,5,"#e6c184")}}
for(const v of particles)imgText(g,v.text,v.x,v.y,14,v.color);
 // In-world NPC nameplates are UI, drawn AFTER depth-sorted actors;
 // showing only the current interaction target avoids overlapping faces.
 const focus=!modal?nearest():null;
 if(focus?.role)drawFocusedNpcName(g,focus);
if(p.zone==="village"){ // delicate drifting snow, deterministic and cheap
for(let i=0;i<62;i++){let x=(rng(i*24+11)*WORLD.w+worldTime*(10+i%5))%WORLD.w,y=(rng(i*17+13)*WORLD.h+worldTime*(21+i%3))%WORLD.h;if(x>cam.x&&x<cam.x+vw&&y>cam.y&&y<cam.y+vh)rect(g,x,y,2,2,"#f6f8ff88")}}
if(p.zone==="cave"){for(let i=0;i<8;i++){let x=220+i*205,y=120+(i%3)*350;circle(g,x,y,8+Math.sin(worldTime+i)*3,"#6ac2e044")}}
g.restore();
if(p.zone==="cave"){g.fillStyle="#10172928";g.fillRect(0,0,vw,vh)}
else if(night>.65){g.fillStyle="rgba(13,22,48,"+((night-.65)*.54)+")";g.fillRect(0,0,vw,vh)}
shake*=.78;if(shake<.2)shake=0;if(toastTime>0){toastTime-=.016;if(toastTime<=0)$("toast").style.display="none"}
}
function frame(now){let dt=Math.min(.055,(now-last)/1000||.016);last=now;tick(dt);render();requestAnimationFrame(frame)}
load();
Q.migrate(p);
if(!p.artVersion){p.zone="village";p.x=925;p.y=620;p.artVersion=2;}
if(p.zone==="forge"){p.zone="village";p.x=925;p.y=620;p.navVersion=4;}
if(p.sceneVersion!==6){
 // Reclassify old water/cliff saves without resetting the zone or quest.
 // safePosition below moves only the physical character coordinates if
 // the former saved location was painted water, railing or cliff.
 p.sceneVersion=6;p.navVersion=4;
}
if(window.VeilwardNav&&!window.VeilwardNav.canWalk(p.zone,p.x,p.y,8)){
 const pt=safePosition(p.zone,p.x,p.y);p.x=pt.x;p.y=pt.y;
}
save(true);
setup();bind();
function refreshStartStatus(){
 const button=$("beginBtn");
 if(!window.VeilwardArt){button.textContent="ENTER HOLLOWREACH";return}
 if(window.VeilwardArt.sceneReady(p.zone)){button.textContent="ENTER HOLLOWREACH";return}
 button.textContent=window.VeilwardArt.sceneError(p.zone)?"RETRY LOADING THE WORLD":"LOADING HOLLOWREACH…";
}
window.addEventListener("veilward-art-loaded",e=>{
 const zone=e.detail?.zone||e.detail;
 if(zone&&C[zone]){
  delete terrainCache[zone];
  generate(zone);
  if(pendingTravel&&pendingTravel.z===zone){
   const task=pendingTravel;pendingTravel=null;
   changeZone(task.z,task.tx,task.ty);
  }
 }
 refreshStartStatus();
});
window.addEventListener("veilward-art-error",e=>{
 const zone=e.detail?.zone||"village";
 console.error("Veilward could not load scene artwork:",zone,window.VeilwardArt?.sceneError(zone));
 if(zone===p.zone)refreshStartStatus();
 if(pendingTravel?.z===zone){pendingTravel=null;notify("Artwork unavailable. Reconnect and try the trail again.")}
});
window.addEventListener("veilward-actors-ready",refreshStartStatus);
if(!terrainCache[p.zone])generate(p.zone);
$("location").textContent=C[p.zone].label;
refreshStartStatus();
requestAnimationFrame(frame);
if($("buildVersion"))$("buildVersion").textContent="v"+APP_VERSION;
// Installed iPhone app and Safari both check for updates on boot and resume.
if("serviceWorker" in navigator){
 const BUILD=APP_VERSION;
 let updating=false,reloading=false;
 function reloadUpdatedClient(version){
  const next=version||BUILD;
  if(reloading||(next===BUILD&&new URL(location.href).searchParams.get("vwbuild")===BUILD))return;
  try{
   const key="veilward-reloaded-"+next;
   if(sessionStorage.getItem(key)==="1")return;
   sessionStorage.setItem(key,"1");
  }catch(error){}
  clearJoystick();save(true);
  reloading=true;
  const url=new URL(location.href);
  url.searchParams.set("vwbuild",next);
  location.replace(url.toString());
 }
 async function checkGameUpdates(){
  if(updating)return;
  updating=true;
  try{
   const registration=await navigator.serviceWorker.register("./sw.js",{
    updateViaCache:"none"
   });
   await registration.update();
   if(registration.waiting)registration.waiting.postMessage({type:"SKIP_WAITING"});
  }catch(error){console.warn("Veilward update check failed",error)}
  finally{updating=false}
 }
 navigator.serviceWorker.addEventListener("controllerchange",()=>{
  reloadUpdatedClient(BUILD);
 });
 navigator.serviceWorker.addEventListener("message",event=>{
  if(event.data?.type==="VEILWARD_BUILD_UPDATED"&&event.data.build!==BUILD)
   reloadUpdatedClient(event.data.build);
 });
 window.addEventListener("load",checkGameUpdates);
 window.addEventListener("pageshow",checkGameUpdates);
 window.addEventListener("focus",checkGameUpdates);
 document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="visible")checkGameUpdates()
 });
}

})();