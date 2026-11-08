/* VEILWARD Phase 9 R24: the original Hearth/Hermit nodes, NEVER new
 * collision roots, anchor visually continuous low woodland groundcover.
 * Functional test does not imply creator acceptance of the appearance. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const originalNodes=JSON.stringify(model.nodes);
let stamps=0,rotations=0,shadePaints=0;
function ctx(){
 return{fillStyle:"",globalAlpha:1,imageSmoothingEnabled:false,
  save(){},restore(){},translate(){},scale(){},rotate(){rotations++},
  beginPath(){},moveTo(){},lineTo(){},closePath(){},arc(){},
  fill(){},fillRect(){shadePaints++},stroke(){},clearRect(){},
  drawImage(...args){
   // Atlas assembly uses three drawImage arguments; only source-to-world
   // nine-argument fern stamps count as finished habitat artwork.
   if(args.length!==9)return;
   assert.equal(args[1],256,"original R18 fern atlas source");
   assert.equal(args[3],128);assert.equal(args[4],128);
   stamps++
  },
  createRadialGradient(){return{addColorStop(){}}},
  createLinearGradient(){return{addColorStop(){}}}
 }
}
class MockImage{
 constructor(){this.onload=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(url){
  assert.ok(url.includes("greenwood_")&&url.includes(".avif"));
  this.naturalWidth=this.naturalHeight=128;this.onload?.()
 }
}
const env={console,Image:MockImage,document:{createElement:()=>({
 width:0,height:0,getContext:ctx})}};env.window=env;
vm.runInNewContext(read("world_greenwood_art.js"),env,
 {filename:"world_greenwood_art.js"});
(async()=>{
 const renderer=env.VeilwardGreenwoodArt;
 assert.equal(renderer.version,"1.3.32");
 assert.equal(await renderer.loadPainted(),true);
 let allRoad=false;
 const footprint={regionAt(){return{id:"greenwood"}},blocked(){return false}};
 const geometry={waterAt(){return null},obstacle(){return null},
   nearRoad(){return allRoad?{distance:0}:null},roads:[]};
 const art=renderer.create({model,footprint,geometry});
 const expected=["greenwood_hearth","hermit"];
 assert.equal(JSON.stringify(art.stats().namedHabitatAnchors),
  JSON.stringify(expected),"only actual authored Greenwood nodes can anchor mats");
 assert.equal(art.stats().paintedGladeHabitat,true);
 assert.equal(art.stats().creatorApproved,false);
 assert.equal(art.stats().physicsChanged,false);
 const hearth=model.nodes.find(n=>n.id==="greenwood_hearth");
 const x=hearth.point[0]*model.worldDesign.worldUnitScale,
       y=hearth.point[1]*model.worldDesign.worldUnitScale;
 const bounds=[x-800,y-800,x+800,y+800];
 assert.equal(art.paintLandmarkHabitat(ctx(),[0,0,100,100]),0,
  "no distant/mismatched part of world receives scenery");
 const count=art.paintLandmarkHabitat(ctx(),bounds);
 assert.ok(count>5&&count<90,
  "dense yet bounded source hub forest floor, no invented tree trunks");
 assert.equal(count,stamps);
 assert.equal(rotations,stamps);
 assert.ok(shadePaints>=stamps,"understory carries diffuse material contact");
 stamps=0;rotations=0;
 assert.equal(art.paintLandmarkHabitat(ctx(),bounds),count);
 assert.equal(stamps,count,"same source gives deterministic material draw");
 allRoad=true;stamps=0;
 assert.equal(art.paintLandmarkHabitat(ctx(),bounds),0,
  "all existing physical road rights-of-way take precedence over brush");
 assert.equal(stamps,0);
 assert.equal(JSON.stringify(model.nodes),originalNodes,
  "no world waypoint or physical anchor changed");
 assert.ok(read("world_illustration.js").includes(
  "VeilwardGreenwoodArt?.create({footprint,geometry,climate,model})"));
 assert.ok(read("sw.js").includes("veilward-hollowreach-v1332-source-glade-habitat"));
 assert.ok(read("index.html").includes("world_greenwood_art.js?v=10"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 console.log("R24 PASS: source-linked illustrated Greenwood habitat, original physical roads clear, no changes to anchors or saves, Phase 9 unapproved");
})().catch(err=>{console.error(err);process.exitCode=1});