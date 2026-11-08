/* VEILWARD 1.3.32 R25 — Greenwood seamless grounded material and canopy; original art protected.
   Use network-first for HTML/scripts, and preserve offline assets. */
const BUILD="1.3.32";
const CACHE="veilward-hollowreach-v1332-source-glade-habitat-r25b-r26";
const FILES=[
 "./","./index.html","./combat.js?v=2","./quest.js?v=1","./world_geometry.js?v=1","./world_climate.js?v=4","./world_footprint.js?v=5","./world_setpieces.js?v=3","./world_architecture_atlas.js?v=1","./world_raster_pilot.js?v=28","./assets/hollowreach_pilot_sprites_v1.png?v=1","./assets/hollowreach_bridge_stairs_lamp_v2.png?v=1","./assets/hollowreach_ground_painted_v2.webp?v=1","./assets/hollowreach_neighborhood_r6.png?v=1","./assets/hollowreach_environment_r15.webp?v=1","./world_greenwood_art.js?v=9&rev=26","./assets/greenwood_oak_r18.avif?v=1","./assets/greenwood_pine_r18.avif?v=1","./assets/greenwood_ferns_r18.avif?v=1","./assets/greenwood_rock_r18.avif?v=1","./world_greenwood_sanctuary.js?v=3","./assets/greenwood_hermit_sanctuary_r21.webp?v=1","./world_greenwood_hearth.js?v=1","./assets/greenwood_hearth_cottage_r23.webp?v=1","./world_illustration.js?v=26&rev=25b","./terrain_art.js?v=32&rev=25","./world_routes.js?v=27&rev=25b","./world_stream.js?v=32","./world_review.js?v=4","./docs/overworld/world_blueprint.json?v=1","./docs/overworld/terrain_geometry.json?v=4","./docs/overworld/outdoor_footprint.json?v=1","./game.js?v=53","./navigation.js?v=11",
 "./visual.js?v=33","./visual.css?v=15","./manifest.webmanifest?v=1332","./icon.svg",
 "./assets/village_v06_clear.jpg?art=23","./assets/wilds_clean.jpg?art=23",
 "./assets/cave_clean.jpg?art=23","./assets/forge.jpg?art=23",
 "./assets/actors_v07.png?art=23",
 "./assets/warden_hal_v13.png?art=23",
 "./assets/hero_full_8way_v10.png?art=23",
 "./assets/hero_approved_8way_v12.webp?art=23",
 "./assets/hero_front_adult_v11.png?art=23"
];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(async cache=>{
  await Promise.allSettled(FILES.map(url=>cache.add(url)));
 }).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(name=>name.startsWith("veilward-")&&name!==CACHE)
   .map(name=>caches.delete(name)));
  await self.clients.claim();
  // Crucial: an already-open old iPhone PWA does not listen for controller
  // changes. Navigate its window once on activation, even if old JS is running.
  const windows=await self.clients.matchAll({type:"window",includeUncontrolled:true});
  await Promise.allSettled(windows.map(async client=>{
   try{
    const url=new URL(client.url);
    if(!url.href.startsWith(self.registration.scope))return;
    if(url.searchParams.get("vwbuild")===BUILD)return;
    url.searchParams.set("vwbuild",BUILD);
    let navigated=null;
    if(typeof client.navigate==="function")navigated=await client.navigate(url.toString());
    if(!navigated)client.postMessage({type:"VEILWARD_BUILD_UPDATED",build:BUILD});
   }catch(error){console.warn("Client refresh failed",error)}
  }));
 })());
});
self.addEventListener("message",event=>{
 if(event.data?.type==="SKIP_WAITING")self.skipWaiting();
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET"||new URL(request.url).origin!==location.origin)return;
 const url=new URL(request.url);
 const core=request.mode==="navigate"||/[.](?:html|js|json|webmanifest)$/.test(url.pathname);
 event.respondWith(
  fetch(request,core?{cache:"no-store"}:undefined).then(response=>{
   if(response.ok){
    const copy=response.clone();
    event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{}));
   }
   return response;
  }).catch(async()=>{
   const matched=await caches.match(request);
   if(matched)return matched;
   // A versioned launch URL must still open offline when only the clean
   // index.html URL is precached; query strings are separate cache keys.
   if(request.mode==="navigate"){
    const fallback=new URL("./index.html",self.registration.scope).toString();
    return await caches.match(fallback)||Response.error();
   }
   return Response.error();
  })
 );
});
