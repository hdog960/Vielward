/* Phase 9 R30: canopy-like forest floor must derive only from physical
 * mature-tree sources, never create a fake sprite/trunk or block roads.
 * Painted quality still awaits user approval and physical iPhone QA. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=f=>fs.readFileSync(f,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const nodesBefore=JSON.stringify(model.nodes),edgesBefore=JSON.stringify(model.edges);
const host={window:null,console};host.window=host;
for(const path of ["world_geometry.js","world_climate.js","world_footprint.js","world_greenwood_art.js"])
 vm.runInNewContext(read(path),host,{filename:path});
const geo=host.VeilwardGeometry.create(model,JSON.parse(read("docs/overworld/terrain_geometry.json"))),
 climate=host.VeilwardClimate.create(model),
 footprint=host.VeilwardFootprint.create(model,geo,JSON.parse(read("docs/overworld/outdoor_footprint.json")),{climate}),
 art=host.VeilwardGreenwoodArt.create({model,geometry:geo,footprint});
const n=model.nodes.find(n=>n.id==="greenwood_hearth"),
 unit=model.worldDesign.worldUnitScale,x=n.point[0]*unit,y=n.point[1]*unit,
 box=[x-1100,y-800,x+1100,y+900];
let painted=0,gradientStops=0,ellipses=0,strokes=0,images=0;
function ctx(){
 return{save(){},restore(){},translate(){},scale(){},rotate(){},
 beginPath(){},moveTo(){},lineTo(){},quadraticCurveTo(){},
 arc(){ellipses++},fill(){painted++},stroke(){strokes++},
 drawImage(){images++},createRadialGradient(){return{
 addColorStop(){gradientStops++}}},
 fillRect(){},clearRect(){}}
}
assert.equal(art.stats().rootedOverstoryR30,true);
assert.equal(art.stats().nonBlockingCanopyProjection,true);
assert.equal(art.stats().physicsChanged,false);
assert.equal(art.stats().creatorApproved,false);
const first=art.paintRootedForestEdge(ctx(),box);
assert.ok(first>=3&&first<=90,"must paint only actual nearby mature trees");
assert.ok(painted>=first&&ellipses>=first&&gradientStops>=first*4,
 "rooted shadow pools must be curved, blended and layered—not blocky props");
assert.equal(images,0,"canopy shade never inserts an ungrounded image or trunk");
const p=painted,q=gradientStops;
assert.equal(art.paintRootedForestEdge(ctx(),box),first,
 "two chunk redraws must have deterministic source-derived shadow counts");
assert.equal(painted,p*2);
assert.equal(gradientStops,q*2);
assert.equal(art.paintRootedForestEdge(ctx(),[0,0,100,100]),0,
 "no shade beyond the original Greenwood anchor");
assert.equal(footprint.blocked(x,y,12),false,
 "original Hearth boots must remain on physical clear ground");
const src=read("world_greenwood_art.js");
assert.ok(src.indexOf("paintRootedForestEdge(ctx,bounds);")<
 src.indexOf("paintRoadVerges(ctx,bounds);"),
 "forest shade belongs below road surfaces, never on top");
assert.equal(JSON.stringify(model.nodes),nodesBefore);
assert.equal(JSON.stringify(model.edges),edgesBefore);
assert.equal(geo.roads.length,65);
assert.ok(read("index.html").includes("world_greenwood_art.js?v=10&rev=32"));
assert.ok(read("sw.js").includes("world_greenwood_art.js?v=10&rev=32"));
assert.ok(read("sw.js").includes("r28d-r29-r30"));
assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
console.log("R30 PASS: "+first+" original rooted forest crowns project natural overstory shade, "+strokes+" inter-root shading links, road and original save safe; art not yet approved");
