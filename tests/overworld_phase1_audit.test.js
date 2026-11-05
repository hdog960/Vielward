/* VEILWARD Overworld Phase 1 — Source audit and protected-asset gate.
 * Run: node tests/overworld_phase1_audit.test.js
 * This is a DOCUMENTATION + SOURCE SAFETY test, not an iPhone visual test.
 */
"use strict";
const fs=require("node:fs");
const assert=require("node:assert/strict");
const crypto=require("node:crypto");
const issues=JSON.parse(fs.readFileSync("docs/overworld/issue_register.json","utf8"));
const lock=JSON.parse(fs.readFileSync("docs/overworld/protected_assets.json","utf8"));
const roadmap=fs.readFileSync("OVERWORLD_REBUILD_ROADMAP.md","utf8");
const agent=fs.readFileSync("AGENTS.md","utf8");
const gameplay=fs.readFileSync("game.js","utf8");
const visual=fs.readFileSync("visual.js","utf8");
const nav=fs.readFileSync("navigation.js","utf8");
let checks=0;
function check(value,message){assert.ok(value,message);checks++}
function eq(actual,expected,message){assert.equal(actual,expected,message);checks++}
check(issues.schema==="veilward.overworld.issue-register.v1","issue schema");
check(lock.schema==="veilward.overworld.phase1.lock.v1","asset-lock schema");
eq(issues.issues.length,34,"34 tracked screenshot/design issues");
const ids=new Set(),pages=new Set();
for(const issue of issues.issues){
 check(/^VW-\d{3}$/.test(issue.id),"valid permanent issue ID "+issue.id);
 check(!ids.has(issue.id),"unique ID "+issue.id);ids.add(issue.id);
 check(issue.observation.length>20,"creator observation "+issue.id);
 check(issue.codeEvidence.length>15,"source evidence "+issue.id);
 check(issue.acceptance.length>20,"measurable acceptance "+issue.id);
 check(issue.verification.startsWith("OPEN"),"not falsely marked creator-approved "+issue.id);
 check(issue.phases.length>0&&issue.phases.every(n=>Number.isInteger(n)&&n>=1&&n<=22),"valid future phases "+issue.id);
 check(issue.pages.every(n=>Number.isInteger(n)&&n>=1&&n<=12),"valid PDF pages "+issue.id);
 issue.pages.forEach(n=>pages.add(n));
}
for(let n=1;n<=12;n++)check(pages.has(n),"creator PDF page "+n+" tracked");
check(issues.issues.some(x=>x.id==="VW-001"&&x.pages.includes(1)),"continuous-world issue registered");
check(issues.issues.some(x=>x.id==="VW-004"&&x.pages.includes(2)),"movement detour registered");
check(issues.issues.some(x=>x.id==="VW-006"&&x.pages.includes(3)),"enemy sheet quality registered");
check(issues.issues.some(x=>x.id==="VW-016"&&x.pages.includes(7)),"island crossing registered");
check(issues.issues.some(x=>x.id==="VW-021"&&x.pages.includes(10)),"floating player issue registered");
check(issues.issues.some(x=>x.id==="VW-024"&&x.pages.includes(11)),"Worldscar affordance registered");
check(issues.issues.some(x=>x.id==="VW-032"&&x.pages.includes(12)),"overworld first scope registered");
check(issues.issues.some(x=>x.id==="VW-034"&&x.phases.includes(9)),"creator Phase 9 review registered");
check(roadmap.includes("APPROVED BY CREATOR"),"approved roadmap not a pending draft");
const p9=roadmap.indexOf("#### Phase 9"),
 gate=roadmap.indexOf("### MANDATORY CHECKPOINT"),
 p10=roadmap.indexOf("#### Phase 10");
check(p9>=0&&gate>p9&&p10>gate,"creator visual approval hard stop before Phase 10");
check(roadmap.includes("explicit approval of the overworld appearance"),"specific approval requirement");
check(agent.includes("one complete phase per"),"per-phase workflow retained");
check(agent.includes("Phase 9"),"agent instructions protect review gate");
const docs=[
 "docs/overworld/ISSUE_REGISTER.md",
 "docs/overworld/ASSET_AND_RUNTIME_INVENTORY.md",
 "docs/overworld/WORLD_DESIGN_LOCK.md",
 "docs/overworld/COORDINATES_AND_MIGRATION.md",
 "docs/overworld/issue_register.json",
 "docs/overworld/protected_assets.json",
 "docs/overworld/SCREENSHOT_ACCEPTANCE_MATRIX.md",
 "docs/overworld/legacy_scene_anchors.json"
];
for(const path of docs)check(fs.existsSync(path)&&fs.statSync(path).size>250,"source-audit deliverable "+path);
const anchors=JSON.parse(fs.readFileSync("docs/overworld/legacy_scene_anchors.json","utf8"));
check(anchors.schema==="veilward.overworld.legacy-scene-anchors.v1","source-anchor schema");
eq(anchors.zones.length,4,"all existing scene zones recorded");
eq(anchors.portals.length,4,"all old portal links recorded");
eq(anchors.npcs.length,6,"all existing named NPCs recorded");
eq(anchors.objects.length,5,"all non-portal world objects recorded");
eq(anchors.enemies.length,7,"all original enemy spawn points recorded");
check(anchors.world.width===1850&&anchors.world.height===1200,"legacy local world dimensions");
check(anchors.world.sourceImage.width===900&&anchors.world.sourceImage.height===584,"native reference image dimensions");
check(anchors.portals.filter(x=>x.future==="seamless outdoor").length===2,"both outdoor portal edges marked for replacement");
const capture=fs.readFileSync("docs/overworld/SCREENSHOT_ACCEPTANCE_MATRIX.md","utf8");
const picturedPages=capture.split("\n").filter(line=>line.startsWith("| **"))
 .map(line=>Number(line.slice(4).split("**")[0].split(",")[0].split(" ")[0]));
for(let page=1;page<=12;page++)check(picturedPages.includes(page),"acceptance matrix documents PDF p."+page);
const register=fs.readFileSync(docs[0],"utf8");
for(const id of ids)check(register.includes(id),"readable issue register contains "+id);
const worldview=fs.readFileSync("docs/overworld/WORLD_DESIGN_LOCK.md","utf8");
check(worldview.includes("Hard stop after Phase 9"),"design lock explicitly pauses at full world review");
check(worldview.includes("continuous outdoor"),"world design covers continuous overworld");
const coords=fs.readFileSync("docs/overworld/COORDINATES_AND_MIGRATION.md","utf8");
check(coords.includes("1850/900")&&coords.includes("1200/584"),"reference coordinate transformations recorded");
check(coords.includes("non-destructive"),"legacy migration protects player progress");
check(lock.legacySaveKey==="veilward-hollowreach-v01","canonical localStorage key locked");
check(gameplay.includes('const SAVE="veilward-hollowreach-v01";'),"actual save key retained");
check(lock.creatorReviewGate.afterPhase===9&&lock.creatorReviewGate.nextPhaseRequiresExplicitApproval===10,"approval check gate");
eq(lock.lockedAssets.length,4,"approved player and Warden assets preserved");
function gitBlobSha(path){
 const bytes=fs.readFileSync(path);
 return crypto.createHash("sha1").update(Buffer.from("blob "+bytes.length+"\0")).update(bytes).digest("hex");
}
for(const asset of lock.lockedAssets){
 check(fs.existsSync(asset.path),"protected source asset exists: "+asset.path);
 eq(gitBlobSha(asset.path),asset.gitBlobSHA,"approved asset not overwritten: "+asset.path);
}
for(const asset of lock.goldenReferenceAssets){
 check(fs.existsSync(asset.path),"golden reference file exists: "+asset.path);
 eq(gitBlobSha(asset.path),asset.gitBlobSHA,"scene reference remains stable during audit: "+asset.path);
}
if(gameplay.includes('const APP_VERSION="1.2.6"')){
 check(gameplay.includes("const WORLD={w:1850,h:1200}"),"baseline world size captured");
 check(visual.includes('village:"village_v06_clear.jpg"'),"village image still active");
 check(visual.includes('wilds:"wilds_clean.jpg"'),"Greenwood image still active");
 check(visual.includes('cave:"cave_clean.jpg"'),"cave image still active");
 check(nav.includes("1850/900")&&nav.includes("1200/584"),"image/world projection correct");
}
// Later overworld gameplay changes are ALLOWED. This guard tests protected
// art, documents and migration contract rather than freezing all future code.
console.log("Veilward Phase 1 PASS:",checks,"audit checks; 34 issues/12 pages; assets and review gate intact.");
