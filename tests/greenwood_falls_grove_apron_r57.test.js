// Phase 9 R57: source-rooted Greenwood Falls woodland apron guard.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const source=fs.readFileSync(require("node:path").join(__dirname,"../world_greenwood_art.js"),"utf8");
assert.match(source,/function paintFallsGroveApron\(ctx,bounds\)/);
assert.match(source,/paintFallsGroveApron\(ctx,bounds\);/);
const body=source.split("function paintFallsGroveApron(ctx,bounds){")[1].split("function paintFallsRootedGorge")[0];
for(const required of ["fallsRoots(bounds)","geometry.waterAt","geometry.nearRoad","geometry.obstacle","footprint.blocked","PAINTED_SIZE","drawImage","ctx.restore()"]){
 assert.ok(body.includes(required), "Missing protected R57 apron requirement: "+required);
}
assert.match(body,/for\(const fx of \[\.02,\.26,\.5,\.74,\.98\]\)/);
assert.match(body,/for\(const fy of \[\.02,\.26,\.5,\.74,\.98\]\)/);
console.log("R57 native grove apron source guards passed");
