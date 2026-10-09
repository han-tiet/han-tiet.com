import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handleContactForm } from "@/app/actions/handleContactForm";
import { MessageRejected } from "@aws-sdk/client-ses";

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

const overrideEntries = [
  ["forename", "empty", ""],
  ["forename", "too long", "a".repeat(31)],
  ["surname", "empty", ""],
  ["surname", "too long", "a".repeat(31)],
  ["emailAddress", "empty", ""],
  ["emailAddress", "malformed", "not-an-email"],
  ["subject", "empty", ""],
  ["subject", "too long", "a".repeat(51)],
  ["message", "empty", ""],
  ["message", "too long", "a".repeat(5001)],
  ["forename", "missing", null],
  ["surname", "missing", null],
  ["emailAddress", "missing", null],
  ["subject", "missing", null],
  ["message", "missing", null],
] as const;

const brokenFields = {
  forename: "a".repeat(31),
  surname: "",
  emailAddress: "abcdefg",
  message: null,
};

const maxLength = {
  forename: "a".repeat(30),
  surname: "a".repeat(30),
  emailAddress: "ada@example.com",
  subject: "a".repeat(50),
  message: "a".repeat(5000),
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
    it.each(overrideEntries)(
      "rejects %s when it is %s",
      async (fieldName, _label, value) => {
        const result = await submit({ [fieldName]: value });

        expect(result).toMatchObject({
          success: false,
          errorCode: "FORM_VALIDATION_ERROR",
        });
        expect(Object.keys(result.errors)).toEqual([fieldName]);
        expect(send).not.toHaveBeenCalled();
      },
    );
    it("reports every invalid field when several are broken", async () => {
      const result = await submit(brokenFields);

      expect(result).toMatchObject({
        success: false,
        errorCode: "FORM_VALIDATION_ERROR",
      });
      expect(result.errors).toEqual({
        forename: expect.any(Array),
        surname: expect.any(Array),
        emailAddress: expect.any(Array),
        message: expect.any(Array),
      });
      expect(send).not.toHaveBeenCalled();
    });
    it("accepts every field at its maximum length", async () => {
      const result = await submit(maxLength);

      expect(result.success).toBe(true);
      expect(send).toHaveBeenCalledTimes(2);
    });
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

    it("sends the contact email from the no-reply address", async () => {
      await submit();

      expect(sentEmail(0).Source).toBe(NOREPLY_EMAIL_ADDRESS);
    });
    it("puts the sender's name, address and message in the contact email", async () => {
      await submit();

      expect(sentEmail(0).Message.Body.Html.Data).toContain(
        validFields.forename,
      );
      expect(sentEmail(0).Message.Body.Html.Data).toContain(
        validFields.surname,
      );
      expect(sentEmail(0).Message.Body.Html.Data).toContain(
        validFields.emailAddress,
      );
      expect(sentEmail(0).Message.Body.Html.Data).toContain(
        validFields.message,
      );
    });
    it("sends the confirmation email from Han's address", async () => {
      await submit();

      expect(sentEmail(1).Source).toBe(HAN_EMAIL_ADDRESS);
    });
    it('prefixes the confirmation subject with "Re:"', async () => {
      await submit();

      expect(sentEmail(1).Message.Subject.Data).toBe(
        "Re: " + validFields.subject,
      );
    });
  });

  describe("SES failures", () => {
    it("returns a failed result when the contact email fails", async () => {
      const error = new MessageRejected({ message: "rejected", $metadata: {} });
      send.mockRejectedValueOnce(error);
      const result = await submit();

      expect(result).toMatchObject({
        success: false,
        errorCode: "MESSAGE_REJECTED",
      });
    });
    it("does not send the confirmation when the contact email fails", async () => {
      const error = new MessageRejected({ message: "rejected", $metadata: {} });
      send.mockRejectedValueOnce(error);
      await submit();

      expect(send).toHaveBeenCalledTimes(1);
    });

    it("handles the confirmation email failing after the contact email", async () => {
      const error = new MessageRejected({ message: "rejected", $metadata: {} });
      send
        .mockResolvedValueOnce({ MessageId: MESSAGE_ID })
        .mockRejectedValueOnce(error);
      const result = await submit();

      expect(result).toMatchObject({
        success: false,
        errorCode: "MESSAGE_REJECTED",
      });
      expect(send).toHaveBeenCalledTimes(2);
    });
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
