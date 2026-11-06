/* VEILWARD 1.3.6 — PHASE 9 VISUAL RECOVERY R2
 * Hand-composed local vignettes pinned to the existing world blueprint nodes.
 * Buildings and solid props have real, runtime collision and NEVER replace
 * roads, lakes or approved adventure geometry. Pixel-structured illustration:
 * roof planes, timber siding, stone footings, warm windows, shingles, eaves,
 * boulder strata and bridgeheads all share the same three-quarter light.
 * NOT creator-accepted final art. No backgrounds made from reference JPGs.
 */
(function(){
"use strict";
const VERSION="1.3.8",PI=Math.PI,TAU=PI*2;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rnd=(a,b,c=0)=>{let n=Math.imul(a|0,374761393)^Math.imul(b|0,668265263)^Math.imul(c|0,1442695041);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296};
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function path(c,pts,col){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle=col;c.fill()}
function stroke(c,a,b,col,w){c.beginPath();c.moveTo(...a);c.lineTo(...b);c.strokeStyle=col;c.lineWidth=w;c.stroke()}
function oval(c,x,y,rx,ry,col){c.save();c.translate(x,y);c.scale(rx,ry);c.beginPath();c.arc(0,0,1,0,TAU);c.fillStyle=col;c.fill();c.restore()}
const W=(anchor,dx,dy,kind,r=52,seed=0)=>({anchor,dx,dy,kind,r,seed});
const PLACEMENTS=[
 // Layout-authored cottage lanes and village square: never on the travel centerline.
 W("village",-240,-160,"snow_cottage",96,11),
 W("village",-260,280,"snow_cottage",92,13),
 W("village",350,300,"woodpile",38,21),
 W("village",-160,-500,"well",56,24),
 W("village",300,-430,"sign",20,32),
 W("joren",-160,160,"snow_cottage",80,39),
 W("joren",350,300,"forge_stall",75,43),
 // High alpine architecture, retaining the existing memorial and cliff solids.
 W("colp_lodge",-160,160,"snow_cottage",90,51),
 W("colp_lodge",350,300,"woodpile",40,52),
 W("colp_lodge",-160,-500,"sign",22,53),
 W("northwatch_plaza",-470,-140,"obelisk",51,61),
 W("northwatch_plaza",80,400,"obelisk",48,62),
 W("northwatch_plaza",-260,280,"brazier",38,63),
 W("northwatch_plaza",0,-500,"stone_wall",76,64),
 // Authentic bridge landings with ropes, stacked crate details and torchlight.
 W("bridge_w",-420,120,"bridge_post",28,71),
 W("bridge_w",-250,-340,"woodpile",40,72),
 W("bridge_w",350,300,"brazier",32,73),
 // Snowmelt shelter and supply markings.
 W("thaw_camp",-520,-280,"canvas_tent",84,81),
 W("thaw_camp",350,300,"woodpile",35,82),
 W("thaw_camp",500,-250,"sign",20,83),
 // Greenwood's shelter, stacked felling logs and flower-garden edge.
 W("greenwood_hearth",-400,160,"forest_cottage",92,91),
 W("greenwood_hearth",350,300,"woodpile",46,92),
 W("greenwood_hearth",-260,280,"mushroom_ring",40,93),
 W("greenwood_hearth",300,-430,"sign",22,94),
 W("falls_overlook",-400,360,"stone_wall",60,101),
 W("falls_overlook",-250,-340,"obelisk",38,102),
 W("falls_overlook",350,300,"brazier",33,103),
 W("island",-260,280,"obelisk",40,111),
 W("island",300,-430,"mushroom_ring",44,112),
 W("market",-80,-240,"market_stall",95,121),
 W("market",320,80,"market_stall",95,122),
 W("market",500,-250,"woodpile",35,123),
 W("oldroad_tower",-240,-160,"stone_wall",78,131),
 W("oldroad_tower",350,300,"obelisk",42,132),
 W("cave_mouth",-400,360,"brazier",36,141),
 W("cave_mouth",300,-430,"woodpile",34,142),
 W("worldscar_ring",-470,-140,"obelisk",52,151),
 W("worldscar_ring",500,-250,"obelisk",45,152)
];
const HOUSE_TYPES=new Set(["snow_cottage","forest_cottage","canvas_tent","market_stall","forge_stall"]);
function create(model,geometry,options={}){
 if(!model||!geometry?.roads||!options.footprint||!options.climate)throw Error("Vignettes require source land, climate and physical roads");
 const footprint=options.footprint,climate=options.climate,unit=model.worldDesign.worldUnitScale;
 const nodes=new Map(model.nodes.map(n=>[n.id,n]));
 const built=[],rejected=[];
 function safe(o,others){
  if(!footprint.onLand(o.x,o.y)||geometry.waterAt(o.x,o.y,o.r+25))return false;
  const road=geometry.nearRoad(o.x,o.y,()=>true,o.r+100);
  if(road?.distance<o.r+95)return false;
  if(geometry.obstacle(o.x,o.y,o.r+25)||footprint.blocked(o.x,o.y,o.r+18))return false;
  if(others.some(p=>Math.hypot(p.x-o.x,p.y-o.y)<p.r+o.r+75))return false;
  return true
 }
 for(const item of PLACEMENTS){
  const node=nodes.get(item.anchor);
  if(!node)throw Error("Unmapped authored vignette "+item.anchor);
  const x=node.point[0]*unit+item.dx,y=node.point[1]*unit+item.dy;
  const o={...item,x,y,id:item.anchor+"-"+item.kind+"-"+item.seed,climate:climate.sample(x,y)};
  if(safe(o,built))built.push(o);else rejected.push(o.id);
 }
 function collision(x,y,r=10,skip){
  for(const o of built){
   if(skip?.(o))continue;
   // Low mushroom borders are visual groundcover, never an invisible wall.
   if(o.kind==="mushroom_ring")continue;
   const dx=x-o.x,dy=y-o.y;
   if(HOUSE_TYPES.has(o.kind)){
    if(Math.abs(dx)<o.r*.95+r&&Math.abs(dy)<o.r*.57+r)return true
   }else if(Math.hypot(dx,dy)<o.r*.7+r)return true
  }
  return false
 }
 function groundShadow(c,o,width=1){
  oval(c,o.x+23,o.y+21,o.r*width*1.12,o.r*.37,"rgba(17,32,45,.28)");
  oval(c,o.x+10,o.y+12,o.r*width*.88,o.r*.25,"rgba(25,35,47,.24)")
 }
 function woodwork(c,x,y,w,h,warm){
  // Clamped value ramp and timber dovetails: no untextured brown rectangles.
  const dark=warm?"#423a3e":"#3f444c",base=warm?"#776049":"#5f6663",light=warm?"#b18e6b":"#9a9f9b";
  rect(c,x,y,w,h,dark);
  rect(c,x+7,y+8,w-13,h-14,base);
  for(let j=8;j<h-7;j+=16){
   rect(c,x+10,y+j,w-19,3,dark);
   if(j%32===8)rect(c,x+20,y+j-5,35,3,light)
  }
  rect(c,x+6,y+9,10,h-19,light);
  rect(c,x+w-20,y+6,11,h-14,dark);
 }
 function windowLit(c,x,y,w=38,h=38){
  rect(c,x-8,y-9,w+16,h+19,"#30313b");
  rect(c,x-2,y-5,w+4,h+9,"#8c674d");
  rect(c,x+5,y+4,w-10,h-6,"#dd9c54");
  rect(c,x+8,y+5,w-18,h-12,"#f5d08a");
  rect(c,x+w*.49,y+5,6,h-12,"#6d5144");
  rect(c,x+8,y+h*.52,w-18,5,"#80634b");
  rect(c,x-12,y+h+5,w+24,9,"#c4b6a0")
 }
 function roof(c,o,w,d,peaked=true){
  const {x,y}=o,snow=o.climate.snow>.38;
  const left=x-w*.54,right=x+w*.54,front=y-d*.25;
  const top=y-d*1.43,peakX=x-w*.04;
  // Two visibly different sloped planes under one eave (three-quarter camera).
  path(c,[[left-18,front],[peakX,top],[right+30,front-47],[right+32,front+7],[peakX+9,top+35],[left-24,front+14]],"#303e4d");
  path(c,[[left-15,front-6],[peakX,top+3],[peakX+9,top+33],[left-12,front+6]],snow?"#7e9aab":"#586b67");
  path(c,[[peakX+9,top+33],[peakX,top+3],[right+28,front-44],[right+29,front+7]],snow?"#6f8099":"#485b60");
  // Rows follow the roof pitch; the tile grid bends naturally with perspective.
  for(let row=1;row<8;row++){
   const t=row/8,lv=front-(front-top)*t,rx=right-(right-peakX)*t;
   for(let j=0;j<8;j++){
    const a=peakX+(rx-peakX)*j/8;
    const yy=top+(front-top)*(1-t)+j/8*(-43*(1-t));
    rect(c,a,yy,10+(1-t)*8,4,j%3===0?"#bac4c1":row%2?"#8797a4":"#9eabb0")
   }
  }
  if(snow){
   path(c,[[left-19,front-11],[peakX,top-2],[peakX+1,top+17],[left-16,front+8]],"rgba(229,237,230,.80)");
   path(c,[[peakX+9,top+12],[right+18,front-51],[right+30,front-27],
     [peakX+13,top+26]],"rgba(220,232,231,.72)");
   for(let j=0;j<7;j++){
    const px=left+14+j*(w*.9/7),py=front-(j%2)*5;
    rect(c,px,py,5,10+(j%3)*8,"#dfe9e8")
   }
  }else{
   stroke(c,[left,front],[peakX,top+7],"#b4b9a3",6);
   stroke(c,[peakX,top+8],[right+23,front-47],"#798b7d",6);
   for(let j=0;j<6;j++)rect(c,left+20+j*w/7,front-8-j%2*5,14,4,"#96a88c")
  }
  // Raised chimney with actual upper cap, no hovering flat roof.
  const chx=x+w*.28,chy=y-d*1.44;
  rect(c,chx,chy-23,24,76,"#5e5961");
  rect(c,chx+3,chy-25,18,68,"#a9a8a3");
  rect(c,chx-5,chy-34,33,11,snow?"#eef0e8":"#9f9f9b")
 }
 function house(c,o){
  const {x,y,r,kind}=o,snow=o.climate.snow>.38,foresty=kind==="forest_cottage",w=r*2.12,h=r*1.7;
  groundShadow(c,o,1.55);
  // Honest foot wall: rear upper floor never pretends to be walkable soil.
  const facadeY=y-r*.83;
  path(c,[[x-w*.55,facadeY-h*.8],[x+w*.43,facadeY-h*.75],[x+w*.56,y],[x-w*.48,y+4]],"#3f444e");
  woodwork(c,x-w*.51,facadeY-h*.56,w*.92,h*.8,true);
  path(c,[[x+w*.44,facadeY-h*.58],[x+w*.59,facadeY-h*.8],[x+w*.67,y-18],[x+w*.45,y+2]],"#4c4441");
  rect(c,x-w*.46,y-14,w*.96,12,"#a6a6a0");
  rect(c,x-w*.44,y-8,w*.93,8,"#484b52");
  // Visible facade beam and stable warm entry.
  rect(c,x-w*.46,facadeY-h*.2,w*.96,8,"#382f38");
  rect(c,x-w*.2,y-r*.62,w*.26,r*.62,"#272c33");
  rect(c,x-w*.16,y-r*.58,w*.18,r*.51,"#5a463b");
  rect(c,x-w*.14,y-r*.56,w*.12,7,"#bc9869");
  rect(c,x+w*.015,y-r*.25,6,9,"#f9ce7f");
  windowLit(c,x-w*.41,facadeY-h*.32,w*.17,h*.24);
  windowLit(c,x+w*.19,facadeY-h*.31,w*.14,h*.24);
  roof(c,o,w,h,true);
  // Real steps outside the door; low props only, not another impassable wall.
  for(let i=0;i<3;i++){
   const yy=y-11+i*9,wide=18+i*12;
   rect(c,x-w*.075-wide*.5,yy,wide+30,8,i%2?"#8f97a1":"#c3bfac")
  }
  for(let j=0;j<4;j++){
   const px=x-w*.43+j*(w*.87/3);
   rect(c,px,y-11,11,9,"#867c70");
   rect(c,px+4,y-14,6,4,"#ced0c5")
  }
  if(foresty){
   // Ivy climbing a corner, with leaf-cluster values from the shared ramp.
   for(let i=0;i<12;i++){
    const px=x-w*.52+(i%3)*12,py=y-20-i*13;
    rect(c,px,py,10,5,i%3?"#638264":"#8aa778")
   }
  }
 }
 function tent(c,o){
  groundShadow(c,o,1.3);const {x,y,r}=o;
  path(c,[[x-r*1.2,y-6],[x,y-r*1.5],[x+r*1.25,y-4],[x+r*1.03,y+11],[x-r,y+11]],"#38434a");
  path(c,[[x-r*1.11,y-10],[x,y-r*1.44],[x-8,y+7],[x-r*.96,y+7]],"#b7aa88");
  path(c,[[x+2,y-r*1.4],[x+r*1.1,y-8],[x+r*.96,y+5],[x+3,y+3]],"#786f66");
  path(c,[[x-12,y+5],[x,y-r*.88],[x+13,y+5]],"#333842");
  for(let j=0;j<5;j++)stroke(c,[x-r+20+j*32,y],[x-r+20+j*32,y+8],"#dbcdad",3);
  stroke(c,[x,y-r*1.5],[x-r*1.4,y+18],"#ded6ae",3);
 }
 function stall(c,o){
  const {x,y,r}=o;groundShadow(c,o,1.15);
  const w=r*2.2;
  rect(c,x-w*.49,y-23,w,20,"#554b43");
  for(let i=0;i<5;i++)rect(c,x-w*.42+i*w*.19,y-27,22,12,i%2?"#b6a17c":"#8d6f55");
  for(const side of [-1,1]){
   const px=x+side*w*.44;rect(c,px,y-r*1.20,11,r*1.18,"#423b3f");
   rect(c,px-3,y-r*1.21,18,8,"#c0a984")
  }
  path(c,[[x-w*.63,y-r*1.18],[x-w*.42,y-r*1.58],
   [x+w*.42,y-r*1.58],[x+w*.63,y-r*1.18]],"#483d44");
  for(let i=0;i<8;i++){
   const xx=x-w*.56+i*(w*1.12/8),yy=y-r*1.18-(i%2)*3;
   path(c,[[xx,yy],[xx+w*.14,yy],[xx+w*.11,yy-32],[xx+5,yy-32]],
    i%2?"#c8b19a":"#728c79")
  }
  rect(c,x-w*.57,y-r*.93,w*1.14,8,"#edcfab");
  for(let i=0;i<7;i++){
   rect(c,x-w*.36+i*26,y-51,16,17,i%2?"#8aaf7b":"#d2af70")
  }
 }
 function well(c,o){
  const {x,y,r}=o;groundShadow(c,o,1);
  oval(c,x,y-10,r*.85,r*.35,"#434d57");
  oval(c,x,y-22,r*.75,r*.30,"#9b9991");
  oval(c,x,y-23,r*.56,r*.23,"#2c526b");
  for(let i=0;i<12;i++){
   const a=i*TAU/12,xx=x+Math.cos(a)*r*.75,yy=y-22+Math.sin(a)*r*.27;
   rect(c,xx-8,yy-7,16,11,i%2?"#a6a8a8":"#666e7e")
  }
  for(const side of [-1,1])rect(c,x+side*r*.75-6,y-150,13,139,"#635143");
  path(c,[[x-r*.92,y-150],[x,y-213],[x+r*.93,y-150],[x,y-132]],"#4a5565");
  path(c,[[x-r*.81,y-150],[x,y-201],[x+r*.82,y-150],[x,y-140]],"#bdc8c6");
  stroke(c,[x,y-160],[x,y-38],"#a29376",3);
  oval(c,x,y-48,19,13,"#a58266")
 }
 function woodpile(c,o){
  const {x,y,r}=o;groundShadow(c,o,1.2);
  rect(c,x-r,y-30,r*2,29,"#433c3f");
  for(let j=0;j<3;j++)for(let i=0;i<4;i++){
   const px=x-r+15+i*(r*.45)+(j%2)*10,py=y-20-j*22;
   rect(c,px,py-11,r*.46,15,j%2?"#85664e":"#b4916a");
   oval(c,px+3,py-6,12,8,"#dfc7a7");
   oval(c,px+3,py-6,6,4,"#775c4b");
   stroke(c,[px+r*.22,py-13],[px+r*.40,py-12],"#493c3a",3)
  }
  rect(c,x-r-5,y-94,11,87,"#4d4649");
  rect(c,x+r-7,y-94,11,87,"#4d4649")
 }
 function sign(c,o){
  const {x,y}=o;groundShadow(c,o,.4);
  rect(c,x-10,y-120,20,117,"#544841");
  path(c,[[x-65,y-106],[x+76,y-105],[x+92,y-77],[x+69,y-65],[x-72,y-67]],"#463e42");
  path(c,[[x-58,y-104],[x+68,y-103],[x+85,y-80],[x+68,y-74],[x-60,y-75]],"#a18a62");
  for(let j=0;j<5;j++)rect(c,x-39+j*21,y-94,14,5,"#cbb78a");
  rect(c,x+62,y-95,4,10,"#f3d8a7")
 }
 function brazier(c,o){
  const {x,y,r}=o;
  oval(c,x+2,y-10,r*.7,r*.23,"rgba(232,164,73,.11)");
  rect(c,x-9,y-72,18,61,"#47454c");
  path(c,[[x-r*.62,y-69],[x+r*.61,y-69],[x+r*.42,y-36],[x-r*.38,y-36]],"#363e45");
  path(c,[[x-r*.47,y-64],[x+r*.48,y-64],[x+r*.33,y-42],[x-r*.32,y-42]],"#997a5d");
  for(let i=0;i<5;i++){
   const xx=x+(i-2)*9,yy=y-66-(i%2)*11;
   path(c,[[xx-7,yy+9],[xx,yy-23],[xx+7,yy+9]],i%2?"#f4d391":"#df9459")
  }
  rect(c,x-14,y-29,28,5,"#c5a987")
 }
 function obelisk(c,o){
  const {x,y,r}=o;groundShadow(c,o,1.2);
  for(let i=0;i<3;i++){
   const spread=i*16;
   path(c,[[x-r+spread,y-i*15],[x+r-spread,y-i*15],[x+r-spread-8,y-i*15-14],[x-r+spread+7,y-i*15-14]],i%2?"#9da6a5":"#5f6b7b")
  }
  path(c,[[x-r*.38,y-32],[x-r*.31,y-r*2.3],[x,y-r*2.72],[x+r*.40,y-r*2.30],[x+r*.42,y-32]],"#465264");
  path(c,[[x-r*.32,y-35],[x-r*.27,y-r*2.28],[x,y-r*2.60],[x,y-34]],"#95a0af");
  path(c,[[x,y-r*2.60],[x+r*.36,y-r*2.28],[x+r*.37,y-35],[x,y-34]],"#677388");
  stroke(c,[x,y-r*1.8],[x-2,y-r*1.18],"#d6c8ba",5);
  rect(c,x-7,y-r*1.40,14,5,"#e3d3b8");
  for(let i=0;i<5;i++)rect(c,x-r*.25+i*11,y-42,7,4,"#dad8c8")
 }
 function wall(c,o){
  const {x,y,r}=o;groundShadow(c,o,1.2);
  const w=r*2.4;
  path(c,[[x-w*.53,y-25],[x-w*.46,y-83],[x+w*.54,y-84],
   [x+w*.59,y-22]],"#4a5562");
  rect(c,x-w*.48,y-78,w,62,"#858a91");
  for(let i=0;i<4;i++){
   const py=y-73+i*17;
   stroke(c,[x-w*.46,py],[x+w*.48,py],"#555e6b",4);
   for(let j=0;j<4;j++)rect(c,x-w*.39+j*w*.22+((i%2)*w*.11),py-12,5,11,"#b4b5b3")
  }
  for(let j=0;j<8;j++){
   const xx=x-w*.52+j*w*.14;
   rect(c,xx,y-99+(j%3===0?5:0),w*.11,21,j%3?"#9ca5aa":"#5d6773");
   rect(c,xx,y-103+(j%3===0?5:0),w*.11,5,"#d2d6d2")
  }
 }
 function ring(c,o){
  const {x,y,r}=o;groundShadow(c,o,.86);
  for(let i=0;i<16;i++){
   const a=i*TAU/16,px=x+Math.cos(a)*r*.85,py=y+Math.sin(a)*r*.33;
   rect(c,px-5,py-7,10,7,i%3?"#a6b9a1":"#e6dcac");
   if(i%3===0)rect(c,px-3,py-16,5,10,"#d5b5c8");
  }
  for(let i=0;i<7;i++)rect(c,x-34+i*11,y-8+(i%2)*5,5,5,"#b8c8ab")
 }
 function post(c,o){
  const {x,y}=o;groundShadow(c,o,.5);
  rect(c,x-12,y-112,25,111,"#514b47");
  rect(c,x-16,y-123,33,18,"#a29d8f");
  rect(c,x-8,y-120,16,12,"#f5d9a0");
  path(c,[[x-26,y-124],[x,y-153],[x+26,y-124]],"#374b59");
  rect(c,x-25,y-126,50,6,"#d8d8cb");
  // Mooring coil physically outside the bridge's tread.
  oval(c,x+38,y-10,25,12,"#786f60");
  oval(c,x+38,y-10,14,7,"#b5a58b")
 }
 const drawers={
  snow_cottage:house,forest_cottage:house,canvas_tent:tent,
  market_stall:stall,forge_stall:stall,well,
  woodpile,sign,brazier,obelisk,stone_wall:wall,mushroom_ring:ring,bridge_post:post
 };
 function draw(c,bounds,skip){
  let drawn=0;
  for(const o of built){
   if(skip?.(o))continue;
   if(o.x<bounds[0]-400||o.x>bounds[2]+400||o.y<bounds[1]-450||o.y>bounds[3]+360)continue;
   drawers[o.kind](c,o);drawn++
  }
  return drawn
 }
 function drawCliff(c,solid){
  if(solid.material!=="cliff-face"||!solid.polygon?.length)return false;
  const p=solid.polygon,xx=p.map(a=>a[0]),yy=p.map(a=>a[1]);
  const left=Math.min(...xx),right=Math.max(...xx),top=Math.min(...yy),bottom=Math.max(...yy);
  const w=right-left,h=bottom-top,step=Math.max(60,Math.min(138,w/24));
  path(c,p,"#3b4859");
  c.save();c.beginPath();p.forEach((pt,i)=>i?c.lineTo(...pt):c.moveTo(...pt));c.closePath();c.clip();
  // Deep face built in stone strata, shadowed lower edges and cold upper lips.
  for(let y=top;y<bottom+step;y+=step*.5){
   const row=Math.floor((y-top)/step);
   for(let x=left+(row%2)*step*.46;x<right+step;x+=step){
    const j=rnd(Math.floor(x/step),Math.floor(y/step),177),ww=step*(.7+j*.22);
    rect(c,x,y,ww,step*.32,j>.65?"#7b8490":j>.38?"#626d7e":"#505d6e");
    rect(c,x+5,y+4,ww*.68,4,"rgba(207,213,208,.27)");
    rect(c,x+ww*.48,y+step*.17,8,step*.16,"#3c4758");
   }
  }
  // Horizontal joint lines are stepped, not shiny plastic tubes.
  for(let y=top+step*.36;y<bottom;y+=step*.9){
   const offset=(rnd(Math.floor(left/step),Math.floor(y/step),193)-.5)*22;
   rect(c,left+offset,y,w+32,6,"rgba(23,34,49,.49)")
  }
  for(let i=0;i<18;i++){
   const x=left+rnd(i,77,3)*w,y=top+rnd(i,93,11)*h;
   stroke(c,[x,y],[x+13+rnd(i,13)*18,y+29+rnd(i,44)*25],"#363f50",4)
  }
  c.restore();
  stroke(c,[left,top+9],[right,top+12],"#b5bbc1",12);
  stroke(c,[left,top+1],[right,top+4],"#e1e4db",5);
  return true
 }
 const kinds={};
 for(const o of built)kinds[o.kind]=(kinds[o.kind]||0)+1;
 function stats(){return{version:VERSION,placed:built.length,rejected:rejected.length,kinds,
  collision:"source-filtered house footprints and solid ground props",sourceAnchors:[...new Set(built.map(o=>o.anchor))].length,
  routesMutated:false,creatorAccepted:false}}
 return{version:VERSION,draw,drawCliff,blocked:collision,objects:built,stats};
}
window.VeilwardSetpieces={version:VERSION,create};
})();