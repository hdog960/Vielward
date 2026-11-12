'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('world_greenwood_art.js','utf8');
const gorge=source.slice(source.indexOf(' function paintFallsRootedGorge('),source.indexOf(' function paintFallsCanopyBoughs('));
assert(gorge.includes('withDryForestClip(ctx,px,py,rx,()=>{'),'entire rooted gorge shadow must clip to dry source ground');
assert(!gorge.includes('ctx.save();ctx.fillStyle=shade;'),'old unrestricted gorge gradient must not return');
const banks=source.slice(source.indexOf('  const runs=[];'),source.indexOf('   terraces++;'));
assert(banks.includes('withDryForestClip(ctx,p.x,p.y,span,()=>{'),'bank terrace wash must clip across entire visible span');
assert(!banks.includes('ctx.save();ctx.translate(p.x,p.y);ctx.scale(span,span*.43);\n     const stone='),'old unrestricted terrace must not return');
const helper=source.slice(source.indexOf(' function withDryForestClip('),source.indexOf(' function paintForestFloor('));
for(const guard of ['forest(px,py)','geometry.waterAt(px,py,4)','geometry.nearRoad(px,py,()=>true,4)','geometry.obstacle(px,py,4)','footprint.blocked?.(px,py,4)'])
 assert(helper.includes(guard),'source-ground protection required: '+guard);
assert(helper.includes('if(accepted){ctx.clip();paint()}'),'never paint if no safe land cells');
console.log('R63 Greenwood gorge and river terrace dry-source integration verified');
