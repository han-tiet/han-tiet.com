import {
  SESServiceException,
  MessageRejected,
  MailFromDomainNotVerifiedException,
  ConfigurationSetDoesNotExistException,
  ConfigurationSetSendingPausedException,
  AccountSendingPausedException,
} from "@aws-sdk/client-ses";

type SESErrorCode =
  | "INVALID_CREDENTIALS"
  | "INSUFFICIENT_PERMISSIONS"
  | "MESSAGE_REJECTED"
  | "UNVERIFIED_SENDER"
  | "CONFIG_SET_MISSING"
  | "SENDING_PAUSED"
  | "ACCOUNT_PAUSED"
  | "INVALID_PARAMETER"
  | "THROTTLED"
  | "QUOTA_EXCEEDED"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "AWS_SERVICE_ERROR"
  | "UNKNOWN_ERROR";

export interface SESResult {
  success: boolean;
  messageId?: string;
  errors: object;
  errorCode?: SESErrorCode;
  userMessage: string;
  internalMessage: string;
  retryable: boolean;
}

export function classifyError(error: unknown): SESResult {
  // ── SES typed exceptions (AWS SDK v3) ──────────────────────────────────────

  if (error instanceof MessageRejected) {
    return {
      success: false,
      errors: {},
      errorCode: "MESSAGE_REJECTED",
      userMessage:
        "Your message could not be delivered. Please try again later.",
      internalMessage: `[SES] MessageRejected: ${error.message}`,
      retryable: false,
    };
  }

  if (error instanceof MailFromDomainNotVerifiedException) {
    return {
      success: false,
      errors: {},
      errorCode: "UNVERIFIED_SENDER",
      userMessage:
        "Your email address is not verified in SES, please contact the website administrator.",
      internalMessage: `[SES] MailFromDomainNotVerified: Sender domain/address is not verified in SES. ${error.message}`,
      retryable: false,
    };
  }

  if (error instanceof ConfigurationSetDoesNotExistException) {
    return {
      success: false,
      errors: {},
      errorCode: "CONFIG_SET_MISSING",
      userMessage:
        "We're experiencing a configuration issue. Please try again in a few hours.",
      internalMessage: `[SES] ConfigurationSetDoesNotExist: Check SES configuration set name. ${error.message}`,
      retryable: false,
    };
  }

  if (error instanceof ConfigurationSetSendingPausedException) {
    return {
      success: false,
      errors: {},
      errorCode: "SENDING_PAUSED",
      userMessage:
        "Email delivery is temporarily unavailable. Please try again shortly.",
      internalMessage: `[SES] ConfigurationSetSendingPaused: Sending is paused on the configuration set. ${error.message}`,
      retryable: true,
    };
  }

  if (error instanceof AccountSendingPausedException) {
    return {
      success: false,
      errors: {},
      errorCode: "ACCOUNT_PAUSED",
      userMessage:
        "Email delivery is temporarily unavailable. Please try again later.",
      internalMessage: `[SES] AccountSendingPaused: The entire SES account has sending paused — check AWS console immediately. ${error.message}`,
      retryable: false, // Operator must resolve this manually
    };
  }

  // ── Generic SES / AWS service errors ──────────────────────────────────────

  if (error instanceof SESServiceException) {
    const code = error.name;
    const status = error.$response?.statusCode ?? 0;

    if (code === "InvalidClientTokenId" || code === "InvalidAccessKeyId") {
      return {
        success: false,
        errors: {},
        errorCode: "INVALID_CREDENTIALS",
        userMessage:
          "SES error, please contact the website administrator.",
        internalMessage: `[SES] Invalid AWS credentials (${code}): ${error.message}`,
        retryable: false,
      };
    }

    if (code === "SignatureDoesNotMatch") {
      return {
        success: false,
        errors: {},
        errorCode: "INVALID_CREDENTIALS",
        userMessage:
          "SES error, please contact the website administrator.",
        internalMessage: `[SES] AWS signature mismatch — check Secret Access Key. ${error.message}`,
        retryable: false,
      };
    }

    if (code === "AccessDenied" || status === 403) {
      return {
        success: false,
        errors: {},
        errorCode: "INSUFFICIENT_PERMISSIONS",
        userMessage:
          "Insufficient permissions, please contact the website administrator.",
        internalMessage: `[SES] AccessDenied: IAM role is missing ses:SendEmail permission. ${error.message}`,
        retryable: false,
      };
    }

    // Throttling & quota
    if (
      code === "Throttling" ||
      code === "ThrottlingException" ||
      status === 429
    ) {
      return {
        success: false,
        errors: {},
        errorCode: "THROTTLED",
        userMessage:
          "We're experiencing high demand right now. Please try again in a moment.",
        internalMessage: `[SES] Throttled by SES. Consider reducing send rate or requesting a limit increase. ${error.message}`,
        retryable: true,
      };
    }

    if (code === "SendingQuotaExceeded" || code === "LimitExceeded") {
      return {
        success: false,
        errors: {},
        errorCode: "QUOTA_EXCEEDED",
        userMessage:
          "We've temporarily reached our email limit. Please try again later today.",
        internalMessage: `[SES] Quota exceeded (${code}): Daily send limit reached. ${error.message}`,
        retryable: false, // Quota resets on AWS side; no point retrying immediately
      };
    }

    // AWS 5xx — transient service errors
    if (status >= 500 && status < 600) {
      return {
        success: false,
        errors: {},
        errorCode: "AWS_SERVICE_ERROR",
        userMessage:
          "We're experiencing a temporary issue. Please try again shortly.",
        internalMessage: `[SES] AWS service error ${status}: ${error.message}`,
        retryable: true,
      };
    }

    // Any other SES exception
    return {
      success: false,
      errors: {},
      errorCode: "UNKNOWN_ERROR",
      userMessage:
        "Something went wrong sending your message. Please try again.",
      internalMessage: `[SES] Unclassified SESServiceException (${code}, HTTP ${status}): ${error.message}`,
      retryable: false,
    };
  }

  // ── Network / connectivity errors ─────────────────────────────────────────

  if (error instanceof Error) {
    const name = error.name;
    const msg = error.message.toLowerCase();

    if (
      name === "NetworkingError" ||
      msg.includes("network") ||
      msg.includes("econnrefused") ||
      msg.includes("enotfound")
    ) {
      return {
        success: false,
        errors: {},
        errorCode: "NETWORK_ERROR",
        userMessage:
          "We couldn't reach the email service. Please try again shortly.",
        internalMessage: `[SES] Network error: ${error.message}`,
        retryable: true,
      };
    }

    if (
      name === "TimeoutError" ||
      msg.includes("timeout") ||
      msg.includes("timed out")
    ) {
      return {
        success: false,
        errors: {},
        errorCode: "TIMEOUT",
        userMessage: "The request timed out. Please try again.",
        internalMessage: `[SES] Timeout: ${error.message}`,
        retryable: true,
      };
    }
  }

  // ── Total unknown ──────────────────────────────────────────────────────────

  return {
    success: false,
    errors: {},
    errorCode: "UNKNOWN_ERROR",
    userMessage: "An unexpected error occurred. Please try again.",
    internalMessage: `[SES] Unknown error: ${String(error)}`,
    retryable: false,
  };
}
