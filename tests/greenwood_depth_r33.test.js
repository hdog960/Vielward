/* R33: actor visually passes behind the same real painted trees as physics. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const draws=[];
const ctx=()=>({globalAlpha:1,save(){},restore(){},translate(){},scale(){},
 drawImage(...v){draws.push(v)},beginPath(){},rect(){},clip(){},arc(){},fill(){},clearRect(){},
 fillRect(){}});
class Img{constructor(){this.onload=null;this.naturalWidth=128;this.naturalHeight=128}
 set src(v){assert.ok(v.includes("greenwood_")&&v.includes(".avif"));this.onload?.()}}
const host={console,Image:Img,document:{createElement:()=>({
 width:0,height:0,getContext:()=>ctx()})}};host.window=host;
vm.runInNewContext(read("world_greenwood_art.js"),host);
(async()=>{
 const art=host.VeilwardGreenwoodArt;
 assert.equal(await art.loadPainted(),true);
 draws.length=0;
 const base=model.nodes.find(n=>n.id==="greenwood_hearth").point;
 const root={id:"hearth_root_20",kind:"oak",solid:true,authoredGrove:true,
  x:base[0]*60+560,y:base[1]*60+470,radius:55,variant:.142};
 let calls=0;
 const foot={
  regionAt(){return{id:"greenwood"}},
  cells(){calls++;return[]},
  groves(){calls++;return[root]},
  blocked(){return true}
 };
 const geo={waterAt(){return false},nearRoad(){return false}};
 const artist=art.create({model,footprint:foot,geometry:geo});
 const player={x:root.x,y:root.y-root.radius*3.7};
 assert.equal(artist.paintForegroundCanopy(ctx(),player),1);
 assert.equal(draws.length,1,"one real upper oak crop over character");
 assert.equal(draws[0].length,9);
 assert.equal(draws[0][1],0);
 assert.equal(draws[0][3],128);
 assert.equal(draws[0][4],90);
 assert.ok(draws[0][7]>300&&draws[0][8]>200);
 assert.equal(artist.paintForegroundCanopy(ctx(),{x:player.x+10,y:player.y+10}),1);
 assert.equal(calls,2,"nearby root queries cached across mobile frames");
 assert.equal(artist.paintForegroundCanopy(ctx(),{x:root.x,y:root.y+160}),0,
  "no leaf covers actor standing in front of tree trunk");
 assert.equal(artist.paintForegroundCanopy(ctx(),{x:root.x+1300,y:player.y}),0,
  "distant tree not used for floating canopy");
 const invalid=[{...root,solid:false},{...root,kind:"flowerbed"}];
 for(const fake of invalid){
  const bad={...foot,groves(){return[fake]}};
  assert.equal(art.create({model,footprint:bad,geometry:geo})
   .paintForegroundCanopy(ctx(),player),0,"unrooted vegetation rejected");
 }
 const snow={...foot,regionAt(){return{id:"hollowreach"}}};
 assert.equal(art.create({model,footprint:snow,geometry:geo})
  .paintForegroundCanopy(ctx(),player),0,"no oak applied in winter");
 assert.ok(read("world_illustration.js").includes(
  "greenwood.paintForegroundCanopy(ctx,player);return"));
 assert.ok(read("world_illustration.js").includes(
  'greenwood.paintForegroundCanopy(ctx,player);return'));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 assert.ok(read("game.js").includes('const APP_VERSION="1.3.36";'));
 for(const p of ["index.html","sw.js"]){
  assert.ok(read(p).includes("world_greenwood_art.js?v=12&rev=34"));
  assert.ok(read(p).includes("world_illustration.js?v=28&rev=33"));
 }
 assert.equal(artist.stats().realActorCanopyDepthR33,true);
 assert.equal(artist.stats().creatorApproved,false);
 assert.equal(artist.stats().physicsChanged,false);
 assert.ok(read("scripts/visual_capture.mjs").includes(
  'capture(page,"GREENWOOD_R33_REAL_CANOPY_DEPTH")'));
 console.log("R33 PASS: physically rooted original canopy occludes actor with"+
 " perspective, cached iPhone queries, no fake flowers, original saves, and no signoff");
})().catch(e=>{console.error(e);process.exitCode=1});
