/* Veilward v1.2.6 — permanent introductory-quest state.
 * Inventory quantities are NOT the same as whether a world pickup was used.
 * Pure functions: testable without rendering, network or localStorage.
 */
(function(){
"use strict";
const HERB_IDS=["blueleaf-west","blueleaf-east"];
const has=(set,key)=>Array.isArray(set)&&set.includes(key);
function foeId(e){
 return [e.zone,e.type,e.homeX??e.x,e.homeY??e.y].join(":");
}
function migrate(p){
 if(!Array.isArray(p.herbHarvested)||(p.herbHarvested.length===0&&p.herbs>0)){
  // load() merges DEFAULT into legacy saves before migrate(), so the
  // freshly added field may already be [] even if this was a v1.2.5 save.
  p.herbHarvested=HERB_IDS.slice(0,Math.max(0,Math.min(HERB_IDS.length,Number(p.herbs)||0)));
 }else p.herbHarvested=[...new Set(p.herbHarvested.filter(id=>HERB_IDS.includes(id)))];
 if(!Array.isArray(p.defeatedEnemies))p.defeatedEnemies=[];
 else p.defeatedEnemies=[...new Set(p.defeatedEnemies.filter(id=>typeof id==="string"&&id.length<100))];
 p.suppliesRecovered=!!(p.suppliesRecovered||p.supplies||p.loot||p.quest>=3);
 if(typeof p.suppliesDelivered!=="boolean")p.suppliesDelivered=p.quest>=4;
 if(p.suppliesDelivered||p.quest>=4){
  p.suppliesRecovered=true;p.suppliesDelivered=true;
  p.supplies=false; // no ghost supply item after the hand-in
 }else if(p.quest===3&&p.suppliesRecovered){
  // Legacy stage-3 saves may lack the inventory boolean even though the
  // journal already says to deliver the recovered crate.
  p.supplies=true;
 }
 p.caveBanditCleared=!!(p.caveBanditCleared||p.quest>=3||
  p.defeatedEnemies.some(id=>id.startsWith("cave:bandit:")));
 p.scarAttuned=!!(p.scarAttuned||p.quest>=5);
 p.herbs=Math.max(0,Math.floor(Number(p.herbs)||0));
 p.questVersion=1;
 return p;
}
function sync(p,objects,enemies){
 for(const o of objects){
  if(o.type==="herb")o.taken=has(p.herbHarvested,o.id);
  else if(o.type==="chest")o.taken=!!p.suppliesRecovered;
 }
 for(const [zone,foes] of Object.entries(enemies)){
  for(const e of foes){
   // Current saves preserve precisely which raider was defeated. Legacy
   // quest-3+ saves had no enemy identifiers and previously cleared both.
   const legacyClearedCave=zone==="cave"&&e.type==="bandit"&&p.quest>=3&&
    !p.defeatedEnemies.some(id=>id.startsWith("cave:bandit:"));
   e.dead=has(p.defeatedEnemies,foeId(e))||legacyClearedCave;
  }
 }
}
function begin(p){if(p.quest!==0)return false;p.quest=1;return true}
function enterForest(p){if(p.quest!==1)return false;p.quest=2;return true}
function recordDefeat(p,enemy){
 const id=foeId(enemy);
 if(!has(p.defeatedEnemies,id))p.defeatedEnemies.push(id);
 if(enemy.zone==="cave"&&enemy.type==="bandit")p.caveBanditCleared=true;
}
function chestState(p){
 if(p.suppliesRecovered||p.suppliesDelivered)return "opened";
 if(p.quest<2)return "unassigned";
 if(!p.caveBanditCleared)return "guarded";
 return "ready";
}
function takeSupplies(p){
 if(chestState(p)!=="ready")return false;
 p.supplies=true;p.suppliesRecovered=true;p.quest=3;
 p.gold+=30;return true;
}
function handIn(p){
 if(p.quest!==3||!p.supplies||p.suppliesDelivered)return false;
 p.supplies=false;p.suppliesRecovered=true;p.suppliesDelivered=true;
 p.quest=p.scarAttuned?5:4;
 p.gold+=80;return true;
}
function harvest(p,id){
 if(!HERB_IDS.includes(id)||has(p.herbHarvested,id))return false;
 p.herbHarvested.push(id);p.herbs++;return true;
}
function herbTrade(p){
 if(p.herbs<2)return false;
 p.herbs-=2;p.potions++;return true;
}
function attune(p){
 if(p.scarAttuned)return false;
 p.scarAttuned=true;p.mp=p.mpMax;
 if(p.quest===4)p.quest=5;
 return true;
}
function hasSword(p){return p.weapon==="Tempered Steel Sword"}
function buySword(p){
 if(hasSword(p)||p.gold<65)return false;
 p.gold-=65;p.weapon="Tempered Steel Sword";return true;
}
function summary(p){
 return {
  suppliesRecovered:!!p.suppliesRecovered,
  suppliesDelivered:!!p.suppliesDelivered,
  caveBanditCleared:!!p.caveBanditCleared,
  herbsHarvested:p.herbHarvested.length,
  herbsInBag:p.herbs,
  scarAttuned:!!p.scarAttuned,
  enemiesDefeated:p.defeatedEnemies.length
 };
}
window.VeilwardQuest={
 HERB_IDS,foeId,migrate,sync,begin,enterForest,recordDefeat,
 chestState,takeSupplies,handIn,harvest,herbTrade,attune,
 hasSword,buySword,summary,version:"1.2.6"
};
})();