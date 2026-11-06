if (navigator.userAgent.includes("Firefox")) {
  Object.defineProperty(globalThis, "crossOriginIsolated", {
    value: true,
    writable: false,
  });
}

importScripts("./MDPPEvE.js");

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const pageIsolation = (search) => new URLSearchParams(search).get("mode") === "dip"
  ? { "Document-Isolation-Policy": "isolate-and-require-corp" }
  : { "Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "require-corp" };

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.mode !== "navigate") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const scope = new URL(self.registration.scope).pathname;
  if (url.pathname !== `${scope}blox.html`) return;
  event.respondWith(
    fetch(request).then((response) => {
      if (response.status !== 200) return response;
      const headers = new Headers(response.headers);
      for (const [name, value] of Object.entries(pageIsolation(url.search))) headers.set(name, value);
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }),
  );
});

self.addEventListener("fetch", (event) => {
  if (self.$ha53s40phklcg6bzpk.shouldRoute(event)) {
    event.respondWith(self.$ha53s40phklcg6bzpk.route(event));
  }
});
