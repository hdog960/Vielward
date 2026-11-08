/* VEILWARD Phase 9 R31b — physically rooted illustrated forest edges and hero readability.
 * A physically traversable 12-region landmass and reproducible region scenery.
 * All natural blockers are rendered from the very same positions/footprint as
 * their boot-level collision. No NPC/player art is touched or copied.
 */
(function(){
"use strict";
const VERSION="1.3.6",TAU=2*Math.PI;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function hash(x,y,seed){let n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(seed|0,1442695041);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296}
function inside(x,y,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
 const a=poly[i],b=poly[j];if(((a[1]>y)!==(b[1]>y))&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;
}return yes}
function distance(x,y,poly){let d=Infinity;for(let i=1;i<poly.length;i++){
 const a=poly[i-1],b=poly[i],dx=b[0]-a[0],dy=b[1]-a[1],z=dx*dx+dy*dy,t=z?clamp(((x-a[0])*dx+(y-a[1])*dy)/z,0,1):0;
 d=Math.min(d,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));
}return d}
function polygon(ctx,p){ctx.beginPath();p.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath()}
function fill(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.floor(x),Math.floor(y),Math.max(1,Math.ceil(w)),Math.max(1,Math.ceil(h)))}
function ellipse(ctx,x,y,rx,ry,color){ctx.save();ctx.translate(x,y);ctx.scale(Math.max(1,rx),Math.max(1,ry));ctx.beginPath();ctx.arc(0,0,1,0,TAU);ctx.fillStyle=color;ctx.fill();ctx.restore()}
function validate(model,geo,source){
 if(!model||model.schema!=="veilward.world-blueprint.v1"||!geo?.nearRoad)throw Error("Phase 6 footprint requires Phase 4 actual world geometry");
 if(!source||source.schema!=="veilward.outdoor-footprint.v1"||source.regions.length!==12||source.hubs.length<12)throw Error("Phase 6 landmass source invalid");
 const ids=new Set(model.nodes.map(n=>n.id));
 for(const n of [...source.hubs,...source.clearings])if(!ids.has(n.anchor))throw Error("Unknown footprint anchor "+n.anchor);
 for(const r of source.regions)if(!model.regions.some(x=>x.id===r.id))throw Error("Unknown footprint biome "+r.id);
 return source
}
function create(model,geo,source,options={}){
 validate(model,geo,source);
 const climate=options.climate||null;
 const scale=model.worldDesign.worldUnitScale,seed=source.fieldSampling.seed;
 const span=source.fieldSampling.cellSizeWorld;
 const poly=source.landOutline.map(p=>p.map(v=>v*scale));
 const nodes=Object.fromEntries(model.nodes.map(n=>[n.id,n]));
 const regions=new Map(source.regions.map(r=>[r.id,r]));
 const centers=model.regions.map(r=>({...r,opts:regions.get(r.id),x:r.center[0]*scale,y:r.center[1]*scale,worldPolygon:r.influencePolygon.map(p=>p.map(v=>v*scale))}));
 const hubs=source.hubs.map(h=>({...h,x:nodes[h.anchor].point[0]*scale,y:nodes[h.anchor].point[1]*scale,r:h.radius*scale}));
 // Restore scenery density: the old 600-1200-unit empty circles around
 // landmarks erased almost all visible trees. Retain small safe foot clearings;
 // all natural props still avoid genuine paths, water and authored buildings.
 const clearings=[...source.clearings.map(c=>({x:nodes[c.anchor].point[0]*scale,y:nodes[c.anchor].point[1]*scale,r:Math.min(c.r*scale,315)})),
   ...hubs.map(h=>({x:h.x,y:h.y,r:Math.min(h.r*.34,355)}))];
 const staticSolids=geo.solids;

 // R27: original source-located buildings and entrances remain clear
 // while nearby forest roots can advance toward the original roads.
 const protectedSites=[];
 for(const [anchor,offsets] of [
  ["greenwood_hearth",[[-400,160,230],[350,300,158],[-260,280,150],[300,-430,135]]],
  ["hermit",[[0,0,240]]]
 ]){
  const n=nodes[anchor];if(!n)continue;
  for(const [dx,dy,r] of offsets)
   protectedSites.push({x:n.point[0]*scale+dx,y:n.point[1]*scale+dy,r})
 }
 function inProtectedSite(x,y,r){
  return protectedSites.some(a=>Math.hypot(x-a.x,y-a.y)<a.r+r+20)
 }
 const cachedFields=new Map(),MAX_CACHE=6000;
 const groveCache=new Map(),GROVE_SPAN=220,MAX_GROVE_CACHE=8500;
 let evaluations=0;
 function remember(key,result){
  if(cachedFields.size>=MAX_CACHE){
   // FIFO eviction: non-player chunk visits never retain the whole 1536-cell world.
   const first=cachedFields.keys().next().value;cachedFields.delete(first)
  }
  cachedFields.set(key,result);return result
 }
 function onLand(x,y){return inside(x,y,poly)}
 function regionAt(x,y){
  let best=centers[0],score=Infinity;
  for(const r of centers){
   const d=Math.hypot(x-r.x,y-r.y);
   const insideRegion=inside(x,y,r.worldPolygon);
   const weight=d*(insideRegion?.76:1.15);
   if(weight<score){score=weight;best=r}
  }
  return best
 }
 function fieldCell(gx,gy){
  const key=gx+":"+gy;
  if(cachedFields.has(key))return cachedFields.get(key);
  evaluations++;
  const x=(gx+.5)*span+(hash(gx,gy,seed)-.5)*span*.62;
  const y=(gy+.5)*span+(hash(gy,gx,seed+3)-.5)*span*.62;
  if(!onLand(x,y))return remember(key,null);
  const reg=regionAt(x,y),opts=reg.opts;
  if(!opts||hash(gx,gy,seed+7)>opts.density)return remember(key,null);
  let kind=opts.features[Math.floor(hash(gy,gx,seed+17)*opts.features.length)];
  const weather=climate?climate.sample(x,y):null;
  if(weather){
   const choice=hash(gx,gy,seed+73);
   // Swap within identical physical families; no new obstruction types.
   if(kind==="pine"||kind==="oak"){
    kind=choice<clamp(weather.pine*.68+weather.snow*.35,.06,.96)?"pine":"oak";
   }else if(kind==="snowstone"||kind==="boulder"){
    kind=choice<clamp(weather.snow*.92,.03,.97)?"snowstone":"boulder";
   }else if(kind==="scrub"||kind==="flowerbed"){
    kind=choice<clamp(weather.snow*.93+(1-weather.snow)*.16,.05,.97)?"scrub":"flowerbed";
   }
  }
  const solid=source.fieldSampling.solidKinds.includes(kind);
  const radius=solid?(45+hash(gx,gy,seed+29)*51):35+hash(gx,gy,seed+29)*35;
  // R27: Greenwood uses the original physical road edge plus a safe
  // shoulder. Other biomes retain the old buffer and density unchanged.
  const woodland=reg.id==="greenwood";
  for(const c of clearings){
   const safe=woodland?Math.min(c.r,190)+radius+55:c.r+radius+90;
   if(Math.hypot(x-c.x,y-c.y)<safe)return remember(key,null)
  }
  if(woodland&&inProtectedSite(x,y,radius))return remember(key,null);
  const shoulder=woodland?90:source.fieldSampling.avoidRouteBufferWorld;
  if(geo.nearRoad(x,y,()=>true,radius+shoulder))return remember(key,null);
  if(geo.waterAt(x,y,radius+25)||geo.obstacle(x,y,radius+source.fieldSampling.avoidExistingPropsWorld))return remember(key,null);
  const obj={id:"field_"+gx+"_"+gy,x,y,kind,radius,solid,biome:reg.id,variant:hash(gx,gy,seed+40),...(weather?{snow:weather.snow,moisture:weather.wet}:{})};
  return remember(key,obj)
 }
 function cells(bounds,pad=120){
  const result=[];
  const [x0,y0,x1,y1]=bounds;
  for(let iy=Math.floor((y0-pad)/span)-1;iy<=Math.floor((y1+pad)/span)+1;iy++)
   for(let ix=Math.floor((x0-pad)/span)-1;ix<=Math.floor((x1+pad)/span)+1;ix++){
    const item=fieldCell(ix,iy);if(item&&item.x+item.radius+170>=x0&&item.x-item.radius-170<=x1&&item.y+item.radius+170>=y0&&item.y-item.radius-170<=y1)result.push(item)
   }
  return result
 }
 function groveCell(gx,gy){
  const key=gx+":"+gy;
  if(groveCache.has(key))return groveCache.get(key);
  if(groveCache.size>=MAX_GROVE_CACHE)groveCache.delete(groveCache.keys().next().value);
  function done(value){groveCache.set(key,value);return value}
  const x=(gx+.5)*GROVE_SPAN+(hash(gx,gy,seed+171)-.5)*GROVE_SPAN*.60;
  const y=(gy+.5)*GROVE_SPAN+(hash(gy,gx,seed+149)-.5)*GROVE_SPAN*.60;
  if(!onLand(x,y))return done(null);
  const reg=regionAt(x,y),opts=reg.opts,c=climate?.sample(x,y);
  const woodland=reg.id==="greenwood";
  const density=woodland?Math.min(.83,opts?.density*1.12):
   Math.min(.76,opts?.density*.85);
  if(!opts||hash(gx,gy,seed+155)>density)return done(null);
  const r=36+hash(gx,gy,seed+157)*20;
  // Match the actual boot-level physical source; never fill any authored
  // road, footbridge, ford, landmark threshold or water shoreline.
  if(geo.nearRoad(x,y,()=>true,r+(woodland?55:100)))return done(null);
  if(geo.waterAt(x,y,r+30)||geo.obstacle(x,y,r+45))return done(null);
  if(woodland&&inProtectedSite(x,y,r))return done(null);
  // Preserve the former decorative groundcover contract: a collidable young
  // tree may never spawn on a visible non-solid flowerbed or reed tuft.
  // Use deterministic real mature-feature coordinates, not visual guesses.
  const fx=Math.floor(x/span),fy=Math.floor(y/span);
  for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){
   const old=fieldCell(fx+ox,fy+oy);
   if(old&&Math.hypot(x-old.x,y-old.y)<r+old.radius+45)return done(null)
  }
  for(const cl of clearings)
   if(Math.hypot(x-cl.x,y-cl.y)<Math.min(cl.r,woodland?145:130)+r+35)return done(null);
  const choice=hash(gx,gy,seed+161);
  let kind="oak";
  if(choice<.14&&c?.rock>.44)kind="boulder";
  else if(choice<(c?.pine??.4)*.76+(c?.snow??.2)*.16)kind="pine";
  const feature={id:"grove_"+gx+"_"+gy,x,y,radius:r,kind,solid:true,
   variant:hash(gx,gy,seed+163),snow:c?.snow??.25,moisture:c?.wet??.45,
   biome:reg.id};
  return done(feature)
 }

 // R28: original, visible old-growth crowns around the Hearth's actual
 // physical crossroads. These are collision-backed real trees in the SAME
 // Grove source as their sprites, not a billboard or canopy wallpaper.
 // Each candidate is checked against all 65 authored road centerlines,
 // nearby real field/grove roots, landscape solids, buildings and entrances.
 function rootClearOfRoads(x,y,r){
  for(const road of geo.roads){
   const half=road.halfWidth||76;
   for(const part of road.parts){
    const a=part[0],b=part[1],dx=b[0]-a[0],dy=b[1]-a[1];
    const len2=dx*dx+dy*dy;
    const t=len2?clamp(((x-a[0])*dx+(y-a[1])*dy)/len2,0,1):0;
    if(Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t)<half+r+42)
     return false
   }
  }
  return true
 }
 function buildHearthGrove(){
  const anchor=nodes.greenwood_hearth;
  if(!anchor)return[];
  const hx=anchor.point[0]*scale,hy=anchor.point[1]*scale;
  // Intentional asymmetry: trees frame the cottage and road shoulders
  // with rooted rear crowns and nearer leafy edges rather than a ring.
  // Additional candidates let the real source roots/water win when nearby.
  // R28b puts physical source roots along the VIEWABLE woodland edge,
  // not above the small landscape camera as the first R28 set did.
  // All suggestions must pass the original physical collision audit.
  // R28d: establish the forest border beside, never ABOVE, the actor.
  // Natural crowns may overlap one another offroad, but the character
  // must not appear standing on a huge tree that is actually in front.
  const positions=[
   [260,555,"oak"],[-130,555,"pine"],[195,490,"pine"],
   [130,555,"oak"],[65,360,"oak"],[65,295,"oak"],
   [110,610,"pine"],[-65,555,"oak"],[-350,-350,"oak"],
   [-85,-405,"pine"],[530,-310,"oak"],[420,610,"oak"],
   [-485,-395,"pine"],[635,-325,"pine"],[545,-225,"oak"],
   [-370,-540,"oak"],[-510,540,"oak"],[625,620,"pine"],
   [-125,-530,"pine"],[325,-530,"oak"],
   // R31b: physically grounded painted oaks/pines at the woodland edge,
   // all still subject to roads, water, cottage, other roots and hero clearway.
   [560,470,"oak"],[-550,500,"oak"],[650,330,"pine"],
   [-660,365,"oak"],[625,625,"oak"],[555,375,"pine"],
   [-600,565,"oak"],[685,480,"oak"],[-750,485,"oak"],
   [785,370,"pine"],[510,510,"oak"]
  ];
  // The painted canopy projects vertically ABOVE its physical tree root.
  // A source-valid trunk can still make the sprite appear UNDER the hero
  // if its broad upper crown is painted into the central camera clearway.
  function crownCoversHero(dx,dy,r,kind){
   if(dy< -25)return false;
   const factor=kind==="oak"?1.20:1.08,
    width=r*(kind==="oak"?5.4:4.6)*factor,
    height=r*(kind==="oak"?7.0:7.6)*factor;
   return Math.abs(dx)<width*.5+38&&dy-height<46
  }
  const rooted=[];
  for(let index=0;index<positions.length;index++){
   if(rooted.length>=10)break;
   const [dx,dy,kind]=positions[index],
    x=hx+dx,y=hy+dy,r=52+Math.floor(hash(index,217,seed)*9);
   if(crownCoversHero(dx,dy,r,kind))continue;
   if(!onLand(x,y)||regionAt(x,y)?.id!=="greenwood"||
      geo.waterAt(x,y,r+26)||geo.obstacle(x,y,r+60)||
      inProtectedSite(x,y,r)||!rootClearOfRoads(x,y,r))continue;
   if(clearings.some(c=>Math.hypot(x-c.x,y-c.y)<
       Math.min(c.r,145)+r+42))continue;
   if(rooted.some(o=>Math.hypot(o.x-x,o.y-y)<o.radius+r+76))
    continue;
   let crowded=false;
   const fx=Math.floor(x/span),fy=Math.floor(y/span),
    gx=Math.floor(x/GROVE_SPAN),gy=Math.floor(y/GROVE_SPAN);
   for(let by=-2;by<=2&&!crowded;by++)for(let bx=-2;bx<=2;bx++){
    const old=fieldCell(fx+bx,fy+by);
    if(old&&Math.hypot(old.x-x,old.y-y)<old.radius+r+20){
     crowded=true;break
    }
   }
   for(let by=-2;by<=2&&!crowded;by++)for(let bx=-2;bx<=2;bx++){
    const old=groveCell(gx+bx,gy+by);
    if(old&&Math.hypot(old.x-x,old.y-y)<old.radius+r+20){
     crowded=true;break
    }
   }
   if(crowded)continue;
   const weather=climate?.sample(x,y);
   rooted.push({id:"hearth_root_"+index,x,y,radius:r,kind,
    solid:true,biome:"greenwood",variant:hash(index,973,seed),
    snow:weather?.snow??.07,moisture:weather?.wet??.49,
    authoredGrove:true})
  }
  return rooted
 }
 const hearthGroveRoots=buildHearthGrove();

 // R37: source-anchored, physically rooted Greenwood Falls forest.
 // Candidate positions cannot override roads, water, steps or older roots.
 function buildFallsGrove(){
  const n=nodes.falls_overlook;if(!n)return[];
  const hx=n.point[0]*scale,hy=n.point[1]*scale,rooted=[];
  // R38: do NOT let distant random grove candidates exhaust the slots
  // before the actual 720x405 overlook view gets a forest on both sides.
  // These are deliberate SITE-RELATIVE candidates only: each candidate
  // must still pass the exact unchanged physical road/water/root tests.
  const composed=[
   [-445,310,"oak"],[-605,130,"pine"],[-745,350,"oak"],
   [-535,-115,"oak"],[-825,-260,"pine"],[-350,515,"oak"],
   [-665,535,"pine"],[-990,85,"oak"],[-880,-545,"pine"],
   [405,355,"oak"],[590,205,"pine"],[665,-115,"oak"],
   [800,400,"pine"],[395,-480,"oak"],[945,-255,"pine"],
   [1020,110,"oak"],[920,630,"pine"],[-285,-685,"oak"],
   [270,-655,"pine"],[-1180,510,"oak"]
  ];
  for(let i=0;i<composed.length+168&&rooted.length<18;i++){
   const nearby=i<composed.length,slot=composed[i],
    k=i-composed.length;
   const angle=(k+.73)*2.399963229728653,
    distance=485+(k%9)*131+hash(k,seed,431)*77;
   const x=hx+(nearby?slot[0]:Math.cos(angle)*distance*1.12),
    y=hy+(nearby?slot[1]:Math.sin(angle)*distance*.90-55),
    r=53+hash(i,seed,433)*14,dx=x-hx,dy=y-hy;
   if(Math.hypot(dx,dy)<430||
     (dy>0&&dy<520&&Math.abs(dx)<245))continue;
   const kind=nearby?slot[2]:(k%5===0||k%7===0)?"pine":"oak";
   if(!onLand(x,y)||regionAt(x,y)?.id!=="greenwood_falls"||
     geo.waterAt(x,y,r+40)||geo.obstacle(x,y,r+70)||
     inProtectedSite(x,y,r)||!rootClearOfRoads(x,y,r)||
     geo.nearRoad(x,y,()=>true,r+105))continue;
   if(clearings.some(c=>Math.hypot(x-c.x,y-c.y)<
     Math.min(c.r,205)+r+62))continue;
   // Front-side painted crowns must not cover the player's vista.
   const w=r*(kind==="oak"?5.4:4.6)*1.2,
    h=r*(kind==="oak"?7:7.6)*1.2;
   if(dy>0&&Math.abs(dx)<w*.5+92&&dy-h<70)continue;
   if(rooted.some(o=>Math.hypot(o.x-x,o.y-y)<o.radius+r+68))
    continue;
   let crowded=false;
   const fx=Math.floor(x/span),fy=Math.floor(y/span),
    gx=Math.floor(x/GROVE_SPAN),gy=Math.floor(y/GROVE_SPAN);
   for(let oy=-2;oy<=2&&!crowded;oy++)for(let ox=-2;ox<=2;ox++){
    const old=fieldCell(fx+ox,fy+oy);
    if(old?.solid&&Math.hypot(old.x-x,old.y-y)<old.radius+r+35)
     crowded=true
   }
   for(let oy=-2;oy<=2&&!crowded;oy++)for(let ox=-2;ox<=2;ox++){
    const old=groveCell(gx+ox,gy+oy);
    if(old&&Math.hypot(old.x-x,old.y-y)<old.radius+r+35)
     crowded=true
   }
   if(crowded)continue;
   const weather=climate?.sample(x,y);
   rooted.push({id:"falls_root_"+i,x,y,radius:r,kind,solid:true,
    biome:"greenwood_falls",variant:hash(i,seed,439),
    snow:weather?.snow??.04,moisture:weather?.wet??.65,
    authoredGrove:true,authoredFallsGrove:true,authoredFallsFrameR38:nearby})
  }
  return rooted
 }
 const fallsGroveRoots=buildFallsGrove();


 function groves(bounds,pad=220){
  const [x0,y0,x1,y1]=bounds,result=[];
  for(let iy=Math.floor((y0-pad)/GROVE_SPAN)-1;iy<=Math.floor((y1+pad)/GROVE_SPAN)+1;iy++)
   for(let ix=Math.floor((x0-pad)/GROVE_SPAN)-1;ix<=Math.floor((x1+pad)/GROVE_SPAN)+1;ix++){
    const o=groveCell(ix,iy);
    if(o&&o.x+o.radius+190>=x0&&o.x-o.radius-190<=x1&&
       o.y+o.radius+240>=y0&&o.y-o.radius-240<=y1)result.push(o)
   }
  for(const o of [...hearthGroveRoots,...fallsGroveRoots]){
   if(o.x+o.radius+200>=x0-pad&&o.x-o.radius-200<=x1+pad&&
      o.y+o.radius+320>=y0-pad&&o.y-o.radius-320<=y1+pad)
    result.push(o)
  }
  return result
 }
 function blocked(x,y,r=10){
  if(!onLand(x,y))return true;
  const gx=Math.floor(x/span),gy=Math.floor(y/span);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
   const obj=fieldCell(gx+dx,gy+dy);
   if(obj?.solid&&Math.hypot(x-obj.x,y-obj.y)<obj.radius+r)return true
  }
  const cx=Math.floor(x/GROVE_SPAN),cy=Math.floor(y/GROVE_SPAN);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
   const obj=groveCell(cx+dx,cy+dy);
   if(obj&&Math.hypot(x-obj.x,y-obj.y)<obj.radius+r)return true
  }
  for(const o of [...hearthGroveRoots,...fallsGroveRoots])
   if(Math.hypot(x-o.x,y-o.y)<o.radius+r)return true;
  return false
 }
 function safePoint(x,y){
  if(!blocked(x,y)&&!geo.blocked(x,y))return{x,y};
  for(let d=20;d<=700;d+=30)for(let a=0;a<32;a++){
   const theta=a*TAU/32,nx=x+Math.cos(theta)*d,ny=y+Math.sin(theta)*d;
   if(!blocked(nx,ny)&&!geo.blocked(nx,ny))return{x:nx,y:ny}
  }
  return{x,y}
 }
 function field(ctx,f){
  const {x,y,radius:r,kind,variant:v}=f;
  const snow=typeof f.snow==="number"?f.snow:(kind==="pine"?.9:.06);
  const wet=typeof f.moisture==="number"?f.moisture:.42;
  if(kind==="flowerbed"||kind==="scrub"||kind==="reeds"){
   ellipse(ctx,x,y+7,r*.85,r*.22,"rgba(35,56,59,.2)");
   for(let i=0;i<9;i++){
    const xx=x+(hash(i,v*100|0,1)-.5)*r*1.3,yy=y+(hash(i,v*100|0,2)-.5)*r*.7;
    fill(ctx,xx,yy-13,4,15,kind==="reeds"?(snow>.55?"#8c9390":"#64816d"):snow>.65?"#768781":"#597754");
    fill(ctx,xx-2,yy-13,5,4,kind==="flowerbed"?(i%3?"#ddd8bb":"#bfa1c5"):snow>.55?"#d1d5c9":wet>.65?"#8bab90":"#97a684")
   }
   return
  }
  ellipse(ctx,x+18,y+10,r*.95,r*.26,"rgba(20,31,49,.33)");
  if(kind==="pine"||kind==="oak"){
   fill(ctx,x-r*.16,y-r*.95,r*.33,r*.96,"#544b45");
   for(let i=3;i>=0;i--){
    const width=r*(kind==="pine"?1.35-i*.17:1.1-i*.08),
     yy=y-r*(kind==="pine"?1.28:1.15)+i*r*.23;
    ellipse(ctx,x,yy,width,r*.38,kind==="pine"?(snow>.44?(i%2?"#39545f":"#49656c"):(i%2?"#365f53":"#547665")):(snow>.45?(i%2?"#677872":"#75877b"):(i%2?"#4b6b53":"#62805d")));
    for(let q=0;q<7;q++){
     const xx=x-width*.72+q*width*.2;
     fill(ctx,xx,yy-r*.18+(q%3)*r*.1,Math.max(4,r*.14),Math.max(3,r*.052),
      kind==="pine"?(snow>hash(q,Math.floor(v*100),i+42)?(q%2?"#90a5a9":"#d1d8d6"):(q%2?"#6a907a":"#8ea78a")):(snow>.5?"#bbc4bd":(q%2?"#89a477":"#b0bb83")))
    }
   }
  }else if(kind==="fallenlog"){
   fill(ctx,x-r,y-r*.23,r*2,r*.42,"#554949");
   fill(ctx,x-r,y-r*.25,r*2,r*.13,"#9a8165");
   for(let i=0;i<5;i++)fill(ctx,x-r+i*r*.44,y-r*.24,6,r*.4,"#473e42")
  }else if(kind==="crystal"){
   polygon(ctx,[[x-r*.75,y],[x-r*.3,y-r*1.7],[x+r*.4,y-r*1.4],[x+r*.77,y],[x+r*.25,y+r*.27]]);
   ctx.fillStyle="#736d9a";ctx.fill();ctx.lineWidth=7;ctx.strokeStyle="#4f4a75";ctx.stroke();
   fill(ctx,x-r*.12,y-r*1.25,r*.18,r*.92,"#b6b1d3")
  }else{
   const stone=kind==="snowstone"?"#8693a8":kind==="ruin"?"#80798e":"#7e7e87";
   polygon(ctx,[[x-r,y],[x-r*.6,y-r*.72],[x+r*.37,y-r*.86],[x+r,y-r*.1],[x+r*.7,y+r*.37],[x-r*.6,y+r*.27]]);
   ctx.fillStyle=stone;ctx.fill();ctx.strokeStyle="#424956";ctx.lineWidth=8;ctx.stroke();
   fill(ctx,x-r*.48,y-r*.67,r*.85,Math.max(5,r*.1),kind==="snowstone"?"#d5dfdf":"#b9b4bd");
   if(kind==="cairn"||kind==="ruin"){
    fill(ctx,x-r*.2,y-r*1.15,r*.6,r*.46,"#6f6d7d");
    fill(ctx,x-r*.22,y-r*1.17,r*.56,Math.max(4,r*.1),"#b0aab4")
   }
  }
 }
 function draws(ctx,bounds){
  // Dark blue-gray cliff-boundary line follows the exact physical land outline.
  const [x0,y0,x1,y1]=bounds;
  const border=poly.some((p,i)=>{
   const q=poly[(i+1)%poly.length];
   return Math.min(p[0],q[0])<=x1+220&&Math.max(p[0],q[0])>=x0-220&&
    Math.min(p[1],q[1])<=y1+220&&Math.max(p[1],q[1])>=y0-220;
  });
  const outside=!onLand((x0+x1)/2,(y0+y1)/2);
  if(border||outside){
   const step=96;for(let y=Math.floor(y0/step)*step;y<y1;y+=step)for(let x=Math.floor(x0/step)*step;x<x1;x+=step)
    if(!onLand(x+step/2,y+step/2)){
     fill(ctx,x,y,step,step,"#303b55");
     if(hash(x/step,y/step,seed)>.55)fill(ctx,x+11,y+14,step*.55,9,"#4b5268")
    }
   if(border){
    polygon(ctx,poly);ctx.strokeStyle="#505973";ctx.lineWidth=38;ctx.stroke();
    polygon(ctx,poly);ctx.strokeStyle="#aeb8c0";ctx.lineWidth=12;ctx.stroke()
   }
  }
  // Altitude contours are visual strata, not new arbitrary barriers.
  // Physics source still governs steep/non-ramped changes.
  for(const contour of model.environment.contours){
   const points=contour.line.map(p=>p.map(v=>v*scale));
   let xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
   if(Math.max(...xs)<x0-250||Math.min(...xs)>x1+250||Math.max(...ys)<y0-250||Math.min(...ys)>y1+250)continue;
   ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));
   ctx.strokeStyle=contour.level>=5?"rgba(220,229,234,.16)":"rgba(69,93,91,.18)";
   ctx.lineWidth=27;ctx.stroke()
  }
 }
 function ring(ctx,h,color,n=14){
  for(let i=0;i<n;i++){
   const a=i*TAU/n,x=h.x+Math.cos(a)*h.r*.38,y=h.y+Math.sin(a)*h.r*.28;
   fill(ctx,x-14,y-8,24,13,color)
  }
 }
 function smithy(ctx,h){
  const s=staticSolids.find(o=>o.id===h.solidId);
  if(!s?.polygon)return;
  const xs=s.polygon.map(p=>p[0]),ys=s.polygon.map(p=>p[1]);
  const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,hh=Math.max(...ys)-y;
  const roofTop=y-hh*.32;
  ellipse(ctx,x+w*.47,y+hh*.91,w*.7,hh*.26,"rgba(24,35,50,.4)");
  fill(ctx,x+7,y+hh*.22,w-14,hh*.78,"#5d4f51");
  // Dark wood beams, amber windows, door and chimney for a true village anchor.
  for(let i=0;i<7;i++){
   const xx=x+14+i*(w-25)/7;
   fill(ctx,xx,y+hh*.26,9,hh*.72,"#413c45");
  }
  fill(ctx,x+w*.12,y+hh*.53,w*.15,hh*.20,"#c99e62");
  fill(ctx,x+w*.14,y+hh*.55,w*.11,hh*.14,"#f0c37f");
  fill(ctx,x+w*.68,y+hh*.50,w*.17,hh*.21,"#d1a772");
  fill(ctx,x+w*.70,y+hh*.53,w*.13,hh*.13,"#f4c785");
  fill(ctx,x+w*.39,y+hh*.52,w*.22,hh*.48,"#292e38");
  fill(ctx,x+w*.40,y+hh*.54,w*.19,hh*.45,"#67554b");
  fill(ctx,x+w*.565,y+hh*.77,9,9,"#d8b984");
  polygon(ctx,[[x-65,y+hh*.24],[x+w*.46,roofTop-115],[x+w+70,y+hh*.22],[x+w+38,y+hh*.36],[x+w*.48,y+hh*.04],[x-30,y+hh*.39]]);
  ctx.fillStyle="#495469";ctx.fill();ctx.lineWidth=16;ctx.strokeStyle="#2f3b50";ctx.stroke();
  for(let k=0;k<8;k++){
   const yy=roofTop-55+k*(hh*.40/8);
   fill(ctx,x+55,yy,w*.79,10,k%2?"#75839a":"#8d99af");
   for(let j=0;j<8;j++)if((j+k)%3!==0)fill(ctx,x+70+j*w*.09,yy+3,16,5,"#c4d1d7")
  }
  fill(ctx,x+w*.73,roofTop-105,w*.10,95,"#5e5a64");
  fill(ctx,x+w*.71,roofTop-105,w*.14,13,"#c8cfd0");
 }
 function hubDraw(ctx,bounds){
  for(const h of hubs){
   if(h.x+h.r<bounds[0]-200||h.x-h.r>bounds[2]+200||h.y+h.r<bounds[1]-200||h.y-h.r>bounds[3]+200)continue;
   // Artist-authored hub composition: a textured clearing, not an icon or
   // solid billboard painted over the existing footpaths.
   const material=h.kind==="settlement"||h.kind==="monument"?"#a5a9af":
    h.kind==="arcane"?"#91859f":h.kind==="camp"?"#907f6d":
    h.kind==="clearing"?"#87977a":"#879084";
   ctx.save();ctx.globalAlpha=.18;
   ellipse(ctx,h.x,h.y,h.r*.60,h.r*.35,material);
   ctx.restore();
   if(h.kind==="settlement"||h.kind==="monument"||h.kind==="sanctuary"||h.kind==="arcane")
    ring(ctx,h,h.kind==="arcane"?"#b6afca":"#bdc6c8");
   if(h.kind==="smithy")smithy(ctx,h);
   if(h.kind==="camp"||h.kind==="market"){
    ring(ctx,h,"#796b5e",9);
    fill(ctx,h.x-23,h.y-30,46,30,"#5f4f4a");
    fill(ctx,h.x-10,h.y-53,22,33,"#e1ad6b");
    fill(ctx,h.x-6,h.y-67,12,26,"#f6d7a0")
   }
   if(h.kind==="cave"){
    ellipse(ctx,h.x,h.y-100,240,155,"#414256");
    ellipse(ctx,h.x,h.y-90,135,112,"#1a2636");
    for(let i=0;i<5;i++)fill(ctx,h.x-145+i*66,h.y-140,35,18,"#77758c")
   }
   if(h.kind==="lodge"||h.kind==="hermit"){
    fill(ctx,h.x-120,h.y-165,240,126,"#534c46");
    polygon(ctx,[[h.x-155,h.y-160],[h.x,h.y-285],[h.x+155,h.y-160]]);
    ctx.fillStyle=h.kind==="lodge"?"#7b8891":"#60725b";ctx.fill();
    fill(ctx,h.x-35,h.y-110,70,70,"#c3a875")
   }
   if(h.kind==="watchtower"){
    // Keep the original high-altitude watchtower as a separate art task.
    for(let i=0;i<5;i++)fill(ctx,h.x-170+i*64,h.y-140+(i%2)*9,42,65,"#8f8a92")
   }
   // R36: the Falls lookout is an open, authored landscape, not five
   // freestanding fake monoliths. The full illustration draws in the
   // world landmark pass using the original R18 painted asset.
  }
 }
 function drawScenery(ctx,bounds){
  for(const obj of [...cells(bounds),...groves(bounds)].sort((a,b)=>a.y-b.y))field(ctx,obj);
  hubDraw(ctx,bounds)
 }
 function drawForeground(ctx,player){
  const bounds=[player.x-300,player.y-280,player.x+300,player.y+250];
  for(const o of cells(bounds)){
   if(!["pine","oak"].includes(o.kind)||o.y<=player.y||Math.abs(o.x-player.x)>o.radius*1.2||o.y-player.y>o.radius*1.55)continue;
   ctx.save();ctx.globalAlpha=.37;
   ellipse(ctx,o.x,o.y-o.radius*.9,o.radius*.8,o.radius*.45,
    o.kind==="pine"?(o.snow>.43?"#4b6571":"#4d7664"):"#537454");ctx.restore()
  }
 }
 function debug(ctx,bounds){
  for(const item of cells(bounds)){
   if(!item.solid)continue;
   ctx.beginPath();ctx.arc(item.x,item.y,item.radius,0,TAU);
   ctx.lineWidth=5;ctx.strokeStyle="rgba(255,69,75,.73)";ctx.stroke()
  }
  polygon(ctx,poly);ctx.lineWidth=7;ctx.strokeStyle="rgba(255,185,68,.95)";ctx.stroke()
 }
 function stats(){
  return{version:VERSION,regions:regions.size,majorHubs:hubs.length,routeClearings:clearings.length,
   sourceFieldCell:span,outlinePoints:poly.length,cachedFields:cachedFields.size,maximumCachedFields:MAX_CACHE,groveCells:groveCache.size,maximumGroves:MAX_GROVE_CACHE,
   hearthRootedOldGrowth:hearthGroveRoots.length,fallsRootedGroveR37:fallsGroveRoots.length,
   fallsCompositionTreesR38:fallsGroveRoots.filter(o=>o.authoredFallsFrameR38).length,
   fallsPlaceholderPylonsRemovedR36:true,landmassCollision:true,climateEnabled:!!climate};
 }
 return{version:VERSION,source,climate,onLand,regionAt,fieldCell,cells,groves,blocked,safePoint,draws,drawScenery,drawForeground,debug,stats,
  featureAt:(x,y)=>fieldCell(Math.floor(x/span),Math.floor(y/span))}
}
window.VeilwardFootprint={version:VERSION,validate,create,inside};
})();