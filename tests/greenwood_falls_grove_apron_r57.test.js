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

// R58: three root-stable native woodland compositions, not a cloned row.
assert.match(body,/const layouts=\[/);
assert.match(body,/const profile=Math\.floor\(hash\(seed,dist,1581\)\*3\)/);
assert.match(body,/const layout=layouts\[profile\]/);
assert.match(body,/const \[t,offset,scale,source\]=layout\[k\]/);
assert.match(body,/PAINTED_SIZE\*source/);
assert.match(body,/source===3/);
assert.equal((body.match(/\[\.\d+,[.-]?\.\d+,[.\d]+,[23]\]/g)||[]).length,21,
 "Expected 21 deliberately composed fern/stone entries across three profiles");
console.log("R57/R58 native grove composition guards passed");
