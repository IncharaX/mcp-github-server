import { octokit } from "../github/client.js";
import { getGitHubErrorMessage } from "../errors/githubErrorHandler.js";

export async function openPRComment(
  owner: string,
  repo: string,
  prNumber: number,
  comment: string
) {
  try {
    const { data } = await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: comment,
    });

    const formattedComment = {
      id: data.id,
      author: data.user?.login ?? "Unknown",
      body: data.body,
      url: data.html_url,
      createdAt: data.created_at,
    };

    return JSON.stringify(formattedComment, null, 2);
  } catch (error) {
  const message = getGitHubErrorMessage(error);

  throw new Error(message);
}
}