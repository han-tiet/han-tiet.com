import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";

export default function ContactForm() {
  return (
    <div className="flex-col justify-center w-[588px]">
      <div className="flex justify-center pb-[20px] text-[32px] font-semibold">
        Let&apos;s have a chat
      </div>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-16">
          <Field>
            <Input
              id="first-name"
              type="input"
              placeholder="Forename"
              className="border-[2px] rounded-[8px]"
            />
          </Field>
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
      </FieldGroup>
      <div className="flex justify-center p-8">
        <SubmitButton />
      </div>
    </div>
  );
}
