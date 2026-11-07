/* VEILWARD Phase 9 R17 — Greenwood native-scale sprite foliage.
 * This is NOT a pasted scenery screenshot and NOT creator-approved art.
 * Render one cached pixel atlas from source algorithms, then stamp only
 * on original footprint tree/undergrowth roots without any new collisions.
 */
(function(){
"use strict";
const V="1.3.25",SIZE=192,HEIGHT=240,VARIANTS=5;
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
const PAINTED_SRC="./assets/greenwood_forest_painted_r18.avif?v=1",PAINTED_SIZE=128;
// Four independently authored, isolated 128px Greenwood illustrations:
// mature oak, evergreen pine, fern bed, mossy rock. No painted backdrop.
function loadPainted(){
 if(painted)return Promise.resolve(true);
 if(paintedPromise)return paintedPromise;
 if(typeof Image!=="function")return Promise.resolve(false);
 paintedPromise=new Promise(resolve=>{
  const img=new Image();img.decoding="async";
  img.onload=()=>{
   if(img.naturalWidth===PAINTED_SIZE*4&&img.naturalHeight===PAINTED_SIZE){
    painted=img;paintedError=null;resolve(true)
   }else{
    paintedError="Unexpected Greenwood illustrated sprite dimensions";
    console.warn(paintedError);resolve(false)
   }
  };
  img.onerror=()=>{
   paintedError="Illustrated Greenwood unavailable; keeping established native art";
   console.warn(paintedError);resolve(false)
  };
  try{img.src=PAINTED_SRC}catch(err){paintedError=String(err);resolve(false)}
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
function create({footprint,geometry}={}){
 if(!footprint||!geometry)throw Error("Greenwood art requires physical source geometry");
 loadPainted();
 const forest=(x,y)=>footprint.regionAt(x,y)?.id==="greenwood";
 function stamp(ctx,type,x,y,w,h,seed=0){
  if(!load())return false;
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
  const offset=(type==="oak"?0:type==="pine"?VARIANTS:VARIANTS*2)+v;
  ctx.save();ctx.imageSmoothingEnabled=false;
  ctx.drawImage(atlas,offset*SIZE,0,SIZE,HEIGHT,
   Math.round(x-w*.5),Math.round(y-h),Math.round(w),Math.round(h));
  ctx.restore();return true
 }
 function paintFeature(ctx,o){
  if(!o||!forest(o.x,o.y))return false;
  if(!["oak","pine","flowerbed","scrub","boulder"].includes(o.kind))return false;
  const n=Math.floor(o.variant*849),r=o.radius;
  if(o.kind==="oak"||o.kind==="pine"){
   const w=r*(o.kind==="oak"?3.3:2.9),h=r*(o.kind==="oak"?4.2:4.6);
   return stamp(ctx,o.kind,o.x,o.y,w,h,n)
  }
  if(o.kind==="boulder")return stamp(ctx,"rock",o.x,o.y,r*2.6,r*1.9,n);
  return stamp(ctx,"shrubs",o.x,o.y,r*2.1,r*1.5,n)
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
     const dark=ctx.createRadialGradient(cx-54,cy-29,16,cx,cy,r);
     dark.addColorStop(0,"rgba(29,65,47,.31)");
     dark.addColorStop(.30,"rgba(41,79,54,.23)");
     dark.addColorStop(.66,"rgba(75,108,68,.12)");
     dark.addColorStop(1,"rgba(77,112,69,0)");
     ctx.save();ctx.fillStyle=dark;
     ctx.fillRect(cx-r,cy-r,r*2,r*2);ctx.restore();
     const offsetX=r*.32,offsetY=-r*.41;
     const light=ctx.createRadialGradient(cx+offsetX,cy+offsetY,6,
      cx+offsetX,cy+offsetY,r*.75);
     light.addColorStop(0,"rgba(216,198,125,.17)");
     light.addColorStop(.42,"rgba(180,189,112,.075)");
     light.addColorStop(1,"rgba(180,189,112,0)");
     ctx.save();ctx.fillStyle=light;
     ctx.fillRect(cx-r,cy-r,r*2,r*2);ctx.restore()
    }
    // Connected leaf-litter wakes and mottled light all sit on continuous
    // soil material; real roads are painted AFTER this pass.
    for(let k=0;k<27;k++){
     const t=hash(gx*13+k,gy,160),a=hash(gx,gy*19+k,161)*Math.PI*2,
       rr=(.22+.70*Math.sqrt(t))*r,
       px=cx+Math.cos(a)*rr,
       py=cy+Math.sin(a)*rr*.72;
     if(geometry.waterAt(px,py,6)||geometry.nearRoad(px,py,()=>true,18))continue;
     const v=hash(k,gx+gy,163);
     rect(ctx,px,py,4+Math.floor(v*8),2+Math.floor(v*3),
      v>.71?"rgba(179,163,94,.34)":
      v>.38?"rgba(45,88,52,.31)":"rgba(122,150,81,.29)")
    }
   }
  // A forest's undergrowth grows around established source tree roots, not
  // on random new solid objects or painted pathways. Roads render afterward.
  const anchored=[...footprint.cells(bounds,310),...footprint.groves(bounds,310)];
  for(const o of anchored){
   if(!["oak","pine","scrub"].includes(o.kind)||!forest(o.x,o.y)||
       geometry.waterAt(o.x,o.y,2))continue;
   if(o.x<bounds[0]-310||o.x>bounds[2]+310||
     o.y<bounds[1]-310||o.y>bounds[3]+310)continue;
   const r=o.radius,shade=ctx.createRadialGradient?.(
    o.x,o.y,r*.08,o.x,o.y,r*2.6);
   if(shade){
    shade.addColorStop(0,"rgba(23,49,37,.31)");
    shade.addColorStop(.42,"rgba(56,94,52,.15)");
    shade.addColorStop(1,"rgba(72,107,67,0)");
    ctx.save();ctx.fillStyle=shade;
    ctx.fillRect(o.x-r*2.6,o.y-r*2.6,r*5.2,r*5.2);ctx.restore()
   }
   // Richer leaf litter is still a passable ground material, never an
   // independent object. Clumps connect to the same actual root footprint.
   for(let i=0;i<8;i++){
    const a=hash(i,o.x|0,o.y|0)*Math.PI*2,
      dist=r*(.35+hash(i,o.y|0,o.x|0)*1.2),
      px=o.x+Math.cos(a)*dist,py=o.y+Math.sin(a)*dist*.48;
    if(geometry.waterAt(px,py,0)||geometry.nearRoad(px,py,()=>true,10))continue;
    rect(ctx,px,py,3+(i%3)*3,2+(i%2),i%3===0?"rgba(171,151,86,.45)":
      i%2===0?"rgba(57,93,54,.55)":"rgba(108,138,77,.36)")
   }
   count++
  }
  return count
 }
 function stats(){return {version:V,sourceSpritePixels:SIZE,
  sourceHeightPixels:HEIGHT,variantsPerKind:VARIANTS,
  kindCount:3,totalSprites:VARIANTS*3,ready:!!atlas,
  physicsChanged:false,originalRootAnchors:true,creatorApproved:false,
  paintedAssetReady:!!painted,paintedAssetPixels:PAINTED_SIZE,
  paintedAssetKinds:4,paintedAssetError:paintedError}}
 return{load,stamp,paintFeature,paintForestFloor,stats}
}
window.VeilwardGreenwoodArt={version:V,load,loadPainted,create,
 get paintedReady(){return !!painted},
 get paintedError(){return paintedError}};
})();
