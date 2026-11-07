/* VEILWARD v1.3.26: real authored raster atlas → seamless large world plates.
 * This is a geometry-safe art-production regression, NOT artist signoff.
 */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const source=fs.readFileSync("world_raster_pilot.js","utf8");
const plates=[];
function makeCanvas(){
 const c={width:0,height:0,pixels:null};
 c.getContext=()=>{
  const t={
   imageSmoothingEnabled:false,
   drawImage(_source,srcX,srcY,srcW,srcH,x,y,w,h){
    if(!c.pixels)c.pixels=new Uint8ClampedArray(c.width*c.height*4);
    const v=20+Math.floor(srcX/32)*60+Math.floor(srcY/32)*3;
    for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
     const p=(yy*c.width+xx)*4;
     for(let ch=0;ch<3;ch++)c.pixels[p+ch]=v;
     c.pixels[p+3]=255
    }
   },
   getImageData(){return {data:c.pixels}},
   putImageData(d){c.pixels=d.data}
  };
  return t
 };
 plates.push(c);return c
}
class Img{
 constructor(){this.onload=null;this.onerror=null;this.naturalWidth=0;this.naturalHeight=0}
 set src(path){
  const dims=path.includes("pilot_sprites")?[288,96]:
   path.includes("bridge_stairs_lamp")?[216,72]:
   path.includes("ground_painted")?[128,128]:
   path.includes("neighborhood_r6")?[288,144]:null;
  assert(dims,"only dedicated source art is allowed");
  [this.naturalWidth,this.naturalHeight]=dims;
  this.onload?.()
 }
}
const host={Image:Img,document:{createElement(name){
 assert.equal(name,"canvas");return makeCanvas()
}},console:{warn(){}}};
host.window=host;
vm.runInNewContext(source,host,{filename:"world_raster_pilot.js"});
(async()=>{
 const pilot=host.VeilwardRasterPilot;
 await pilot.load();
 assert.equal(pilot.materialPlateMode,"seam-composed");
 assert.equal(plates.length,4,"four painterly source materials, not backdrop images");
 assert.ok(plates.every(c=>c.width===256&&c.height===256),
   "8x8 native 32px material plates compose once per game load");
 const sample=(c,x,y)=>(c.pixels[(y*256+x)*4]);
 const delta=(a,b)=>Math.abs(a-b);
 const snow=plates[0];
 assert.ok(delta(sample(snow,31,16),sample(snow,32,16))<65,
   "source-variant x seams must blend instead of abrupt tile edge");
 assert.ok(delta(sample(snow,16,31),sample(snow,16,32))<65,
   "source-variant y seams must blend instead of abrupt tile edge");
 const model={nodes:[]},geometry={solids:[]};
 const footprint={regionAt(){return {id:"hollowreach"}}};
 const painter=pilot.create(model,geometry,{footprint,climate:{}});
 const trace=[];
 const context={globalAlpha:1,save(){},restore(){},fillRect(){},
  drawImage(...args){trace.push(args)}};
 assert.equal(painter.paintGroundCell(context,"snow",0,0,0,0,96),true);
 assert.equal(painter.paintGroundCell(context,"snow",8,0,768,0,96),true);
 assert.equal(painter.paintGroundCell(context,"road",7,4,672,384,96),true);
 assert.equal(trace.length,3,"real raster imagery appears in the game");
 assert.equal(trace[0][0],snow);
 assert.equal(trace[0][1],0);
 assert.equal(trace[1][1],0,"8-cell global modulo loops seamlessly");
 assert.equal(trace[2][0],plates[1]);
 assert.equal(trace[2][1],224,"road material reuses physical world grid");
 assert.equal(trace[2][2],128,"road material has true independent row");
 assert.equal(painter.stats().creatorApproved,false);
 assert.equal(painter.stats().geometryChanged,false);
 assert.equal(painter.stats().artworkCells,30);
 assert.equal(painter.stats().materialPlateMode,"seam-composed");
 assert.equal(painter.paintGroundCell(context,"snow",0,0,0,0,96),true);
 console.log("R5 PASS: native painted raster plates, softened x/y edges, global grid and unchanged colliders");
})().catch(err=>{console.error(err);process.exitCode=1});
