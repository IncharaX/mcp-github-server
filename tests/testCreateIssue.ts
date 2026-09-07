import { createIssue } from "../src/tools/createIssue.js";

async function test() {
  const result = await createIssue(
    "IncharaX",
    "ts-tutorial",
    "Test issue from MCP server",
    "This issue was created while testing the GitHub MCP server."
  );

  console.log(result);
}

test().catch(console.error);