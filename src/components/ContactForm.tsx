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

const initialState = { success: false, errors: {} };

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
            aria-invalid="false"
            type="input"
            placeholder="Forename"
            className="border-[2px] rounded-[8px]"
            autoComplete="off"
          />
        </Field>
        <Field>
          <Input
            id="surname"
            name="surname"
            aria-invalid="false"
            type="input"
            placeholder="Surname"
            className="border-[2px] rounded-[8px]"
            autoComplete="off"
          />
        </Field>
        <Field>
          <Input
            id="emailAddress"
            name="emailAddress"
            aria-invalid="false"
            type="input"
            placeholder="Email Address"
            className="border-[2px] rounded-[8px]"
            autoComplete="off"
          />
        </Field>
        <Field>
          <Input
            id="subject"
            name="subject"
            aria-invalid="false"
            type="input"
            placeholder="Subject"
            className="border-[2px] rounded-[8px]"
            autoComplete="off"
          />
        </Field>
        <Field>
          <Textarea
            id="message"
            name="message"
            aria-invalid="false"
            placeholder="Write your message here"
            className="h-[300px] border-[2px] rounded-[8px]"
            autoComplete="off"
          />
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
