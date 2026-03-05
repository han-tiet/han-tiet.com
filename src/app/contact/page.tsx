import NavigationBar from "@/components/NavigationBar";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div>
      <NavigationBar />
      <main data-barba="container" data-barba-namespace="contact">
        <div className="pt-[24px] flex justify-center h-full">
          <ContactForm />
        </div>
      </main>
    </div>
  );
}
