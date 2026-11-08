/* R33b: source trees must be separate real-time sprites, never opaque floor. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const geo=JSON.parse(read("docs/overworld/terrain_geometry.json"));
const foot=JSON.parse(read("docs/overworld/outdoor_footprint.json"));
let draws=0;
function ctx(){return {globalAlpha:1,save(){},restore(){},translate(){},
 scale(){},rotate(){},drawImage(){draws++},beginPath(){},moveTo(){},
 lineTo(){},closePath(){},arc(){},rect(){},clip(){},fill(){},stroke(){},
 fillRect(){},clearRect(){},setLineDash(){},
 createRadialGradient(){return{addColorStop(){}}}}}
class Img{constructor(){this.onload=null;this.naturalWidth=128;this.naturalHeight=128}
 set src(p){this.onload?.()}}
const host={console,Image:Img,document:{createElement:()=>({
 width:0,height:0,getContext:()=>ctx()})}};host.window=host;
for(const path of ["world_geometry.js","world_climate.js","world_footprint.js",
 "world_routes.js","world_setpieces.js","world_greenwood_art.js",
 "world_illustration.js","world_stream.js"])
 vm.runInNewContext(read(path),host,{filename:path});
(async()=>{
 assert.equal(await host.VeilwardGreenwoodArt.loadPainted(),true);
 const geometry=host.VeilwardGeometry.create(model,geo);
 const climate=host.VeilwardClimate.create(model);
 const fp=host.VeilwardFootprint.create(model,geometry,foot,{climate});
 const artist=host.VeilwardIllustration.create(model,geometry,{footprint:fp,climate});
 const n=model.nodes.find(o=>o.id==="greenwood_hearth"),
  x=n.point[0]*60,y=n.point[1]*60;
 const source=fp.groves([x-1150,y-1000,x+1150,y+1050],560);
 const oak=source.find(o=>o.id==="hearth_root_20");
 assert.ok(oak&&oak.solid);
 const p={x:oak.x,y:oak.y-oak.radius*3.7};
 assert.equal(fp.blocked(p.x,p.y),false,"actor feet on real forest ground");
 const before=JSON.stringify([oak,model.edges.length,model.nodes.length]);
 const c=ctx();c.dynamicGreenwoodTrees=true;draws=0;
 const bounds=[x-1400,y-1400,x+1400,y+1400];
 artist.drawFeatures(c,bounds,false);
 const staticCount=draws;
 const back=artist.drawDynamicForest(c,bounds,p,"back");
 const backCount=draws-staticCount;
 const front=artist.drawDynamicForest(c,bounds,p,"front");
 const frontCount=draws-staticCount-backCount;
 assert.ok(back>0&&front>0&&backCount>0&&frontCount>0,
  "both genuine tree depths draw from world roots");
 assert.ok(artist.stats().greenwoodLiveSortedDepthR33b);
 assert.equal(JSON.stringify([oak,model.edges.length,model.nodes.length]),before);
 assert.equal(model.nodes.length,48);
 assert.equal(model.edges.length,65);
 assert.ok(read("world_stream.js").includes("ctx.dynamicGreenwoodTrees="));
 assert.ok(read("world_stream.js").includes('"front")'));
 assert.ok(read("world_stream.js").includes('"back")'));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 assert.ok(read("sw.js").includes("world_stream.js?v=32&rev=33b"));
 assert.ok(read("sw.js").includes("world_illustration.js?v=28&rev=33b"));
 assert.ok(read("scripts/visual_capture.mjs").includes(
  'capture(page,"GREENWOOD_R33B_LIVE_DEPTH")'));
 assert.equal(host.VeilwardGreenwoodArt.create({footprint:fp,geometry}).stats().creatorApproved,false);
 console.log("R33b PASS: real oak and pine sprites Y-sorted around grounded player;"+
  " forest not baked into opaque chunks; 48 nodes/65 roads/saves preserved");
})().catch(e=>{console.error(e);process.exitCode=1});
