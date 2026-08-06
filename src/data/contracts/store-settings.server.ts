/**
 * Server-only boundary. This file declares types only and exports no runtime values.
 * It must never be imported from browser composition code.
 */
export interface ServerOnlyStoreSecrets {
  readonly payment?: Readonly<{
    merchantSecret?: string;
    privateKey?: string;
    callbackSecret?: string;
    gatewayPassword?: string;
    signingKey?: string;
  }>;
  readonly webhooks?: Readonly<{
    orderWebhookSecret?: string;
    paymentWebhookSecret?: string;
  }>;
  readonly database?: Readonly<{
    connectionString?: string;
    password?: string;
  }>;
  readonly admin?: Readonly<{
    token?: string;
    encryptionKey?: string;
  }>;
  readonly smtp?: Readonly<{
    password?: string;
  }>;
  readonly certificates?: Readonly<{
    privateCertificate?: string;
  }>;
  readonly externalApis?: Readonly<{
    apiSecret?: string;
    accessToken?: string;
  }>;
}
