/* R32 — upper Greenwood forest is drawn from six real collision roots. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=path=>fs.readFileSync(path,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const pictures=[];
const host={console};host.window=host;
function ctx(){return{save(){},restore(){},translate(){},scale(){},
 drawImage(...p){pictures.push(p)},beginPath(){},moveTo(){},arc(){},
 fill(){},fillRect(){},clearRect(){},stroke(){}}}
class Img{
 constructor(){this.onload=null;this.naturalWidth=128;this.naturalHeight=128}
 set src(v){assert.match(v,/greenwood_.*\.avif/);this.onload?.()}
}
host.Image=Img;
host.document={createElement:()=>({width:0,height:0,getContext:()=>ctx()})};
vm.runInNewContext(read("world_greenwood_art.js"),host);
(async()=>{
 const art=host.VeilwardGreenwoodArt;
 assert.equal(await art.loadPainted(),true);
 pictures.length=0;
 const foot={regionAt(){return{id:"greenwood"}},blocked(){return true}};
 const geo={waterAt(){return false},nearRoad(){return false}};
 const painter=art.create({model,footprint:foot,geometry:geo});
 const h=model.nodes.find(n=>n.id==="greenwood_hearth"),
  hx=h.point[0]*60,hy=h.point[1]*60;
 const physical=[
  ["hearth_root_8","oak",-350,-350],
  ["hearth_root_9","pine",-85,-405],
  ["hearth_root_10","oak",530,-310],
  ["hearth_root_15","oak",-370,-540],
  ["hearth_root_20","oak",560,470],
  ["hearth_root_23","oak",-660,365]
 ].map(([id,kind,dx,dy])=>({id,kind,x:hx+dx,y:hy+dy,
   radius:55,authoredGrove:true}));
 const bounds=[hx-1200,hy-900,hx+1200,hy+1100];
 const snapshot=JSON.stringify(physical);
 const n=painter.paintHearthUpperForest(ctx(),bounds,physical);
 assert.equal(n,10,"four rear roots give eight crowns, both side oaks one each");
 assert.equal(pictures.length,n);
 for(const params of pictures){
  assert.equal(params.length,9);
  assert.equal(params[2],0);
  assert.equal(params[3],128);
  assert.equal(params[4],78);
  assert.ok(params[7]>280&&params[8]>170,
   "real native cropped canopy has mature landscape scale");
 }
 assert.equal(JSON.stringify(physical),snapshot,"source root physics unchanged");
 const fake={id:"fake_northern_tree",kind:"oak",x:hx-300,y:hy-350,
  radius:55,authoredGrove:true};
 assert.equal(painter.paintHearthUpperForest(ctx(),bounds,[fake]),0,
  "unrooted and unapproved decoration rejected");
 assert.equal(painter.paintHearthUpperForest(ctx(),[0,0,200,200],physical),0,
  "offscreen chunks do not draw unrelated canopy");
 assert.equal(painter.stats().upperForestGalleryR32,true);
 assert.equal(painter.stats().creatorApproved,false);
 assert.equal(painter.stats().physicsChanged,false);
 assert.ok(read("world_illustration.js").includes(
  "paintHearthUpperForest(ctx,bounds,features)"));
 for(const p of ["index.html","sw.js"]){
  assert.ok(read(p).includes("world_greenwood_art.js?v=10&rev=32"));
  assert.ok(read(p).includes("world_illustration.js?v=27&rev=32"));
 }
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 assert.ok(read("scripts/visual_capture.mjs").includes(
  'capture(page,"GREENWOOD_R32_UPPER_FOREST")'));
 console.log("R32 PASS: "+n+" source R18 canopy boughs from six original physical trees;"+
  " unchanged saves, roads, player and scenery physics; approval remains pending");
})().catch(e=>{console.error(e);process.exitCode=1});
