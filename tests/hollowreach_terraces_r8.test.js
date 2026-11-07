/* Veilward R8 - real collision-backed Hollowreach terraces, connected
 * court and snow-covered approaches. This is implementation QA, NOT visual approval.
 */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const blueprint=JSON.parse(read("docs/overworld/world_blueprint.json"));
const geometryData=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprintData=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
const names=["hollowreach_west_snow_terrace","hollowreach_north_terrace",
 "hollowreach_west_lower_lip"];
assert.equal(blueprint.nodes.length,48);
assert.equal(blueprint.edges.length,65);
assert.equal(blueprint.edges.filter(e=>e.crossing).length,7);
assert.equal(geometryData.solids.filter(s=>s.material==="cliff-face").length,7);
assert.equal(geometryData.solids.length,39);
for(const name of names){
 const rock=geometryData.solids.find(s=>s.id===name);
 assert.ok(rock&&rock.shape==="polygon"&&rock.material==="cliff-face");
 assert.ok(rock.points.length>=4);
}
let painted=0,clipped=0,drawn=0,gradients=0;
function context(){
 return{fillStyle:"",strokeStyle:"",globalAlpha:1,lineWidth:1,
  imageSmoothingEnabled:false,save(){},restore(){},scale(){},translate(){},
  fillRect(){painted++},beginPath(){},moveTo(){},lineTo(){},
  closePath(){},arc(){},rect(){},stroke(){},fill(){painted++},
  clip(){clipped++},setLineDash(){},fillText(){},strokeText(){},
  drawImage(){drawn++},createPattern(){return "#aab5c3"},
  createRadialGradient(){gradients++;return{addColorStop(){}}}
 }
}
const canvas=()=>({width:0,height:0,getContext:context});
class ImageStub{
 constructor(){this.onload=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(uri){
  const dims=uri.includes("pilot_sprites")?[288,96]:
   uri.includes("bridge_stairs_lamp")?[216,72]:
   uri.includes("ground_painted")?[128,128]:
   uri.includes("neighborhood_r6")?[288,144]:null;
  assert.ok(dims,"unexpected art asset: "+uri);
  [this.naturalWidth,this.naturalHeight]=dims;this.onload?.()
 }
}
const vmEnv={console,Image:ImageStub};vmEnv.window=vmEnv;
for(const f of ["world_geometry.js","world_climate.js","world_footprint.js",
 "world_routes.js","world_setpieces.js","world_raster_pilot.js",
 "world_illustration.js","terrain_art.js","world_stream.js"]){
 vm.runInNewContext(read(f),vmEnv,{filename:f})
}
(async()=>{
 await vmEnv.VeilwardRasterPilot.load();
 const game=vmEnv.VeilwardWorldStream.create(blueprint,{
  geometry:geometryData,footprint:footprintData,canvasFactory:canvas
 });
 assert.equal(game.version,"1.3.20");
 assert.equal(game.geometry.stats().solids,39);
 assert.equal(game.routeArt.stats().roads,65);
 assert.equal(game.routeArt.stats().crossings,7);
 const rocks=names.map(name=>game.geometry.solids.find(s=>s.id===name));
 assert.ok(rocks.every(Boolean));
 const origin=blueprint.nodes.find(n=>n.id==="village").point.map(v=>v*60);
 for(const rock of rocks){
  const cx=rock.polygon.reduce((v,p)=>v+p[0],0)/rock.polygon.length;
  const cy=rock.polygon.reduce((v,p)=>v+p[1],0)/rock.polygon.length;
  assert.ok(game.blocked(cx,cy),"new source-backed terrace has real collision");
  assert.equal(game.raster.handlesWinterSolid(rock),true,
   "real collider is rendered through the authored winter raster, not invisible");
  const imagesBefore=drawn,clipBefore=clipped;
  assert.equal(game.raster.drawCliff(context(),rock),true,
   "physical escarpment can be painted by world-space source sprite composer");
  assert.ok(drawn>imagesBefore&&clipped>clipBefore);
 }
 for(const node of blueprint.nodes){
  const point=node.point.map(v=>v*60);
  assert.equal(game.blocked(...point),false,"all original route anchors stay open: "+node.id);
 }
 const house=game.setpieces.objects.filter(o=>o.kind==="snow_cottage"&&o.anchor==="village");
 assert.ok(house.length>0);
 const bounds=[origin[0]-1100,origin[1]-1100,origin[0]+1100,origin[1]+1100];
 const imagesBefore=drawn,clipsBefore=clipped,gradBefore=gradients;
 assert.equal(game.raster.drawVillageGround(context(),bounds,game.setpieces.objects),true);
 assert.ok(drawn>imagesBefore+70&&clipped>clipsBefore+70,
  "village irregular paving uses genuine painted stone raster masks");
 assert.ok(gradients>gradBefore,"snow-worn forecourt has a unified atmosphere");
 assert.equal(game.raster.stats().geometryChanged,false,
  "art renderer has no separate geometry mutations");
 assert.equal(game.raster.stats().creatorApproved,false,
  "passing tests never constitutes visual acceptance");
 const art=read("terrain_art.js"),routes=read("world_routes.js");
 assert.ok(art.includes("raster.drawVillageGround(ctx,bounds,setpieces?.objects||[])"));
 assert.ok(routes.includes("raster?.paintedRoad(ctx,e,bounds)"));
 const sw=read("sw.js"),html=read("index.html"),main=read("game.js");
 assert.ok(sw.includes("veilward-hollowreach-v1320-original-art-protected"));
 assert.ok(html.includes("world_raster_pilot.js?v=16"));
 assert.ok(main.includes('const SAVE="veilward-hollowreach-v01";'));
 assert.ok(main.includes('terrain_geometry.json?v=4'));
 console.log("R8 PASS: new source cliff colliders, illustrated snow caps, connected court, path integrity");
})().catch(e=>{console.error(e);process.exitCode=1});
