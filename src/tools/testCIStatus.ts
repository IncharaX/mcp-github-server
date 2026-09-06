import { getCIStatus } from "./getCIStatus.js";

async function test() {
  const result = await getCIStatus(
    "IncharaX",
    "mcp-github-server",
    "main"
  );

  console.log(result);
}

test().catch(console.error);