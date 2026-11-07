/* VEILWARD Phase 9 R17 — exact existing Greenwood root-backed vegetation.
 * Visual acceptance stays 0%; tests functional integrity, not beauty. */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const geometry=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprint=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
let leaves=0,stampCalls=[],gradients=0,patterns=0;
function ctx(){return{
 fillStyle:"",strokeStyle:"",lineWidth:1,globalAlpha:1,
 save(){},restore(){},translate(){},scale(){},
 beginPath(){},moveTo(){},lineTo(){},closePath(){},arc(){},
 fill(){},stroke(){},clip(){},setLineDash(){},
 fillRect(){leaves++},clearRect(){},
 drawImage(...a){stampCalls.push(a)},
 createPattern(){patterns++;return "#879d74"},
 createRadialGradient(){gradients++;return{addColorStop(){}}}
}}
const canvas=()=>({width:0,height:0,getContext:ctx});
class ImageStub{
 constructor(){this.onload=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(p){
  const d=p.includes("pilot_sprites")?[288,96]:
   p.includes("bridge_stairs_lamp")?[216,72]:
   p.includes("ground_painted")?[128,128]:
   p.includes("neighborhood_r6")?[288,144]:
   p.includes("environment_r15")?[576,144]:null;
  assert.ok(d,"unexpected extra sprite asset");
  [this.naturalWidth,this.naturalHeight]=d;this.onload?.()
 }
}
const host={Image:ImageStub,document:{createElement:canvas},console};host.window=host;
for(const name of ["world_geometry.js","world_climate.js","world_footprint.js",
 "world_routes.js","world_setpieces.js","world_architecture_atlas.js",
 "world_raster_pilot.js","world_greenwood_art.js","world_illustration.js",
 "terrain_art.js","world_stream.js"])
 vm.runInNewContext(read(name),host,{filename:name});
(async()=>{
 await host.VeilwardRasterPilot.load();
 const grove=host.VeilwardGreenwoodArt;
 assert.equal(grove.version,"1.3.25");
 const atlas=grove.load();
 assert.ok(atlas&&atlas.width===192*15&&atlas.height===240,
  "Fifteen cached original native-pixel source sprites");
 assert.ok(leaves>6000,"authored clustered leaf pixels, not four basic polygons");
 const world=host.VeilwardWorldStream.create(model,{geometry,footprint,
  canvasFactory:canvas});
 assert.equal(world.version,"1.3.25");
 assert.equal(world.illustration.stats().greenwoodAtlasSprites,15);
 assert.equal(world.illustration.stats().greenwoodOriginalAnchors,true);
 assert.equal(world.geometry.stats().solids,39);
 assert.equal(world.routeArt.stats().roads,65);
 assert.equal(world.routeArt.stats().crossings,7);
 assert.equal(model.nodes.length,48);
 const r=world.footprint,point=model.nodes.find(n=>n.id==="greenwood_hearth");
 assert.ok(point);
 const x=point.point[0]*60,y=point.point[1]*60;
 const bounds=[x-2900,y-2900,x+2900,y+2900];
 const roots=[...r.cells(bounds,350),...r.groves(bounds,350)].filter(o=>
  ["oak","pine","scrub","flowerbed"].includes(o.kind)&&
  r.regionAt(o.x,o.y)?.id==="greenwood");
 assert.ok(roots.length>=3,"Greenwood's actual pre-existing rooted plants");
 const spr=grove.create({geometry:world.geometry,footprint:r});
 assert.equal(spr.stats().totalSprites,15);
 stampCalls.length=0;
 let rendered=0;
 for(const item of roots.slice(0,12))if(spr.paintFeature(ctx(),item))rendered++;
 assert.ok(rendered>=3&&stampCalls.length>=3,
  "new art painted at physical Greenwood features");
 assert.equal(spr.paintFeature(ctx(),{...roots[0],x:point.point[0]*60,y:point.point[1]*60}),true);
 assert.equal(spr.paintFeature(ctx(),{...roots[0],x:model.nodes.find(n=>n.id==="village").point[0]*60,
  y:model.nodes.find(n=>n.id==="village").point[1]*60}),false,
  "forest art cannot contaminate Hollowreach");
 const shadeBefore=gradients;
 assert.ok(spr.paintForestFloor(ctx(),bounds)>=3);
 assert.ok(gradients>shadeBefore,"source tree-root canopy shadow integration");
 for(const anchor of model.nodes)
  assert.equal(world.blocked(anchor.point[0]*60,anchor.point[1]*60),false,
   "original waypoint remains reachable");
 assert.ok(read("index.html").includes("world_greenwood_art.js?v=2"));
 assert.ok(read("sw.js").includes("world_greenwood_art.js?v=2"));
 assert.ok(read("sw.js").includes("veilward-hollowreach-v1325-painted-greenwood"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 assert.equal(world.raster.stats().creatorApproved,false);
 console.log("R17 PASS: 15 cached native-pixel Greenwood tree/shrub variants, original physical roots, zero world physics edits, 12 regions, 39 solids, 48 safe nodes, 65 roads, 7 crossings, original save; art unapproved");
})().catch(e=>{console.error(e);process.exitCode=1});
