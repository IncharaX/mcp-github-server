import { openPRComment } from "../src/tools/openPRComment.js";

async function test() {
  const result = await openPRComment(
    "IncharaX",
    "web",
    2,
    "Testing PR comments from my GitHub MCP server 🚀"
  );

  console.log(result);
}

test().catch(console.error);