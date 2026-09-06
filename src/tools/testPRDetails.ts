import { getPRDetails } from "./getPRDetails.js";

async function test() {
  const result = await getPRDetails(
    "IncharaX",
    "web",
    2
  );

  console.log(result);
}

test().catch(console.error);