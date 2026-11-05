/* VEILWARD 1.2.2 — mobile app update reliability on Home Screen and Safari.
   Use network-first for HTML/scripts, and preserve offline assets. */
const BUILD="1.2.2";
const CACHE="veilward-hollowreach-v122-mobile-reliability";
const FILES=[
 "./","./index.html","./game.js?v=14","./navigation.js?v=7",
 "./visual.js?v=29","./visual.css?v=8","./manifest.webmanifest?v=122","./icon.svg",
 "./assets/village_v06_clear.jpg?art=19","./assets/wilds_clean.jpg?art=19",
 "./assets/cave_clean.jpg?art=19","./assets/forge.jpg?art=19",
 "./assets/actors_v07.png?art=19",
 "./assets/warden_hal_v13.png?art=19",
 "./assets/hero_full_8way_v10.png?art=19",
 "./assets/hero_approved_8way_v12.webp?art=19",
 "./assets/hero_front_adult_v11.png?art=19"
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
 const core=request.mode==="navigate"||/[.](?:html|js|webmanifest)$/.test(url.pathname);
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
