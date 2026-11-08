/* VEILWARD Phase 9 R18: each separately transferred original painted
 * Greenwood sprite must be bit-for-bit verified, physically rooted, and
 * leave world routes and the player's save untouched. Art NOT approved. */
"use strict";
const fs=require("node:fs"),crypto=require("node:crypto"),vm=require("node:vm"),
 assert=require("node:assert/strict");
const read=p=>fs.readFileSync(p,"utf8");
const assets=[
 ["oak","be158253086150c85f3d0f7cb89436a4525788aeb4d744cab90e6e2943d9f139"],
 ["pine","31b0970cccbe6ab9aab06e37d7605317dc827e6f5a9f691cb5188d1f38a75361"],
 ["ferns","b7d50f14163d0acd87c83b48c7accb420c5810b4559b00f6aac7d408e7957601"],
 ["rock","84c1408ab2dea22a08c67204376f56d82e7e30de9f8305636ed2eaa533098645"]
];
for(const [kind,sha] of assets){
 const b=fs.readFileSync("assets/greenwood_"+kind+"_r18.avif");
 assert.equal(b.toString("ascii",4,12),"ftypavif",kind+" is real AVIF");
 assert.equal(crypto.createHash("sha256").update(b).digest("hex"),sha,
  kind+" source artwork exact transferred bytes");
 assert.ok(b.length>2000&&b.length<7000,kind+" small iPhone-safe source");
}
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const terrain=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const footprint=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
let draws=[],leaves=0;
function ctx(){return {fillStyle:"",strokeStyle:"",lineWidth:1,globalAlpha:1,
 save(){},restore(){},translate(){},scale(){},beginPath(){},moveTo(){},lineTo(){},
 closePath(){},arc(){},rect(){},clip(){},setLineDash(){},fill(){},stroke(){},
 fillRect(){leaves++},clearRect(){},drawImage(...args){draws.push(args)},
 createPattern(){return"#678"},createRadialGradient(){return{addColorStop(){}}}
}}
function canvas(){return{width:0,height:0,getContext:ctx}}
class ImageStub{
 constructor(){this.onload=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(p){
  const size=p.includes("pilot_sprites")?[288,96]:
   p.includes("bridge_stairs_lamp")?[216,72]:
   p.includes("ground_painted")?[128,128]:
   p.includes("neighborhood_r6")?[288,144]:
   p.includes("environment_r15")?[576,144]:
   p.includes("greenwood_")?[128,128]:null;
  assert.ok(size,"Unexpected image: "+p);
  [this.naturalWidth,this.naturalHeight]=size;this.onload?.()
 }
}
const host={Image:ImageStub,document:{createElement:canvas},console};host.window=host;
for(const file of ["world_geometry.js","world_climate.js","world_footprint.js",
 "world_routes.js","world_setpieces.js","world_architecture_atlas.js",
 "world_raster_pilot.js","world_greenwood_art.js","world_illustration.js",
 "terrain_art.js","world_stream.js"])
 vm.runInNewContext(read(file),host,{filename:file});
(async()=>{
 await host.VeilwardRasterPilot.load();
 assert.equal(await host.VeilwardGreenwoodArt.loadPainted(),true);
 assert.equal(host.VeilwardGreenwoodArt.paintedReady,true);
 const source=host.VeilwardGreenwoodArt.paintedSource;
 assert.equal(source.width,512);
 assert.equal(source.height,128);
 const world=host.VeilwardWorldStream.create(model,{
  geometry:terrain,footprint,canvasFactory:canvas
 });
 assert.equal(world.version,"1.3.32");
 assert.equal(world.geometry.stats().solids,39);
 assert.equal(model.nodes.length,48);
 assert.equal(world.routeArt.stats().roads,65);
 assert.equal(world.routeArt.stats().crossings,7);
 const spr=host.VeilwardGreenwoodArt.create({footprint:world.footprint,
  geometry:world.geometry});
 assert.equal(spr.stats().paintedAssetReady,true);
 assert.equal(spr.stats().paintedAssetKinds,4);
 assert.equal(spr.stats().originalRootAnchors,true);
 draws=[];
 assert.equal(spr.stamp(ctx(),"oak",120,340,300,330,0),true);
 assert.equal(draws[draws.length-1][0].width,512,"Actual illustrated atlas sampled");
 assert.equal(draws[draws.length-1][3],128);
 for(const node of model.nodes){
  assert.equal(world.blocked(node.point[0]*60,node.point[1]*60),false,
   "original waypoint passable "+node.id);
 }
 const b=read("sw.js"),html=read("index.html");
 for(const [kind] of assets)assert.ok(b.includes("greenwood_"+kind+"_r18.avif?v=1"));
 assert.ok(html.includes("world_greenwood_art.js?v=10"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 assert.ok(b.includes("veilward-hollowreach-v1332-source-glade-habitat"));
 assert.equal(world.raster.stats().creatorApproved,false);
 console.log("R18 PASS: 4 bit-for-bit certified original painted Greenwood AVIF sources, 12 regions, 39 solids, 48 anchors, 65 routes, 7 crossings, save preserved; art NOT approved");
})().catch(e=>{console.error(e);process.exitCode=1});