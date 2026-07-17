import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  SESv2Client,
  PutSuppressedDestinationCommand,
} from "@aws-sdk/client-sesv2";
import {
  SNSPayload,
  SESBounceMessage,
  SESComplaintMessage,
} from "@/lib/ses/types";

const config = { region: process.env.AWS_REGION };
const client = new SESv2Client(config);
const verify = crypto.createVerify("sha1");

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validate SigningCertURL hostname

    const signingCertURL = new URL(payload.SigningCertURL);
    validateHostname(signingCertURL);

    // Handle Notification

    if (payload.Type === "Notification") {
      handleNotification(payload);
    }

    // Handle Subscription confirmation

    if (payload.Type === "SubscriptionConfirmation") {
      handleConfirmation(payload);
    }

    if (
      payload.Type != "Notification" &&
      payload.Type != "SubscriptionConfirmation"
    ) {
      console.warn("200 Unrecognised Message Type");
      return NextResponse.json({ response: "200 Success" }, { status: 200 });
    }
  } catch {
    console.error({ message: "Payload not found" });
    return NextResponse.json(
      { error: "500 Internal Server Error" },
      { status: 500 },
    );
  }
}

async function validateHostname(signingCertURL: URL) {
  if (!signingCertURL.hostname.endsWith(".amazonaws.com")) {
    console.error({
      message: "Invalid signingCertURL hostname",
      hostname: signingCertURL.hostname,
    });
    return NextResponse.json({ response: "400 Bad Request" }, { status: 400 });
  }
}

async function handleNotification(payload: SNSPayload) {
  const code = await fetchPEMCert(payload);

  verifyNotification(payload, code);

  const message = JSON.parse(payload.Message);

  if (message.notificationType === "Complaint") {
    handleComplaint(message);
  }

  if (message.notificationType === "Bounce") {
    handleBounce(payload, message);
  }
  return NextResponse.json({ response: "200 Success" }, { status: 200 });
}

async function handleConfirmation(payload: SNSPayload) {
  const code = await fetchPEMCert(payload);

  verifyConfirmation(payload, code);

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

async function fetchPEMCert(payload: SNSPayload) {
  // Fetch PEMCert from SigningCertURL

  const resp = await fetch(payload.SigningCertURL);
  const cert = await resp.text();

  return cert;
}

function verifyNotification(payload: SNSPayload, code: string) {
  // Feed string of payload fields into verifier

  verify.update(buildNotificationString(payload));

  // Fetch PEM certificate and verify against signature from payload

  if (verify.verify(code, Buffer.from(payload.Signature, "base64")) == false) {
    console.error({
      message: "PEM certificate does not match payload signature",
    });
    return NextResponse.json({ response: "400 Bad Request" }, { status: 400 });
  }
}

function verifyConfirmation(payload: SNSPayload, code: string) {
  // Feed string of payload fields into verifier

  verify.update(buildConfirmationString(payload));

  // Fetch PEM certificate and verify against signature from payload

  if (verify.verify(code, Buffer.from(payload.Signature, "base64")) == false) {
    console.error({
      message: "PEM certificate does not match payload signature",
    });
    return NextResponse.json({ response: "400 Bad Request" }, { status: 400 });
  }
}

async function handleComplaint(message: SESComplaintMessage) {
  const complainedRecipients = message.complaint.complainedRecipients;

  for (let i = 0; i < complainedRecipients.length; i++) {
    const command = new PutSuppressedDestinationCommand({
      EmailAddress: complainedRecipients[i].emailAddress,
      Reason: "COMPLAINT",
    });

    await client.send(command);
  }
}

async function handleBounce(payload: SNSPayload, message: SESBounceMessage) {
  if (message.bounce.bounceType === "Permanent") {
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
