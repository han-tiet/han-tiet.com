"use server";

import { z } from "zod";

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

  // console.log("Fields ", JSON.stringify(validatedFields)) // log to check if zod is silently blocking

  if (!validatedFields.success) {
    return console.log({
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    });
  }

  const results = JSON.stringify(validatedFields);

  console.log("Success ", results);

  return { success: true };
}
