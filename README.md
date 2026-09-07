````markdown
# GitHub MCP Server 🚀

A production-style **Model Context Protocol (MCP) server** that allows AI clients to interact with GitHub repositories through structured tools.

The server enables an AI assistant to retrieve repository information, inspect pull requests and CI status, and perform selected GitHub actions with an explicit confirmation layer for write operations.

---

## ✨ Features

### 📖 Read Operations

- List open pull requests
- Get detailed pull request information
- Check CI/workflow status

### ✍️ Write Operations

- Create GitHub issues
- Add comments to pull requests

### 🛡️ Safety Layer

Write operations use an explicit confirmation mechanism.

```text
AI requests write action
        ↓
Dry-run preview
        ↓
User confirms action
        ↓
GitHub API executes action
````

By default:

```text
confirm: false
```

No GitHub changes are made.

The action only executes when:

```text
confirm: true
```

---

## 🧰 MCP Tools

| Tool              | Type  | Description                                         |
| ----------------- | ----- | --------------------------------------------------- |
| `list_open_prs`   | Read  | Lists open pull requests in a repository            |
| `get_pr_details`  | Read  | Retrieves detailed information about a pull request |
| `get_ci_status`   | Read  | Checks the latest CI/workflow status                |
| `create_issue`    | Write | Creates a GitHub issue after confirmation           |
| `open_pr_comment` | Write | Adds a comment to a pull request after confirmation |

---

## 🏗️ Architecture

```text
                    AI CLIENT
                 (Claude / GPT)
                        │
                        │ MCP
                        ▼
              ┌───────────────────┐
              │ GitHub MCP Server │
              └───────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    MCP Tools       Safety Layer     Logging
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
                     Octokit
                        │
                        ▼
                    GitHub API
```

---

## 📁 Project Structure

```text
mcp-github-server/
│
├── src/
│   ├── errors/
│   │   ├── githubErrorHandler.ts
│   │   └── toolErrorHandler.ts
│   │
│   ├── github/
│   │   └── client.ts
│   │
│   ├── logger/
│   │   ├── logger.ts
│   │   └── withLogging.ts
│   │
│   ├── safety/
│   │   └── writeConfirmation.ts
│   │
│   ├── tools/
│   │   ├── listOpenPRs.ts
│   │   ├── getPRDetails.ts
│   │   ├── getCIStatus.ts
│   │   ├── createIssue.ts
│   │   └── openPRComment.ts
│   │
│   └── server.ts
│
├── tests/
│   ├── testConnection.ts
│   ├── testListPRs.ts
│   ├── testPRDetails.ts
│   ├── testCIStatus.ts
│   ├── testCreateIssue.ts
│   └── testOpenPRComment.ts
│
├── .env.example
├── package.json
└── tsconfig.json
```

---

## ⚙️ Tech Stack

* **TypeScript**
* **Node.js**
* **Model Context Protocol (MCP) SDK**
* **Octokit**
* **GitHub REST API**
* **Zod**
* **dotenv**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <https://github.com/IncharaX/mcp-github-server>
cd mcp-github-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

You can also use `.env.example` as a reference.

---

## ▶️ Run the MCP Server

```bash
npm run dev
```

You should see:

```text
GitHub MCP Server is running...
```

---

## 🔍 Type Check

```bash
npm run check
```

This verifies the TypeScript code without running the server.

---

## 🧪 Testing Individual Tools

The project includes manual integration test scripts:

```bash
npm run test:github
npm run test:prs
npm run test:pr-details
npm run test:ci
npm run test:create-issue
npm run test:pr-comment
```

> ⚠️ The write-operation test scripts can create real GitHub issues or comments.

---

## 🛡️ Write Action Safety

Write operations are protected using a confirmation mechanism.

### Dry Run

```json
{
  "owner": "username",
  "repo": "repository",
  "title": "Example issue",
  "body": "Example description",
  "confirm": false
}
```

The server previews the action without changing GitHub.

### Confirmed Execution

```json
{
  "owner": "username",
  "repo": "repository",
  "title": "Example issue",
  "body": "Example description",
  "confirm": true
}
```

The GitHub action executes only after confirmation.

---

## 📊 Logging & Tracing

Every GitHub tool execution is logged with:

* Tool name
* Timestamp
* Execution status
* Latency
* Success or failure information

Example:

```json
{
  "level": "INFO",
  "tool": "get_ci_status",
  "message": "Tool execution completed",
  "status": "success",
  "latencyMs": 492
}
```

Write-action previews are also tracked:

```json
{
  "level": "INFO",
  "tool": "create_issue",
  "message": "Write action previewed (dry run)",
  "status": "dry_run"
}
```

---

## ❌ Error Handling

The server handles common GitHub API errors and converts them into clearer messages.

Examples include:

* Authentication failures
* Permission issues
* GitHub rate limits
* Missing repositories
* Missing pull requests

Errors are logged internally while MCP clients receive a structured error response.

---

## 🎯 Key Design Decisions

### Read and Write Separation

Read operations can safely retrieve repository information.

Write operations require explicit confirmation to reduce the risk of unintended GitHub changes.

### Centralized Logging

A reusable logging wrapper tracks tool execution and latency without repeating logging logic across every tool.

### Centralized Error Handling

GitHub errors and MCP tool responses are handled separately to keep responsibilities clear and the codebase maintainable.

---

## 🔮 Future Improvements

* GitHub OAuth authentication
* Repository allowlists
* More GitHub tools
* Persistent logging
* Rate-limit monitoring
* Multi-step agent workflows
* Support for additional AI clients

---

## 👩‍💻 Author

**Inchara N K**

Built as a hands-on project exploring the **Model Context Protocol, AI tool calling, agentic workflows, and safe AI actions**.

