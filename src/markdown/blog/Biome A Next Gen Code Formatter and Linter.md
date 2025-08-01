---
title: "Biome - A Next-Gen Code Formatter and Linter"
description: "An exploration of Biome, a Rust-based all-in-one replacement for ESLint and Prettier, discussing its benefits, community engagement, and adoption in the JavaScript ecosystem."
pubDate: "February 13 2024"
---

Developers that work in repositories containing some sort of server-side JavaScript have likely encountered ESLint or Prettier at some point in their career. Both packages can be amazing to work with; and when combine, a powerful combination is formed. It's getting that combination working together, across _all environments_ is where the challenges begin.

It almost seems like there should be a single package capable of managing linting and code formatting, right? That's where [Biome](https://biomejs.dev/) comes into the picture. Maintained by an active community on GitHub under both the [MIT License](MIT%20License) and [Apache 2.0 License](https://github.com/biomejs/biome/tree/main/LICENSE-APACHE). Biome is an all-in-one, drop-in replacement for ESLint, Prettier and similar alternatives.

## The Challenge with Linters and Code Formatters

Both linting and code formatting may seem trivial for small projects. However, as the number of contributors rise, so do the different styles of authoring code. Linting enforces code to be written in a consistent way, while code formatting automatically formats code to a pre-defined standard.

There are many pain points to be addressed while working with linters and code-formatters. Some notable hurdles that are commonly encountered are within the industry are:

- Initial configurations and dependency management.

- Getting a code-formatter to play nice with a linter.

- Getting a code-formatter to play nice with a linter, in the build processes.

- Having to define and continuously modify strikingly similar rules across multiple configuration files in a way that they don't overlap with one another.

These are only a handful of the challenges Biome aims to solve.

Interestingly, being that is written entirely in Rust, the package allows for engineers to entirely opt out of the Nodejs process entirely; a first of its kind for linters and code formatters in the JavaScript community.

## Strong Community Engagement

When building in public, a project can succeed or fail based on the engagement and feedback received from the community. By those criteria, Biome could be considered a massive success with a wide adaptation in the JavaScript (and TypeScript) communities.

I don’t think the feedback is that strong because it’s written in Rust either. The contributors behind Biome are impressive. In fact, they recently [won a $25,000 challenge](https://biomejs.dev/blog/biome-wins-prettier-challenge/) presented by some great folks at Prettier. A challenge the Biome team was able to accomplish within hours, credit to which [Emanuele Stoppa](https://twitter.com/ematipico) of Biome credited the amazing coordination between contributors. They also held a [logo contest](https://github.com/biomejs/biome/discussions/141) themselves, which drew an impressive number of submissions.

Aside from hosting and participating in contests - the community has translated the documentation for Biome; now supporting languages such as Japanese and Chinese. All of which have been [described as impressively accurate](https://twitter.com/unvalley_/status/1733534691024855232).

Blazingly modern developers may rejoice in the documented support for all modern package managers including: npm, yarn, pnpm, bun, and deno. A level of detail we do not often see in technical documentation.

## Interested in Adopting Biome?

In practice, the configuration and overall experience is going to feel like what you would you’d see in ESLint, making the migration for you and your team a seamless one.

Biome has full support for VSCode that, when integrated, allows developers to format and lint files on save, or via command. In addition, you may also find support for Biome in IntelliJ, Neovim, helix, coc-biome, submile text, and emacs. No word on Zed yet.
