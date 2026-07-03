self.addEventListener("push", function (event) {
  const data = event.data?.json() || {};

  const title = data.title || "CardYar";
  const options = {
    body: data.body || "نوتیفیکیشن جدید",
    // icon: "/icon-192.png",
    // badge: "/badge-72.png",
    data: data.url || "/",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data));
});
