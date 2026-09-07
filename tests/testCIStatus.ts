import { getCIStatus } from "../src/tools/getCIStatus.js";

async function test() {
  const result = await getCIStatus(
    "IncharaX",
    "devops_pipelines",
    "main"
  );

  console.log(result);
}

test().catch(console.error);