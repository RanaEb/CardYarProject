import { NextResponse } from "next/server";

let subscriptions = [];

export async function POST(req) {
  const sub = await req.json();
  subscriptions.push(sub);

  return NextResponse.json({ success: true });
}
