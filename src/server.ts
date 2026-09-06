import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

const server = new McpServer({
  name: "github-mcp-server",
  version: "1.0.0",
});

server.registerTool(
  "greet",
  {
    description: "Greet a person by their name",
    inputSchema: z.object({
      name: z.string().describe("The name of the person to greet"),
    }),
  },
  async ({ name }) => {
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${name}! Welcome to the GitHub MCP Server.`,
        },
      ],
    };
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