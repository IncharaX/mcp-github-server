import { Octokit } from "octokit";
import "dotenv/config";

const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error("GITHUB_TOKEN is not configured.");
}

export const octokit = new Octokit({
  auth: token,
});