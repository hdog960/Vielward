/*
 * VEILWARD Phase 3 photo-to-nav regression suite (v1.2.4)
 * Run: node tests/phase3_scene_geometry.test.js
 * Native screenshot/map fixtures use the authored 900×584 painting coordinates.
 */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const zoneCode=fs.readFileSync("navigation.js","utf8");
const gameplay=fs.readFileSync("game.js","utf8");
const visual=fs.readFileSync("visual.js","utf8");
const sandbox={window:{}};vm.runInNewContext(zoneCode,sandbox);
const nav=sandbox.window.VeilwardNav;
const W=1850/900,H=1200/584,R=8;
const world=(p)=>[p[0]*W,p[1]*H];
let assertions=0;
function check(cond,msg){assert.ok(cond,msg);assertions++}
function foot(zone,x,y){return nav.canWalk(zone,x,y,R)}
const allowed={
 village:[[450,302,"start"],[431,253,"Joren"],[628,290,"Hal"],
 [523,343,"Ash"],[380,530,"exit"],[501,328,"return"],[589,324,"Mira"],
 [350,494,"Eldric"],[487,302,"noticepost"]],
 wilds:[[358,482,"arrival"],[263,520,"village portal"],[827,363,"cave portal"],
 [740,350,"return"],[243,448,"blueleaf"],[579,347,"blueleaf2"],
 [720,205,"Worldscar"]],
 cave:[[377,360,"arrival"],[83,387,"exit"],[432,335,"supplies"],
 [700,256,"wraith"],[825,170,"upper shrine"]]
};
const forbidden={
 village:[[469,470,"screenshot: river"],[608,170,"screenshot: upper fence"],
 [550,430,"water"],[820,445,"river"],[310,270,"waterfall"],
 [715,110,"monument plinth"]],
 wilds:[[524,409,"screenshot: bridge rail"],[312,360,"waterfall"],
 [765,80,"sealed shrine door"],[425,425,"left rail"]],
 cave:[[300,330,"screenshot: lantern-post top"],[180,280,"abyss"],
 [760,105,"stone pillar"],[540,450,"lower-right cliff"]]
};
for(const [zone,items]of Object.entries(allowed))
 for(const [x,y,tag]of items){
  check(foot(zone,...world([x,y])),zone+" "+tag+" must be on painted ground");
 }
for(const [zone,items]of Object.entries(forbidden))
 for(const [x,y,tag]of items){
  const xy=world([x,y]);
  check(!foot(zone,...xy),zone+" "+tag+" must be forbidden");
  const safe=nav.safePoint(zone,...xy);
  check(foot(zone,safe.x,safe.y),zone+" old saved coordinate must recover safely");
 }
const expectedRoutes=[
 ["village","spawn to blacksmith",[925,620],[885,520]],
 ["village","blacksmith to lower road",[885,520],[790,1090]],
 ["village","return to Warden",[1030,675],[1290,595]],
 ["village","snow trail to Mira",[790,1090],[1210,665]],
 ["wilds","forest entry to cave",[735,991],[1700,745]],
 ["wilds","cave return to village",[1520,720],[540,1068]],
 ["wilds","blueleaf to fracture",[500,920],[1480,420]],
 ["cave","cave entry to chest",[775,741],[888,689]],
 ["cave","chest to shrine",[888,689],[1700,350]],
 ["cave","shrine to cave exit",[1700,350],[170,795]]
];
const STEP=12,NX=155,NY=101;
const diffs=[[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
const cells={},index=(x,y)=>y*NX+x;
function zoneGrid(zone){
 if(cells[zone])return cells[zone];
 const grid=new Uint8Array(NX*NY);
 for(let y=0;y<NY;y++)for(let x=0;x<NX;x++)
  if(foot(zone,x*STEP,y*STEP))grid[index(x,y)]=1;
 return cells[zone]=grid;
}
function anchor(zone,xy){
 const grid=zoneGrid(zone);let best=-1,dist=Infinity;
 for(let y=Math.max(0,Math.floor(xy[1]/STEP)-5);y<=Math.min(NY-1,Math.ceil(xy[1]/STEP)+5);y++)
 for(let x=Math.max(0,Math.floor(xy[0]/STEP)-5);x<=Math.min(NX-1,Math.ceil(xy[0]/STEP)+5);x++){
  const k=index(x,y);if(!grid[k])continue;
  const dd=(x*STEP-xy[0])**2+(y*STEP-xy[1])**2;
  if(dd<dist){best=k;dist=dd}
 }
 return best;
}
function neighbours(zone,grid,k){
 const x=k%NX,y=Math.floor(k/NX),result=[];
 for(const [dx,dy]of diffs){
  const xx=x+dx,yy=y+dy;
  if(xx<0||yy<0||xx>=NX||yy>=NY)continue;
  const i=index(xx,yy);
  if(!grid[i])continue;
  if(dx&&dy&&!foot(zone,(x+dx*.5)*STEP,(y+dy*.5)*STEP))continue;
  result.push(i);
 }
 return result;
}
for(const zone of ["village","wilds","cave"]){
 const grid=zoneGrid(zone),seen=new Uint8Array(grid.length),start=grid.findIndex(v=>v);
 check(start>=0,zone+" should contain floor");
 const q=[start];seen[start]=1;
 for(let p=0;p<q.length;p++)
  for(const n of neighbours(zone,grid,q[p]))if(!seen[n]){seen[n]=1;q.push(n)}
 const count=grid.reduce((n,entry)=>n+entry,0);
 check(q.length===count,zone+" has disconnected walkable islands");
}
let steps=0;
for(const [zone,name,origin,destination]of expectedRoutes){
 const grid=zoneGrid(zone),from=anchor(zone,origin),to=anchor(zone,destination);
 check(from>=0&&to>=0,name+" starts and ends on floor");
 const q=[from],parent=new Int32Array(grid.length).fill(-1);parent[from]=from;
 for(let k=0;k<q.length&&parent[to]<0;k++)
  for(const n of neighbours(zone,grid,q[k]))
   if(parent[n]<0){parent[n]=q[k];q.push(n)}
 check(parent[to]>=0,name+" route must be reachable");
 let path=[],curr=to;while(curr!==from){path.push(curr);curr=parent[curr]}
 path.push(from);path.reverse();
 let player={x:path[0]%NX*STEP,y:Math.floor(path[0]/NX)*STEP};
 for(const cell of path.slice(1)){
  const end={x:cell%NX*STEP,y:Math.floor(cell/NX)*STEP};
  const moved=nav.projectMotion(zone,player.x,player.y,end.x-player.x,end.y-player.y,R);
  check(Math.hypot(moved.x-end.x,moved.y-end.y)<=2.1,name+" blocked step");
  check(foot(zone,moved.x,moved.y),name+" escaped the painted floor");
  player=moved;steps++;
 }
 check(Math.hypot(player.x-destination[0],player.y-destination[1])<=13,name+" destination mismatch");
}
// Gameplay and assets are part of the same acceptance gate.
check(/const APP_VERSION="1\.(?:2\.[4-9]|[3-9]\.\d+)";/.test(gameplay),"Phase 3 geometry persists in current build");
check(gameplay.includes('const SAVE="veilward-hollowreach-v01";'),"saved journey key preserved");
check(gameplay.includes('x:790,y:1090,to:"wilds"'),"village exit moved to real snow");
check(gameplay.includes('x:170,y:795,to:"wilds"'),"cave exit moved to actual bridge mouth");
check(gameplay.includes('to:"village",tx:1030,ty:675'),"safe main-town return");
check(gameplay.includes('x:500,y:920,label:"Blueleaf Sprig"'),"river herb relocated");
check(visual.includes('const ENEMY={wolf:8,bandit:6,wraith:9};'),"raiders not Wanderer clones");
check(visual.includes('load("hero","hero_approved_8way_v12.webp"'),"approved player art intact");
check(visual.includes('load("warden","warden_hal_v13.png"'),"approved Warden sprite intact");
check(nav.version==="0.7.0","navigation mesh version correct");
console.log("Veilward Phase 3 redo PASS:",assertions,"assertions,",expectedRoutes.length,"routes,",steps,"movement segments");
