/* VEILWARD offline cache v1.0 — load the new eight-direction full sprite atlas.
   Network-first HTML/JS, versioned atlas, stable image cache.
   Older installed-app caches removed when this worker activates. */
const CACHE="veilward-hollowreach-v100-full-hero-atlas";
const FILES=[
 "./","./index.html","./game.js?v=9","./navigation.js?v=7",
 "./visual.js?v=20","./visual.css?v=7","./manifest.webmanifest","./icon.svg",
 "./assets/village_v06_clear.jpg?art=10","./assets/wilds_clean.jpg?art=10",
 "./assets/cave_clean.jpg?art=10","./assets/forge.jpg?art=10",
 "./assets/actors_v07.png?art=10",
 "./assets/hero_full_8way_v10.png?art=10"
];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(async cache=>{
  // Individual fetches prevent an optional image from blocking the entire install.
  await Promise.allSettled(FILES.map(async url=>{try{await cache.add(url)}catch(e){}}));
 }).then(()=>self.skipWaiting()))
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(
  keys.filter(key=>key.startsWith("veilward-")&&key!==CACHE).map(key=>caches.delete(key))
 )).then(()=>self.clients.claim()))
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET"||new URL(request.url).origin!==location.origin)return;
 event.respondWith(fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{})}
  return response;
 }).catch(()=>caches.match(request).then(response=>response||Response.error())))
});