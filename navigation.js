/* VEILWARD: Hollowreach scene navigation v0.3.
 * The illustration is scenery, NOT traversable geometry. Authored playable
 * ground polygons at native scene reference resolution 900x584; internally
 * converted to world coordinates (1850x1200).
 *
 * All movement, teleports, enemy pursuit and interaction positions use the
 * SAME navigation test. No "walk over furniture" or through cliff faces.
 */
(function(){
"use strict";
const W=1850/900,H=1200/584;
const v=pts=>pts.map(([x,y])=>[x*900/707,y*584/530]);
const zones={
 village:{
  // Native Golden-reference artwork: 707×530 pixels, scaled into 900×584
  // navigation coordinates; one coherent walkable network around hut,
  // bridge, shoreline and hillside steps.
  ground:[
   ...[
    // Cabin steps and front approach
    [[286,175],[317,171],[348,196],[357,239],[323,268],[282,252]],
    // Center snow clearing, main quest/NPC courtyard
    [[288,218],[385,188],[478,193],[550,218],[572,262],[572,317],[505,347],[443,341],[382,358],[316,322],[274,280]],
    // Narrow access up the real staircase to the shrine
    [[457,202],[468,173],[489,144],[515,127],[541,130],[557,157],[541,188],[513,212],[483,233]],
    // Descending road toward wooden bridge
    [[265,290],[322,301],[379,339],[390,381],[370,408],[289,401],[219,369],[211,337]],
    // Lower shore footpath, physical bridge landing and exit
    [[245,375],[339,377],[415,407],[484,449],[494,530],[243,530],[192,485],[195,430]],
    // Riverside camp trail, keeping away from open water
    [[425,397],[502,408],[558,422],[618,448],[638,509],[604,529],[490,529],[455,480]]
   ].map(v),
  ],
  solids:[
   // Icy riverbank left of the courtyard, cliff-top cabin and shrub walls
   v([[0,204],[239,206],[291,248],[283,317],[226,335],[0,361]]),
   v([[0,0],[316,0],[337,161],[303,181],[235,198],[0,191]]),
   // Upper rock walls and shrine plinth, excluding the actual staircase
   v([[375,0],[707,0],[707,214],[590,225],[550,186],[534,124],[468,147],[415,182]])
  ],
  starts:[[925,620],[870,524],[1070,1090]],
  worldExit:[1070,1090]
 },
 forge:{
  ground:[
   // Walkable workshop floor. Everything else is a wall, loft, bench or table.
   [[210,367],[251,329],[304,303],[356,283],[416,255],[485,253],[539,268],[553,303],[534,341],[517,369],[565,379],[641,388],[702,416],[716,464],[703,519],[664,582],[401,582],[393,522],[297,502],[243,464],[211,433]]
  ],
  solids:[
   // Foreground crafting desk: never allow standing on its surface.
   [[0,416],[398,411],[421,502],[414,584],[0,584]],
   // Active forge, standing blacksmith and anvil.
   [[546,285],[672,274],[714,396],[556,413]],
   // Tools and ore bins near the southern right wall.
   [[686,431],[899,419],[899,584],[699,584],[682,527]],
   // Staircase to nonplayable loft.
   [[0,176],[197,113],[242,317],[214,447],[0,447]]
  ],
  starts:[[900,794],[896,1036]]
 },
 wilds:{
  ground:[
   // West bank / forest floor.
   [[0,343],[100,331],[165,349],[208,375],[244,415],[324,427],[376,449],[439,490],[459,549],[432,584],[0,584]],
   // Low wooden bridge over fast-flowing water.
   [[378,427],[444,401],[636,371],[688,373],[713,421],[675,448],[474,517],[406,468]],
   // Eastern bank and signpost / cave-route approach.
   [[617,338],[672,295],[714,279],[760,282],[818,296],[899,302],[899,417],[848,439],[755,445],[682,449],[651,407]],
   // Long forest trail toward the shrine.
   [[377,296],[435,253],[526,234],[592,227],[669,222],[731,233],[764,269],[727,322],[675,336],[606,366],[546,382],[474,404],[416,370]],
   // Stone steps connecting low trail to the higher shrine.
   [[484,261],[512,200],[569,146],[616,149],[665,183],[677,230],[615,265],[551,275]],
   // Shrine forecourt only, not the arch and walls themselves.
   [[617,160],[671,141],[826,125],[896,160],[898,231],[858,254],[772,249],[698,231],[663,223]]
  ],
  solids:[
   // Animated water, waterfall and steep left bank.
   [[168,254],[318,267],[377,342],[358,389],[231,373],[174,347]],
   // Shrine door, arch and decorative dais.
   [[698,13],[868,4],[893,139],[696,143]]
  ],
  starts:[[735,991],[1644,737],[1190,714]]
 },
 cave:{
  ground:[
   // Southern rope bridge from outside.
   [[0,343],[156,337],[345,399],[385,438],[346,467],[151,425],[0,413]],
   // Join the southern rope bridge to the central stone floor.
   [[232,343],[298,320],[372,331],[402,373],[394,423],[321,414],[239,387]],
   // Stable central cavern platform.
   [[289,287],[363,254],[457,247],[537,260],[626,263],[706,292],[737,340],[734,376],[685,420],[621,424],[556,389],[491,381],[426,406],[357,393],[302,357]],
   // Narrow treaded rise connecting center platform and stone steps.
   [[541,244],[604,211],[695,220],[750,265],[737,310],[645,325],[569,304]],
   // Stone stairway to the Veil rupture.
   [[553,269],[577,215],[636,174],[700,197],[750,244],[736,297],[668,322],[596,309]],
   // Raised shrine landing.
   [[614,155],[667,128],[864,128],[899,155],[899,252],[833,272],[749,253],[681,231]]
  ],
  solids:[
   // Cliff faces and open chasms.
   [[0,201],[215,211],[297,331],[252,365],[0,315]],
   // Tall carved stone pylon.
   [[730,102],[790,91],[804,272],[741,265]]
  ],
  starts:[[775,741],[344,786],[888,689]]
 }
};
function inside(px,py,polygon){
 let hit=false;
 for(let a=0,b=polygon.length-1;a<polygon.length;b=a++){
  const p=polygon[a],q=polygon[b];
  if(((p[1]>py)!==(q[1]>py))&&(px<(q[0]-p[0])*(py-p[1])/(q[1]-p[1])+p[0]))hit=!hit;
 }
 return hit;
}
function ground(zone,x,y){
 const z=zones[zone];if(!z)return false;
 const px=x/W,py=y/H;
 if(px<0||py<0||px>900||py>584)return false;
 let pass=false;
 for(const poly of z.ground){if(inside(px,py,poly)){pass=true;break}}
 if(!pass)return false;
 for(const poly of z.solids){if(inside(px,py,poly))return false}
 return true;
}
function canWalk(zone,x,y,radius=8){
 if(!ground(zone,x,y))return false;
 const r=radius||0;
 if(r<=1)return true;
 // Center + feet-focused safety. Restricts walking off edges.
 for(const [dx,dy] of [[-r,0],[r,0],[0,-r],[0,r]]){
  if(!ground(zone,x+dx,y+dy))return false;
 }
 return true;
}
function safePoint(zone,x,y){
 if(canWalk(zone,x,y,6))return{x,y};
 const z=zones[zone];if(!z)return{x:900,y:625};
 let best=null,d=Infinity;
 // Always relocate from an old save or obstruction to the closest safe
 // playable floor. Searches in expanding radius before defaulting.
 for(let r=15;r<=500;r+=15){
  for(let k=0;k<32;k++){
   const a=2*Math.PI*k/32,nx=x+Math.cos(a)*r,ny=y+Math.sin(a)*r;
   if(canWalk(zone,nx,ny,6)){const dd=(nx-x)**2+(ny-y)**2;if(dd<d){best={x:nx,y:ny};d=dd}}
  }
  if(best)return best;
 }
 for(const [sx,sy]of z.starts){if(canWalk(zone,sx,sy,6))return{x:sx,y:sy}}
 // Last-resort search the center of valid ground in the whole map.
 for(let yy=150;yy<1150;yy+=15)for(let xx=150;xx<1800;xx+=15)
  if(canWalk(zone,xx,yy,4))return{x:xx,y:yy};
 return {x:900,y:625};
}
function projectMotion(zone,x,y,dx,dy,radius=8){
 // Substeps prevent dashing through narrow obstacles and shallow walls.
 const count=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/12));
 const sx=dx/count,sy=dy/count;
 for(let i=0;i<count;i++){
  if(canWalk(zone,x+sx,y+sy,radius)){x+=sx;y+=sy;continue}
  // Real sliding around edges instead of teleporting / freezing.
  if(canWalk(zone,x+sx,y,radius))x+=sx;
  if(canWalk(zone,x,y+sy,radius))y+=sy;
 }
 return {x,y};
}
function drawDebug(ctx,zone){const z=zones[zone];if(!z)return;ctx.save();ctx.scale(W,H);
 for(const [list,col] of [[z.ground,'#37ed5a44'],[z.solids,'#fb244a99']]){
  for(const a of list){ctx.beginPath();ctx.moveTo(...a[0]);for(const pt of a.slice(1))ctx.lineTo(...pt);ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.strokeStyle='#ffeeaa';ctx.lineWidth=.9;ctx.stroke()}
 }ctx.restore()}
window.VeilwardNav={canWalk,safePoint,projectMotion,drawDebug,zones,version:'0.5.0'};
})();