/* ======================================================
   YVRIDIO'09 — Service Worker (Web Push)
   ====================================================== */

const SW_VERSION = "yvridio-sw-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* Terima push dari server */
self.addEventListener("push", (event) => {
  let data = {
    title: "YVRIDIO'09",
    body: "One class. One orbit. One story.",
    url: "/",
    tag: "yvridio-push"
  };

  try {
    if (event.data) {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    }
  } catch (e) {
    try {
      data.body = event.data ? event.data.text() : data.body;
    } catch (_) {}
  }

  const options = {
    body: data.body || "",
    icon: data.icon || "/assets/images/favicon.png",
    badge: data.badge || "/assets/images/favicon-32.png",
    tag: data.tag || "yvridio-push",
    renotify: !!data.renotify,
    data: {
      url: data.url || "/"
    },
    vibrate: [120, 60, 120],
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "YVRIDIO'09",
      options
    )
  );
});

/* Klik notifikasi → buka website */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true
      });

      for (const client of allClients) {
        if ("focus" in client) {
          await client.focus();
          if ("navigate" in client) {
            try {
              await client.navigate(targetUrl);
            } catch (_) {}
          }
          return;
        }
      }

      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })()
  );
});
