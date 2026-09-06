export function getGitHubErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error
  ) {
    const status = (error as { status?: number }).status;

    switch (status) {
      case 401:
        return "GitHub authentication failed. Please check your access token.";

      case 403:
        return "GitHub denied this request. You may have insufficient permissions or hit a rate limit.";

      case 404:
        return "The requested GitHub resource was not found.";

      default:
        return "GitHub returned an unexpected error.";
    }
  }

  return "An unexpected error occurred while communicating with GitHub.";
}