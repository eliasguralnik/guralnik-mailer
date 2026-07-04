// src/engine/batch.ts
import { BatchOptions, BatchRecipient, BatchResult } from '../types';
import { logger as rootLogger } from "../logger";

const logger = rootLogger.child({ module: 'Batch' });

const DEFAULTS = {
  requestsPerSecond: 10,
  retryOnFailure: true,
  maxRetries: 3,
  retryBackoffMs: 500,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Erkennt transiente Fehler (Rate-Limits & Server-Fehler), bei denen ein
 * Retry sinnvoll ist. Deckt die Fehler-Formate aller 5 Provider-SDKs ab.
 */
export function isTransientError(error: any): boolean {
  if (!error) return false;

  const status =
    error.statusCode ??            // SendGrid / Mailgun
    error.status ??                // mailgun.js / fetch-basierte SDKs
    error.$metadata?.httpStatusCode ?? // AWS SDK v3
    error.response?.status ??      // axios-artige Fehler
    error.response?.statusCode;

  if (typeof status === 'number') {
    return status === 429 || status >= 500;
  }

  // Node-Netzwerkfehler (SMTP & Co.)
  const transientCodes = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EAI_AGAIN', 'EPIPE', 'ESOCKET'];
  if (typeof error.code === 'string' && transientCodes.includes(error.code)) return true;
  if (typeof error.code === 'number') return error.code === 429 || error.code >= 500;

  // Fallback: Statuscode aus der Fehlermeldung fischen (z.B. "Resend Fehler: ... 429 ...")
  const message = String(error.message || '');
  return /\b(429|too many requests|rate limit|50[0-4])\b/i.test(message);
}

export type BatchSendFn = (recipient: BatchRecipient) => Promise<void>;

/**
 * Kern der Batch-Logik, unabhängig vom konkreten Send-Mechanismus —
 * so lässt sich Rate-Limiting- und Retry-Verhalten isoliert testen.
 */
export async function runBatch(
  sendFn: BatchSendFn,
  recipients: BatchRecipient[],
  options: BatchOptions = {}
): Promise<BatchResult> {
  const requestsPerSecond = options.requestsPerSecond ?? DEFAULTS.requestsPerSecond;
  const retryOnFailure = options.retryOnFailure ?? DEFAULTS.retryOnFailure;
  const maxRetries = options.maxRetries ?? DEFAULTS.maxRetries;
  const retryBackoffMs = options.retryBackoffMs ?? DEFAULTS.retryBackoffMs;

  if (requestsPerSecond <= 0) {
    throw new Error("Batch-Error: 'requestsPerSecond' must be greater than 0!");
  }

  const intervalMs = 1000 / requestsPerSecond;
  const total = recipients.length;

  const result: BatchResult = { sent: 0, failed: 0, errors: [] };
  let settled = 0;

  const sendWithRetry = async (recipient: BatchRecipient) => {
    let attempt = 0;
    // Erster Versuch + bis zu maxRetries Wiederholungen bei transienten Fehlern
    for (;;) {
      try {
        await sendFn(recipient);
        result.sent++;
        return;
      } catch (error: any) {
        const canRetry = retryOnFailure && attempt < maxRetries && isTransientError(error);
        if (!canRetry) {
          result.failed++;
          result.errors.push({ recipient: recipient.to, error });
          try {
            options.onError?.(recipient.to, error);
          } catch (callbackError) {
            logger.warn({ callbackError }, "onError callback threw — ignoring.");
          }
          return;
        }
        const backoff = retryBackoffMs * Math.pow(2, attempt); // Exponential Backoff
        attempt++;
        logger.warn(
          { to: recipient.to, attempt, backoff },
          `Transient error — retrying in ${backoff}ms (attempt ${attempt}/${maxRetries})...`
        );
        await sleep(backoff);
      }
    }
  };

  logger.info({ total, requestsPerSecond }, "Starting batch send...");

  const inFlight: Promise<void>[] = [];

  for (let i = 0; i < recipients.length; i++) {
    // Rate-Limiting: jeder Send bekommt einen festen Zeit-Slot
    if (i > 0) await sleep(intervalMs);

    inFlight.push(
      sendWithRetry(recipients[i]).finally(() => {
        settled++;
        try {
          options.onProgress?.(settled, total);
        } catch (callbackError) {
          logger.warn({ callbackError }, "onProgress callback threw — ignoring.");
        }
      })
    );
  }

  await Promise.all(inFlight);

  logger.info(
    { sent: result.sent, failed: result.failed, total },
    `Batch finished: ${result.sent}/${total} sent, ${result.failed} failed.`
  );

  return result;
}
