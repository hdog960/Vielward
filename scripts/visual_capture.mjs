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
 await page.goto("http://127.0.0.1:"+port+"/",{waitUntil:"domcontentloaded"});
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
 await page.click("#worldPreviewBtn");
 await page.waitForFunction(()=>document.querySelector("#reviewAtlasBtn")?.style?.display==="block",null,{timeout:60000});
 await settle(page);
 await capture(page,"HOLLOWREACH");
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
  title:document.title}));
 console.log("VISUAL_QA_RUNTIME "+JSON.stringify(state));
 if(state.build!=="v1.3.6"||state.regions!==12||!state.illustration||!state.setpieces)
  throw Error("Incomplete v1.3.6 visual preview "+JSON.stringify(state));
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
 writeFileSync("artifacts/"+name.toLowerCase()+"_r2.jpg",full);
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
