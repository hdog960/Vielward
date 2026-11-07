/* VEILWARD Phase 9 R13 — four original 256px winter architecture designs.
 * Generated once into raster source atlases; never a cropped backdrop.
 * Art unapproved; geometry and save data untouched.
 */
(function(){
"use strict";
const SZ=256,NUM=4;let atlas=null;
const P={ink:"#26303d",shadow:"#354457",slate:"#566e83",blue:"#8299a9",frost:"#c2d4e0",snow:"#e7edf0",bright:"#faf6ef",rock:"#576a78",rockLite:"#adbac8",wood:"#7f5d49",woodLite:"#b38d6d",woodDark:"#392f35",gold:"#edb96f",shine:"#ffe6a7"};
function hash(x,y,s=0){let n=Math.imul(x+113,374761393)^Math.imul(y+19,668265263)^Math.imul(s+1,1442695041);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function shape(c,a,col){c.beginPath();a.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y)));c.closePath();c.fillStyle=col;c.fill()}
function line(c,a,col,w=2){c.beginPath();a.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y)));c.lineWidth=w;c.strokeStyle=col;c.lineJoin="bevel";c.stroke()}
function grain(c,polygon,seed,palette,step=4){
 c.save();c.beginPath();polygon.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.clip();
 const xs=polygon.map(p=>p[0]),ys=polygon.map(p=>p[1]);
 for(let y=Math.max(0,Math.floor(Math.min(...ys)));y<Math.min(256,Math.ceil(Math.max(...ys)));y+=step)
  for(let x=Math.max(0,Math.floor(Math.min(...xs)));x<Math.min(256,Math.ceil(Math.max(...xs)));x+=step){
   const a=hash(x,y,seed),b=hash(y,x,seed+11);
   if(a<.32)continue;
   rect(c,x+(a>.8?2:0),y+(b>.8?1:0),a>.94?4:a>.55?2:1,b>.65?2:1,palette[Math.floor(b*palette.length)])
  }
 c.restore()
}
function snow(c,edge,seed,depth=6){
 const bottom=edge.slice().reverse().map(([x,y],i)=>[x+(i%2?-1:1),y+depth+Math.sin(i*5+seed)*2]);
 shape(c,[...edge,...bottom],P.frost);line(c,edge,P.bright,3);
 for(let i=1;i<edge.length;i++){
  const a=edge[i-1],b=edge[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);
  for(let d=8;d<len;d+=18){
   const t=d/len,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;
   if(hash(d,i,seed)>.42){rect(c,x,y,3,4+Math.round(hash(i,d,seed)*7),P.snow);rect(c,x+2,y+5,2,2,P.frost)}
  }
 }
}
function drawWindow(c,x,y,w=24,h=22,seed=0){
 rect(c,x-6,y-7,w+12,h+14,P.woodDark);rect(c,x-4,y-5,w+8,h+8,P.woodLite);
 rect(c,x,y,w,h,"#9e674c");rect(c,x+3,y+3,w-6,h-6,P.gold);
 rect(c,x+4,y+4,Math.round(w*.43),h-8,P.shine);
 rect(c,x+w*.45,y+2,4,h-4,P.woodDark);rect(c,x+3,y+h*.50,w-6,3,P.woodDark);
 rect(c,x-8,y+h+4,w+16,5,P.rockLite);snow(c,[[x-8,y+h+4],[x+w+8,y+h+4]],seed,3);
}
function door(c,x,y,type){
 rect(c,x-8,y-7,39,59,P.ink);rect(c,x-4,y-4,32,55,P.rockLite);
 rect(c,x,y,25,51,P.woodDark);
 for(let i=0;i<4;i++)rect(c,x+2+i*6,y+3,2,45,i%2?P.wood:P.woodLite);
 for(let i=0;i<2;i++)rect(c,x,y+10+i*27,25,4,"#4b4142");
 rect(c,x+19,y+30,4,4,P.gold);
 line(c,[[x-11,y+49],[x+35,y+49]],P.rock,5);
 for(let i=0;i<3;i++)line(c,[[x-20-i*3,y+55+i*6],[x+40+i*3,y+55+i*6]],i%2?P.frost:P.rockLite,5);
 if(type!==2){
  rect(c,x+31,y-22,4,20,P.woodDark);rect(c,x+28,y-23,12,13,P.ink);
  rect(c,x+30,y-19,8,8,P.gold);rect(c,x+32,y-18,4,5,P.shine);
  rect(c,x+27,y-25,14,3,P.rockLite)
 }
}
function house(c,type){
 const roof=["#5e7187","#4a6076","#687889","#4b5b6f"][type],
  roofDark=["#34475b","#304256","#405065","#2b3c4e"][type],s=type*41+7;
 c.clearRect(0,0,256,256);
 // Original 3/4 stone foundation and unified contact shadow.
 shape(c,[[17,208],[130,253],[245,209],[135,238]],"rgba(24,40,57,.29)");
 shape(c,[[19,212],[130,248],[234,210],[133,234]],"rgba(105,133,159,.25)");
 const baseA=[[22,169],[133,199],[128,236],[22,204]],
  baseB=[[133,199],[232,150],[232,204],[128,236]];
 shape(c,baseA,P.rock);shape(c,baseB,"#7b8d9c");
 grain(c,baseA,s,[P.rockLite,P.shadow,"#9aabb8"],5);
 grain(c,baseB,s+1,[P.rock,"#b2c0c9",P.shadow],5);
 // Log-built facades; orientation and stonework share the same footprint.
 const wallA=[[25,125],[133,166],[130,220],[25,186]],
  wallB=[[133,166],[231,120],[229,191],[130,220]];
 shape(c,wallA,"#4e4041");shape(c,wallB,["#75553e","#695147","#986848","#6f5847"][type]);
 grain(c,wallA,s+3,[P.woodLite,P.wood,P.woodDark],4);
 grain(c,wallB,s+9,[P.woodDark,"#b58c65","#9d7861"],4);
 for(let y=141;y<197;y+=10){
  const end=133-(y-141)*.12;
  line(c,[[26,y],[end,y+29]],"#392e34",3);
  line(c,[[30,y+2],[end-7,y+29]],"#a17c63",1)
 }
 for(let y=157;y<214;y+=11){
  const end=222-(y-157)*.20;
  line(c,[[133,y+19],[end,y-23]],"#463b3b",3);
  line(c,[[137,y+16],[end-4,y-24]],"#bd9474",1)
 }
 for(const [x,y,w,h] of [[25,120,7,67],[119,156,8,61],[220,121,9,69]]){
  rect(c,x,y,w,h,P.woodDark);rect(c,x+2,y+1,2,h-3,P.woodLite)
 }
 drawWindow(c,58,166,type===1?25:23,22,s);
 if(type!==1)drawWindow(c,89,177,18,17,s+2);
 if(type%2===0)drawWindow(c,185,145,19,20,s+4);
 door(c,153,181,type);
 // Four distinct pitched roofs use large sprites, never mirrored 96px decals.
 const left=[[11,136],[89,52],[184,27],[107,113]],
  right=[[89,52],[149,173],[247,126],[184,27]];
 shape(c,left,roofDark);shape(c,right,roof);
 grain(c,left,s+11,["#72879b","#36495a","#859cad","#596e7f"],3);
 grain(c,right,s+13,["#33495e","#8295a5","#9bafc1","#4d6177"],3);
 c.save();c.beginPath();right.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.clip();
 for(let row=0;row<10;row++){
  const t=(row+.3)/10,ax=91+58*t,ay=53+120*t,bx=184+63*t,by=27+99*t;
  for(let col=0;col<11;col++){
   const u=(col+(row%2)*.5)/11,x=ax+(bx-ax)*u,y=ay+(by-ay)*u,h=hash(col,row,s);
   line(c,[[x+1,y],[x+7,y-1]],h>.68?"#b7c5cb":"#35495c",1);
   if(h>.50)rect(c,x+1,y+2,2,2,h>.8?P.frost:"#829eb1")
  }
 }
 c.restore();
 c.save();c.beginPath();left.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.clip();
 for(let row=0;row<13;row++)for(let col=0;col<6;col++){
  const x=17+col*17+row*5,y=132-row*7.2-col*4.8,h=hash(col,row,s+25);
  if(h>.32){rect(c,x,y,8,3,h>.7?"#7d94a6":"#314658");rect(c,x+2,y+1,2,1,P.frost)}
 }
 c.restore();
 snow(c,[[11,133],[32,119],[54,103],[73,86],[90,63],[108,67]],s,5);
 snow(c,[[91,54],[111,43],[139,36],[162,32],[184,28]],s+4,7);
 snow(c,[[148,171],[179,158],[210,145],[245,125]],s+7,9);
 if(type!==1){
  const chimney=[[171,49],[182,44],[184,16],[198,12],[208,17],[208,55],[192,61]];
  shape(c,chimney,P.rock);
  grain(c,chimney,s+77,[P.rockLite,"#455969","#b0c2d0"],3);
  shape(c,[[181,16],[198,10],[211,16],[200,21],[180,22]],P.snow);
  line(c,[[181,15],[199,10],[211,15]],P.bright,3);
  rect(c,190,28,4,4,P.ink)
 }else{
  shape(c,[[188,49],[197,45],[202,16],[214,17],[211,51],[199,57]],P.rockLite);
  snow(c,[[198,16],[212,15]],s+5,4)
 }
 if(type!==2){
  shape(c,[[143,176],[172,157],[208,166],[180,186]],P.woodDark);
  shape(c,[[143,173],[172,153],[208,162],[180,183]],P.blue);
  snow(c,[[145,171],[171,152],[208,161]],s+33,4);
  rect(c,148,185,5,35,P.woodDark);rect(c,198,181,5,34,P.woodDark)
 }
 if(type===2){
  rect(c,211,136,7,45,P.ink);rect(c,207,147,17,14,"#a17c52");
  rect(c,211,148,9,8,P.gold);line(c,[[213,161],[217,180]],P.woodDark,3)
 }else if(type===3){
  shape(c,[[37,155],[48,159],[48,182],[42,188],[37,179]],"#486689");
  rect(c,41,161,3,13,"#d2bf83")
 }
 line(c,[[13,137],[90,52],[183,28]],P.bright,2);
 line(c,[[90,52],[149,173],[244,126]],P.ink,3);
 rect(c,28,189,39,3,P.rockLite);rect(c,29,188,22,2,P.frost)
}
function load(){
 if(atlas)return atlas;
 if(typeof document==="undefined"||!document.createElement)return null;
 const can=document.createElement("canvas");can.width=SZ*NUM;can.height=SZ;
 const c=can.getContext("2d");if(!c)return null;
 c.imageSmoothingEnabled=false;
 for(let i=0;i<NUM;i++){c.save();c.translate(i*SZ,0);house(c,i);c.restore()}
 atlas=can;return atlas
}
function stamp(ctx,variant,x,y,w,h,flip=false,alpha=1){
 if(!ctx?.drawImage||!load())return false;
 const i=((variant|0)%NUM+NUM)%NUM,ww=Math.round(w),hh=Math.round(h);
 ctx.save();ctx.imageSmoothingEnabled=false;
 ctx.globalAlpha=(typeof ctx.globalAlpha==="number"?ctx.globalAlpha:1)*alpha;
 if(flip){ctx.translate(Math.round(x),0);ctx.scale(-1,1);
  ctx.drawImage(atlas,i*SZ,0,SZ,SZ,Math.round(-ww/2),Math.round(y-hh),ww,hh)
 }else ctx.drawImage(atlas,i*SZ,0,SZ,SZ,Math.round(x-ww/2),Math.round(y-hh),ww,hh);
 ctx.restore();return true
}
window.VeilwardArchitectureAtlas={load,stamp,version:"1.3.19",sourceSize:SZ,count:NUM,get ready(){return !!atlas}};
})();