---
title: "How to Fix 'Non-Fast-Forward' Git Errors Using Terminal Commands"
description: "A step by step guide to avoid what can be an otherwise tedious task."
pubDate: "March 19 2021"
---

A step by step guide to avoid what can be an otherwise tedious task.

![Pull Request warning in Terminal](https://i.imgur.com/wRlhfvG.png)

Before we talk about how to resolve this issue, let us first address what is happening here and why it is actually intended to be a safety net implemented to protect the branch.

## What happened?

If we read the hint carefully, it is telling us that something has changed upstream. Basically, changes have been made to the remote branch we are pushing to so we are no longer up-to-date on our local version. Git will advise us to address this issue before we proceed, so let's do that!

## How can I fix it?

This can be broken up into 6 steps, it is worth getting familiar with this process as these things happen often.

### 1. Move your local work to a new branch

We will want to move our work to a separate branch to avoid losing any work when we pull from the remote origin.

```sh
git checkout -b temporary
```

### 2. Commit and push to your new branch

It will likely be that we have no changes to commit at this point, but for this step, we will need to make some sort of change in order to begin tracking this new branch. This would be a good time to clean up the codebase!

```sh
git status
git add .
git commit -m "moving local to temporary branch"
git push origin temporary
```

### 3. Checkout back to the previous branch

After we have successfully pushed our work to the temporary branch we can checkout back to the original conflicting branch. In this example, we are using the main branch.

```sh
git checkout main
```

### 4. Pull the remote changes

At this point, we are ready to tackle the original error we encountered. We can now safely pull down the remote changes from upstream.

```sh
git pull origin main
```

### 5. After we are up-to-date with the remote branch, we can merge the two branches

Side note: If we merge these branches via GitHub, we will need to git pull origin main again because we have updated the remote origin again.

```sh
git merge temporary
```

### 6. We will need to resolve any merge conflicts that may arise using our preferred text editor

You can learn more about resolving merge conflicts here. After we merge the two branches we are essentially back on track.

```sh
git status
git add .
git commit -m "merging branches"
git push origin main
```

If the very last command fails, you may receive another message from git regarding unrelated histories in which case can usually be resolved by adding the `--allow-unrelated-histories` flag.

```sh
git push origin main --allow-unrelated-histories
```

I hope this has helped get you back on track. Stay awesome and don't forget to step outside and feel the breeze every now and then!
