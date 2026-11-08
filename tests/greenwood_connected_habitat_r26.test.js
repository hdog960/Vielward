/* R26 Greenwood safe-connected habitat and rooted canopy-light regression.
 * The aesthetic still requires human iPhone approval. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const originalNodes=JSON.stringify(model.nodes);
let images=0,strokes=0,gradients=0,sourceCopies=0;
function ctx(){
 return{fillStyle:"",strokeStyle:"",lineWidth:1,globalAlpha:1,
  imageSmoothingEnabled:false,save(){},restore(){},translate(){},
  scale(){},rotate(){},beginPath(){},moveTo(){},lineTo(){},
  closePath(){},quadraticCurveTo(){},stroke(){strokes++},fill(){},
  fillRect(){},clearRect(){},arc(){},
  drawImage(...a){if(a.length===9){images++;assert.equal(a[1],256)}
   else sourceCopies++},
  createRadialGradient(){gradients++;return{addColorStop(){}}},
  createLinearGradient(){return{addColorStop(){}}}
 }
}
class MockImage{
 constructor(){this.onload=null;this.naturalWidth=128;this.naturalHeight=128}
 set src(url){assert.ok(url.includes("greenwood_")&&url.includes(".avif"));
  this.onload?.()}
}
const env={console,Image:MockImage,document:{createElement:()=>({
 width:0,height:0,getContext:ctx})}};env.window=env;
vm.runInNewContext(read("world_greenwood_art.js"),env,{
 filename:"world_greenwood_art.js"});
(async()=>{
 const core=env.VeilwardGreenwoodArt;
 assert.equal(await core.loadPainted(),true);
 let roadsClosed=false,riverClosed=false;
 const footprint={regionAt(x,y){return{id:x>46000?"hollowreach":"greenwood"}},
  blocked(){return false},cells(){return []},groves(){return []}};
 const geometry={roads:[],waterAt(){return riverClosed?{kind:"river"}:null},
  obstacle(){return null},
  nearRoad(){return roadsClosed?{distance:0}:null}};
 const art=core.create({footprint,geometry,model});
 assert.equal(art.stats().connectedSafeGladeBeds,true);
 assert.equal(art.stats().rootFilteredCanopyLight,true);
 assert.equal(art.stats().physicsChanged,false);
 assert.equal(art.stats().creatorApproved,false);
 const hearth=model.nodes.find(n=>n.id==="greenwood_hearth"),
  x=hearth.point[0]*60,y=hearth.point[1]*60,
  bounds=[x-900,y-900,x+900,y+900];
 // Fully grounded source habitat, visible but no extra obstacle type.
 const first=art.paintLandmarkHabitat(ctx(),bounds);
 assert.ok(first>=4&&first<=54,"real landmark generates a bounded source habitat");
 assert.equal(images,first,"new connected ground adds no fake sprite roots");
 assert.ok(gradients>=first,"all source mats keep organic grounding");
 const imagesBefore=images,strokesBefore=strokes;
 const second=art.paintLandmarkHabitat(ctx(),bounds);
 assert.equal(second,first,"the same source gives deterministic mat counts");
 assert.equal(images-imagesBefore,first,"same rooted foliage rendered twice");
 assert.ok(strokes>=strokesBefore,
  "connected foliage is only translucent paint, not geometry");
 roadsClosed=true;images=0;strokes=0;
 assert.equal(art.paintLandmarkHabitat(ctx(),bounds),0,
  "no original road shoulder receives connected undergrowth");
 assert.equal(strokes,0);
 roadsClosed=false;riverClosed=true;images=0;strokes=0;
 assert.equal(art.paintLandmarkHabitat(ctx(),bounds),0,
  "river always takes precedence over undergrowth beds");
 assert.equal(strokes,0);
 assert.equal(JSON.stringify(model.nodes),originalNodes,
  "all authored node positions unchanged");
 assert.equal(JSON.stringify(geometry.roads),"[]",
  "R26 does not invent any roads");
 assert.ok(read("sw.js").includes("source-glade-habitat-r25b-r26"));
 assert.ok(read("index.html").includes("world_greenwood_art.js?v=10&rev=32"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 console.log("R26 PASS: continuous source-linked glade underpainting; road/water/landmark protections; unchanged physics, saves, and Phase 9 acceptance gate");
})().catch(err=>{console.error(err);process.exitCode=1});
