/* VEILWARD Phase 9 R26 — connected habitat ground, existing tree-root filtered canopy. R17 roots remain.
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
   painted=canvas;paintedError=null;return true
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
  let n=Math.floor(o.variant*849);
  const r=o.radius;
  if(o.kind==="oak"||o.kind==="pine"){
   // Only the original painted R18 source for newly curated old-growth
   // roots: no mismatched generated fallback in this focal forest scene.
   if(o.authoredGrove&&n%VARIANTS===1)n++;
   // Source-original R18 artwork keeps its native proportions. Only
   // selected, real old-growth roots get a slightly taller/wider crown.
   const elder=o.authoredGrove?(o.kind==="oak"?1.20:1.08):1;
   const w=r*(o.kind==="oak"?5.4:4.6)*elder,
    h=r*(o.kind==="oak"?7.0:7.6)*elder;
   return stamp(ctx,o.kind,o.x,o.y,w,h,n)
  }
  if(o.kind==="boulder")return stamp(ctx,"rock",o.x,o.y,r*2.6,r*1.9,n);
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
     function strip(near,far,col){
      const nearPts=[],farPts=[];
      for(let j=0;j<=steps;j++){
       const t=j/steps,x=a[0]+dx*t,y=a[1]+dy*t;
       const wiggle=(Math.sin(x*.013+y*.004+side*2.1)+
        Math.cos(y*.019-x*.006+i))*.5*15;
       const inner=hw+near+wiggle*.27,outer=hw+far+wiggle;
       nearPts.push([x+nx*side*inner,y+ny*side*inner]);
       farPts.push([x+nx*side*outer,y+ny*side*outer])
      }
      ctx.beginPath();
      nearPts.forEach((p,j)=>j?ctx.lineTo(...p):ctx.moveTo(...p));
      for(let j=farPts.length-1;j>=0;j--)ctx.lineTo(...farPts[j]);
      ctx.closePath();
      // Flat polygon-color verges read as dark geometric rails in the
      // real gameplay capture. Fade both edges into the native illustrated
      // forest ground instead, leaving natural branching irregularities.
      let material=col;
      if(typeof ctx.createLinearGradient==="function"){
       const centreX=mx+nx*side*(hw+near),centreY=my+ny*side*(hw+near);
       const outsideX=mx+nx*side*(hw+far),outsideY=my+ny*side*(hw+far);
       const fade=ctx.createLinearGradient(centreX,centreY,outsideX,outsideY);
       fade.addColorStop(0,"rgba(37,70,49,0)");
       fade.addColorStop(.25,col);
       fade.addColorStop(.59,col);
       fade.addColorStop(1,"rgba(37,70,49,0)");
       material=fade
      }
      ctx.fillStyle=material;ctx.fill()
     }
     // Two irregular, connected ground layers make the illustrated soil,
     // woodland duff and source path merge instead of appearing as ribbons.
     strip(14,182,"rgba(37,70,49,.25)");
     strip(12,89,"rgba(44,87,54,.23)");
     // Sparse painterly fern material grows only inside the SOURCE verges;
     // no invisible collisions or off-road free-standing decoration.
     if(painted&&ctx.drawImage){
      for(let j=1;j<steps;j+=4){
       const t=j/steps,x=a[0]+dx*t,y=a[1]+dy*t;
       const seed=Math.floor(hash(i,j,side)*9973);
       const offset=hw+74+hash(j,i,side)*31;
       const xx=x+nx*side*offset,yy=y+ny*side*offset;
       if(!forest(xx,yy)||geometry.waterAt(xx,yy,7))continue;
       const sz=91+hash(seed,j,51)*38;
       ctx.save();ctx.globalAlpha=.38;
       ctx.imageSmoothingEnabled=true;
       ctx.drawImage(painted,PAINTED_SIZE*2,0,PAINTED_SIZE,PAINTED_SIZE,
        Math.round(xx-sz*.5),Math.round(yy-sz*.53),
        Math.round(sz),Math.round(sz*.65));
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
    if(!forest(x,y)||geometry.waterAt(x,y,35)||
       geometry.nearRoad(x,y,()=>true,55)||
       geometry.obstacle(x,y,50)||footprint.blocked?.(x,y,33))continue;
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
     let safe=true;
     for(const t of [.20,.40,.60,.80]){
      const x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
      if(!forest(x,y)||geometry.waterAt(x,y,100)||
       geometry.nearRoad(x,y,()=>true,113)||
       geometry.obstacle(x,y,104)||footprint.blocked?.(x,y,90)){
       safe=false;break
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
    if(distance<175||distance>520||Math.abs(a.y-b.y)>225||
       distance>=closest)continue;
    // The real road and river must never be disguised by overhanging
    // leaf bridges, even when their end roots are physically valid.
    let clear=true;
    for(const t of [.25,.5,.75]){
     const x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
     if(!forest(x,y)||geometry.waterAt(x,y,25)||
      geometry.nearRoad(x,y,()=>true,60)){clear=false;break}
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
   const kind=a.kind==="pine"&&b.kind==="pine"?1:0;
   ctx.save();ctx.globalAlpha=.57;ctx.imageSmoothingEnabled=true;
   ctx.drawImage(painted,kind*PAINTED_SIZE,0,PAINTED_SIZE,78,
    Math.round(x-w*.5),Math.round(y-h*.5),Math.round(w),Math.round(h));
   ctx.restore();
   linked.add(a.id);linked.add(b.id);count++
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
    // R20 removes detached repeated ground confetti; grounded vegetation
    // comes from source trees in one cohesive canvas pass below.
   }
  // Connect the original roads to their own forest-floor material BEFORE
  // the actual road surfaces are drawn later in the terrain compositor.
  paintRoadVerges(ctx,bounds);
  // Original landmark anchors ground the passable woodland floor.
  paintLandmarkHabitat(ctx,bounds);
  // A forest's undergrowth grows around established source tree roots, not
  // on random new solid objects or painted pathways. Roads render afterward.
  const anchored=[...footprint.cells(bounds,420),...footprint.groves(bounds,420)];
  paintRootedUnderstory(ctx,bounds,anchored);
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
    ctx.save();ctx.fillStyle=shade;
    ctx.fillRect(o.x-reach,o.y-reach,reach*2,reach*2);
    ctx.restore()
   }
   const sun=ctx.createRadialGradient?.(
    o.x-r*1.15,o.y-r*1.38,5,o.x-r*.35,o.y-r*.55,reach*.83);
   if(sun){
    sun.addColorStop(0,"rgba(201,193,123,.105)");
    sun.addColorStop(.60,"rgba(159,176,106,.04)");
    sun.addColorStop(1,"rgba(160,179,111,0)");
    ctx.save();ctx.fillStyle=sun;
    ctx.fillRect(o.x-reach,o.y-reach,reach*2,reach*2);
    ctx.restore()
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
  namedHabitatAnchors:habitatAnchors.map(h=>h.id),
  paintedAssetReady:!!painted,paintedAssetPixels:PAINTED_SIZE,
  paintedAssetKinds:4,paintedAssetError:paintedError}}
 return{load,stamp,paintFeature,paintForestFloor,paintRoadVerges,paintRootedUnderstory,paintLandmarkHabitat,paintCanopyLinks,stats}
}
window.VeilwardGreenwoodArt={version:V,load,loadPainted,create,
 get paintedReady(){return !!painted},
 get paintedSource(){return painted},
 get paintedError(){return paintedError}};
})();
