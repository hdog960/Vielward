// R52: rooted Greenwood Falls forest-to-bank art must stay nonphysical.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const s=fs.readFileSync("world_greenwood_art.js","utf8");
const start=s.indexOf("function paintFallsWoodlandBankTransition(");
const end=s.indexOf("// R36: the Falls overlook",start);
assert(start>0&&end>start,"connected bank composition exists");
const section=s.slice(start,end);
assert(section.includes("fallsRoots(bounds)"),"composition uses real physical grove roots");
assert(section.includes("sourceFallsBanks()"),"composition uses authentic river sources");
assert(section.includes("nearest.d>550"),"distant banks never receive invented forest");
assert.equal((section.match(/at:\./g)||[]).length,4,"four layered, asymmetrical native crops");
assert(section.includes("const w=p.size*(.92+hash(seed,j,1523)*.16),h=w"),"native art remains square");
for(const token of ["geometry.waterAt(sx,sy,16)","geometry.nearRoad(sx,sy,()=>true,75)","geometry.obstacle(sx,sy,16)","footprint.blocked?.(sx,sy,16)","for(const fx of [-.46,0,.46])","for(const fy of [-.46,0,.46])"])assert(section.includes(token),token);
assert(s.includes("  paintFallsWoodlandBankTransition(ctx,bounds);"),"new composition integrated into gameplay renderer");
assert(!section.includes("geometry.solids.push")&&!section.includes("saveSchema"),"art does not mutate collision or saves");
console.log("R52 Greenwood woodland-to-bank composition PASS");
