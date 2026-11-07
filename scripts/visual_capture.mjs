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
 await page.goto("http://127.0.0.1:"+port+"/?vwbuild=1.3.21",{waitUntil:"networkidle"});
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
 await page.evaluate(()=>window.__veilwardCaptureStream.jumpToNode("village"));
 await page.click("#pauseBtn");
 await page.click("#reviewAtlasBtn");
 await page.waitForFunction(()=>document.querySelectorAll(".reviewRegion canvas").length===12);
 await sleep(1700);
 await capture(page,"ATLAS");
 await page.locator('.reviewRegion[aria-label="Explore Greenwood"]').click();
 await settle(page);
 await capture(page,"GREENWOOD");
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
 if(state.build!=="v1.3.21"||state.regions!==12||!state.illustration||!state.setpieces||!state.raster||state.plateMode!=="seam-composed"||!state.neighborhoodAtlas||!state.foregroundRoofDepth||!state.stonewalls||state.villageHouses!==2||!state.wallHorizontal||!state.winterBootTrails||!state.rootedLandscape||!state.paintedFlagstones||
  !state.architectureAtlas||!state.architectureRejected||!state.sourceContours||
  state.cottageVariants!==4||state.cottagePixelSource!==256)
  throw Error("Incomplete v1.3.21 visual preview "+JSON.stringify(state));
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
 writeFileSync("artifacts/"+name.toLowerCase()+"_contours_r14.jpg",full);
 console.log("VISUAL_CAPTURE "+name+" bytes="+full.length);
 // Reduced preview is also printed in small chunks for machine inspection
 // of actual browser pixels through the GitHub job log.
 await page.setViewportSize({width:720,height:405});
 const jpg=await page.screenshot({type:"jpeg",quality:32,animations:"disabled"});
 const data=jpg.toString("base64");
 for(let i=0;i<data.length;i+=3800)
  console.log("VISUAL_FRAME_"+name+"_PART:"+data.slice(i,i+3800));
 await page.setViewportSize(original);
}
