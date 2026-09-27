# Issue tracker: Jira

Issues and specs for this repo live in Jira. **Project setup is still pending** — there is no confirmed project key, board, or workflow yet.

## Until setup is complete

- Don't invent a Jira project key or issue type. If a skill needs to create or reference an issue and no project key is known, ask the user for it rather than guessing.
- If Jira access isn't wired up yet either, fall back to describing the work in the PR description or commit message instead of creating a ticket.

## Once set up

Use the Atlassian MCP tools for all operations:

- **Find the site**: `getAccessibleAtlassianResources` once per session, reuse the `cloudId`.
- **Create an issue**: `createJiraIssue`.
- **Read an issue**: `getJiraIssue`.
- **Search**: `searchJiraIssuesUsingJql` for listing/filtering by project, status, label, etc.
- **Comment**: `addOrEditJiraIssueComment`.
- **Edit fields**: `editJiraIssue`.
- **Change status**: `transitionJiraIssue`.
- For anything not covered above, use `discover` to find the right operation, then run it with the matching `executeRead` / `executeWrite` / `executeDestructive`.

## When a skill says "publish to the issue tracker"

Create a Jira issue (once the project key is known).

## When a skill says "fetch the relevant ticket"

`getJiraIssue` with the issue key.

Update this file with the actual project key, issue types, and workflow states once Jira setup lands.
