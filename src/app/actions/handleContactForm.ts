"use server";

import { z } from "zod";
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-ses";
import { classifyError, SESResult } from "@/lib/ses/classifyError";

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

type ContactFields = z.infer<typeof schema>;

export async function handleContactForm(
  prevState: SESResult | null,
  formData: FormData,
): Promise<SESResult> {
  const noreplyEmail = process.env.NOREPLY_EMAIL_ADDRESS;
  const hanEmail = process.env.HAN_EMAIL_ADDRESS;

  if (!noreplyEmail)
    return {
      success: false,
      errors: {},
      errorCode: "CONFIG_ERROR",
      userMessage: "Error: Invalid or missing sender email address",
      internalMessage: "550: Invalid or missing sender email address",
      retryable: false,
    };

  if (!hanEmail)
    return {
      success: false,
      errors: {},
      errorCode: "CONFIG_ERROR",
      userMessage: "Error: Invalid or missing recipient email address",
      internalMessage: "550: Invalid or missing recipient email address",
      retryable: false,
    };

  const validatedFields = validateInput(formData);

  if (!validatedFields.success) {
    const invalidFieldErrors = {
      forename: validatedFields.error.flatten().fieldErrors?.forename,
      surname: validatedFields.error.flatten().fieldErrors?.surname,
      emailAddress: validatedFields.error.flatten().fieldErrors?.emailAddress,
      subject: validatedFields.error.flatten().fieldErrors?.subject,
      message: validatedFields.error.flatten().fieldErrors?.message,
    };

    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      errorCode: "FORM_VALIDATION_ERROR",
      userMessage: "Some details are incorrect or missing, please try again",
      internalMessage: `[SES] FormValidationError: 
      ${invalidFieldErrors.forename},
      ${invalidFieldErrors.surname},
      ${invalidFieldErrors.emailAddress},
      ${invalidFieldErrors.subject},
      ${invalidFieldErrors.message}
      `,
      retryable: false,
    };
  }

  const validationResult = validatedFields.data;

  const config = { region: process.env.AWS_REGION };
  const client = new SESClient(config);

  const contactEmail = generateContactEmail(
    validationResult,
    noreplyEmail,
    hanEmail,
  );
  const confirmationEmail = generateConfirmationEmail(
    validationResult,
    hanEmail,
  );

  return await sendEmail(client, contactEmail, confirmationEmail);
}

function validateInput(formData: FormData) {
  const validatedFields = schema.safeParse({
    forename: formData.get("forename"),
    surname: formData.get("surname"),
    emailAddress: formData.get("emailAddress"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  return validatedFields;
}

function generateContactEmail(
  validatedFields: ContactFields,
  from: string,
  to: string,
): SendEmailCommandInput {
  const contactEmail = {
    Source: from,
    Destination: {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: validatedFields.subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `
            <div style="font-family: Helevetica, sans-serif; font-size: 16px">
              <p>Message from ${validatedFields.forename} ${validatedFields.surname}</p>
              <p>Sender's email address: ${validatedFields.emailAddress}</p>
              <br></br>
              <p>${validatedFields.message}</p>
            </div>
            `,
          Charset: "UTF-8",
        },
        Text: {
          Data: `Message from ${validatedFields.forename} ${validatedFields.surname} \n\n ${validatedFields.message}`,
          Charset: "UTF-8",
        },
      },
    },
    ReplyToAddresses: [],
  };

  return contactEmail;
}

function generateConfirmationEmail(
  validatedFields: ContactFields,
  from: string,
): SendEmailCommandInput {
  const confirmationEmail = {
    Source: from,
    Destination: {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [validatedFields.emailAddress],
    },
    Message: {
      Subject: {
        Data: `Re: ${validatedFields.subject}`,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `
            <div style="font-family: Helevetica, sans-serif; font-size: 16px">
              <p>Hi ${validatedFields.forename}, \n</p>
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

  return confirmationEmail;
}

async function sendEmail(
  client: SESClient,
  contactEmail: SendEmailCommandInput,
  confirmationEmail: SendEmailCommandInput,
) {
  try {
    const command = new SendEmailCommand(contactEmail);
    const response = await client.send(command);

    const result = {
      success: true,
      messageId: response.MessageId,
      errors: {},
      userMessage: "Your message has been sent successfully.",
      internalMessage: `[SES] Email sent. MessageId: ${response.MessageId}`,
      retryable: false,
    };
    console.info(result.internalMessage);

    const confirmationCommand = new SendEmailCommand(confirmationEmail);
    const confirmationResponse = await client.send(confirmationCommand);

    return result;
  } catch (error) {
    return classifyError(error);
  }
}
