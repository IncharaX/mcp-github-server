import { listOpenPRs } from "./listOpenPRs.js";

async function test() {
  const result = await listOpenPRs(
    "IncharaX",
    "web"
  );

  console.log(result);
}

test().catch(console.error);