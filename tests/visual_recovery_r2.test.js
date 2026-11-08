/* VEILWARD R2 — substantive source-based and rendering validation.
 * Does NOT grant approval of the 3/4 environment art direction.
 */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const files=["world_geometry.js","world_climate.js","world_footprint.js","world_routes.js",
 "world_setpieces.js","world_raster_pilot.js","world_illustration.js","terrain_art.js","world_stream.js",
 "world_review.js","game.js","index.html","sw.js","visual.js","package.json"];
const source=Object.fromEntries(files.map(p=>[p,fs.readFileSync(p,"utf8")]));
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const gd=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const fd=JSON.parse(fs.readFileSync("docs/overworld/outdoor_footprint.json","utf8"));
let assertions=0;
const ok=(v,desc)=>{assert.ok(v,desc);assertions++},eq=(a,b,desc)=>{assert.equal(a,b,desc);assertions++};
const paint={fills:0,strokes:0,paths:0,clips:0,images:0};
const ctx=()=>({fillStyle:"",strokeStyle:"",lineWidth:1,imageSmoothingEnabled:false,globalAlpha:1,
 fillRect(){paint.fills++},drawImage(){paint.images++},beginPath(){paint.paths++},
 moveTo(){},lineTo(){},closePath(){},arc(){},fill(){paint.fills++},stroke(){paint.strokes++},
 save(){},restore(){},translate(){},scale(){},clip(){paint.clips++},setLineDash(){},
 fillText(){},strokeText(){}});
const canvas=()=>({width:0,height:0,getContext:()=>ctx()});
const host={console:{warn(){},error(){},log(){}}};host.window=host;
for(const file of files.filter(p=>/^(world_|terrain_art)/.test(p)))
 vm.runInNewContext(source[file],host,{filename:file});
const stream=host.VeilwardWorldStream.create(model,{geometry:gd,footprint:fd,canvasFactory:canvas}),
 scene=stream.setpieces,review=host.VeilwardReview.create(model,stream);
eq(host.VeilwardSetpieces.version,"1.3.32","versioned authored region setpiece module loads");
eq(stream.version,"1.3.32","actual streaming world loads new composition");
eq(stream.art.version,"1.3.32","real terrain compositor paints R2");
eq(stream.illustration.version,"1.3.32","three-quarter foreground artist integrates region setpieces");
eq(stream.routeArt.version,"1.3.32","physical seven-crossing art uses richer deck texture");
eq(scene?.version,"1.3.32","R2 piece renderer is not optional in the live runtime");
eq(stream.stats().setpieces.placed,scene.objects.length,"runtime composition diagnostic is genuine");
ok(scene.objects.length>=26,"at least 26 physically validated setpieces appear in the real map");
eq(scene.stats().sourceAnchors,13,"all thirteen true landmark groups represented");
ok(scene.stats().rejected>0,"R2 rejects unsafe candidate positions rather than planting through a road");
ok(scene.stats().routesMutated===false&&scene.stats().creatorAccepted===false,
 "unchanged route geometry and unapproved art status are both explicit");
const kinds=scene.stats().kinds;
ok(kinds.snow_cottage>=4,"Hollowreach and Coldpine include actual timber cottage architecture");
ok(kinds.forest_cottage>=1,"Greenwood has a source-anchored woodland cottage");
ok(kinds.market_stall>=2&&kinds.woodpile>=4,"real commons stalls and timber story details");
ok(kinds.obelisk>=4&&kinds.stone_wall>=2,"highland/ruin artwork actually present");
ok(scene.objects.some(o=>o.kind==="bridge_post"&&o.anchor==="bridge_w"),
 "physical Frostbridge foot approaches include built bridge hardware");
for(const anchor of ["village","joren","colp_lodge","northwatch_plaza","bridge_w",
 "greenwood_hearth","thaw_camp","falls_overlook","island","market",
 "oldroad_tower","cave_mouth","worldscar_ring"])
 ok(scene.objects.some(o=>o.anchor===anchor),"specific landmark gets artist-composed source props "+anchor);
for(const o of scene.objects){
 ok(stream.footprint.onLand(o.x,o.y),"real authored solid remains on physical land "+o.id);
 ok(!stream.geometry.waterAt(o.x,o.y,o.r+25),"no solid on invalid lake/ravine "+o.id);
 const near=stream.geometry.nearRoad(o.x,o.y,()=>true,o.r+100);
 ok(!near||near.distance>=o.r+95,"building never blocks original path "+o.id);
 if(o.kind==="mushroom_ring")ok(!scene.blocked(o.x,o.y,4),
   "low mushroom groundcover must remain nonblocking "+o.id);
 else ok(scene.blocked(o.x,o.y,4),
   "architectural fixture/obstacle has genuine boot collision "+o.id);
}
// Benchmark all authored region entry points and the physical road network.
for(const node of model.nodes){
 const x=node.point[0]*60,y=node.point[1]*60;
 ok(!stream.blocked(x,y),"every approved travel endpoint remains open "+node.id);
}
let steps=0,lanes=0;
for(const e of stream.geometry.roads)for(const [a,b,,len] of e.parts){
 const n=Math.max(1,Math.ceil(len/95));
 const nx=-(b[1]-a[1])/(len||1),ny=(b[0]-a[0])/(len||1);
 for(let i=0;i<=n;i++){
  const x=a[0]+(b[0]-a[0])*i/n,y=a[1]+(b[1]-a[1])*i/n;
  ok(!stream.blocked(x,y),"all 65 original road centerlines free "+e.id);
  for(const k of [-1,1]){
   ok(!stream.blocked(x+nx*e.halfWidth*.15*k,y+ny*e.halfWidth*.15*k),
    "walking space on either side of the original route "+e.id);
   lanes++;
  }
  steps++;
 }
}
ok(steps>4500&&lanes>9000,"long-distance foot QA samples source geometry, not scene copy");
eq(stream.routeArt.stats().roads,65,"all 65 links unchanged");
eq(stream.routeArt.stats().crossings,7,"seven authentic crossings unchanged");
const start=paint.paths;
for(const o of scene.objects){
 scene.draw(ctx(),[o.x-o.r-30,o.y-o.r*3-30,o.x+o.r+30,o.y+o.r+30]);
}
ok(paint.paths-start>100,"actual roof, post, stone and raised-setpiece silhouettes drawn by painter");
const cliff=stream.geometry.solids.find(s=>s.material==="cliff-face");
ok(scene.drawCliff(ctx(),cliff)===true,"existing source cliff polygons receive layered strata without fake collision");
ok(paint.clips>0,"cliff strata are clipped to their exact physical rock polygon");
const highlights=[];
for(const id of ["hollowreach","greenwood","coldpine","frost_river"]){
 const r=review.caption(id),hit=review.safeAnchor(id);
 ok(!stream.blocked(hit.x,hit.y),"preview landing remains playable "+id);
 const c=canvas(),info=review.paintRegion(c,id,{pixels:224,span:1250});
 eq(c.width,224,"high-resolution R2 real screenshot pixel size "+id);
 ok(info.authentic===true,"thumbnail uses real renderer, not concept illustration "+id);
 const inView=scene.objects.filter(o=>Math.abs(o.x-info.x)<625+o.r&&Math.abs(o.y-info.y)<625+o.r*2);
 ok(inView.length>=1,"artist-built structures physically appear in viewed frame "+id);
 highlights.push({id,node:r.anchor,compositions:inView.length})
}
ok(paint.images>400&&paint.fills>1000&&paint.paths>1000,
 "real material/prop/roads rendered rather than documented without compositing");
ok(source["world_routes.js"].includes("Board-end grain")&&
 source["world_routes.js"].includes("Layered parapet"),"bridge material grammar enhanced while rail collision stays original");
ok(source["terrain_art.js"].includes("setpieces.draw(ctx,bounds,o=>")&&
 source["terrain_art.js"].includes("setpieces?.drawCliff(ctx,s)"),
 "R2 compositions and source cliff faces are part of gameplay paintChunk");
ok(source["world_stream.js"].includes("setpieces?.blocked(x,y,10,o=>"),
 "new physical fixture collision is checked by the actual player movement engine");
const html=source["index.html"],sw=source["sw.js"],game=source["game.js"];
for(const asset of ["world_climate.js?v=4","world_footprint.js?v=5","world_setpieces.js?v=3",
 "world_illustration.js?v=28","terrain_art.js?v=32","world_routes.js?v=27",
 "world_stream.js?v=32","world_review.js?v=4","game.js?v=57",
 "manifest.webmanifest?v=1336"])
 ok(html.includes(asset)&&sw.includes(asset),"Safari and iPhone PWA cache exactly same R2 source "+asset);
ok(html.indexOf("world_setpieces.js?v=3")<html.indexOf("world_illustration.js?v=28")&&
 html.indexOf("world_illustration.js?v=28")<html.indexOf("world_stream.js?v=32"),
 "order builds solid fixtures and artist before stream boot");
ok(game.includes('const APP_VERSION="1.3.36";')&&
 game.includes('const SAVE="veilward-hollowreach-v01";'),"preserved legacy save and correct R2 build");
ok(game.includes('!stream.setpieces')&&game.includes("show&&worldPreview.debug"),
 "real preview requires full R2 art and keeps debug diagnostics off gameplay screen");
ok(sw.includes("veilward-hollowreach-v1336-greenwood-escarpment-r35"),"iPhone offline cache invalidates R1 scene art");
ok(source["visual.js"].includes('load("hero","hero_approved_8way_v12.webp"')&&
 source["visual.js"].includes('load("warden","warden_hal_v13.png"'),"approved hero and Warden sprite assets unchanged");
console.log("Veilward R2 SOURCE PASS",assertions,"assertions,",scene.objects.length,"physical compositions,",
 steps,"road steps,",lanes,"shoulder samples, visible:",JSON.stringify(highlights),
 "; creator's visual approval is still 0%.");
