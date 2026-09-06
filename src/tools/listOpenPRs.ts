import { octokit } from "../github/client.js";
import { getGitHubErrorMessage } from "../errors/githubErrorHandler.js";

export async function listOpenPRs(owner: string, repo: string) {
  try {
    const { data: pullRequests } =
      await octokit.rest.pulls.list({
        owner,
        repo,
        state: "open",
      });

    if (pullRequests.length === 0) {
      return "No open pull requests found.";
    }

    const formattedPRs = pullRequests.map((pr) => ({
      number: pr.number,
      title: pr.title,
      author: pr.user?.login ?? "Unknown",
      url: pr.html_url,
      createdAt: pr.created_at,
    }));

    return JSON.stringify(formattedPRs, null, 2);
  } catch (error) {
  const message = getGitHubErrorMessage(error);

  throw new Error(message);
}
}