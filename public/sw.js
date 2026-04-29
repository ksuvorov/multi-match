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
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((list) => {
      const url = event.notification.data?.url ?? "/";
      const win = list.find((c) => "focus" in c);
      return win ? win.focus() : clients.openWindow(url);
    })
  );
});