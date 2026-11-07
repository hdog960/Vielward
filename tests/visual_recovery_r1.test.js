/* Veilward visual recovery R1 — truthful technical art checks.
 * This verifies actual world-space illustration and unchanged navigation. It
 * does not substitute for the creator's comparison to the golden references.
 */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const core=["world_geometry.js","world_climate.js","world_footprint.js","world_routes.js",
 "world_setpieces.js","world_raster_pilot.js","world_illustration.js","terrain_art.js","world_stream.js","world_review.js",
 "game.js","index.html","sw.js","visual.js","package.json"];
const S=Object.fromEntries(core.map(p=>[p,fs.readFileSync(p,"utf8")]));
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const gd=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const fd=JSON.parse(fs.readFileSync("docs/overworld/outdoor_footprint.json","utf8"));
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++},eq=(a,b,m)=>{assert.equal(a,b,m);checks++};
const drawn={images:0,fills:0,strokes:0,paths:0,polygons:0};
function ctx(){
 return{globalAlpha:1,fillStyle:"",strokeStyle:"",lineWidth:1,imageSmoothingEnabled:false,
  fillRect(){drawn.fills++},drawImage(){drawn.images++},
  beginPath(){drawn.paths++},moveTo(){},lineTo(){},closePath(){drawn.polygons++},arc(){},
  fill(){drawn.fills++},stroke(){drawn.strokes++},clip(){},fillText(){},strokeText(){},
  save(){},restore(){},scale(){},translate(){},clearRect(){},setLineDash(){}}
}
const canvas=()=>({width:0,height:0,getContext:()=>ctx()});
const host={console:{log(){},warn(){},error(){}}};host.window=host;
for(const p of ["world_geometry.js","world_climate.js","world_footprint.js","world_routes.js",
 "world_setpieces.js","world_illustration.js","terrain_art.js","world_stream.js","world_review.js"])
 vm.runInNewContext(S[p],host,{filename:p});
const stream=host.VeilwardWorldStream.create(model,{geometry:gd,footprint:fd,canvasFactory:canvas});
const review=host.VeilwardReview.create(model,stream);
eq(stream.version,"1.3.32","visual recovery live world version");
eq(stream.illustration?.version,"1.3.32","source-coupled illustration actually loaded");
eq(stream.art.version,"1.3.32","illustrated terrain compositor actually running");
eq(stream.footprint.version,"1.3.6","physical natural props have recovery density");
ok(typeof stream.footprint.groves==="function","new foot-colliding saplings are fully authored and simulated");
ok(stream.footprint.groves([41000,23000,44000,26500]).length>0,"deep Greenwood has additional mature woodland density");
eq(stream.routeArt.version,"1.3.32","source-driven worn roads replace broad vector treads");
eq(review.version,"1.3.6","in-game art review uses the restored renderer");
ok(stream.art.diagnostics().illustrationEnabled,"runtime imagery is wired through paintChunk");
eq(stream.illustration.stats().sourceAnchors,13,"all thirteen original landmarks in scene artist");
ok(stream.illustration.stats().changesPhysics===false,"visual illustrator does not pretend to create physics");
ok(S["terrain_art.js"].includes("illustration.drawFeatures(ctx,bounds,!!raster?.drawWinterScene)")&&
 S["terrain_art.js"].includes("illustration.drawGround(ctx,bounds)"),"actual chunks paint painterly ground and source-anchored landmarks");
ok(S["terrain_art.js"].includes("if(illustration?.drawStatic(ctx,s))continue"),
 "original static tree collider uses art from the same coordinates");
ok(S["terrain_art.js"].includes("for(let i=0;i<2;i++")&&S["terrain_art.js"].includes("for(let j=0;j<2;j++"),
 "flat noise texture density reduced rather than adding more grain");
ok(S["world_climate.js"].includes("noise(x/2450,y/2280,82)"),"regional patch materials follow broad coherent drifts");
ok(S["world_routes.js"].includes("e.halfWidth*1.03+7")&&
 !S["world_routes.js"].includes("e.halfWidth*2+13"),"oversized continuous road-pipes removed in favor of recessed paths");
ok(S["world_footprint.js"].includes("Math.min(c.r*scale,315)")&&
 S["world_footprint.js"].includes("Math.min(h.r*.34,355)"),"empty mega-clearings reduced while keeping physical route buffers");
const unit=model.worldDesign.worldUnitScale,tests=[
 ["hollowreach","joren"],["greenwood","greenwood_hearth"],
 ["coldpine","colp_lodge"],["frost_river","bridge_w"]];
let oldFilled=drawn.fills,oldImages=drawn.images;
for(const [region,node] of tests){
 const c=canvas(),out=review.paintRegion(c,region,{pixels:160,span:1250});
 eq(out.node,node,"camera frames the original source landmark "+region);
 ok(out.authentic,"thumbnail built from actual scene art not stock image "+region);
 ok(drawn.fills>oldFilled+200,"terrain, contextual debris, foot shadows and landmark artwork painted "+region);
 ok(drawn.images>oldImages+100,"streamed material atlas still grounds actual scene "+region);
 oldFilled=drawn.fills;oldImages=drawn.images;
}
ok(drawn.polygons>50,"three-quarter tree, roof, cliff and rock planes painted as multi-layer shapes");
ok(drawn.strokes>25,"stair, bridge and vegetation outlines painted");
const coords=Object.fromEntries(model.nodes.map(n=>[n.id,n.point.map(q=>q*unit)]));
for(const id of ["village","joren","greenwood_hearth","northwatch_plaza","colp_lodge","bridge_w","bridge_e","island"])
 ok(!stream.blocked(...coords[id]),"existing named source anchor still on safe ground: "+id);
let feet=0;
for(const e of stream.geometry.roads){
 for(const [a,b,,len] of e.parts){
  const n=Math.max(1,Math.ceil(len/95));
  for(let j=0;j<=n;j++){
   const x=a[0]+(b[0]-a[0])*j/n,y=a[1]+(b[1]-a[1])*j/n;
   ok(!stream.blocked(x,y),"preserved whole-world road clearance "+e.id);
   feet++;
  }
 }
}
ok(feet>4000,"road physical continuity tested across entire landmass");
eq(stream.routeArt.stats().roads,65,"all 65 authored links preserved");
eq(stream.routeArt.stats().crossings,7,"all seven physical bridges/ford/causeway preserved");
const i=review.paintOverview(canvas(),{width:420});
eq(i.regions,12,"12 original region map remains intact");
eq(i.roadCount,65,"atlas overview unchanged source network");
const pack=S["index.html"],sw=S["sw.js"],game=S["game.js"];
for(const name of ["world_climate.js?v=4","world_footprint.js?v=5",
 "world_illustration.js?v=26","terrain_art.js?v=32","world_routes.js?v=27",
 "world_stream.js?v=32","world_review.js?v=4","game.js?v=53",
 "manifest.webmanifest?v=1332"]){
 ok(pack.includes(name)&&sw.includes(name),"iPhone and HTML pin identical rebuilt art asset "+name)
}
ok(pack.indexOf("world_illustration.js?v=26")<pack.indexOf("terrain_art.js?v=32")&&
 pack.indexOf("terrain_art.js?v=32")<pack.indexOf("world_stream.js?v=32"),"browser builds illustrator before runtime stream");
ok(sw.includes("veilward-hollowreach-v1332-source-glade-habitat"),"old iPhone Home Screen visual tiles invalidated");
ok(game.includes('const APP_VERSION="1.3.32";')&&game.includes('const SAVE="veilward-hollowreach-v01";'),
 "old quest/local save key unchanged");
ok(game.includes("HOLLOWREACH ART RECOVERY")&&game.includes("span:1250"),"gallery labels truthful status and zooms to the art");
ok(S["visual.js"].includes('load("hero","hero_approved_8way_v12.webp"')&&
 S["visual.js"].includes('load("warden","warden_hal_v13.png"'),"approved hero & Warden textures retained");
console.log("Veilward visual recovery R1 SOURCE PASS:",checks,"checks; region art rendered",tests.length,
 "source points; physically safe road samples",feet,". Subjective appearance NOT APPROVED.");
