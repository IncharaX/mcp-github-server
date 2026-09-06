import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

import { listOpenPRs } from "./tools/listOpenPRs.js";
import { getPRDetails } from "./tools/getPRDetails.js";
import { getCIStatus } from "./tools/getCIStatus.js";

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
      const result = await listOpenPRs(owner, repo);

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error("list_open_prs tool failed:", error);

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

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error("GitHub MCP Server is running...");
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});