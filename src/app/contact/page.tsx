import NavigationBar from "@/components/NavigationBar";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div>
      <NavigationBar />
      <div className="flex justify-center h-full">
        <div className="flex-col justify-center w-[100%] md:w-[70%] lg:w-[60%] desktop:w-[40%] [@media(max-height:500px)_and_(orientation:landscape)]:w-[60%]">
          <div className="flex justify-center py-[1rem] desktop:py-[2rem] text-[1.25rem] desktop:text-[2.5rem] font-semibold">
            Let&apos;s have a chat
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
