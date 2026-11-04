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
const zones={
 village:{
  ground:[
   // Village courtyard — keep to snow paths below the terraces.
   [[224,320],[265,286],[305,253],[331,235],[368,226],[409,208],[482,211],[539,199],[604,206],[652,222],[688,243],[712,268],[717,312],[671,338],[633,363],[586,387],[532,399],[488,393],[451,381],[417,387],[376,398],[331,397],[301,376],[258,360]],
   // Lower snow lane, along the notice board and fishing path.
   [[0,346],[83,341],[151,344],[203,326],[251,329],[281,362],[323,386],[316,414],[274,437],[221,451],[165,465],[94,456],[0,451]],
   // Short link from plaza to the bridge approach.
   [[445,378],[496,378],[558,395],[592,433],[543,449],[483,427]],
   // Wooden bridge crossing water and a sheer cliff. Cross only on the deck.
   [[491,387],[540,370],[728,466],[748,499],[712,528],[531,432]],
   // Eastern approach & arrival for woodland travel.
   [[705,469],[756,465],[819,474],[899,461],[899,548],[826,550],[755,542],[710,525]]
  ],
  solids:[
   [[134,222],[241,214],[266,308],[242,341],[139,337]],
   // steps and front fence are visual barriers except the center landing
   [[280,161],[313,156],[333,208],[297,224]]
  ],
  starts:[[900,625],[1315,602],[1555,1044]],
  worldExit:[1555,1044]
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
window.VeilwardNav={canWalk,safePoint,projectMotion,drawDebug,zones,version:'0.3.0'};
})();