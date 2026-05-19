"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Form from "next/form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";

const formSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name must not be empty")
    .max(30, "First name must not have more than 30 characters"),
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

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      emailAddress: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(email: z.infer<typeof formSchema>) {
    console.log(email);
  }

  return (
    <div className="flex-col justify-center w-[588px]">
      <div className="flex justify-center pb-[20px] text-[32px] font-semibold">
        Let&apos;s have a chat
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-16">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="first-name"
                    aria-invalid={fieldState.invalid}
                    type="input"
                    placeholder="Forename"
                    className="border-[2px] rounded-[8px]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <Input
                id="surname"
                type="input"
                placeholder="Surname"
                className="border-[2px] rounded-[8px]"
              />
            </Field>
          </div>
          <Field>
            <Input
              id="email-address"
              type="input"
              placeholder="Email Address"
              className="border-[2px] rounded-[8px]"
            />
          </Field>
          <Field>
            <Input
              id="subject"
              type="input"
              placeholder="Email Subject"
              className="border-[2px] rounded-[8px]"
            />
          </Field>
          <Field>
            <Textarea
              id="message"
              placeholder="Write your message here"
              className="h-[300px] border-[2px] rounded-[8px]"
            />
          </Field>
          <Field>
            <div className="flex justify-center p-8">
              <SubmitButton />
            </div>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
