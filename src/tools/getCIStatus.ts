import { octokit } from "../github/client.js";

export async function getCIStatus(
  owner: string,
  repo: string,
  branch: string
) {
  try {
    const { data } = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      branch,
      per_page: 1,
    });

    const workflowRun = data.workflow_runs[0];

    if (!workflowRun) {
      return `No workflow runs found for branch "${branch}".`;
    }

    const formattedStatus = {
      workflow: workflowRun.name,
      status: workflowRun.status,
      conclusion: workflowRun.conclusion ?? "Still running",
      branch: workflowRun.head_branch,
      event: workflowRun.event,
      createdAt: workflowRun.created_at,
      updatedAt: workflowRun.updated_at,
      url: workflowRun.html_url,
    };

    return JSON.stringify(formattedStatus, null, 2);
  } catch (error) {
    console.error("Failed to fetch CI status:", error);

    throw new Error(
      `Unable to fetch CI status for branch "${branch}" in ${owner}/${repo}.`
    );
  }
}