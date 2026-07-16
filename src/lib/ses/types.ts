export type SNSPayload = {
  Type: "Notification" | "SubscriptionConfirmation" | "UnsubscribeConfirmation";
  MessageId: string;
  TopicArn: string;
  Message: string;
  Timestamp: string;
  Signature: string;
  SigningCertURL: string;
  SubscribeURL?: string;
  Token?: string;
};

export type SESComplaintMessage = {
  notificationType: "Complaint";
  complaint: {
    complainedRecipients: { emailAddress: string }[];
    bounceType?: never;
  };
  mail: {
    messageId: string;
  };
};

export type SESBounceMessage = {
  notificationType: "Bounce";
  bounce: {
    bounceType: "Permanent" | "Transient";
    bounceSubType: string;
    bouncedRecipients: {
      emailAddress: string;
      diagnosticCode?: string;
      action?: string;
    }[];
  };
  mail: {
    messageId: string;
  };
};
