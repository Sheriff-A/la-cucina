# Issue tracker: GitHub Issues

Issues and specs for this repo live in GitHub Issues, on [Sheriff-A/la-cucina](https://github.com/Sheriff-A/la-cucina) (the same repo this code lives in). Switched from Jira on 2026-09-27 when the Jira subscription lapsed.

## Operations

Use the `gh` CLI (already authenticated in this environment) for all operations:

- **Create an issue**: `gh issue create --title "..." --body "..." --label <label>`
- **Read an issue**: `gh issue view <number>`
- **Search**: `gh issue list --search "<query>"` or `gh issue list --label <label> --state <state>`
- **Comment**: `gh issue comment <number> --body "..."`
- **Edit fields** (title, body, labels, assignees, milestone): `gh issue edit <number>`
- **Change status**: `gh issue close <number>` / `gh issue reopen <number>`. GitHub Issues has no Jira-style intermediate workflow states — status is open/closed plus whatever the triage labels below encode.

For anything not covered by these, use `gh api` against the GitHub REST API, or `gh issue --help` / `gh label --help` for the full command surface.

## When a skill says "publish to the issue tracker"

Create a GitHub issue: `gh issue create`.

## When a skill says "fetch the relevant ticket"

`gh issue view <number>`.

## Labels

Triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) already exist on the repo — see `docs/agents/triage-labels.md`. Unlike Jira, GitHub won't silently accept a label that doesn't exist yet: `gh label create <name> --description "..." --color <hex>` first if a skill needs one that isn't listed there.
