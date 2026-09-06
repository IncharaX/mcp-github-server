import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { listOpenPRs } from "./tools/listOpenPRs.js";

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

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error("GitHub MCP Server is running...");
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});