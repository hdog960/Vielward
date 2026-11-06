/* VEILWARD v1.3.1 — Phase 7 climate and biomes.
 * Deterministic continuous physical geography field. Samples WORLD coordinates,
 * not chunk-local positions, so transitions do not reset at render boundaries.
 * Climate paints terrain AND informs vegetation; physics remains authoritative.
 */
(function(){
"use strict";
const VERSION="1.3.1",CELL=96;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const PROFILES=Object.freeze({
 hollowreach:{snow:.96,wet:.24,pine:.76,forest:.18,meadow:0,wetland:0,rock:.18,arcane:0,canyon:0,road:0},
 northwatch:{snow:.98,wet:.12,pine:.38,forest:.04,meadow:0,wetland:0,rock:.86,arcane:0,canyon:0,road:0},
 coldpine:{snow:.91,wet:.27,pine:.96,forest:.22,meadow:0,wetland:0,rock:.48,arcane:0,canyon:0,road:0},
 frost_river:{snow:.82,wet:.72,pine:.43,forest:.14,meadow:0,wetland:.26,rock:.26,arcane:0,canyon:0,road:0},
 thawline:{snow:.50,wet:.57,pine:.62,forest:.49,meadow:.22,wetland:.12,rock:.24,arcane:0,canyon:0,road:0},
 greenwood:{snow:.045,wet:.62,pine:.24,forest:1,meadow:.22,wetland:.06,rock:.06,arcane:0,canyon:0,road:0},
 greenwood_falls:{snow:.035,wet:.86,pine:.19,forest:.83,meadow:.10,wetland:.32,rock:.31,arcane:0,canyon:0,road:0},
 mossmere:{snow:0,wet:.96,pine:.12,forest:.36,meadow:.35,wetland:1,rock:.03,arcane:0,canyon:0,road:0},
 heatherwood:{snow:.012,wet:.39,pine:.10,forest:.36,meadow:1,wetland:0,rock:.07,arcane:0,canyon:0,road:0},
 old_crown:{snow:.11,wet:.34,pine:.21,forest:.39,meadow:.28,wetland:0,rock:.29,arcane:0,canyon:0,road:.87},
 smugglers:{snow:.12,wet:.19,pine:.09,forest:.09,meadow:.09,wetland:0,rock:.94,arcane:0,canyon:.91,road:0},
 worldscar:{snow:.64,wet:.24,pine:.08,forest:.04,meadow:0,wetland:0,rock:.74,arcane:1,canyon:.13,road:0}
});
function hash(x,y,seed){let n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(seed|0,1442695041);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296}
function noise(x,y,seed){
 const gx=Math.floor(x),gy=Math.floor(y),fx=x-gx,fy=y-gy;
 const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
 const a=hash(gx,gy,seed),b=hash(gx+1,gy,seed),c=hash(gx,gy+1,seed),d=hash(gx+1,gy+1,seed);
 return(a+(b-a)*u)*(1-v)+(c+(d-c)*u)*v
}
function segDistance(x,y,a,b){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;
 const t=len?clamp(((x-a[0])*dx+(y-a[1])*dy)/len):0;
 return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t)
}
function create(model){
 if(!model||model.regions?.length!==12||!model.worldDesign?.worldUnitScale)throw Error("Climate requires the approved twelve-region blueprint");
 const unit=model.worldDesign.worldUnitScale;
 const regions=model.regions.map(r=>{
  const profile=PROFILES[r.id];if(!profile)throw Error("Climate missing region "+r.id);
  return {x:r.center[0],y:r.center[1],elevation:r.elevationBand||3,profile}
 });
 const banks=model.waterways.filter(w=>w.id!=="smugglers_chasm").flatMap(w=>{
  const lines=[...(w.centerline||[]),...(w.closedPolygon||[])];
  if(w.closedPolygon?.length)lines.push(w.closedPolygon[0]);
  return lines.slice(1).map((pt,i)=>[lines[i].map(v=>v*unit),pt.map(v=>v*unit)])
 });
 function sample(x,y){
  const px=x/unit,py=y/unit;
  let mass=0,elevation=0;
  const blend={snow:0,wet:0,pine:0,forest:0,meadow:0,wetland:0,rock:0,arcane:0,canyon:0,road:0};
  for(const r of regions){
   const d=Math.hypot(px-r.x,py-r.y);
   const weight=1/Math.pow(65+d,2.8);
   mass+=weight;elevation+=r.elevation*weight;
   for(const k in blend)blend[k]+=r.profile[k]*weight
  }
  for(const k in blend)blend[k]/=mass;
  elevation/=mass;
  const exposure=noise(x/5700,y/5200,73);
  const slope=noise(x/9800+11,y/8300-7,29);
  let nearWater=0;
  // Alpine river-to-lake shore influence fades over a physical 1,250-unit belt,
  // with no artificial river/forest scene boundary.
  for(const [a,b] of banks){
   const d=segDistance(x,y,a,b);
   if(d<1250)nearWater=Math.max(nearWater,(1-d/1250)**2)
  }
  const snow=clamp(blend.snow+(elevation-3)*.022+(exposure-.5)*.085+(slope-.5)*.035-nearWater*.035);
  const wet=clamp(blend.wet+nearWater*.31+(noise(x/4300,y/4700,91)-.5)*.075);
  return {snow,wet,elevation,exposure,waterInfluence:nearWater,
   pine:clamp(blend.pine+snow*.07),forest:blend.forest,
   meadow:blend.meadow,wetland:blend.wetland,rock:blend.rock,
   arcane:blend.arcane,canyon:blend.canyon,road:blend.road}
 }
 function groundMaterial(x,y){
  const c=sample(x,y);
  const gx=Math.floor(x/CELL),gy=Math.floor(y/CELL);
  const n=hash(gx,gy,82),patch=noise(x/2300,y/2200,44);
  // Worldscar remains a cold, high-elevation magic outcrop, even in the east.
  if(c.arcane>.48&&n<.88-c.snow*.18)return "arcane";
  if(c.canyon>.55&&n<.72)return "cliff";
  if(c.rock>.63&&c.snow>.62&&n<.55)return "frost";
  if(c.wetland>.48&&c.snow<.20&&n<.84)return "wetland";
  if(c.snow>.85)return c.rock>.52&&n<.4?"frost":"snow";
  if(c.snow>.46){
   if(n<c.snow-.23+patch*.09)return "snow";
   if(c.rock>.52&&n>.84)return "frost";
   return c.wet>.77&&n>.7?"moss":"thaw"
  }
  if(c.snow>.17){
   if(n<c.snow*.75)return "thaw";
   if(c.wet>.66&&n>.55)return "moss";
   return c.meadow>.55&&n>.52?"grass":"forest"
  }
  if(c.wet>.72)return c.wetland>.30&&n<.64?"wetland":"moss";
  if(c.road>.46&&n<.39)return "road";
  if(c.meadow>.58)return n<.80?"grass":"forest";
  if(c.rock>.58&&n>.68)return "stone";
  return c.forest>.27?"forest":c.meadow>.20?"grass":c.wet>.51?"moss":"thaw"
 }
 function stats(){return{version:VERSION,profiles:Object.keys(PROFILES).length,globalCell:CELL,waterBankSegments:banks.length,continuous:true}}
 return{version:VERSION,profiles:PROFILES,sample,groundMaterial,stats}
}
window.VeilwardClimate={version:VERSION,create,profiles:PROFILES};
})();