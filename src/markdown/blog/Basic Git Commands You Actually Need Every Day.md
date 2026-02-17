---
title: "Basic Git Commands You Actually Need Every Day"
description: "A practical guide to the Git commands most developers use daily, with examples you can copy and run."
pubDate: "February 7 2026"
tags: ["git", "version-control", "terminal", "developer-workflow"]
---

Git can feel noisy when you're first learning it, but most day-to-day work comes down to a small set of commands.

This guide focuses on the basics you will actually use in a real workflow: creating a repo, tracking changes, committing, branching, and syncing with GitHub.

## Before We Start

Make sure Git is installed:

```bash
$ git --version
```

If you see a version number, you're good.

## Step 1: Start a Repository (or Clone One)

If you're starting from scratch:

```bash
$ mkdir git-demo
$ cd git-demo
$ git init
```

If the project already exists on GitHub:

```bash
$ git clone https://github.com/your-username/your-repo.git
$ cd your-repo
```

## Step 2: Check What Changed

This is the command you'll run constantly:

```bash
$ git status
```

Use it to confirm:

1. Which files changed.
2. Which files are staged.
3. What branch you're on.

To inspect code changes:

```bash
$ git diff
```

To inspect staged changes (what will be committed):

```bash
$ git diff --staged
```

## Step 3: Stage and Commit Your Work

Stage one file:

```bash
$ git add src/components/Header.tsx
```

Stage everything changed:

```bash
$ git add .
```

Commit with a clear message:

```bash
$ git commit -m "Add mobile nav toggle state handling"
```

A good commit message says what changed and gives enough context for future you.

## Step 4: Branching Basics

Create and switch to a new branch:

```bash
$ git checkout -b feat/mobile-nav
```

See your branches:

```bash
$ git branch
```

Switch back to `main`:

```bash
$ git checkout main
```

Keep feature work off `main` so your history stays clean and easier to review.

## Step 5: Push and Pull

Push a branch to remote for the first time:

```bash
$ git push -u origin feat/mobile-nav
```

After that, a simple push is enough:

```bash
$ git push
```

Pull the latest changes from remote:

```bash
$ git pull origin main
```

## Step 6: Fix Common Mistakes Quickly

Unstage a file you added by accident:

```bash
$ git restore --staged src/components/Header.tsx
```

Discard local edits in a file (careful, this removes local changes):

```bash
$ git restore src/components/Header.tsx
```

Undo a commit safely on shared branches:

```bash
$ git revert <commit-hash>
```

## A Real Daily Flow

Here is a basic workflow many teams use:

```bash
$ git checkout main
$ git pull origin main
$ git checkout -b feat/profile-avatar
# make changes
$ git status
$ git add .
$ git commit -m "Add profile avatar upload UI"
$ git push -u origin feat/profile-avatar
```

From there, open your pull request.

---

Git has many advanced commands, but this set is enough to work confidently on most projects. Master these first, then expand gradually as your workflow grows.
