"use client";

import { useActionState, useEffect } from "react";
import { Field, FieldGroup } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { handleContactForm } from "@/app/actions/handleContactForm";
import { toast } from "sonner";

const initialState = {};

/**
 * Every dimension below is written in `em` so the whole form is driven by a
 * single knob: the `fontSize` on the wrapper. That value is `1em === 16px` at a
 * 1920px viewport (the design reference) and shrinks linearly with viewport
 * width down to `1em === 12px`, so the form scales proportionally across tablet
 * and mobile without any breakpoint reflow.
 */
const fluidScale = "clamp(12px, calc(12px + (100vw - 480px) / 360), 16px)";

const inputClassName =
  "h-[2.25em] rounded-[0.5em] border-[0.125em] px-[0.75em] py-[0.25em] text-[1em] md:text-[1em]";

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
    <div className="w-full px-10" style={{ fontSize: fluidScale }}>
      <form action={formAction}>
        {/* On short landscape screens (phones on their side) the stacked form
            is taller than the viewport, so the message box moves into a
            second column beside the other fields. */}
        <FieldGroup className="gap-[1.75em] [@media(max-height:500px)_and_(orientation:landscape)]:grid [@media(max-height:500px)_and_(orientation:landscape)]:grid-cols-2 [@media(max-height:500px)_and_(orientation:landscape)]:gap-x-[2em] [@media(max-height:500px)_and_(orientation:landscape)]:gap-y-[1em]">
          <div className="flex flex-row gap-[4em]">
            <Field>
              <Input
                id="forename"
                name="forename"
                aria-describedby={
                  state.errors?.forename ? "forename-error" : undefined
                }
                type="input"
                placeholder="Forename"
                className={inputClassName}
                autoComplete="off"
              />
              {state.errors?.forename && (
                <span
                  id="forename-error"
                  className="text-[0.75em]"
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
                className={inputClassName}
                autoComplete="off"
              />
              {state.errors?.surname && (
                <span
                  id="surname-error"
                  className="text-[0.75em]"
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
              className={inputClassName}
              autoComplete="off"
            />
            {state.errors?.emailAddress && (
              <span
                id="email-address-error"
                className="text-[0.75em]"
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
              className={inputClassName}
              autoComplete="off"
            />
            {state.errors?.subject && (
              <span
                id="subject-error"
                className="text-[0.75em]"
                role="alert"
                style={{ color: "red" }}
              >
                {state.errors?.subject[0]}
              </span>
            )}
          </Field>
          <Field className="[@media(max-height:500px)_and_(orientation:landscape)]:col-start-2 [@media(max-height:500px)_and_(orientation:landscape)]:row-span-3 [@media(max-height:500px)_and_(orientation:landscape)]:row-start-1">
            <Textarea
              id="message"
              name="message"
              aria-describedby={
                state.errors?.message ? "message-error" : undefined
              }
              placeholder="Write your message here"
              className="h-[18.75em] min-h-[4em] rounded-[0.5em] border-[0.125em] px-[0.75em] py-[0.5em] text-[1em] md:text-[1em] [@media(max-height:500px)_and_(orientation:landscape)]:h-auto [@media(max-height:500px)_and_(orientation:landscape)]:flex-1"
              autoComplete="off"
            />
            {state.errors?.message && (
              <span
                id="message-error"
                className="text-[0.75em]"
                role="alert"
                style={{ color: "red" }}
              >
                {state.errors?.message[0]}
              </span>
            )}
          </Field>
        </FieldGroup>
        <div className="flex justify-center py-[2em] [@media(max-height:500px)_and_(orientation:landscape)]:py-[1em]">
          <Button
            // Box units are `em`, which resolve against this button's own
            // 1.125em (18px) font size: 2.889em ≈ 52px tall, 9.444em ≈ 170px wide.
            className="h-[2.889em] w-[9.444em] gap-[0.444em] rounded-[0.444em] px-[0.889em] py-[0.444em] text-[1.125em]"
            type="submit"
            disabled={isPending}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
