/* VEILWARD — Phase 6 real 12-region landmass, source scenery, unified blockers and routes.
 * Data-authored macro terrain preview. NOT approved final terrain art or collision.
 * The stable v1.2.6 adventure stays intact; this module owns only its optional
 * streaming preview and is never allowed to mutate the legacy local save.
 */
(function(){
"use strict";
const VERSION="1.3.5",TAU=Math.PI*2;
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function hash(x,y,s=0){let n=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(s|0,1274126177);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295}
function rgb(hex){return [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)]}
function tint(color,n){return "rgb("+color.map(v=>Math.round(clamp(v+n,0,255))).join(",")+")"}
const BIOMES={
 "alpine-village":"#a4afbd","alpine-stone":"#b4bbcb","alpine-evergreen":"#839c9c",
 "glacial-water":"#80a7b5","snowmelt":"#a6afa0","temperate-forest":"#688d6d",
 "waterfall-forest":"#79a6a0","lake-wetland":"#7e9990","meadow":"#a0a473",
 "historic-road":"#9f977c","canyon":"#8f7c83","arcane-highland":"#a69eb3"
};
const BIOMECOLORS=Object.fromEntries(Object.entries(BIOMES).map(([k,v])=>[k,rgb(v)]));
function pointInside(p,poly){
 let inside=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if(((a[1]>p[1])!==(b[1]>p[1]))&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }return inside;
}
function segDist(x,y,a,b){
 const dx=b[0]-a[0],dy=b[1]-a[1],d=dx*dx+dy*dy;
 const t=d?clamp(((x-a[0])*dx+(y-a[1])*dy)/d,0,1):0;
 return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)
}
function lineDistance(point,points){let min=Infinity;for(let i=1;i<points.length;i++)min=Math.min(min,segDist(point[0],point[1],points[i-1],points[i]));return min}
function nearestRegion(model,x,y){
 let best=null,d=Infinity;
 for(const r of model.regions){
  const q=Math.hypot(x-r.center[0],y-r.center[1]);
  if(q<d){d=q;best=r}
 }
 return best;
}
function colorAt(model,wx,wy){
 const unit=model.worldDesign.worldUnitScale,x=wx/unit,y=wy/unit;
 const entries=model.regions.map(r=>({r,d:Math.hypot(x-r.center[0],y-r.center[1])})).sort((a,b)=>a.d-b.d).slice(0,3);
 let sum=0,out=[0,0,0];
 for(const e of entries){const w=1/Math.pow(28+e.d,1.6),col=BIOMECOLORS[e.r.biome]||[126,145,139];sum+=w;for(let i=0;i<3;i++)out[i]+=col[i]*w}
 return out.map(v=>Math.round(v/sum))
}
function validate(model){
 if(!model||model.schema!=="veilward.world-blueprint.v1")throw Error("Unsupported outdoor geography");
 const {worldBounds,worldUnitScale,chunkPlan}=model.worldDesign;
 if(!worldBounds||!worldUnitScale||!chunkPlan||worldBounds.length!==2||model.nodes.length<40||model.edges.length<60)throw Error("Overworld blueprint incomplete");
 if(chunkPlan.totalPlannedCells!==chunkPlan.columns*chunkPlan.rows)throw Error("Outdoor chunk grid invalid");
 return model
}
function create(model,options={}){
 validate(model);
 const unit=model.worldDesign.worldUnitScale,size=model.worldDesign.chunkPlan.worldUnits;
 const columns=model.worldDesign.chunkPlan.columns,rows=model.worldDesign.chunkPlan.rows;
 const width=size*columns,height=size*rows;
 const resolution=options.tileResolution||375,maxTiles=options.maxTiles||18;
 const factory=options.canvasFactory||(()=>document.createElement("canvas"));
 const geometry=options.geometry&&window.VeilwardGeometry?
   window.VeilwardGeometry.create(model,options.geometry):null;
 const climate=window.VeilwardClimate?window.VeilwardClimate.create(model):null;
 const footprint=options.footprint&&geometry&&window.VeilwardFootprint?
   window.VeilwardFootprint.create(model,geometry,options.footprint,{climate}):null;
 const routeArt=geometry&&window.VeilwardRoutes?
   window.VeilwardRoutes.create(model,geometry,{climate}):null;
 const illustration=geometry&&footprint&&climate&&window.VeilwardIllustration?
   window.VeilwardIllustration.create(model,geometry,{footprint,climate}):null;
 const art=options.terrainArt||(geometry&&window.VeilwardTerrainArt?
   window.VeilwardTerrainArt.create(model,geometry,{canvasFactory:factory,footprint,climate,routeArt,illustration}):null);
 const points=Object.fromEntries(model.nodes.map(n=>[n.id,n]));
 const edges=model.edges.map(e=>({
  ...e,polyline:[points[e.from].point,...(e.via||[]),points[e.to].point]
   .map(([x,y])=>[x*unit,y*unit])
 }));
 const water=model.waterways.map(w=>({...w,
  line:(w.centerline||[]).map(([x,y])=>[x*unit,y*unit]),
  polygon:(w.closedPolygon||[]).map(([x,y])=>[x*unit,y*unit]),
  island:(w.islandPolygon||[]).map(([x,y])=>[x*unit,y*unit])
 }));
 const start=points.village.point;
 const player={x:start[0]*unit,y:start[1]*unit,facing:{x:0,y:1},step:0,moving:false};
 const camera={x:0,y:0};let cameraReady=false;
 if(geometry){
  const spawn=footprint?footprint.safePoint(player.x,player.y):geometry.safePoint(player.x,player.y);
  player.x=spawn.x;player.y=spawn.y;
  player.groundHeight=geometry.elevationAt(player.x,player.y);
 }
 const cache=new Map();let renderSerial=0,tilesBuilt=0,peakCache=0,visibleTiles=0,previewTime=0;
 const chunkId=(col,row)=>col+":"+row;
 const bounds=(col,row)=>[col*size,row*size,(col+1)*size,(row+1)*size];
 function segmentTouchesBox(points,x0,y0,x1,y1,pad=0){
  return points.some(p=>p[0]>=x0-pad&&p[0]<=x1+pad&&p[1]>=y0-pad&&p[1]<=y1+pad)||
    points.some((p,i)=>i&&Math.max(Math.min(p[0],points[i-1][0]),x0-pad)<=Math.min(Math.max(p[0],points[i-1][0]),x1+pad)&&
     Math.max(Math.min(p[1],points[i-1][1]),y0-pad)<=Math.min(Math.max(p[1],points[i-1][1]),y1+pad));
 }
 function drawPolyline(ctx,points,outer,inner,strokeWidth){
  ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
  ctx.lineWidth=strokeWidth+outer;ctx.lineJoin="round";ctx.lineCap="round";ctx.strokeStyle=inner;ctx.stroke()
 }
 function buildTile(col,row){
  const c=factory();c.width=resolution;c.height=resolution;
  const ctx=c.getContext("2d",{alpha:false});
  if(!ctx)throw Error("Canvas unavailable for streamed outdoor chunk");
  const x0=col*size,y0=row*size;
  if(art){
   art.paintChunk(ctx,[x0,y0,x0+size,y0+size],resolution);
   tilesBuilt++;return c
  }
  // Sampling on the GLOBAL world grid makes textures meet at chunk edges.
  // This is intentionally data-driven preview terrain, not approved final art.
  const step=30,px=resolution*step/size;
  for(let j=0;j<resolution/px;j++)for(let i=0;i<resolution/px;i++){
   const x=x0+i*step,y=y0+j*step,c0=colorAt(model,x+step*.5,y+step*.5);
   const grain=hash(Math.floor(x/step),Math.floor(y/step),13);
   const n=Math.round((grain-.5)*24);
   ctx.fillStyle=tint(c0,n);
   ctx.fillRect(Math.floor(i*px),Math.floor(j*px),Math.ceil(px)+1,Math.ceil(px)+1);
  }
  ctx.save();ctx.scale(resolution/size,resolution/size);ctx.translate(-x0,-y0);
  const x1=x0+size,y1=y0+size;
  if(geometry)geometry.drawFloor(ctx,[x0,y0,x1,y1]);
  for(const w of water){
   if(w.polygon.length){
    const nearby=w.polygon.some(p=>p[0]>=x0-150&&p[0]<=x1+150&&p[1]>=y0-150&&p[1]<=y1+150);
    if(nearby||pointInside([x0+size/2,y0+size/2],w.polygon)){
     ctx.beginPath();w.polygon.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));
     ctx.closePath();ctx.fillStyle="#365f83";ctx.fill();ctx.lineWidth=55;ctx.strokeStyle="#7897a9";ctx.stroke();
     ctx.beginPath();w.island.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();
     ctx.fillStyle="#8ba483";ctx.fill();ctx.lineWidth=25;ctx.strokeStyle="#c0bd9b";ctx.stroke()
    }
   }else if(w.line.length&&segmentTouchesBox(w.line,x0,y0,x1,y1,1050)){
    drawPolyline(ctx,w.line,170,w.id==="smugglers_chasm"?"#34303b":"#355d76",w.id==="smugglers_chasm"?600:560);
    drawPolyline(ctx,w.line,0,w.id==="smugglers_chasm"?"#171e29":"#5c8ea5",w.id==="smugglers_chasm"?320:360)
   }
  }
  for(const e of edges){
   if(!segmentTouchesBox(e.polyline,x0,y0,x1,y1,210))continue;
   const bridge=!!e.crossing,road=e.kind.includes("road");
   const width=bridge?170:road?156:112;
   drawPolyline(ctx,e.polyline,45,bridge?"#362e30":"#4c534a",width);
   drawPolyline(ctx,e.polyline,0,bridge?"#bca780":road?"#a5a08c":"#8d9881",width-25);
   if(bridge){
    ctx.setLineDash([18,25]);drawPolyline(ctx,e.polyline,0,"rgba(41,46,45,.45)",5);ctx.setLineDash([])
   }
  }
  if(geometry)geometry.drawSolids(ctx,[x0,y0,x1,y1]);
  // Small deterministic ground clusters; no human NPC/collectible art is faked.
  for(let i=0;i<30;i++){
   const gx=x0+hash(col,row,i+31)*size,gy=y0+hash(col+8,row+19,i+50)*size;
   ctx.fillStyle=hash(col,row,i)>.5?"rgba(25,48,35,.13)":"rgba(233,230,208,.19)";
   ctx.fillRect(Math.floor(gx),Math.floor(gy),17+hash(i,col,2)*28,5+hash(i,row,3)*12)
  }
  ctx.restore();tilesBuilt++;
  return c
 }
 function trim(visible){
  if(cache.size<=maxTiles)return;
  const keep=new Set(visible.map(t=>chunkId(t.col,t.row)));
  for(const [key] of cache){if(cache.size<=maxTiles)break;if(!keep.has(key))cache.delete(key)}
  while(cache.size>maxTiles){const oldest=cache.keys().next().value;cache.delete(oldest)}
 }
 function cells(x,y,w,h,padding=0){
  const col0=clamp(Math.floor((x-padding)/size),0,columns-1),col1=clamp(Math.floor((x+w+padding)/size),0,columns-1);
  const row0=clamp(Math.floor((y-padding)/size),0,rows-1),row1=clamp(Math.floor((y+h+padding)/size),0,rows-1);
  const out=[];
  for(let row=row0;row<=row1;row++)for(let col=col0;col<=col1;col++)out.push({col,row,key:chunkId(col,row)});
  return out.sort((a,b)=>Math.hypot((a.col+.5)*size-player.x,(a.row+.5)*size-player.y)-Math.hypot((b.col+.5)*size-player.x,(b.row+.5)*size-player.y))
 }
 function ensure(tile){
  if(cache.has(tile.key)){const value=cache.get(tile.key);cache.delete(tile.key);cache.set(tile.key,value);return value}
  const canvas=buildTile(tile.col,tile.row);
  cache.set(tile.key,canvas);
  return canvas
 }
 function warm(x,y,w=2100,h=1300){
  const list=cells(x-w/2,y-h/2,w,h,200);
  for(const tile of list)ensure(tile);
  trim(list);peakCache=Math.max(peakCache,cache.size);
 }
 function blocked(x,y){
  if(routeArt?.edgeGuard(x,y,10))return true;
  if(footprint&&footprint.blocked(x,y,10))return true;
  if(geometry)return geometry.blocked(x,y,10);
  if(x<60||x>width-60||y<60||y>height-60)return true;
  const pt=[x,y];
  for(const w of water){
   let inWater=false;
   if(w.polygon.length)inWater=pointInside(pt,w.polygon)&&!pointInside(pt,w.island);
   else if(w.line.length)inWater=lineDistance(pt,w.line)<(w.id==="smugglers_chasm"?160:180);
   if(!inWater)continue;
   const crossing=edges.some(e=>e.crossing&&e.waterway===w.id&&lineDistance(pt,e.polyline)<95);
   if(!crossing)return true;
  }
  return false
 }
 function move(dx,dy,dt){
  const speed=165,m=Math.hypot(dx,dy),mx=m>1?dx/m:dx,my=m>1?dy/m:dy;
  const oldX=player.x,oldY=player.y;
  const maxMove=speed*dt,segments=Math.max(1,Math.ceil(maxMove/10));
  for(let i=0;i<segments;i++){
   const x=player.x+mx*maxMove/segments,y=player.y+my*maxMove/segments;
   if(!blocked(x,y)&&(!geometry||geometry.step(player.x,player.y,x,y))){player.x=x;player.y=y}
   else if(!blocked(x,player.y)&&(!geometry||geometry.step(player.x,player.y,x,player.y)))player.x=x;
   else if(!blocked(player.x,y)&&(!geometry||geometry.step(player.x,player.y,player.x,y)))player.y=y;
  }
  const dist=Math.hypot(player.x-oldX,player.y-oldY);
  player.moving=dist>.15;
  if(player.moving){player.facing={x:mx,y:my};player.step=(player.step+dist*TAU/68)%(TAU*100)}
  if(geometry)player.groundHeight=geometry.elevationAt(player.x,player.y);
  previewTime+=dt;
  return dist
 }
 function render(ctx,screenW,screenH,zoom=.78,dt=.016){
  const viewW=screenW/zoom,viewH=screenH/zoom;
  const targetX=clamp(player.x-viewW*.5,0,Math.max(0,width-viewW));
  const targetY=clamp(player.y-viewH*.52,0,Math.max(0,height-viewH));
  if(!cameraReady){camera.x=targetX;camera.y=targetY;cameraReady=true}
  const smooth=1-Math.exp(-Math.max(0,dt)*9);
  camera.x+=(targetX-camera.x)*smooth;
  camera.y+=(targetY-camera.y)*smooth;
  const visible=cells(camera.x,camera.y,viewW,viewH,0);
  const nearby=cells(camera.x,camera.y,viewW,viewH,size);
  // Paint every visible square immediately. Missing tiles get a *colored*
  // fallback rather than black; nearby tiles stream within a bounded budget.
  ctx.save();ctx.imageSmoothingEnabled=false;
  ctx.scale(zoom,zoom);ctx.translate(-Math.floor(camera.x),-Math.floor(camera.y));
  let missing=[];
  for(const t of visible){
   const key=chunkId(t.col,t.row);
   const px=t.col*size,py=t.row*size;
   const tile=cache.get(key);
   if(tile){ctx.drawImage(tile,px,py,size,size)}
   else{ctx.fillStyle=tint(colorAt(model,px+size*.5,py+size*.5),0);ctx.fillRect(px,py,size,size);missing.push(t)}
  }
  ctx.restore();
  // Stream only a couple of tiles per rendered frame; cull old tiles.
  const queue=[...missing,...nearby.filter(t=>!cache.has(t.key)&&!missing.some(m=>m.key===t.key))];
  for(const t of queue.slice(0,2))ensure(t);
  trim(nearby);peakCache=Math.max(peakCache,cache.size);
  visibleTiles=visible.length;renderSerial++;
  return {camera,viewWidth:viewW,viewHeight:viewH,missing:missing.length}
 }
 function jumpToNode(id){
  const node=points[id];if(!node)throw Error("Unknown terrain showcase landmark "+id);
  const x=node.point[0]*unit,y=node.point[1]*unit;
  const ground=footprint?footprint.safePoint(x,y):geometry?geometry.safePoint(x,y):{x,y};
  player.x=ground.x;player.y=ground.y;player.moving=false;player.step=0;
  if(geometry)player.groundHeight=geometry.elevationAt(player.x,player.y);
  cameraReady=false;
  warm(player.x,player.y,2400,1500);
  return{node:id,x:player.x,y:player.y}
 }
 function renderForeground(ctx,playerPosition=player){
  if(art)art.paintForeground(ctx,playerPosition)
 }
 function renderDebug(ctx,screenW,screenH,zoom=.78){
  if(!geometry)return;
  const view=[camera.x,camera.y,camera.x+screenW/zoom,camera.y+screenH/zoom];
  ctx.save();ctx.scale(zoom,zoom);ctx.translate(-Math.floor(camera.x),-Math.floor(camera.y));
  geometry.drawDebug(ctx,view,player);if(footprint)footprint.debug(ctx,view);if(routeArt)routeArt.drawDebug(ctx,view);ctx.restore()
 }
 function nearbyInteraction(){return geometry?.nearbyInteraction(player.x,player.y)||null}
 function regionName(){
  const r=nearestRegion(model,player.x/unit,player.y/unit);
  return r?r.name:"Unmapped wilderness"
 }
 function stats(){return{tilesBuilt,cachedTiles:cache.size,peakCachedTiles:peakCache,
  estimatedCachedRGBABytes:cache.size*resolution*resolution*4,
  visibleTiles,frame:renderSerial,region:regionName(),x:player.x,y:player.y,
  elevation:geometry?.elevationAt(player.x,player.y)??null,
  material:geometry?.materialAt(player.x,player.y)??null,
  worldWidth:width,worldHeight:height,
  geometry:geometry?.stats()??null,
  footprint:footprint?.stats()??null,
  routeNetwork:routeArt?.stats()??null,
  illustration:illustration?.stats()??null,
  climate:climate?.sample(player.x,player.y)??null,
  terrainArt:art?.diagnostics?.()??null}}
 return{version:VERSION,model,geometry,footprint,climate,routeArt,illustration,art,player,camera,size,width,height,move,render,renderDebug,renderForeground,jumpToNode,
  warm,cells,blocked,nearbyInteraction,regionName,stats,clearCache:()=>cache.clear(),
  tile:(col,row)=>cache.get(chunkId(col,row))||null}
}
window.VeilwardWorldStream={version:VERSION,validate,create,pointInside,colorAt,nearestRegion,segDist};
})();