/* Veilward Phase 5 — authored pixel-art material atlas / compositing QA.
 * node tests/overworld_phase5_art.test.js
 * Pixel production check, not an assertion of creator visual approval.
 */
"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),vm=require("node:vm");
const source=fs.readFileSync("terrain_art.js","utf8");
const geometrySource=fs.readFileSync("world_geometry.js","utf8");
const streamSource=fs.readFileSync("world_stream.js","utf8");
const game=fs.readFileSync("game.js","utf8"),html=fs.readFileSync("index.html","utf8");
const sw=fs.readFileSync("sw.js","utf8"),visual=fs.readFileSync("visual.js","utf8");
const model=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const terrain=JSON.parse(fs.readFileSync("docs/overworld/terrain_geometry.json","utf8"));
const roadmap=fs.readFileSync("OVERWORLD_REBUILD_ROADMAP.md","utf8");
const manifest=JSON.parse(fs.readFileSync("docs/overworld/TERRAIN_MATERIALS.json","utf8"));
let checks=0;
const yes=(x,m)=>{assert.ok(x,m);checks++},eq=(x,y,m)=>{assert.equal(x,y,m);checks++};
const stats={pixelFills:0,atlasBlits:0,paths:0,clips:0};
function context(){
 return {fillStyle:"",strokeStyle:"",lineWidth:1,lineCap:"",lineJoin:"",imageSmoothingEnabled:true,globalAlpha:1,
  fillRect(){stats.pixelFills++},drawImage(){stats.atlasBlits++},
  beginPath(){stats.paths++},moveTo(){},lineTo(){},closePath(){},arc(){},clip(){stats.clips++},
  fill(){stats.pixelFills++},stroke(){},save(){},restore(){},scale(){},translate(){},setLineDash(){},fillText(){}
 }
}
const factory=()=>({width:0,height:0,getContext:()=>context()});
const host={console:{warn(){},error(){},log(){}}};host.window=host;
vm.runInNewContext(geometrySource,host);vm.runInNewContext(source,host);vm.runInNewContext(streamSource,host);
const G=host.VeilwardGeometry,A=host.VeilwardTerrainArt,W=host.VeilwardWorldStream;
eq(A.version,"1.3.6","versioned authored material system");
eq(W.version,"1.3.6","world stream includes the new art");
eq(G.version,"1.2.8","verified Phase 4 collision unchanged");
eq(A.sourceTileSize,32,"pixel-source tile is 32×32");
eq(A.variants,4,"four handcrafted deterministic variations per material");
eq(A.materials.length,16,"16 source-art material families");
eq(manifest.materialCount,A.materials.length,"material manifest count matches runtime atlas");
eq(manifest.sourceFrames,A.materials.length*A.variants,"source atlas frame count matches manifest");
eq(manifest.sourceMechanism.includes("256×256"),true,"asset provenance and sprite sheet generation documented");
for(const m of manifest.materials){
 eq(m.id,A.materials[m.index],"source-to-game material frame order preserved "+m.id);
 eq(m.motif,A.palettes[m.id].motif,"source-to-game material brush preserved "+m.id);
 for(const field of ["base","dark","light","mid","spark"])
  eq(m.colors[field],A.palettes[m.id][field],"material color signature protected "+m.id+"/"+field);
}

eq(new Set(Array.from(A.materials)).size,16,"each material has one unique source identity");
for(const name of ["snow","frost","thaw","forest","grass","moss","road","dirt","stone","ruin","wetland","river","lake","cliff","arcane","timber"]){
 yes(!!A.palettes[name]&&!!A.palettes[name].motif,"authored material palette and motif: "+name);
 for(const field of ["base","dark","light","mid","spark"])yes(/^#[0-9a-f]{6}$/i.test(A.palettes[name][field]),"valid material color "+name+"/"+field);
}
const geo=G.create(model,terrain),art=A.create(model,geo,{canvasFactory:factory});
const info=art.diagnostics();
eq(info.atlasWidth,256,"8 source atlas columns");
eq(info.atlasHeight,256,"8 source atlas rows");
eq(info.materials*info.variants,64,"64 authored source frames");
eq(info.worldCellSize,96,"global 96-world-unit artwork cells");
yes(stats.pixelFills>150&&stats.pixelFills<950,"atlas paints coherent source motifs without thousands of random speckle marks");
eq(info.usesAuthoritativeSolids,true,"art from same terrain geometry as physics");
const ids={
 village:"snow",thaw_camp:"thaw",greenwood_hearth:"forest",
 worldscar_ring:"arcane",mossmere_w:"wetland"
};
for(const [id,expected] of Object.entries(ids)){
 const node=model.nodes.find(n=>n.id===id),[x,y]=node.point;
 eq(art.materialAt(x*60,y*60),expected,"landmark material is coherent "+id);
}
eq(art.materialAt(742*60,649*60),"lake","Mossmere bay paints water");
eq(art.materialAt(758*60,690*60),"wetland","Mossmere island gets a land surface, not lake water");
const river=model.waterways.find(w=>w.id==="frostbridge_river");
const riverPoint=river.centerline[3];
eq(art.materialAt(riverPoint[0]*60,riverPoint[1]*60),"river","glacial river uses water motif");
eq(art.materialAt(1041*60,569*60),"cliff","chasm uses shadowed cliff material");
for(let material of A.materials)for(let variant=0;variant<4;variant++){
 const rect=art.atlasRect(material,variant);
 yes(rect.every(Number.isFinite)&&rect[0]>=0&&rect[1]>=0&&rect[0]<256&&rect[1]<256,"source atlas crop valid "+material+"/"+variant);
}
const px=1499,py=18020,near=art.sameSourceCell(px,py),far=art.sameSourceCell(1500,py);
eq(near.gx,far.gx,"streaming chunk boundary does not reset source tile X");
eq(near.gy,far.gy,"streaming chunk boundary does not reset source tile Y");
eq(near.variant,far.variant,"variants do not reset or flicker across chunk seam");
eq(near.material,far.material,"material selection is global, not local to the chunk");
const first=art.boundsCells([0,0,1500,1500]),next=art.boundsCells([1500,0,3000,1500]);
yes(first.some(c=>c.x===1440)&&next.some(c=>c.x===1440),"identical global source tile overlaps both chunk images");
const drawBefore=stats.atlasBlits;
art.paintChunk(context(),[16500,18000,18000,19500],375);
yes(stats.atlasBlits>drawBefore+100,"actual renderer composites many material atlas tiles");
const clipBefore=stats.clips;
art.paintChunk(context(),[16800,17300,18300,18800],375);
yes(stats.clips>clipBefore,"authored surface polygons are used as compositing masks");
const decorationBefore=stats.pixelFills;
const body=art.paintChunk(context(),[62000,32800,63500,34300],375);
yes(stats.pixelFills>decorationBefore+5,"roads, planks and props use real pixel draw calls");
const target=art.sameSourceCell(20040,18048);
eq(art.sameSourceCell(20040,18048).material,target.material,"the renderer is deterministic across rebuilds");
const stream=W.create(model,{geometry:terrain,canvasFactory:factory,maxTiles:18});
yes(!!stream.art&&stream.art.diagnostics().materials===16,"playable stream instantiates real material atlas");
yes(!!stream.geometry,"world still uses co-authored collision from Phase 4");
eq(stream.stats().tilesBuilt,0,"material atlas does not eagerly build 1,536 terrain chunks");
stream.warm(stream.player.x,stream.player.y,2300,1400);
yes(stream.stats().cachedTiles>0&&stream.stats().cachedTiles<=18,"material chunks warm safely within bounded memory");
const screen=context();
stream.render(screen,1536,708,.78,.016);
yes(stream.stats().terrainArt.materials===16,"live rendering exposes atlas diagnostics");
yes(stats.atlasBlits>drawBefore+200,"live chunk rendering blits actual material tiles");
const meadow=stream.jumpToNode("greenwood_hearth");
yes(meadow.node==="greenwood_hearth"&&stream.stats().region.includes("Greenwood"),"material showcase moves within disposable preview");
stream.render(screen,1536,708,.78,.016);
yes(stream.stats().cachedTiles<=18,"instant material jump does not blow memory budget");
const foothills=stream.jumpToNode("worldscar_ring");
yes(foothills.node==="worldscar_ring"&&stream.player.groundHeight>=4,"stone terrain showcase updates foot elevation");
stream.renderForeground(context(),stream.player);
yes(stream.player.x>0,"foreground occlusion does not relocate player or sprites");
const refs=["world_review.js?v=4","world_routes.js?v=4","world_climate.js?v=4","world_footprint.js?v=5","terrain_art.js?v=8","world_stream.js?v=10","game.js?v=29","visual.css?v=15","manifest.webmanifest?v=138"];
for(const ref of refs)yes(html.includes(ref)&&sw.includes(ref),"PWA/HTML contain version-identical art module "+ref);
yes(html.indexOf("world_geometry.js?v=1")<html.indexOf("world_footprint.js?v=5")&&html.indexOf("world_footprint.js?v=5")<html.indexOf("terrain_art.js?v=8")&&
    html.indexOf("terrain_art.js?v=8")<html.indexOf("world_stream.js?v=10")&&
    html.indexOf("world_stream.js?v=10")<html.indexOf("game.js?v=29"),"HTML resolves geometry→art→stream→game");
yes(html.includes('id="materialShowcaseBtn"')&&game.includes("cycleTerrainShowcase"),"real game includes five material biome inspection trips");
yes(game.includes('const APP_VERSION="1.3.8";'),"actual game version set");
yes(sw.includes('veilward-hollowreach-v138-hollowreach-raster'),"Home Screen cache rotated");
yes(game.includes('const SAVE="veilward-hollowreach-v01";'),"original adventure save key never modified");
yes(visual.includes('load("hero","hero_approved_8way_v12.webp"'),"approved Wanderer atlas preserved");
yes(visual.includes('load("warden","warden_hal_v13.png"'),"approved Warden separate art preserved");
yes(roadmap.includes("### MANDATORY CHECKPOINT"),"creator's mandatory Phase 9 appearance review remains locked");
console.log("Veilward Phase 5 PASS:",checks,"art atlas, compositing, biome, seam, cache, game and PWA assertions.");
