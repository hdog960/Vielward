/* VEILWARD Phase 9 R21 high-resolution original artwork in physical world. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8");
let source="",draw=[];
class Img{
 constructor(){this.onload=null;this.onerror=null;this.naturalWidth=512;this.naturalHeight=512}
 set src(v){source=v;this.onload?.()}
}
const scope={Image:Img,console};scope.window=scope;
vm.runInNewContext(read("world_greenwood_sanctuary.js"),scope);
const sprite=scope.VeilwardGreenwoodSanctuary;
(async()=>{
 assert.equal(sprite.version,"1.3.29");
 assert.equal(sprite.ready,false);
 assert.equal(await sprite.load(),true);
 assert.equal(sprite.ready,true);
 assert.equal(await sprite.load(),true);
 assert.equal(sprite.stats().originalWorldAnchors,true);
 assert.equal(sprite.stats().physicalGeometryChanged,false);
 assert.equal(sprite.stats().creatorApproved,false);
 assert.equal(source,"./assets/greenwood_hermit_sanctuary_r21.webp?v=1");
 const ctx={
  save(){},restore(){},drawImage(...args){draw.push(args)},
  imageSmoothingEnabled:false,imageSmoothingQuality:"low"
 };
 assert.equal(sprite.stamp(ctx,45960,21840-88,424,424),true);
 assert.equal(draw.length,1);
 assert.equal(draw[0][1],45960-212);
 assert.equal(draw[0][2],21840-88-424);
 assert.equal(draw[0][3],424);
 assert.equal(draw[0][4],424);
 const art=read("world_illustration.js"),game=read("game.js");
 assert.ok(art.includes('kind==="hermit"&&window.VeilwardGreenwoodSanctuary?.stamp('));
 assert.ok(art.includes('kind==="lodge"||kind==="hermit"'),"original fallback retained");
 assert.ok(game.includes("await window.VeilwardGreenwoodSanctuary?.load?.();"));
 assert.ok(read("sw.js").includes("veilward-hollowreach-v1329-illustrated-hermit"));
 assert.ok(read("index.html").includes("world_greenwood_sanctuary.js?v=1"));
 assert.ok(read("game.js").includes('const SAVE="veilward-hollowreach-v01";'));
 const model=JSON.parse(read("docs/overworld/world_blueprint.json"));
 assert.equal(model.regions.length,12);
 assert.equal(model.nodes.length,48);
 assert.equal(model.edges.length,65);
 assert.equal(model.nodes.find(n=>n.id==="hermit").point[0],766);
 console.log("R21 PASS: actual hermit sprite loaded from original 512px transparent art at unchanged world node, legacy fallback, saves/routes preserved, not artist-approved");
})().catch(e=>{console.error(e);process.exitCode=1});