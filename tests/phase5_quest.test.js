/* Veilward Phase 5 — game-level quest and save regression.
 * Run from repo root: node tests/phase5_quest.test.js
 */
"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict");
const game=fs.readFileSync("game.js","utf8");
const quest=fs.readFileSync("quest.js","utf8");
const nav=fs.readFileSync("navigation.js","utf8");
const combat=fs.readFileSync("combat.js","utf8");
const visual=fs.readFileSync("visual.js","utf8");
const html=fs.readFileSync("index.html","utf8");
const worker=fs.readFileSync("sw.js","utf8");
const SAVE="veilward-hollowreach-v01";
let checks=0;
function ok(value,label){assert.ok(value,label);checks++}
function eq(value,expected,label){assert.equal(value,expected,label);checks++}
function createSession(storage){
 const nodes=new Map();
 function node(id){
  if(nodes.has(id))return nodes.get(id);
  let inner="",children=[];
  const o={id,style:{},dataset:{},textContent:"",handlers:{},classList:{toggle(){},add(){},remove(){}},
   get innerHTML(){return inner},set innerHTML(value){inner=value;children=[]},
   get children(){return children},appendChild(child){children.push(child)},
   addEventListener(type,fn){(this.handlers[type]??=[]).push(fn)},
   fire(type){for(const fn of this.handlers[type]||[])fn({preventDefault(){},pointerType:"mouse",pointerId:1})},
   getContext(){return{fillRect(){},drawImage(){},clearRect(){},imageSmoothingEnabled:false}},
   getBoundingClientRect(){return{left:0,top:0,width:180,height:180}},
   setPointerCapture(){}
  };
  nodes.set(id,o);return o;
 }
 const document={getElementById:node,createElement:tag=>node("created-"+tag+"-"+Math.random()),
  querySelectorAll(){return[]},addEventListener(){},visibilityState:"visible"};
 const localStorage={
  getItem:key=>storage.has(key)?storage.get(key):null,
  setItem:(key,value)=>storage.set(key,String(value)),
  removeItem:key=>storage.delete(key)
 };
 const ctx={document,localStorage,navigator:{},location:{search:""},innerWidth:1536,innerHeight:720,
  addEventListener(){},requestAnimationFrame(){},confirm(){return true},
  performance:{now(){return 1000}},console:{warn(){},error(){},log(){}}
 };
 ctx.window=ctx;
 ctx.VeilwardArt={background(){return null},sceneReady(){return true},sceneError(){return false},
  glows(){},routeGlows(){},actor(){return true}};
 const module=(source)=>new Function("window",source)(ctx);
 module(nav);module(combat);module(quest);
 const injection='window.__qa={get p(){return p},get objects(){return objects},get enemies(){return enemies},'+
  'get active(){return active},interact,tick,killEnemy,changeZone,closeAll,save,reset,'+
  'setPosition(zone,x,y){p.zone=zone;p.x=x;p.y=y}};\n';
 const marked=game.replace(/\n\}\)\(\);\s*$/, "\n"+injection+"})();");
 ok(marked!==game,"game closure test injection available");
 new Function("window","document","localStorage","navigator","location","innerWidth","innerHeight",
  "addEventListener","requestAnimationFrame","confirm","performance","console",marked)(
  ctx,document,localStorage,ctx.navigator,ctx.location,1536,720,ctx.addEventListener,
  ctx.requestAnimationFrame,ctx.confirm,ctx.performance,ctx.console);
 node("beginBtn").fire("click");
 ok(ctx.__qa.active,"scene started");
 return {q:ctx.__qa,node,storage,
  choose(contains){
   const choice=node("choices").children.find(e=>e.textContent.includes(contains));
   ok(!!choice,"dialogue option: "+contains);choice.onclick();
  },
  go(zone,x,y){ctx.__qa.closeAll();ctx.__qa.setPosition(zone,x,y);ctx.__qa.interact()},
  close(){ctx.__qa.save(true)}
 };
}
function mainRoute(){
 const storage=new Map(),s=createSession(storage),p=s.q.p;
 eq(p.quest,0,"new quest 0");
 s.go("village",885,520);eq(p.quest,1,"Joren begins quest");s.choose("I'll investigate");
 s.q.changeZone("wilds",735,991);s.q.tick(.02);eq(p.quest,2,"Greenwood sets cave objective");
 const before=p.gold;
 s.go("cave",888,689);eq(p.quest,2,"guarded crate cannot skip combat");
 eq(p.gold,before,"guarded crate gives no gold");
 const raider=s.q.enemies.cave.find(e=>e.type==="bandit"&&!e.dead);
 ok(!!raider,"cave bandit available");
 s.q.killEnemy(raider);ok(p.caveBanditCleared,"defeating cave bandit recorded");
 const afterKill=p.gold;
 s.go("cave",888,689);eq(p.quest,3,"recovered crate advances quest");
 eq(p.gold,afterKill+30,"crate pays exactly once");ok(p.supplies,"quest item in bag");
 const afterChest=p.gold;
 s.go("cave",888,689);eq(p.gold,afterChest,"no second supply chest reward");
 s.q.changeZone("wilds",1520,720);s.q.changeZone("village",1030,675);
 s.go("village",885,520);s.choose("Return the supplies");
 eq(p.quest,4,"Joren hands out Worldscar follow-up");
 eq(p.gold,afterChest+80,"Joren pays exactly 80 gold");
 ok(!p.supplies&&p.suppliesDelivered,"supplies permanently delivered");
 s.go("village",885,520);
 ok(!s.node("choices").children.some(e=>e.textContent.includes("Return the supplies")),"no repeat delivery option");
 s.close();
 const reloaded=createSession(storage),v=reloaded.q;
 eq(v.p.quest,4,"quest persists after app restart");
 eq(v.p.gold,p.gold,"gold persists");
 ok(v.objects.find(o=>o.type==="chest").taken,"crate remains empty after restart");
 ok(v.enemies.cave.some(e=>e.type==="bandit"&&e.homeX===raider.homeX&&e.dead),"cave raider kill persists");
 ok(v.enemies.cave.some(e=>e.type==="bandit"&&e.homeX!==raider.homeX&&!e.dead),"surviving cave raider remains alive after reload");
 reloaded.go("wilds",500,920);reloaded.go("wilds",1190,714);
 eq(v.p.herbs,2,"both herbs collected");
 reloaded.go("village",1210,665);reloaded.choose("Trade 2 Blueleaf");
 eq(v.p.herbs,0,"herbs consumed in trade");
 reloaded.close();
 const t=createSession(storage);
 eq(t.q.p.herbs,0,"herb trade persists");
 eq(t.q.objects.filter(o=>o.type==="herb"&&o.taken).length,2,"harvested herbs do not respawn");
 t.go("wilds",500,920);eq(t.q.p.herbs,0,"old blueleaf cannot be collected again");
 t.go("wilds",1480,420);t.choose("Touch the fracture");
 eq(t.q.p.quest,5,"Worldscar finishes follow-up");
 const xp=t.q.p.xp;t.go("wilds",1480,420);
 ok(!t.node("choices").children.some(e=>e.textContent.includes("Touch the fracture")),"Worldscar reward only once");
 eq(t.q.p.xp,xp,"no duplicate attunement XP");t.choose("Step away");
 t.go("village",885,520);t.choose("Show me your wares");
 const balance=t.q.p.gold;t.choose("Buy Tempered Sword");
 eq(t.q.p.weapon,"Tempered Steel Sword","new sword equipped");
 eq(t.q.p.gold,balance-65,"sword paid once");
 t.go("village",885,520);t.choose("Show me your wares");
 t.choose("Tempered Sword equipped");eq(t.q.p.gold,balance-65,"no duplicate sword charge");
 t.close();
 const final=createSession(storage);
 eq(final.q.p.quest,5,"complete quest persists");
 eq(final.q.p.weapon,"Tempered Steel Sword","weapon persists");
 final.q.reset();eq(final.q.p.quest,0,"reset quest state");
 ok(!final.q.p.suppliesRecovered,"reset all quest flags");
 eq(final.q.objects.filter(o=>o.type==="herb"&&o.taken).length,0,"reset blueleaf patches");
 ok(!final.q.objects.find(o=>o.type==="chest").taken,"reset supply crate");
}
function earlyScar(){
 const s=createSession(new Map()),p=s.q.p;
 s.go("village",885,520);s.choose("I'll investigate");
 s.q.changeZone("wilds",735,991);s.q.tick(.02);
 s.q.killEnemy(s.q.enemies.cave.find(e=>e.type==="bandit"));
 s.go("cave",888,689);eq(p.quest,3,"supplies recovered before early scar");
 s.go("wilds",1480,420);s.choose("Touch the fracture");
 eq(p.quest,3,"early Worldscar does not skip handing supplies back");
 s.go("village",885,520);s.choose("Return the supplies");
 eq(p.quest,5,"early scar reconciled at Joren");
}
function legacy(){
 const storage=new Map();
 storage.set(SAVE,JSON.stringify({zone:"village",x:925,y:620,sceneVersion:6,quest:4,
  supplies:false,gold:115,herbs:1,lv:2,skills:{blade:2,sorcery:1,survival:2}}));
 const s=createSession(storage);
 eq(s.q.p.gold,115,"legacy gold kept");
 eq(s.q.p.quest,4,"legacy quest stage kept");
 ok(s.q.p.suppliesRecovered&&s.q.p.suppliesDelivered,"legacy delivery inferred");
 ok(s.q.objects.find(o=>o.type==="chest").taken,"legacy crate not reactivated");
 eq(s.q.objects.filter(o=>o.type==="herb"&&o.taken).length,1,"legacy harvest inferred");
 s.close();
 const again=createSession(storage);
 eq(again.q.p.gold,115,"migrated save stable");
}
function legacyStageThree(){
 const store=new Map();
 store.set(SAVE,JSON.stringify({zone:"village",x:885,y:520,sceneVersion:6,quest:3,
  supplies:false,loot:true,gold:80,herbs:0,lv:2,
  skills:{blade:1,sorcery:1,survival:1}}));
 const s=createSession(store);
 eq(s.q.p.quest,3,"legacy active delivery stage retained");
 ok(s.q.p.supplies&&s.q.p.suppliesRecovered,"legacy quest item restored into bag");
 ok(s.q.objects.find(o=>o.type==="chest").taken,"legacy supply chest remains empty");
 s.go("village",885,520);
 s.choose("Return the supplies");
 eq(s.q.p.quest,4,"restored legacy delivery can finish correctly");
 eq(s.q.p.gold,160,"legacy delivery receives exactly one reward");
}
mainRoute();earlyScar();legacy();legacyStageThree();
ok(game.includes('const APP_VERSION="1.3.36"'),"game build bumped");
ok(game.includes('const SAVE="veilward-hollowreach-v01"'),"save key retained");
ok(visual.includes('load("hero","hero_approved_8way_v12.webp"'),"approved hero intact");
ok(visual.includes('load("warden","warden_hal_v13.png"'),"Warden Hal intact");
for(const asset of ["world_review.js?v=4","world_routes.js?v=27","world_climate.js?v=4","quest.js?v=1","combat.js?v=2","world_geometry.js?v=1","world_footprint.js?v=5","terrain_art.js?v=32","world_stream.js?v=32","game.js?v=57",
 "navigation.js?v=11","visual.js?v=33","visual.css?v=15","manifest.webmanifest?v=1336"])
 ok(html.includes(asset)&&worker.includes(asset),"HTML/worker reference "+asset);
ok(html.indexOf("quest.js?v=1")<html.indexOf("game.js?v=57"),"quest module before gameplay");
console.log("Veilward Phase 5 PASS:",checks,"game-session quest and save assertions");
