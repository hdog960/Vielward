/* Phase 9 R25: no repetitive bright forest flecks or fake tree geometry.
 * This audit is source/runtime structural; browser appearance needs creator QA. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=f=>fs.readFileSync(f,"utf8");
const bufferCanvases=[];
function pixelFactory(){
 const canvas={width:0,height:0,buffer:null,getContext(){
  return{createImageData(w,h){return{data:new Uint8ClampedArray(w*h*4)}},
   putImageData(buffer){canvas.buffer=buffer.data},fillRect(){}}
 }};
 bufferCanvases.push(canvas);return canvas
}
const t={window:{},Math,Uint8ClampedArray};
vm.runInNewContext(read("terrain_art.js"),t,{filename:"terrain_art.js"});
const painter=t.window.VeilwardTerrainArt;
const plates=painter.makeGreenwoodFloorPlates(pixelFactory);
assert.deepEqual(Object.keys(plates).sort(),["forest","grass","moss"]);
for(const [name,plate] of Object.entries(plates)){
 assert.equal(plate.width,256);assert.equal(plate.height,256);
 assert.equal(plate.buffer.length,256*256*4);
 let min=255,max=0,shiny=0,changed=new Set();
 for(let p=0;p<plate.buffer.length;p+=4){
  const r=plate.buffer[p],g=plate.buffer[p+1],b=plate.buffer[p+2];
  min=Math.min(min,r,g,b);max=Math.max(max,r,g,b);
  if(r>205||g>205||b>205)shiny++;
  if(p%128===0)changed.add(r+":"+g+":"+b);
  assert.equal(plate.buffer[p+3],255)
 }
 assert.ok(changed.size>15,name+" has continuous natural material variation");
 assert.equal(shiny,0,name+" cannot generate the repeated bright flower/leaf squares");
 assert.ok(max-min>8,name+" is not a flat blank solid");
 for(let y=0;y<256;y+=16){
  const a=(y*256)*4,b=(y*256+255)*4;
  assert.ok(Math.abs(plate.buffer[a]-plate.buffer[b])<17,
   name+" source repeats without a violent plate boundary");
 }
}
const drawn=[];
function groundContext(){
 return{save(){},restore(){},fillRect(){},clearRect(){},
 beginPath(){},moveTo(){},lineTo(){},closePath(){},arc(){},
 fill(){},stroke(){},translate(){},scale(){},rotate(){},
 drawImage(...args){drawn.push(args)},createRadialGradient(){return{addColorStop(){}}},
 createLinearGradient(){return{addColorStop(){}}}}
}
class I{
 constructor(){this.onload=null;this.naturalWidth=128;this.naturalHeight=128}
 set src(s){assert.ok(s.includes("greenwood_"));this.onload?.()}
}
const env={console,Math,Image:I,document:{createElement:()=>({
 width:0,height:0,getContext:groundContext})}};
env.window=env;
vm.runInNewContext(read("world_greenwood_art.js"),env,{filename:"world_greenwood_art.js"});
(async()=>{
 assert.equal(await env.VeilwardGreenwoodArt.loadPainted(),true);
 let blocked=false;
 const geo={roads:[],waterAt(){return null},obstacle(){return null},
  nearRoad(){return blocked?{distance:0}:null}};
 const footprint={regionAt(){return{id:"greenwood"}},blocked(){return false}};
 const art=env.VeilwardGreenwoodArt.create({geometry:geo,footprint});
 const roots=[
  {id:"old-oak",kind:"oak",x:100,y:340,radius:65,variant:.3},
  {id:"old-pine",kind:"pine",x:398,y:362,radius:62,variant:.7}
 ];
 const frozen=JSON.stringify(roots),bounds=[0,0,600,500];
 drawn.length=0;
 assert.equal(art.paintCanopyLinks(groundContext(),bounds,roots),1,
  "one foliage connection only between existing rooted trees");
 assert.equal(drawn.length,1);
 assert.equal(drawn[0].length,9);
 assert.ok(drawn[0][4]<128,"only crown painting; never a second trunk");
 assert.equal(JSON.stringify(roots),frozen,"root geometry never mutates");
 blocked=true;drawn.length=0;
 assert.equal(art.paintCanopyLinks(groundContext(),bounds,roots),0,
  "no canopy bridge across original physical roads");
 assert.equal(drawn.length,0);
 blocked=false;
 assert.equal(art.paintCanopyLinks(groundContext(),[2000,0,2500,500],roots),0);
 assert.equal(art.stats().creatorApproved,false);
 assert.equal(art.stats().physicsChanged,false);
 assert.equal(art.stats().rootLinkedCanopy,true);
 assert.ok(read("world_illustration.js").includes("paintCanopyLinks(ctx,bounds,features)"));
 assert.ok(read("index.html").includes("world_greenwood_art.js?v=9&rev=28b"),
  "newer production revision must continue to load the R25 Greenwood atlas");;
 assert.ok(read("index.html").includes("terrain_art.js?v=32&rev=25"));
 assert.ok(read("sw.js").includes("source-glade-habitat-r25b"));
 const illustrationSource=read("world_illustration.js");
 const roadSource=read("world_routes.js");
 assert.ok(!illustrationSource.includes('rect(ctx,xx,yy,10,7,'),
  "clearing waypoint cannot be a ring of 32 fluorescent rectangles");
 assert.ok(roadSource.includes("if(sample?.forest>.72&&sample?.snow<.13)continue"),
  "grounded Greenwood roads cannot stamp disconnected bright gravel squares");
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 console.log("R25b PASS: muted Greenwood material; fake 32-chip clearing ring and gravel flecks retired; rooted canopy and physics/saves protected; art approval still 0%");
})().catch(e=>{console.error(e);process.exitCode=1});
