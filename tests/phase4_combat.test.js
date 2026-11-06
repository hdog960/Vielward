/*
 * Veilward 1.2.5 — Phase 4 combat regression suite.
 * Run from repo root: node tests/phase4_combat.test.js
 * Uses Node built-ins only. iPhone visual review still needed.
 */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const contents={
 combat:fs.readFileSync("combat.js","utf8"),
 navigation:fs.readFileSync("navigation.js","utf8"),
 game:fs.readFileSync("game.js","utf8"),
 visual:fs.readFileSync("visual.js","utf8"),
 html:fs.readFileSync("index.html","utf8"),
 worker:fs.readFileSync("sw.js","utf8")
};
const w={window:{}};
vm.runInNewContext(contents.combat,w);
vm.runInNewContext(contents.navigation,w);
const c=w.window.VeilwardCombat,nav=w.window.VeilwardNav;
let assertions=0;
function ok(value,why){assert.ok(value,why);assertions++}
const clear={canWalk:()=>true,projectMotion:(zone,x,y,dx,dy)=>({x:x+dx,y:y+dy})};
const walled={canWalk:(zone,x,y)=>!(x>=20&&x<=42&&y>=-100&&y<=100),projectMotion:(zone,x,y,dx,dy)=>({x:x+dx,y:y+dy})};
const wanderer={x:0,y:0,zone:"wilds",facing:{x:1,y:0}};
const foe=(x,y,type="wolf",zone="wilds")=>({
 x,y,type,zone,hp:70,max:70,dead:false,stun:0,atk:0,wind:0,
 step:0,aim:null,homeX:x,homeY:y
});
ok(c.version==="1.2.5","correct combat version");
ok(Object.keys(c.RULES).length===3,"3 defined enemy profiles");
for(const facing of [{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}]){
 const p={...wanderer,facing},front=foe(facing.x*70,facing.y*70),
  rear=foe(-facing.x*65,-facing.y*65),
  flank=foe(-facing.y*65,facing.x*65);
 ok(c.swordCanHit(p,front,clear),"sword must hit straight ahead");
 ok(!c.swordCanHit(p,rear,clear),"sword must not hit behind");
 ok(!c.swordCanHit(p,flank,clear),"sword must not hit 90-degree flank");
 ok(!c.swordCanHit(p,foe(facing.x*95,facing.y*95),clear),"sword range limited");
}
ok(!c.swordCanHit(wanderer,foe(65,0),walled),"sword cannot pass an obstruction");
ok(!c.swordCanHit(wanderer,{...foe(50,0),dead:true},clear),"dead enemies excluded from attack");
ok(c.swordCanHit({...wanderer,facing:{x:1,y:1}},foe(55,55),clear),"diagonal sword aiming correct");
ok(c.chooseSpellTarget(wanderer,[foe(-18,0),foe(90,0)],clear).x===90,"spell favors a visible target in front");
ok(!c.chooseSpellTarget(wanderer,[foe(90,0)],walled),"spell cannot auto-target through a wall");
ok(!c.chooseSpellTarget(wanderer,[foe(-90,0)],clear),"spell cannot auto-lock behind the caster");
ok(!c.chooseSpellTarget(wanderer,[foe(0,50)],clear),"spell cannot snap sideways at 90 degrees");
ok(c.chooseSpellTarget(wanderer,[foe(0,50),foe(60,0)],clear).x===60,"spell chooses target inside forward cone, not nearer flank");
ok(!c.chooseSpellTarget(wanderer,[foe(400,0)],clear),"spell lock-on range is limited");
ok(!c.chooseSpellTarget(wanderer,[{...foe(65,0),dead:true}],clear),"dead foe not targeted");
for(const type of Object.keys(c.RULES)){
 const r=c.RULES[type];
 ok(r.wind>=.70,"every enemy must have readable warning");
 ok(r.cooldown>r.wind+.7,"enemy windup followed by a cooldown");
 const target={x:0,y:48,zone:"wilds"},enemy=foe(0,0,type);
 let step=c.enemyStep(enemy,target,.016,clear);
 ok(step.phase==="windup"&&step.damage===0,"enemy starts warning with no instant damage");
 step=c.enemyStep(enemy,target,.2,clear);
 ok(step.phase==="warning"&&step.damage===0,"enemy warning persists during windup");
 step=c.enemyStep(enemy,target,1,clear);
 ok(step.phase==="hit"&&step.damage===r.damage,"enemy deals one hit after warning");
 step=c.enemyStep(enemy,target,.02,clear);
 ok(step.damage===0&&step.phase!=="windup","enemy cannot immediately repeat strike");
 const side=foe(0,0,type),sneak={x:0,y:45,zone:"wilds"};
 c.enemyStep(side,sneak,.01,clear);
 sneak.x=90;sneak.y=0;
 ok(c.enemyStep(side,sneak,1,clear).damage===0,"sidestep defeats locked attack direction");
 const retreat=foe(0,0,type),dodge={x:0,y:45,zone:"wilds"};
 c.enemyStep(retreat,dodge,.01,clear);dodge.y=200;
 ok(c.enemyStep(retreat,dodge,1,clear).damage===0,"retreat defeats windup range");
 const stunned=foe(0,0,type);
 c.enemyStep(stunned,target,.01,clear);
 c.stagger(stunned,.32);
 ok(stunned.wind===0&&stunned.aim===null,"stagger clears attack warning and aim");
 ok(c.enemyStep(stunned,target,.05,clear).damage===0,"stunned enemy deals no damage");
 const blind=foe(0,0,type),person={x:45,y:0,zone:"wilds"};
 ok(c.enemyStep(blind,person,.02,walled).phase==="idle","cannot strike through terrain");
 const chasing=foe(0,0,type);
 ok(c.enemyStep(chasing,{x:180,y:0,zone:"wilds"},.05,walled).phase==="idle","cannot chase unseen target across barrier");
 const pursuer=foe(0,0,type);
 const beforeX=pursuer.x;
 ok(c.enemyStep(pursuer,{x:140,y:0,zone:"wilds"},.05,clear).phase==="chase"&&pursuer.x>beforeX,"mobile enemy pursues only in open space");
}
const projectile={x:0,y:-26,vx:360,vy:0,age:0};
ok(!c.projectileStep(projectile,.25,walled,"wilds")&&projectile.blocked,"spell projectile stops against a barrier");
ok(projectile.x<42,"projectile never traverses behind barrier");
const openOrb={x:0,y:-26,vx:360,vy:0,age:0};
ok(c.projectileStep(openOrb,.05,clear,"wilds")&&openOrb.x>10,"spell projectile flies over valid ground");
openOrb.age=1.39;
ok(!c.projectileStep(openOrb,.05,clear,"wilds"),"spell expires at maximum travel age");
for(const enemy of [
 ["wilds",850,690],["wilds",1100,640],["wilds",1245,667],["wilds",1480,850],
 ["cave",1050,670],["cave",1425,650],["cave",1435,525]
]){
 ok(nav.canWalk(enemy[0],enemy[1],enemy[2],7),"placed enemies are on actual playable floor");
}
ok(/const APP_VERSION="1\.2\.[5-9]";/.test(contents.game),"Phase 4 combat still integrated");
ok(contents.game.includes('const SAVE="veilward-hollowreach-v01";'),"original save key preserved");
ok(contents.game.includes("combat.enemyStep(e,p,dt,window.VeilwardNav)"),"live loop uses combat timing");
ok(contents.game.includes("combat.swordCanHit(p,e,window.VeilwardNav)"),"live sword uses facing/LOS");
ok(contents.game.includes("combat.chooseSpellTarget(p,enemies[p.zone],window.VeilwardNav)"),"live spell obeys LOS");
ok(contents.game.includes("combat.projectileStep(b,dt,window.VeilwardNav,p.zone)"),"live projectiles are terrain-aware");
ok(contents.game.includes("drawEnemyTelegraph(g,e)"),"enemy attack telegraphs rendered");
ok(contents.game.includes('combat.stagger(e,.32)'),"sword staggers foes");
ok(contents.game.includes('combat.stagger(e,.48)'),"spell staggers foes");
ok(contents.game.includes('id,cost,cooling'),"action affordance state wired");
ok(contents.game.includes('else if(e.renderType==="player"){drawHero(g,e.x,e.y,0,e.step||0,"#637f96",false,"human",e.attackV||0)}'),"protected Wanderer renderer unchanged");
ok(contents.visual.includes('load("hero","hero_approved_8way_v12.webp"'),"approved hero asset unchanged");
ok(contents.visual.includes('load("warden","warden_hal_v13.png"'),"approved Warden Hal asset unchanged");
ok(contents.html.indexOf("combat.js?v=2")<contents.html.indexOf("game.js?v=21"),"combat script loaded before game");
for(const asset of ["combat.js?v=2","quest.js?v=1","world_geometry.js?v=1","terrain_art.js?v=1","world_stream.js?v=3","game.js?v=21","navigation.js?v=11","visual.js?v=33","visual.css?v=13","manifest.webmanifest?v=129"]){
 ok(contents.html.includes(asset)&&contents.worker.includes(asset),"PWA/HTML version aligned: "+asset);
}
ok(contents.worker.includes('veilward-hollowreach-v129-material-atlas'),"new mobile cache version");
console.log("Veilward Phase 4 PASS:",assertions,"combat assertions, enemy spawn checks and PWA/asset integrity");
