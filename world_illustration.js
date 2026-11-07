/* VEILWARD VISUAL RECOVERY R1 — source-anchored illustrated outdoor props.
 * No fake background screenshot. Every major tree, building, boulder and monument
 * is drawn in world space from the real collision / footprint assets. Art only:
 * movement, map, saves, road links and collision are not changed.
 */
(function(){
"use strict";
const V="1.3.19",PI=Math.PI;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
function hash(a,b,c=0){let n=Math.imul(a|0,374761393)^Math.imul(b|0,668265263)^Math.imul(c|0,1442695041);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
function rect(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function poly(ctx,pts,col){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=col;ctx.fill()}
function oval(ctx,x,y,rx,ry,col){ctx.save();ctx.translate(x,y);ctx.scale(Math.max(1,rx),Math.max(1,ry));ctx.beginPath();ctx.arc(0,0,1,0,PI*2);ctx.fillStyle=col;ctx.fill();ctx.restore()}
function line(ctx,a,b,color,w){ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineWidth=w;ctx.strokeStyle=color;ctx.stroke()}
function inView(x,y,b,pad=400){return x>b[0]-pad&&x<b[2]+pad&&y>b[1]-pad&&y<b[3]+pad}
function create(model,geometry,options={}){
 const footprint=options.footprint,climate=options.climate,setpieces=options.setpieces||null,raster=options.raster||null,unit=model.worldDesign.worldUnitScale;
 if(!footprint||!climate||!geometry?.roads)throw Error("Illustrated environment requires the actual land, climate and solid sources");
 const anchors=Object.fromEntries(model.nodes.map(n=>[n.id,n.point.map(q=>q*unit)]));
 const hubs=footprint.source.hubs.map(h=>({...h,x:anchors[h.anchor][0],y:anchors[h.anchor][1],r:h.radius*unit}));
 const solidById=new Map(geometry.solids.map(s=>[s.id,s]));
 function lightSnow(x,y){return climate.sample(x,y).snow}
 function shadow(ctx,x,y,rx,ry){oval(ctx,x+15,y+13,rx,ry,"rgba(20,30,48,.31)")}
 function bough(ctx,x,y,w,dy,level,snow,seed){
  // Jagged tiered silhouette with an interior dark face and staggered needles.
  const base=y+dy,reach=w;
  poly(ctx,[[x,base-level],[x-reach*.36,base-level*.45],[x-reach,base],[x+reach,base],[x+reach*.32,base-level*.46]],"#263f4c");
  poly(ctx,[[x,base-level*.94],[x-reach*.28,base-level*.43],[x-reach*.80,base-6],[x+reach*.62,base-5],[x+reach*.28,base-level*.5]],seed%2?"#385967":"#426770");
  poly(ctx,[[x-reach*.82,base-8],[x-reach*.68,base-19],[x-reach*.29,base-24],[x,base-19],
   [x+reach*.4,base-23],[x+reach*.70,base-6],[x+reach*.42,base-10],[x-reach*.42,base-10]],
   snow>.36?"#879eaa":"#557a73");
  if(snow>.13){
   const mix=clamp(snow);
   for(let i=0;i<5;i++){
    const q=hash(seed,i,77);if(q>mix*.95)continue;
    const xx=x-reach*.72+i*reach*.33,yy=base-15-(i%2)*9;
    poly(ctx,[[xx-14,yy+5],[xx-5,yy-5],[xx+11,yy],[xx+20,yy+6]],
     mix>.60?"#d9e6e7":"#b4c9c9");
    rect(ctx,xx+2,yy+4,8,4,"#f1f2ed")
   }
  }else{
   for(let i=0;i<6;i++){
    const xx=x-reach*.72+i*reach*.27,yy=base-17+(i%2)*5;
    rect(ctx,xx,yy,15,5,i%2?"#719480":"#5a8076")
   }
  }
 }
 function pine(ctx,o){
  const x=o.x,y=o.y,r=o.radius,seed=Math.floor(o.variant*1024),snow=typeof o.snow==="number"?o.snow:lightSnow(x,y);
  const height=r*3.5;
  shadow(ctx,x,y,r*1.25,r*.35);
  // Roots grow from the exact collider footpoint.
  poly(ctx,[[x-r*.21,y],[x-r*.24,y-height*.35],[x+r*.18,y-height*.43],[x+r*.25,y]],"#493d3c");
  rect(ctx,x-7,y-r*.6,r*.10,r*.6,"#987d69");
  for(let k=0;k<6;k++){
   const yy=y-height*.28-k*height*.12;
   bough(ctx,x+(hash(seed,k,31)-.5)*r*.09,yy,r*(1.18-k*.125),r*.45,r*.56,snow,seed+k)
  }
  // Soft upper ridge and glistening snow on the highest crown.
  poly(ctx,[[x-9,y-height*.96],[x,y-height*1.09],[x+10,y-height*.95]],snow>.33?"#e2e9e7":"#81a7a1");
  rect(ctx,x+13,y-height*.77,r*.12,5,snow>.4?"#ecf2ed":"#789d94")
 }
 function oak(ctx,o){
  const x=o.x,y=o.y,r=o.radius,snow=o.snow??lightSnow(x,y),seed=Math.floor(o.variant*997);
  shadow(ctx,x,y,r*1.25,r*.35);
  const treeY=y-r*.72;
  poly(ctx,[[x-r*.17,y],[x-r*.18,treeY-15],[x-r*.43,treeY-r*.65],[x-r*.20,treeY-r*.8],[x+8,treeY-r*.36],[x+r*.36,treeY-r*.75],[x+r*.43,treeY-r*.64],[x+r*.16,treeY-15],[x+r*.19,y]],"#55443f");
  line(ctx,[x,treeY],[x-r*.50,treeY-r*.90],"#86725e",8);
  line(ctx,[x,treeY],[x+r*.60,treeY-r*.95],"#86725e",7);
  const cold=snow>.42;
  for(let i=0;i<11;i++){
   const a=(i/11)*PI*2,s=hash(seed,i,7);
   const xx=x+Math.cos(a)*r*(.56+s*.3),yy=y-r*1.95+Math.sin(a)*r*(.52+s*.25);
   oval(ctx,xx+5,yy+11,r*(.54+s*.14),r*.35,cold?"#536875":"#2e574c");
   oval(ctx,xx,yy,r*(.53+s*.14),r*.32,cold?(i%3?"#7c9294":"#8da3a7"):
       (i%3?"#567e5d":"#6b9067"));
   if(i%2===0){
    poly(ctx,[[xx-r*.29,yy-9],[xx-r*.02,yy-21],[xx+r*.37,yy-6],[xx+r*.15,yy+1]],
     cold?"#c7d4d3":"#a0af7d")
   }
  }
  for(let i=0;i<8;i++){
   const xx=x+(hash(seed,i,43)-.5)*r*1.55,yy=y-r*1.90+(hash(seed,i,15)-.5)*r*.85;
   rect(ctx,xx,yy,12,5,cold?"#d9e2df":"#b4bd8d")
  }
 }
 function rock(ctx,o){
  const x=o.x,y=o.y,r=o.radius,seed=Math.floor(o.variant*1000),snow=o.snow??lightSnow(x,y);
  shadow(ctx,x,y,r*1.16,r*.28);
  const c=o.kind==="ruin"?"#777487":o.kind==="crystal"?"#635c83":"#646f80";
  if(o.kind==="crystal"){
   poly(ctx,[[x-r*.55,y-2],[x-r*.25,y-r*1.8],[x+r*.16,y-r*1.5],[x+r*.5,y-12],[x+r*.26,y+7]],"#4a456f");
   poly(ctx,[[x-r*.15,y-13],[x-r*.20,y-r*1.55],[x+r*.12,y-r*1.22],[x+r*.17,y-4]],"#9a9bc1");
   line(ctx,[x-r*.12,y-r*1.5],[x+r*.13,y-r*1.25],"#d3d6dc",5);
   return
  }
  poly(ctx,[[x-r,y-10],[x-r*.80,y-r*.56],[x-r*.34,y-r*.93],[x+r*.32,y-r*.78],
    [x+r*.89,y-r*.35],[x+r,y+3],[x+r*.65,y+r*.22],[x-r*.61,y+r*.18]],"#394555");
  poly(ctx,[[x-r*.86,y-r*.54],[x-r*.33,y-r*.95],[x+r*.32,y-r*.78],
    [x+r*.87,y-r*.34],[x+r*.55,y-7],[x-r*.55,y-13]],c);
  poly(ctx,[[x-r*.86,y-r*.54],[x-r*.33,y-r*.95],[x+r*.17,y-r*.87],[x-r*.05,y-r*.58],[x-r*.55,y-r*.42]],"#a0a7b2");
  poly(ctx,[[x+r*.2,y-r*.72],[x+r*.84,y-r*.32],[x+r*.58,y-7],[x+r*.17,y-17]],"#83889a");
  for(let k=0;k<3;k++){
   const px=x-r*.49+k*r*.45,py=y-r*.38+(k%2)*r*.13;
   line(ctx,[px,py],[px+16,py+6],"#435565",4)
  }
  if(snow>.15){
   poly(ctx,[[x-r*.63,y-r*.58],[x-r*.31,y-r*.97],[x+r*.04,y-r*.88],[x+r*.3,y-r*.66],[x-r*.12,y-r*.57]],
    snow>.65?"#e1e8e7":"#b9c9c8");
  }else{
   for(let i=0;i<5;i++)rect(ctx,x-r*.58+i*r*.23,y-6-i%2*5,10,5,"#8c9c7a")
  }
  if(o.kind==="cairn"||o.kind==="ruin"){
   rect(ctx,x-19,y-r*1.26,36,25,"#5c6473");rect(ctx,x-16,y-r*1.29,31,8,"#bbc4c2")
  }
 }
 function shrubs(ctx,o){
  const x=o.x,y=o.y,r=o.radius,kind=o.kind,snow=o.snow??lightSnow(x,y),seed=Math.floor(o.variant*10000);
  for(let i=0;i<14;i++){
   const px=x+(hash(seed,i,3)-.5)*r*1.5,py=y+(hash(seed,i,17)-.5)*r*.65;
   const v=hash(seed,i,9),h=14+v*19;
   line(ctx,[px,py],[px+3,py-h],kind==="reeds"?"#657f79":snow>.5?"#73848c":"#587760",2.5);
   if(kind==="flowerbed"){
    rect(ctx,px-3,py-h-3,7,7,i%4===0?"#d9c4d6":i%3===0?"#dfddbd":"#b8b4d1")
   }else if(kind==="scrub"){
    rect(ctx,px-5,py-h*.6,13,7,snow>.55?"#d9dfd9":"#83a07e")
   }else if(kind==="reeds")rect(ctx,px+1,py-h,3,7,"#ccb98a");
  }
 }
 function log(ctx,o){
  const x=o.x,y=o.y,r=o.radius;shadow(ctx,x,y,r,10);
  poly(ctx,[[x-r,y-19],[x+r*.8,y-38],[x+r,y-22],[x-r*.8,y-3]],"#493a3b");
  poly(ctx,[[x-r,y-28],[x+r*.8,y-43],[x+r*.86,y-31],[x-r*.9,y-14]],"#91775f");
  oval(ctx,x-r*.82,y-21,10,14,"#c3a384");oval(ctx,x-r*.82,y-21,5,8,"#5f4b43");
  for(let i=0;i<5;i++)line(ctx,[x-r*.65+i*r*.34,y-27-i*2],[x-r*.63+i*r*.34,y-22-i*2],"#b99a79",3)
 }
 function drawFeature(ctx,o){
  if(raster?.drawFeature(ctx,o))return;
  switch(o.kind){
   case "pine":pine(ctx,o);break;
   case "oak":oak(ctx,o);break;
   case "flowerbed":case "scrub":case "reeds":shrubs(ctx,o);break;
   case "fallenlog":log(ctx,o);break;
   default:rock(ctx,o);
  }
 }
 function drawGround(ctx,b){
  // Locally-authored surface brush. Avoid the old evenly peppered 32px
  // confetti pattern: no per-tile random material changes and very few white
  // speckles. Fern, meadow and snowbank shapes have a consistent light source.
  const cell=112;
  for(let iy=Math.floor(b[1]/cell)-1;iy<=Math.ceil(b[3]/cell);iy++)
   for(let ix=Math.floor(b[0]/cell)-1;ix<=Math.ceil(b[2]/cell);ix++){
    const x=ix*cell+hash(ix,iy,1)*cell;
    const y=iy*cell+hash(ix,iy,2)*cell;
    if(!footprint.onLand(x,y)||geometry.waterAt(x,y,0)||raster?.covers(x,y))continue;
    const c=climate.sample(x,y),n=hash(ix,iy,52);
    const size=24+hash(ix,iy,26)*25;
    if(c.snow>.52){
     if(n>.62){
      // Blue undercut beneath a continuous creamy overhanging snow bank.
      poly(ctx,[[x-size,y+2],[x-size*.72,y-11],[x-size*.19,y-16],[x+size*.43,y-11],
       [x+size,y+3],[x+size*.71,y+12],[x-size*.67,y+11]],"rgba(73,106,139,.20)");
      poly(ctx,[[x-size,y-3],[x-size*.73,y-16],[x-size*.2,y-22],[x+size*.39,y-15],
       [x+size*.83,y-2],[x+size*.35,y+4],[x-size*.63,y+2]],"rgba(230,237,235,.45)");
      rect(ctx,x-size*.46,y-16,size*.78,4,"rgba(250,246,230,.39)")
     }else if(n>.43){
      // Wind-bent grass silhouettes emerging through the snow.
      for(let k=0;k<3;k++){
       const px=x+(k-1)*12;
       line(ctx,[px,y],[px-4,y-14-k*2],"rgba(91,117,123,.25)",2)
      }
     }
    }else if(c.wet>.70){
     if(n>.16){
      oval(ctx,x,y,size*.58,size*.20,"rgba(37,81,84,.20)");
      for(let k=0;k<5;k++){
       const px=x+(k-2)*9;
       line(ctx,[px,y+3],[px+3,y-22-k%2*5],"rgba(120,153,128,.45)",3);
       if(k%2===0)rect(ctx,px+3,y-21,4,8,"rgba(179,174,113,.42)")
      }
     }
    }else{
     if(n>.12){
      const meadow=c.meadow>.55;
      const tall=meadow?18:28;
      for(let k=0;k<7;k++){
       const xx=x+(hash(ix+k,iy,33)-.5)*size*1.9;
       const yy=y+(hash(ix,iy+k,49)-.5)*size*.95;
       const h=tall*(.55+hash(k,ix,28)*.64);
       line(ctx,[xx,yy+2],[xx-6,yy-h*.8],meadow?"rgba(83,111,76,.45)":"rgba(42,92,71,.43)",2.4);
       line(ctx,[xx,yy],[xx+5,yy-h],meadow?"rgba(191,187,118,.52)":"rgba(119,159,107,.44)",2.2)
      }
     }
     if(n>.78){
      for(let k=0;k<5;k++){
       const px=x+(k-2)*13,py=y-(k%2)*10;
       rect(ctx,px,py-14,5,7,k%3===0?"#d8b6d0":k%3===1?"#f0deb0":"#c7d0e0");
       rect(ctx,px+1,py-10,3,3,"#f1edc7")
      }
     }
    }
   }
 }
 function cottage(ctx,h,solid){
  if(!solid?.polygon)return;
  const pts=solid.polygon,xx=pts.map(p=>p[0]),yy=pts.map(p=>p[1]);
  const x=Math.min(...xx),y=Math.min(...yy),w=Math.max(...xx)-x,d=Math.max(...yy)-y;
  // Three-quarter architecture: pitched roof, eaves and front facade separate
  // planes from the same physical building footprint, never a flat rectangle.
  shadow(ctx,x+w*.56,y+d*.84,w*.6,d*.34);
  poly(ctx,[[x+2,y+d*.12],[x+w*.56,y-d*.20],[x+w+5,y+d*.14],[x+w+5,y+d*.87],[x+w*.5,y+d*1.03],[x+2,y+d*.78]],"#3d3e4e");
  poly(ctx,[[x+w*.5,y+d*.37],[x+w+5,y+d*.19],[x+w+4,y+d*.85],[x+w*.5,y+d]],"#655447");
  poly(ctx,[[x+7,y+d*.34],[x+w*.5,y+d*.44],[x+w*.5,y+d],[x+7,y+d*.80]],"#685448");
  for(let i=0;i<8;i++){
   const bx=x+12+i*(w*.45/8);
   line(ctx,[bx,y+d*.42+i*.12],[bx,y+d*.84+i*.12],"#443d43",4)
  }
  // The gable roof has a sloped tile plane and snowy broken silhouette.
  poly(ctx,[[x-44,y+d*.34],[x+w*.45,y-d*.54],[x+w+58,y+d*.14],[x+w*.56,y+d*.47]],"#283b52");
  poly(ctx,[[x-38,y+d*.29],[x+w*.45,y-d*.49],[x+w+39,y+d*.15],[x+w*.54,y+d*.42]],"#526079");
  for(let row=0;row<7;row++)for(let col=0;col<8;col++){
   const rx=x+w*.45+(col-4)*(w*.15),ry=y-d*.48+row*d*.13+Math.abs(col-4)*d*.07;
   rect(ctx,rx,ry,Math.max(12,w*.115),7,(col+row)%3?"#8a97a9":"#bac9d0")
  }
  poly(ctx,[[x-33,y+d*.21],[x+w*.45,y-d*.49],[x+w+32,y+d*.13],[x+w*.56,y+d*.28],
   [x+w*.40,y-d*.16],[x+w*.19,y+d*.04]],"rgba(224,235,234,.65)");
  poly(ctx,[[x+w*.48,y+d*.49],[x+w*.63,y+d*.43],[x+w*.63,y+d*.98],[x+w*.48,y+d*1.03]],"#2b3038");
  rect(ctx,x+w*.52,y+d*.69,8,11,"#c6a874");
  for(const part of [.18,.78]){
   rect(ctx,x+w*part-2,y+d*.58,w*.13,d*.16,"#332d35");
   rect(ctx,x+w*part,y+d*.60,w*.11,d*.13,"#dfac62");
   rect(ctx,x+w*part+5,y+d*.63,w*.07,d*.06,"#f8d48a")
  }
  rect(ctx,x+w*.71,y-d*.53,w*.11,d*.46,"#5f5460");
  rect(ctx,x+w*.695,y-d*.56,w*.14,12,"#d8e2e1");
  // Lit doorway steps and physical-foot entry.
  for(let i=0;i<4;i++){
   const sy=y+d*.93+i*15;
   poly(ctx,[[x+w*.46-i*8,sy],[x+w*.61+i*9,sy],[x+w*.64+i*11,sy+8],[x+w*.44-i*10,sy+8]],
    i%2?"#8993a0":"#c2c6c5")
  }
 }
 function marker(ctx,h){
  const {x,y}=h,kind=h.kind;
  const c=climate.sample(x,y),snow=c.snow>.4;
  if(kind==="settlement"){
   // Real packed-stone snowbound crossroads; leave the usable footpoint clear.
   for(let i=0;i<12;i++){
    const theta=i*PI/6,rad=h.r*.37;
    const px=x+Math.cos(theta)*rad,py=y+Math.sin(theta)*rad*.7;
    rect(ctx,px,py,23,6,snow?"#e9eee7":"#9ca78a")
   }
   for(const side of [-1,1]){
    const px=x+side*h.r*.48,py=y+h.r*.14;
    rect(ctx,px,py-125,12,128,"#514743");
    poly(ctx,[[px-16,py-124],[px+8,py-139],[px+30,py-124],[px+14,py-113]],"#333c4a");
    rect(ctx,px-8,py-116,35,21,"#d9a46a");
    rect(ctx,px+2,py-113,11,14,"#f9dea1");
    oval(ctx,px,py-96,80,55,"rgba(232,174,90,.10)");
   }
  }else if(kind==="monument"||kind==="sanctuary"||kind==="arcane"){
   // Elevated plinths and carved standing stones, beyond the clear central path.
   const tones=kind==="arcane"?["#51445f","#9e91b0","#ded3e6"]:["#414e63","#8a96a7","#dfe6e5"];
   for(let i=0;i<9;i++){
    const angle=PI*2*i/9,px=x+Math.cos(angle)*h.r*.39,py=y+Math.sin(angle)*h.r*.25;
    const base=18+(i%3)*8;
    poly(ctx,[[px-17,py],[px-18,py-base-32],[px,py-base-56],[px+20,py-base-32],[px+18,py]],tones[0]);
    poly(ctx,[[px-14,py-base-32],[px,py-base-52],[px+3,py-base-18],[px-14,py-7]],tones[1]);
    rect(ctx,px-6,py-base-23,11,7,tones[2])
   }
  }else if(kind==="clearing"){
   for(let i=0;i<32;i++){
    const angle=i*PI*2/32,r=h.r*.46*(.8+hash(i,3,4)*.23);
    const xx=x+Math.cos(angle)*r,yy=y+Math.sin(angle)*r*.62;
    rect(ctx,xx,yy,10,7,i%3===0?"#dcc2d3":i%3===1?"#e1dda8":"#9aad83")
   }
  }else if(kind==="camp"||kind==="market"){
   // Intentionally placed shallow ground prop, warm centre.
   const yy=y+h.r*.18;
   oval(ctx,x,yy,76,31,"rgba(21,34,42,.37)");
   for(let i=0;i<9;i++){
    const a=i*PI*2/9,px=x+Math.cos(a)*56,py=yy+Math.sin(a)*27;
    rect(ctx,px,py,20,10,"#8a8b83")
   }
   poly(ctx,[[x-22,yy],[x-7,yy-49],[x+8,yy-20],[x+24,yy-40],[x+30,yy]],
    "#d68a4d");
   poly(ctx,[[x-9,yy],[x+1,yy-30],[x+9,yy-7],[x+18,yy]],"#f6d998");
  }else if(kind==="watchtower"||kind==="lookout"){
   for(let i=0;i<5;i++){
    const xx=x-160+i*80,yy=y-160+(i%2)*15;
    poly(ctx,[[xx-28,yy],[xx-25,yy-74],[xx+22,yy-86],[xx+37,yy-11],[xx+21,yy]],"#4a5061");
    poly(ctx,[[xx-24,yy-72],[xx+20,yy-84],[xx+31,yy-62],[xx-17,yy-48]],"#a2a7af");
    rect(ctx,xx-21,yy-77,40,7,"#d0d6d4")
   }
  }else if(kind==="cave"){
   oval(ctx,x,y-89,200,130,"#41465b");
   oval(ctx,x,y-83,124,87,"#101f2f");
   for(let i=0;i<8;i++){
    const xx=x-172+i*48;
    poly(ctx,[[xx-24,y-132],[xx,y-176-(i%2)*15],[xx+29,y-122]],"#73798a")
   }
  }else if(kind==="lodge"||kind==="hermit"){
   // Small deep woods refuge offset above the safe node.
   const yy=y-165;
   poly(ctx,[[x-116,yy-20],[x+111,yy-20],[x+103,yy+91],[x-119,yy+91]],"#54483f");
   poly(ctx,[[x-151,yy-15],[x,yy-154],[x+144,yy-16],[x,yy+8]],kind==="lodge"?"#53677a":"#516654");
   poly(ctx,[[x-143,yy-16],[x,yy-152],[x+130,yy-20],[x,yy-4]],snow?"#d0dbdd":"#78947a");
   rect(ctx,x-21,yy+34,41,55,"#28353b");rect(ctx,x+61,yy+15,24,22,"#f0bd77")
  }
 }
 function drawFeatures(ctx,bounds,skipWinter=false){
  // Both sparse mature props and the new collision-backed young woodland
  // share one painter's order and the same physical root coordinates.
  const features=[...footprint.cells(bounds,330),...footprint.groves(bounds,320)]
   .sort((a,b)=>a.y-b.y);
  for(const f of features){
   if(skipWinter&&raster?.covers(f.x,f.y))continue;
   drawFeature(ctx,f)
  }
  for(const h of hubs)if(inView(h.x,h.y,bounds,h.r+460)){
   if(skipWinter&&raster?.covers(h.x,h.y))continue;
   if(raster?.drawHub(ctx,h))continue;
   // The new detailed Coldpine cottage supersedes the old schematic lodge;
   // never paint two mutually incompatible buildings on one footprint.
   if(h.kind==="lodge"&&setpieces?.objects.some(o=>o.anchor==="colp_lodge"&&o.kind==="snow_cottage"))continue;
   if(h.kind==="smithy")cottage(ctx,h,solidById.get(h.solidId));
   else marker(ctx,h)
  }
 }
 function drawStatic(ctx,s){
  if(s.material!=="pine-trunk"&&s.material!=="tree-trunk")return false;
  if(raster?.drawStatic(ctx,s))return true;
  const pineType=s.material==="pine-trunk",x=s.cx,y=s.cy;
  if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(s.radius))return false;
  drawFeature(ctx,{id:s.id,x,y,radius:s.radius,kind:pineType?"pine":"oak",
   variant:hash(Math.floor(x/100),Math.floor(y/100),3),snow:lightSnow(x,y)});
  return true
 }
 function foreground(ctx,player){
  if(raster?.drawForeground(ctx,player))return;
  for(const o of [...footprint.cells([player.x-320,player.y-320,player.x+320,player.y+240],175),
  ...footprint.groves([player.x-320,player.y-320,player.x+320,player.y+240],175)]){
   if(!["pine","oak"].includes(o.kind)||o.y<=player.y||Math.abs(o.x-player.x)>o.radius*1.4||o.y-player.y>o.radius*2)continue;
   ctx.save();ctx.globalAlpha=.25;
   oval(ctx,o.x,o.y-o.radius*1.8,o.radius*.95,o.radius*.45,o.kind==="pine"?"#416171":"#5b8a68");
   ctx.restore()
  }
 }
 function stats(){return{version:V,sourceAnchors:hubs.length,collisionSource:"existing footprint & geometry",visualTrees:"tiered pixel boughs",reference:"approved in-repository snowy-village/woodland artwork",changesPhysics:false,worldCompositions:!!setpieces,authoredRasterPilot:!!raster}}
 return{version:V,drawGround,drawFeatures,drawStatic,drawForeground:foreground,stats}
}
window.VeilwardIllustration={version:V,create};
})();