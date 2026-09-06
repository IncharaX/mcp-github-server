import { octokit } from "../github/client.js";

export async function createIssue(
  owner: string,
  repo: string,
  title: string,
  body: string
) {
  try {
    const { data: issue } = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
    });

    const formattedIssue = {
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
      createdAt: issue.created_at,
    };

    return JSON.stringify(formattedIssue, null, 2);
  } catch (error) {
    console.error("Failed to create issue:", error);

    throw new Error(
      `Unable to create an issue in ${owner}/${repo}.`
    );
  }
}