/* R34: riverbank rocks and foam must follow the REAL Frostbridge River.
 * All existing tree, road, water and saved-progress geometry is immutable. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const data=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footdata=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
const recorded={images:0,strokes:0};
function ctx(){return{globalAlpha:1,save(){},restore(){},translate(){},
 rotate(){},scale(){},beginPath(){},moveTo(){},lineTo(){},
 closePath(){},stroke(){recorded.strokes++},fill(){},rect(){},
 clip(){},arc(){},fillRect(){},clearRect(){},
 drawImage(...p){assert.ok([3,9].includes(p.length));if(p.length===9)recorded.images++},
 createRadialGradient(){return{addColorStop(){}}}}}
class Img{constructor(){this.onload=null;this.naturalWidth=128;this.naturalHeight=128}
 set src(p){assert.ok(p.includes("greenwood_")&&p.includes(".avif"));this.onload?.()}}
const host={console,Image:Img,document:{createElement:()=>({
 width:0,height:0,getContext:()=>ctx()})}};host.window=host;
for(const p of ["world_geometry.js","world_climate.js",
 "world_footprint.js","world_greenwood_art.js"])
 vm.runInNewContext(read(p),host,{filename:p});
(async()=>{
 assert.equal(await host.VeilwardGreenwoodArt.loadPainted(),true);
 const geo=host.VeilwardGeometry.create(model,data);
 const climate=host.VeilwardClimate.create(model);
 const fp=host.VeilwardFootprint.create(model,geo,footdata,{climate});
 const artist=host.VeilwardGreenwoodArt.create({model,geometry:geo,footprint:fp});
 const all=artist.fallsBankSources();
 assert.ok(all.length>=6,"real water boundary supplies multiple bank anchors");
 assert.ok(all.every(o=>o.solidSource===true));
 for(const o of all){
  assert.ok(fp.onLand(o.x,o.y));
  assert.equal(geo.waterAt(o.x,o.y,0),null,"rock shelf on dry bank");
  assert.equal(geo.waterAt(o.wx,o.wy,0)?.id,"frostbridge_river",
   "foam exactly tracks the physical river");
  assert.equal(geo.nearRoad(o.x,o.y,()=>true,135),null,
   "no rock apron obscures real road or crossing");
 }
 const before=JSON.stringify({
  data,footdata,nodes:model.nodes.length,edges:model.edges.length
 });
 const falls=model.nodes.find(o=>o.id==="falls_e");
 const [fx,fy]=falls.point.map(p=>p*60);
 const view=[fx-3600,fy-3300,fx+2900,fy+3200];
 const n=artist.paintFallsRiverBanks(ctx(),view);
 assert.ok(n>2&&recorded.strokes>0&&recorded.images>0,
  "native painted rock source and joined riverbanks must both render");
 assert.equal(artist.paintFallsRiverBanks(ctx(),[0,0,130,130]),0,
  "worldspace cliff brushes must cull away from falls");
 assert.equal(JSON.stringify({data,footdata,nodes:model.nodes.length,edges:model.edges.length}),before);
 assert.equal(model.nodes.length,48);assert.equal(model.edges.length,65);
 assert.equal(artist.stats().physicsChanged,false);
 assert.equal(artist.stats().creatorApproved,false);
 assert.equal(artist.stats().fallsPhysicalRiverBanksR34,true);
 assert.ok(read("world_greenwood_art.js").includes("paintFallsRiverBanks(ctx,bounds);"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 assert.ok(read("game.js").includes('const APP_VERSION="1.3.36";'));
 for(const p of ["index.html","sw.js"])
  assert.ok(read(p).includes("world_greenwood_art.js?v=12&rev=34"));
 assert.ok(read("scripts/visual_capture.mjs").includes(
  'capture(page,"GREENWOOD_R34_FALLS_RIVERBANK")'));
 console.log("R34 PASS: "+all.length+" source water-verified rock-bank"+
  " anchors, "+recorded.images+" native source rock paintings;"+
  " 65 original roads, seven crossings, 48 waypoints, saves protected");
})().catch(e=>{console.error(e);process.exitCode=1});
