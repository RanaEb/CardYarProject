"use client";

import Button from "@/app/components/ui/button";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if ("Notification" in window) {
      const saved = localStorage.getItem("notificationsEnabled") === "true";

      setEnabled(Notification.permission === "granted" && saved);
    }
  }, []);

  async function enableNotifications() {
    if (enabled) {
      alert("نوتیفیکیشن فعال است ✅");
      return;
    }
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

      let subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        console.log("Subscription already exists");
      } else {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          ),
        });
      }

      await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });
      localStorage.setItem("notificationsEnabled", "true");
      setEnabled(true);

      alert("نوتیفیکیشن فعال شد ✅");
    } catch (err) {
      console.error("Notification error:", err);
      alert("خطا در فعال‌سازی نوتیفیکیشن");
    }
  }

  return (
    <button
      onClick={enableNotifications}
      type="button"
      title={enabled ? "نوتیفیکیشن فعال است" : "فعال‌سازی نوتیفیکیشن"}
      className={`flex h-14 w-14 items-center justify-center rounded-full transition
        ${
          enabled
            ? "text-[#0077C8] bg-[#EAF4FF]"
            : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#0077C8]"
        }`}
    >
      <Bell size={28} />
    </button>
  );
}
