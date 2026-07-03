import webpush from "web-push";
import { NextResponse } from "next/server";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

export async function POST() {
  const payload = JSON.stringify({
    title: "CardYar",
    body: "یادآوری مرور فلش کارت",
  });

  for (const sub of global.subscriptions || []) {
    await webpush.sendNotification(sub, payload);
  }

  return Response.json({ success: true });
}
