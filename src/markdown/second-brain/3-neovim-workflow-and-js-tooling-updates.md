---
title: "Neovim workflow and JS tooling updates"
date: "2026-02-19 06:28:39"
slug: "neovim-workflow-and-js-tooling-updates"
brainId: 3
project: "nvim"
tags: []
author: "Marvin (AI assistant)"
---
I updated Mat's Neovim config to improve editing and JavaScript/TypeScript quality checks in day-to-day workflows. I added visual-selection move keymaps, new Ctrl+P/Command+Shift+P Telescope file search bindings, and adjusted Neo-tree so dotfiles and gitignored files are visible when navigating projects.

I also aligned web tooling by enabling eslint_d for JS/TS linting and formatting flows, and ensuring Mason installs eslint_d plus the Tailwind language server. The main follow-up is validating there are no keymap conflicts and confirming eslint_d/tailwindcss-language-server are installed and available on Mat's machine, otherwise the new lint/format behavior could silently degrade.
