import { octokit } from "./client.js";

async function testConnection() {
  try {
    const { data } = await octokit.rest.users.getAuthenticated();

    console.log(`Connected to GitHub as: ${data.login}`);
  } catch (error) {
    console.error("GitHub connection failed:", error);
  }
}

testConnection();