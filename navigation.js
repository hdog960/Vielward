/* VEILWARD: Hollowreach scene navigation v0.7 — photographed-floor collision authoring.
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
// Source-image polygons are drawn in exact 900×584 pixel coordinates.
const zones={
 village:{
  // v1.2.4: traced directly against current 900×584 village_v06_clear.jpg.
  // NO legacy 707×530 rescale. Regions represent actual snow / bridge wood,
  // never the painted river, raised fence, or cliff face.
  ground:[
   // Broad snow clearing surrounding Joren, Warden Hal and Ash
   [[381,280],[396,248],[439,217],[481,199],[524,199],
    [571,213],[614,240],[653,264],[664,292],[653,317],
    [611,343],[557,370],[482,378],[429,360],[390,326]],
   // Cabin entrance and the smith's walk-up
   [[383,275],[393,241],[411,230],[444,229],[471,243],[471,284]],
   // Narrow stone staircase curving to the eastern shrine
   [[586,264],[604,245],[623,219],[642,204],[663,185],
    [693,173],[709,183],[712,198],[691,218],[666,238],[628,279]],
   // Small actual snow forecourt by the monument, excluding the plinth
   [[693,177],[707,149],[726,138],[756,145],[771,165],
    [747,185],[715,197]],
   // The snow-covered north abutment of the wooden river bridge
   [[387,332],[419,335],[450,357],[472,380],[451,398],[418,391]],
   // Sloping bridge DECK only (rails and lantern posts are not floor)
   [[278,404],[385,350],[430,359],[461,380],[447,408],
    [350,457],[286,432]],
   // Southwest bank, snow path after the bridge; river is to the northeast
   [[160,463],[237,425],[284,419],[337,451],[380,479],
    [421,508],[453,552],[444,584],[128,584],[127,536]],
   // Entrance to the last section of the snow trail
   [[311,464],[357,463],[396,494],[427,531],[419,566],[335,552]]
  ],
  solids:[
   // Cabin / upper plateau remains inaccessible, including its fence
   [[0,0],[433,0],[440,174],[398,213],[351,231],[246,223],[0,244]],
   // Deep icy river and steep western waterfall wall
   [[0,214],[172,217],[290,260],[369,289],[379,334],[339,366],
    [237,383],[126,385],[0,376]],
   // Upper fenced ledge in screenshot: the Wanderer must NOT stand on posts
   [[548,98],[603,94],[648,120],[653,170],[620,190],[586,183],[568,158]],
   // Stone marker and its plinth
   [[707,30],[764,17],[800,47],[803,137],[779,159],[725,134]],
   // Snow ridge to the right, cliff / river edge
   [[720,185],[900,170],[900,402],[854,405],[797,359],
    [710,345],[661,318],[673,274]],
   // Main water channel SOUTH of clearing (screenshot river-foot failure)
   [[472,382],[558,358],[679,363],[792,395],[900,396],
    [900,504],[799,533],[684,525],[561,487],[500,461],[469,442]]
  ],
  starts:[[925,620],[885,520],[780,1070]],
  worldExit:[790,1090]
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
  // Trail zones use the source painting's native 900×584 coordinates.
  ground:[
   // West bank: the flowers and dirt paths, NOT the waterfall
   [[0,341],[95,329],[159,351],[216,380],[273,410],
    [337,431],[397,470],[417,510],[394,584],[0,584]],
   // Actual wooden bridge planks; tight enough to exclude the raised rail
   // at native x≈524,y≈409 shown in the failed player screenshot.
   [[371,468],[438,445],[521,419],[593,398],[662,377],
    [684,375],[712,399],[699,423],[658,440],[592,463],
    [519,480],[441,501],[389,521]],
   // East bank, clearing with signpost and cave entry
   [[646,366],[688,328],[744,284],[814,285],[900,301],
    [900,427],[847,439],[756,436],[690,432],[661,409]],
   // Middle forest trail / flower meadow to the shrine
   [[374,308],[439,274],[520,250],[591,233],[668,228],
    [728,241],[761,276],[733,310],[675,331],
    [614,354],[551,378],[468,396],[411,374]],
   // Stone steps up to the illuminated ancient door
   [[491,273],[522,217],[559,169],[615,156],[663,185],
    [683,231],[620,265],[560,279]],
   // Upper ruin forecourt (door / walls remain solid)
   [[612,157],[658,141],[728,127],[836,125],[894,157],
    [900,226],[855,256],[768,251],[691,234],[650,207]]
  ],
  solids:[
   // Actual waterfall and wet rock edge
   [[168,253],[318,261],[379,341],[361,395],[228,376],[170,350]],
   // The ancient door, vertical stone arch and impassable upright wall
   [[697,7],[866,0],[898,133],[695,143]],
   // Carved left railing / lamp stands crossing bridge footprint are solid
   [[380,421],[414,407],[435,420],[421,444],[391,461]],
   // High fence/torch assembly near eastern bridge landing
   [[650,362],[663,353],[675,381],[662,397],[650,392]]
  ],
  starts:[[735,991],[1644,737],[1190,714]]
 },
 cave:{
  // Source art is native 900×584. Two real painted bridges connect the
  // outer mouth to the stone landing and up to the Worldscar sanctuary.
  ground:[
   // Lower rope bridge: plank deck, no post tops / ropes
   [[0,352],[102,341],[184,365],[268,394],[323,413],
    [312,444],[241,436],[149,409],[57,391],[0,395]],
   // Connector between bridge end and central cavern stone floor.
   // Former 232..402 polygon wrongly allowed standing on the lantern.
   [[285,414],[327,386],[360,350],[397,326],[431,324],
    [450,348],[407,388],[365,415],[325,437],[296,435]],
   // Full central stone plateau, tightly following the void boundary
   [[333,293],[383,272],[455,260],[523,255],[596,266],
    [651,269],[705,298],[719,334],[684,367],[633,390],
    [567,369],[495,355],[431,375],[378,365],[346,338]],
   // Real stone stair treads climbing the right-hand ridge
   [[554,280],[580,236],[618,202],[654,202],[703,226],
    [738,251],[719,274],[674,244],[643,226],
    [608,255],[583,297]],
   // Upper ritual court, excluding upright pylon and abyss
   [[610,171],[649,144],[699,128],[766,124],[857,129],
    [900,159],[900,230],[831,262],[751,245],[678,226]]
  ],
  solids:[
   // Left cliff / black chasm under the ledge
   [[0,203],[215,208],[298,321],[251,365],[0,317]],
   // Raised upper stone pillar; bottom face does NOT slice stairway
   [[730,102],[790,91],[795,211],[740,224]],
   // The large lantern/bridge-post visible in screenshot, not a platform
   [[294,301],[319,301],[329,355],[309,376],[285,358]],
   // Central brink on the lower-right side — sharp drop into void
   [[533,380],[599,387],[650,411],[674,449],[608,467],[551,442]]
  ],
  starts:[[775,741],[170,795],[888,689]]
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
 if(canWalk(zone,x,y,8))return{x,y};
 const z=zones[zone];if(!z)return{x:900,y:625};
 let best=null,d=Infinity;
 // Always relocate from an old save or obstruction to the closest safe
 // playable floor. Searches in expanding radius before defaulting.
 for(let r=15;r<=500;r+=15){
  for(let k=0;k<32;k++){
   const a=2*Math.PI*k/32,nx=x+Math.cos(a)*r,ny=y+Math.sin(a)*r;
   if(canWalk(zone,nx,ny,8)){const dd=(nx-x)**2+(ny-y)**2;if(dd<d){best={x:nx,y:ny};d=dd}}
  }
  if(best)return best;
 }
 for(const [sx,sy]of z.starts){if(canWalk(zone,sx,sy,8))return{x:sx,y:sy}}
 // Last-resort search the center of valid ground in the whole map.
 for(let yy=150;yy<1150;yy+=15)for(let xx=150;xx<1800;xx+=15)
  if(canWalk(zone,xx,yy,8))return{x:xx,y:yy};
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
window.VeilwardNav={canWalk,safePoint,projectMotion,drawDebug,zones,version:'0.7.0'};
})();