import { NextResponse } from "next/server";
import crypto from "crypto";
import { PutSuppressedDestinationCommand } from "@aws-sdk/client-sesv2";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const resp = await fetch(payload.SigningCertURL);
    const code = await resp.text();

    const verify = crypto.createVerify("sha1");
    verify.update(code);

    if (verify.verify(code, payload.Signature) !== true) {
      return NextResponse.json(
        { response: "400 Bad Request" },
        { status: 400 },
      );
    }

    if (payload.Type === "SubscriptionConfirmation") {
      const resp = await fetch(payload.SubscribeURL);

      return NextResponse.json({ response: "Success" }, { status: 200 });
    }

    if (payload.Type === "Notification") {
      const message = JSON.parse(payload.Message);

      if (message.notificationType == "Complaint") {
        const complainedRecipients = message.complaint.complainedRecipients;

        for (let i = 0; i < complainedRecipients.length; i++) {
          new PutSuppressedDestinationCommand({
            EmailAddress: complainedRecipients[i],
            Reason: "COMPLAINT",
          });
        }
      }

      if (message.notificationType == "Bounce") {
        const bouncedRecipients = message.bounce.bouncedRecipients;

        for (let i = 0; i < bouncedRecipients.length; i++) {
          new PutSuppressedDestinationCommand({
            EmailAddress: bouncedRecipients[i],
            Reason: "BOUNCE",
          });
        }
      }
    }
  } catch {
    return NextResponse.json(
      { error: "500 Internal Server Error" },
      { status: 500 },
    );
  }
}
