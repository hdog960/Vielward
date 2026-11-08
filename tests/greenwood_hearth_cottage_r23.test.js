/* Veilward Phase 9 R23: authentic transparent Greenwood hearth replacement.
 * Source asset and original setpiece collision remain authoritative.
 * Passing this test does NOT constitute creator visual approval.
 */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
const imageBytes=fs.readFileSync("assets/greenwood_hearth_cottage_r23.webp");
assert.ok(imageBytes.length>=10500&&imageBytes.length<=16000);
assert.equal(imageBytes.toString("ascii",0,4),"RIFF");
assert.equal(imageBytes.toString("ascii",8,12),"WEBP");
const source=read("world_greenwood_hearth.js");
let imageUrl="",draws=[];
class ImageMock{
 constructor(){this.onload=null;this.onerror=null;this.naturalWidth=256;this.naturalHeight=256}
 set src(p){imageUrl=p;this.onload?.()}
}
const window={Image:ImageMock,console};window.window=window;
vm.runInNewContext(source,window,{filename:"world_greenwood_hearth.js"});
(async()=>{
 const painter=window.VeilwardGreenwoodHearth;
 assert.equal(painter.version,"1.3.32");
 assert.equal(painter.ready,false);
 assert.equal(await painter.load(),true);
 assert.equal(painter.ready,true);
 assert.equal(imageUrl,"./assets/greenwood_hearth_cottage_r23.webp?v=1");
 const c={save(){},restore(){},drawImage(...a){draws.push(a)}};
 const o={kind:"forest_cottage",anchor:"greenwood_hearth",
  x:45000,y:22000,r:92};
 assert.equal(painter.stamp(c,o),true);
 assert.equal(draws.length,1);
 assert.equal(draws[0][1],o.x-175);
 assert.equal(draws[0][2],o.y-350+10);
 assert.equal(draws[0][3],350);assert.equal(draws[0][4],350);
 assert.equal(painter.stamp(c,{...o,anchor:"hermit"}),false);
 assert.equal(painter.stamp(c,{...o,kind:"snow_cottage"}),false);
 assert.equal(draws.length,1,"other existing cottages unaffected");
 assert.equal(painter.stats().stamps,1);
 assert.equal(painter.stats().geometryChanged,false);
 assert.equal(painter.stats().saveKeyChanged,false);
 assert.equal(painter.stats().creatorApproved,false);
 assert.ok(read("world_setpieces.js").includes('o.kind==="forest_cottage"&&'));
 assert.ok(read("world_setpieces.js").includes("drawers[o.kind](c,o)"),
  "real fallback must remain");
 assert.ok(read("game.js").includes("await window.VeilwardGreenwoodHearth?.load?.();"));
 assert.ok(read("index.html").includes("world_greenwood_hearth.js?v=1"));
 assert.ok(read("sw.js").includes("veilward-hollowreach-v1335-greenwood-falls-r34"));
 assert.ok(read("sw.js").includes("assets/greenwood_hearth_cottage_r23.webp?v=1"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
 assert.equal(model.regions.length,12);
 assert.equal(model.nodes.length,48);
 assert.equal(model.edges.length,65);
 assert.equal(model.nodes.find(n=>n.id==="greenwood_hearth")?.region,"greenwood");
 console.log("R23 PASS: verified 256px original transparent WebP decoded, stamped only at physical Greenwood hearth cottage, other sprites/collision/saves protected; art unapproved");
})().catch(e=>{console.error(e);process.exitCode=1});
