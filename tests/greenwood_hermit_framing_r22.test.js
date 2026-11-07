/* VEILWARD Phase 9 R22: tall hermit roof + Wanderer visible together on
 * iPhone landscape, source world / saves untouched. Not art approval. */
"use strict";
const assert=require("node:assert/strict"),vm=require("node:vm"),fs=require("node:fs");
const read=p=>fs.readFileSync(p,"utf8");
const blueprint=JSON.parse(read("docs/overworld/world_blueprint.json"));
function ctx(){return{save(){},restore(){},translate(){},scale(){},beginPath(){},
 moveTo(){},lineTo(){},closePath(){},fill(){},fillRect(){},drawImage(){},
 clearRect(){},arc(){},stroke(){},clip(){},setLineDash(){}}}
const host={console};host.window=host;
vm.runInNewContext(read("world_stream.js"),host,{filename:"world_stream.js"});
const World=host.VeilwardWorldStream;
const stream=World.create(blueprint,{canvasFactory:()=>({width:0,height:0,getContext:ctx})});
assert.equal(stream.version,"1.3.31");
const origin=stream.framing(720,405,.78);
assert.equal(origin.zoom,.78,"ordinary Hollowreach keeps original framing");
assert.equal(origin.anchorY,.52);
assert.equal(origin.focus,0);
const hermit=stream.jumpToNode("hermit");
assert.equal(hermit.node,"hermit");
assert.equal(stream.blocked(stream.player.x,stream.player.y),false);
const landscape=stream.framing(720,405,.78);
assert.ok(landscape.focus>.99,"full adapted camera near illustrated cottage");
assert.ok(landscape.zoom>.55&&landscape.zoom<.56);
assert.ok(Math.abs(landscape.anchorY-.77)<.00001);
const tile=stream.render(ctx(),720,405,landscape.zoom,.016);
const pixelY=(stream.player.y-tile.camera.y)*landscape.zoom;
const roofY=(stream.player.y-88-424-tile.camera.y)*landscape.zoom;
assert.ok(roofY>=14&&roofY<=44,"whole illustrated roof starts below top UI edge");
assert.ok(pixelY>300&&pixelY<345,"Wanderer is still on-screen and interactable");
assert.ok(tile.viewHeight>=720,"small landscape view can accommodate tall architecture");
const portrait=stream.framing(390,844,.78);
assert.equal(portrait.zoom,.78,"portrait device retains ordinary camera scale");
assert.equal(portrait.anchorY,.52);
const midway=stream.framing(850,390,.78);
assert.ok(midway.focus>.99&&midway.zoom>=.52&&midway.zoom<=.56);
const widescreen=stream.framing(1136,640,.78);
assert.ok(widescreen.focus>.99);
assert.equal(widescreen.zoom,.78,"desktop landscape retains sharp source pixel scale");
assert.equal(widescreen.anchorY,.77,"desktop camera also displays the complete roof");
stream.jumpToNode("greenwood_hearth");
const hearth=stream.framing(720,405,.78);
assert.equal(hearth.zoom,.78,
 "ordinary Greenwood crossroads stays at original camera scale");
const forestHouse=stream.setpieces?.objects.find(o=>
 o.anchor==="greenwood_hearth"&&o.kind==="forest_cottage");
if(forestHouse){
 stream.player.x=forestHouse.x+150;stream.player.y=forestHouse.y+100;
 const close=stream.framing(720,405,.78);
 assert.equal(close.landmark,"greenwood_hearth");
 assert.ok(close.zoom<.67&&close.zoom>.63&&close.focus>.99,
  "close to actual existing house: keep the blue roof and player in landscape");
 const target=stream.render(ctx(),720,405,close.zoom,.016);
 const roofTop=(forestHouse.y-340-target.camera.y)*close.zoom;
 assert.ok(roofTop>=0,"new painted cottage top stays visible in the actual camera");
}
const code=read("game.js"),html=read("index.html"),sw=read("sw.js");
assert.ok(code.includes("s.framing?.(vw,vh,WORLD_ZOOM).zoom||WORLD_ZOOM"));
assert.ok(code.includes("g.scale(adaptiveZoom,adaptiveZoom)"));
assert.ok(code.includes("s.renderDebug(g,vw,vh,adaptiveZoom)"));
assert.ok(html.includes("world_stream.js?v=31"));
assert.ok(sw.includes("veilward-hollowreach-v1331-second-forest-cottage"));
assert.ok(code.includes('const SAVE="veilward-hollowreach-v01";'));
assert.ok(read("world_greenwood_sanctuary.js").includes("greenwood_hermit_sanctuary_r21.webp"));
console.log("R22 PASS: entire 512px hermit roof and Wanderer in mobile landscape, ordinary/portrait camera unchanged, save/physics protected; creator approval 0%");
