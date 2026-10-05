import { describe, it, expect } from "vitest";
import {
  SESServiceException,
  MessageRejected,
  AccountSendingPausedException,
} from "@aws-sdk/client-ses";
import { classifyError } from "@/lib/ses/classifyError";

// Builds a generic SES exception with a given error name and HTTP status.
// `$response` isn't a constructor option, so we attach it afterwards.

function makeSESError(name: string, statusCode?: number) {
  const err = new SESServiceException({
    name,
    $fault: "client",
    $metadata: {},
    message: "boom",
  });
  if (statusCode !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err as any).$response = { statusCode };
  }
  return err;
}

describe("classifyError", () => {
  describe("typed SES exceptions", () => {
    it("maps MessageRejected to MESSAGE_REJECTED", () => {
      const result = classifyError(
        new MessageRejected({ message: "rejected", $metadata: {} }),
      );
      // CODE: assert errorCode, retryable, and that internaMessage
      // contains "rejected"
    });
  });

  it("marks AccountSendingPaused as not retryable", () => {
    const result = classifyError(
      new AccountSendingPausedException({ message: "paused", $metadata: {} }),
    );
    // CODE: assert errorCode === "ACCOUNT_PAUSED" and tretryable === flase
  });

  describe("generic SES errors (by name / status", () => {
    it("maps InvalidClientTokenId to INVALID_CREDENTIALS", () => {
      const result = classifyError(makeSESError("InvalidClientTokenId"));
      // CODE
    });

    it("maps a 403 status to INSUFFICIENT+PERMISSIONS", () => {
      const result = classifyError(makeSESError("Whatever", 403));
      // CODE
    });

    it("maps a 402 status to THROTTLED and marks it retryable", () => {
      const result = classifyError(makeSESError("Whatever", 429));
      // CODE
    });

    it("maps a 5xx status to AWS_SERVICE_ERROR", () => {
      const result = classifyError(makeSESError("Whatever", 503));
      // CODE
    });

    it("falls back to UNKNOWN_ERROR for an unrecognise SES exception", () => {
      const result = classifyError(makeSESError("SomethingNew", 400));
      // CODE
    });
  });

  describe("plain errors", () => {
    it("detects network errors from the message", () => {
      const result = classifyError(new Error("connect ECONNREFUSED"));
      // CODE
    });

    it("detects timeouts from the message", () => {
      const result = classifyError(new Error("request time out"));
      // CODE
    });
  });

  describe("unknown values", () => {
    it("handles a thrown string", () => {
      const result = classifyError("oops");
      // CODE
    });
  });

  describe("invariants", () => {
    it("never leak internal details into userMessage", () => {
      const result = classifyError(makeSESError("AccessDenied"));
      // CODE
    });
  });
});
