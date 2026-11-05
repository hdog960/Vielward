/* VEILWARD v1.2.5 — readable and fair melee, magic, and enemy attacks.
 * Pure combat rules are deliberately separate from scene/character art.
 */
(function(){
"use strict";
const RULES=Object.freeze({
 wolf:Object.freeze({range:59,wind:.72,cooldown:1.85,damage:11,chase:320,speed:92,arc:.56}),
 bandit:Object.freeze({range:67,wind:.88,cooldown:2.05,damage:14,chase:335,speed:73,arc:.54}),
 wraith:Object.freeze({range:72,wind:1.00,cooldown:2.3,damage:19,chase:325,speed:63,arc:.50})
});
const MELEE=Object.freeze({range:88,arc:.43,stamina:12});
const SPELL=Object.freeze({mana:16,range:330,speed:360});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function unit(x,y){
 const size=Math.hypot(x,y)||1;
 return {x:x/size,y:y/size};
}
function clearLine(nav,zone,a,b,radius=3){
 if(!nav||typeof nav.canWalk!=="function")return true;
 const d=dist(a,b),n=Math.max(1,Math.ceil(d/12));
 for(let i=0;i<=n;i++){
  const t=i/n;
  if(!nav.canWalk(zone,a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,radius))
   return false;
 }
 return true;
}
function forwardArc(origin,target,facing,cosine){
 const dx=target.x-origin.x,dy=target.y-origin.y,d=Math.hypot(dx,dy);
 if(d<.001)return true;
 const face=unit(facing?.x??0,facing?.y??1);
 return (dx*face.x+dy*face.y)/d>=cosine;
}
function swordCanHit(player,enemy,nav){
 if(!enemy||enemy.dead||dist(player,enemy)>MELEE.range)return false;
 return forwardArc(player,enemy,player.facing||{x:0,y:1},MELEE.arc)&&
        clearLine(nav,player.zone,player,enemy,3);
}
function chooseSpellTarget(player,enemies,nav){
 return (enemies||[]).filter(e=>!e.dead&&dist(player,e)<=SPELL.range&&
  forwardArc(player,e,player.facing||{x:0,y:1},.34)&&
  clearLine(nav,player.zone,player,e,3))
  .sort((a,b)=>dist(a,player)-dist(b,player))[0]||null;
}
function stagger(enemy,seconds){
 enemy.stun=Math.max(enemy.stun||0,seconds);
 enemy.wind=0;
 enemy.aim=null;
}
function rule(type){return RULES[type]||RULES.wolf}
function canLand(enemy,player,nav){
 const r=rule(enemy.type);
 if(enemy.dead||enemy.stun>0||dist(enemy,player)>r.range||!enemy.aim)return false;
 return forwardArc(enemy,player,enemy.aim,r.arc)&&
  clearLine(nav,enemy.zone,enemy,player,4);
}
function enemyStep(enemy,player,dt,nav){
 const r=rule(enemy.type);
 const zone=enemy.zone;
 if(enemy.dead)return {damage:0,phase:"dead"};
 enemy.atk=Math.max(0,(enemy.atk||0)-dt);
 if(enemy.stun>0){
  enemy.stun=Math.max(0,enemy.stun-dt);
  enemy.wind=0;enemy.aim=null;
  return {damage:0,phase:"stunned"};
 }
 if(enemy.wind>0){
  enemy.wind=Math.max(0,enemy.wind-dt);
  if(enemy.wind>0)return {damage:0,phase:"warning"};
  const hit=canLand(enemy,player,nav);
  enemy.aim=null;
  return {damage:hit?r.damage:0,phase:hit?"hit":"miss"};
 }
 const d=dist(enemy,player);
 // A foe cannot announce an attack, or instantly hit, across a stone wall,
 // cliff railing, impassable shrub or chasm.
 const sight=d<r.chase&&clearLine(nav,zone,enemy,player,4);
 if(d<=r.range&&enemy.atk<=0&&sight){
  enemy.aim=unit(player.x-enemy.x,player.y-enemy.y);
  enemy.wind=r.wind;
  enemy.atk=r.cooldown;
  return {damage:0,phase:"windup"};
 }
 if(d<r.chase&&d>r.range*.76&&sight){
  const dir=unit(player.x-enemy.x,player.y-enemy.y);
  const dx=dir.x*r.speed*dt,dy=dir.y*r.speed*dt;
  let next=null;
  if(nav&&typeof nav.projectMotion==="function"){
   next=nav.projectMotion(zone,enemy.x,enemy.y,dx,dy,7);
  }else if(!nav){
   next={x:enemy.x+dx,y:enemy.y+dy};
  }
  if(next){
   const moved=dist(enemy,next);
   enemy.x=next.x;enemy.y=next.y;
   if(moved>.01)enemy.step=(enemy.step||0)+moved/90;
  }
  return {damage:0,phase:"chase"};
 }
 return {damage:0,phase:"idle"};
}
function projectileStep(b,dt,nav,zone){
 // Visual orb y is above the caster's feet. Terrain checks use foot y.
 const length=Math.hypot(b.vx,b.vy)*dt;
 const count=Math.max(1,Math.ceil(length/10));
 for(let i=0;i<count;i++){
  const x=b.x+b.vx*dt/count,y=b.y+b.vy*dt/count;
  if(nav?.canWalk&&!nav.canWalk(zone,x,y+26,3)){
   b.age=10;b.blocked=true;
   return false;
  }
  b.x=x;b.y=y;
 }
 b.age+=dt;
 return b.age<1.4;
}
window.VeilwardCombat={
 RULES,MELEE,SPELL,unit,dist,clearLine,forwardArc,
 swordCanHit,chooseSpellTarget,stagger,canLand,enemyStep,projectileStep,
 version:"1.2.5"
};
})();
