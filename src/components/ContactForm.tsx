"use client";

import { useActionState, useEffect } from "react";
import { Field, FieldGroup } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { handleContactForm } from "@/app/actions/handleContactForm";
import { SESResult } from "@/lib/ses/classifyError";
import { toast } from "sonner";

const initialState: SESResult = {
  success: false,
  messageId: "",
  errors: {},
  errorCode: null,
  userMessage: "",
  internalMessage: "",
  retryable: false,
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    handleContactForm,
    initialState,
  );

  useEffect(() => {
    if (state.success == false) {
      toast.error(state.userMessage, {
        style: { background: "#ff8181" },
      });
    }

    if (state.success == true) {
      toast.success("Message sent successfully", {
        style: { background: "#7aff8f" },
      });
    }
  }, [state]);

  return (
    <>
      <form action={formAction}>
        <FieldGroup>
          <div className="flex flex-row gap-[4rem]">
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
          </div>
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
          <Button
            className="text-[18px] h-[52px] w-[170px]"
            type="submit"
            disabled={isPending}
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
