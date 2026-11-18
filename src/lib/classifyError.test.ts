import { describe, it, expect } from "vitest";
import {
  SESServiceException,
  MessageRejected,
  MailFromDomainNotVerifiedException,
  ConfigurationSetDoesNotExistException,
  ConfigurationSetSendingPausedException,
  AccountSendingPausedException,
} from "@aws-sdk/client-ses";
import { classifyError } from "@/lib/ses/classifyError";

const typedRows = [
  [
    "MessageRejected",
    new MessageRejected({ message: "rejected", $metadata: {} }),
    "MESSAGE_REJECTED",
    false,
  ],
  [
    "MailFromDomainNotVerified",
    new MailFromDomainNotVerifiedException({
      message: "unverified",
      $metadata: {},
    }),
    "UNVERIFIED_SENDER",
    false,
  ],
  [
    "ConfigurationSetDoesNotExist",
    new ConfigurationSetDoesNotExistException({
      message: "missing",
      $metadata: {},
    }),
    "CONFIG_SET_MISSING",
    false,
  ],
  [
    "ConfigurationSetSendingPaused",
    new ConfigurationSetSendingPausedException({
      message: "paused",
      $metadata: {},
    }),
    "SENDING_PAUSED",
    true,
  ],
  [
    "AccountSendingPaused",
    new AccountSendingPausedException({ message: "paused", $metadata: {} }),
    "ACCOUNT_PAUSED",
    false,
  ],
] as const;

const genericRows = [
  // INVALID_CREDENTIALS (all three names land in the two credentials branches)
  [
    "InvalidClientTokenId",
    makeSESError("InvalidClientTokenId"),
    "INVALID_CREDENTIALS",
    false,
  ],
  [
    "InvalidAccessKeyId",
    makeSESError("InvalidAccessKeyId"),
    "INVALID_CREDENTIALS",
    false,
  ],
  [
    "SignatureDoesNotMatch",
    makeSESError("SignatureDoesNotMatch"),
    "INVALID_CREDENTIALS",
    false,
  ],

  // INSUFFICIENT_PERMISSIONS
  [
    "AccessDenied by name",
    makeSESError("AccessDenied"),
    "INSUFFICIENT_PERMISSIONS",
    false,
  ],
  [
    "403 status",
    makeSESError("Whatever", 403),
    "INSUFFICIENT_PERMISSIONS",
    false,
  ],

  // THROTTLED (the only retryable generic branch besides 5xx)
  ["Throttling by name", makeSESError("Throttling"), "THROTTLED", true],
  [
    "ThrottlingException by name",
    makeSESError("ThrottlingException"),
    "THROTTLED",
    true,
  ],
  ["429 status", makeSESError("Whatever", 429), "THROTTLED", true],

  // QUOTA_EXCEEDED
  [
    "SendingQuotaExceeded",
    makeSESError("SendingQuotaExceeded"),
    "QUOTA_EXCEEDED",
    false,
  ],
  ["LimitExceeded", makeSESError("LimitExceeded"), "QUOTA_EXCEEDED", false],

  // AWS_SERVICE_ERROR, including both ends of the 5xx range
  [
    "500 status (lower bound)",
    makeSESError("Whatever", 500),
    "AWS_SERVICE_ERROR",
    true,
  ],
  ["503 status", makeSESError("Whatever", 503), "AWS_SERVICE_ERROR", true],
  [
    "599 status (upper bound)",
    makeSESError("Whatever", 599),
    "AWS_SERVICE_ERROR",
    true,
  ],

  // UNKNOWN_ERROR fallbacks
  [
    "600 status (just outside 5xx)",
    makeSESError("Whatever", 600),
    "UNKNOWN_ERROR",
    false,
  ],
  [
    "unrecognised name, 400",
    makeSESError("SomethingNew", 400),
    "UNKNOWN_ERROR",
    false,
  ],
  [
    "unrecognised name, no status",
    makeSESError("SomethingNew"),
    "UNKNOWN_ERROR",
    false,
  ],

  // Ordering (the first matching `if` wins)
  [
    "AccessDenied beats 5xx",
    makeSESError("AccessDenied", 503),
    "INSUFFICIENT_PERMISSIONS",
    false,
  ],
  [
    "403 beats Throttling name",
    makeSESError("Throttling", 403),
    "INSUFFICIENT_PERMISSIONS",
    false,
  ],
  [
    "credentials name beats 429",
    makeSESError("InvalidClientTokenId", 429),
    "INVALID_CREDENTIALS",
    false,
  ],
  [
    "Throttling name beats 5xx",
    makeSESError("Throttling", 503),
    "THROTTLED",
    true,
  ],
] as const;

const plainRows = [
  // NETWORK_ERROR: by message (the source lowercases it, so case doesn't matter)
  [
    "message contains 'network'",
    new Error("Network request failed"),
    "NETWORK_ERROR",
    true,
  ],
  [
    "message contains 'ECONNREFUSED'",
    new Error("connect ECONNREFUSED"),
    "NETWORK_ERROR",
    true,
  ],
  [
    "message contains 'ENOTFOUND'",
    new Error("getaddrinfo ENOTFOUND email.us-east-1.amazonaws.com"),
    "NETWORK_ERROR",
    true,
  ],

  // NETWORK_ERROR: by name (message is deliberately unrelated, so only the name can match)
  [
    "name is NetworkingError",
    makeNamedError("NetworkingError"),
    "NETWORK_ERROR",
    true,
  ],

  // TIMEOUT: by message
  [
    "message contains 'timeout'",
    new Error("Connection timeout"),
    "TIMEOUT",
    true,
  ],
  [
    "message contains 'timed out'",
    new Error("The request timed out"),
    "TIMEOUT",
    true,
  ],

  // TIMEOUT: by name
  ["name is TimeoutError", makeNamedError("TimeoutError"), "TIMEOUT", true],

  // Ordering: network is checked before timeout
  [
    "'network timeout' hits network first",
    new Error("network timeout"),
    "NETWORK_ERROR",
    true,
  ],

  // UNKNOWN_ERROR: an Error that matches nothing
  [
    "Error with unrelated message",
    new Error("something broke"),
    "UNKNOWN_ERROR",
    false,
  ],
  [
    "'time out' with a space is not a timeout",
    new Error("request time out"),
    "UNKNOWN_ERROR",
    false,
  ],

  // UNKNOWN_ERROR: values that aren't Errors at all
  ["thrown string", "oops", "UNKNOWN_ERROR", false],
  ["null", null, "UNKNOWN_ERROR", false],
  ["undefined", undefined, "UNKNOWN_ERROR", false],
  ["plain object", { message: "network down" }, "UNKNOWN_ERROR", false],
] as const;

describe("classifyError", () => {
  describe("typed SES exceptions", () => {
    it.each(typedRows)("%s", (_name, input, errorCode, retryable) => {
      const result = classifyError(input);

      expect(result.userMessage).not.toContain("[SES]");
      expect(result.internalMessage).toContain("[SES]");
      expect(result.errorCode).toBe(errorCode);
      expect(result.retryable).toBe(retryable);
      expect(result.success).toBe(false);
    });
  });

  describe("generic SES errors (by name / status)", () => {
    it.each(genericRows)("%s", (_name, input, errorCode, retryable) => {
      const result = classifyError(input);

      expect(result.userMessage).not.toContain("[SES]");
      expect(result.internalMessage).toContain("[SES]");
      expect(result.errorCode).toBe(errorCode);
      expect(result.retryable).toBe(retryable);
      expect(result.success).toBe(false);
    });
  });

  describe("plain errors", () => {
    it.each(plainRows)("%s", (_name, input, errorCode, retryable) => {
      const result = classifyError(input);

      expect(result.userMessage).not.toContain("[SES]");
      expect(result.internalMessage).toContain("[SES]");
      expect(result.errorCode).toBe(errorCode);
      expect(result.retryable).toBe(retryable);
      expect(result.success).toBe(false);
    });
  });

  describe("invariants", () => {
    it.each([...typedRows, ...genericRows, ...plainRows])(
      "%s",
      (_name, input) => {
        const result = classifyError(input);

        expect(result.userMessage).not.toContain("[SES]");
        expect(result.internalMessage).toContain("[SES]");
        expect(result.success).toBe(false);
      },
    );
  });
});

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

function makeNamedError(name: string, message = "boom") {
  return Object.assign(new Error(message), { name });
}
