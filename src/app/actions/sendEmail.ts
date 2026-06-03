"use server";

import { z } from "zod";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const schema = z.object({
  forename: z
    .string()
    .min(1, "forename must not be empty")
    .max(30, "forename must not have more than 30 characters"),
  surname: z
    .string()
    .min(1, "Surname must not be empty")
    .max(30, "Surname must not have more than 30 characters"),
  emailAddress: z.email(),
  subject: z
    .string()
    .min(1, "Subject must not be empty")
    .max(50, "Surname must not have more than 50 characters"),
  message: z
    .string()
    .min(1, "Message must not be empty")
    .max(5000, "Message is too long"),
});

export async function sendEmail(prevState: FormData, formData: FormData) {
  const validatedFields = schema.safeParse({
    forename: formData.get("forename"),
    surname: formData.get("surname"),
    emailAddress: formData.get("emailAddress"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return console.log({
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    });
  }

  const contactForm = validatedFields.data;

  const config = {region: "us-east-1"};
  const client = new SESClient(config);

  const input = {
    Source: contactForm.emailAddress,
    Destination: {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [process.env.EMAIL_ADDRESS_DEST],
    },
    Message: {
      Subject: {
        Data: contactForm.subject,
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: `Message from ${contactForm.forename} ${contactForm.surname} \n\n ${contactForm.message}`,
          Charset: "UTF-8",
        },
      },
    },
    ReplyToAddresses: [],
  };
  const command = new SendEmailCommand(input);
  const response = await client.send(command);

  return { success: true, response };
}
