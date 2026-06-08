"use server";

import { z } from "zod";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const schema = z.object({
  forename: z
    .string()
    .min(1, "Forename must not be empty")
    .max(30, "Forename must not have more than 30 characters"),
  surname: z
    .string()
    .min(1, "Surname must not be empty")
    .max(30, "Surname must not have more than 30 characters"),
  emailAddress: z.email(),
  subject: z
    .string()
    .min(1, "Subject must not be empty")
    .max(50, "Subject must not have more than 50 characters"),
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
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      errorCode: "FORM_VALIDATION_ERROR",
    };
  }

  const contactForm = validatedFields.data;

  const config = { region: process.env.AWS_REGION };
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
        Html: {
          Data: `
            <div style="font-family: Helevetica, sans-serif; font-size: 16px">
              <p>Message from ${contactForm.forename} ${contactForm.surname}</p>
              <br></br>
              <p>${contactForm.message}</p>
            </div>
            `,
          Charset: "UTF-8",
        },
        Text: {
          Data: `Message from ${contactForm.forename} ${contactForm.surname} \n\n ${contactForm.message}`,
          Charset: "UTF-8",
        },
      },
    },
    ReplyToAddresses: [],
  };

  const emailConfirmation = {
    Source: process.env.EMAIL_ADDRESS_DEST,
    Destination: {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [contactForm.emailAddress],
    },
    Message: {
      Subject: {
        Data: `Re: ${contactForm.subject}`,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `
            <div style="font-family: Helevetica, sans-serif; font-size: 16px">
              <p>Hi ${contactForm.forename}, \n</p>
              <p>Thanks for getting in touch!</p>
              <p>I have received your email and will send a reply soon.</p>
              <p></p>
              <p>Kind regards</p>
              <p>Han</p>
            </div>
            `,
          Charset: "UTF-8",
        },
        Text: {
          Data: `Hi sender, thanks for getting in touch! 
          I have received your email and will send a reply soon. \n\n
          Kind regards \n
          Han`,
          Charset: "UTF-8",
        },
      },
    },
    ReplyToAddresses: [],
  };

  const command = new SendEmailCommand(input);
  const response = await client.send(command);

  if (response.$metadata.httpStatusCode != 200) {
    return {
      success: false,
      errors: {},
      errorCode: "FORM_SUBMISSION_ERROR",
    };
  } else {
    const confirmationCommand = new SendEmailCommand(emailConfirmation);
    const confirmationResponse = await client.send(confirmationCommand);
    return { success: true, errors: {}, errorCode: null };
  }
}
