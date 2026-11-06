/* Veilward Phase 2 source-generated planning SVG. Run: node scripts/render_overworld_blueprint.js */
"use strict";
const fs=require("node:fs");
const render=function render(model){
 const esc=v=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
 const fmt=n=>Number(n).toFixed(1).replace(/\.0$/,"");
 const dpath=p=>p.map((v,i)=>(i?"L":"M")+fmt(v[0])+","+fmt(v[1])).join(" ");
 const polygon=p=>dpath(p)+" Z";
 const rgb={
  "alpine-village":"#93aac2","alpine-stone":"#bdc9d8","alpine-evergreen":"#5f8291",
  "glacial-water":"#5b9ebd","snowmelt":"#9bb5a2","temperate-forest":"#548a76",
  "waterfall-forest":"#6f9da0","lake-wetland":"#69909c","meadow":"#c2a774",
  "historic-road":"#bd9670","canyon":"#987a75","arcane-highland":"#a393b9"
 };
 const ns=Object.fromEntries(model.nodes.map(n=>[n.id,n]));
 const alt=model.worldDesign.alternateSnowForestRoutes.map(route=>{
  const set=new Set();
  for(let i=1;i<route.length;i++){
   const a=route[i-1],b=route[i];
   const e=model.edges.find(e=>(e.from===a&&e.to===b)||(e.from===b&&e.to===a));
   if(!e)throw Error("Unconnected alternative route "+a+"->"+b);
   set.add(e.id);
  }
  return set;
 });
 const fills=model.regions.map(r=>`<path d="${polygon(r.influencePolygon)}" fill="${rgb[r.biome]||"#87949b"}" fill-opacity=".43" stroke="${rgb[r.biome]||"#87949b"}" stroke-opacity=".48" stroke-width="1.5"/>`).join("\n");
 const contours=model.environment.contours.map(c=>`<path d="${dpath(c.line)}" stroke="${c.level>=5?"#e4eced":"#8aa3a2"}" stroke-width="1.9" stroke-dasharray="5 7" opacity=".65" fill="none"/>`).join("\n");
 const waters=model.waterways.map(w=>w.closedPolygon?
   `<path d="${polygon(w.closedPolygon)}" fill="#4383a5" fill-opacity=".85" stroke="#b6e4e4" stroke-width="2.2"/><path d="${polygon(w.islandPolygon)}" fill="#8aa17c" stroke="#e3d7b5" stroke-width="2.4"/><path d="${dpath(w.outflow)}" stroke="#3b99b7" stroke-width="12" stroke-linecap="round" fill="none"/>`:
   `<path d="${dpath(w.centerline)}" stroke="${w.id==="smugglers_chasm"?"#201c2c":"#2a5b7b"}" stroke-width="${w.id==="smugglers_chasm"?23:26}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${dpath(w.centerline)}" stroke="${w.id==="smugglers_chasm"?"#574757":"#5bb6d2"}" stroke-width="${w.id==="smugglers_chasm"?7:14}" fill="none" stroke-linecap="round"/>`
 ).join("\n");
 const roadBase=model.edges.map(e=>{
  const points=[ns[e.from].point,...e.via||[],ns[e.to].point];
  const color=e.kind.includes("road")?"#c7aa73":"#9f997c";
  return `<path d="${dpath(points)}" fill="none" stroke="#14232e" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/><path d="${dpath(points)}" fill="none" stroke="${color}" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round"/>`;
 }).join("\n");
 const palette=["#f3d594","#9bdbe7","#b4ddb1"];
 const routes=model.edges.map(e=>{
  const k=alt.findIndex(a=>a.has(e.id));
  if(k<0)return "";
  return `<path d="${dpath([ns[e.from].point,...e.via||[],ns[e.to].point])}" stroke="${palette[k]}" stroke-width="5.4" opacity=".94" stroke-linejoin="round" stroke-linecap="round" fill="none"/>`;
 }).join("\n");
 const crossingArt=model.edges.filter(e=>e.crossing).map(e=>{
  const line=[ns[e.from].point,...e.via||[],ns[e.to].point];
  const p=line[Math.floor(line.length/2)];
  return `<path d="${dpath(line)}" stroke="#fff5da" stroke-width="8" stroke-linecap="round" ${e.kind==="ford"?'stroke-dasharray="7 5"':""} fill="none"/><circle cx="${p[0]}" cy="${p[1]}" r="5.6" fill="#263747" stroke="#f7e8b7" stroke-width="1.8"/>`;
 }).join("\n");
 const major=new Set(["village","northwatch_plaza","colp_lodge","bridge_w","bridge_e","thaw_camp","greenwood_gate","greenwood_hearth","hermit","greenwood_south","falls_overlook","island","commons","market","oldroad_tower","ravine_bridge_w","cave_mouth","worldscar_ring"]);
 const dots=model.nodes.map(n=>`<circle cx="${n.point[0]}" cy="${n.point[1]}" r="${major.has(n.id)?5:2.7}" fill="${major.has(n.id)?"#fff1c9":"#b7bdab"}" stroke="#273646" stroke-width="${major.has(n.id)?2:1}"/>`).join("\n");
 const captions={
  hollowreach:["HOLLOWREACH",183,280],
  northwatch:["NORTHWATCH",475,146],
  coldpine:["COLDPINE RIDGE",157,115],
  frost_river:["FROSTBRIDGE RIVER",418,289],
  thawline:["THE THAWLINE",443,458],
  greenwood:["GREENWOOD",723,387],
  greenwood_falls:["GREENWOOD FALLS",617,623],
  mossmere:["MOSSMERE BASIN",699,727],
  heatherwood:["HEATHERWOOD",978,723],
  old_crown:["OLD CROWN ROAD",847,377],
  smugglers:["SMUGGLER'S RAVINE",983,552],
  worldscar:["WORLDSCAR UPLANDS",944,203]
 };
 const captionsSvg=model.regions.map(r=>{
  const [name,x,y]=captions[r.id]||[r.name,...r.center];
  return `<g transform="translate(${x},${y})"><rect x="-6" y="-16" width="${Math.round(name.length*7.5+15)}" height="23" rx="4" fill="#101923" fill-opacity=".82" stroke="#e4d3b6" stroke-opacity=".4"/><text x="0" y="0" font-family="Georgia,serif" font-size="12" font-weight="bold" letter-spacing="1" fill="#f6e6c6">${esc(name)}</text></g>`;
 }).join("\n");
 const locations=[
  ["Hollowreach",282,305,-84,25],["Greenwood clearing",727,430,-57,28],
  ["Joren's door",306,310,-3,30],["Smuggler's cave",1110,622,-109,25],
  ["Worldscar ring",1069,247,-92,-18],["Mossmere island",758,690,-33,-18]
 ];
 const locationLabels=locations.map(([name,x,y,dx,dy])=>`<text x="${x+dx}" y="${y+dy}" font-family="system-ui,sans-serif" font-size="11" fill="#fff4d8" stroke="#0d1c2b" stroke-width="3" paint-order="stroke">${esc(name)}</text>`).join("\n");
 const crosses=[["Northwatch span",341,198],["Frostbridge",363,328],["Stoneford",489,495],["Falls crossing",558,553],["Island bridge",682,660],["Ravine rope bridge",972,605]];
 const crossLabels=crosses.map(([name,x,y])=>`<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-size="10" fill="#eef5e5" stroke="#0e1e2e" stroke-width="3" paint-order="stroke">${esc(name)}</text>`).join("\n");
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1640 1030" role="img" aria-labelledby="maptitle mapdesc">
<title id="maptitle">Veilward complete outdoors topology master map, Phase 2 blueprint</title>
<desc id="mapdesc">BLUEPRINT NOT LIVE GAME ART: Twelve planned regions, roads, three independent snowy village to forest routes, lake island, canyon, visible bridges and fords, geographic terrain height contours.</desc>
<defs><linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#263c4a"/><stop offset="1" stop-color="#111d2a"/></linearGradient><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0H0V100" fill="none" stroke="#bdd5d7" stroke-opacity=".1"/></pattern></defs>
<rect width="1640" height="1030" fill="#0c1723"/>
<rect x="34" y="24" width="1570" height="986" rx="12" fill="#152534" stroke="#b99b67" stroke-width="2"/>
<text x="68" y="63" font-family="Georgia,serif" font-size="28" font-weight="bold" fill="#f4dfae" letter-spacing="3">VEILWARD — THE BROKEN SKY</text>
<text x="69" y="88" font-size="14" fill="#b7c5c4" font-family="system-ui,sans-serif">PHASE 2  •  COMPLETE OUTDOOR TOPOLOGY  •  SOURCE-GENERATED PLANNING MAP</text>
<g transform="translate(72,125)">
<rect width="1200" height="800" rx="7" fill="url(#paper)" stroke="#8b8d82" stroke-width="1.5"/>
<rect width="1200" height="800" fill="url(#grid)"/>
<g>${fills}</g>
<g>${contours}</g>
<g>${waters}</g>
<g>${roadBase}</g>
<g>${routes}</g>
<g>${crossingArt}</g>
<g>${dots}</g>
<g>${captionsSvg}</g>
<g>${locationLabels}${crossLabels}</g>
<path d="M24 62L24 16" stroke="#fff1cb" stroke-width="2"/><path d="M24 16L17 30L31 30Z" fill="#fff1cb"/><text x="16" y="11" fill="#fff1cb" font-weight="bold" font-size="14">N</text>
</g>
<g transform="translate(1302 145)" font-family="system-ui,sans-serif">
<text x="0" y="0" font-family="Georgia,serif" font-size="20" fill="#f4dfae">WORLD LAYOUT</text>
<text x="0" y="30" fill="#c4cfd0" font-size="13">12 macro-regions</text>
<text x="0" y="52" fill="#c4cfd0" font-size="13">48 named anchors</text>
<text x="0" y="74" fill="#c4cfd0" font-size="13">65 planned travel links</text>
<text x="0" y="96" fill="#c4cfd0" font-size="13">7 physical crossings</text>
<text x="0" y="118" fill="#c4cfd0" font-size="13">1 reachable lake island</text>
<path d="M0 152H275" stroke="#a98a57" opacity=".8"/>
<text x="0" y="182" font-family="Georgia,serif" font-size="20" fill="#f4dfae">TO GREENWOOD</text>
<path d="M0 214H49" stroke="#f3d594" stroke-width="5"/><text x="60" y="218" fill="#eee7d0" font-size="12">Main Frostbridge</text>
<path d="M0 252H49" stroke="#9bdbe7" stroke-width="5"/><text x="60" y="256" fill="#eee7d0" font-size="12">Northwatch ridge</text>
<path d="M0 290H49" stroke="#b4ddb1" stroke-width="5"/><text x="60" y="294" fill="#eee7d0" font-size="12">Southern Stoneford</text>
<path d="M0 326H275" stroke="#a98a57" opacity=".8"/>
<text x="0" y="356" font-family="Georgia,serif" font-size="20" fill="#f4dfae">SYMBOLS</text>
<path d="M0 383H49" stroke="#5bbed9" stroke-width="9"/><text x="60" y="387" fill="#c4cfd0" font-size="12">Glacial water</text>
<path d="M0 422H49" stroke="#e9d6a7" stroke-width="9"/><text x="60" y="426" fill="#c4cfd0" font-size="12">Bridge / raised ford</text>
<path d="M0 462H49" stroke="#b6bcaa" stroke-width="2" stroke-dasharray="5 5"/><text x="60" y="466" fill="#c4cfd0" font-size="12">Terrain contour</text>
<text x="0" y="510" fill="#aec0c4" font-size="12">Island access:</text>
<text x="0" y="535" fill="#ecf0df" font-size="12">Footbridge + stone causeway</text>
<text x="0" y="582" fill="#aec0c4" font-size="12">Actual scene art/collision:</text>
<text x="0" y="605" fill="#ecf0df" font-size="12">NOT BUILT IN PHASE 2</text>
<path d="M0 643H275" stroke="#a98a57" opacity=".8"/>
<text x="0" y="675" fill="#dfd0ab" font-size="12">MANDATORY REVIEW AFTER PHASE 9:</text>
<text x="0" y="701" fill="#eef1e5" font-size="12">Creator approves outdoor visuals</text>
<text x="0" y="723" fill="#eef1e5" font-size="12">before Phase 10 can begin.</text>
</g>
<text x="72" y="962" font-family="system-ui,sans-serif" font-size="13" fill="#aebdbf">BLUEPRINT SOURCE: world_blueprint.json • X EAST / Y SOUTH • NOT A PLAYABLE GAME SCREENSHOT</text>
<text x="72" y="988" font-family="system-ui,sans-serif" font-size="12" fill="#a7b7b9">Entire outdoor world built and rendered in Phases 3–9; creator reviews appearance after Phase 9.</text>
</svg>
`;
};
if(require.main===module){const map=JSON.parse(fs.readFileSync("docs/overworld/world_blueprint.json","utf8"));fs.writeFileSync("docs/overworld/MASTER_MAP.svg",render(map));console.log("Rendered world planning SVG from topology data.")}
module.exports={render};
