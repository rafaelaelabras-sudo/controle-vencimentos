const CACHE='vencimentos-publico-v7';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('vencimentos-publico-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const request=event.request;const url=new URL(request.url);const isAppPage=url.origin===location.origin&&(url.pathname.endsWith('/')||url.pathname.endsWith('/index.html'));
 if(isAppPage){event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response}).catch(()=>caches.open(CACHE).then(cache=>cache.match(request)).then(cached=>cached||cache.match('./index.html'))));return}
 event.respondWith(caches.open(CACHE).then(cache=>cache.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok)cache.put(request,response.clone());return response})).catch(()=>caches.match('./index.html'))))});
