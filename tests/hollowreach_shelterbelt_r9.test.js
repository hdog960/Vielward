/* VEILWARD Phase 9 R9 — source-backed west shelterbelt. Checks the actual
 * game collider + atlas renderer, not mock acceptance or a concept image. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const blueprint=JSON.parse(read("docs/overworld/world_blueprint.json"));
const source=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprint=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
const ids=["hollowreach_west_spruce_upper","hollowreach_west_spruce_gate",
 "hollowreach_west_spruce_court","hollowreach_west_spruce_lower"];
assert.equal(source.solids.length,39,"source now has four grounded winter trees");
assert.equal(source.solids.filter(s=>s.material==="cliff-face").length,7);
assert.equal(source.solids.filter(s=>ids.includes(s.id)).length,4);
let images=0,strokes=0,rects=0;
function context(){return{
 globalAlpha:1,fillStyle:"",strokeStyle:"",lineWidth:1,imageSmoothingEnabled:false,
 save(){},restore(){},translate(){},scale(){},setTransform(){},rect(){},
 beginPath(){},moveTo(){},lineTo(){},closePath(){},arc(){},clip(){},
 fill(){},stroke(){strokes++},fillRect(){rects++},drawImage(){images++},
 fillText(){},strokeText(){},setLineDash(){},
 createPattern(){return "#b9c9d8"},createRadialGradient(){return{addColorStop(){}}}
}}
const canvas=()=>({width:0,height:0,getContext:context});
class ImageStub{
 constructor(){this.onload=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(p){const d=p.includes("pilot_sprites")?[288,96]:
  p.includes("bridge_stairs_lamp")?[216,72]:p.includes("ground_painted")?
  [128,128]:p.includes("neighborhood_r6")?[288,144]:null;
  assert.ok(d,"only dedicated painter-owned atlases may enter the game");
  [this.naturalWidth,this.naturalHeight]=d;this.onload?.()
 }
}
const env={Image:ImageStub,console};env.window=env;
for(const p of ["world_geometry.js","world_climate.js","world_footprint.js",
 "world_routes.js","world_setpieces.js","world_raster_pilot.js",
 "world_illustration.js","terrain_art.js","world_stream.js"])
 vm.runInNewContext(read(p),env,{filename:p});
(async()=>{
 await env.VeilwardRasterPilot.load();
 const world=env.VeilwardWorldStream.create(blueprint,{
  geometry:source,footprint,canvasFactory:canvas
 });
 assert.equal(world.version,"1.3.27");
 assert.equal(world.geometry.stats().solids,39);
 assert.equal(blueprint.nodes.length,48);
 assert.equal(blueprint.edges.length,65);
 assert.equal(world.routeArt.stats().crossings,7);
 const roots=ids.map(id=>world.geometry.solids.find(s=>s.id===id));
 assert.ok(roots.every(Boolean));
 for(const root of roots){
  assert.equal(root.material,"pine-trunk");
  assert.ok(world.blocked(root.cx,root.cy),
   "illustrated tree occupies its honest physical boot collision "+root.id);
  assert.equal(world.raster.handlesWinterSolid(root),true);
  assert.equal(world.geometry.nearRoad(root.cx,root.cy,()=>true,root.radius+100),null,
   "source-defined shelterbelt must stay clear of the original road corridors");
 }
 for(const n of blueprint.nodes)
  assert.equal(world.blocked(n.point[0]*60,n.point[1]*60),false,
   "all 48 original travel waypoints remain reachable: "+n.id);
 for(const edge of world.geometry.roads)
  for(const [a,b,,len] of edge.parts)
   for(let k=0;k<=Math.max(1,Math.ceil(len/100));k++){
    const n=Math.max(1,Math.ceil(len/100));
    assert.equal(world.blocked(a[0]+(b[0]-a[0])*k/n,
     a[1]+(b[1]-a[1])*k/n),false,
     "all original 65 traveled road centerlines remain walkable: "+edge.id)
   }
 const village=blueprint.nodes.find(n=>n.id==="village");
 const x=village.point[0]*60,y=village.point[1]*60;
 const bounds=[x-1550,y-1550,x+1550,y+1550],ctx=context();
 const beforeImages=images;
 assert.equal(world.raster.drawShelterbeltGround(ctx,bounds),4,
  "all four grounded trees share a single painted snowbank/undergrowth pass");
 assert.ok(images>beforeImages,
  "existing authored shrub atlas decorates the true western forest verge");
 assert.ok(strokes>=4,"ground drift bands must visually connect forest roots");
 assert.equal(world.raster.drawVillageGround(ctx,bounds,world.setpieces.objects),true);
 const countBefore=images;
 for(const tree of roots)assert.equal(world.raster.drawStatic(ctx,tree),true);
 assert.ok(images>=countBefore+4,"all four solid trees have painted in-game canopies");
 const cottage=world.setpieces.objects.find(o=>
  o.anchor==="village"&&o.kind==="snow_cottage");
 assert.ok(cottage,"the approved village cottage has a physical footprint");
 const foregroundCtx=context(),beforeRoof=images;
 assert.equal(world.raster.drawArchitectureForeground(foregroundCtx,
  {x:cottage.x,y:cottage.y-130},[cottage]),1,
  "when the actor is BEHIND the cottage its real painted roof occludes it");
 assert.ok(images>beforeRoof,"architecture occlusion uses actual sprite art");
 assert.equal(world.raster.drawArchitectureForeground(foregroundCtx,
  {x:cottage.x,y:cottage.y+145},[cottage]),0,
  "when actor boots are in FRONT, roof must not hide them");
 assert.ok(read("terrain_art.js").includes("raster.drawArchitectureForeground(ctx,player"),
  "the production game calls physical architecture occlusion after actors");
 assert.equal(world.raster.stats().shelterbeltSourceTrees,4);
 assert.equal(world.raster.stats().creatorApproved,false);
 assert.equal(world.raster.stats().geometryChanged,false);
 const html=read("index.html"),worker=read("sw.js"),game=read("game.js");
 assert.ok(html.includes("world_raster_pilot.js?v=23"));
 assert.ok(worker.includes("veilward-hollowreach-v1327-feathered-woodland"));
 assert.ok(game.includes('terrain_geometry.json?v=4'));
 assert.ok(game.includes('const SAVE="veilward-hollowreach-v01";'));
 console.log("R9 PASS: four real grove colliders; one connected painterly belt; 65 roads, 48 anchors, seven crossings, saves intact");
})().catch(e=>{console.error(e);process.exitCode=1});
