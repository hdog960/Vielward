'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('world_greenwood_art.js','utf8');
const start=source.indexOf(' function paintForestFloor(ctx,bounds){');
const end=source.indexOf('  paintRootedForestEdge(ctx,bounds);',start);
assert(start>=0&&end>start,'real forest floor compositor exists');
const body=source.slice(start,end);
assert(body.includes('const step=32')&&body.includes('ctx.clip()'),'ground lighting uses a world-fixed source mask');
for(const guard of ['forest(px,py)','geometry.waterAt(px,py,4)','geometry.nearRoad(px,py,()=>true,4)','geometry.obstacle(px,py,4)','footprint.blocked?.(px,py,4)'])
 assert(body.includes(guard),'source-ground mask must protect '+guard);
assert(body.indexOf('ctx.clip()')<body.indexOf('const dark=ctx.createRadialGradient'),'mask precedes shadows');
assert(body.indexOf('ctx.clip()')<body.indexOf('const light=ctx.createRadialGradient'),'mask precedes light');
assert(body.includes('ctx.restore()'),'restore mask before other scenery');
console.log('R61 Greenwood forest-floor source-ground clipping guards pass');
