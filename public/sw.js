self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? "New match!", {
      body: data.body ?? "",
      icon: "/icon-192.png",
      data: { url: data.url ?? "/matches" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url ?? "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(async (clientList) => {
        for (const client of clientList) {
          if ("navigate" in client) {
            await client.navigate(url);
            return client.focus();
          }
        }

        return clients.openWindow(url);
      }),
  );
});