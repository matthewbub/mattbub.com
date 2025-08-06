---
title: "How to set up GitHub Workflows to work with ESLint, Prettier, Stylelint and Travis."
description: "The best workflow is a consistent workflow. Let's walkthough how we can enfore ESLint, Prettier and Stylelint using GitHub Workflows in addition to our local environment."
pubDate: "August 31 2020"
---

_The best workflow is a consistent workflow. Let's walkthough how we can enfore ESLint, Prettier and Stylelint using GitHub Workflows in addition to our local environment._

In all honesty, GitHub has _a lot_ of perks i'm likely not benifiting from. Let's create a new React App with the Airbnb Style Guide and demonstrate how we can set this up.

## **Prerequisites**

Before we begin you will need to have a relatively recent version of node installed. We can check by running `node -v`. We should get see a response similar to the one below.

![](https://i.imgur.com/u0WPXie.png)

We will also need ESLint. We can install this locallay _or_ globally [here](https://eslint.org/docs/user-guide/getting-started). To verify we have eslint we can run `eslint -v`.

![](https://i.imgur.com/gjMRP8U.png)

## Step 1

### Create a new directory & a initialize a new GitHub Repo

We'll be using the terminal for the initialization process so lets begin by making a new directory and initialize Git.

```bash
$ mkdir workflow-demo
$ cd $_
$ git init
```

![](https://i.imgur.com/nbpP7Gp.png)

## Step 2

### Initialize a new React App

A convient way to get up and running in React quick is by using the `create-react-app` command.

```bash
$ npx create-react-app .
```

![](https://i.imgur.com/a7JuWRo.png)

## Step 3

### Commit, Push and Switch to a New Branch

Let's add and commit what we have, then we can push our work to GitHub. From there we will switch to a new branch because our workflow _won't work if we are pushing directly to the master_. Read these commands carefully as they will be different than mine.

```bash
$ git add .
$ git commit -m 'hello world'
$ git remote add origin https://github.com/hi-matbub/workflow-demo.git
$ git branch -M master
$ git push -u origin master
$ git checkout -b dev
```

## Step 4

### Init ESLint and Prettier

We've already installed ESLint with our React App, (Go ahead and see for yourself!) So let's go ahead an initialize ESLint by running the following command.

```bash
$ eslint --init
```

![](https://i.imgur.com/XU7ig3u.gif)

If you aren't familiar with Prettier, It's is an awesome tool that auto formats our code in an attempt to keep consistency amongst file types. Let's add Prettier to our dependencies real quick;

```bash
$ npm i prettier
```

Now we can create a `.prettierrc` file in our base directory and configure our rules accordingly. Here's a few I work with;

```json
{
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "bracketSpacing": true,
  "jsxBracketSameLine": false
}
```

Let's run both of these one time,

```bash
$ npx prettier --config .prettierrc --write .
$ npx eslint .
```

![](https://imgur.com/Oz21m63.png)

Well well, it looks like we've got a few errors. We can handle these the old fashion way or ignore them.. let's just ignore them for now. Create a `.eslintignore` file in the base directory and add the two files we see in the error.

```
src/serviceWorker.js
src/App.test.js
```

run the eslint command again and we should be good to go!

## Step 5

### Add a Workflow to your Base Directory

From your base directory, create a nested file under the path `.github/workflows/lint.yml` and insert the following contents:

```yaml
name: Lint

on: push

jobs:
  run-linters:
    name: Run linters
    runs-on: ubuntu-latest

    steps:
      - name: Check out Git repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v1
        with:
          node-version: 12

      # ESLint and Prettier must be in `package.json`
      - name: Install Node.js dependencies
        run: yarn

      - name: Run linters
        uses: samuelmeuli/lint-action@v1
        with:
          github_token: ${{ secrets.github_token }}
          # Enable linters
          eslint: true
          prettier: true
```

_To explain the entire contents of this file would be out-of-scope for this article. If you want to learn more about GitHub Workflows, you can visit [the offical documents here](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-and-managing-workflow-files-and-runs)._

## Step 6

### Commit and Push to GitHub

At this point we are ready to push our updates to GitHub, let's verify we are on any branch _but_ the master branch.

```bash
$ git branch
```

![](https://imgur.com/9M2Q8MC.png)

Once we are sure we are off our master branch, we can commit our changes and push to GitHub.

```bash
$ git add .
$ git commit -m 'configuring workflow'
$ git push origin dev
```

## Step 7

### Create a pull request from our new branch

Let's go to GitHub and navigate to our repo. You should see a prompt to open a new pull request but in the event you don't you can always check in the pull request section.

If everything has been configure properly you should see some checks beging to run once you create your pull request.

![](https://imgur.com/ZbJ1kXn.png)

## Step 8

### Automation

If you still have linting errors you might have noticed your build failed when you created your pull request.
Let's see what we can do about automating this by using 2 addition packages.

```bash
$ npm i husky lint-staged -D
```

Now we can add a few more scripts to our `package.json`.

```json
"scripts": {
  ...,
  "prettier": "prettier --config .prettierrc --write \"**/*.{js,jsx}\"",
  "prettier-docs": "prettier --config .prettierrc --write \"**/*.md\"",
  "lint": "eslint --cache \"**/*.{js,jsx}\""
},
"lint-staged": {
  "*.{js,jsx}": [
    "eslint --fix",
    "npm run prettier",
    "eslint ."
  ],
},
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
```

That should do it. Now before every commit, ESLint and Prettier will run, if there happens to be any unresolvable errors in your code, eslint will throw them here.

I hope this has been helpful!
