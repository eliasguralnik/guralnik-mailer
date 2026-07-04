// tests/engine/batch.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { runBatch, isTransientError } from '../../src/engine/batch';
import { BatchRecipient } from '../../src/types';

function recipients(count: number): BatchRecipient[] {
  return Array.from({ length: count }, (_, i) => ({
    to: `user${i}@example.com`,
    data: { name: `User ${i}`, locale: 'en' },
  }));
}

function transientError(status = 429) {
  const error: any = new Error(`Request failed with status ${status}`);
  error.statusCode = status;
  return error;
}

describe('isTransientError', () => {
  it('treats 429 and 5xx statuses as transient', () => {
    expect(isTransientError({ statusCode: 429 })).toBe(true);
    expect(isTransientError({ status: 500 })).toBe(true);
    expect(isTransientError({ $metadata: { httpStatusCode: 503 } })).toBe(true); // AWS SDK v3
    expect(isTransientError({ response: { status: 502 } })).toBe(true);
  });

  it('treats 4xx client errors (except 429) as permanent', () => {
    expect(isTransientError({ statusCode: 400 })).toBe(false);
    expect(isTransientError({ statusCode: 401 })).toBe(false);
    expect(isTransientError({ statusCode: 422 })).toBe(false);
  });

  it('treats node network errors as transient', () => {
    expect(isTransientError({ code: 'ECONNRESET' })).toBe(true);
    expect(isTransientError({ code: 'ETIMEDOUT' })).toBe(true);
    expect(isTransientError({ code: 'ENOENT' })).toBe(false);
  });

  it('falls back to message sniffing', () => {
    expect(isTransientError(new Error('Too Many Requests (429)'))).toBe(true);
    expect(isTransientError(new Error('invalid recipient'))).toBe(false);
  });
});

describe('runBatch', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('sends to every recipient and reports a summary', async () => {
    const sendFn = vi.fn().mockResolvedValue(undefined);
    const result = await runBatch(sendFn, recipients(5), { requestsPerSecond: 1000 });

    expect(sendFn).toHaveBeenCalledTimes(5);
    expect(result).toEqual({ sent: 5, failed: 0, errors: [] });
  });

  it('spaces sends according to requestsPerSecond', async () => {
    vi.useFakeTimers();
    const timestamps: number[] = [];
    const sendFn = vi.fn(async () => {
      timestamps.push(Date.now());
    });

    const promise = runBatch(sendFn, recipients(3), { requestsPerSecond: 2 }); // 500ms interval
    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    expect(timestamps.length).toBe(3);
    expect(timestamps[1] - timestamps[0]).toBeGreaterThanOrEqual(500);
    expect(timestamps[2] - timestamps[1]).toBeGreaterThanOrEqual(500);
  });

  it('retries transient errors with exponential backoff and eventually succeeds', async () => {
    vi.useFakeTimers();
    const sendFn = vi
      .fn()
      .mockRejectedValueOnce(transientError(429))
      .mockRejectedValueOnce(transientError(503))
      .mockResolvedValue(undefined);

    const promise = runBatch(sendFn, recipients(1), { requestsPerSecond: 1000, retryBackoffMs: 500 });
    // Backoffs: 500ms, then 1000ms
    await vi.advanceTimersByTimeAsync(500 + 1000 + 100);
    const result = await promise;

    expect(sendFn).toHaveBeenCalledTimes(3);
    expect(result.sent).toBe(1);
    expect(result.failed).toBe(0);
  });

  it('gives up after maxRetries and reports the failure', async () => {
    vi.useFakeTimers();
    const sendFn = vi.fn().mockRejectedValue(transientError(500));
    const onError = vi.fn();

    const promise = runBatch(sendFn, recipients(1), {
      requestsPerSecond: 1000,
      maxRetries: 2,
      retryBackoffMs: 100,
      onError,
    });
    await vi.advanceTimersByTimeAsync(100 + 200 + 100);
    const result = await promise;

    expect(sendFn).toHaveBeenCalledTimes(3); // initial + 2 retries
    expect(result.sent).toBe(0);
    expect(result.failed).toBe(1);
    expect(result.errors[0].recipient).toBe('user0@example.com');
    expect(onError).toHaveBeenCalledWith('user0@example.com', expect.any(Error));
  });

  it('does not retry permanent (non-transient) errors', async () => {
    const permanentError: any = new Error('Invalid recipient');
    permanentError.statusCode = 400;
    const sendFn = vi.fn().mockRejectedValue(permanentError);

    const result = await runBatch(sendFn, recipients(1), { requestsPerSecond: 1000 });

    expect(sendFn).toHaveBeenCalledTimes(1);
    expect(result.failed).toBe(1);
  });

  it('does not retry at all when retryOnFailure is false', async () => {
    const sendFn = vi.fn().mockRejectedValue(transientError(429));

    const result = await runBatch(sendFn, recipients(1), { requestsPerSecond: 1000, retryOnFailure: false });

    expect(sendFn).toHaveBeenCalledTimes(1);
    expect(result.failed).toBe(1);
  });

  it('reports progress after every settled send', async () => {
    const onProgress = vi.fn();
    const sendFn = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(Object.assign(new Error('bad'), { statusCode: 400 }))
      .mockResolvedValue(undefined);

    await runBatch(sendFn, recipients(3), { requestsPerSecond: 1000 });

    expect(onProgress).toHaveBeenCalledTimes(0); // not passed → no calls
    const onProgress2 = vi.fn();
    await runBatch(vi.fn().mockResolvedValue(undefined), recipients(3), {
      requestsPerSecond: 1000,
      onProgress: onProgress2,
    });
    expect(onProgress2).toHaveBeenCalledTimes(3);
    expect(onProgress2).toHaveBeenLastCalledWith(3, 3);
  });

  it('continues the batch even when individual sends fail', async () => {
    const sendFn = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(Object.assign(new Error('bad'), { statusCode: 400 }))
      .mockResolvedValueOnce(undefined);

    const result = await runBatch(sendFn, recipients(3), { requestsPerSecond: 1000 });

    expect(result.sent).toBe(2);
    expect(result.failed).toBe(1);
    expect(result.errors).toHaveLength(1);
  });

  it('rejects a non-positive requestsPerSecond', async () => {
    await expect(runBatch(vi.fn(), recipients(1), { requestsPerSecond: 0 })).rejects.toThrow(/requestsPerSecond/);
  });

  it('survives throwing callbacks', async () => {
    const sendFn = vi.fn().mockResolvedValue(undefined);
    const result = await runBatch(sendFn, recipients(2), {
      requestsPerSecond: 1000,
      onProgress: () => {
        throw new Error('callback bug');
      },
    });
    expect(result.sent).toBe(2);
  });
});
