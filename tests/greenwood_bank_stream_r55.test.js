// R55: Greenwood Falls landscape arbitration must be stream-chunk invariant.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const s=fs.readFileSync("world_greenwood_art.js","utf8");
const start=s.indexOf("function paintFallsWoodlandBankTransition(");
const end=s.indexOf("// R36: the Falls overlook",start);
assert(start>=0&&end>start);
const section=s.slice(start,end);
const footprint=section.indexOf("paintedFootprints.push({x,y,w,h});");
const culled=section.indexOf("if(x<bounds[0]-w||x>bounds[2]+w||",footprint);
assert(footprint>0&&culled>footprint,
 "overlap arbitration must happen before per-chunk rendering cull");
assert(!section.slice(0,footprint).includes("if(x<bounds[0]-w||x>bounds[2]+w||"),
 "chunk bounds must not change which riverbank composition wins");
assert(section.includes("ctx.createRadialGradient?.(")&&
 section.includes("ctx.fillRect(x-w*.5,y-h*.68,w,h)"),
 "grounded translucent dry-bank material underlies painted assets");
for(const guard of ["geometry.waterAt(sx,sy,16)","geometry.nearRoad(sx,sy,()=>true,75)",
 "geometry.obstacle(sx,sy,16)","footprint.blocked?.(sx,sy,16)"])
 assert(section.includes(guard),guard);
assert(section.includes("const roots=fallsRoots(bounds)"),
 "native physical grove roots remain authoritative");
assert(!section.includes("geometry.solids.push")&&!section.includes("saveSchema"));
console.log("R55 Greenwood bank chunk arbitration and tonal composition PASS");
