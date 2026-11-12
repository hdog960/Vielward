/* VEILWARD Phase 9 R31c — source-rooted painted canopy eaves, original R18 art preserved.
 * This is NOT a pasted scenery screenshot and NOT creator-approved art.
 * Render one cached pixel atlas from source algorithms, then stamp only
 * on original footprint tree/undergrowth roots without any new collisions.
 */
(function(){
"use strict";
const V="1.3.32",SIZE=192,HEIGHT=240,VARIANTS=5;
const A={
 oak:["#192b27","#264337","#355745","#4b7551","#64875a","#83a06b","#b2b57a"],
 pine:["#172e2b","#26443d","#2b5447","#46705a","#5c8165","#80a17b","#bbc296"]
};
function hash(x,y,z=0){
 let n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(z|0,1442695041);
 n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296
}
function rect(ctx,x,y,w,h,color){
 ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))
}
function oval(ctx,x,y,rx,ry,color){
 ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);
 ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.restore()
}
function stroke(ctx,points,col,w){
 ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
 ctx.lineJoin="round";ctx.lineCap="round";ctx.strokeStyle=col;ctx.lineWidth=w;ctx.stroke()
}
function leafLobe(ctx,cx,cy,rx,ry,seed,palette){
 // A dark crown perimeter under thousands of clipped, independent
 // pixel clusters: irregular branch lobes instead of overlapping ovals.
 oval(ctx,cx+4,cy+6,rx+5,ry+4,palette[0]);
 oval(ctx,cx-2,cy-3,rx,ry,palette[1]);
 for(let i=0;i<Math.ceil(rx*ry*.16);i++){
  const a=hash(i,seed,7)*Math.PI*2,rad=Math.sqrt(hash(i,seed,13)),
   x=cx+Math.cos(a)*rx*rad,y=cy+Math.sin(a)*ry*rad;
  const light=(.67-y/(HEIGHT*.92))*.29+hash(i,seed,23)*.8;
  const index=light>.87?6:light>.69?5:light>.48?4:light>.27?3:2;
  const s=1+Math.floor(hash(seed,i,51)*3),w=s+Math.floor(hash(i,seed,53)*2);
  rect(ctx,x,y,w,Math.max(1,s-1),palette[index]);
  if(hash(i,seed,57)>.94)rect(ctx,x+2,y-2,2,1,palette[6])
 }
}
function tree(ctx,kind,variant){
 ctx.clearRect(0,0,SIZE,HEIGHT);
 const seed=variant*73+(kind==="pine"?103:19),pal=A[kind];
 // Ground shadow and roots terminate at the native (96,233) foot pixel.
 oval(ctx,99,232,69,9,"rgba(20,40,34,.32)");
 const sway=(hash(seed,1,6)-.5)*17;
 const trunk="#594437",side="#352f2f",light="#97785b";
 if(kind==="oak"){
  stroke(ctx,[[96,233],[94,192],[83,145],[91+sway*.4,100],[85+sway,77]],side,18);
  stroke(ctx,[[93,225],[88,162],[90+sway*.5,99]],trunk,11);
  stroke(ctx,[[88,141],[55,104],[37,81]],trunk,8);
  stroke(ctx,[[93,128],[132,100],[154,79]],trunk,8);
  for(let i=0;i<4;i++){
   const y=147+i*22,x=88+i*1.7;
   stroke(ctx,[[x-4,y],[x-5+i*.4,y+8]],i%2?side:light,2)
  }
  // Root flares are visibly connected to the same physical collision foot.
  stroke(ctx,[[91,204],[69,230],[48,235]],side,8);
  stroke(ctx,[[101,204],[127,229],[144,233]],trunk,9);
  const lobes=[
   [46,90,41,32],[77,67,43,36],[111,69,44,35],
   [145,95,36,29],[51,117,40,27],[103,111,55,35],
   [141,126,35,26],[92,46,38,28]
  ];
  for(const [i,p] of lobes.entries()){
   const dx=(hash(variant,i,39)-.5)*9,dy=(hash(i,variant,39)-.5)*8;
   leafLobe(ctx,p[0]+dx,p[1]+dy,p[2],p[3],seed+i*9,pal)
  }
 }else{
  stroke(ctx,[[96,233],[95,180],[91+sway*.18,111],[92+sway*.4,32]],side,14);
  stroke(ctx,[[92,223],[95,150],[95+sway*.24,36]],trunk,6);
  for(let tier=0;tier<7;tier++){
   const yy=43+tier*23,
    rx=23+tier*7,ry=13+tier*2.0,
    dx=(hash(variant,tier,21)-.5)*10;
   leafLobe(ctx,96+dx,yy,rx,ry,seed+tier*17,pal);
   if(tier>1&&tier<6){
    stroke(ctx,[[96,yy-1],[96-rx*.85,yy+15]],side,3);
    stroke(ctx,[[96,yy-1],[96+rx*.78,yy+13]],side,3)
   }
  }
  stroke(ctx,[[91,207],[68,232],[49,234]],side,6);
  stroke(ctx,[[103,212],[125,231],[139,235]],trunk,6)
 }
 // Different litter/lichen around each anchored trunk.
 for(let i=0;i<38;i++){
  const px=96+(hash(i,seed,82)-.5)*130,
   py=218+hash(i,seed,81)*20;
  const col=hash(i,seed,86)>.65?"#82905e":"#4c7153";
  rect(ctx,px,py,2+hash(i,seed,87)*3,2,col);
  if(i%9===0){
   rect(ctx,px,py-4,3,4,"#c8aa71");
   rect(ctx,px-2,py-5,7,2,"#dfc090")
  }
 }
}
function shrubs(ctx,variant){
 ctx.clearRect(0,0,SIZE,HEIGHT);
 const seed=variant*31+403;
 oval(ctx,96,222,72,13,"rgba(31,54,42,.27)");
 for(let j=0;j<27;j++){
  const x=30+hash(seed,j,1)*137,
   y=201+hash(j,seed,4)*24,
   h=20+hash(seed,j,6)*52;
  stroke(ctx,[[x,y],[x+(hash(j,seed,8)-.5)*20,y-h]],
   j%3===0?"#667c53":"#345a40",2.5);
  for(let k=0;k<6;k++){
   const yy=y-h*(k+1)/7,
    shift=(k%2?-1:1)*(6+hash(j,k,seed)*10);
   stroke(ctx,[[x,yy+6],[x+shift,yy-8]],
    k%3===0?"#acc184":k%2?"#537d55":"#719c62",3)
  }
  if(j%4===0){
   const col=j%3===0?"#d8bd70":j%3===1?"#c8b7dc":"#e5dbc2";
   rect(ctx,x-2,y-h-4,5,5,col);
   rect(ctx,x-1,y-h-7,3,2,"#faf0c5")
  }
 }
}
let atlas=null,painted=null,paintedError=null,paintedPromise=null;
// R66 original authored pixel geology: two independent 128x128 stone/lichen
// studies for the genuine Falls overlook. Drawn into a transparent raster
// canvas with deliberately stepped silhouettes, not generic vector platforms.
// Only visual; never contributes a collider, path, or physical elevation.
let fallsGeology=null;
function makeFallsGeology(){
 if(typeof document==="undefined")return null;
 const canvas=document.createElement("canvas");
 canvas.width=256;canvas.height=128;
 const c=canvas.getContext("2d");if(!c)return null;
 c.imageSmoothingEnabled=false;
 const studies=[
  {ridge:[77,70,67,61,58,60,53,49,51,57,55,62,65,69,75,82],
   base:[116,116,117,120,122,120,119,117,120,121,120,118,116,114,112,111],
   face:["#344642","#4c5950","#657164","#7c8170","#a4a28a"],
   moss:["#334b37","#4a6747","#739263","#a3ae7b"]},
  {ridge:[84,81,73,68,63,58,55,59,62,54,49,56,60,66,70,79],
   base:[112,114,115,118,119,122,123,121,118,120,118,115,114,112,111,108],
   face:["#3a4145","#50595a","#69716c","#87877a","#aba68d"],
   moss:["#2b483c","#42664a","#64845b","#9eac7d"]}
 ];
 const pixel=(x,y,w,h,color)=>{
  c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.max(1,w),Math.max(1,h))
 };
 for(let variant=0;variant<2;variant++){
  const p=studies[variant],ox=variant*128;
  // A stepped, sloping fractured stone face with irregular bottom contour.
  for(let col=0;col<16;col++){
   const top=p.ridge[col],bottom=p.base[col];
   for(let y=top;y<bottom;y+=4){
    const strata=Math.floor((y-top)/4),shade=
     Math.max(0,Math.min(4,Math.floor((bottom-y)/15)+
      (hash(col,strata,variant*73+19)>.65?1:0)));
    pixel(ox+col*8,y,8,Math.min(4,bottom-y),p.face[shade]);
    if(hash(col,strata,variant*97+41)>.77)
     pixel(ox+col*8+2,y+1,3,1,p.face[Math.max(0,shade-1)])
   }
   // Broken upper edge: thin sunlit exposed stone, no straight top rail.
   pixel(ox+col*8,top,8,2,p.face[4]);
   if(col%3===1)pixel(ox+col*8+2,top+3,3,2,p.face[2]);
  }
  // Two nonmirrored, independently drawn fracture networks.
  const cracks=variant===0?
   [[16,76,9],[25,86,12],[56,65,14],[65,78,11],[93,73,18],[106,92,9]]:
   [[14,91,12],[40,79,17],[49,96,11],[79,71,16],[101,67,14],[117,85,12]];
  for(const [x,y,h] of cracks){
   pixel(ox+x,y,2,h,p.face[0]);pixel(ox+x+2,y+Math.floor(h*.5),5,2,p.face[1]);
   pixel(ox+x-2,y+3,2,5,p.face[2])
  }
  // Dense but discontinuous lichen colonies; each is small pixel clusters.
  const colonies=variant===0?
   [[13,81],[35,74],[47,91],[77,64],[86,88],[110,76],[118,99]]:
   [[10,97],[29,83],[53,73],[68,91],[92,70],[105,94],[120,86]];
  for(let i=0;i<colonies.length;i++){
   const [x,y]=colonies[i];
   for(let k=0;k<19;k++){
    const dx=Math.floor((hash(i,k,variant+18)-.5)*20);
    const dy=Math.floor((hash(k,i,variant+29)-.5)*13);
    const col=p.moss[Math.floor(hash(k,i,variant+45)*4)];
    pixel(ox+x+dx,y+dy,2+(k%3),1+(k%2),col)
   }
  }
 }
 return canvas
}


/* R67: four independently composed pixel-canopy paintings for the original
 * Greenwood Falls overlook. These are transparent material sprites, not
 * physical trees, and are clipped by the existing authoritative land mask.
 * Each silhouette is drawn at source resolution with hard pixel edges.
 */
let fallsCanopies=null;
function makeFallsCanopies(){
 if(typeof document==="undefined")return null;
 const sheet=document.createElement("canvas");
 sheet.width=512;sheet.height=128;
 const c=sheet.getContext("2d");if(!c)return null;
 c.imageSmoothingEnabled=false;
 const forms=[
  {lobes:[[29,67,25,20],[48,48,29,25],[76,38,27,26],[103,57,24,24],[65,73,39,27]],trunk:68,seed:13},
  {lobes:[[19,66,18,27],[39,49,20,30],[60,31,18,29],[84,51,23,33],[108,74,19,25]],trunk:65,seed:37},
  {lobes:[[26,51,24,24],[49,31,26,22],[82,43,29,29],[104,66,20,21],[57,77,38,24]],trunk:58,seed:59},
  {lobes:[[21,77,19,21],[38,53,25,28],[64,40,22,31],[91,31,20,26],[105,65,23,27],[70,79,36,22]],trunk:75,seed:83}
 ];
 const palette=["#182c2b","#234138","#305746","#416c50","#5d845b","#7e9d6c","#aabd82"];
 function pix(x,y,w,h,col){c.fillStyle=col;c.fillRect(x|0,y|0,Math.max(1,w|0),Math.max(1,h|0))}
 for(let v=0;v<4;v++){
  const f=forms[v],ox=v*128;
  // Connected old-growth trunk and angled boughs behind the crown.
  for(let y=80;y<125;y+=3){
   const sway=Math.floor(Math.sin((125-y)*.055+v)*3);
   pix(ox+f.trunk+sway-5,y,12,3,y%9===0?"#856e4f":"#423d34");
   pix(ox+f.trunk+sway-3,y,2,3,"#a18b65")
  }
  for(let j=0;j<4;j++){
   const l=f.lobes[j],x=f.trunk+(l[0]-f.trunk)*.55;
   for(let t=0;t<7;t++){
    const bx=Math.round(x+(l[0]-x)*t/7),by=Math.round(102+(l[1]-102)*t/7);
    pix(ox+bx-3,by,7,4,"#403b31")
   }
  }
  // Silhouettes are irregular pixel clusters, not circles or vector polygons.
  for(let j=0;j<f.lobes.length;j++){
   const [cx,cy,rx,ry]=f.lobes[j];
   for(let yy=Math.max(3,cy-ry-5);yy<Math.min(115,cy+ry+5);yy+=3)
    for(let xx=Math.max(2,cx-rx-5);xx<Math.min(126,cx+rx+5);xx+=3){
     const edge=(Math.pow((xx-cx)/rx,2)+Math.pow((yy-cy)/ry,2));
     const irregular=(hash(xx+j*17,yy+f.seed,j)*.34-.17);
     if(edge>1+irregular)continue;
     const sun=(cy-yy)/ry*.22+hash(xx,yy,f.seed)*.75;
     const shade=sun>.79?6:sun>.62?5:sun>.45?4:sun>.30?3:2;
     pix(ox+xx,yy,3+(hash(yy,xx,j)>.85?2:0),3,palette[shade]);
     if(hash(xx,yy,f.seed+41)>.91)
      pix(ox+xx+1,yy,2,1,palette[Math.min(6,shade+1)]);
    }
  }
  // Exposed rim twigs and separated mossy root toes.
  for(let j=0;j<11;j++){
   const x=9+Math.floor(hash(j,f.seed,2)*107);
   const y=24+Math.floor(hash(f.seed,j,3)*47);
   if(hash(j,f.seed,4)>.44)pix(ox+x,y,2,5,palette[5])
  }
  pix(ox+f.trunk-12,119,13,4,"#4b4a37");
  pix(ox+f.trunk+4,121,17,3,"#655c40")
 }
 return sheet
}

/* R68: three independent, transparent, 128px bank-material paintings.
 * Pebble talus, fractured shale and fern-root shelves are authored in pixel
 * clusters, rather than repeatedly stretching the same R18 boulder.
 * They are scenic, never collision or replacement river geometry.
 */
let fallsBankStudies=null;
function makeFallsBankStudies(){
 if(typeof document==="undefined")return null;
 const sheet=document.createElement("canvas");
 sheet.width=384;sheet.height=128;
 const c=sheet.getContext("2d");if(!c)return null;
 c.imageSmoothingEnabled=false;
 const profiles=[
  {top:[78,73,69,72,63,59,64,56,61,67,63,70,74,72,79,83],
   bottom:[105,108,111,115,117,119,116,121,122,119,117,115,112,110,108,105],
   rock:["#283f3d","#415650","#65746a","#879187","#b5b49b"],
   green:["#294e3b","#44734d","#73945b","#b2b784"],seed:17},
  {top:[88,83,76,69,66,72,61,57,53,60,68,64,72,79,82,87],
   bottom:[107,111,114,117,121,119,122,124,123,120,119,117,115,113,109,106],
   rock:["#2c3d45","#4b5c61","#6c7775","#92958a","#c0bba4"],
   green:["#304d40","#526e4b","#799366","#adb57b"],seed:43},
  {top:[83,77,73,69,74,68,63,70,66,61,64,70,73,78,80,85],
   bottom:[109,113,115,118,120,122,119,117,122,121,118,117,113,112,108,106],
   rock:["#35423c","#4d6050","#6b7965","#969984","#b8b79a"],
   green:["#274b37","#416b44","#6b8c54","#a4b87a"],seed:71}
 ];
 function pixel(x,y,w,h,color){c.fillStyle=color;
  c.fillRect(x|0,y|0,Math.max(1,w|0),Math.max(1,h|0))}
 for(let v=0;v<3;v++){
  const p=profiles[v],ox=v*128;
  for(let col=0;col<16;col++){
   const top=p.top[col],bottom=p.bottom[col];
   for(let y=top;y<bottom;y+=3){
    const band=Math.min(4,Math.max(0,Math.floor((bottom-y)/13)+
     (hash(col,y,p.seed)>.66?1:0)));
    pixel(ox+col*8,y,8,Math.min(3,bottom-y),p.rock[band]);
    if(hash(col,y,p.seed+5)>.72)
     pixel(ox+col*8+2,y+1,3,1,p.rock[Math.max(0,band-1)]);
   }
   pixel(ox+col*8,top,8,2,p.rock[4]);
   if(col%3===v)pixel(ox+col*8+3,top+4,2,7,p.rock[0]);
  }
  // Nonrepeating fractures, moss and layered rootlets.
  for(let i=0;i<12;i++){
   const x=7+Math.floor(hash(i,p.seed,3)*113);
   const col=Math.min(15,Math.floor(x/8));
   const y=p.top[col]+8+Math.floor(hash(i,p.seed,7)*19);
   pixel(ox+x,y,2,5+Math.floor(hash(i,p.seed,9)*11),p.rock[0]);
   pixel(ox+x+2,y+5,5,2,p.rock[1]);
  }
  for(let i=0;i<58;i++){
   const x=3+Math.floor(hash(i,p.seed,17)*121),col=Math.min(15,Math.floor(x/8));
   const y=p.top[col]+2+Math.floor(hash(p.seed,i,19)*20);
   if(y>=p.bottom[col]-2)continue;
   const green=p.green[Math.floor(hash(i,p.seed,23)*4)];
   pixel(ox+x,y,2+i%3,1+i%2,green);
  }
  // Three differently rooted fern crowns, staggered along the upper ledge.
  const crowns=v===0?[[21,78],[66,62],[107,76]]:
   v===1?[[13,84],[53,67],[95,67]]:[[32,75],[78,66],[113,78]];
  for(let i=0;i<3;i++){
   const [x,y]=crowns[i];
   pixel(ox+x,y,2,17,p.green[0]);
   for(let k=0;k<8;k++){
    const yy=y+2+k*2;
    const reach=3+Math.floor((8-k)*.83);
    pixel(ox+x-reach,yy,reach,2,p.green[k%3+1]);
    pixel(ox+x+2,yy-1,reach-1,2,p.green[(k+1)%3+1]);
   }
  }
 }
 return sheet
}

const PAINTED_SIZE=128,PAINTED_FILES=[
 "./assets/greenwood_oak_r18.avif?v=1",
 "./assets/greenwood_pine_r18.avif?v=1",
 "./assets/greenwood_ferns_r18.avif?v=1",
 "./assets/greenwood_rock_r18.avif?v=1"
];
// Four separate, SHA-checked 128-pixel painted source images are assembled
// into a compact cached atlas only after all four actually decode.
function loadPainted(){
 if(painted)return Promise.resolve(true);
 if(paintedPromise)return paintedPromise;
 if(typeof Image!=="function"||typeof document==="undefined")
  return Promise.resolve(false);
 paintedPromise=Promise.all(PAINTED_FILES.map(src=>new Promise(resolve=>{
  const img=new Image();img.decoding="async";
  img.onload=()=>resolve(img.naturalWidth===PAINTED_SIZE&&
   img.naturalHeight===PAINTED_SIZE?img:null);
  img.onerror=()=>resolve(null);
  try{img.src=src}catch(_){resolve(null)}
 }))).then(images=>{
  if(images.some(im=>!im)){
   paintedError="One or more independent Greenwood paintings unavailable; native art remains active";
   console.warn(paintedError);return false
  }
  try{
   const canvas=document.createElement("canvas");
   canvas.width=PAINTED_SIZE*4;canvas.height=PAINTED_SIZE;
   const ctx=canvas.getContext("2d",{willReadFrequently:true});
   if(!ctx)throw Error("No 2D context for Greenwood art");
   ctx.imageSmoothingEnabled=false;
   images.forEach((im,i)=>ctx.drawImage(im,i*PAINTED_SIZE,0));
   // A valid decoded file can still be empty! Enforce nontransparent
   // source paintings before replacing the previous working forest.
   if(ctx.getImageData){
    const rgba=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    const counts=[0,0,0,0];
    for(let i=0;i<rgba.length;i+=4)if(rgba[i+3]>50)
     counts[Math.floor((i/4)%canvas.width/PAINTED_SIZE)]++;
    if(counts.some(n=>n<1400))throw Error("Blank source cell: "+counts.join(","));
   }
   painted=canvas;fallsGeology=makeFallsGeology();fallsCanopies=makeFallsCanopies();fallsBankStudies=makeFallsBankStudies();paintedError=null;return true
  }catch(err){
   paintedError="Greenwood painted atlas rejected: "+String(err);
   console.warn(paintedError);return false
  }
 });
 return paintedPromise
}
function load(){
 loadPainted();
 if(atlas)return atlas;
 if(typeof document==="undefined"||!document.createElement)return null;
 const canvas=document.createElement("canvas");
 canvas.width=SIZE*VARIANTS*3;canvas.height=HEIGHT;
 const ctx=canvas.getContext("2d");if(!ctx)return null;
 ctx.imageSmoothingEnabled=false;
 for(let v=0;v<VARIANTS;v++){
  for(let k=0;k<3;k++){
   ctx.save();ctx.translate((k*VARIANTS+v)*SIZE,0);
   if(k===2)shrubs(ctx,v);
   else tree(ctx,k===0?"oak":"pine",v);
   ctx.restore()
  }
 }
 atlas=canvas;return atlas
}
function create({footprint,geometry,model}={}){
 if(!footprint||!geometry)throw Error("Greenwood art requires physical source geometry");
 loadPainted();
 const forest=(x,y)=>["greenwood","greenwood_falls"].includes(
   footprint.regionAt(x,y)?.id);
 function stamp(ctx,type,x,y,w,h,seed=0){
  // Painted sources should render even if procedural atlas allocation fails.
  // Keep the atlas requirement only for the fallback sprite path.
  loadPainted();
  const v=((seed|0)%VARIANTS+VARIANTS)%VARIANTS;
  // Retain some original procedural varieties to prevent clone repetition;
  // the new paintings replace most tree, shrub and real boulder source roots.
  if(painted&&(type==="rock"||v!==1)){
   const index=type==="oak"?0:type==="pine"?1:type==="rock"?3:2;
   const width=Math.round(w),height=Math.round(h),flip=v%2===0;
   ctx.save();ctx.imageSmoothingEnabled=true;
   ctx.imageSmoothingQuality="high";
   if(flip){
    ctx.translate(Math.round(x),0);ctx.scale(-1,1);
    ctx.drawImage(painted,index*PAINTED_SIZE,0,PAINTED_SIZE,PAINTED_SIZE,
     Math.round(-width*.5),Math.round(y-height),width,height)
   }else ctx.drawImage(painted,index*PAINTED_SIZE,0,PAINTED_SIZE,PAINTED_SIZE,
    Math.round(x-width*.5),Math.round(y-height),width,height);
   ctx.restore();return true
  }
  if(type==="rock")return false;
  if(!load())return false;
  const offset=(type==="oak"?0:type==="pine"?VARIANTS:VARIANTS*2)+v;
  ctx.save();ctx.imageSmoothingEnabled=false;
  ctx.drawImage(atlas,offset*SIZE,0,SIZE,HEIGHT,
   Math.round(x-w*.5),Math.round(y-h),Math.round(w),Math.round(h));
  ctx.restore();return true
 }
 function paintFeature(ctx,o){
  if(!o||!forest(o.x,o.y))return false;
  if(!["oak","pine","flowerbed","scrub","boulder"].includes(o.kind))return false;
  let n=Math.floor(o.variant*849);
  const r=o.radius;
  if(o.kind==="oak"||o.kind==="pine"){
   // Only the original painted R18 source for newly curated old-growth
   // roots: no mismatched generated fallback in this focal forest scene.
   // Falls is the visual-acceptance focal scene: once the four R18
   // painted sources decode, do not interleave the mismatched procedural
   // crown variant among otherwise coherent authored forest paintings.
   // The existing fallback remains available if paintings cannot load.
   if((o.authoredGrove||footprint.regionAt(o.x,o.y)?.id==="greenwood_falls")&&
      n%VARIANTS===1)n++;
   // Source-original R18 artwork keeps its native proportions. Only
   // selected, real old-growth roots get a slightly taller/wider crown.
   const elder=o.authoredGrove?(o.kind==="oak"?1.20:1.08):1;
   const w=r*(o.kind==="oak"?5.4:4.6)*elder,
    h=r*(o.kind==="oak"?7.0:7.6)*elder;
   return stamp(ctx,o.kind,o.x,o.y,w,h,n)
  }
  if(o.kind==="boulder"){
   // R35b: the original physically collidable Falls boulder remains a
   // painted R18 rock, but now shares an attached, painted moss and fern
   // foot instead of resembling a lone square sitting on green carpet.
   const falls=footprint.regionAt(o.x,o.y)?.id==="greenwood_falls";
   if(falls&&painted){
    ctx.save();ctx.globalAlpha=.66;ctx.imageSmoothingEnabled=true;
    const ww=r*3.6,hh=r*.92;
    ctx.drawImage(painted,PAINTED_SIZE*2,0,
     PAINTED_SIZE,PAINTED_SIZE,
     Math.round(o.x-ww*.5),Math.round(o.y-hh*.80),
     Math.round(ww),Math.round(hh));
    ctx.restore()
   }
   const ok=stamp(ctx,"rock",o.x,o.y,r*(falls?2.85:2.6),
    r*(falls?1.76:1.9),n);
   if(falls&&painted&&ok){
    ctx.save();ctx.globalAlpha=.36;ctx.imageSmoothingEnabled=true;
    const w=r*2.30,h=r*.60;
    ctx.drawImage(painted,PAINTED_SIZE*2,0,
     PAINTED_SIZE,PAINTED_SIZE,
     Math.round(o.x-w*.5),Math.round(o.y-h*.93),
     Math.round(w),Math.round(h));
    ctx.restore()
   }
   return ok
  }
  return stamp(ctx,"shrubs",o.x,o.y,r*2.1,r*1.5,n)
 }

 // R19: a continuous woodland verge follows each genuine Greenwood road
 // geometry. This is passable painted ground BELOW the original path, not
 // a freestanding obstacle, invented route, or decorative false clearing.
 function paintRoadVerges(ctx,bounds){
  if(!Array.isArray(geometry.roads))return 0;
  let segments=0;
  const margin=220;
  for(const edge of geometry.roads){
   if(edge.crossing||!edge.path||edge.path.length<2)continue;
   const line=edge.path,hw=edge.halfWidth||65;
   for(let i=1;i<line.length;i++){
    const a=line[i-1],b=line[i];
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
    if(len<20||!Number.isFinite(len))continue;
    const mx=(a[0]+b[0])*.5,my=(a[1]+b[1])*.5;
    if(!forest(mx,my)||geometry.waterAt(mx,my,40))continue;
    if(Math.max(a[0],b[0])+margin<bounds[0]||
       Math.min(a[0],b[0])-margin>bounds[2]||
       Math.max(a[1],b[1])+margin<bounds[1]||
       Math.min(a[1],b[1])-margin>bounds[3])continue;
    const nx=-dy/len,ny=dx/len;
    const steps=Math.max(3,Math.ceil(len/78));
    for(const side of [-1,1]){
     // The former 182-unit continuous translucent verge polygons produced
     // long, artificial dark bands along real roads and could bleed into
     // stream bends. Keep the native ground visible instead: the existing
     // source-painted fern stamps below provide the only verge decoration,
     // each individually checked against water, routes and obstacles.
     // Sparse painterly fern material grows only inside the SOURCE verges;
     // no invisible collisions or off-road free-standing decoration.
     if(painted&&ctx.drawImage){
      for(let j=1;j<steps;j+=4){
       const t=j/steps,x=a[0]+dx*t,y=a[1]+dy*t;
       const seed=Math.floor(hash(i,j,side)*9973);
       const offset=hw+74+hash(j,i,side)*31;
       const xx=x+nx*side*offset,yy=y+ny*side*offset;
       // R40ao: keep the painted verge ferns on genuinely dry, open
       // woodland rather than allowing a centre-clear sprite to overlap
       // diagonal trails, river bends or collidable bridge approaches.
       // Vary the painted source aspect and translucency deterministically
       // to avoid a repeating row of identical rectangular fern stamps.
       const sz=78+hash(seed,j,51)*54;
       const fw=sz*(.83+hash(seed,j,61)*.29);
       const fh=sz*(.43+hash(j,seed,63)*.20);
       let safe=true;
       for(const fy of [-.48,0,.48]){
        for(const fx of [-.48,0,.48]){
         const px=xx+fw*fx,py=yy-fh*.53+fh*fy;
         if(!forest(px,py)||geometry.waterAt(px,py,12)||
            geometry.nearRoad(px,py,()=>true,18)||
            geometry.obstacle(px,py,18)||footprint.blocked?.(px,py,18)){
          safe=false;break
         }
        }
        if(!safe)break
       }
       if(!safe)continue;
       ctx.save();ctx.globalAlpha=.27+hash(seed,j,67)*.17;
       ctx.imageSmoothingEnabled=true;
       ctx.drawImage(painted,PAINTED_SIZE*2,0,PAINTED_SIZE,PAINTED_SIZE,
        Math.round(xx-fw*.5),Math.round(yy-fh*.53),
        Math.round(fw),Math.round(fh));
       ctx.restore()
      }
     }
    }
    segments++
   }
  }
  return segments
 }

 // R20: native woodland understory begins at EXISTING real tree roots,
 // not on independently created impassable scenery or repeated tile flecks.
 function paintRootedUnderstory(ctx,bounds,roots){
  if(!painted||!ctx?.drawImage)return 0;
  let count=0;
  for(const o of roots){
   if(!["oak","pine","scrub","flowerbed"].includes(o.kind)||
     !forest(o.x,o.y)||geometry.waterAt(o.x,o.y,25))continue;
   const r=o.radius;
   if(o.x+r*4<bounds[0]||o.x-r*4>bounds[2]||
      o.y+r*3<bounds[1]||o.y-r*3>bounds[3])continue;
   const seed=Math.floor(o.variant*8191);
   const amount=o.kind==="oak"||o.kind==="pine"?3:2;
   for(let j=0;j<amount;j++){
    const a=j/amount*Math.PI*2+hash(seed,j,173)*.95,
     distance=r*(.4+hash(j,seed,175)*1.27),
     x=o.x+Math.cos(a)*distance,
     y=o.y+Math.sin(a)*distance*.48;
    // Do not conceal real water, roads, buildings or entrance thresholds.
    if(!forest(x,y)||geometry.waterAt(x,y,12)||
       geometry.nearRoad(x,y,()=>true,35)||
       geometry.obstacle(x,y,35))continue;
    const w=r*(2.9+hash(seed,j,177)*1.1),
     h=w*(.37+hash(j,seed,179)*.10);
    // R40am: the old centre-only exclusion let a broad painted fern mat
    // cover the edge of a diagonal path or stream. Test the actual
    // translucent sprite footprint before placing it. This is artwork
    // clearance only: no source paths, colliders, or roots are changed.
    let clearFootprint=true;
    for(const fy of [-.45,0,.45]){
     for(const fx of [-.45,0,.45]){
      const px=x+w*fx,py=y-h*.8+h*(fy+.5);
      if(!forest(px,py)||geometry.waterAt(px,py,10)||
         geometry.nearRoad(px,py,()=>true,22)||
         geometry.obstacle(px,py,20)||
         footprint.blocked?.(px,py,20)){
       clearFootprint=false;break
      }
     }
     if(!clearFootprint)break
    }
    if(!clearFootprint)continue;
    ctx.save();ctx.globalAlpha=.29+hash(seed,j,181)*.13;
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(painted,PAINTED_SIZE*2,0,PAINTED_SIZE,PAINTED_SIZE,
     Math.round(x-w*.5),Math.round(y-h*.8),
     Math.round(w),Math.round(h));
    ctx.restore();count++
   }
  }
  return count
 }

 // R24: Existing Hearth and Hermit waypoints anchor an interconnected,
 // PASSABLE woodland habitat; no new tree roots, cliffs, solids or roads.
 const habitatAnchors=(model?.nodes||[]).filter(n=>
  n.id==="greenwood_hearth"||n.id==="hermit").map(n=>({
   id:n.id,x:n.point[0]*model.worldDesign.worldUnitScale,
   y:n.point[1]*model.worldDesign.worldUnitScale
  }));

 // R26: connect source-placed fern material into continuous forest glades.
 // The links are translucent GROUND ONLY, with no new trunks, colliders,
 // paths, foliage over a roadway, or fake waypoint objects. Every brush
 // endpoint comes from the SAME accepted Hearth/Hermit footprint mat.
 function paintLandmarkHabitat(ctx,bounds){
  if(!painted||!habitatAnchors.length)return 0;
  let mats=0;
  for(const hub of habitatAnchors){
   const reach=920;
   if(hub.x+reach<bounds[0]||hub.x-reach>bounds[2]||
      hub.y+reach<bounds[1]||hub.y-reach>bounds[3])continue;
   const salt=hub.id==="hermit"?337:419;
   const patches=[];
   // Search the entire deterministic source clearing, not just this
   // streamed tile, or seam-edge mats would change when chunks rebuild.
   for(let j=0;j<54;j++){
    const angle=j*2.399963229728653+hash(j,salt,301)*.23;
    const ring=j%3===0?205:j%3===1?410:610;
    const radius=ring+(hash(j,salt,303)-.5)*190;
    const x=hub.x+Math.cos(angle)*radius*1.02,
     y=hub.y+Math.sin(angle)*radius*.82;
    const w=148+hash(salt,j,305)*114,
     h=w*(.46+hash(j,salt,307)*.14);
    // Check the entire visible fern mat, not just its centre. The
    // Hearth/Hermit clearing has diagonal paths and curved stream edges:
    // a centre-clear billboard can otherwise cover either one.
    let clear=true;
    for(const fy of [-.42,0,.42]){
     for(const fx of [-.42,0,.42]){
      const px=x+w*fx,py=y-h*.88+h*(fy+.5);
      if(!forest(px,py)||geometry.waterAt(px,py,20)||
         geometry.nearRoad(px,py,()=>true,30)||
         geometry.obstacle(px,py,26)||
         footprint.blocked?.(px,py,22)){
       clear=false;break
      }
     }
     if(!clear)break
    }
    if(!clear)continue;
    patches.push({x,y,w,h,j});
   }
   // Restrained, low-chroma soil/lichen masses join the independent mats
   // along safe ground. Never draw over any authored route, water or house.
   const linked=new Set();
   for(let i=0;i<patches.length;i++){
    const a=patches[i];let nearest=null,dist=Infinity;
    for(let j=i+1;j<patches.length;j++){
     const b=patches[j],d=Math.hypot(a.x-b.x,a.y-b.y);
     if(d>465||d<75||d>=dist)continue;
     // The habitat stroke follows a curved, wide footprint. Sampling only
     // four points on its straight centreline could miss a crossing or
     // stream bend beneath the actual painted arc. Validate the curved
     // brush footprint at short intervals and across both shoulders.
     const vx=(b.x-a.x)/d,vy=(b.y-a.y)/d;
     const midX=(a.x+b.x)*.5-vy*22,midY=(a.y+b.y)*.5+vx*22;
     const brushWidth=Math.min(125,Math.max(66,(a.h+b.h)*.60));
     let safe=true;
     const stations=Math.max(8,Math.ceil(d/28));
     for(let k=0;k<=stations&&safe;k++){
      const t=k/stations,u=1-t;
      const x=u*u*a.x+2*u*t*midX+t*t*b.x;
      const y=u*u*a.y+2*u*t*midY+t*t*b.y;
      for(const offset of [-.5,0,.5]){
       const px=x-vy*brushWidth*offset,py=y+vx*brushWidth*offset;
       if(!forest(px,py)||geometry.waterAt(px,py,14)||
          geometry.nearRoad(px,py,()=>true,26)||
          geometry.obstacle(px,py,25)||footprint.blocked?.(px,py,22)){
        safe=false;break
       }
      }
     }
     if(safe){nearest=b;dist=d}
    }
    if(!nearest||linked.has(a.j+":"+nearest.j))continue;
    linked.add(a.j+":"+nearest.j);
    if(Math.max(a.x,nearest.x)+120<bounds[0]||
       Math.min(a.x,nearest.x)-120>bounds[2]||
       Math.max(a.y,nearest.y)+120<bounds[1]||
       Math.min(a.y,nearest.y)-120>bounds[3])continue;
    // Rounded and subtly bent brushwork, not straight footpaths. Lower
    // alpha keeps the separate source-painted fern fronds legible above it.
    const dx=nearest.x-a.x,dy=nearest.y-a.y,d=Math.hypot(dx,dy)||1;
    const midX=(a.x+nearest.x)*.5-dy/d*22,
     midY=(a.y+nearest.y)*.5+dx/d*22;
    ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();ctx.moveTo(a.x,a.y);
    if(ctx.quadraticCurveTo)ctx.quadraticCurveTo(midX,midY,nearest.x,nearest.y);
    else ctx.lineTo(nearest.x,nearest.y);
    ctx.strokeStyle="rgba(27,61,42,.13)";
    ctx.lineWidth=Math.min(125,Math.max(66,(a.h+nearest.h)*.60));
    ctx.stroke();
    ctx.restore()
   }
   for(const p of patches){
    const {x,y,w,h,j}=p;
    if(x+w*.7<bounds[0]||x-w*.7>bounds[2]||
       y+h<bounds[1]||y-h>bounds[3])continue;
    ctx.save();
    const shade=ctx.createRadialGradient?.(x,y-h*.17,8,x,y-h*.17,w*.78);
    if(shade){
     shade.addColorStop(0,"rgba(20,48,33,.23)");
     shade.addColorStop(.49,"rgba(34,74,43,.13)");
     shade.addColorStop(1,"rgba(54,89,53,0)");
     ctx.fillStyle=shade;
     ctx.fillRect(x-w*.83,y-w*.83,w*1.66,w*1.66)
    }
    ctx.translate(x,y);
    ctx.rotate?.((hash(salt,j,309)-.5)*.28);
    ctx.scale(hash(j,salt,311)>.51?-1:1,1);
    ctx.globalAlpha=.38+hash(salt,j,313)*.21;
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(painted,PAINTED_SIZE*2,0,PAINTED_SIZE,PAINTED_SIZE,
     -w*.5,-h*.88,w,h);
    ctx.restore();mats++
   }
  }
  return mats
 }

 // R25: existing, mature physical tree crowns overlap across a woodland
 // cluster. Only source-backed roots may supply the two ends: never create
 // a fake trunk, invisible collider, new road or ambient wallpaper tree.
 // Cropped painted upper foliage has no trunk and lies UNDER the whole
 // rooted tree painter, keeping the real footpoint and crown silhouette.

 // R31c: hand-placed branch reach derived from two approved, physically
 // rooted side-oaks, never billboard trees or ungrounded canopy wallpaper.
 // Crops only the ORIGINAL transparent R18 oak leaf painting (upper 78px),
 // preserves its inherent proportions, and visually attaches to the same
 // full rooted tree drawn immediately afterwards in this scene layer.
 function paintHearthEdgeBoughs(ctx,bounds,roots){
  if(!painted||!Array.isArray(roots)||!ctx?.drawImage)return 0;
  const hearth=habitatAnchors.find(h=>h.id==="greenwood_hearth");
  if(!hearth)return 0;
  let applied=0;
  for(const root of roots){
   if(!root?.authoredGrove||root.kind!=="oak"||
      !/^hearth_root_(20|23)$/.test(root.id)||
      !forest(root.x,root.y))continue;
   const dx=root.x-hearth.x,dy=root.y-hearth.y;
   // Only two actual source oak roots at the sides of the authentic
   // clearing are allowed to create eaves; hero's middle remains clear.
   if(Math.abs(dx)<500||dy<260||dy>690)continue;
   const direction=dx>0?1:-1,r=root.radius;
   for(let i=0;i<2;i++){
    const sideDist=r*(i===0?2.75:5.2),
     x=root.x-direction*sideDist,
     y=root.y-r*(i===0?5.4:4.9),
     w=r*(i===0?4.0:3.45),
     h=w*78/128;
    // No bough crosses the protected actor corridor, even if the
    // player stands at the exact original Hearth waypoint.
    if(Math.abs(x-hearth.x)<w*.5+125)continue;
    if(x+w*.5<bounds[0]||x-w*.5>bounds[2]||
       y<bounds[1]-20||y-h>bounds[3]+20)continue;
    ctx.save();ctx.globalAlpha=i===0?.91:.83;
    ctx.imageSmoothingEnabled=true;
    ctx.translate(Math.round(x),0);
    ctx.scale(direction>0?-1:1,1);
    ctx.drawImage(painted,0,0,PAINTED_SIZE,78,
     Math.round(-w*.5),Math.round(y-h),Math.round(w),Math.round(h));
    ctx.restore();applied++
   }
  }
  return applied
 }


 // R32: the northern Greenwood forest is a real, three-quarter-view
 // woodland, not a wallpaper or a collection of green ground speckles.
 // Original R18 foliage is extended toward the camera ONLY from six
 // individually identifiable collision-backed trees around the Hearth.
 // The distant northern canopy forms a continuous rear wall, while two
 // roadside oaks frame the forward left and right edges. The central
 // Wanderer corridor remains open and every actual trunk remains rooted.
 function paintHearthUpperForest(ctx,bounds,roots){
  if(!painted||!ctx?.drawImage||!Array.isArray(roots))return 0;
  const hearth=habitatAnchors.find(h=>h.id==="greenwood_hearth");
  if(!hearth)return 0;
  const north=new Set(["hearth_root_8","hearth_root_9",
   "hearth_root_10","hearth_root_15"]);
  const sides=new Set(["hearth_root_20","hearth_root_23"]);
  let drawn=0;
  for(const root of roots){
   if(!root?.authoredGrove||(!north.has(root.id)&&!sides.has(root.id))||
      !["oak","pine"].includes(root.kind)||!forest(root.x,root.y)||
      geometry.waterAt(root.x,root.y,15)||
      (footprint.blocked&&!footprint.blocked(root.x,root.y,4)))continue;
   const dx=root.x-hearth.x,dy=root.y-hearth.y,r=root.radius;
   const isNorth=north.has(root.id);
   if(isNorth&&(Math.abs(dx)>760||dy> -220||dy< -690))continue;
   if(!isNorth&&(Math.abs(dx)<500||dy<260||dy>690))continue;
   const count=isNorth?2:1;
   for(let i=0;i<count;i++){
    // A crown stretches southward from the off-camera northern trunks.
    // The side-oak branches reach inward, with their original intact
    // crown still drawn in the normal physical-tree pass afterward.
    const side=Math.sign(dx)||1;
    const x=isNorth?
      root.x+r*(i===0?-1.35:1.10):
      root.x-side*r*4.85;
    const y=isNorth?
      root.y+r*(i===0?3.05:4.25):
      root.y-r*6.9;
    const w=r*(isNorth?(i===0?5.5:6.45):5.4);
    const h=w*78/128;
    // Never place an overhead crown over the original hero's feet or
    // imply a new blocked corridor through the heart of the crossroads.
    if(y>hearth.y-104&&Math.abs(x-hearth.x)<w*.5+95)continue;
    if(x+w*.5<bounds[0]||x-w*.5>bounds[2]||
       y<bounds[1]-15||y-h>bounds[3]+15)continue;
    const index=root.kind==="pine"?1:0;
    ctx.save();
    ctx.globalAlpha=isNorth?(i===0?.94:.89):.94;
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(painted,index*PAINTED_SIZE,0,PAINTED_SIZE,78,
     Math.round(x-w*.5),Math.round(y-h),Math.round(w),Math.round(h));
    ctx.restore();drawn++
   }
  }
  return drawn
 }


 // R33: perspective-correct foreground occlusion from the SAME original
 // painted tree sprites and the SAME collision-backed source roots. Trees
 // are still rendered in world-space chunks; only their upper foliage is
 // restored over the Wanderer when the player walks BEHIND a real crown.
 // This replaces the old free-floating oval placeholder in Greenwood.
 let actorCanopyCache={x:Infinity,y:Infinity,trees:[]};
 function paintForegroundCanopy(ctx,player){
  if(!painted||!ctx?.drawImage||!player||
     !Number.isFinite(player.x)||!Number.isFinite(player.y)||
     !forest(player.x,player.y))return 0;
  // Cache the REAL tree-root query across mobile animation frames. It is
  // refreshed at 90 world units, well inside the oversized cached bounds.
  if(Math.hypot(player.x-actorCanopyCache.x,
     player.y-actorCanopyCache.y)>90){
   const b=[player.x-670,player.y-490,player.x+670,player.y+930];
   const seen=new Set();
   const trees=[...(footprint.cells?.(b,440)||[]),
     ...(footprint.groves?.(b,440)||[])].filter(o=>{
      if(!o||!o.solid||!o.id||seen.has(o.id)||
         !["oak","pine"].includes(o.kind)||!forest(o.x,o.y)||
         geometry.waterAt(o.x,o.y,6))return false;
      seen.add(o.id);return true
     }).sort((a,b)=>a.y-b.y);
   actorCanopyCache={x:player.x,y:player.y,trees}
  }
  let visible=0;
  for(const root of actorCanopyCache.trees){
   const r=root.radius,elder=root.authoredGrove?
    (root.kind==="oak"?1.20:1.08):1;
   const w=r*(root.kind==="oak"?5.4:4.6)*elder,
     h=r*(root.kind==="oak"?7.0:7.6)*elder;
   // Real root is on the near (foreground) side of the player.
   if(root.y<=player.y+15||Math.abs(root.x-player.x)>w*.49+23)
    continue;
   const top=root.y-h,bottom=top+h*90/PAINTED_SIZE;
   if(player.y-93>bottom||player.y-8<top)continue;
   let variant=Math.floor((root.variant||0)*849);
   if(root.authoredGrove&&variant%VARIANTS===1)variant++;
   // A procedural fallback tree must not acquire an incompatible
   // R18-painted overlay simply because its collider is nearby.
   if(variant%VARIANTS===1)continue;
   if(footprint.blocked&&!footprint.blocked(root.x,root.y,4))
    continue;
   const index=root.kind==="oak"?0:1;
   const flip=variant%VARIANTS%2===0;
   ctx.save();
   // Preserve the Wanderer's face, silhouette and feet. Only the upper
   // half of the actor receives gentle leaf-depth; never cover the whole
   // screen or create an opaque green foreground sprite.
   if(typeof ctx.rect==="function"&&typeof ctx.clip==="function"){
    ctx.beginPath();
    ctx.rect(player.x-44,player.y-93,88,83);
    ctx.clip()
   }
   ctx.globalAlpha=(typeof ctx.globalAlpha==="number"?
     ctx.globalAlpha:1)*.36;
   ctx.imageSmoothingEnabled=true;
   if(flip){
    ctx.translate(Math.round(root.x),0);
    ctx.scale(-1,1);
    ctx.drawImage(painted,index*PAINTED_SIZE,0,
     PAINTED_SIZE,90,Math.round(-w*.5),
     Math.round(top),Math.round(w),Math.round(h*90/PAINTED_SIZE))
   }else ctx.drawImage(painted,index*PAINTED_SIZE,0,
     PAINTED_SIZE,90,Math.round(root.x-w*.5),
     Math.round(top),Math.round(w),Math.round(h*90/PAINTED_SIZE));
   ctx.restore();visible++;
   if(visible>=2)break
  }
  return visible
 }

 function paintCanopyLinks(ctx,bounds,roots){
  if(!painted||!ctx?.drawImage||!Array.isArray(roots))return 0;
  const trees=roots.filter(o=>["oak","pine"].includes(o.kind)&&
   forest(o.x,o.y)&&!geometry.waterAt(o.x,o.y,15))
   .sort((a,b)=>a.y-b.y||a.x-b.x);
  const linked=new Set();let count=0;
  for(let i=0;i<trees.length&&count<20;i++){
   const a=trees[i];if(linked.has(a.id))continue;
   let partner=null,closest=Infinity;
   for(let j=i+1;j<trees.length;j++){
    const b=trees[j];if(linked.has(b.id))continue;
    const distance=Math.hypot(a.x-b.x,a.y-b.y);
    // Only join crowns whose REAL painted tree silhouettes can meet.
    // A fixed 520-unit bridge between small roots looked like floating
    // foliage with no physical support. Use the exact mature-tree width
    // rules from paintFeature; no invented trunks or world geometry.
    const aw=a.radius*(a.kind==="oak"?5.4:4.6)*
      (a.authoredGrove?(a.kind==="oak"?1.20:1.08):1);
    const bw=b.radius*(b.kind==="oak"?5.4:4.6)*
      (b.authoredGrove?(b.kind==="oak"?1.20:1.08):1);
    const crownReach=(aw+bw)*.46;
    if(distance<175||distance>Math.min(520,crownReach)||
       Math.abs(a.y-b.y)>Math.min(225,(aw+bw)*.26)||
       distance>=closest)continue;
    // The real road and river must never be disguised by overhanging
    // leaf bridges, even when their end roots are physically valid.
    let clear=true;
    // Sample the complete painted crown corridor, not merely its centre.
    // A diagonal path can cross between three old centreline probes.
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
    const nx=-dy/len,ny=dx/len;
    for(let step=0;step<=12&&clear;step++){
     const t=step/12;
     for(const offset of [-85,-42,0,42,85]){
      const x=a.x+dx*t+nx*offset,y=a.y+dy*t+ny*offset;
      if(!forest(x,y)||geometry.waterAt(x,y,20)||
       geometry.nearRoad(x,y,()=>true,45)||
       geometry.obstacle(x,y,28)){clear=false;break}
     }
    }
    if(!clear)continue;
    partner=b;closest=distance
   }
   if(!partner)continue;
   const b=partner,r=(a.radius+b.radius)*.5,
    x=(a.x+b.x)*.5,y=(a.y+b.y)*.5-r*3.4,
    w=Math.min(250,closest*.72),h=Math.min(155,r*2.35);
   if(x+w*.5<bounds[0]||x-w*.5>bounds[2]||
      y+h*.5<bounds[1]||y-h*.5>bounds[3])continue;
   // The painted crown sits NORTH of the root-to-root corridor. Test its
   // actual screen footprint as well: a road or river can lie beneath the
   // elevated foliage even when the ground between both trunks is clear.
   // Reject only the decorative bridge; never alter the real tree roots.
   let crownClear=true;
   for(const v of [.12,.34,.56,.78,.94]){
    for(const u of [-.44,-.22,0,.22,.44]){
     const px=x+w*u,py=y+h*(v-.5);
     if(!forest(px,py)||geometry.waterAt(px,py,20)||
        geometry.nearRoad(px,py,()=>true,45)||
        geometry.obstacle(px,py,24)){crownClear=false;break}
    }
    if(!crownClear)break
   }
   if(!crownClear)continue;
   // R40ai: replace the broad identical canopy strip with three
   // overlapping, native-aspect painted crown lobes. Every lobe remains
   // inside the already-checked crown footprint; no invented tree roots.
   // Mixed groves must read as mixed groves: reuse each endpoint's
   // authentic R18 crown painting, not three clones of the oak painting.
   // Widths and heights vary together to retain the native 128:78 crop
   // proportions. Staggered crowns are still inside the cleared envelope.
   const kinds=[a.kind,a.kind===b.kind?a.kind:b.kind,b.kind];
   let paintedLobes=0;
   ctx.save();ctx.globalAlpha=.68;ctx.imageSmoothingEnabled=true;
   for(let lobe=0;lobe<3;lobe++){
    const offset=lobe-1;
    const variation=hash(Math.round(a.x),Math.round(b.y),lobe+823);
    const lobeWidth=w*(.47+variation*.11);
    const lobeHeight=lobeWidth*78/PAINTED_SIZE;
    const lx=x+offset*w*.22;
    const ly=y+(hash(Math.round(a.x),Math.round(b.y),lobe+811)-.5)*h*.16;
    // Each offset lobe has its own true footprint. The earlier 5x5
    // envelope clearance did not cover the outer tips of staggered
    // lobes; a diagonal path could be painted over at those tips.
    // Cull only the unsafe decoration, never its rooted trees.
    let lobeClear=true;
    for(const fy of [-.48,-.24,0,.24,.48]){
     for(const fx of [-.48,-.24,0,.24,.48]){
      const px=lx+lobeWidth*fx,py=ly+lobeHeight*fy;
      if(!forest(px,py)||geometry.waterAt(px,py,20)||
         geometry.nearRoad(px,py,()=>true,45)||
         geometry.obstacle(px,py,24)){lobeClear=false;break}
     }
     if(!lobeClear)break
    }
    if(!lobeClear)continue;
    const index=kinds[lobe]==="pine"?1:0;
    ctx.drawImage(painted,index*PAINTED_SIZE,0,PAINTED_SIZE,78,
     Math.round(lx-lobeWidth*.5),Math.round(ly-lobeHeight*.5),
     Math.round(lobeWidth),Math.round(lobeHeight));
    paintedLobes++;
   }
   ctx.restore();
   // A clear trunk corridor does not guarantee a clear elevated crown.
   // Do not consume either tree as a linked pair if all three authentic
   // painted lobes were rejected by the source road/water/obstacle checks.
   if(!paintedLobes)continue;
   linked.add(a.id);linked.add(b.id);count++
  }
  return count
 }


 // R30: a broad forest-overstory FLOOR projection from *existing* trees.
 // The R29 Hearth was flat/open because its safe trunks are off the
 // immediate camera. This is an underpainting of crown-filtered light and
 // shade, not more little ferns or imaginary non-colliding tree trunks.
 // Everything is derived from the original landmass source and cached
 // per renderer, in stable world coordinates across streamed chunk seams.
 let hearthOverstory=null;
 function rootedHearthForest(){
  if(hearthOverstory)return hearthOverstory;
  const home=habitatAnchors.find(h=>h.id==="greenwood_hearth");
  if(!home)return hearthOverstory=[];
  const b=[home.x-1570,home.y-1270,home.x+1570,home.y+1370];
  const all=[...(footprint.cells?.(b,430)||[]),
   ...(footprint.groves?.(b,430)||[])];
  const used=new Set();
  hearthOverstory=all.filter(o=>{
   if(!o?.id||used.has(o.id)||!["oak","pine"].includes(o.kind)||
    !forest(o.x,o.y)||geometry.waterAt(o.x,o.y,25))return false;
   used.add(o.id);
   // Keep a real authored root as the sole anchor for every shadow.
   return Math.abs(o.x-home.x)<1260&&Math.abs(o.y-home.y)<1120;
  }).sort((a,b)=>a.y-b.y||a.x-b.x);
  return hearthOverstory
 }
 function paintRootedForestEdge(ctx,bounds){
  const hub=habitatAnchors.find(h=>h.id==="greenwood_hearth");
  if(!hub||hub.x+1450<bounds[0]||hub.x-1450>bounds[2]||
   hub.y+1450<bounds[1]||hub.y-1450>bounds[3]||
   !ctx?.createRadialGradient)return 0;
  const roots=rootedHearthForest();
  if(!roots.length)return 0;
  let shadows=0;
  // First establish a continuous shady forest surround; every shadow is
  // the footprint of a REAL collision-backed rooted oak or pine.
  for(const tree of roots){
   const r=tree.radius,oak=tree.kind==="oak",
    sid=Math.floor(tree.variant*1048576),
    rx=r*(oak?5.1:3.85),ry=r*(oak?3.25:3.85),
    ox=tree.x-r*(oak?.46:.30),
    oy=tree.y-r*(oak?.68:.34);
   if(ox+rx<bounds[0]-55||ox-rx>bounds[2]+55||
      oy+ry<bounds[1]-55||oy-ry>bounds[3]+55)continue;
   ctx.save();
   ctx.translate(ox,oy);
   ctx.rotate?.((hash(sid,19,29)-.5)*.30);
   // World-space elliptical canopy silhouettes naturally join when tree
   // crowns are close; no ellipse is promoted to fake foliage collision.
   ctx.scale(rx,ry);
   const shade=ctx.createRadialGradient(0,0,.03,0,0,1);
   shade.addColorStop(0,oak?"rgba(17,49,34,.35)":"rgba(14,46,39,.31)");
   shade.addColorStop(.37,oak?"rgba(27,65,43,.23)":"rgba(28,62,48,.19)");
   shade.addColorStop(.72,"rgba(43,84,53,.075)");
   shade.addColorStop(1,"rgba(43,84,53,0)");
   ctx.fillStyle=shade;ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);
   ctx.fill();ctx.restore();shadows++;
   // Layered filtered sunlight is a broken, softly tapering leaf-shadow,
   // not tiny white highlights or dotted procedural confetti.
   if(ctx.quadraticCurveTo){
    for(let k=0;k<2;k++){
     const angle=hash(sid,k,53)*1.1-.55,
      x=tree.x-r*(1.3+k*.33),
      y=tree.y-r*(1.66+k*.39),
      w=r*(.48+hash(k,sid,59)*.40),
      h=r*(1.30+hash(sid,k,61)*.57);
     if(x+w<bounds[0]||x-w>bounds[2]||
       y+h<bounds[1]||y-h>bounds[3])continue;
     ctx.save();ctx.translate(x,y);ctx.rotate?.(angle);
     const sun=ctx.createRadialGradient(0,0,2,0,0,h);
     sun.addColorStop(0,"rgba(193,186,112,.18)");
     sun.addColorStop(.48,"rgba(170,175,100,.065)");
     sun.addColorStop(1,"rgba(170,175,100,0)");
     ctx.fillStyle=sun;
     ctx.beginPath();
     ctx.moveTo(0,-h);
     ctx.quadraticCurveTo(w*1.4,-h*.15,w*.56,h*.72);
     ctx.quadraticCurveTo(-w*.38,h,-w*.78,h*.35);
     ctx.quadraticCurveTo(-w*1.12,-h*.52,0,-h);
     ctx.fill();ctx.restore()
    }
   }
  }
  // The continuity between nearby real crowns is an UNDERPAINTING, not a
  // canopy sprite pasted over the Wanderer or over existing road sprites.
  // Source road, water, and buildings always retain visible priority.
  let bridges=0;
  for(let i=0;i<roots.length&&bridges<20;i++){
   const a=roots[i];let b=null,distance=Infinity;
   for(let j=i+1;j<roots.length;j++){
    const c=roots[j],d=Math.hypot(a.x-c.x,a.y-c.y);
    if(d<140||d>440||d>=distance)continue;
    let allowed=true;
    for(const t of [.25,.5,.75]){
     const x=a.x+(c.x-a.x)*t,y=a.y+(c.y-a.y)*t;
     if(!forest(x,y)||geometry.waterAt(x,y,25)||
      geometry.nearRoad(x,y,()=>true,75)){
      allowed=false;break
     }
    }
    if(allowed){b=c;distance=d}
   }
   if(!b||!ctx.quadraticCurveTo)continue;
   const minx=Math.min(a.x,b.x)-150,maxx=Math.max(a.x,b.x)+150,
    miny=Math.min(a.y,b.y)-150,maxy=Math.max(a.y,b.y)+150;
   if(maxx<bounds[0]||minx>bounds[2]||
      maxy<bounds[1]||miny>bounds[3])continue;
   const mx=(a.x+b.x)*.5,my=(a.y+b.y)*.5;
   ctx.save();ctx.lineCap="round";
   ctx.strokeStyle="rgba(20,57,39,.085)";
   ctx.lineWidth=Math.min(135,(a.radius+b.radius)*1.3);
   ctx.beginPath();ctx.moveTo(a.x,a.y);
   ctx.quadraticCurveTo(mx-26,my+18,b.x,b.y);
   ctx.stroke();ctx.restore();bridges++
  }
  return shadows
 }



 // R37: native Greenwood Falls forest is rooted in actual physical
 // off-road trunks. No false collision, pasted scenery photo, or
 // randomly tiled backdrop: the ground shade and high canopy share
 // the same source root used by the live tree painter and movement.
 const fallsNode=(model?.nodes||[]).find(n=>n.id==="falls_overlook");
 const fallsAnchor=fallsNode?{
  x:fallsNode.point[0]*(model.worldDesign.worldUnitScale||60),
  y:fallsNode.point[1]*(model.worldDesign.worldUnitScale||60)}:null;
 function fallsRoots(bounds){
  if(!fallsAnchor||!footprint?.groves)return[];
  const s=fallsAnchor;
  if(bounds[2]<s.x-2250||bounds[0]>s.x+2250||
     bounds[3]<s.y-2050||bounds[1]>s.y+2050)return[];
  const vicinity=[s.x-1850,s.y-1650,s.x+1850,s.y+1750];
  return footprint.groves(vicinity,250).filter(o=>
   o.authoredFallsGrove&&["oak","pine"].includes(o.kind)&&
   !geometry.waterAt(o.x,o.y,10)).sort((x,y)=>x.y-y.y)
 }
 // R57: source-rooted Falls woodland apron. Connect existing authored
 // grove trunks with native painted undergrowth, not invented tree roots.
 function paintFallsGroveApron(ctx,bounds){
  if(!painted||!ctx?.drawImage||!fallsAnchor)return 0;
  const roots=fallsRoots(bounds),seen=new Set();let count=0;
  for(let i=0;i<roots.length;i++){
   const a=roots[i];
   let nearest=null,dist=Infinity;
   for(let j=i+1;j<roots.length;j++){
    const b=roots[j],d=Math.hypot(a.x-b.x,a.y-b.y);
    if(d>180&&d<460&&d<dist){nearest=b;dist=d}
   }
   if(!nearest)continue;
   const b=nearest,key=[a.id,b.id].sort().join(":");
   if(seen.has(key))continue;seen.add(key);
   const nx=-(b.y-a.y)/dist,ny=(b.x-a.x)/dist;
   const midx=(a.x+b.x)*.5,midy=(a.y+b.y)*.5;
   if(Math.abs(midx-fallsAnchor.x)<210&&
      Math.abs(midy-fallsAnchor.y)<450)continue;
   // Check the complete corridor before allowing a connected bed.
   let safe=true;
   for(let k=0;k<=12&&safe;k++){
    const t=k/12,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
    for(const off of [-32,0,32]){
     const px=x+nx*off,py=y+ny*off;
     if(!forest(px,py)||geometry.waterAt(px,py,18)||
        geometry.nearRoad(px,py,()=>true,55)||
        geometry.obstacle(px,py,22)||footprint.blocked?.(px,py,22)){
      safe=false;break
     }
    }
   }
   if(!safe)continue;
   // R58: three differentiated, connected woodland silhouettes. Native
   // R18 fern/stone paintings form an irregular foreground/middle/rear
   // composition between *existing* physical roots, not a repeated row.
   // World-root hashes keep the same arrangement across streamed chunks.
   const seed=Math.floor(hash(a.x,b.y,1571)*100003);
   const profile=Math.floor(hash(seed,dist,1581)*3);
   const layouts=[
    [[.11,-.72,1.15,2],[.24,.45,.82,2],[.36,-.20,1.02,3],
     [.49,.77,1.27,2],[.63,-.64,.90,3],[.76,.12,1.12,2],[.88,.58,.73,2]],
    [[.12,.48,.84,3],[.26,-.66,1.23,2],[.39,.15,.95,2],
     [.53,-.37,1.30,3],[.66,.72,.86,2],[.79,-.14,1.08,2],[.90,.41,.71,3]],
    [[.10,-.35,1.00,2],[.22,.71,.76,3],[.34,-.72,1.29,2],
     [.48,.16,1.06,2],[.61,.61,.88,3],[.74,-.49,1.22,2],[.89,.22,.83,2]]
   ];
   const layout=layouts[profile];
   for(let k=0;k<layout.length;k++){
    const [t,offset,scale,source]=layout[k];
    const lateral=offset*(34+hash(seed,k,1573)*22);
    const x=a.x+(b.x-a.x)*t+nx*lateral;
    const y=a.y+(b.y-a.y)*t+ny*lateral;
    const w=(88+hash(seed,k,1575)*44)*scale,h=w;
    // Protect the actual destination footprint, not just its centre.
    let clear=true;
    for(const fx of [.02,.26,.5,.74,.98]){
     for(const fy of [.02,.26,.5,.74,.98]){
      const px=x-w*.5+w*fx,py=y-h*.72+h*fy;
      if(!forest(px,py)||geometry.waterAt(px,py,16)||
         geometry.nearRoad(px,py,()=>true,48)||
         geometry.obstacle(px,py,18)||footprint.blocked?.(px,py,18)){
       clear=false;break
      }
     }
     if(!clear)break
    }
    if(!clear||x+w<bounds[0]||x-w>bounds[2]||
       y+h<bounds[1]||y-h>bounds[3])continue;
    ctx.save();
    ctx.globalAlpha=source===3?.41:.29+hash(seed,k,1591)*.13;
    ctx.imageSmoothingEnabled=true;
    // Stone accents and fern foliage have different natural silhouette
    // sizes; neither changes terrain or creates any collision.
    ctx.drawImage(painted,PAINTED_SIZE*source,0,
     PAINTED_SIZE,PAINTED_SIZE,Math.round(x-w*.5),
     Math.round(y-h*.72),Math.round(w),Math.round(h));
    ctx.restore();count++
   }
  }
  return count
 }
 function paintFallsRootedGorge(ctx,bounds){
  if(!painted||!ctx?.drawImage||!ctx?.createRadialGradient)return 0;
  let count=0;
  for(const o of fallsRoots(bounds)){
   const r=o.radius,rx=r*(o.kind==="oak"?5.4:4.2),
    px=o.x-r*.30,py=o.y-r*.94;
   if(px+rx<bounds[0]||px-rx>bounds[2]||
     py+rx<bounds[1]||py-rx>bounds[3])continue;
   const shade=ctx.createRadialGradient(px,py,r*.20,px,py,rx);
   shade.addColorStop(0,"rgba(22,53,38,.26)");
   shade.addColorStop(.48,"rgba(40,75,47,.15)");
   shade.addColorStop(.85,"rgba(74,113,66,.045)");
   shade.addColorStop(1,"rgba(76,113,66,0)");
   // R63: the complete old-growth gorge shadow is a dry-ground
   // material, not a translucent bridge across the actual river/road.
   // The same world-aligned stencil used by the woodland floor keeps
   // this broad root shadow off crossings and physical obstructions.
   withDryForestClip(ctx,px,py,rx,()=>{
    ctx.fillStyle=shade;
    ctx.fillRect(px-rx,py-rx,rx*2,rx*2);
   });
   ctx.save();
   // R40ap: ground the existing Falls root in an irregular, native
   // illustrated fern/lichen skirt. Three individually clear source-art
   // fragments follow the tree's real foot rather than repeating one
   // centered oval stamp. This is low ground pigment, not new scenery.
   const seed=Math.floor((o.variant||0)*8191);
   for(let i=0;i<3;i++){
    const angle=(i-1)*1.05+(hash(seed,i,1201)-.5)*.33;
    const reach=r*(i===1?.22:.78);
    const x=o.x+Math.sin(angle)*reach;
    const y=o.y+r*(.03+Math.cos(angle)*.15);
    const w=r*(1.45+hash(seed,i,1203)*.85);
    const h=w*(.44+hash(seed,i,1205)*.12);
    let clear=true;
    for(const fy of [-.45,0,.45]){
     for(const fx of [-.45,0,.45]){
      const sx=x+w*fx,sy=y-h*.46+h*fy;
      if(!forest(sx,sy)||geometry.waterAt(sx,sy,12)||
         geometry.nearRoad(sx,sy,()=>true,35)||
         geometry.obstacle(sx,sy,22)){
       clear=false;break
      }
     }
     if(!clear)break
    }
    if(!clear)continue;
    ctx.globalAlpha=.25+hash(seed,i,1207)*.17;
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(painted,PAINTED_SIZE*2,0,PAINTED_SIZE,PAINTED_SIZE,
     Math.round(x-w*.5),Math.round(y-h*.82),
     Math.round(w),Math.round(h));
   }
   ctx.restore();count++
  }
  return count
 }
 function paintFallsCanopyBoughs(ctx,bounds,roots){
  if(!painted||!ctx?.drawImage||!fallsAnchor||!Array.isArray(roots))
   return 0;
  let count=0;
  const seen=new Set();
  for(const root of roots){
   if(!root?.authoredFallsGrove||seen.has(root.id)||
      geometry.waterAt(root.x,root.y,12))continue;
   seen.add(root.id);
   // R40ab: compose two staggered painted canopy tiers from each REAL
   // old-growth crown instead of a single identical flat horizontal stamp.
   // The native R18 source painting is used intact (never stretched into
   // a long strip). These boughs are visual only, with no new tree roots.
   const r=root.radius,seed=Math.floor((root.variant||0)*8191);
   for(let tier=0;tier<2;tier++){
    const oak=root.kind==="oak";
    const w=r*(oak?3.10:2.72)*(tier===0?1:.78)*
     (.90+hash(seed,tier,963)*.22);
    // Keep the original R18 crown crop at its exact pixel aspect ratio.
    // The former .82 pine scale stretched painted foliage vertically.
    const h=w*90/PAINTED_SIZE;
    const side=(hash(seed,tier,965)>.5?1:-1);
    const x=root.x+side*r*(tier===0?.72:1.18);
    const y=root.y-r*(oak?3.85:4.45)+tier*r*.56;
    if(x-w*.5>bounds[2]||x+w*.5<bounds[0]||
       y-h>bounds[3]||y<bounds[1])continue;
    // Preserve the real overlook stair, bridges, and visible paths.
    // A bough must be clear across its footprint, not only at its root.
    if(Math.abs(x-fallsAnchor.x)<w*.5+120&&
       y+h>fallsAnchor.y-165)continue;
    const clear=(px,py)=>forest(px,py)&&
      !geometry.waterAt(px,py,30)&&
      !geometry.nearRoad(px,py,()=>true,75);
    // R40ac: inspect the entire visible canopy footprint, not just five
    // points. A narrow diagonal trail can pass between the old samples,
    // leaving an opaque painted crown over an otherwise traversable path.
    // Three depth rows and five lateral stations follow the actual source
    // road/water clearance without creating any new physical geometry.
    let open=true;
    for(const depth of [.16,.36,.56,.76,.94]){
     for(const across of [-.46,-.23,0,.23,.46]){
      if(!clear(x+w*across,y-h*depth)){open=false;break}
     }
     if(!open)break
    }
    if(!open)continue;
    ctx.save();ctx.globalAlpha=tier===0?.80:.68;
    ctx.imageSmoothingEnabled=true;
    const src=oak?0:PAINTED_SIZE;
    ctx.drawImage(painted,src,0,PAINTED_SIZE,90,
     Math.round(x-w*.5),Math.round(y-h),Math.round(w),
     Math.round(h));
    ctx.restore();count++
   }
  }
  return count
 }


 // R38: the full foreground view uses larger connected undergrowth,
 // founded on the REAL R38 tree trunks and the existing stair centerline.
 // The ground painter is below roads and never changes collision.
 const fallsStair=model?.edges?.find(e=>e.id==="falls_e--falls_overlook");
 const fallsNodes=Object.fromEntries((model?.nodes||[]).map(n=>
  [n.id,n.point.map(v=>v*(model.worldDesign.worldUnitScale||60))]));
 function paintFallsComposedGround(ctx,bounds){
  if(!painted||!ctx?.drawImage||!fallsAnchor||
     !ctx?.createRadialGradient)return 0;
  let count=0;
  const visible=(x,y,pad=340)=>x>bounds[0]-pad&&
   x<bounds[2]+pad&&y>bounds[1]-pad&&y<bounds[3]+pad;
  // Properly grounded forest shoulders: the real old-growth roots
  // supply one shaded landscape mass with TWO ORIGINAL R18 fern
  // paintings, not long stretched bands of repeated texture.
  for(const root of fallsRoots(bounds)){
   if(!root.authoredFallsFrameR38||!visible(root.x,root.y))continue;
   const x=root.x,y=root.y,r=root.radius,
    side=Math.sign(x-fallsAnchor.x)||1,
    radius=r*(root.kind==="oak"?5.1:4.4);
   const moss=ctx.createRadialGradient(x-r*.35,y-r*.75,r*.2,
    x,y-r*.32,radius);
   moss.addColorStop(0,"rgba(21,53,35,.39)");
   moss.addColorStop(.40,"rgba(39,74,46,.26)");
   moss.addColorStop(.78,"rgba(70,108,68,.075)");
   moss.addColorStop(1,"rgba(75,109,65,0)");
   ctx.save();ctx.fillStyle=moss;
   ctx.fillRect(x-radius,y-radius,radius*2,radius*2);ctx.restore();
   for(let i=0;i<2;i++){
    const px=x+side*r*(i===0?1.18:-.78),
     py=y-r*(i===0?.23:.58);
    if(!visible(px,py,180)||geometry.waterAt(px,py,24)||
       geometry.nearRoad(px,py,()=>true,40))continue;
    const w=r*(i===0?2.1:1.85),h=w*(i===0?.83:1.03);
    ctx.save();ctx.globalAlpha=i===0?.78:.64;
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(painted,PAINTED_SIZE*2,0,PAINTED_SIZE,PAINTED_SIZE,
     Math.round(px-w*.5),Math.round(py-h*.8),
     Math.round(w),Math.round(h));
    ctx.restore();count++
   }
  }
  // The actual climbable stone approach receives subtly planted,
  // physically grounded native fern margins. No fake stair/stone wall.
  const a=fallsNodes[fallsStair?.from],b=fallsNodes[fallsStair?.to];
  if(a&&b){
   const dx=b[0]-a[0],dy=b[1]-a[1],
    len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
   // R59: compose both shoulders as staggered, unequal groups instead
   // of sixteen regularly spaced identical fern stamps. Each native
   // painting is checked across its actual destination footprint.
   const shoulderProfiles=[
    [[.49,194,116,2],[.61,246,86,3],[.76,183,134,2],[.88,259,98,3]],
    [[.54,223,142,3],[.67,180,96,2],[.79,267,125,2],[.93,209,82,3]]
   ];
   for(const side of [-1,1]){
    const profile=shoulderProfiles[side<0?0:1];
    for(const [t,offset,size,source] of profile){
     const px=a[0]+dx*t+nx*offset*side,
      py=a[1]+dy*t+ny*offset*side;
     if(!visible(px,py,size))continue;
     const left=px-size*.5,top=py-size*.80;
     let clear=true;
     for(const fy of [.02,.26,.5,.74,.98]){
      for(const fx of [.02,.26,.5,.74,.98]){
       const sx=left+size*fx,sy=top+size*fy;
       if(!forest(sx,sy)||geometry.waterAt(sx,sy,24)||
          geometry.obstacle(sx,sy,24)||
          geometry.nearRoad(sx,sy,()=>true,50)||
          footprint.blocked?.(sx,sy,18)){
        clear=false;break
       }
      }
      if(!clear)break
     }
     if(!clear)continue;
     // The ground tint belongs to the same verified painting footprint,
     // rather than an unmasked gradient that could bleed into the river.
     ctx.save();ctx.globalAlpha=source===3?.48:.60;
     ctx.imageSmoothingEnabled=true;
     ctx.drawImage(painted,PAINTED_SIZE*source,0,
      PAINTED_SIZE,PAINTED_SIZE,
      Math.round(left),Math.round(top),size,size);
     ctx.restore();count++
    }
   }
  }
  return count
 }


 // R39: source-bound, site-composed rock and forest floor at the
 // ACTUAL Falls overlook. These are shallow, traversable painted
 // ground terraces only: no false towering cliff, fake collider, new
 // walkway, procedural checkerboard, or unrelated image billboards.
 // Exactly the native R18 rock/fern art shared by existing real trees.
 // All shapes are GLOBAL world positions to preserve chunk seams.
 const fallsRockComposition=[
  // R39c: shift authentic groundstone toward the CURRENT playable 720px
  // camera rather than measuring pieces that live beyond its top/edges.
  // The R36 native real landmark rock remains the formation's anchor.
  {dx:-292,dy:-82,w:237,h:148,lean:-.10,flip:false,depth:.94},
  {dx:201,dy:-183,w:273,h:167,lean:.12,flip:true,depth:1},
  {dx:-288,dy:88,w:221,h:140,lean:.08,flip:true,depth:.86},
  {dx:179,dy:-19,w:232,h:148,lean:-.07,flip:false,depth:.93},
  {dx:-258,dy:212,w:206,h:132,lean:-.11,flip:false,depth:.74},
  {dx:205,dy:134,w:223,h:137,lean:.10,flip:true,depth:.79},
  // Background shallow ledges visually connect to rooted forest edges.
  {dx:-526,dy:-338,w:211,h:141,lean:-.13,flip:false,depth:.70},
  {dx:407,dy:-290,w:249,h:144,lean:.07,flip:true,depth:.80}
 ];
 function fallsRockCandidates(){return fallsRockComposition.map((o,i)=>({
  ...o,id:"falls_rock_bed_"+i,x:fallsAnchor.x+o.dx,
  y:fallsAnchor.y+o.dy,groundOnly:true
 })) }
 function paintFallsEscarpmentFloor(ctx,bounds){
  if(!painted||!fallsAnchor||!ctx?.drawImage||
     !ctx?.createRadialGradient||!ctx?.beginPath)return 0;
  const minx=fallsAnchor.x-1200,miny=fallsAnchor.y-1150,
   maxx=fallsAnchor.x+1200,maxy=fallsAnchor.y+1150;
  if(bounds[0]>maxx||bounds[2]<minx||
     bounds[1]>maxy||bounds[3]<miny)return 0;
  let paintedBeds=0;
  for(const o of fallsRockCandidates()){
   const{x,y,w,h}=o;
   if(x+w*.85<bounds[0]||x-w*.85>bounds[2]||
      y+h*.9<bounds[1]||y-h*1.3>bounds[3])continue;
   if(!footprint.onLand(x,y)||!forest(x,y)||
     geometry.waterAt(x,y,42)||geometry.obstacle(x,y,20))continue;
   // Native road is always drawn later on top of *shallow* soil/stone;
   // however an actual step centre does not receive a standing rock.
   if(geometry.nearRoad(x,y,()=>true,84))continue;
   // Continuous original ground colour blends every low stone/moss
   // mass into one connected hillside, instead of loose scenic props.
   const shadow=ctx.createRadialGradient(x-w*.06,y-h*.28,4,
    x+w*.04,y-h*.06,w*.84);
   shadow.addColorStop(0,"rgba(22,48,41,.42)");
   shadow.addColorStop(.40,"rgba(55,82,67,.28)");
   shadow.addColorStop(.75,"rgba(83,111,80,.12)");
   shadow.addColorStop(1,"rgba(92,123,87,0)");
   ctx.save();ctx.fillStyle=shadow;
   ctx.fillRect(x-w,y-w,w*2,w*2);
   // An organic, shallow eroded shelf; no crisp grey polygons or
   // full-height painted rock face implying false collisions.
   ctx.beginPath();
   ctx.moveTo(x-w*.54,y+h*.04);
   ctx.quadraticCurveTo(x-w*.48,y-h*.40,x-w*.21,y-h*.51);
   ctx.quadraticCurveTo(x+w*.07,y-h*.66,x+w*.34,y-h*.37);
   ctx.quadraticCurveTo(x+w*.60,y-h*.12,x+w*.49,y+h*.14);
   ctx.quadraticCurveTo(x+w*.21,y+h*.34,x-w*.18,y+h*.25);
   ctx.quadraticCurveTo(x-w*.48,y+h*.25,x-w*.54,y+h*.04);
   ctx.closePath();
   const stone=ctx.createLinearGradient?.(x,y-h*.55,x,y+h*.25);
   if(stone){
    stone.addColorStop(0,"rgba(132,147,121,.24)");
    stone.addColorStop(.36,"rgba(86,107,91,.22)");
    stone.addColorStop(.78,"rgba(43,68,60,.105)");
    stone.addColorStop(1,"rgba(34,67,51,0)");
   }
   ctx.fillStyle=stone||"rgba(83,105,85,.12)";
   ctx.fill();ctx.restore();
   // Original R18 transparent rock silhouette keeps its full native
   // contour, with restrained translucency so it reads as integrated
   // foot-level bedrock rather than a solid inaccessible obelisk.
   const nativeW=Math.round(w*.91),nativeH=Math.round(h*.90);
   ctx.save();
   ctx.globalAlpha=.74*o.depth;
   ctx.imageSmoothingEnabled=true;
   ctx.translate(Math.round(x),Math.round(y));
   ctx.rotate?.(o.lean);
   if(o.flip)ctx.scale(-1,1);
   ctx.drawImage(painted,PAINTED_SIZE*3,0,
    PAINTED_SIZE,PAINTED_SIZE,
    -Math.round(nativeW*.5),-Math.round(nativeH*.77),
    nativeW,nativeH);
   ctx.restore();paintedBeds++;
   // Original forest fern art grows at one varied foot of each rock
   // grouping. Dimensions preserve the native image proportions.
   const sign=o.flip?-1:1,
    fx=x+sign*w*.34,fy=y+h*.14;
   if(!geometry.waterAt(fx,fy,15)&&
      !geometry.nearRoad(fx,fy,()=>true,38)){
    const fern=Math.round(w*.43);
    ctx.save();ctx.globalAlpha=.72*o.depth;
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(painted,PAINTED_SIZE*2,0,
      PAINTED_SIZE,PAINTED_SIZE,
      Math.round(fx-fern*.5),Math.round(fy-fern*.83),
      fern,fern);
    ctx.restore();paintedBeds++
   }
  }
  return paintedBeds
 }
 // R39: increase the visual depth of the *actual physical Frostbridge
 // riverbank*, not of an invented cliff next to the overlook. Banks
 // remain attached to the existing dry and water-verified R34 sources.
 function paintFallsRiverNativeLedges(ctx,bounds){
  if(!painted||!ctx?.drawImage||!ctx?.createRadialGradient)return 0;
  const sources=sourceFallsBanks(),seen=new Set();
  let count=0;
  // R69: each river reach is one source-grounded material composition,
  // not a procession of identical centered boulder stamps. The three
  // independently authored R68 shale studies overlap in staggered tiers
  // around the original dry-bank anchor. No new world objects are added.
  for(const o of sources){
   const key=o.segment+":"+o.side+":"+Math.floor(o.step/10);
   if(seen.has(key))continue;
   if(o.x<bounds[0]-320||o.x>bounds[2]+320||
      o.y<bounds[1]-300||o.y>bounds[3]+300||
      geometry.waterAt(o.x,o.y,0)||
      geometry.nearRoad(o.x,o.y,()=>true,115))continue;
   seen.add(key);
   const vx=o.x-o.wx,vy=o.y-o.wy;
   const len=Math.hypot(vx,vy)||1,nx=vx/len,ny=vy/len;
   const tx=-ny,ty=nx,seed=o.segment*131+o.step*17+o.side*7;
   const w=180+hash(seed,4,1601)*62;
   const bank=ctx.createRadialGradient(o.x,o.y-35,6,o.x,o.y,w*.90);
   bank.addColorStop(0,"rgba(32,63,52,.26)");
   bank.addColorStop(.65,"rgba(63,100,77,.10)");
   bank.addColorStop(1,"rgba(77,112,87,0)");
   // A broad shaded ground plane connects the three native paintings.
   // The entire plane is clipped against actual roads, water and solids.
   withDryForestClip(ctx,o.x,o.y,w*.92,()=>{
    ctx.save();ctx.fillStyle=bank;
    ctx.fillRect(o.x-w,o.y-w,w*2,w*2);ctx.restore()
   });
   const tiers=[
    {along:-.25,out:.12,scale:.92,alpha:.77},
    {along:.20,out:.29,scale:.78,alpha:.66},
    {along:-.04,out:.50,scale:.58,alpha:.57}
   ];
   for(let k=0;k<tiers.length;k++){
    const t=tiers[k],cx=o.x+tx*w*t.along+nx*w*t.out,
     cy=o.y+ty*w*t.along+ny*w*t.out;
    const size=w*t.scale,h=size*.61;
    if(cx+size<bounds[0]||cx-size>bounds[2]||
       cy+size<bounds[1]||cy-size>bounds[3])continue;
    // World-aligned source mask prevents a tall art crop from covering
    // the river, original paths, crossings, or any physical obstruction.
    let accepted=0;const step=24,left=cx-size*.5,top=cy-h*.78;
    ctx.save();ctx.beginPath();
    for(let yy=Math.floor(top/step)*step;yy<top+h;yy+=step)
     for(let xx=Math.floor(left/step)*step;xx<left+size;xx+=step){
      const x0=Math.max(left,xx),y0=Math.max(top,yy);
      const x1=Math.min(left+size,xx+step),y1=Math.min(top+h,yy+step);
      if(x1<=x0||y1<=y0)continue;
      let clear=true;
      for(const fy of [.2,.5,.8])for(const fx of [.2,.5,.8]){
       const px=x0+(x1-x0)*fx,py=y0+(y1-y0)*fy;
       if(!forest(px,py)||!footprint.onLand(px,py)||
          geometry.waterAt(px,py,9)||
          geometry.nearRoad(px,py,()=>true,30)||
          geometry.obstacle(px,py,12)||
          footprint.blocked?.(px,py,12))clear=false
      }
      if(!clear)continue;
      if(typeof ctx.rect==="function")ctx.rect(x0,y0,x1-x0,y1-y0);
      else{ctx.moveTo(x0,y0);ctx.lineTo(x1,y0);
       ctx.lineTo(x1,y1);ctx.lineTo(x0,y1);ctx.closePath()}
      accepted++
     }
    if(!accepted){ctx.restore();continue}
    ctx.clip();ctx.globalAlpha=t.alpha;ctx.imageSmoothingEnabled=true;
    const variant=(Math.abs(seed)+k+(o.side>0?1:0))%3;
    if(fallsBankStudies){
     ctx.drawImage(fallsBankStudies,variant*128,0,128,128,
      Math.round(left),Math.round(top),Math.round(size),Math.round(h))
    }else{
     ctx.drawImage(painted,PAINTED_SIZE*3,0,PAINTED_SIZE,PAINTED_SIZE,
      Math.round(left),Math.round(top),Math.round(size),Math.round(h))
    }
    ctx.restore();count++
   }
  }
  return count
 }

 // R34: Greenwood Falls' banks are drawn from the authoritative
 // FROSTBRIDGE RIVER centreline and dry, walkable shore, not guessed
 // decorative stepping stones or an invented waterfall collision mesh.
 // The original R18 mossy-rock painting provides every low rock shelf.
 // Water, bridges, physical roads, and the existing lake remain untouched.
 let fallsBanks=null;
 function sourceFallsBanks(){
  if(fallsBanks)return fallsBanks;
  fallsBanks=[];
  const river=(model?.waterways||[]).find(w=>
   w.id==="frostbridge_river"&&Array.isArray(w.centerline));
  const unit=model?.worldDesign?.worldUnitScale||60;
  if(!river||river.centerline.length<8)return fallsBanks;
  const line=river.centerline.map(p=>p.map(v=>v*unit));
  // Lower two reaches frame Greenwood Falls. Earlier snow and Thawline
  // river stretches retain their original art and different biomes.
  for(let i=6;i<line.length;i++){
   const a=line[i-1],b=line[i];
   const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
   if(length<1)continue;
   const nx=-dy/length,ny=dx/length;
   const steps=Math.ceil(length/110);
   for(let k=0;k<=steps;k++){
    const t=k/steps,cx=a[0]+dx*t,cy=a[1]+dy*t;
    // Only the actual river centre and its physically registered
    // water hazard can anchor a bank.
    if(geometry.waterAt(cx,cy,0)?.id!=="frostbridge_river")continue;
    for(const side of [-1,1]){
     let source=null;
     for(let offset=184;offset<=310;offset+=14){
      const x=cx+nx*side*offset,y=cy+ny*side*offset;
      const region=footprint.regionAt(x,y)?.id;
      if(region!=="greenwood_falls"&&region!=="greenwood")continue;
      if(!footprint.onLand(x,y)||
       geometry.waterAt(x,y,0)||geometry.obstacle(x,y,18)||
       footprint.blocked?.(x,y,18))continue;
      if(geometry.nearRoad(x,y,()=>true,135))break;
      source={x,y,wx:cx+nx*side*(offset-27),
       wy:cy+ny*side*(offset-27),dir:Math.atan2(dy,dx),
       segment:i,step:k,side,solidSource:true};
      break
     }
     if(source)fallsBanks.push(source)
    }
   }
  }
  return fallsBanks
 }
 function paintFallsRiverBanks(ctx,bounds){
  if(!painted||!ctx?.drawImage||!ctx?.beginPath)return 0;
  const sources=sourceFallsBanks();
  if(!sources.length)return 0;
  const inFrame=p=>p.x>bounds[0]-300&&p.x<bounds[2]+300&&
   p.y>bounds[1]-310&&p.y<bounds[3]+310;
  // R35: replace the rigid multi-stroke shoreline rails with continuous
  // THREE-PLANE riverside escarpments. Every boundary below comes from
  // a single true, dry bank anchor with a verified water-facing source.
  // This is scenic low-relief rock, not a new cliff collider or walkable ford.
  const normal=o=>{
   const dx=o.x-o.wx,dy=o.y-o.wy,d=Math.hypot(dx,dy)||1;
   return {x:dx/d,y:dy/d}
  };
  const inset=(o,depth)=>{
   const n=normal(o),bend=(Math.sin(o.x*.0041+o.y*.0032)*37+
    Math.cos(o.y*.0083-o.x*.0051)*17)*(depth/137);
   // Only the outer dry face meanders. The inner shoreline remains
   // faithful to the original water hazard and bridge continuity.
   return {x:o.x+n.x*(depth+bend),y:o.y+n.y*(depth+bend)}
  };
  const smooth=(points,move=true)=>{
   if(!points.length)return;
   if(move)ctx.moveTo(points[0].x,points[0].y);
   else ctx.lineTo(points[0].x,points[0].y);
   for(let i=1;i<points.length-1;i++){
    const a=points[i],b=points[i+1];
    if(ctx.quadraticCurveTo)
     ctx.quadraticCurveTo(a.x,a.y,(a.x+b.x)*.5,(a.y+b.y)*.5);
    else ctx.lineTo(a.x,a.y)
   }
   const end=points[points.length-1];
   ctx.lineTo(end.x,end.y)
  };
  // Runs cannot connect across original roads/decks or a gap in physical
  // bank sourcing. Full runs are deterministic WORLD geometry: each chunk
  // clips them; they do not restart a brush pattern at chunk boundaries.
  const runs=[];
  for(const side of [-1,1]){
   let run=[];
   const flush=()=>{if(run.length>2)runs.push(run);run=[]};
   for(const o of sources.filter(x=>x.side===side)){
    const prev=run[run.length-1];
    const nearCrossing=geometry.nearRoad(o.x,o.y,
     e=>!!e.crossing,152);
    const discontinuity=prev&&(
     Math.hypot(o.x-prev.x,o.y-prev.y)>168||
     geometry.nearRoad((o.x+prev.x)*.5,(o.y+prev.y)*.5,
      ()=>true,110));
    if(nearCrossing||discontinuity)flush();
    if(!nearCrossing)run.push(o)
   }
   flush()
  }
  let terraces=0,fernMasses=0;
  for(const run of runs){
   if(!run.some(inFrame))continue;
   const water=run.map(o=>({x:o.wx,y:o.wy}));
   const mid=run.map(o=>inset(o,64));
   const upper=run.map(o=>inset(o,137));
   // R41: retire the remaining four continuous contour rails. Even with
   // faint alpha, their 116/85-unit widths read as artificial parallel
   // strips along the real river. Build a broken, source-grounded river
   // terrace from the EXISTING R18 transparent stone and fern paintings.
   // Each irregular island follows an original dry-bank anchor and is
   // culled independently near the true river, bridge and road corridors.
   // There is no new walkable shelf, cliff collider or fabricated ford.
   for(let i=2;i<run.length;i+=5){
    const o=run[i],n=normal(o);
    const seed=Math.floor(hash(o.segment,o.step,o.side)*100003);
    const depth=57+hash(seed,1,1301)*83;
    const p=inset(o,depth);
    const w=112+hash(seed,2,1303)*108;
    const h=w; // R49: preserve the original square painted stone sheet
    if(!inFrame(p)||!forest(p.x,p.y)||
       geometry.waterAt(p.x,p.y,16)||
       geometry.nearRoad(p.x,p.y,()=>true,100)||
       footprint.blocked?.(p.x,p.y,18))continue;
    // The visible painting must remain dry across its *whole* footprint,
    // not merely at its anchor. Use small native rock fragments instead
    // of long image strips that bridge over crossing gaps.
    let safe=true;
    for(const fy of [.03,.265,.5,.735,.97]){
     for(const fx of [-.47,-.235,0,.235,.47]){
      // Sample the true R41 destination: top at -.76h, bottom
      // at +.24h. Earlier sampling straddled only the upper half.
      const sx=p.x+w*fx,sy=p.y-h*.76+h*fy;
      if(!forest(sx,sy)||geometry.waterAt(sx,sy,12)||
         geometry.nearRoad(sx,sy,()=>true,32)||
         geometry.obstacle(sx,sy,12)||footprint.blocked?.(sx,sy,12)){
       safe=false;break
      }
     }
     if(!safe)break
    }
    if(!safe)continue;
    const angle=Math.atan2(n.y,n.x)*.10;
    ctx.save();
    ctx.globalAlpha=.34+hash(seed,4,1307)*.24;
    ctx.imageSmoothingEnabled=true;
    ctx.translate(Math.round(p.x),Math.round(p.y));
    ctx.rotate?.(angle);
    if(o.side<0)ctx.scale(-1,1);
    ctx.drawImage(painted,PAINTED_SIZE*3,0,PAINTED_SIZE,PAINTED_SIZE,
     Math.round(-w*.5),Math.round(-h*.76),
     Math.round(w),Math.round(h));
    // Alternate with the *original* fern material at smaller, native
    // proportions; no repeated geometric cliff contour is painted.
    if(i%2===0){
     const fw=w*(.62+hash(seed,5,1309)*.15),fh=fw;
     ctx.globalAlpha=.24+hash(seed,6,1311)*.13;
     ctx.drawImage(painted,PAINTED_SIZE*2,0,
      PAINTED_SIZE,PAINTED_SIZE,
      Math.round(-fw*.42),Math.round(-fh*.35),
      Math.round(fw),Math.round(fh))
    }
    ctx.restore()
   }
   // Organic shaded shelves grow directly from individual dry, physically
   // sourced ledges and fade smoothly to zero. Native moss and stone art
   // sits above them; nothing creates straight boxed cliff edges.
   if(ctx.createRadialGradient){
    for(let i=3;i<run.length;i+=9){
     const o=run[i],p=inset(o,83);
     if(!inFrame(o)||geometry.waterAt(p.x,p.y,0)||
        geometry.nearRoad(p.x,p.y,()=>true,115))continue;
     const span=220+hash(o.segment,i,o.side)*65;
     // R63: terrace pigment belongs to the dry native bank only.
     // Clip the whole elliptical gradient, not just its centre point.
     withDryForestClip(ctx,p.x,p.y,span,()=>{
      ctx.save();ctx.translate(p.x,p.y);ctx.scale(span,span*.43);
      const stone=ctx.createRadialGradient(0,0,.05,0,0,1);
      stone.addColorStop(0,"rgba(53,84,68,.15)");
      stone.addColorStop(.43,"rgba(80,108,80,.095)");
      stone.addColorStop(1,"rgba(91,119,84,0)");
      ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);
      ctx.fillStyle=stone;ctx.fill();ctx.restore()
     })
    }
   }
   terraces++;
   // R48: the river's upper forest edge is a composed sequence of native
   // painted moss, stone and fern clusters, rather than 315x147 squashed
   // copies of one fern sheet. The dry-bank source and its tangent define
   // each composition; every independently drawn crop checks its full
   // footprint against the original river, road and physical obstacles.
   for(let i=3;i<run.length;i+=11){
    const o=run[i],n=normal(o),t={x:-n.y,y:n.x};
    const seed=Math.floor(hash(o.segment,o.step,o.side)*100003);
    const base=inset(o,104);
    if(!inFrame(o))continue;
    // R50: three individually authored bank silhouettes. The same four
    // identical fern/stone stamps on every reach read as a tiled shoreline.
    // Alternate a low broken-stone shelf, a fern-rich woodland shoulder,
    // and a tapered mossy outcrop; mirror by physical bank side below.
    // Every piece still passes the original nine-point dry-ground test.
    // R51: five reach-scale silhouettes avoid the repeating three-bank rhythm.
// Physical segment and bank side determine the stable pattern, never the
// streamed chunk bounds; all pieces retain the original dry-footprint guard.
const profile=(Math.floor(o.segment*1.618)+Math.floor(o.step/11)*2+(o.side>0?3:0))%5;
    const profiles=[
     [
      {along:-124,out:14,size:158,cell:3,alpha:.60},
      {along:-49,out:63,size:102,cell:2,alpha:.47},
      {along:41,out:17,size:178,cell:3,alpha:.54},
      {along:127,out:79,size:92,cell:2,alpha:.37}
     ],
     [
      {along:-136,out:52,size:116,cell:2,alpha:.43},
      {along:-68,out:9,size:164,cell:3,alpha:.50},
      {along:15,out:93,size:172,cell:2,alpha:.64},
      {along:106,out:38,size:133,cell:2,alpha:.49},
      {along:160,out:94,size:82,cell:3,alpha:.31}
     ],
     [
      {along:-112,out:31,size:128,cell:3,alpha:.49},
      {along:-37,out:88,size:100,cell:2,alpha:.38},
      {along:54,out:7,size:185,cell:3,alpha:.58},
      {along:151,out:47,size:113,cell:2,alpha:.43}
     ],
     // A split boulder terrace with a sheltered fern pocket.
     [
      {along:-163,out:41,size:148,cell:3,alpha:.57},
      {along:-77,out:105,size:96,cell:2,alpha:.36},
      {along:8,out:30,size:122,cell:3,alpha:.62},
      {along:84,out:82,size:119,cell:2,alpha:.51},
      {along:156,out:13,size:106,cell:3,alpha:.41}
     ],
     // A low, fern-led bend with small intermittent stone shoulders.
     [
      {along:-149,out:73,size:132,cell:2,alpha:.55},
      {along:-63,out:28,size:89,cell:3,alpha:.36},
      {along:12,out:105,size:171,cell:2,alpha:.62},
      {along:104,out:18,size:102,cell:3,alpha:.48},
      {along:173,out:74,size:113,cell:2,alpha:.43}
     ]
    ];
    const parts=profiles[profile];
    let composed=0;
    for(const [j,part] of parts.entries()){
     const jitter=(hash(seed,j,1451)-.5)*18;
     const px=base.x+t.x*(part.along+jitter)+n.x*part.out;
     const py=base.y+t.y*(part.along+jitter)+n.y*part.out;
     const w=part.size*(.92+hash(seed,j,1453)*.16);
     const h=w; // Original R18 paintings are square; never stretch them.
     if(!inFrame({x:px,y:py}))continue;
     let clear=true;
     // Check corners, sides and centre of the actual painted footprint.
     for(const fx of [-.48,-.24,0,.24,.48]){
      for(const fy of [.02,.26,.5,.74,.98]){
       // Destination is y-h*.78 through y+h*.22, not centred
       // at y-h*.78. The old samples missed the lower river-facing
       // edge and sampled empty space above the actual painting.
       const x=px-w*.5+(fx+.5)*w,y=py-h*.78+fy*h;
       if(!forest(x,y)||geometry.waterAt(x,y,18)||
          geometry.nearRoad(x,y,()=>true,62)||
          geometry.obstacle(x,y,18)||footprint.blocked?.(x,y,18)){
        clear=false;break
       }
      }
      if(!clear)break
     }
     if(!clear)continue;
     ctx.save();ctx.globalAlpha=part.alpha;
     ctx.translate(Math.round(px),Math.round(py));
     if(o.side<0)ctx.scale(-1,1);
     ctx.imageSmoothingEnabled=true;
     ctx.drawImage(painted,PAINTED_SIZE*part.cell,0,
      PAINTED_SIZE,PAINTED_SIZE,
      Math.round(-w*.5),Math.round(-h*.78),
      Math.round(w),Math.round(h));
     ctx.restore();composed++
    }
    if(composed)fernMasses++
   }
  }
  // R42: compose the authentic dry-bank outcrops as staggered native
  // stone, lichen and fern clusters rather than identical isolated stamps.
  // All painted pieces stay on their own verified source-bank land, away
  // from bridge decks, road shoulders and physical water. These are
  // transparent R18 paintings only: no new collision or terrain mesh.
  let rocks=0;
  for(let i=0;i<sources.length;i++){
   const o=sources[i];
   if(o.step%7!==3||!inFrame(o))continue;
   const n=normal(o),seed=Math.floor(hash(o.segment,o.step,o.side)*100003);
   const scale=.78+hash(seed,10,1317)*.33;
   const pieces=[
    {depth:22,tangent:-37,w:166*scale,cell:3,alpha:.69},
    {depth:63,tangent:48,w:124*scale,cell:3,alpha:.43},
    {depth:99,tangent:-14,w:136*scale,cell:2,alpha:.47}
   ];
   const tangent={x:-n.y,y:n.x};
   for(const [j,piece] of pieces.entries()){
    const px=o.x+n.x*piece.depth+tangent.x*piece.tangent,
     py=o.y+n.y*piece.depth+tangent.y*piece.tangent;
    const w=piece.w,h=w; // R49: native aspect on both bank faces
    if(!inFrame({x:px,y:py})||!forest(px,py))continue;
    // Source artwork extends around its foot; reject any candidate whose
    // sampled visible footprint reaches the river, roads or hard obstacles.
    let clear=true;
    for(const fx of [-.46,0,.46]){
     for(const fy of [-.46,0,.46]){
      const xx=px+w*fx,yy=py-h*.55+h*fy;
      if(!forest(xx,yy)||geometry.waterAt(xx,yy,8)||
         geometry.nearRoad(xx,yy,()=>true,35)||
         geometry.obstacle(xx,yy,8)||footprint.blocked?.(xx,yy,8)){
       clear=false;break
      }
     }
     if(!clear)break
    }
    if(!clear)continue;
    ctx.save();ctx.globalAlpha=piece.alpha;
    ctx.translate(Math.round(px),Math.round(py));
    ctx.rotate?.((hash(seed,j,1321)-.5)*.18);
    if(o.side<0)ctx.scale(-1,1);
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(painted,PAINTED_SIZE*piece.cell,0,
     PAINTED_SIZE,PAINTED_SIZE,
     Math.round(-w*.5),Math.round(-h*.75),
     Math.round(w),Math.round(h));
    ctx.restore();rocks++
   }
  }
  return terraces+fernMasses+rocks
 }
 

 // R52: connect real Falls woodland roots to physically sourced riverbanks.
 // Four asymmetrical native R18 crops per composition, no invented terrain.
 function paintFallsWoodlandBankTransition(ctx,bounds){
  if(!painted||!ctx?.drawImage||!fallsAnchor)return 0;
  const roots=fallsRoots(bounds).filter(r=>r.authoredFallsGrove&&
   (r.kind==="oak"||r.kind==="pine"));
  if(!roots.length)return 0;
  // R53: treat each real grove-to-river corridor as a single landscape
  // composition. Vary silhouette and material rhythm by source reach,
  // rather than repeating four equal-sized stamps at every bank anchor.
  const used=new Set(),paintedFootprints=[];let count=0;
  const compositions=[
   // Shallow broken-rock threshold: dark geology, then airy fern floor.
   [{at:.22,side:-65,size:176,cell:3,alpha:.58},
    {at:.41,side:58,size:113,cell:3,alpha:.40},
    {at:.63,side:-35,size:142,cell:2,alpha:.48},
    {at:.83,side:66,size:96,cell:2,alpha:.32}],
   // Deep woodland pocket: fern mass with scattered stone shoulders.
   [{at:.25,side:48,size:119,cell:2,alpha:.38},
    {at:.44,side:-76,size:151,cell:2,alpha:.55},
    {at:.65,side:41,size:108,cell:3,alpha:.43},
    {at:.85,side:-31,size:137,cell:2,alpha:.40}],
   // Staggered stony bend with a low fern opening at its center.
   [{at:.24,side:-44,size:139,cell:3,alpha:.47},
    {at:.46,side:79,size:109,cell:2,alpha:.36},
    {at:.67,side:-72,size:163,cell:3,alpha:.51},
    {at:.86,side:34,size:121,cell:2,alpha:.43}],
   // Long, restrained shale shelf with one woodland-softened shoulder.
   [{at:.18,side:-38,size:162,cell:3,alpha:.53},
    {at:.39,side:54,size:121,cell:3,alpha:.44},
    {at:.68,side:-61,size:110,cell:2,alpha:.36},
    {at:.87,side:42,size:90,cell:2,alpha:.28}],
   // Open leaf-litter glade: broad fern understorey, isolated rock seams.
   [{at:.19,side:56,size:126,cell:2,alpha:.34},
    {at:.43,side:-57,size:153,cell:2,alpha:.44},
    {at:.64,side:69,size:104,cell:3,alpha:.38},
    {at:.88,side:-33,size:118,cell:2,alpha:.33}]
  ];
  for(const bank of sourceFallsBanks()){
   if(bank.step%8!==4)continue;
   const nearest=roots.reduce((best,r)=>{
    const d=Math.hypot(r.x-bank.x,r.y-bank.y);
    return d<(best?.d??Infinity)?{r,d}:best
   },null);
   if(!nearest||nearest.d<135||nearest.d>550)continue;
   const root=nearest.r;
   const key=Math.round(root.x/40)+":"+Math.round(root.y/40)+
    ":"+bank.side+":"+bank.segment;
   if(used.has(key))continue;
   used.add(key);
   const dx=root.x-bank.x,dy=root.y-bank.y;
   const tx=-dy/nearest.d,ty=dx/nearest.d;
   const seed=Math.floor(hash(bank.segment,bank.step,bank.side)*100003);
   const profile=(Math.abs(Math.floor(bank.segment*1.37))+
    Math.floor(bank.step/8)+(bank.side>0?1:0))%compositions.length;
   const composition=compositions[profile];
   for(const [j,p] of composition.entries()){
    const drift=(hash(seed,j,1521)-.5)*18;
    const x=bank.x+dx*p.at+tx*(p.side+drift);
    const y=bank.y+dy*p.at+ty*(p.side+drift);
    const w=p.size*(.92+hash(seed,j,1523)*.16),h=w;
    // Resolve every source-bank candidate independently of streamed tile
    // bounds. Earlier culling before the overlap ledger meant adjacent
    // chunks could choose different winning paintings at the same bank.
    // Culling happens AFTER global overlap arbitration below.
    // Full native square footprint, with extra intermediate stations to
    // keep a narrow bridge approach from slipping between sample points.
    let clear=true;
    // The source is drawn from y-.68h through y+.32h. Check that
    // actual full destination rectangle (including its lower bank edge),
    // not a second square centred above it as in the older sampling.
    for(const fx of [-.49,-.245,0,.245,.49]){
     for(const fy of [.01,.255,.5,.745,.99]){
      const sx=x-w*.5+w*(fx+.5),sy=y-h*.68+h*fy;
      if(!forest(sx,sy)||geometry.waterAt(sx,sy,16)||
         geometry.nearRoad(sx,sy,()=>true,75)||
         geometry.obstacle(sx,sy,16)||footprint.blocked?.(sx,sy,16)){
       clear=false;break
      }
     }
     if(!clear)break
    }
    if(!clear)continue;
    // Prevent multiple source banks from stacking translucent square
    // paintings into an opaque, artificial-looking rectangle. This is
    // visual composition only and does not affect physical geometry.
    if(paintedFootprints.some(q=>Math.abs(q.x-x)<(q.w+w)*.34&&
      Math.abs(q.y-y)<(q.h+h)*.30))continue;
    paintedFootprints.push({x,y,w,h});
    if(x<bounds[0]-w||x>bounds[2]+w||
       y<bounds[1]-h||y>bounds[3]+h)continue;
    // A quiet, root-to-bank tonal foundation sits beneath the native
    // stone/fern pigment. Unlike a rectangular sprite strip, this
    // transparent pool disappears at its edges and is confined to the
    // already validated dry-ground painting. It adds material depth
    // without new terrain, silhouettes, or physical obstruction.
    const glow=ctx.createRadialGradient?.(
     x,y-h*.18,w*.08,x,y-h*.18,w*.49);
    if(glow){
     glow.addColorStop(0,p.cell===3?"rgba(28,49,39,.19)":"rgba(31,64,39,.16)");
     glow.addColorStop(.62,"rgba(39,72,45,.075)");
     glow.addColorStop(1,"rgba(39,72,45,0)");
     ctx.save();ctx.fillStyle=glow;
     ctx.fillRect(x-w*.5,y-h*.68,w,h);ctx.restore();
    }
    ctx.save();ctx.globalAlpha=p.alpha;
    ctx.translate(Math.round(x),Math.round(y));
    if(bank.side<0)ctx.scale(-1,1);
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(painted,PAINTED_SIZE*p.cell,0,PAINTED_SIZE,PAINTED_SIZE,
     Math.round(-w*.5),Math.round(-h*.68),Math.round(w),Math.round(h));
    ctx.restore();count++
   }
  }
  return count
 }

 // R36: the Falls overlook is NOT five grey rectangular pylons. It is
 // a quiet, original-art, low-profile moss/rock terrace with an open
 // central stair approach. All illustrations use the original R18
 // transparent native paintings; the actual landmark and physics stay put.
 // Painting terrain here is nonblocking: no fake standing cliffs, no
 // unsupported path and no changed collision or game save.
 function paintFallsOverlook(ctx,hub){
  if(!ctx||hub?.kind!=="lookout"||
     footprint.regionAt(hub.x,hub.y)?.id!=="greenwood_falls")return 0;
  const cx=hub.x,cy=hub.y;
  // R43: the two overlook flanks use ONLY the original R18 transparent
  // painted geology, in an asymmetrical layered composition. The previous
  // large filled Bezier shelves looked like primitive vector platforms.
  // Keep the real stair axis clear and the original source lookout intact.
  // These are entirely nonphysical images; no terrain, routes or collision.
  const banks=[
   {dx:-286,dy:-150,scale:1.13,flip:false,seed:31},
   {dx:262,dy:-184,scale:.88,flip:true,seed:73}
  ];
  let paintedRock=0;
  if(painted&&ctx.drawImage)for(const bank of banks){
   const bx=cx+bank.dx,by=cy+bank.dy;
   if(geometry.waterAt(bx,by,0))continue;
   // Independent crops form a broken silhouette, not a stretched strip.
   // Original R18 rock is cell 3, woodland fern/lichen is cell 2.
   const pieces=[
    {dx:0,dy:-12,w:194,h:171,cell:3,alpha:.94},
    {dx:bank.flip?-88:91,dy:8,w:104,h:99,cell:3,alpha:.73},
    {dx:bank.flip?63:-69,dy:0,w:109,h:102,cell:2,alpha:.47},
    {dx:bank.flip?-105:107,dy:42,w:84,h:65,cell:2,alpha:.43}
   ];
   for(const [j,p] of pieces.entries()){
    const x=bx+p.dx*bank.scale,y=by+p.dy*bank.scale;
    const w=p.w*bank.scale,h=p.h*bank.scale;
    // Preserve the main native rock on the original flank anchor. For
    // every supporting fragment, validate its painted footprint so no
    // decoration overpaints a stair, water edge or physical obstacle.
    // Every crop, including the two dominant rock masses, must clear
    // its ACTUAL painted destination. Previously the large core and
    // lichen layer skipped checks entirely, allowing visible shoreline
    // and stair overpaint despite clear supporting fragments.
    let safe=true;
    for(const fx of [.02,.26,.5,.74,.98]){
     for(const fy of [.02,.26,.5,.74,.98]){
      const sx=x-w*.5+w*fx,sy=y-h*.87+h*fy;
      if(footprint.regionAt(sx,sy)?.id!=="greenwood_falls"||
         geometry.waterAt(sx,sy,10)||
         geometry.nearRoad(sx,sy,()=>true,24)||
         geometry.obstacle(sx,sy,10)||
         footprint.blocked?.(sx,sy,10)){
       safe=false;break
      }
     }
     if(!safe)break
    }
    if(!safe)continue;
    ctx.save();ctx.globalAlpha=p.alpha;
    ctx.imageSmoothingEnabled=true;
    ctx.translate(Math.round(x),Math.round(y));
    if(bank.flip)ctx.scale(-1,1);
    ctx.drawImage(painted,PAINTED_SIZE*p.cell,0,PAINTED_SIZE,PAINTED_SIZE,
     Math.round(-w*.5),Math.round(-h*.87),
     Math.round(w),Math.round(h));
    ctx.restore();paintedRock++;
   }
  }
  // R44: join the two isolated lookout flanks into grounded, irregular
  // native-pixel talus gardens. The pieces are authored around the original
  // lookout, never along the stair axis; every visible crop is validated
  // against the *real* source terrain, crossing and collision boundaries.
  // A layered low stone core, lichen skirt and staggered fern tufts give
  // each flank an identifiable silhouette rather than four loose stamps.
  // R45: two independently composed original-painted silhouettes rather
  // than a mirrored repeated crop template. The west is low and broken;
  // the east rises into a rocky shoulder with a staggered fern apron.
  const talusGardens=[
   {side:-1,ox:-382,oy:-86,mirror:false,weight:1.04,crops:[
    {dx:-59,dy:-29,w:155,h:107,cell:3,alpha:.83},
    {dx:55,dy:-8,w:111,h:79,cell:3,alpha:.72},
    {dx:12,dy:29,w:143,h:74,cell:2,alpha:.58},
    {dx:-108,dy:42,w:81,h:58,cell:2,alpha:.48},
    {dx:96,dy:43,w:93,h:62,cell:2,alpha:.54}
   ]},
   {side:1,ox:354,oy:-110,mirror:false,weight:.91,crops:[
    {dx:37,dy:-58,w:132,h:133,cell:3,alpha:.87},
    {dx:-74,dy:-18,w:148,h:93,cell:3,alpha:.72},
    {dx:-4,dy:26,w:165,h:79,cell:2,alpha:.53},
    {dx:114,dy:34,w:75,h:63,cell:2,alpha:.49},
    {dx:-115,dy:45,w:99,h:58,cell:2,alpha:.59}
   ]}
  ];
  if(painted&&ctx.drawImage)for(const garden of talusGardens){
   const crops=garden.crops;
   for(const p of crops){
    const dx=p.dx;
    const x=cx+garden.ox+dx*garden.weight,
     y=cy+garden.oy+p.dy*garden.weight;
    const w=p.w*garden.weight,h=p.h*garden.weight;
    // The painted crop is wider than its foot anchor. Reject the entire
    // footprint if any of its nine sample points touches an authored road,
    // water, hard obstacle or a different biome.
    let clear=true;
    for(const fx of [-.46,0,.46]){
     for(const fy of [-.43,0,.43]){
      const sx=x+w*fx,sy=y-h*.48+h*fy;
      if(footprint.regionAt(sx,sy)?.id!=="greenwood_falls"||
         geometry.waterAt(sx,sy,12)||
         geometry.nearRoad(sx,sy,()=>true,42)||
         geometry.obstacle(sx,sy,12)){
       clear=false;break
      }
     }
     if(!clear)break
    }
    if(!clear)continue;
    ctx.save();ctx.globalAlpha=p.alpha;
    ctx.imageSmoothingEnabled=true;
    ctx.translate(Math.round(x),Math.round(y));
    if(garden.mirror)ctx.scale(-1,1);
    ctx.drawImage(painted,PAINTED_SIZE*p.cell,0,
     PAINTED_SIZE,PAINTED_SIZE,
     Math.round(-w*.5),Math.round(-h*.79),
     Math.round(w),Math.round(h));
    ctx.restore();paintedRock++;
   }
  }
  // R46: retire the final geometric arc behind the stairs. Build a
  // connected, asymmetrical woodland-to-stone ground transition beneath
  // the original painted flanks. Each translucent pocket is a soft
  // source-grounded pigment wash, never a new physical shelf or barrier.
  // Nine-point clearance keeps the FULL wash away from roads, water,
  // authored obstacles and the real central stair corridor.
  if(ctx.createRadialGradient){
   const groundShoulders=[
    {dx:-365,dy:-114,rx:154,ry:73,shade:"rgba(30,61,46,.23)",
     middle:"rgba(74,102,69,.12)",angle:-.12},
    {dx:-254,dy:-76,rx:111,ry:59,shade:"rgba(66,87,70,.19)",
     middle:"rgba(113,126,89,.085)",angle:.15},
    {dx:339,dy:-139,rx:162,ry:88,shade:"rgba(27,59,49,.27)",
     middle:"rgba(74,102,80,.13)",angle:.18},
    {dx:236,dy:-90,rx:107,ry:53,shade:"rgba(72,90,75,.18)",
     middle:"rgba(115,125,93,.08)",angle:-.11}
   ];
   for(const pocket of groundShoulders){
    const x=cx+pocket.dx,y=cy+pocket.dy;
    let clear=true;
    for(const fx of [-.86,0,.86]){
     for(const fy of [-.86,0,.86]){
      const sx=x+fx*pocket.rx,sy=y+fy*pocket.ry;
      if(footprint.regionAt(sx,sy)?.id!=="greenwood_falls"||
         geometry.waterAt(sx,sy,12)||
         geometry.nearRoad(sx,sy,()=>true,36)||
         geometry.obstacle(sx,sy,12)){
       clear=false;break
      }
     }
     if(!clear)break
    }
    if(!clear)continue;
    ctx.save();ctx.translate(x,y);ctx.rotate?.(pocket.angle);
    ctx.scale(pocket.rx,pocket.ry);
    const pigment=ctx.createRadialGradient(-.20,-.18,.03,0,0,1);
    pigment.addColorStop(0,pocket.shade);
    pigment.addColorStop(.52,pocket.middle);
    pigment.addColorStop(1,"rgba(83,110,83,0)");
    ctx.fillStyle=pigment;ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);
    ctx.fill();ctx.restore()
   }
  }
  // R47: a connected, low-lying native woodland apron behind the real
  // lookout banks. These original R18 fern/stone crops create an irregular
  // foreground-to-geology transition without a vector shelf or fake cliff.
  // Source positions are independent: missing safe ground omits only that
  // crop, never a real path, river, stair or collision-backed object.
  const woodlandAprons=[
   {ox:-525,oy:-36,parts:[
    [-46,12,102,79,2,.66],[42,-20,120,90,3,.72],
    [117,30,89,65,2,.54],[-113,-10,83,70,3,.63],
    [12,43,131,68,2,.57],[-73,55,78,53,2,.49]
   ]},
   {ox:492,oy:-48,parts:[
    [28,-33,126,110,3,.75],[-65,3,95,76,2,.61],
    [105,18,109,75,3,.67],[-130,34,91,61,2,.53],
    [2,55,143,70,2,.59],[78,63,82,52,2,.48]
   ]}
  ];
  if(painted&&ctx.drawImage)for(const apron of woodlandAprons){
   for(const [dx,dy,w,h,cell,alpha] of apron.parts){
    const x=cx+apron.ox+dx,y=cy+apron.oy+dy;
    let safe=true;
    for(const fx of [-.46,0,.46]){
     for(const fy of [-.42,0,.42]){
      const sx=x+fx*w,sy=y-h*.48+fy*h;
      if(footprint.regionAt(sx,sy)?.id!=="greenwood_falls"||
         geometry.waterAt(sx,sy,12)||
         geometry.nearRoad(sx,sy,()=>true,38)||
         geometry.obstacle(sx,sy,12)){
       safe=false;break
      }
     }
     if(!safe)break
    }
    if(!safe)continue;
    ctx.save();ctx.globalAlpha=alpha;
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(painted,PAINTED_SIZE*cell,0,PAINTED_SIZE,PAINTED_SIZE,
     Math.round(x-w*.5),Math.round(y-h*.81),w,h);
    ctx.restore();paintedRock++
   }
  }
  return paintedRock||1
 }

 // R62: one world-anchored source-land stencil for every forest-floor light
 // layer, including rooted canopy shade and old-growth sunlight. The stencil
 // is visual-only and cannot alter the source's path/collision geometry.
 function withDryForestClip(ctx,x,y,r,paint){
  const step=32;
  const minX=Math.floor((x-r)/step)*step;
  const minY=Math.floor((y-r)/step)*step;
  ctx.save();ctx.beginPath();
  let accepted=0;
  for(let yy=minY;yy<y+r;yy+=step)
   for(let xx=minX;xx<x+r;xx+=step){
    if(Math.hypot(xx+16-x,yy+16-y)>r+step)continue;
    let dry=true;
    for(const dy of [4,16,28]){
     for(const dx of [4,16,28]){
      const px=xx+dx,py=yy+dy;
      if(!forest(px,py)||geometry.waterAt(px,py,4)||
         geometry.nearRoad(px,py,()=>true,4)||
         geometry.obstacle(px,py,4)||
         footprint.blocked?.(px,py,4)){dry=false;break}
     }
     if(!dry)break
    }
    if(!dry)continue;
    if(typeof ctx.rect==="function")ctx.rect(xx,yy,step,step);
    else{
     ctx.moveTo(xx,yy);ctx.lineTo(xx+step,yy);
     ctx.lineTo(xx+step,yy+step);ctx.lineTo(xx,yy+step);
     ctx.closePath()
    }
    accepted++
   }
  if(accepted){ctx.clip();paint()}
  ctx.restore();
  return accepted
 }
 // R70: extended with two six-crown, staggered native-pixel woodland skyline groups.
 // R64: a single hand-composed native-art landscape around the REAL Falls
 // overlook. Two distinct banks carry large painted rock shelves, staggered
 // fern gardens and old-growth boughs. Every crop is source-cleared, including
 // its corners; these are nonphysical paintings below paths and actors.
 // This intentionally replaces the tiny-tweak approach with a complete
 // landscape-scale composition in the normal player camera.
 function paintFallsNativeGallery(ctx,bounds){
  if(!painted||!ctx?.drawImage||!fallsAnchor)return 0;
  const ax=fallsAnchor.x,ay=fallsAnchor.y;
  if(bounds[0]>ax+1050||bounds[2]<ax-1050||
     bounds[1]>ay+900||bounds[3]<ay-1050)return 0;
  const banks=[
   {side:-1,baseX:-490,baseY:-215,items:[
    [-180,-174,292,208,3,.88],[-39,-205,224,164,3,.79],
    [-242,-40,218,142,2,.75],[-73,-51,268,167,2,.82],
    [-329,92,181,118,3,.65],[-131,126,219,142,2,.70],
    [-279,-292,275,156,0,.82],[-66,-341,233,133,1,.79],
    [-401,-110,183,127,2,.60],[-8,47,157,110,3,.68],
    // R70: connected upper woodland skyline; six independent crown
    // silhouettes layer behind the west shale shoulder and never add solids.
    [-440,-410,328,278,0,.93],[-170,-474,288,249,1,.88],
    [96,-434,305,262,0,.86],[-352,-562,253,224,1,.83],
    [-38,-590,272,237,0,.81],[-514,-258,224,195,1,.76]
   ]},
   {side:1,baseX:478,baseY:-242,items:[
    [94,-224,313,228,3,.90],[-75,-187,228,158,3,.82],
    [212,-60,242,165,2,.74],[-32,-17,272,177,2,.84],
    [303,76,189,135,3,.68],[69,134,227,151,2,.74],
    [202,-345,248,144,1,.83],[-44,-306,283,163,0,.82],
    [342,-133,172,119,2,.63],[-141,78,167,116,3,.68],
    // R70: independently staggered eastern woodland wall, with gaps
    // between crown heights and the original stairs left source-clear.
    [440,-424,319,281,1,.92],[142,-484,296,254,0,.87],
    [-137,-438,318,265,1,.85],[339,-578,258,222,0,.82],
    [22,-607,278,236,1,.79],[518,-276,228,191,0,.75]
   ]}
  ];
  let count=0;
  for(const bank of banks){
   for(let i=0;i<bank.items.length;i++){
    const [dx,dy,w,h,cell,alpha]=bank.items[i];
    const x=ax+bank.baseX+dx,y=ay+bank.baseY+dy;
    const left=x-w*.5,top=y-h*.82;
    if(left>bounds[2]+120||left+w<bounds[0]-120||
       top>bounds[3]+120||top+h<bounds[1]-120)continue;
    // R65: the old 25-point all-or-nothing veto silently discarded whole
    // large painted compositions when even one fringe touched a road.
    // Keep the source land/route protection, but clip each painting to
    // accepted 24px dry-ground cells. A crop can now grow naturally up to
    // the real bank without erasing paths or inventing physical geometry.
    // The mask is world-aligned, so streamed camera chunks never shift it.
    const step=24;
    const x0=Math.floor(left/step)*step,y0=Math.floor(top/step)*step;
    let accepted=0;
    ctx.save();ctx.beginPath();
    for(let yy=y0;yy<top+h;yy+=step){
     for(let xx=x0;xx<left+w;xx+=step){
      const cellLeft=Math.max(xx,left),cellTop=Math.max(yy,top);
      const cellRight=Math.min(xx+step,left+w),cellBottom=Math.min(yy+step,top+h);
      if(cellRight<=cellLeft||cellBottom<=cellTop)continue;
      let dry=true;
      for(const fy of [.15,.5,.85]){
       for(const fx of [.15,.5,.85]){
        const px=cellLeft+(cellRight-cellLeft)*fx;
        const py=cellTop+(cellBottom-cellTop)*fy;
        if(footprint.regionAt(px,py)?.id!=="greenwood_falls"||
           !footprint.onLand(px,py)||
           geometry.waterAt(px,py,9)||
           geometry.nearRoad(px,py,()=>true,24)||
           geometry.obstacle(px,py,9)||
           footprint.blocked?.(px,py,9)){dry=false;break}
       }
       if(!dry)break
      }
      if(!dry)continue;
      if(typeof ctx.rect==="function")ctx.rect(cellLeft,cellTop,cellRight-cellLeft,cellBottom-cellTop);
      else{
       ctx.moveTo(cellLeft,cellTop);ctx.lineTo(cellRight,cellTop);
       ctx.lineTo(cellRight,cellBottom);ctx.lineTo(cellLeft,cellBottom);ctx.closePath()
      }
      accepted++
     }
    }
    if(!accepted){ctx.restore();continue}
    ctx.clip();
    // Crop artwork remains native original R18 pixels, not generated shapes.
    ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=true;
    ctx.translate(Math.round(x),Math.round(y));
    if(bank.side>0&&i%3===1)ctx.scale(-1,1);
    // R66: original pixel-authored, asymmetric bedrock silhouettes anchor
    // the two largest rock shoulders; original R18 art remains elsewhere.
    const useGeology=cell===3&&fallsGeology&&
      ((bank.side<0&&(i===0||i===4))||(bank.side>0&&(i===0||i===5)));
    if(useGeology)ctx.drawImage(fallsGeology,
     (bank.side<0?0:128),0,128,128,
     Math.round(-w*.5),Math.round(-h*.82),Math.round(w),Math.round(h));
    else if(cell<2&&fallsCanopies){
     // Each bank has its own distinct canopy profile and crown density.
     const variant=bank.side<0?(i%2===0?0:2):(i%2===0?3:1);
     ctx.drawImage(fallsCanopies,variant*128,0,128,128,
      Math.round(-w*.5),Math.round(-h*.82),Math.round(w),Math.round(h));
    }else if(cell===2&&fallsBankStudies){
     // Distinct shale/fern materials bind the gallery to the real riverbank.
     const variant=(i+(bank.side>0?2:0))%3;
     ctx.drawImage(fallsBankStudies,variant*128,0,128,128,
      Math.round(-w*.5),Math.round(-h*.82),Math.round(w),Math.round(h));
    }else ctx.drawImage(painted,cell*PAINTED_SIZE,0,PAINTED_SIZE,PAINTED_SIZE,
     Math.round(-w*.5),Math.round(-h*.82),Math.round(w),Math.round(h));
    ctx.restore();count++
   }
  }
  return count
 }
 function paintForestFloor(ctx,bounds){
  let count=0;
  // R17b: continuous forest-floor pools fill the entire SOURCE Greenwood
  // biome, not only rare trunk locations. Overlapping large-scale dappled
  // patches give a woodland underpainting rather than 96px checkerboard,
  // isolated flower confetti or invented new collision blockers.
  const zone=460;
  for(let gy=Math.floor((bounds[1]-200)/zone);
      gy<=Math.ceil((bounds[3]+200)/zone);gy++)
   for(let gx=Math.floor((bounds[0]-200)/zone);
       gx<=Math.ceil((bounds[2]+200)/zone);gx++){
    const cx=gx*zone+zone*(.23+hash(gx,gy,119)*.54),
      cy=gy*zone+zone*(.18+hash(gy,gx,130)*.60);
    if(!forest(cx,cy)||geometry.waterAt(cx,cy,50))continue;
    const r=240+hash(gx,gy,133)*200;
    if(typeof ctx.createRadialGradient==="function"){
     // R61: a center-land check is insufficient for a 480–880-unit
     // watercolor footprint. Clip BOTH light and shadow to source-ground
     // cells before painting, so no tint crosses the actual river, roads,
     // bridges or authored solid objects. This mask is purely visual.
     // A fixed world grid avoids seams when the world streams in chunks.
     const step=32,firstX=Math.floor((cx-r)/step)*step,
      firstY=Math.floor((cy-r)/step)*step;
     ctx.save();ctx.beginPath();
     let landCells=0;
     for(let yy=firstY;yy<cy+r;yy+=step)
      for(let xx=firstX;xx<cx+r;xx+=step){
       const mx=xx+step*.5,my=yy+step*.5;
       if(Math.hypot(mx-cx,my-cy)>r+step)continue;
       let dry=true;
       for(const dy of [4,step*.5,step-4]){
        for(const dx of [4,step*.5,step-4]){
         const px=xx+dx,py=yy+dy;
         if(!forest(px,py)||geometry.waterAt(px,py,4)||
            geometry.nearRoad(px,py,()=>true,4)||
            geometry.obstacle(px,py,4)||
            footprint.blocked?.(px,py,4)){
          dry=false;break
         }
        }
        if(!dry)break
       }
       if(dry){
        // Canvas path rectangles are optional in the lightweight Node
        // regression context. Draw the identical closed square using the
        // universal path primitives when rect() is absent; the browser
        // continues to use its native rect() implementation.
        if(typeof ctx.rect==="function")ctx.rect(xx,yy,step,step);
        else{
         ctx.moveTo(xx,yy);ctx.lineTo(xx+step,yy);
         ctx.lineTo(xx+step,yy+step);ctx.lineTo(xx,yy+step);
         ctx.closePath()
        }
        landCells++
       }
      }
     if(landCells)ctx.clip();
     const dark=ctx.createRadialGradient(cx-54,cy-29,16,cx,cy,r);
     dark.addColorStop(0,"rgba(29,65,47,.31)");
     dark.addColorStop(.30,"rgba(41,79,54,.23)");
     dark.addColorStop(.66,"rgba(75,108,68,.12)");
     dark.addColorStop(1,"rgba(77,112,69,0)");
     if(landCells){ctx.fillStyle=dark;
      ctx.fillRect(cx-r,cy-r,r*2,r*2)}
     const offsetX=r*.32,offsetY=-r*.41;
     const light=ctx.createRadialGradient(cx+offsetX,cy+offsetY,6,
      cx+offsetX,cy+offsetY,r*.75);
     light.addColorStop(0,"rgba(216,198,125,.17)");
     light.addColorStop(.42,"rgba(180,189,112,.075)");
     light.addColorStop(1,"rgba(180,189,112,0)");
     if(landCells){ctx.fillStyle=light;
      ctx.fillRect(cx-r,cy-r,r*2,r*2)}
     ctx.restore()
    }
    // R20 removes detached repeated ground confetti; grounded vegetation
    // comes from source trees in one cohesive canvas pass below.
   }
  // Large source-root canopy light and shade establishes a shaded forest
  // perimeter while leaving all streets, structures and collision untouched.
  paintRootedForestEdge(ctx,bounds);
  // Connect the original roads to their own forest-floor material BEFORE
  // the actual road surfaces are drawn later in the terrain compositor.
  paintRoadVerges(ctx,bounds);
  // Original landmark anchors ground the passable woodland floor.
  paintLandmarkHabitat(ctx,bounds);
  // A forest's undergrowth grows around established source tree roots, not
  // on random new solid objects or painted pathways. Roads render afterward.
  const anchored=[...footprint.cells(bounds,420),...footprint.groves(bounds,420)];
  paintRootedUnderstory(ctx,bounds,anchored);
  // R40y: interleaved canopy-filtered forest light beneath the EXISTING
  // Greenwood Falls old-growth roots. Each irregular translucent pool is
  // anchored to a verified original trunk; no new prop, collision or road.
  // Keep the ground treatment below source riverbanks, paths and actors.
  if(typeof ctx.createRadialGradient==="function"){
   for(const root of anchored){
    if(!root?.authoredFallsGrove||!["oak","pine"].includes(root.kind)||
       footprint.regionAt(root.x,root.y)?.id!=="greenwood_falls"||
       geometry.waterAt(root.x,root.y,30))continue;
    const radius=root.radius||50;
    if(root.x<bounds[0]-radius*7||root.x>bounds[2]+radius*7||
       root.y<bounds[1]-radius*6||root.y>bounds[3]+radius*6)continue;
    const seed=Math.floor(root.variant*8191);
    // Broad overlapping light pockets break up the uniform forest carpet,
    // but fade to transparent before reaching the original physical roads.
    for(let k=0;k<3;k++){
     const theta=hash(seed,k,907)*Math.PI*2;
     const offset=radius*(.55+hash(seed,k,911)*1.10);
     const x=root.x+Math.cos(theta)*offset;
     const y=root.y+Math.sin(theta)*offset*.64-radius*.48;
     const spread=radius*(1.5+hash(seed,k,919)*1.45);
     // R40z: the source road API takes a predicate BEFORE clearance.
     // A two-argument call silently bypassed the intended exclusion.
     // Check the entire visible light footprint, not just its center:
     // sampled rim points keep the soft pool off original roads/water.
     const footprintClear=(px,py)=>
      forest(px,py)&&!geometry.waterAt(px,py,35)&&
      !geometry.nearRoad(px,py,()=>true,58);
     if(!footprintClear(x,y))continue;
     let clear=true;
     for(let sample=0;sample<12;sample++){
      const a=sample*Math.PI/6,px=x+Math.cos(a)*spread*.94,
       py=y+Math.sin(a)*spread*.59;
      if(!footprintClear(px,py)){clear=false;break}
     }
     if(!clear)continue;
     // R40aa: transform the watercolor gradient AND its ellipse as one
     // world-anchored volume. The old circular gradient was painted inside
     // an ellipse, creating abrupt oval edges rather than a soft fade.
     // Keep the light entirely decorative and within the R40z road guards.
     withDryForestClip(ctx,x,y,spread*1.15,()=>{
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(theta*.12);
      ctx.scale(1,.59);
      const glow=ctx.createRadialGradient(-spread*.18,-spread*.25,3,
       0,0,spread);
      glow.addColorStop(0,k===0?"rgba(195,197,128,.19)":"rgba(154,176,112,.13)");
      glow.addColorStop(.48,"rgba(130,156,101,.07)");
      glow.addColorStop(1,"rgba(99,137,93,0)");
      ctx.fillStyle=glow;
      ctx.beginPath();
      ctx.arc(0,0,spread,0,Math.PI*2);
      ctx.fill();
      ctx.restore()
     })
    }
   }
  }
  // R34: physically sourced moss/stone riverbanks beneath existing decks.
  paintFallsRiverBanks(ctx,bounds);
  paintFallsWoodlandBankTransition(ctx,bounds);
  paintFallsGroveApron(ctx,bounds);
  paintFallsRootedGorge(ctx,bounds);
  paintFallsComposedGround(ctx,bounds);
  paintFallsEscarpmentFloor(ctx,bounds);
  paintFallsRiverNativeLedges(ctx,bounds);
  paintFallsNativeGallery(ctx,bounds);
  for(const o of anchored){
   if(!["oak","pine","scrub"].includes(o.kind)||!forest(o.x,o.y)||
       geometry.waterAt(o.x,o.y,2))continue;
   if(o.x<bounds[0]-310||o.x>bounds[2]+310||
     o.y<bounds[1]-310||o.y>bounds[3]+310)continue;
   const r=o.radius,reach=r*(o.kind==="oak"?3.6:3.0);
   // R26 canopy-filtered woodland floor: two intersecting light/shadow
   // volumes belong to THIS ORIGINAL physical root. Nothing is tiled,
   // stamped onto a road, or made collidable by this underpainting.
   const shade=ctx.createRadialGradient?.(
    o.x-r*.28,o.y-r*.56,r*.12,o.x,o.y,reach);
   if(shade){
    shade.addColorStop(0,"rgba(18,46,33,.29)");
    shade.addColorStop(.42,"rgba(33,69,44,.19)");
    shade.addColorStop(.80,"rgba(67,104,65,.065)");
    shade.addColorStop(1,"rgba(72,107,67,0)");
    withDryForestClip(ctx,o.x,o.y,reach,()=>{
     ctx.fillStyle=shade;
     ctx.fillRect(o.x-reach,o.y-reach,reach*2,reach*2)
    })
   }
   const sun=ctx.createRadialGradient?.(
    o.x-r*1.15,o.y-r*1.38,5,o.x-r*.35,o.y-r*.55,reach*.83);
   if(sun){
    sun.addColorStop(0,"rgba(201,193,123,.105)");
    sun.addColorStop(.60,"rgba(159,176,106,.04)");
    sun.addColorStop(1,"rgba(160,179,111,0)");
    withDryForestClip(ctx,o.x,o.y,reach,()=>{
     ctx.fillStyle=sun;
     ctx.fillRect(o.x-reach,o.y-reach,reach*2,reach*2)
    })
   }
   // Real painted fern mats replace tiny detached pixel flecks.
   count++
  }
  return count
 }
 function stats(){return {version:V,sourceSpritePixels:SIZE,
  sourceHeightPixels:HEIGHT,variantsPerKind:VARIANTS,
  kindCount:3,totalSprites:VARIANTS*3,ready:!!atlas,
  physicsChanged:false,originalRootAnchors:true,creatorApproved:false,
  roadVergesFromSource:true,matureTreeCanopyScale:1.65,
  featheredRoadEdges:true,rootedUnderstoryMats:true,
  retiredConfettiFloor:true,paintedGladeHabitat:true,rootLinkedCanopy:true,
  connectedSafeGladeBeds:true,rootFilteredCanopyLight:true,
  sourceRootedEavesR31c:true,upperForestGalleryR32:true,realActorCanopyDepthR33:true,
  rootedOverstoryR30:true,fallsPhysicalRiverBanksR34:true,
  fallsNativeWaterAndWoodlandR34b:true,
  fallsOriginalLookoutR36:true,fallsLookoutReducedStripesR36b:true,
  fallsCollisionRootedGorgeR37:true,fallsNativeCanopyFrameR37:true,
  fallsLandscapeCompositionR38:true,fallsStairShoulderNativeR38:true,
  fallsLowReliefSourceBedrockR39:true,fallsRealRiverNativeLedgesR39:true,fallsNativeGalleryR64:true,
  fallsRootLinkedBankFernR40:true,
  riverSourcedEscarpmentR35:true,sculptedBankContrastR35b:true,nonGeometricBankBlendR35c:true,
  nonBlockingCanopyProjection:true,
  namedHabitatAnchors:habitatAnchors.map(h=>h.id),
  paintedAssetReady:!!painted,paintedAssetPixels:PAINTED_SIZE,
  paintedAssetKinds:4,paintedAssetError:paintedError}}
 return{load,stamp,paintFeature,paintForestFloor,paintRootedForestEdge,paintRoadVerges,paintRootedUnderstory,paintLandmarkHabitat,paintCanopyLinks,paintHearthEdgeBoughs,paintHearthUpperForest,paintForegroundCanopy,paintFallsRiverBanks,paintFallsOverlook,paintFallsRootedGorge,paintFallsCanopyBoughs,paintFallsComposedGround,paintFallsEscarpmentFloor,paintFallsRiverNativeLedges,fallsRockCandidates,fallsBankSources:()=>sourceFallsBanks().map(o=>({...o})),stats}
}
window.VeilwardGreenwoodArt={version:V,load,loadPainted,create,
 get paintedReady(){return !!painted},
 get paintedSource(){return painted},
 get paintedError(){return paintedError}};
})();
