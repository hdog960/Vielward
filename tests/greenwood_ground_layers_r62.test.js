'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('world_greenwood_art.js','utf8');
const helper=source.slice(source.indexOf(' function withDryForestClip('),source.indexOf(' function paintForestFloor('));
assert(helper.includes('const step=32'),'source stencil must remain world aligned');
for(const guard of ['forest(px,py)','geometry.waterAt(px,py,4)','geometry.nearRoad(px,py,()=>true,4)','geometry.obstacle(px,py,4)','footprint.blocked?.(px,py,4)'])
 assert(helper.includes(guard),'dry-land stencil must guard '+guard);
assert(helper.includes('if(accepted){ctx.clip();paint()}'),'no ground paint if no accepted cells');
assert(helper.includes('ctx.restore()'),'clip must not leak to other scene passes');
assert(helper.includes('ctx.moveTo(xx,yy)'),'lightweight canvas stub fallback remains supported');
const floor=source.slice(source.indexOf(' function paintForestFloor('),source.indexOf(' function stats(){'));
assert(floor.includes('withDryForestClip(ctx,x,y,spread*1.15,()=>{'),'Falls old-growth pools source clipped');
assert(floor.includes('withDryForestClip(ctx,o.x,o.y,reach,()=>{'),'rooted shade and sun source clipped');
assert.equal((floor.match(/withDryForestClip\(ctx,o\.x,o\.y,reach,\(\)=>\{/g)||[]).length,2,'both root layers clipped');
assert(!floor.includes('ctx.save();ctx.fillStyle=shade;'),'unclipped shade removed');
assert(!floor.includes('ctx.save();ctx.fillStyle=sun;'),'unclipped sun removed');
console.log('R62 source-ground light layers verified');
