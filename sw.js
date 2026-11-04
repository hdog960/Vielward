/* Veilward v0.5 — golden reference rebuilt outpost and real character sprites.
   Network-first fetch ensures Home Screen installs receive corrections. */
const CACHE="veilward-hollowreach-v051-golden-reset";
const FILES=["./","./index.html","./game.js?v=8","./navigation.js?v=7","./visual.js?v=7","./visual.css?v=7","./manifest.webmanifest","./icon.svg","./assets/village_golden_v05.jpg?art=5","./assets/wilds_clean.jpg?art=5","./assets/cave_clean.jpg?art=5","./assets/actors_clean_v05.png?art=5"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("veilward-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{if(event.request.method!=="GET"||new URL(event.request.url).origin!==location.origin)return;event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{})}return response}).catch(()=>caches.match(event.request)))})