---
title: "Why does GitHub Deploy my Readme?"
description: "Learn why static GitHub Pages deployments might show your README instead of your website, and how to fix the directory structure to resolve deployment issues."
pubDate: "March 21 2021"
heroImage: "https://i.imgur.com/NR18FzD.png"
---

Why static GitHub deploys break and how we can (usually) resolve them with a quick refactor.

![404 GitHub Page Not Found Error](https://i.imgur.com/NR18FzD.png)

When we deploy a static website to GitHub Pages, the build process will search for the `index.html` file inside of the **root** directory. e.g `my-project/index.html`

If GitHub cannot locate the `~/index.html` it will default to the readme file if present.

## ✅ Correct Directory Structure

Here is an example to help visualize the correct directory structure.

```sh
Repo
├── ... other files/sub-folders
├── index.html
└── README.md
```

## ❌ Incorrect Directory Structure

Here is an example of an incorrect directory structure.

```sh
Repo
├── ... other files/sub-folders
├── README.md
└── sub-folder/
    └── index.html
```

**\*Caution before redeploying**, check the local version and ensure everything works! We might need to update some relative paths in our directory.\*

Once we are able to confirm everything works locally we can push these changes to GitHub and we should be able to see the website! 🤞

```sh
git add .
git status

git commit -m 'resolved deploy'
git push origin main
```
