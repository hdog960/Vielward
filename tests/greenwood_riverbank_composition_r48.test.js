// Phase 9 R48: the genuine Greenwood Falls riverbank painter must retain
// native-proportion authored crops and nine-point physical source clearance.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const source=fs.readFileSync("world_greenwood_art.js","utf8");
const begin=source.indexOf("// R48: the river's upper forest edge");
const end=source.indexOf("// R42:",begin);
assert(begin>0&&end>begin,"R48 riverbank composition is integrated");
const section=source.slice(begin,end);
assert(section.includes("for(let i=3;i<run.length;i+=11)"),"source river anchors preserved");
assert(section.includes("const base=inset(o,104)"),"authentic dry-bank offset retained");
assert(section.includes("const h=w;"),"painted square sources keep native aspect ratio");
assert(section.includes("part.cell"),"multiple original source paintings integrated");
assert(section.includes("for(const fx of [-.48,0,.48])")&&section.includes("for(const fy of [-.48,0,.48])"),"nine-point painted footprint sampling required");
for(const guard of ["!forest(x,y)","geometry.waterAt(x,y,18)","geometry.nearRoad(x,y,()=>true,62)","geometry.obstacle(x,y,18)","footprint.blocked?.(x,y,18)"])assert(section.includes(guard),"Missing physical clearance: "+guard);
assert(!section.includes("w=315*scale,h=147*scale"),"retired stretched fern strip must not return");
console.log("R48 native riverbank composition guards PASS");
