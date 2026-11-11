// R49: painted Greenwood riverbank geology must retain native square art.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const s=fs.readFileSync("world_greenwood_art.js","utf8");
const a=s.slice(s.indexOf("function paintFallsRiverBanks("),s.indexOf("// R36: the Falls overlook"));
assert(a.includes("const h=w; // R49:"),"low river terrace source aspect");
assert(a.includes("const fw=w*(.62+hash(seed,5,1309)*.15),fh=fw;"),"fern material source aspect");
assert(a.includes("const w=piece.w,h=w; // R49:"),"lower riverbank outcrops source aspect");
assert(!a.includes("h:116*scale")&&!a.includes("h:94*scale"),"stretched source crops retired");
assert(a.includes("for(const fy of [-.46,0,.46])")&&a.includes("for(const fx of [-.46,0,.46])"),"nine point visible-footprint safety");
assert(a.includes("footprint.blocked?.(sx,sy,12)")&&a.includes("footprint.blocked?.(xx,yy,8)"),"original blocked-ground clearance");
assert(a.includes("geometry.nearRoad(sx,sy,()=>true,32)")&&a.includes("geometry.nearRoad(xx,yy,()=>true,35)"),"source road clearance");
console.log("R49 Greenwood riverbank native-art safety PASS");
