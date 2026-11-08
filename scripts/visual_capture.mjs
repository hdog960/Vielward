/* Source-controlled browser captures of the real playable world. */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
const port=8787,server=spawn("python3",["-m","http.server",String(port),"--bind","127.0.0.1"],{stdio:"ignore"});
const sleep=ms=>new Promise(done=>setTimeout(done,ms));
let browser;
try{
 mkdirSync("artifacts",{recursive:true});
 await sleep(1200);
 browser=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
 const page=await browser.newPage({viewport:{width:1136,height:640},deviceScaleFactor:1,hasTouch:true});
 const errs=[];page.on("pageerror",err=>errs.push(String(err)));
 page.setDefaultTimeout(45000);
 // The installed PWA service worker can navigate clients once on activation.
 // Supply the known build selector up front so it cannot destroy the
 // image-inspection execution context mid-check.
 await page.goto("http://127.0.0.1:"+port+"/?vwbuild=1.3.32",{waitUntil:"networkidle"});
 await sleep(450);
 // Capture the approved illustrated scenes from the original authored assets,
 // for a truthful source-to-playable-world comparison. Never fabricate an
 // "after" screenshot by placing the source backdrop behind world sprites.
 for(const [key,filename] of [["VILLAGE","village_v06_clear.jpg"],["FOREST","wilds_clean.jpg"]]){
  const shot=await page.evaluate(async file=>{
   const image=new Image();image.src="./assets/"+file;
   await image.decode();
   const canvas=document.createElement("canvas");canvas.width=900;canvas.height=584;
   const c=canvas.getContext("2d");
   c.drawImage(image,0,0,canvas.width,canvas.height);
   return {width:image.naturalWidth,height:image.naturalHeight,data:canvas.toDataURL("image/jpeg",.48).split(",")[1]};
  },filename);
  const bytes=Buffer.from(shot.data,"base64");
  writeFileSync("artifacts/reference_"+key.toLowerCase()+".jpg",bytes);
  console.log("APPROVED_REFERENCE_"+key+"_DIMENSIONS "+shot.width+"x"+shot.height);
  for(let i=0;i<shot.data.length;i+=3800)
   console.log("APPROVED_REFERENCE_"+key+"_PART:"+shot.data.slice(i,i+3800));
 }

 await page.waitForFunction(()=>document.querySelector("#beginBtn")?.textContent?.includes("ENTER HOLLOWREACH"),null,{timeout:60000});
 await page.click("#beginBtn");
 await page.click("#pauseBtn");
 // Capture the actual streamed game instance without any production-game
 // QA hook or save/quest mutation. This wrapper exists ONLY in this browser.
 await page.evaluate(()=>{
  const original=window.VeilwardWorldStream.create;
  window.VeilwardWorldStream.create=function(...args){
   const stream=original.apply(this,args);
   window.__veilwardCaptureStream=stream;
   return stream
  }
 });
 await page.click("#worldPreviewBtn");
 await page.waitForFunction(()=>document.querySelector("#reviewAtlasBtn")?.style?.display==="block",null,{timeout:60000});
 await settle(page);
 await capture(page,"HOLLOWREACH");
 // R11: inspect an ACTUAL, source-authored walkable village street where
 // subtle compressed boot impressions sit atop the hand-painted snow road.
 const snowpath=await page.evaluate(()=>{
  const stream=window.__veilwardCaptureStream;
  if(!stream?.raster?.stats()?.sourceBoundWinterFootpaths)
   throw Error("Source-road winter boots not registered in game");
  const baseX=282*60+385,baseY=305*60+10;
  let pt=null;
  for(let r=0;r<=410&&!pt;r+=40)for(let i=0;i<20;i++){
   const angle=i*Math.PI*2/20,x=baseX+Math.cos(angle)*r,
    y=baseY+Math.sin(angle)*r;
   if(!stream.blocked(x,y)){pt={x,y};break}
  }
  if(!pt)throw Error("No safe street viewport for R11");
  stream.player.x=pt.x;stream.player.y=pt.y;
  stream.player.moving=false;stream.warm(pt.x,pt.y,1950,1150);
  return pt
 });
 console.log("R11_SOURCE_ROAD_TRACKS "+JSON.stringify(snowpath));
 await sleep(1200);
 await capture(page,"HOLLOWREACH_SNOWPATHS");
 // R8: verify the NEW physical escarpments at real world coordinates instead
 // of considering a screenshot of the village square sufficient evidence.
 // The check is a throwaway browser camera visit, not a gameplay save/teleport.
 const physicalTerraces=await page.evaluate(()=>{
  const s=window.__veilwardCaptureStream;
  const px=277*60,py=294*60;
  if(!s||s.blocked(px,py))throw Error("R8 terrace viewpoint is not walkable");
  const names=["hollowreach_west_snow_terrace","hollowreach_north_terrace",
   "hollowreach_west_lower_lip"];
  const rocks=names.map(name=>s.geometry.solids.find(o=>o.id===name));
  if(rocks.some(o=>!o||!s.raster.handlesWinterSolid(o)))
   throw Error("R8 authored cliffs missing from the real physical renderer");
  s.player.x=px;s.player.y=py;s.player.moving=false;
  s.warm(px,py,2100,1400);
  return rocks.map(o=>o.id)
 });
 console.log("R8_SOURCE_BACKED_TERRACES "+JSON.stringify(physicalTerraces));
 await sleep(1400);
 await capture(page,"HOLLOWREACH_TERRACES");
 // R9: inspect the FOUR source-backed western winter trees and their
 // continuous undergrowth at a real, walkable player location.
 const shelterbelt=await page.evaluate(()=>{
  const stream=window.__veilwardCaptureStream;
  const trees=stream.geometry.solids.filter(x=>x.id?.startsWith("hollowreach_west_spruce_"));
  const baseX=275.8*60,baseY=306*60;
  if(trees.length!==4||stream.raster.stats().shelterbeltSourceTrees!==4)
   throw Error("Missing R9 collidable forest art");
  // Footprint generation can place a pre-existing boulder/sapling at one
  // camera coordinate. Find the nearest *actually passable* boot point.
  let view=null;
  for(let r=0;r<=720&&!view;r+=45)for(let k=0;k<20;k++){
   const a=k*Math.PI*2/20,x=baseX+r*Math.cos(a),y=baseY+r*Math.sin(a);
   if(!stream.blocked(x,y)){view={x,y};break}
  }
  if(!view)throw Error("No playable western grove camera location");
  stream.jumpToNode("village"); // resets camera; no persistent save
  stream.player.x=view.x;stream.player.y=view.y;stream.player.moving=false;
  stream.warm(view.x,view.y,2100,1400);
  return {trees:trees.map(t=>t.id),view}
 });
 console.log("R9_SOURCE_BACKED_SHELTERBELT "+JSON.stringify(shelterbelt));
 await sleep(1300);
 await capture(page,"HOLLOWREACH_SHELTERBELT");
 // R10: capture the ACTUAL stone-and-snow retaining walls from a walkable
 // Western passage without changing the game's save or production code.
 const wallView=await page.evaluate(()=>{
  const s=window.__veilwardCaptureStream;
  const walls=s.geometry.solids.filter(w=>w.material==="retaining-wall");
  const target={x:282*60-335,y:305*60+22};
  if(walls.length!==2||s.raster.stats().retainingWallSegments!==2)
   throw Error("Physical Hollowreach R10 walls are absent");
  let view=null;
  for(let rad=0;rad<=420&&!view;rad+=35)for(let k=0;k<20;k++){
   const a=k*Math.PI*2/20,x=target.x+rad*Math.cos(a),
    y=target.y+rad*Math.sin(a);
   if(!s.blocked(x,y)){view={x,y};break}
  }
  if(!view)throw Error("No walkable village alley camera viewpoint");
  s.jumpToNode("village");s.player.x=view.x;s.player.y=view.y;
  s.player.moving=false;s.warm(view.x,view.y,1950,1150);
  return {wallIDs:walls.map(w=>w.id),view}
 });
 console.log("R10_SOURCE_BACKED_RETAINING_WALLS "+JSON.stringify(wallView));
 await sleep(1300);
 await capture(page,"HOLLOWREACH_WALLS");
 // R12: photograph a genuinely walkable view of the connected west-cliff
 // and four collision-backed spruce roots, not an art mockup.
 const landscape=await page.evaluate(()=>{
  const s=window.__veilwardCaptureStream;
  if(!s?.raster?.stats()?.sourceRootedLandscape||
    !s.raster.stats().paintedStoneFlagstones||
    !s.raster.stats().crispRasterSprites)
   throw Error("R12 art is not in the actual game renderer");
  const goal={x:276*60,y:300*60};let view=null;
  for(let r=0;r<700&&!view;r+=40)for(let k=0;k<24;k++){
   const a=k*Math.PI*2/24,x=goal.x+r*Math.cos(a),
    y=goal.y+r*Math.sin(a);
   if(!s.blocked(x,y)){view={x,y};break}
  }
  if(!view)throw Error("No playable R12 source-slope camera point");
  s.player.x=view.x;s.player.y=view.y;s.player.moving=false;
  s.warm(view.x,view.y,2100,1450);return view
 });
 console.log("R12_SOURCE_ROOTED_WINTER_SLOPE "+JSON.stringify(landscape));
 await sleep(1400);
 await capture(page,"HOLLOWREACH_R12_LANDSCAPE");
 // R13: physically existing cottage viewport, not a standalone art preview.
 const cottageView=await page.evaluate(()=>{
  const stream=window.__veilwardCaptureStream;
  const houses=stream?.setpieces?.objects?.filter(o=>
    o.anchor==="village"&&o.kind==="snow_cottage")||[];
  if(houses.length!==2||!window.VeilwardArchitectureAtlas?.ready)
   throw Error("R13 source atlas absent, or original village houses lost");
  const target=houses[0];
  let view=null;
  for(let radius=200;radius<650&&!view;radius+=35){
   for(let step=0;step<24;step++){
    const angle=step*Math.PI*2/24,x=target.x+Math.cos(angle)*radius,
     y=target.y+Math.sin(angle)*radius;
    if(!stream.blocked(x,y)){view={x,y};break}
   }
  }
  if(!view)throw Error("No safe player viewpoint at illustrated winter home");
  stream.player.x=view.x;stream.player.y=view.y;stream.player.moving=false;
  stream.warm(view.x,view.y,2000,1300);
  return{view,originalHomeIDs:houses.map(o=>o.id)}
 });
 console.log("R13_PROTECTED_ORIGINAL_COTTAGES "+JSON.stringify(cottageView));
 await sleep(1300);
 await capture(page,"HOLLOWREACH_R13_ORIGINAL_PROTECTED");
 // R14 physically anchored cliff/road material must be live in the rendered
 // game, not an unrelated static illustration.
 const contours=await page.evaluate(()=>{
  const s=window.__veilwardCaptureStream;
  if(!s?.raster?.stats()?.physicallyBoundSnowContours||
     s.raster.stats().terrainPhysicsChanged)throw Error("R14 source contour pass absent");
  const n=s.geometry.solids.find(o=>o.id==="hollowreach_north_terrace");
  if(!n?.polygon)throw Error("R14 original cliff collider missing");
  let view=null,baseX=294*60,baseY=293*60;
  for(let radius=0;radius<=650&&!view;radius+=45)
   for(let step=0;step<20;step++){
    const angle=step*Math.PI*2/20,
     x=baseX+Math.cos(angle)*radius,y=baseY+Math.sin(angle)*radius;
    if(!s.blocked(x,y)){view={x,y};break}
   }
  if(!view)throw Error("R14 cliff contour viewpoint is not safely walkable");
  s.player.x=view.x;s.player.y=view.y;s.player.moving=false;
  s.warm(view.x,view.y,2100,1300);return view
 });
 console.log("R14_SOURCE_CLIFF_CONTOURS "+JSON.stringify(contours));
 await sleep(1300);
 await capture(page,"HOLLOWREACH_R14_CONTOURS");
 // R15 inspect new independent pixel-art cliff on a REAL physical terrace.
 const escarpmentView=await page.evaluate(()=>{
  const s=window.__veilwardCaptureStream;
  if(!s?.raster?.stats()?.sourceLandscapeAtlasReady||
     s.raster.stats().sourceWinterCliffSprites!==2)
   throw Error("R15 real rendered winter environment atlas not loaded");
  const cliff=s.geometry.solids.find(o=>o.id==="hollowreach_west_snow_terrace");
  if(!cliff?.polygon)throw Error("R15 cliff must be physically authored");
  const xs=cliff.polygon.map(p=>p[0]),ys=cliff.polygon.map(p=>p[1]);
  const targetX=Math.max(...xs)+220,targetY=Math.max(...ys)+170;
  let view=null;
  for(let radius=0;radius<630&&!view;radius+=35)
   for(let step=0;step<24;step++){
    const angle=step*Math.PI*2/24,x=targetX+Math.cos(angle)*radius,
     y=targetY+Math.sin(angle)*radius;
    if(!s.blocked(x,y)){view={x,y};break}
   }
  if(!view)throw Error("No physical walkable cliff review viewpoint");
  s.player.x=view.x;s.player.y=view.y;s.player.moving=false;
  s.warm(view.x,view.y,1950,1300);return view
 });
 console.log("R15_SOURCE_ESCARPMENT_VIEW "+JSON.stringify(escarpmentView));
 await sleep(1350);
 await capture(page,"HOLLOWREACH_R15_ESCARPMENT");
 // A real, walkable camera view of the physical R16 snow deposition field.
 const fanView=await page.evaluate(()=>{
  const stream=window.__veilwardCaptureStream;
  if(!stream?.raster?.stats()?.sourceLinkedSnowFans)
   throw Error("R16 snow fans not present in actual world");
  const cliff=stream.geometry.solids.find(o=>o.id==="hollowreach_west_snow_terrace");
  if(!cliff?.polygon)throw Error("R16 physical cliff missing");
  const x=cliff.polygon.reduce((v,p)=>v+p[0],0)/cliff.polygon.length;
  const y=Math.max(...cliff.polygon.map(p=>p[1]))+245;
  let view=null;
  for(let radius=0;radius<700&&!view;radius+=35)
   for(let i=0;i<24;i++){
    const a=i*Math.PI*2/24,px=x+Math.cos(a)*radius,
      py=y+Math.sin(a)*radius;
    if(!stream.blocked(px,py)){view={x:px,y:py};break}
   }
  if(!view)throw Error("R16 has no genuinely walkable photo viewpoint");
  stream.player.x=view.x;stream.player.y=view.y;stream.player.moving=false;
  stream.warm(view.x,view.y,2100,1450);return view
 });
 console.log("R16_PHYSICAL_CLIFF_FAN "+JSON.stringify(fanView));
 await sleep(1400);await capture(page,"HOLLOWREACH_R16_SNOW_FANS");
 await page.evaluate(()=>window.__veilwardCaptureStream.jumpToNode("village"));
 await page.click("#pauseBtn");
 await page.click("#reviewAtlasBtn");
 await page.waitForFunction(()=>document.querySelectorAll(".reviewRegion canvas").length===12);
 await sleep(1700);
 await capture(page,"ATLAS");
 await page.locator('.reviewRegion[aria-label="Explore Greenwood"]').click();
 await settle(page);
 await capture(page,"GREENWOOD");
 // Source-backed tree art R17: photograph a genuinely walkable glade with
 // source rooted trees, NOT a separate illustration or layout mockup.
 const woodlandReview=await page.evaluate(()=>{
  const stream=window.__veilwardCaptureStream;
  if(stream?.illustration?.stats()?.greenwoodAtlasSprites!==15)
   throw Error("R17 live Greenwood foliage atlas not connected to game");
  const n=stream.model.nodes.find(n=>n.id==="greenwood_hearth");
  if(!n)throw Error("Greenwood source anchor missing");
  const x=n.point[0]*60,y=n.point[1]*60;
  let view=null;
  for(let radius=0;radius<=700&&!view;radius+=35)
   for(let k=0;k<24;k++){
    const a=k*Math.PI/12,xx=x+Math.cos(a)*radius,
      yy=y+Math.sin(a)*radius;
    if(!stream.blocked(xx,yy)){view={x:xx,y:yy};break}
   }
  if(!view)throw Error("No valid source-rooted Greenwood visual review point");
  stream.player.x=view.x;stream.player.y=view.y;stream.player.moving=false;
  stream.warm(view.x,view.y,2300,1650);
  return view
 });
 console.log("R17_SOURCE_GREENWOOD_GLADE "+JSON.stringify(woodlandReview));
 await sleep(1350);await capture(page,"GREENWOOD_R17_FOLIAGE");
 // R17b: the crossroads clearing is deliberately free of solid trees.
 // Visit a real SOURCE oak/pine root so we visually inspect the new sprites.
 const groveView=await page.evaluate(()=>{
  const s=window.__veilwardCaptureStream;
  const n=s.model.nodes.find(o=>o.id==="greenwood_hearth"),
    x=n.point[0]*60,y=n.point[1]*60;
  const bounds=[x-5000,y-5000,x+5000,y+5000];
  const trees=[...s.footprint.cells(bounds,400),
    ...s.footprint.groves(bounds,400)].filter(o=>
     ["oak","pine"].includes(o.kind)&&
     s.footprint.regionAt(o.x,o.y)?.id==="greenwood");
  trees.sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y));
  if(!trees.length)throw Error("R17b Greenwood has no existing tree roots to inspect");
  let target=null,view=null;
  for(const root of trees){
   const minDist=Math.max(150,root.radius*1.45);
   for(let rad=minDist;rad<minDist+600&&!view;rad+=40)
    for(let k=0;k<24;k++){
     const a=k*Math.PI/12,xx=root.x+Math.cos(a)*rad,
       yy=root.y+Math.sin(a)*rad;
     if(!s.blocked(xx,yy)){view={x:xx,y:yy};target=root;break}
    }
   if(view)break
  }
  if(!view)throw Error("No valid boot point near a real Greenwood tree");
  s.player.x=view.x;s.player.y=view.y;s.player.moving=false;
  s.warm(view.x,view.y,2300,1650);
  return {view,root:{id:target.id,kind:target.kind,r:target.radius,
   x:target.x,y:target.y}}
 });
 console.log("R17B_SOURCE_GREENWOOD_TREE "+JSON.stringify(groveView));
 await sleep(1400);await capture(page,"GREENWOOD_R17_ROOTED_TREE");
 // R18 photographed original alpha tree art on its physical source root,
 // not a separately composited scene or reference painting.
 const paintedView=await page.evaluate(async()=>{
  const s=window.__veilwardCaptureStream,asset=window.VeilwardGreenwoodArt;
  if(!asset?.paintedReady)throw Error("R18 original Greenwood AVIF failed to decode: "+asset?.paintedError);
  const can=asset.paintedSource;
  if(!can||can.width!==512||can.height!==128)
   throw Error("R18 four-cell original illustration atlas not assembled");
  const cc=can.getContext("2d",{willReadFrequently:true});
  const pixels=cc.getImageData(0,0,512,128).data;
  const counts=[0,0,0,0];
  for(let i=0;i<pixels.length;i+=4)if(pixels[i+3]>50)
   counts[Math.floor((i/4)%512/128)]++;
  if(counts.some(n=>n<1400))
   throw Error("R18 artwork contains transparent/empty source cells: "+counts);
  const grove=s.model.nodes.find(o=>o.id==="greenwood_hearth");
  const cx=grove.point[0]*60,cy=grove.point[1]*60;
  const b=[cx-5100,cy-5100,cx+5100,cy+5100];
  const trees=[...s.footprint.cells(b,400),...s.footprint.groves(b,400)]
   .filter(o=>["oak","pine"].includes(o.kind)&&
    s.footprint.regionAt(o.x,o.y)?.id==="greenwood"&&
    ((Math.floor(o.variant*849)%5)+5)%5!==1);
  trees.sort((a,b)=>Math.hypot(a.x-cx,a.y-cy)-Math.hypot(b.x-cx,b.y-cy));
  let view=null,target=null;
  for(const tree of trees){
   const dist=Math.max(155,tree.radius*1.55);
   for(let r=dist;r<dist+620&&!view;r+=35)for(let k=0;k<24;k++){
    const a=k*Math.PI/12,x=tree.x+Math.cos(a)*r,y=tree.y+Math.sin(a)*r;
    if(!s.blocked(x,y)){view={x,y};target=tree;break}
   }
   if(view)break
  }
  if(!view)throw Error("No walkable source Greenwood painted-tree viewpoint");
  s.player.x=view.x;s.player.y=view.y;s.player.moving=false;
  s.warm(view.x,view.y,2450,1600);
  return{view,root:{id:target.id,kind:target.kind,x:target.x,y:target.y}}
 });
 console.log("R18_SOURCE_PAINTED_GREENWOOD_TREE "+JSON.stringify(paintedView));
 await sleep(1400);await capture(page,"GREENWOOD_R18_PAINTED_TREE");
 // R19: show the real walkable Greenwood junction and painted road shoulders.
 const vergeView=await page.evaluate(()=>{
  const stream=window.__veilwardCaptureStream;
  if(!window.VeilwardGreenwoodArt?.paintedReady)
   throw Error("R19 Greenwood source paintings missing");
  const art=window.VeilwardGreenwoodArt.create({
   footprint:stream.footprint,geometry:stream.geometry
  });
  if(!art.stats().roadVergesFromSource||
     art.stats().matureTreeCanopyScale<1.5)
   throw Error("R19 forest corridor not active");
  stream.jumpToNode("greenwood_hearth");
  const view={x:stream.player.x,y:stream.player.y};
  if(stream.blocked(view.x,view.y))
   throw Error("R19 physical Greenwood junction not walkable");
  stream.warm(view.x,view.y,2100,1450);
  return view
 });
 console.log("R19_GREENWOOD_PHYSICAL_PATH "+JSON.stringify(vergeView));
 await sleep(1550);await capture(page,"GREENWOOD_R19_ROAD_CORRIDOR");
 // R23: original blue-roof woodland house, NOT a pasted concept scene.
 // Inspect the actual physical forest_cottage setpiece and a walkable
 // lookout in the original surrounding road/forest geometry.
 const hearthView=await page.evaluate(()=>{
  const s=window.__veilwardCaptureStream;
  const painter=window.VeilwardGreenwoodHearth;
  const cottages=s.setpieces.objects.filter(o=>o.kind==="forest_cottage"&&
   o.anchor==="greenwood_hearth");
  if(cottages.length!==1||!painter?.ready||painter.stats().sourceSize!==256)
   throw Error("R23 independent painted hearth cottage not installed");
  const o=cottages[0];
  let view=null;
  for(let radius=0;radius<480&&!view;radius+=35)
   for(let k=0;k<24;k++){
    const angle=2*Math.PI*k/24,x=o.x+150+radius*Math.cos(angle),
     y=o.y+100+radius*Math.sin(angle);
    if(!s.blocked(x,y)){view={x,y};break}
   }
  if(!view)throw Error("R23 hearth house has no original walkable approach");
  s.player.x=view.x;s.player.y=view.y;s.player.moving=false;
  s.warm(view.x,view.y,1950,1300);
  const f=s.framing(720,405,.78);
  if(f.landmark!=="greenwood_hearth"||f.focus<.96||f.anchorY<.78)
   throw Error("R23 real-cottage camera composition did not activate");
  return{view,cottage:{id:o.id,x:o.x,y:o.y,r:o.r},stamps:painter.stats().stamps,
   framing:f}
 });
 console.log("R23_REAL_HEARTH_COTTAGE "+JSON.stringify(hearthView));
 await sleep(1400);await capture(page,"GREENWOOD_R23_HEARTH_COTTAGE");
 // R24 live-game painted woodland floor at the original hearth approach.
 const habitat=await page.evaluate(()=>{
  const s=window.__veilwardCaptureStream;
  const painter=window.VeilwardGreenwoodArt?.create({
   footprint:s.footprint,geometry:s.geometry,model:s.model
  });
  const stats=painter?.stats();
  if(!stats?.paintedGladeHabitat||
     stats.namedHabitatAnchors.join(",")!=="greenwood_hearth,hermit")
   throw Error("R24 source-linked original landmark habitat unavailable");
  s.jumpToNode("greenwood_hearth");
  if(s.blocked(s.player.x,s.player.y))
   throw Error("R24 original Greenwood hearth waypoint became blocked");
  s.warm(s.player.x,s.player.y,2100,1450);
  return {x:s.player.x,y:s.player.y,anchors:stats.namedHabitatAnchors}
 });
 console.log("R24_GREENWOOD_SOURCE_HABITAT "+JSON.stringify(habitat));
 // Diagnose the genuinely rendered canvas strokes without changing
 // or rewriting the player's map. Instrument only this Playwright instance.
 const r25DrawCalls=await page.evaluate(()=>{
  const s=window.__veilwardCaptureStream;
  const source=s.art.paintChunk,metrics={chunks:0,groundPlate:0,old32atlas:0,
    otherAtlas:0,brightRects:0,brightStyles:{},materialSamples:[]};
  s.art.paintChunk=function(ctx,bounds,pixels){
   metrics.chunks++;
   const originalImage=ctx.drawImage,originalRect=ctx.fillRect;
   ctx.drawImage=function(img,...args){
    const w=img?.width||img?.naturalWidth||0;
    const h=img?.height||img?.naturalHeight||0;
    if(w===256&&h===256&&args.length===8)metrics.groundPlate++;
    else if(w===256&&h===256)metrics.otherAtlas++;
    if(w===256&&h===256&&args.length===8&&args[2]===16&&args[3]===16)
     metrics.groundPlate++;
    if(w===256&&h===256&&args.length===8&&args[2]===32&&args[3]===32)
     metrics.old32atlas++;
    return originalImage.call(this,img,...args)
   };
   ctx.fillRect=function(x,y,w,h){
    const style=String(this.fillStyle);
    if((style.startsWith("#")||style.startsWith("rgba")||style.startsWith("rgb"))&&
       (style.includes("235")||style.includes("240")||style.includes("231")||
        style.includes("f0e")||style.includes("e9d")||style.includes("ecd")||
        style.includes("d8b"))){
     metrics.brightRects++;
     metrics.brightStyles[style]=(metrics.brightStyles[style]||0)+1
    }
    return originalRect.call(this,x,y,w,h)
   };
   try{return source(ctx,bounds,pixels)}
   finally{ctx.drawImage=originalImage;ctx.fillRect=originalRect}
  };
  s.clearCache();s.warm(s.player.x,s.player.y,1600,1000);
  s.art.paintChunk=source;
  return metrics
 });
 console.log("R25_CANVAS_SOURCE_DRAWS "+JSON.stringify(r25DrawCalls));
 await sleep(1250);await capture(page,"GREENWOOD_R24_HABITAT");
 // R25 must be judged in the SAME playable Hearth camera, not a concept.
 await capture(page,"GREENWOOD_R25_GROUND");
 // Test-only A/B diagnostic: temporarily mask the SINGLE original fern
 // atlas cell to locate which source produces the unwanted white squares.
 // Restore the source pixel data immediately: not a player-facing game mode.
 const fernDiagnostic=await page.evaluate(()=>{
  const art=window.VeilwardGreenwoodArt?.paintedSource;
  const s=window.__veilwardCaptureStream;
  const node=s.model.nodes.find(n=>n.id==="greenwood_hearth");
  const x=node.point[0]*s.model.worldDesign.worldUnitScale,
   y=node.point[1]*s.model.worldDesign.worldUnitScale;
  const materials=[[0,0],[190,0],[-190,90],[380,220]]
   .map(([dx,dy])=>({
    at:[dx,dy],ground:s.art.materialAt(x+dx,y+dy),
    region:s.footprint.regionAt(x+dx,y+dy)?.id
   }));
  const t=art?.getContext("2d");
  if(!t?.getImageData)return{materials,masked:false};
  window.__savedGreenwoodFernCell=t.getImageData(256,0,128,128);
  t.clearRect(256,0,128,128);s.clearCache();
  return{materials,masked:true}
 });
 console.log("R25_GROUND_SOURCE_DIAGNOSTIC "+JSON.stringify(fernDiagnostic));
 if(fernDiagnostic.masked){
  try{
   await sleep(1000);await capture(page,"GREENWOOD_R25_DIAGNOSTIC_FERNS_MASKED");
  }finally{
   await page.evaluate(()=>{
    const t=window.VeilwardGreenwoodArt.paintedSource.getContext("2d");
    t.putImageData(window.__savedGreenwoodFernCell,256,0);
    window.__veilwardCaptureStream.clearCache();
    delete window.__savedGreenwoodFernCell
   });
   await sleep(500)
  }

 }
 // Second test-only A/B isolates the remaining white rectangles by painter
 // stage, rather than claiming any absent visual changes are successful.
 // Base-only pixel source: test whether old-looking light squares
 // appear in the actual material compositor before any props or overlays.
 await page.evaluate(()=>{
  const stream=window.__veilwardCaptureStream;
  window.__r25PaintChunk=stream.art.paintChunk;
  stream.art.paintChunk=stream.art.inspectGround;
  stream.clearCache()
 });
 try{
  await sleep(700);await capture(page,"GREENWOOD_R25_BASE_ONLY");
 }finally{
  await page.evaluate(()=>{
   const stream=window.__veilwardCaptureStream;
   stream.art.paintChunk=window.__r25PaintChunk;
   stream.clearCache();delete window.__r25PaintChunk
  });
  await sleep(400)
 }
 for(const [name,layer,key] of [
  ["GREENWOOD_R25_NO_GROUND_PASS","illustration","drawGround"],
  ["GREENWOOD_R25_NO_ROAD_PASS","routeArt","draw"],
  ["GREENWOOD_R25_NO_FEATURE_PASS","illustration","drawFeatures"]
 ]){
  await page.evaluate(({layer,key})=>{
   const s=window.__veilwardCaptureStream,owner=s[layer];
   window.__r25TempPainter={owner,key,previous:owner[key]};
   owner[key]=()=>{};s.clearCache()
  },{layer,key});
  try{
   await sleep(750);await capture(page,name)
  }finally{
   await page.evaluate(()=>{
    const s=window.__veilwardCaptureStream;
    const slot=window.__r25TempPainter;
    slot.owner[slot.key]=slot.previous;s.clearCache();
    delete window.__r25TempPainter
   });
   await sleep(500)
  }
 }
 // Isolate the still-visible pale ground squares in the remaining
 // source passes. Each mask lives ONLY inside the Playwright browser and
 // is restored before the next capture and before the browser test exits.
 for(const item of [
  {name:"GREENWOOD_R25_NO_FOOTPRINT_PASS",layer:"footprint",methods:["draws"]},
  {name:"GREENWOOD_R25_NO_SETPIECES_PASS",layer:"setpieces",methods:["draw"]},
  {name:"GREENWOOD_R25_NO_RASTER_PASS",layer:"raster",
   methods:["drawVillageGround","drawWinterFootpaths","drawWinterScene",
    "drawSetpieces","drawVillageAtmosphere"]},
  {name:"GREENWOOD_R25_NO_SOLIDS_PASS",layer:"geometry",solids:true}
 ]){
  await page.evaluate(item=>{
   const s=window.__veilwardCaptureStream,obj=s[item.layer];
   window.__r25TempStage={obj,
    originals:Object.fromEntries((item.methods||[]).map(k=>[k,obj?.[k]])),
    originalSolids:item.solids?obj.solids.slice():null};
   if(item.solids)obj.solids.length=0;
   else for(const k of item.methods||[])if(obj&&typeof obj[k]==="function")obj[k]=()=>{};
   s.clearCache()
  },item);
  try{
   await sleep(650);await capture(page,item.name)
  }finally{
   await page.evaluate(()=>{
    const s=window.__veilwardCaptureStream,p=window.__r25TempStage;
    for(const [key,value] of Object.entries(p.originals||{}))
     if(typeof value==="function")p.obj[key]=value;
    if(p.originalSolids)p.obj.solids.splice(0,p.obj.solids.length,...p.originalSolids);
    s.clearCache();delete window.__r25TempStage
   });
   await sleep(300)
  }
 }
 // Additive pass isolation is more conclusive than single-pass masking:
 // only the genuine production base + one specific original painter.
 for(const layer of ["ground","features","routes","footprint","surfaces","props","setpieces","raster"]){
  const name="GREENWOOD_R25_BASE_PLUS_"+layer.toUpperCase();
  await page.evaluate(layer=>{
   const s=window.__veilwardCaptureStream;
   window.__r25OriginalPainter=s.art.paintChunk;
   s.art.paintChunk=(ctx,bounds,resolution)=>
    s.art.inspectGroundPlus(ctx,bounds,resolution,layer);
   s.clearCache()
  },layer);
  try{await sleep(580);await capture(page,name)}
  finally{
   await page.evaluate(()=>{
    const s=window.__veilwardCaptureStream;
    s.art.paintChunk=window.__r25OriginalPainter;
    s.clearCache();delete window.__r25OriginalPainter
   });await sleep(280)
  }
 }
 const hearthStats=await page.evaluate(()=>window.VeilwardGreenwoodHearth.stats());
 if(hearthStats.stamps<1||!hearthStats.ready)
  throw Error("R23 house source decoded but was not rendered into game");
 // Real walkable hermit's approach: no fake concept canvas or new path.
 const hermitView=await page.evaluate(()=>{
  const stream=window.__veilwardCaptureStream;
  const artist=window.VeilwardGreenwoodArt?.create({
   footprint:stream.footprint,geometry:stream.geometry
  });
  if(!artist?.stats()?.rootedUnderstoryMats||!artist.stats().retiredConfettiFloor)
   throw Error("R20 rooted-forest compositor is not running");
  stream.jumpToNode("hermit");
  if(stream.blocked(stream.player.x,stream.player.y))
   throw Error("R20 hermit waypoint is blocked");
  stream.warm(stream.player.x,stream.player.y,2100,1450);
  return {x:stream.player.x,y:stream.player.y}
 });
 console.log("R20_WALKABLE_HERMIT_APPROACH "+JSON.stringify(hermitView));
 await sleep(1600);await capture(page,"GREENWOOD_R20_HERMIT_FLOOR");
 // R21 source image must be decoded AND rendered at the unchanged
 // hermit waypoint in actual browser gameplay, not concept artwork.
 const refuge=await page.evaluate(()=>{
  const s=window.__veilwardCaptureStream;
  const sprite=window.VeilwardGreenwoodSanctuary;
  if(!sprite?.ready||sprite?.stats()?.sourceWidth!==512||
    s?.illustration?.stats()?.greenwoodSanctuaryIllustration!==true)
   throw Error("R21 authentic illustrated hermit refuge not active");
  s.jumpToNode("hermit");
  if(s.blocked(s.player.x,s.player.y))
   throw Error("R21 painterly house obscured the original walkable anchor");
  s.warm(s.player.x,s.player.y,2250,1500);
  return {x:s.player.x,y:s.player.y,sourcePixels:sprite.stats().sourceWidth}
 });
 console.log("R21_PAINTED_HERMIT_LIVE "+JSON.stringify(refuge));
 await sleep(1550);await capture(page,"GREENWOOD_R21_HERMIT_COTTAGE");
 await capture(page,"GREENWOOD_R25_CANOPY");
 // R22: this same real player point must reveal the entire tall painted
 // roof in a phone-size 16:9 world preview without losing the hero.
 const composition=await page.evaluate(()=>{
  const s=window.__veilwardCaptureStream;
  const f=s.framing(720,405,.78);
  if(f.focus<.98||f.zoom>.575||f.anchorY<.75)
   throw Error("R22 adaptive hermit composition not active");
  // Convert the original refuge's roof offset to SCREEN-space. The
  // absolute world Y coordinate is not comparable to a viewport pixel.
  const playerFoot=405*f.anchorY;
  const roofTop=playerFoot-(88+424)*f.zoom;
  if(roofTop<12||roofTop>65||playerFoot<290||playerFoot>340)
   throw Error("R22 hero/cottage framing not within vertical safe area: "+
     JSON.stringify({roofTop,playerFoot}));
  return f
 });
 console.log("R22_HERMIT_TALL_ROOF_COMPOSITION "+JSON.stringify(composition));
 await sleep(1100);await capture(page,"GREENWOOD_R22_FULL_ROOF");
 await page.click("#pauseBtn");
 await page.click("#reviewAtlasBtn");
 await page.locator('.reviewRegion[aria-label="Explore Coldpine Ridge"]').click();
 await settle(page);
 await capture(page,"COLDPINE");
 await page.click("#pauseBtn");
 await page.click("#reviewAtlasBtn");
 await page.locator('.reviewRegion[aria-label="Explore Frostbridge River"]').click();
 await settle(page);
 await capture(page,"FROSTBRIDGE");
 const state=await page.evaluate(()=>({build:document.querySelector("#buildVersion")?.textContent,
  regions:document.querySelectorAll(".reviewRegion").length,
  illustration:!!window.VeilwardIllustration,
  setpieces:!!window.VeilwardSetpieces,
  raster:!!window.VeilwardRasterPilot?.ready,
  plateMode:window.VeilwardRasterPilot?.materialPlateMode,
  neighborhoodAtlas:!!window.VeilwardRasterPilot?.ready,
  foregroundRoofDepth:window.__veilwardCaptureStream?.raster?.stats()?.frontmostCottageOcclusion===true,
  stonewalls:window.__veilwardCaptureStream?.raster?.stats()?.retainingWallSegments===2,
  villageHouses:window.__veilwardCaptureStream?.setpieces?.objects?.filter(o=>
   o.anchor==="village"&&o.kind==="snow_cottage").length,
  winterBootTrails:window.__veilwardCaptureStream?.raster?.stats()?.sourceBoundWinterFootpaths===true,
  architectureAtlas:window.VeilwardArchitectureAtlas?.ready===true,
  sourceAtlasR15:window.__veilwardCaptureStream?.raster?.stats()?.sourceLandscapeAtlasReady===true,
  sourceFansR16:window.__veilwardCaptureStream?.raster?.stats()?.sourceLinkedSnowFans===true,
  greenwoodR17:window.__veilwardCaptureStream?.illustration?.stats()?.greenwoodAtlasSprites===15,
  greenwoodR18:window.VeilwardGreenwoodArt?.paintedReady===true,
  greenwoodR21:window.VeilwardGreenwoodSanctuary?.ready===true,
  greenwoodR23:window.VeilwardGreenwoodHearth?.ready===true&&
   window.VeilwardGreenwoodHearth?.stats()?.stamps>0,
  greenwoodR20:window.VeilwardGreenwoodArt?.create({
   footprint:window.__veilwardCaptureStream?.footprint,
   geometry:window.__veilwardCaptureStream?.geometry
  }).stats().rootedUnderstoryMats===true,
  greenwoodR19:window.VeilwardGreenwoodArt?.create({
   footprint:window.__veilwardCaptureStream?.footprint,
   geometry:window.__veilwardCaptureStream?.geometry
  }).stats().featheredRoadEdges===true,
  sourceContours:window.__veilwardCaptureStream?.raster?.stats()?.physicallyBoundSnowContours===true,
  architectureRejected:window.__veilwardCaptureStream?.raster?.stats()?.architectureExperimentActive===false,
  cottageVariants:window.__veilwardCaptureStream?.raster?.stats()?.sourceCottageVariants,
  cottagePixelSource:window.__veilwardCaptureStream?.raster?.stats()?.sourceCottagePixels,
  rootedLandscape:window.__veilwardCaptureStream?.raster?.stats()?.sourceRootedLandscape===true,
  paintedFlagstones:window.__veilwardCaptureStream?.raster?.stats()?.paintedStoneFlagstones===true,
  wallHorizontal:(window.__veilwardCaptureStream?.geometry?.solids||[]).filter(o=>
   o.material==="retaining-wall").every(o=>Math.abs(o.a[1]-o.b[1])<2),
  title:document.title}));
 console.log("VISUAL_QA_RUNTIME "+JSON.stringify(state));
 if(state.build!=="v1.3.32"||state.regions!==12||!state.illustration||!state.setpieces||!state.raster||state.plateMode!=="seam-composed"||!state.neighborhoodAtlas||!state.foregroundRoofDepth||!state.stonewalls||state.villageHouses!==2||!state.wallHorizontal||!state.winterBootTrails||!state.rootedLandscape||!state.paintedFlagstones||
  !state.architectureAtlas||!state.architectureRejected||!state.sourceContours||!state.sourceAtlasR15||!state.sourceFansR16||!state.greenwoodR17||!state.greenwoodR18||!state.greenwoodR19||!state.greenwoodR20||!state.greenwoodR21||!state.greenwoodR23||
  state.cottageVariants!==4||state.cottagePixelSource!==256)
  throw Error("Incomplete v1.3.32 visual preview "+JSON.stringify(state));
 if(errs.length)console.warn("BROWSER_PAGE_ERRORS "+JSON.stringify(errs.slice(0,8)));
 console.log("BROWSER_VISUAL_QA_PASS actual world, 12-card atlas, Greenwood, Coldpine and Frostbridge captures");
}finally{
 if(browser)await browser.close();
 server.kill();
}
async function settle(page){
 // The normal game shows a temporary travel toast for 2.7s. Capture the
 // same clean scene a player sees after it goes away, not a HUD banner.
 await page.waitForFunction(()=>document.querySelector("#toast")?.style.display==="none",null,{timeout:10000});
 await sleep(650);
}
async function capture(page,name){
 const original={width:1136,height:640};
 const full=await page.screenshot({type:"jpeg",quality:68,animations:"disabled"});
 writeFileSync("artifacts/"+name.toLowerCase()+"_greenwood_r19b.jpg",full);
 console.log("VISUAL_CAPTURE "+name+" bytes="+full.length);
 // Reduced preview is also printed in small chunks for machine inspection
 // of actual browser pixels through the GitHub job log.
 await page.setViewportSize({width:720,height:405});
 // Let the actual moving camera settle at the NEW viewport. Otherwise
 // screenshot() can photograph the old 1136x640 camera one frame too early,
 // falsely making a corrected tall roof appear clipped.
 await sleep(name==="GREENWOOD_R22_FULL_ROOF"||
  name==="GREENWOOD_R23_HEARTH_COTTAGE"?900:90);
 if(name==="GREENWOOD_R23_HEARTH_COTTAGE"){
  const px=await page.evaluate(()=>{
   const s=window.__veilwardCaptureStream;
   const o=s.setpieces.objects.find(o=>o.kind==="forest_cottage"&&
    o.anchor==="greenwood_hearth");
   const f=s.framing(720,405,.78);
   return{roofTop:(o.y-340-s.camera.y)*f.zoom,
     foot:(s.player.y-s.camera.y)*f.zoom,
     left:(o.x-175-s.camera.x)*f.zoom,
     right:(o.x+175-s.camera.x)*f.zoom,
     focus:f.focus}
  });
  console.log("R23_REAL_COTTAGE_SCREEN_BOUNDS "+JSON.stringify(px));
  if(px.roofTop<12||px.foot>370||px.foot<250||
   px.left<0||px.right>720||px.focus<.96)
   throw Error("R23 actual resized gameplay crop still clips house or hero: "+
    JSON.stringify(px))
 }
 if(name==="GREENWOOD_R22_FULL_ROOF"){
  const projected=await page.evaluate(()=>{
   const s=window.__veilwardCaptureStream,frame=s.framing(720,405,.78);
   const roof=(s.player.y-512-s.camera.y)*frame.zoom;
   const feet=(s.player.y-s.camera.y)*frame.zoom;
   return{roof,feet,zoom:frame.zoom}
  });
  console.log("R22_REAL_SCREEN_PIXEL_BOUNDS "+JSON.stringify(projected));
  if(projected.roof<8||projected.feet>370||projected.feet<250)
   throw Error("R22 genuine resized screenshot still crops house or hero: "+
    JSON.stringify(projected))
 }
 const jpg=await page.screenshot({type:"jpeg",quality:32,animations:"disabled"});
 const data=jpg.toString("base64");
 for(let i=0;i<data.length;i+=3800)
  console.log("VISUAL_FRAME_"+name+"_PART:"+data.slice(i,i+3800));
 await page.setViewportSize(original);
}
