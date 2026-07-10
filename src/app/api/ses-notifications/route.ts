"use server";

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function handleSESNotification(request: Request) {
  try {
    const payload = await request.json();

    if (payload.type === "SubscriptionConfirmation" || "Notification") {
      const verify = crypto.createVerify(payload.signingCertURL);

      if (verify) {
        return NextResponse.json({ response: "Success" }, { status: 200 });
      } else {
        return NextResponse.json(
          { response: "400 Bad Request" },
          { status: 400 },
        );
      }
    } else {
      return NextResponse.json(
        { response: "400 Bad Request" },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "500Internal Server Error" },
      { status: 500 },
    );
  }
}
