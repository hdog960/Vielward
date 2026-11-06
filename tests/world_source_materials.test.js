/* R3 original-art source and fail-closed browser rendering smoke.
 * Uses a synchronous fake Image loader; verifies the actual web module rather
 * than lying that geometric primitive decorations are final pixel assets.
 */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const names=["world_source_materials.js","world_geometry.js","world_climate.js",
 "world_footprint.js","world_setpieces.js","world_routes.js",
 "world_illustration.js","terrain_art.js","world_stream.js","world_review.js",
 "game.js","index.html","sw.js","package.json"];
const S=Object.fromEntries(names.map(p=>[p,fs.readFileSync(p,"utf8")]));
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const g=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const f=JSON.parse(fs.readFileSync("docs/overworld/outdoor_footprint.json","utf8"));
const counts={images:0,strokes:0,patterns:0};
function c(){
 return{fillRect(){},drawImage(){counts.images++},createPattern(){counts.patterns++;return {originalArt:true}},
  beginPath(){},moveTo(){},lineTo(){},closePath(){},arc(){},fill(){},stroke(){counts.strokes++},
  save(){},restore(){},scale(){},translate(){},clip(){},setLineDash(){},fillText(){},strokeText(){}}
}
const canvas=()=>({width:0,height:0,getContext:c});
class RealPaintingMock{
 constructor(){this.naturalWidth=0;this.naturalHeight=0;this.onload=null}
 set src(value){
  if(!/assets\/(village_v06_clear\.jpg|wilds_clean\.jpg)\?world-art=1\.3\.7/.test(value))
   throw Error("Unapproved art source: "+value);
  this.naturalWidth=900;this.naturalHeight=584;
  this.onload?.()
 }
}
const host={Image:RealPaintingMock,console:{warn(){},error(){},log(){}}};host.window=host;
for(const p of names.filter(p=>p.startsWith("world_")||p==="terrain_art.js"))
 vm.runInNewContext(S[p],host,{filename:p});
(async()=>{
 const source=host.VeilwardSourceMaterials;
 assert.equal(source.version,"1.3.7");
 assert.equal(source.ready,false);
 await source.load();
 assert.equal(source.ready,true);
 const atlas=source.create(canvas);
 assert.equal(atlas.atlas.width,768);
 assert.equal(atlas.atlas.height,768);
 assert.equal(atlas.reusableMaterialTiles,64);
 assert.equal(atlas.backgroundScreenshotUsed,false);
 assert.equal(atlas.creatorApproved,false);
 assert.ok(counts.images>=256,"atlas sources actual original painted pixels");
 const stream=host.VeilwardWorldStream.create(model,{geometry:g,footprint:f,canvasFactory:canvas});
 assert.equal(stream.version,"1.3.7");
 assert.equal(stream.art.version,"1.3.7");
 assert.equal(stream.routeArt.version,"1.3.7");
 assert.equal(stream.art.diagnostics().sourceArtwork,true);
 assert.equal(stream.routeArt.stats().sourcePaint,true);
 assert.equal(stream.setpieces,null,
  "R2 blocky shape cottages are not drawn, nor secretly collidable, in original-art mode");
 assert.equal(stream.art.setpieces,null);
 assert.equal(stream.sourceMaterials.backgroundScreenshotUsed,false);
 assert.ok(stream.illustration,"older collision-bearing trees still render as temporary scenery");
 assert.equal(stream.routeArt.stats().roads,65);
 assert.equal(stream.routeArt.stats().crossings,7);
 for(const node of model.nodes){
  const x=node.point[0]*60,y=node.point[1]*60;
  assert.equal(stream.blocked(x,y),false,"unchanged playable anchor "+node.id)
 }
 let steps=0;
 for(const e of stream.geometry.roads)
  for(const [a,b,,len]of e.parts){
   const n=Math.max(1,Math.ceil(len/140));
   for(let i=0;i<=n;i++){
    assert.equal(stream.blocked(a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n),false,
     "original walking centerline preserved "+e.id);
    steps++
   }
  }
 assert.ok(steps>3000);
 const review=host.VeilwardReview.create(model,stream);
 for(const region of ["hollowreach","greenwood","coldpine"]){
  const cv=canvas();
  const info=review.paintRegion(cv,region,{pixels:160,span:1250});
  assert.ok(info.authentic&&cv.width===160,"world still drawn by real terrain compositor");
 }
 assert.ok(counts.patterns>0,"original-image texture patterns actually paint roads");
 const html=S["index.html"],sw=S["sw.js"],game=S["game.js"];
 for(const path of ["world_source_materials.js?v=1","world_stream.js?v=10",
   "world_routes.js?v=5","terrain_art.js?v=8","game.js?v=29",
   "manifest.webmanifest?v=137"])
  assert.ok(html.includes(path)&&sw.includes(path),"same asset loaded online/offline "+path);
 assert.ok(html.indexOf("world_source_materials.js?v=1")<
           html.indexOf("world_stream.js?v=10"));
 assert.ok(game.includes("await window.VeilwardSourceMaterials.load()"),
   "the browser must load original art before creating streamed world");
 assert.ok(game.includes("!stream.sourceMaterials"),
   "the live browser cannot silently fall back to primitive painting");
 assert.ok(game.includes('const SAVE="veilward-hollowreach-v01";'),
   "original adventure saves not reset");
 assert.ok(sw.includes("veilward-hollowreach-v137-source-material-reset"));
 for(const q of ["village_v06_clear.jpg?world-art=1.3.7","wilds_clean.jpg?world-art=1.3.7"])
  assert.ok(sw.includes(q),"iPhone offline original approved source available "+q);
 console.log("R3 SOURCE MATERIAL PASS",64,"original-image raster tile variants;",
  steps,"original road samples, 48 safe anchors and legacy shape objects disabled in real art mode;",
  "CREATOR ART ACCEPTANCE STILL 0%.");
})().catch(e=>{console.error(e);process.exit(1)});
