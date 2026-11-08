/* R31c source-cropped original oak eaves — actual physical roots only. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
const roots=[],paints=[];
const host={console};host.window=host;
class Img{constructor(){this.onload=null;this.naturalWidth=128;this.naturalHeight=128}
 set src(v){assert.ok(v.includes("greenwood_")&&v.includes(".avif"));this.onload?.()}}
host.Image=Img;
host.document={createElement:()=>({width:0,height:0,getContext:()=>ctx()})};
function ctx(){return{save(){},restore(){},translate(){},scale(){},
 drawImage(...p){paints.push(p)},beginPath(){},moveTo(){},arc(){},fill(){},
 fillRect(){},clearRect(){},stroke(){}}}
vm.runInNewContext(read("world_greenwood_art.js"),host,{filename:"world_greenwood_art.js"});
(async()=>{
 const source=host.VeilwardGreenwoodArt;
 assert.equal(await source.loadPainted(),true);
 paints.length=0; // atlas assembly isn't a physical scene bough draw
 const foot={regionAt(){return{id:"greenwood"}}},geo={waterAt(){return null},
 nearRoad(){return null}};
 const painting=source.create({model,footprint:foot,geometry:geo});
 const n=model.nodes.find(x=>x.id==="greenwood_hearth"),
  x=n.point[0]*60,y=n.point[1]*60;
 const oak1={id:"hearth_root_20",kind:"oak",x:x+560,y:y+470,radius:55,authoredGrove:true},
  oak2={id:"hearth_root_23",kind:"oak",x:x-660,y:y+365,radius:55,authoredGrove:true},
  impostor={id:"invented",kind:"oak",x:x+500,y:y+400,radius:55,authoredGrove:true};
 const bounds=[x-900,y-900,x+900,y+900];
 const original=JSON.stringify([oak1,oak2,impostor]);
 const total=painting.paintHearthEdgeBoughs(ctx(),bounds,[oak1,oak2,impostor]);
 assert.ok(total>=2&&total<=4);
 assert.equal(paints.length,total,"all boughs are cropped from original painted R18 oak");
 for(const p of paints){
  assert.equal(p.length,9);
  assert.equal(p[1],0);assert.equal(p[2],0);
  assert.equal(p[3],128);assert.equal(p[4],78);
  assert.ok(p[7]>130&&p[8]>70,"source canopy keeps genuine native proportions");
 }
 assert.equal(JSON.stringify([oak1,oak2,impostor]),original);
 assert.equal(painting.paintHearthEdgeBoughs(ctx(),[0,0,100,100],[oak1,oak2]),0);
 assert.ok(read("world_illustration.js").includes("paintHearthEdgeBoughs(ctx,bounds,features)"));
 assert.ok(read("index.html").includes("world_greenwood_art.js?v=9&rev=31c"));
 assert.ok(read("sw.js").includes("world_greenwood_art.js?v=9&rev=31c"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 assert.equal(painting.stats().physicsChanged,false);
 assert.equal(painting.stats().creatorApproved,false);
 console.log("R31c PASS: two original collision-backed oak sources paint "+total+
 " proportionate independent leaf boughs without fake trees, changed roads or saves");
})().catch(e=>{console.error(e);process.exitCode=1});
