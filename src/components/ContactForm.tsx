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

export default function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      forename: "",
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
              name="forename"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="forename"
                    aria-invalid={fieldState.invalid}
                    type="input"
                    placeholder="Forename"
                    className="border-[2px] rounded-[8px]"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="surname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="surename"
                    aria-invalid={fieldState.invalid}
                    type="input"
                    placeholder="Surname"
                    className="border-[2px] rounded-[8px]"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            name="emailAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id="email-address"
                  aria-invalid={fieldState.invalid}
                  type="input"
                  placeholder="Email Address"
                  className="border-[2px] rounded-[8px]"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="subject"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id="subject"
                  aria-invalid={fieldState.invalid}
                  type="input"
                  placeholder="Subject"
                  className="border-[2px] rounded-[8px]"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="subject"
            control={form.control}
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  id="message"
                  aria-invalid={fieldState.invalid}
                  placeholder="Write your message here"
                  className="h-[300px] border-[2px] rounded-[8px]"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
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
