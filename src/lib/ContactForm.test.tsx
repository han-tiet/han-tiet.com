import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import ContactForm from "@/components/ContactForm";
import { handleContactForm } from "@/app/actions/handleContactForm";

// The action's own behaviour is covered by handleContactForm.test.ts. Here it
// only supplies the state that useActionState hands back to the component.
vi.mock("@/app/actions/handleContactForm", () => ({
  handleContactForm: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const USER_MESSAGE =
  "Your message could not be delivered. Please try again later.";

const successResult = {
  success: true,
  messageId: "test-message-id",
  errors: {},
  errorCode: null,
  userMessage: "Your message has been sent successfully.",
  internalMessage: "[SES] Email sent. MessageId: test-message-id",
  retryable: false,
};

const errorResult = {
  success: false,
  errors: {},
  errorCode: "MESSAGE_REJECTED",
  userMessage: USER_MESSAGE,
  internalMessage: "[SES] MessageRejected: Email address is not verified.",
  retryable: false,
};

async function submitForm() {
  await userEvent.click(screen.getByRole("button", { name: "Submit" }));
}

describe("ContactForm toasts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // vitest.config.mts does not enable globals, so Testing Library cannot
  // register its automatic cleanup.
  afterEach(() => {
    cleanup();
  });

  it("does not show a toast before the form is submitted", () => {
    render(<ContactForm />);

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows a success toast when the action succeeds", async () => {
    vi.mocked(handleContactForm).mockResolvedValue(successResult);
    render(<ContactForm />);

    await submitForm();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledExactlyOnceWith(
        "Message sent successfully",
        expect.anything(),
      );
    });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows an error toast with the action's userMessage when the action fails", async () => {
    vi.mocked(handleContactForm).mockResolvedValue(errorResult);
    render(<ContactForm />);

    await submitForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledExactlyOnceWith(
        USER_MESSAGE,
        expect.anything(),
      );
    });
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("shows the error toast again when a second submit fails the same way", async () => {
    // A real server action returns a new object per response, and the toast
    // effect depends on that object's identity.
    vi.mocked(handleContactForm).mockImplementation(async () => ({
      ...errorResult,
    }));
    render(<ContactForm />);

    await submitForm();
    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));

    await submitForm();
    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(2));
    expect(toast.error).toHaveBeenLastCalledWith(
      USER_MESSAGE,
      expect.anything(),
    );
  });
});
