"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const source=fs.readFileSync("world_greenwood_art.js","utf8");
const painted=[];
const ctx={
 imageSmoothingEnabled:true,
 fillStyle:"",
 fillRect(x,y,w,h){
  assert(Number.isFinite(x)&&Number.isFinite(y)&&w>0&&h>0);
  painted.push({x,y,w,h,color:this.fillStyle})
 }
};
const canvas={width:0,height:0,getContext:()=>ctx};
const sandbox={
 window:{},
 document:{createElement:tag=>{assert.equal(tag,"canvas");return canvas}},
 console,Math,Promise
};
// Expose only the internal raster constructor to verify actual painted
// pixels without loading images or altering production source.
const instrumented=source.replace(/\}\)\(\);\s*$/,
 "globalThis.__makeFallsGeology=makeFallsGeology;})();");
assert.notEqual(instrumented,source,"Renderer module footer must be intact");
vm.runInNewContext(instrumented,sandbox,{filename:"world_greenwood_art.js"});
const atlas=sandbox.__makeFallsGeology();
assert.equal(atlas.width,256);
assert.equal(atlas.height,128);
assert(painted.length>2500,"Both original raster studies should contain detailed strata");
const left=painted.filter(p=>p.x<128),right=painted.filter(p=>p.x>=128);
assert(left.length>900&&right.length>900,"Both distinct rock faces must paint pixels");
assert.notDeepEqual(left.map(p=>p.color).slice(0,120),
 right.map(p=>p.color).slice(0,120),"Two banks require distinct material palettes");
assert(source.includes("const useGeology=cell===3&&fallsGeology"),
 "Pixel geology must be integrated into actual Falls gallery");
assert(source.includes("if(!dry)continue"),"Existing terrain exclusion must remain");
console.log("R66 original Greenwood geology raster integration passed");
