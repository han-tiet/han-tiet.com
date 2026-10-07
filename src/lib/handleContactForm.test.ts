import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handleContactForm } from "@/app/actions/handleContactForm";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));

// Only the client is replaced: SendEmailCommand and the exception classes that
// classifyError checks with instanceof stay real.
vi.mock("@aws-sdk/client-ses", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@aws-sdk/client-ses")>()),
  SESClient: class {
    send = send;
  },
}));

const HAN_EMAIL_ADDRESS = "han@example.com";
const NOREPLY_EMAIL_ADDRESS = "noreply@example.com";
const MESSAGE_ID = "test-message-id";

const validFields = {
  forename: "Ada",
  surname: "Lovelace",
  emailAddress: "ada@example.com",
  subject: "Hello",
  message: "Just saying hi",
};

type Overrides = Partial<Record<keyof typeof validFields, string | null>>;

describe("handleContactForm", () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue({ MessageId: MESSAGE_ID });

    vi.stubEnv("AWS_REGION", "eu-west-2");
    vi.stubEnv("HAN_EMAIL_ADDRESS", HAN_EMAIL_ADDRESS);
    vi.stubEnv("NOREPLY_EMAIL_ADDRESS", NOREPLY_EMAIL_ADDRESS);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("validation", () => {
    it.todo("rejects each field when it is empty, too long or malformed");
    it.todo("rejects a field that is missing from the form");
    it.todo("reports every invalid field when several are broken");
    it.todo("accepts every field at its maximum length");
  });

  describe("sending", () => {
    it("sends the contact email, then the confirmation email", async () => {
      const result = await submit();

      expect(result).toMatchObject({ success: true, messageId: MESSAGE_ID });
      expect(send).toHaveBeenCalledTimes(2);
      expect(sentEmail(0).Destination.ToAddresses).toEqual([HAN_EMAIL_ADDRESS]);
      expect(sentEmail(1).Destination.ToAddresses).toEqual([
        validFields.emailAddress,
      ]);
    });

    it.todo("sends the contact email from the no-reply address");
    it.todo("puts the sender's name, address and message in the contact email");
    it.todo("sends the confirmation email from Han's address");
    it.todo('prefixes the confirmation subject with "Re:"');
  });

  describe("SES failures", () => {
    it.todo("returns a failed result when the contact email fails");
    it.todo("does not send the confirmation when the contact email fails");

    // TODO(human): decide what the visitor should be told when only the
    // confirmation email fails, then replace this it.todo with a test for it.
    it.todo("handles the confirmation email failing after the contact email");
  });
});

// null leaves the field out of the form entirely
function buildFormData(overrides: Overrides = {}) {
  const formData = new FormData();

  for (const [key, value] of Object.entries({ ...validFields, ...overrides })) {
    if (typeof value === "string") formData.append(key, value);
  }

  return formData;
}

function submit(overrides: Overrides = {}) {
  return handleContactForm(new FormData(), buildFormData(overrides));
}

// The email passed to the nth client.send call (0 = contact, 1 = confirmation)
function sentEmail(callIndex: number) {
  return send.mock.calls[callIndex][0].input;
}
