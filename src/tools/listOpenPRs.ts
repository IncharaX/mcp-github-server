import { octokit } from "../github/client.js";

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
    console.error("Failed to fetch open pull requests:", error);

    throw new Error(
      `Unable to fetch open pull requests for ${owner}/${repo}.`
    );
  }
}