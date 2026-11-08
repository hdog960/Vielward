/* R31: authentic physical forest camera framing without world changes. */
"use strict";
const assert=require("node:assert/strict"),vm=require("node:vm"),fs=require("node:fs");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const origNodes=JSON.stringify(model.nodes),origEdges=JSON.stringify(model.edges);
const host={console};host.window=host;
vm.runInNewContext(read("world_stream.js"),host,{filename:"world_stream.js"});
function ctx(){return{save(){},restore(){},translate(){},scale(){},
 beginPath(){},moveTo(){},lineTo(){},drawImage(){},fillRect(){},
 stroke(){},fill(){},clearRect(){},arc(){}}}
const s=host.VeilwardWorldStream.create(model,{canvasFactory:()=>({
 width:0,height:0,getContext:ctx})});
let f=s.framing(720,405,.78);
assert.equal(f.zoom,.78);assert.equal(f.anchorY,.52);
s.jumpToNode("greenwood_hearth");f=s.framing(720,405,.78);
assert.equal(f.landmark,"greenwood_forest_edge");
assert.equal(f.forestFraming,true);
assert.ok(f.zoom>=.69&&f.zoom<=.71);
assert.ok(Math.abs(f.anchorY-.42)<.001);
assert.ok((405/f.zoom)*(1-f.anchorY)>330,
 "source south-forest canopy should enter landscape view");
assert.ok(405*f.anchorY>155&&405*f.anchorY<180);
assert.equal(s.blocked(s.player.x,s.player.y),false);
const portrait=s.framing(390,844,.78);
assert.equal(portrait.zoom,.78);
assert.equal(portrait.anchorY,.52);
assert.equal(s.framing(1136,640,.78).zoom,.78);
s.jumpToNode("hermit");
const hermit=s.framing(720,405,.78);
assert.ok(hermit.zoom>.55&&hermit.zoom<.56);
assert.equal(hermit.anchorY,.77);
// The dedicated R22 real-geometry test checks the actual painted house.
 // This minimal-stream fixture has no setpieces by design, so verify the
 // unchanged priority branch rather than pretending a cottage exists here.
const streamSource=read("world_stream.js");
assert.ok(streamSource.includes('o.anchor==="greenwood_hearth"&&o.kind==="forest_cottage"'));
assert.ok(streamSource.indexOf('o.anchor==="greenwood_hearth"&&o.kind==="forest_cottage"')<
 streamSource.indexOf("const glade=points.greenwood_hearth"),
 "cottage-specific camera priority must remain ahead of the forest view");
assert.equal(JSON.stringify(model.nodes),origNodes);
assert.equal(JSON.stringify(model.edges),origEdges);
assert.ok(read("index.html").includes("world_stream.js?v=32&rev=33b"));
assert.ok(read("sw.js").includes("world_stream.js?v=32&rev=33b"));
assert.ok(read("sw.js").includes("greenwood-falls-r34"));
assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
console.log("R31 PASS: original Greenwood woodland framed in mobile landscape; Hermit and cottage preserved, world/save unaffected; creator art approval 0%");
