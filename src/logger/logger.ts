export function logInfo(
  tool: string,
  message: string,
  metadata: Record<string, unknown> = {}
) {
  console.error(
    JSON.stringify({
      level: "INFO",
      timestamp: new Date().toISOString(),
      tool,
      message,
      ...metadata,
    })
  );
}

export function logDryRun(
  tool: string,
  metadata: Record<string, unknown> = {}
) {
  console.error(
    JSON.stringify({
      level: "INFO",
      timestamp: new Date().toISOString(),
      tool,
      message: "Write action previewed (dry run)",
      status: "dry_run",
      ...metadata,
    })
  );
}

export function logError(
  tool: string,
  message: string,
  error: unknown,
  metadata: Record<string, unknown> = {}
) {
  console.error(
    JSON.stringify({
      level: "ERROR",
      timestamp: new Date().toISOString(),
      tool,
      message,
      error: error instanceof Error ? error.message : String(error),
      ...metadata,
    })
  );
}