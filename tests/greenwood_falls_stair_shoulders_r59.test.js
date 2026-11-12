// Phase 9 R59: native, irregular Falls stair shoulders retain physical clearance.
const assert=require("node:assert/strict"),fs=require("node:fs");
const source=fs.readFileSync(require("node:path").join(__dirname,"../world_greenwood_art.js"),"utf8");
const body=source.split("function paintFallsComposedGround(ctx,bounds){")[1].split("const fallsRockComposition=")[0];
assert.ok(body.includes("const shoulderProfiles=["));
assert.ok(body.includes("for(const side of [-1,1])"));
assert.ok(body.includes("for(const [t,offset,size,source] of profile)"));
for(const guard of ["geometry.waterAt(sx,sy,24)","geometry.obstacle(sx,sy,24)","geometry.nearRoad(sx,sy,()=>true,50)","footprint.blocked?.(sx,sy,18)","PAINTED_SIZE*source"]){
 assert.ok(body.includes(guard),guard);
}
assert.ok(!body.includes("for(let k=0;k<8;k++)"),"retire cloned sixteen-piece stair fern line");
assert.equal((body.match(/\[\.\d+,\d+,\d+,[23]\]/g)||[]).length,8);
console.log("R59 native stair shoulder composition guards passed");
