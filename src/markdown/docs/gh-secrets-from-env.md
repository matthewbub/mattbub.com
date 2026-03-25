---
title: "gh-secrets-from-env"
description: "Bulk-upload .env file key/value pairs as GitHub Actions repository secrets"
version: "1.0.1"
repo: "https://github.com/ieportals/gh-secrets-from-env"
---

## Overview

`gh-secrets-from-env` is a CLI tool that bulk-uploads key/value pairs from a `.env` file into GitHub Actions repository secrets. Instead of manually setting each secret one-by-one through the GitHub UI, point it at an env file and a repo and it handles the rest.

## Prerequisites

Before using this tool, make sure you have the following:

- **Node.js** installed
- **GitHub CLI (`gh`)** installed and available on your PATH
- Authenticated with GitHub CLI via `gh auth login`
- Admin or collaborator access to manage secrets on the target repository

## Installation

No installation required. Run it directly with `npx` or `pnpm dlx`:

```bash
npx @ieportals/gh-secrets-from-env .env.production owner/repo
```

```bash
pnpm dlx @ieportals/gh-secrets-from-env .env.production owner/repo
```

### Global install (optional)

If you prefer to install it globally:

```bash
npm install -g @ieportals/gh-secrets-from-env
```

This exposes the `gh-secrets-from-env` command in your terminal.

## Usage

```bash
gh-secrets-from-env <envFile> <repo>
```

Both arguments are required:

| Argument | Description |
| --- | --- |
| `envFile` | Path to the `.env` file (e.g., `.env.production`) |
| `repo` | Target GitHub repository in `owner/repo` format |

### Example

```bash
npx @ieportals/gh-secrets-from-env .env.production my-org/my-app
```

This reads every key/value pair from `.env.production` and sets each one as a repository secret on `my-org/my-app`.