import { logError, logInfo } from "./logger.js";

export async function withLogging<T>(
  toolName: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();

  logInfo(toolName, "Tool execution started");

  try {
    const result = await fn();

    const latencyMs = Date.now() - startTime;

    logInfo(toolName, "Tool execution completed", {
      status: "success",
      latencyMs,
    });

    return result;
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    logError(
      toolName,
      "Tool execution failed",
      error,
      {
        status: "failure",
        latencyMs,
      }
    );

    throw error;
  }
}