const CACHE_NAME = `push notifications`;

// Use the install event to pre-cache all initial resources.
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(["/", "/converter.js", "/converter.css"]);
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      if (event.request.method === "GET") {
        // Cache and serve GET requests
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        } else {
          try {
            const fetchResponse = await fetch(event.request);

            // Cache the response for future use
            cache.put(event.request, fetchResponse.clone());

            return fetchResponse;
          } catch (e) {
            // The network failed.
          }
        }
      } else {
        // Handle other types of requests (e.g., POST) as needed
        // You may choose to ignore them or handle them differently
      }
    })()
  );
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
  });
});
