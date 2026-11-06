/* VEILWARD 1.3.2 — Phase 8 full-road and crossing production.
 * Uses the authoritative world_geometry.js roads for drawing, rail collision,
 * landings and junctions. No duplicate guessed path points or scene teleports.
 */
(function(){
"use strict";
const VERSION="1.3.11",TAU=Math.PI*2;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const palettes={
 alpine:{rim:"#687c8a",bed:"#adafa8",center:"#d7d6c7",shade:"#62758a",detail:"#f0e8d4"},
 melt:{rim:"#59665d",bed:"#9c9b85",center:"#b5aea0",shade:"#65655a",detail:"#cbd2b8"},
 woodland:{rim:"#4c6252",bed:"#8b8169",center:"#ae9a76",shade:"#576c58",detail:"#e0ce9e"},
 wetland:{rim:"#3e5b5b",bed:"#849483",center:"#b1ada0",shade:"#536e68",detail:"#c9d4b9"},
 upland:{rim:"#55566b",bed:"#8e8b98",center:"#b3aabb",shade:"#4a5262",detail:"#d6cad3"}
};
const deckTypes={
 wooden:{bed:"#b38f70",dark:"#483f43",trim:"#d0ad88",rail:"#af927c",joint:"#514344",spacing:37,kind:"planks"},
 "stone-and-timber":{bed:"#adb0a9",dark:"#454954",trim:"#d5d3c3",rail:"#887968",joint:"#6d6765",spacing:45,kind:"flagstone"},
 "stone-footbridge":{bed:"#b0b4ad",dark:"#515964",trim:"#d5dbce",rail:"#b3b3a9",joint:"#717775",spacing:48,kind:"flagstone"},
 "wood-and-rope":{bed:"#987c64",dark:"#453c3f",trim:"#c6a788",rail:"#bfaa83",joint:"#494047",spacing:34,kind:"planks"},
 "timber-rope":{bed:"#846753",dark:"#3d3741",trim:"#bb9979",rail:"#c2ad8b",joint:"#453f45",spacing:35,kind:"planks"},
 "raised stepped stones":{bed:"#9fa49d",dark:"#4e6665",trim:"#d1d0bd",rail:null,joint:"#62756f",spacing:54,kind:"ford"},
 stone:{bed:"#a1a9a0",dark:"#58625d",trim:"#c2cec4",rail:null,joint:"#748178",spacing:54,kind:"causeway"}
};
function hash(x,y,k=0){let n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(k|0,1442695041);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296}
function line(ctx,points){ctx.beginPath();for(let i=0;i<points.length;i++)i?ctx.lineTo(points[i][0],points[i][1]):ctx.moveTo(points[i][0],points[i][1])}
function segment(ctx,a,b,color,width){ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
function closeTo(bounds,a,b,pad){
 return Math.max(a[0],b[0])+pad>=bounds[0]&&Math.min(a[0],b[0])-pad<=bounds[2]&&
 Math.max(a[1],b[1])+pad>=bounds[1]&&Math.min(a[1],b[1])-pad<=bounds[3]
}
function create(model,geometry,options={}){
 if(!geometry||geometry.roads.length!==65||geometry.roads.filter(e=>e.crossing).length!==7)
  throw Error("Phase 8 requires the existing full physical 65-road / 7-crossing map");
 const roads=geometry.roads,climate=options.climate||null,raster=options.raster||null;
 const nodes=Object.fromEntries(model.nodes.map(n=>[n.id,n]));
 const degree=new Map(model.nodes.map(n=>[n.id,0]));
 for(const e of roads){degree.set(e.from,degree.get(e.from)+1);degree.set(e.to,degree.get(e.to)+1)}
 const crossings=roads.filter(e=>e.crossing).map(e=>({
  id:e.id,name:e.crossing.replace(/_/g," "),kind:e.kind,deck:e.deck,
  start:e.from,end:e.to,waterway:e.waterway,halfWidth:e.halfWidth
 }));
 const categorized={bridges:crossings.filter(c=>c.kind==="bridge").length,
  fords:crossings.filter(c=>c.kind==="ford").length,
  causeways:crossings.filter(c=>c.kind==="causeway").length,
  stairs:roads.filter(e=>e.kind==="stairs"||e.slope==="stairs").length,
  switchbacks:roads.filter(e=>e.kind==="switchback"||e.slope==="switchback").length,
  roads:roads.length,crossings:crossings.length,terminals:[...degree].filter(([,d])=>d===1).map(([id])=>id)
 };
 function nearestRoad(x,y){return geometry.nearRoad(x,y,()=>true,0)}
 function edgeGuard(x,y,r=10){
  // The same rail offsets that are actually painted are unwalkable.
  // Open 7% of either approach before the rail begins to avoid blocked landings.
  for(const e of roads){
   if(!e.crossing||e.kind!=="bridge")continue;
   const rail=e.halfWidth*.87;
   for(const [a,b,prior,len] of e.parts){
    const hit=window.VeilwardGeometry.closest(x,y,a,b);
    const t=e.total?(prior+hit.t*len)/e.total:.5;
    if(t<=.07||t>=.93)continue;
    if(Math.abs(hit.d-rail)<=r+7)return true
   }
  }
  return false
 }
 function palette(x,y){
  if(!climate)return palettes.woodland;
  const c=climate.sample(x,y);
  if(c.arcane>.48||c.rock>.68&&c.snow>.25)return palettes.upland;
  if(c.snow>.63)return palettes.alpine;
  if(c.wet>.72)return palettes.wetland;
  if(c.snow>.26)return palettes.melt;
  return palettes.woodland
 }
 function strokePath(ctx,path,color,width){
  line(ctx,path);ctx.strokeStyle=color;ctx.lineWidth=width;
  ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke()
 }
 function ribbon(ctx,e,bounds){
  if(raster?.paintedRoad(ctx,e))return;
  const first=e.path[0],last=e.path[e.path.length-1];
  const colors=palette((first[0]+last[0])/2,(first[1]+last[1])/2);
  const wide=e.kind==="street"||e.kind==="road"||e.kind==="old-road",stair=e.kind==="stairs"||e.slope==="stairs",steep=e.kind==="switchback"||e.slope==="switchback";
  // Road shoulders and the actual tread share geometry, so the road cannot
  // visually promise a shortcut that physical collision contradicts.
  // The earlier full-width round strokes looked like elevated concrete pipes.
  // Paint a slightly narrower worn earthen tread INSIDE the unchanged
  // traversable corridor, leaving softly broken shoulders and side greenery.
  strokePath(ctx,e.path,"rgba(39,47,57,.24)",e.halfWidth*1.14+15);
  strokePath(ctx,e.path,colors.rim,e.halfWidth*1.03+7);
  strokePath(ctx,e.path,colors.bed,e.halfWidth*.86);
  strokePath(ctx,e.path,colors.center,e.halfWidth*(wide?.44:.27));
  for(const [a,b,prior,len] of e.parts){
   if(!len||!closeTo(bounds,a,b,120))continue;
   const dx=(b[0]-a[0])/len,dy=(b[1]-a[1])/len,nx=-dy,ny=dx;
   const spacing=stair?45:steep?62:wide?64:82;
   for(let k=spacing*.5;k<len;k+=spacing){
    const x=a[0]+dx*k,y=a[1]+dy*k;
    if(x<bounds[0]-120||x>bounds[2]+120||y<bounds[1]-120||y>bounds[3]+120)continue;
    const h=hash(Math.floor((prior+k)/19),e.id.length,36);
    if(stair||steep){
     // A real cross-width stair tread or switchback retaining riser.
     const width=e.halfWidth*(stair?.84:.60),c=stair?"#6f7377":colors.shade;
     segment(ctx,[x-nx*width,y-ny*width],[x+nx*width,y+ny*width],c,stair?10:7);
     segment(ctx,[x-nx*width*.88-dx*4,y-ny*width*.88-dy*4],
      [x+nx*width*.88-dx*4,y+ny*width*.88-dy*4],colors.detail,stair?4:3)
    }else{
     const side=h>.5?1:-1,offset=e.halfWidth*(.25+h*.45),px=x+nx*offset*side,py=y+ny*offset*side;
     // Short irregular gravel pockets, tufts and rain-worn ruts, not
     // uniform dashed vector strokes.
     ctx.fillStyle=h>.65?colors.detail:colors.shade;
     ctx.fillRect(Math.round(px),Math.round(py),9+(h*11|0),3+(h*3|0));
     if(h>.24){
      ctx.fillStyle=h>.61?"rgba(216,208,175,.5)":"rgba(58,93,73,.37)";
      ctx.fillRect(Math.round(px+4-nx*13),Math.round(py-6-ny*13),21,5)
     }
     if(h>.67){
      ctx.fillStyle="rgba(44,78,65,.36)";
      for(let tt=0;tt<3;tt++)ctx.fillRect(Math.round(px+tt*8+nx*12),Math.round(py-8-tt*4+ny*12),3,14)
     }
     if(wide&&h>.40){
      ctx.fillStyle="rgba(54,62,61,.24)";
      ctx.fillRect(Math.round(x+nx*e.halfWidth*.22),Math.round(y+ny*e.halfWidth*.22),14,3)
     }
    }
   }
  }
 }
 function landing(ctx,p,axis,style,width){
  const nx=-axis[1],ny=axis[0];
  const s=width*.73;
  // Stone foot apron widens visibly on either bank, exactly centered on the
  // underlying crossing node (no additional invented collision polygon).
  const points=[
   [p[0]-nx*s-axis[0]*25,p[1]-ny*s-axis[1]*25],
   [p[0]+nx*s-axis[0]*25,p[1]+ny*s-axis[1]*25],
   [p[0]+nx*s+axis[0]*26,p[1]+ny*s+axis[1]*26],
   [p[0]-nx*s+axis[0]*26,p[1]-ny*s+axis[1]*26]
  ];
  line(ctx,points);ctx.closePath();ctx.fillStyle=style.dark;ctx.fill();
  segment(ctx,points[0],points[1],style.trim,5);
  segment(ctx,points[3],points[2],style.trim,5)
 }
 function deck(ctx,e,bounds){
  const style=deckTypes[e.deck]||deckTypes.wooden;
  if(!style)throw Error("Unknown crossing deck "+e.id);
  // Layered structural underside and real worn deck; source centerline,
  // widths, 7% landings and edgeGuard rail positions are unchanged.
  strokePath(ctx,e.path,"rgba(23,35,47,.65)",e.halfWidth*1.78+19);
  strokePath(ctx,e.path,style.dark,e.halfWidth*1.73+7);
  strokePath(ctx,e.path,style.bed,e.halfWidth*1.53);
  const full=e.total;
  for(const [a,b,prior,len] of e.parts){
   if(!len||!closeTo(bounds,a,b,170))continue;
   const dx=(b[0]-a[0])/len,dy=(b[1]-a[1])/len,nx=-dy,ny=dx;
   for(let k=style.spacing*.5;k<len;k+=style.spacing){
    const x=a[0]+dx*k,y=a[1]+dy*k;
    if(x<bounds[0]-140||x>bounds[2]+140||y<bounds[1]-140||y>bounds[3]+140)continue;
    const t=(prior+k)/full,seed=hash(Math.floor((prior+k)/18),e.id.length,11);
    const width=e.halfWidth*(style.kind==="ford"?.72:.87);
    const col=style.kind==="planks"?(seed>.48?style.dark:style.joint):
      style.kind==="ford"?style.dark:style.kind==="causeway"?"#66796f":style.joint;
    segment(ctx,[x-nx*width,y-ny*width],[x+nx*width,y+ny*width],col,style.kind==="planks"?9:6);
    segment(ctx,[x-nx*width*.76+dx*6,y-ny*width*.76+dy*6],
      [x+nx*width*.76+dx*6,y+ny*width*.76+dy*6],style.trim,style.kind==="ford"?8:3);
    if(style.kind==="planks"){
     // Board-end grain, staggered nail heads and weathered fibres:
     // timber reads as wood rather than a striped vector road.
     for(const side of [-1,1]){
      const px=x+nx*side*width*.66,py=y+ny*side*width*.66;
      ctx.fillStyle="#51484a";ctx.fillRect(Math.round(px),Math.round(py),5,5);
      ctx.fillStyle=seed>.55?"#e1c49f":"#987c6a";
      ctx.fillRect(Math.round(px+dx*9),Math.round(py+dy*9),10,3)
     }
     if(seed>.26){
      segment(ctx,[x-nx*width*.42+dx*10,y-ny*width*.42+dy*10],
       [x+nx*width*.18+dx*10,y+ny*width*.18+dy*10],
       "rgba(62,49,48,.33)",2.5)
     }
    }else if(style.kind==="flagstone"||style.kind==="causeway"){
     // Broken offset stone joints plus shallow chipped stone highlights.
     const zz=width*(.40+.20*seed);
     segment(ctx,[x-nx*zz+dx*11,y-ny*zz+dy*11],
      [x-nx*width*.12+dx*11,y-ny*width*.12+dy*11],"rgba(54,64,73,.38)",4);
     segment(ctx,[x+nx*width*.1-dx*5,y+ny*width*.1-dy*5],
      [x+nx*width*.62-dx*5,y+ny*width*.62-dy*5],style.trim,2.5)
    }
    if(style.kind==="ford"){
     // Dry raised stepping-stone caps are continuous over the authored ford
     // centerline: never imply an unsupported swimming shortcut.
     ctx.fillStyle=style.trim;ctx.fillRect(Math.round(x-9),Math.round(y-5),18,7)
    }
    if(style.rail&&t>.07&&t<.93&&Math.floor((prior+k)/style.spacing)%3===0){
     for(const side of [-1,1]){
      const px=x+nx*side*e.halfWidth*.87,py=y+ny*side*e.halfWidth*.87;
      ctx.fillStyle=style.dark;ctx.fillRect(Math.round(px-5),Math.round(py-19),10,24);
      ctx.fillStyle=style.trim;ctx.fillRect(Math.round(px-6),Math.round(py-20),12,5)
     }
    }
   }
  }
  // Balustrades are present only over the middle 86% of crossing. This same
  // interval is used by edgeGuard(), leaving landings safe to enter and exit.
  if(style.rail){
   for(const side of [-1,1]){
    const rail=[];
    for(const [a,b,prior,len] of e.parts){
     for(let k=0;k<=len;k+=Math.max(16,len/12)){
      const t=(prior+k)/full;
      if(t<.07||t>.93)continue;
      const dx=(b[0]-a[0])/len,dy=(b[1]-a[1])/len;
      rail.push([a[0]+dx*k-dy*e.halfWidth*.87*side,
       a[1]+dy*k+dx*e.halfWidth*.87*side])
     }
    }
    if(rail.length>=2){
     // Layered parapet matches the same collision-center rail in edgeGuard.
     const drop=rail.map(p=>[p[0]+4,p[1]+12]);
     strokePath(ctx,drop,"rgba(30,38,46,.56)",18);
     strokePath(ctx,rail,style.dark,15);
     strokePath(ctx,rail,style.rail,7);
     strokePath(ctx,rail,style.trim,2.5)
    }
   }
  }
  const a=e.parts[0],z=e.parts[e.parts.length-1];
  if(a&&z){
   const d0=(a[3]||1),dz=(z[3]||1);
   landing(ctx,e.path[0],[(a[1][0]-a[0][0])/d0,(a[1][1]-a[0][1])/d0],style,e.halfWidth);
   landing(ctx,e.path[e.path.length-1],[(z[1][0]-z[0][0])/dz,(z[1][1]-z[0][1])/dz],style,e.halfWidth)
  }
 }
 function junctions(ctx,bounds){
  // Only mapped junctions and meaningful authored endpoints receive a
  // stone/wood route marker. Small inlaid marks are nonblocking ground detail.
  for(const node of model.nodes){
   const degreeAt=degree.get(node.id);
   if(degreeAt<3&&degreeAt!==1)continue;
   const x=node.point[0]*model.worldDesign.worldUnitScale;
   const y=node.point[1]*model.worldDesign.worldUnitScale;
   if(x<bounds[0]-80||x>bounds[2]+80||y<bounds[1]-80||y>bounds[3]+80)continue;
   const p=palette(x,y);
   ctx.fillStyle=p.shade;ctx.fillRect(x-12,y-6,24,12);
   ctx.fillStyle=p.detail;ctx.fillRect(x-9,y-9,18,5);
   if(degreeAt===1){
    ctx.fillStyle=p.rim;ctx.fillRect(x-22,y+10,44,5)
   }else{
    ctx.fillStyle=p.detail;ctx.fillRect(x-23,y+13,46,4)
   }
  }
 }
 function draw(ctx,bounds){
  let painted=0;
  for(const e of roads){
   let visible=false;
   for(const [a,b] of e.parts)if(closeTo(bounds,a,b,160)){visible=true;break}
   if(!visible)continue;
   if(e.crossing)deck(ctx,e,bounds);else ribbon(ctx,e,bounds);
   raster?.decorateRoute(ctx,e,bounds);
   painted++
  }
  junctions(ctx,bounds);return painted
 }
 function drawDebug(ctx,bounds){
  for(const e of roads.filter(e=>e.crossing&&e.kind==="bridge")){
   if(!e.parts.some(([a,b])=>closeTo(bounds,a,b,130)))continue;
   const old=ctx.strokeStyle;
   const railOffset=e.halfWidth*.87;
   for(const [a,b] of e.parts){
    const len=Math.hypot(b[0]-a[0],b[1]-a[1])||1,nx=-(b[1]-a[1])/len,ny=(b[0]-a[0])/len;
    for(const sign of [-1,1])segment(ctx,
     [a[0]+nx*sign*railOffset,a[1]+ny*sign*railOffset],
     [b[0]+nx*sign*railOffset,b[1]+ny*sign*railOffset],
     "rgba(252,115,103,.54)",6)
   }
   ctx.strokeStyle=old
  }
 }
 function stats(){return{version:VERSION,...categorized,railGuards:"source-coupled bridge rail clearance",
  climatePaths:!!climate,authoredWinterRoads:!!raster,waterCrossingOnly:true}}
 return{version:VERSION,roads,crossings,stats,nearestRoad,edgeGuard,draw,drawDebug}
}
window.VeilwardRoutes={version:VERSION,create,deckTypes};
})();