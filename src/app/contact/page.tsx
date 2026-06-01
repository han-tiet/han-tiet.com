import * as React from "react";

import { redirect } from "next/navigation";

import NavigationBar from "@/components/NavigationBar";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div>
      <NavigationBar />
      <div className="pt-[24px] flex justify-center h-full">
        <div className="flex-col justify-center w-[588px]">
          <div className="flex justify-center pb-[20px] text-[32px] font-semibold">
            Let&apos;s have a chat
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
