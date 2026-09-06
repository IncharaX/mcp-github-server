import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

import { listOpenPRs } from "./tools/listOpenPRs.js";
import { getPRDetails } from "./tools/getPRDetails.js";
import { getCIStatus } from "./tools/getCIStatus.js";
import { createIssue } from "./tools/createIssue.js";
import { requireConfirmation } from "./safety/writeConfirmation.js";
import { openPRComment } from "./tools/openPRComment.js";
import { withLogging } from "./logger/withLogging.js";

const server = new McpServer({
  name: "github-mcp-server",
  version: "1.0.0",
});

server.registerTool(
  "list_open_prs",
  {
    description:
      "List all open pull requests for a specified GitHub repository.",
    inputSchema: {
      owner: z
        .string()
        .describe("The GitHub username or organization that owns the repository"),
      repo: z
        .string()
        .describe("The name of the GitHub repository"),
    },
  },
  async ({ owner, repo }) => {
  try {
    const result = await withLogging(
      "list_open_prs",
      async () => listOpenPRs(owner, repo)
    );

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Failed to retrieve open pull requests for ${owner}/${repo}.`,
        },
      ],
      isError: true,
    };
  }
}
);

server.registerTool(
  "get_pr_details",
  {
    description:
      "Get detailed information about a specific GitHub pull request, including branches, description, merge status, and comments.",
    inputSchema: {
      owner: z
        .string()
        .describe(
          "The GitHub username or organization that owns the repository"
        ),

      repo: z
        .string()
        .describe("The name of the GitHub repository"),

      prNumber: z
        .number()
        .int()
        .positive()
        .describe("The pull request number"),
    },
  },

  async ({ owner, repo, prNumber }) => {
    try {
      const result = await getPRDetails(owner, repo, prNumber);

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error("get_pr_details tool failed:", error);

      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve details for PR #${prNumber} in ${owner}/${repo}.`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.registerTool(
  "get_ci_status",
  {
    description:
      "Get the latest GitHub Actions CI workflow status for a specific branch in a repository.",
    inputSchema: {
      owner: z
        .string()
        .describe(
          "The GitHub username or organization that owns the repository"
        ),

      repo: z
        .string()
        .describe("The name of the GitHub repository"),

      branch: z
        .string()
        .describe("The branch to check the latest CI workflow status for"),
    },
  },

  async ({ owner, repo, branch }) => {
    try {
      const result = await getCIStatus(owner, repo, branch);

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error("get_ci_status tool failed:", error);

      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve CI status for branch "${branch}" in ${owner}/${repo}.`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.registerTool(
  "create_issue",
  {
    description:
      "Create a GitHub issue. This is a write action and requires explicit confirmation before execution.",
    inputSchema: {
      owner: z
        .string()
        .describe(
          "The GitHub username or organization that owns the repository"
        ),

      repo: z
        .string()
        .describe("The name of the GitHub repository"),

      title: z
        .string()
        .min(1)
        .describe("The title of the GitHub issue"),

      body: z
        .string()
        .describe("The detailed description of the GitHub issue"),

      confirm: z
        .boolean()
        .default(false)
        .describe(
          "Set to true only after the user has explicitly confirmed the issue should be created"
        ),
    },
  },

  async ({ owner, repo, title, body, confirm }) => {
    try {
      const actionDescription = `Action: Create GitHub Issue
Repository: ${owner}/${repo}
Title: ${title}`;

      const confirmation = requireConfirmation(
        confirm,
        actionDescription
      );

      if (!confirmation.confirmed) {
        return {
          content: [
            {
              type: "text",
              text: confirmation.message!,
            },
          ],
        };
      }

      const result = await createIssue(owner, repo, title, body);

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error("create_issue tool failed:", error);

      return {
        content: [
          {
            type: "text",
            text: `Failed to create an issue in ${owner}/${repo}.`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.registerTool(
  "open_pr_comment",
  {
    description:
      "Add a comment to a GitHub pull request. This is a write action and requires explicit confirmation before execution.",

    inputSchema: {
      owner: z
        .string()
        .describe(
          "The GitHub username or organization that owns the repository"
        ),

      repo: z
        .string()
        .describe("The name of the GitHub repository"),

      prNumber: z
        .number()
        .int()
        .positive()
        .describe("The pull request number"),

      comment: z
        .string()
        .min(1)
        .describe("The comment to add to the pull request"),

      confirm: z
        .boolean()
        .default(false)
        .describe(
          "Set to true only after the user has explicitly confirmed the comment should be posted"
        ),
    },
  },

  async ({ owner, repo, prNumber, comment, confirm }) => {
    try {
      const actionDescription = `Action: Add Pull Request Comment
Repository: ${owner}/${repo}
Pull Request: #${prNumber}
Comment: ${comment}`;

      const confirmation = requireConfirmation(
        confirm,
        actionDescription
      );

      if (!confirmation.confirmed) {
        return {
          content: [
            {
              type: "text",
              text: confirmation.message!,
            },
          ],
        };
      }

      const result = await openPRComment(
        owner,
        repo,
        prNumber,
        comment
      );

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error("open_pr_comment tool failed:", error);

      return {
        content: [
          {
            type: "text",
            text: `Failed to add a comment to PR #${prNumber} in ${owner}/${repo}.`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error("GitHub MCP Server is running...");
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});