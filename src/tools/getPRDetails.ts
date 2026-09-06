import { octokit } from "../github/client.js";
import { getGitHubErrorMessage } from "../errors/githubErrorHandler.js";

export async function getPRDetails(
  owner: string,
  repo: string,
  prNumber: number,
) {
  try {
    // Fetch the main Pull Request details
    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    // Fetch comments on the Pull Request
    const { data: comments } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: prNumber,
    });

    const formattedPR = {
      number: pr.number,
      title: pr.title,
      state: pr.state,
      author: pr.user?.login ?? "Unknown",
      body: pr.body ?? "No description provided.",
      sourceBranch: pr.head.ref,
      targetBranch: pr.base.ref,
      url: pr.html_url,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      mergeable: pr.mergeable,
      comments: comments.map((comment) => ({
        author: comment.user?.login ?? "Unknown",
        body: comment.body,
        createdAt: comment.created_at,
      })),
    };

    return JSON.stringify(formattedPR, null, 2);
  } catch (error) {
    const message = getGitHubErrorMessage(error);

    throw new Error(message);
  }
}
