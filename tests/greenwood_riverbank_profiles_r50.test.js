// Phase 9 R50: independently composed Greenwood riverbank silhouettes.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const s=fs.readFileSync("world_greenwood_art.js","utf8");
const bank=s.slice(s.indexOf("function paintFallsRiverBanks("),s.indexOf("// R36: the Falls overlook"));
assert(bank.includes("const profiles=["),"bank-specific compositions exist");
const profiles=bank.slice(bank.indexOf("const profiles=["),bank.indexOf("const parts=profiles[profile]"));
assert.equal((profiles.match(/along:/g)||[]).length,23,"five authored silhouettes contain twenty-three native pieces");
assert.equal((profiles.match(/\{along:/g)||[]).length,23,"all riverbank pieces have authored offsets");
assert.equal((profiles.match(/cell:3/g)||[]).length,11,"stone and fern material variety remains intentional");
assert(bank.includes("const profile=(Math.floor(o.segment*1.618)+Math.floor(o.step/11)*2+(o.side>0?3:0))%5"),"source-anchored, side-aware five-profile variation");
assert(bank.includes("const h=w; // Original R18 paintings are square"),"preserve native proportions");
assert(bank.includes("for(const fx of [-.48,0,.48])")&&bank.includes("for(const fy of [-.48,0,.48])"),"nine-point visible footprint checks");
for(const token of ["geometry.waterAt(x,y,18)","geometry.nearRoad(x,y,()=>true,62)","geometry.obstacle(x,y,18)","footprint.blocked?.(x,y,18)"])assert(bank.includes(token),token);
assert(bank.includes("ctx.drawImage(painted,PAINTED_SIZE*part.cell"),"actual native art integrated");
console.log("R50 bank profiles and clearance PASS");
