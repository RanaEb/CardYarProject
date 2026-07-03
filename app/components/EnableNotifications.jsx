"use client";

import Button from "@/app/components/ui/button";

export default function EnableNotifications() {
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  async function enableNotifications() {
    try {
      if (!("Notification" in window)) {
        alert("مرورگر شما از نوتیفیکیشن پشتیبانی نمی‌کند");
        return;
      }

      if (!("serviceWorker" in navigator)) {
        alert("Service Worker در این مرورگر فعال نیست");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert("اجازه نوتیف داده نشد");
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        ),
      });

      await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      alert("نوتیفیکیشن فعال شد ✅");
    } catch (err) {
      console.error("Notification error:", err);
      alert("خطا در فعال‌سازی نوتیفیکیشن");
    }
  }

  return (
    <Button variant="danger" size="lg" onClick={enableNotifications}>
      فعال‌سازی نوتیفیکیشن
    </Button>
  );
}
