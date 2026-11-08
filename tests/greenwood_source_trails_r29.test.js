/* R29: softly painted native Greenwood trail shapes along the exact
 * original 65 physical roads. This audit cannot grant aesthetic approval. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const terrain=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const beforeEdges=JSON.stringify(model.edges);
const host={console,Math};host.window=host;
for(const f of ["world_geometry.js","world_climate.js","world_routes.js"])
 vm.runInNewContext(read(f),host,{filename:f});
const geo=host.VeilwardGeometry.create(model,terrain);
const climate=host.VeilwardClimate.create(model);
const art=host.VeilwardRoutes.create(model,geo,{climate});
assert.equal(geo.roads.length,65);
assert.equal(art.stats().crossings,7);
assert.equal(art.stats().greenwoodTrailR29,true);
assert.ok(art.stats().sourceWoodlandTrails>=4);
const node=model.nodes.find(n=>n.id==="greenwood_hearth"),unit=60,
 x=node.point[0]*unit,y=node.point[1]*unit;
const ink={strokes:[],marks:0,arcs:0};
function ctx(){
 return{lineCap:"",lineJoin:"",globalAlpha:1,strokeStyle:"",lineWidth:1,
 fillStyle:"",save(){},restore(){},beginPath(){},moveTo(){},lineTo(){},
 closePath(){},translate(){},rotate(){},scale(){},arc(){ink.arcs++},
 fillRect(){},fill(){ink.marks++},
 stroke(){ink.strokes.push({color:this.strokeStyle,width:this.lineWidth,
  alpha:this.globalAlpha})},createLinearGradient(){return{addColorStop(){}}}}
}
const all=geo.roads.filter(e=>e.from==="greenwood_hearth"||
 e.to==="greenwood_hearth");
assert.equal(all.length,4,"four original roads must still join the Hearth");
const original=JSON.stringify(geo.roads.map(e=>({
 id:e.id,path:e.path,halfWidth:e.halfWidth})));
art.draw(ctx(),[x-1000,y-1000,x+1000,y+1000]);
const colors=new Set(ink.strokes.map(s=>s.color));
for(const c of ["#5d6a52","#73674f","#928165"])
 assert.ok(colors.has(c),"woodland track uses muted layered native earth "+c);
assert.ok(ink.arcs>=1,"earth worn in elongated, soft organic strokes");
assert.ok(ink.marks>=1,"forest road is more than blank tinted floor");
const left=ink.strokes.filter(s=>s.color==="#73674f");
assert.ok(left.length>=4,"all four Hearth approaches get organic worn treads");
assert.ok(left.every(p=>p.width<90&&p.width>35),
 "woodland road width stays modest and continuous for a real hero");
assert.equal(JSON.stringify(geo.roads.map(e=>({
 id:e.id,path:e.path,halfWidth:e.halfWidth}))),original,
 "rendering does not change route geometry, widths or world nodes");
const other=geo.roads.find(e=>e.crossing);
ink.strokes.length=0;art.draw(ctx(),[
 other.path[0][0]-300,other.path[0][1]-300,
 other.path[0][0]+300,other.path[0][1]+300]);
assert.ok(ink.strokes.length>2,"crossing receives its original painted deck");
assert.equal(JSON.stringify(model.edges),beforeEdges);
assert.ok(read("index.html").includes("world_routes.js?v=27&rev=29"));
assert.ok(read("sw.js").includes("world_routes.js?v=27&rev=29"));
assert.ok(read("sw.js").includes("greenwood-escarpment-r35"));
assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
console.log("R29 PASS: "+art.stats().sourceWoodlandTrails+
 " muted painted Greenwood source trails; 65 physical routes, seven crossings, original saves protected; user art approval 0%");
