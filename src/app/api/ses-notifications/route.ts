import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  SESv2Client,
  PutSuppressedDestinationCommand,
} from "@aws-sdk/client-sesv2";
import { SNSPayload } from "@/lib/ses/types";

const config = { region: process.env.AWS_REGION };
const client = new SESv2Client(config);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validate SigningCertURL hostname

    const signingCertURL = new URL(payload.SigningCertURL);

    if (!signingCertURL.hostname.endsWith(".amazonaws.com")) {
      return NextResponse.json(
        { response: "400 Bad Request" },
        { status: 400 },
      );
    }

    const resp = await fetch(payload.SigningCertURL);
    const code = await resp.text();

    const verify = crypto.createVerify("sha1");

    if (payload.Type === "Notification") {
      // Feed string of payload fields into verifier

      verify.update(buildNotificationString(payload));

      // Fetch PEM certificate and verify against signature from payload

      if (
        verify.verify(code, Buffer.from(payload.Signature, "base64")) == false
      ) {
        return NextResponse.json(
          { response: "400 Bad Request" },
          { status: 400 },
        );
      }

      const message = JSON.parse(payload.Message);

      if (message.notificationType == "Complaint") {
        const complainedRecipients = message.complaint.complainedRecipients;

        for (let i = 0; i < complainedRecipients.length; i++) {
          const command = new PutSuppressedDestinationCommand({
            EmailAddress: complainedRecipients[i].emailAddress,
            Reason: "COMPLAINT",
          });

          await client.send(command);
        }
      }

      if (message.notificationType == "Bounce") {
        if (message.bounce.bounceType == "Permanent") {
          const bouncedRecipients = message.bounce.bouncedRecipients;

          for (let i = 0; i < bouncedRecipients.length; i++) {
            const command = new PutSuppressedDestinationCommand({
              EmailAddress: bouncedRecipients[i].emailAddress,
              Reason: "BOUNCE",
            });

            await client.send(command);
          }
        } else {
          const bouncedRecipients = message.bounce.bouncedRecipients;

          for (let i = 0; i < bouncedRecipients.length; i++) {
            const emailAddress = bouncedRecipients[i].emailAddress.split("@");

            console.warn({
              bounceType: message.bounce.bounceType,
              bounceSubType: message.bounce.bounceSubType,
              emailAddress: emailAddress[1],
              diagnosticCode: bouncedRecipients[i].diagnosticCode,
              action: bouncedRecipients[i].action,
              messageId: payload.MessageId,
              originalMessageId: message.mail.messageId,
            });
          }
        }
      }
      return NextResponse.json({ response: "200 Success" }, { status: 200 });
    }

    if (payload.Type === "SubscriptionConfirmation") {
      verify.update(buildConfirmationString(payload));

      if (
        verify.verify(code, Buffer.from(payload.Signature, "base64")) == false
      ) {
        return NextResponse.json(
          { response: "400 Bad Request" },
          { status: 400 },
        );
      }
      const resp = await fetch(payload.SubscribeURL);

      if (!resp.ok) {
        console.error({
          message: "Failed to confirm SNS subscription",
          subscribeURL: payload.SubscribeURL,
          status: resp.status,
        });
        return NextResponse.json(
          { response: "500 Internal Sever Error" },
          { status: 500 },
        );
      }

      return NextResponse.json({ response: "200 Success" }, { status: 200 });
    }

    if (
      payload.Type != "Notification" &&
      payload.Type != "SubscriptionConfirmation"
    ) {
      console.warn("200 Unrecognised Message Type");
      return NextResponse.json({ response: "200 Success" }, { status: 200 });
    }
  } catch {
    return NextResponse.json(
      { error: "500 Internal Server Error" },
      { status: 500 },
    );
  }
}

function buildNotificationString(payload: SNSPayload): string {
  return (
    [
      "Message",
      payload.Message,
      "MessageId",
      payload.MessageId,
      "Timestamp",
      payload.Timestamp,
      "TopicArn",
      payload.TopicArn,
      "Type",
      payload.Type,
    ].join("\n") + "\n"
  );
}

function buildConfirmationString(payload: SNSPayload): string {
  return (
    [
      "Message",
      payload.Message,
      "MessageId",
      payload.MessageId,
      "SubscribeURL",
      payload.SubscribeURL,
      "Timestamp",
      payload.Timestamp,
      "Token",
      payload.Token,
      "TopicArn",
      payload.TopicArn,
      "Type",
      payload.Type,
    ].join("\n") + "\n"
  );
}
