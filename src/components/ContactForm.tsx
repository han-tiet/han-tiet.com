"use client";

import { useActionState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { sendEmail } from "@/app/actions/sendEmail";

const initialState = {
  success: false,
  errors: {},
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendEmail,
    initialState,
  );

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <Input
            id="forename"
            name="forename"
            aria-describedby={
              state.errors?.forename ? "forename-error" : undefined
            }
            type="input"
            placeholder="Forename"
            className="border-[2px] rounded-[8px]"
            autoComplete="off"
          />
          {state.errors?.forename && (
            <span
              id="forename-error"
              className="text-[12px]"
              role="alert"
              style={{ color: "red" }}
            >
              {state.errors?.forename[0]}
            </span>
          )}
        </Field>
        <Field>
          <Input
            id="surname"
            name="surname"
            aria-describedby={
              state.errors?.surname ? "surname-error" : undefined
            }
            type="input"
            placeholder="Surname"
            className="border-[2px] rounded-[8px]"
            autoComplete="off"
          />
          {state.errors?.surname && (
            <span
              id="surname-error"
              className="text-[12px]"
              role="alert"
              style={{ color: "red" }}
            >
              {state.errors?.surname[0]}
            </span>
          )}
        </Field>
        <Field>
          <Input
            id="emailAddress"
            name="emailAddress"
            aria-describedby={
              state.errors?.emailAddress ? "emailAddress-error" : undefined
            }
            type="input"
            placeholder="Email Address"
            className="border-[2px] rounded-[8px]"
            autoComplete="off"
          />
          {state.errors?.emailAddress && (
            <span
              id="email-address-error"
              className="text-[12px]"
              role="alert"
              style={{ color: "red" }}
            >
              {state.errors?.emailAddress[0]}
            </span>
          )}
        </Field>
        <Field>
          <Input
            id="subject"
            name="subject"
            aria-describedby={
              state.errors?.subject ? "subject-error" : undefined
            }
            type="input"
            placeholder="Subject"
            className="border-[2px] rounded-[8px]"
            autoComplete="off"
          />
          {state.errors?.subject && (
            <span
              id="subject-error"
              className="text-[12px]"
              role="alert"
              style={{ color: "red" }}
            >
              {state.errors?.subject[0]}
            </span>
          )}
        </Field>
        <Field>
          <Textarea
            id="message"
            name="message"
            aria-describedby={
              state.errors?.message ? "message-error" : undefined
            }
            placeholder="Write your message here"
            className="h-[300px] border-[2px] rounded-[8px]"
            autoComplete="off"
          />
          {state.errors?.message && (
            <span
              id="message-error"
              className="text-[12px]"
              role="alert"
              style={{ color: "red" }}
            >
              {state.errors?.message[0]}
            </span>
          )}
        </Field>
      </FieldGroup>
      <div className="flex justify-center py-[2rem]">
        <Button className="text-[18px] h-[52px] w-[170px]" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
}
