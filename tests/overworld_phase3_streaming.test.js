/* Veilward Phase 3 streaming/real-game integration regression.
   Run: node tests/overworld_phase3_streaming.test.js
   Canvas pixels are mocked, so automated passage never claims art approval. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const blueprint=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));
const paths=["world_illustration.js","world_review.js","world_routes.js","world_climate.js","world_stream.js","game.js","navigation.js","combat.js","quest.js","visual.js","index.html","sw.js","world_geometry.js","world_footprint.js","terrain_art.js","docs/overworld/terrain_geometry.json","docs/overworld/outdoor_footprint.json"];
const source=Object.fromEntries(paths.map(p=>[p,fs.readFileSync(p,"utf8")]));
let checks=0;const ok=(b,m)=>{assert.ok(b,m);checks++},eq=(a,b,m)=>{assert.equal(a,b,m);checks++};
const drawing={fills:0,images:0};
function ctx2d(){return{clip(){},fillStyle:"",strokeStyle:"",lineWidth:1,imageSmoothingEnabled:false,
 setTransform(){},scale(){},translate(){},fillRect(){drawing.fills++},clearRect(){},
 drawImage(){drawing.images++},beginPath(){},moveTo(){},lineTo(){},closePath(){},
 stroke(){},fill(){},save(){},restore(){},setLineDash(){},arc(){},
 strokeText(){},fillText(){}}}
const makeCanvas=()=>({width:0,height:0,getContext:()=>ctx2d()});
const host={console:{log(){},warn(){},error(){}}};host.window=host;
vm.runInNewContext(source["world_stream.js"],host);
const World=host.VeilwardWorldStream;
ok(!!World&&World.version==="1.3.4","streaming module loaded");
ok(World.validate(blueprint)===blueprint,"real Phase 2 geography validated");
eq(blueprint.worldDesign.chunkPlan.totalPlannedCells,1536,"logical grid not allocated eagerly");
const stream=World.create(blueprint,{canvasFactory:makeCanvas,maxTiles:18});
eq(stream.stats().tilesBuilt,0,"zero full-world tile allocation at start");
eq(stream.width,72000,"global world width");
eq(stream.height,48000,"global world height");
eq(stream.size,1500,"chunk width");
eq(stream.regionName(),"Hollowreach · Frostbridge","Hollowreach anchor is the spawn");
stream.warm(stream.player.x,stream.player.y,2100,1300);
ok(stream.stats().cachedTiles>0&&stream.stats().cachedTiles<=18,"only nearby tiles warm");
const frame=stream.render(ctx2d(),1536,708,.78,.016);
eq(frame.missing,0,"first painted camera view has no missing terrain");
ok(stream.player.x>=frame.camera.x&&stream.player.x<frame.camera.x+frame.viewWidth,"initial camera includes player X");
ok(stream.player.y>=frame.camera.y&&stream.player.y<frame.camera.y+frame.viewHeight,"initial camera includes player Y");
ok(drawing.images>0,"actual generated tile canvases used");
const prevX=stream.player.x;stream.move(1,0,.055);
ok(stream.player.x>prevX&&stream.player.moving&&stream.player.facing.x>0,"move + facing uses global coords");
stream.move(0,0,.016);ok(!stream.player.moving,"idle movement frame stable");
const crossing=blueprint.edges.find(e=>e.crossing==="frostbridge_main");
const endpoints=[crossing.from,crossing.to].map(id=>blueprint.nodes.find(n=>n.id===id).point);
const middle=[(endpoints[0][0]+endpoints[1][0])*30,(endpoints[0][1]+endpoints[1][1])*30];
ok(!stream.blocked(...middle),"authored bridge path passes provisional river mask");
const island=blueprint.nodes.find(n=>n.id==="island").point;
ok(!stream.blocked(island[0]*60,island[1]*60),"island land mass is passable");
ok(stream.blocked(742*60,649*60),"unbridged lake water blocks movement");
const bridge=blueprint.edges.find(e=>e.crossing==="mossmere_west_footbridge");
const shores=[bridge.from,bridge.to].map(id=>blueprint.nodes.find(n=>n.id===id).point);
ok(!stream.blocked((shores[0][0]+shores[1][0])*30,(shores[0][1]+shores[1][1])*30),"lake footbridge permits crossing");
for(let col=3;col<=37;col++){
 stream.player.x=(col+.5)*1500;stream.player.y=9000;
 stream.render(ctx2d(),1536,708,.78,.055);
 ok(stream.stats().cachedTiles<=18,"bounded cache while moving across grid column "+col);
}
ok(stream.stats().tilesBuilt>35,"distant chunks are built lazily");
ok(stream.stats().peakCachedTiles<=18,"peak tile count respects cache limit");
// Real sequential walking across four adjoining chunks (not teleporting).
const walking=World.create(blueprint,{canvasFactory:makeCanvas,maxTiles:18});
walking.player.x=4300;walking.player.y=9000;
let seamCrossings=0,lastCol=Math.floor(walking.player.x/1500);
for(let step=0;step<850;step++){
 const old=walking.player.x;
 walking.move(1,0,.055);
 ok(walking.player.x>=old,"walking never snaps backward on chunk boundaries");
 if(Math.floor(walking.player.x/1500)!==lastCol){seamCrossings++;lastCol=Math.floor(walking.player.x/1500)}
 if(step%25===0){
  walking.render(ctx2d(),1536,708,.78,.055);
  ok(walking.stats().cachedTiles<=18,"walk test memory remains bounded");
 }
}
ok(seamCrossings>=3,"walking actually crosses three or more chunk boundaries");
ok(walking.player.moving,"Wanderer keeps moving after seamless crossings");
ok(walking.stats().frame>10,"camera renders seamlessly during multi-chunk walking");

ok(stream.stats().estimatedCachedRGBABytes<=18*375*375*4,"cached tile byte estimate bounded");
const built=stream.stats().tilesBuilt;stream.clearCache();
eq(stream.stats().cachedTiles,0,"chunk cache can be purged");
stream.render(ctx2d(),1536,708,.78,.016);
ok(stream.stats().tilesBuilt>built,"view reloads after tile eviction");
const sample=World.colorAt(blueprint,16500,18000).join(",");
eq(World.colorAt(blueprint,16500,18000).join(","),sample,"tile coloring deterministic");
const html=source["index.html"],sw=source["sw.js"],game=source["game.js"];
for(const asset of ["world_review.js?v=2","world_routes.js?v=2","world_climate.js?v=2","world_geometry.js?v=1","world_footprint.js?v=3","terrain_art.js?v=5","world_stream.js?v=7","game.js?v=26","visual.css?v=15","docs/overworld/world_blueprint.json?v=1","manifest.webmanifest?v=134"]){
 ok((asset.includes("world_blueprint.json")?game.includes(asset):html.includes(asset))&&sw.includes(asset),
  "Runtime/worker asset version parity "+asset);
}
ok(html.indexOf("world_stream.js?v=7")<html.indexOf("game.js?v=26"),"world module before game.js");
ok(html.includes('id="worldPreviewBtn"')&&html.includes('id="streamStatus"'),"preview menu and status exist");
ok(sw.includes("veilward-hollowreach-v134-illustrated-recovery-r1"),"PWA cache rotated");
ok(game.includes('const APP_VERSION="1.3.4";'),"runtime app version bumped");
ok(game.includes('const SAVE="veilward-hollowreach-v01";'),"original save key retained");
ok(game.includes("if(worldPreview.enabled){renderWorldPreview();return}"),"preview renderer is isolated");
ok(game.includes("if(worldPreview.enabled){tickWorldPreview(dt);return}"),"preview tick is isolated");
ok(source["visual.js"].includes('load("hero","hero_approved_8way_v12.webp"'),"approved hero preserved");
ok(source["visual.js"].includes('load("warden","warden_hal_v13.png"'),"Warden Hal preserved");
function gameSession(){
 const memory=new Map(),nodes=new Map();
 function el(id){
  if(nodes.has(id))return nodes.get(id);
  let value="",children=[];
  const e={id,style:{},dataset:{},textContent:"",handlers:{},classList:{toggle(){},add(){},remove(){}},
   get innerHTML(){return value},set innerHTML(v){value=v;children=[]},
   get children(){return children},appendChild(child){children.push(child)},
   addEventListener(t,cb){(this.handlers[t]??=[]).push(cb)},
   fire(t){for(const cb of this.handlers[t]||[])cb({preventDefault(){},pointerId:1,pointerType:"mouse",clientX:0,clientY:0})},
   getContext(){return ctx2d()},getBoundingClientRect(){return{left:0,top:0,width:160,height:160}},setPointerCapture(){}
  };nodes.set(id,e);return e;
 }
 const document={getElementById:el,createElement:tag=>el("created-"+tag+"-"+Math.random()),querySelectorAll(){return[]},addEventListener(){},visibilityState:"visible"};
 const localStorage={getItem:k=>memory.has(k)?memory.get(k):null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
 const ctx={document,localStorage,navigator:{},location:{search:""},innerWidth:1536,innerHeight:708,
  console:{warn(){},log(){},error(){}},performance:{now(){return 500}},
  addEventListener(){},requestAnimationFrame(fn){if(fn.name!=="frame")Promise.resolve().then(()=>fn(16))},
  confirm(){return true},setTimeout(){},clearTimeout(){}
 };
 ctx.window=ctx;
 ctx.fetch=async url=>({ok:true,status:200,json:async()=>url.includes("outdoor_footprint.json")?JSON.parse(source["docs/overworld/outdoor_footprint.json"]):url.includes("terrain_geometry.json")?JSON.parse(source["docs/overworld/terrain_geometry.json"]):blueprint});
 ctx.VeilwardArt={background(){return null},sceneReady(){return true},sceneError(){return false},
  glows(){},routeGlows(){},actor(){return true}};
 const sandbox=vm.createContext(ctx);
 for(const path of ["navigation.js","combat.js","quest.js","world_geometry.js","world_climate.js","world_footprint.js","world_routes.js","world_illustration.js","terrain_art.js","world_stream.js","world_review.js"])vm.runInContext(source[path],sandbox);
 const injection='\nwindow.__qa={get player(){return p},get preview(){return worldPreview},toggleWorldPreview,tickWorldPreview,renderWorldPreview,save};\n';
 const realGame=game.replace(/\n\}\)\(\);\s*$/,injection+"})();");
 ok(realGame!==game,"actual game function integration instrumented");
 vm.runInContext(realGame,sandbox,{filename:"game.js"});
 el("beginBtn").fire("click");
 ok(!!ctx.__qa,"real game loaded inside mocked iPhone DOM");
 return {ctx,el,memory};
}
async function integration(){
 const {ctx,el,memory}=gameSession(),qa=ctx.__qa,p=qa.player;
 const before=JSON.stringify(p);
 ok((el("worldPreviewBtn").handlers.click||[]).length>0,"live UI binds streaming preview button");
 await qa.toggleWorldPreview();
 ok(qa.preview.enabled&&!!qa.preview.stream,"preview opens with source geography");
 ok(!!qa.preview.stream.geometry,"real preview receives Phase 4 co-authored collision data");
 ok(!!qa.preview.stream.art,"game preview uses authored pixel-art atlas");
 ok(!!qa.preview.stream.footprint,"game preview now uses full outdoor landmass, not an isolated scene");
 ok(!!qa.preview.stream.routeArt,"game preview includes Phase 8 full road-network artwork and physical rail collision");
 ok(!!qa.preview.stream.climate,"Phase 7 world uses shared climate model");
 eq(el("streamStatus").style.display,"block","stream preview status visible");
 eq(el("quest").style.display,"none","quest HUD hidden only while in preview");
 const x=qa.preview.stream.player.x;qa.preview.stream.move(1,0,.055);
 ok(qa.preview.stream.player.x>x,"preview moves independently of quest player");
 qa.renderWorldPreview();
 ok(qa.preview.stream.stats().visibleTiles>0,"real game uses streamed tiles in preview rendering");
 eq(JSON.stringify(p),before,"preview does not mutate character inventory / quest / position");
 await qa.toggleWorldPreview();
 ok(!qa.preview.enabled,"preview closes back into saved adventure");
 eq(el("location").textContent,"Hollowreach · Frostbridge Outpost","original zone label restored");
 eq(el("streamStatus").style.display,"none","temporary preview label removed");
 eq(el("quest").style.display,"","old quest HUD restored");
 eq(JSON.stringify(p),before,"returning has not modified adventure state");
 qa.save(true);
 const saved=JSON.parse(memory.get("veilward-hollowreach-v01"));
 eq(saved.quest,0,"current quest intact after saving");
 eq(saved.zone,"village","legacy zone preserved");
 ok(!("worldPreview" in saved)&&!("stream" in saved),"no preview internals leak into save");
}
integration().then(()=>{
 console.log("Veilward Phase 3 PASS:",checks,"streaming and real-game integration assertions.");
}).catch(err=>{console.error(err);process.exitCode=1});
