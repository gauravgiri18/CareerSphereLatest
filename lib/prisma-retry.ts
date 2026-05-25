const MAX_ATTEMPTS = 3;
const DELAY_MS = 500;

function isConnectionError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error);
  return (
    message.includes("Can't reach database server") ||
    message.includes("Connection") ||
    message.includes("timeout") ||
    message.includes("ECONNREFUSED") ||
    message.includes("P1001")
  );
}

export async function withDbRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isConnectionError(error) || attempt === MAX_ATTEMPTS) {
        throw error;
      }
      await new Promise((r) => setTimeout(r, DELAY_MS * attempt));
    }
  }

  throw lastError;
}
