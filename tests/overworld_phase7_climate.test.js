/* Veilward Phase 7 — climate/biome transition regression.
 * Real world source and runtime Canvas simulation. Device visual approval is separate.
 */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const geometryData=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const footprintData=JSON.parse(fs.readFileSync("docs/overworld/outdoor_footprint.json","utf8"));
const sources=Object.fromEntries(["world_geometry.js","world_climate.js","world_footprint.js","terrain_art.js","world_stream.js","game.js","index.html","sw.js","visual.js","package.json"].map(p=>[p,fs.readFileSync(p,"utf8")]));
let checks=0;const ok=(v,msg)=>{assert.ok(v,msg);checks++},eq=(a,b,msg)=>{assert.equal(a,b,msg);checks++};
const drawn={fills:0,images:0,clips:0,strokes:0};
function context(){return{fillStyle:"",strokeStyle:"",globalAlpha:1,lineWidth:1,lineCap:"",lineJoin:"",imageSmoothingEnabled:true,
 fillRect(){drawn.fills++},drawImage(){drawn.images++},beginPath(){},moveTo(){},lineTo(){},closePath(){},arc(){},
 save(){},restore(){},translate(){},scale(){},clip(){drawn.clips++},fill(){drawn.fills++},stroke(){drawn.strokes++},fillText(){}}
}
const factory=()=>({width:0,height:0,getContext:()=>context()});
const host={console:{log(){},warn(){},error(){}}};host.window=host;
for(const mod of ["world_geometry.js","world_climate.js","world_footprint.js","terrain_art.js","world_stream.js"])
 vm.runInNewContext(sources[mod],host,{filename:mod});
const C=host.VeilwardClimate,G=host.VeilwardGeometry,F=host.VeilwardFootprint,A=host.VeilwardTerrainArt,W=host.VeilwardWorldStream;
eq(C.version,"1.3.6","continuous global climate module loaded");
eq(F.version,"1.3.6","scenery uses climate");
eq(A.version,"1.3.32","terrain artist uses climate");
eq(W.version,"1.3.32","stream creates climate");
const climate=C.create(model),geo=G.create(model,geometryData);
const land=F.create(model,geo,footprintData,{climate});
const art=A.create(model,geo,{climate,footprint:land,canvasFactory:factory});
eq(climate.stats().profiles,12,"twelve authored weather/ecology profiles");
ok(climate.stats().waterBankSegments>10,"source waterways contribute smooth shore moisture");
const unit=model.worldDesign.worldUnitScale,nodes=Object.fromEntries(model.nodes.map(n=>[n.id,n]));
function at(id){const p=nodes[id].point;return climate.sample(p[0]*unit,p[1]*unit)}
const village=at("village"),thaw=at("thaw_camp"),green=at("greenwood_hearth"),scar=at("worldscar_ring"),north=at("northwatch_plaza"),lake=at("island");
ok(village.snow>thaw.snow+.18,"Hollowreach retains snowy highland identity");
ok(thaw.snow>green.snow+.20,"Thawline visibly bridges winter and temperate forest");
ok(thaw.snow>.23&&thaw.snow<.77,"Thawline is truly mixed snow and plants");
ok(north.snow>lake.snow+.47,"alpine altitude remains distinct from Mossmere basin");
ok(scar.snow>green.snow+.31,"eastern Worldscar retains high-altitude frost rather than simply following east-west position");
ok(lake.wet>north.wet+.25,"Mossmere wetlands remain substantially wetter than upper stone");
for(const r of model.regions){
 const [px,py]=r.center;
 const c=climate.sample(px*unit,py*unit);
 for(const k of ["snow","wet","pine","forest","meadow","wetland","rock","arcane","canyon","road"])
  ok(Number.isFinite(c[k])&&c[k]>=0&&c[k]<=1,"bounded world climate "+r.id+"/"+k);
 ok(Number.isFinite(c.elevation)&&c.elevation>0&&c.elevation<7,"valid smooth elevation "+r.id);
}
for(const route of model.worldDesign.alternateSnowForestRoutes){
 let previous=null,samples=0;
 for(let j=0;j<route.length-1;j++){
  const start=nodes[route[j]],end=nodes[route[j+1]];
  for(let q=0;q<=32;q++){
   const t=q/32,x=(start.point[0]+(end.point[0]-start.point[0])*t)*unit,
    y=(start.point[1]+(end.point[1]-start.point[1])*t)*unit;
   const current=climate.sample(x,y);
   if(previous)ok(Math.abs(current.snow-previous.snow)<.14,"gradual climate change on road "+route[j]+"->"+route[j+1]);
   previous=current;samples++;
  }
 }
 ok(samples>=32,"each approved snow-to-forest road traverses climate cells");
}
for(const [id,position] of Object.entries(nodes)){
 const [x,y]=position.point.map(v=>v*unit);
 const c=climate.sample(x,y),near=climate.sample(x+1,y+1);
 ok(Math.abs(c.snow-near.snow)<.005,"no climate discontinuity near anchor "+id);
}
for(const x of [17000,18200,21000,28000,35000,43000]){
 for(let y of [9000,17000,25000,30000]){
  const c=climate.sample(x,y),d=climate.sample(x+1,y+1);
  ok(Math.abs(c.snow-d.snow)<.005&&Math.abs(c.wet-d.wet)<.005,"climate continuous across arbitrary chunk boundary");
  const m=climate.groundMaterial(x,y);
  ok(A.materials.includes(m),"world blends existing authored pixel material families");
 }
}
eq(art.materialAt(742*unit,649*unit),"lake","physical lake water material preserved");
eq(art.materialAt(418*unit,70*unit),"river","glacial headwaters remain painted as river");
eq(art.materialAt(1041*unit,569*unit),"cliff","deep chasm not changed to a green meadow");
ok(art.materialAt(758*unit,690*unit)!=="lake","Mossmere island retains real dry land");
const seamX=22500,seamY=17000;
eq(art.sameSourceCell(seamX+5,seamY+9).material,art.materialAt(seamX+5,seamY+9),"identical material sampling independent of streamed chunk");
const stream=W.create(model,{geometry:geometryData,footprint:footprintData,canvasFactory:factory});
ok(!!stream.climate&&!!stream.footprint&&!!stream.art,"real streamer has one shared outdoor climate sampler");
ok(stream.footprint.stats().climateEnabled&&stream.art.diagnostics().climateEnabled,"visual terrain and physical vegetation both use climate");
stream.warm(stream.player.x,stream.player.y,1500,900);
ok(stream.stats().cachedTiles>0&&stream.stats().cachedTiles<=18,"climate has not increased bounded iPhone tile cache");
ok(stream.stats().climate?.snow>.6,"outdoor climate telemetry uses real player coordinates");
for(const region of ["village","thaw_camp","greenwood_hearth","worldscar_ring"]){
 stream.jumpToNode(region);stream.render(context(),1024,600,.78,.016);
 ok(stream.stats().cachedTiles<=18,"climate artwork lazily streams at "+region);
}
ok(drawn.images>0&&drawn.fills>0&&drawn.clips>0,"climate textured terrain is painted, not conceptual-only");
const biomeStyles={};
for(const id of ["hollowreach","thawline","greenwood"]){
 const r=model.regions.find(r=>r.id===id),x=r.center[0]*unit,y=r.center[1]*unit;
 biomeStyles[id]=new Set(land.cells([x-1800,y-1800,x+1800,y+1800]).map(f=>f.kind));
}
ok(biomeStyles.hollowreach.size>1&&biomeStyles.greenwood.size>1,"ecological props in alpine and forest remain diverse");
for(const f of land.cells([33000,15000,37000,21000])){
 ok(f.id.startsWith("field_")&&typeof f.snow==="number"&&typeof f.moisture==="number","natural prop comes from global climate field");
 eq(land.featureAt(f.x,f.y)?.id,f.id,"natural solid identity stable across chunk boundaries");
}
for(const road of geo.roads){
 for(const [a,b,,length] of road.parts){
  const steps=Math.max(1,Math.ceil(length/160));
  for(let i=0;i<=steps;i++){
   const x=a[0]+(b[0]-a[0])*i/steps,y=a[1]+(b[1]-a[1])*i/steps;
   ok(!land.blocked(x,y,10),"climate foliage never blocks protected road "+road.id);
  }
 }
}
const html=sources["index.html"],sw=sources["sw.js"],game=sources["game.js"];
for(const path of ["world_review.js?v=4","world_routes.js?v=27","world_climate.js?v=4","world_footprint.js?v=5","terrain_art.js?v=32","world_stream.js?v=32","game.js?v=53","manifest.webmanifest?v=1332"]){
 ok(html.includes(path)&&sw.includes(path),"HTML and iPhone service worker cache share asset revision "+path)
}
ok(html.indexOf("world_geometry.js?v=1")<html.indexOf("world_climate.js?v=4")&&
   html.indexOf("world_climate.js?v=4")<html.indexOf("world_footprint.js?v=5")&&
   html.indexOf("world_footprint.js?v=5")<html.indexOf("terrain_art.js?v=32")&&
   html.indexOf("terrain_art.js?v=32")<html.indexOf("world_stream.js?v=32"),"browser climate module load order correct");
ok(game.includes('const APP_VERSION="1.3.32";')&&game.includes('const SAVE="veilward-hollowreach-v01";'),"player save preserved with correct new build version");
ok(sw.includes("veilward-hollowreach-v1332-source-glade-habitat"),"new Home Screen build cache rotated");
ok(sources["visual.js"].includes('load("hero","hero_approved_8way_v12.webp"'),"approved hero preserved");
ok(sources["visual.js"].includes('load("warden","warden_hal_v13.png"'),"approved Warden preserved");
console.log("Veilward Phase 7 PASS:",checks,"climate, foliage, atlas continuity, route geometry and PWA checks.");
