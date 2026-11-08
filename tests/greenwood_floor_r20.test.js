/* Vielward Phase 9 R20 — rooted illustrated forest floor, no altered physics.
 * Tests only source integrity, not creator visual acceptance. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const roots=[
 {id:"source_oak",kind:"oak",x:115,y:105,radius:54,variant:.34,solid:true},
 {id:"source_pine",kind:"pine",x:250,y:125,radius:55,variant:.72,solid:true}
];
const sourceRoots=JSON.stringify(roots),images=[];
function ctx(){
 return {fillStyle:"",strokeStyle:"",globalAlpha:1,
 save(){},restore(){},translate(){},scale(){},beginPath(){},moveTo(){},
 lineTo(){},arc(){},closePath(){},stroke(){},fill(){},clip(){},
 fillRect(){},clearRect(){},setLineDash(){},
 drawImage(...args){images.push(args)},
 createRadialGradient(){return{addColorStop(){}}},
 createLinearGradient(){return{addColorStop(){}}}
 }
}
class MockImage{
 constructor(){this.onload=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(src){
  assert.ok(src.includes("greenwood_")&&src.includes(".avif"),"only original R18 art");
  this.naturalWidth=this.naturalHeight=128;this.onload?.()
 }
}
const geo={
 roads:[],waterAt(){return null},nearRoad(){return null},obstacle(){return null}
};
const footprint={
 regionAt(x){return{id:x>650?"coldpine":"greenwood"}},
 cells(){return[roots[0]]},
 groves(){return[roots[1]]}
};
const env={console,Image:MockImage,document:{createElement:()=>({width:0,height:0,getContext:ctx})}};
env.window=env;
vm.runInNewContext(read("world_greenwood_art.js"),env,{filename:"world_greenwood_art.js"});
(async()=>{
 const renderer=env.VeilwardGreenwoodArt;
 assert.equal(renderer.version,"1.3.32");
 assert.equal(await renderer.loadPainted(),true);
 const art=renderer.create({geometry:geo,footprint});
 assert.equal(art.stats().rootedUnderstoryMats,true);
 assert.equal(art.stats().retiredConfettiFloor,true);
 assert.equal(art.stats().physicsChanged,false);
 assert.equal(art.stats().creatorApproved,false);
 images.length=0;
 const bounds=[-200,-200,520,520];
 const count=art.paintRootedUnderstory(ctx(),bounds,roots);
 assert.ok(count>=4,"existing tree roots generate connected fern understory");
 assert.equal(images.length,count,"all floor cover reuses original transparent R18 fern");
 assert.ok(images.every(a=>a[1]===256&&a[3]===128&&a[4]===128),
  "no new unlicensed source art or fake tree trunks");
 assert.equal(JSON.stringify(roots),sourceRoots,"art cannot mutate source tree colliders");
 const before=images.length;
 assert.equal(art.paintRootedUnderstory(ctx(),bounds,
  [{...roots[0],x:1000}]),0,"no biome contamination");
 assert.equal(images.length,before);
 images.length=0;
 assert.ok(art.paintForestFloor(ctx(),bounds)>=2,
  "source floor paints under both real original trunks");
 assert.ok(images.length>=4,"forest floor uses cohesive authored mat source");
 const illustration=read("world_illustration.js");
 const materials=read("terrain_art.js");
 assert.ok(illustration.includes('"greenwood","greenwood_falls"].includes('),
  "source-only woodland floor replaces repeated decoration in both forests");
 assert.ok(materials.includes('["greenwood","greenwood_falls"].includes('),
  "no legacy micrograss across Greenwood and Falls");
 assert.ok(read("sw.js").includes("veilward-hollowreach-v1336-greenwood-escarpment-r35"));
 assert.ok(read("index.html").includes("world_greenwood_art.js?v=12"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 console.log("R20 PASS: illustrated root-grown fern mats and retired Greenwood confetti, no source geometry mutation, saved progress retained; visual approval remains 0%");
})().catch(err=>{console.error(err);process.exitCode=1});