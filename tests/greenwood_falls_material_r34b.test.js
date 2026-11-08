/* R34b regression: native seamless Greenwood Falls water, not repeated
 * bright per-cell glyphs; existing rivers, crossing, world/save preserved. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const t={Math,Uint8ClampedArray,window:{}};
vm.runInNewContext(read("terrain_art.js"),t,{filename:"terrain_art.js"});
const maker=t.window.VeilwardTerrainArt.makeGreenwoodFloorPlates;
const plates=maker(()=>{const can={width:0,height:0,data:null,getContext(){
 return{createImageData(w,h){return{data:new Uint8ClampedArray(w*h*4)}},
 putImageData(img){can.data=img.data},fillRect(){}}}};return can});
assert.deepEqual(Object.keys(plates).sort(),["forest","grass","moss","river"]);
const w=plates.river;assert.equal(w.width,256);assert.equal(w.height,256);
let palette=new Set(),lo=255,hi=0;
for(let p=0;p<w.data.length;p+=4){
 const r=w.data[p],g=w.data[p+1],b=w.data[p+2];
 lo=Math.min(lo,r,g,b);hi=Math.max(hi,r,g,b);
 assert.ok(b>r,"river remains blue-green and does not become forest soil");
 assert.equal(w.data[p+3],255);
 if(p%400===0)palette.add(r+":"+g+":"+b)
}
assert.ok(palette.size>18&&hi-lo>25,"natural broad water variation");
for(let y=0;y<256;y+=16){
 const left=(y*256)*4,right=(y*256+255)*4;
 assert.ok(Math.abs(w.data[left]-w.data[right])<17,
  "river plate wraps without a violent tile seam")
}
const terra=read("terrain_art.js");
assert.ok(terra.includes('sourceRegion==="greenwood_falls"'));
assert.ok(terra.includes('"greenwood_falls")continue;'));
assert.ok(read("world_illustration.js").includes('"greenwood_falls"].includes('));
assert.ok(read("world_greenwood_art.js").includes('"greenwood_falls"].includes('));
assert.ok(read("world_greenwood_art.js").includes("paintFallsRiverBanks(ctx,bounds);"));
for(const path of ["index.html","sw.js"]){
 const s=read(path);
 assert.ok(s.includes("world_greenwood_art.js?v=12&rev=34&falls=34b"));
 assert.ok(s.includes("terrain_art.js?v=32&rev=25&falls=34b"));
 assert.ok(s.includes("world_illustration.js?v=28&rev=33b&falls=34b"))
}
assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
assert.ok(read("scripts/visual_capture.mjs").includes(
 'capture(page,"GREENWOOD_R34B_SEAMLESS_FALLS")'));
console.log("R34b PASS: seamless native river and woodland sources;"+
 " old repeating blocky tiles retired; unchanged world/save geometry");
