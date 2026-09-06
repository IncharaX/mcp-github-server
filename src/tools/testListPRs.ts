import { listOpenPRs } from "./listOpenPRs.js";

async function test() {
  const result = await listOpenPRs(
    "IncharaX",
    "ts-tutorial"
  );

  console.log(result);
}

test().catch(console.error);