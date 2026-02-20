---
title: "There's a File Explorer Built Into Your Terminal"
description: "A quick look at terminal-based file explorers that can streamline your workflow and eliminate the need to switch between your terminal and GUI file manager."
pubDate: "March 10 2024"
tags: ["vim", "netrw", "terminal", "productivity", "tools"]
author: "Matthew Bub"
---

Did you know there's a file explorer built into your terminal? I'm not talking about `ls` or even `ls -1` but rather the [Netrw plugin](https://www.vim.org/scripts/script.php?script_id=1075) included in Vim!

To use Netrw, you'll need a basic understanding of [how to navigate the Vim interface in Command mode](https://www.matthewbub.com/articles/vim-motions-a-generalists-guide).

Once in Vim, we can enter the "Explorer mode" using the command `:Explore`. It's worth mentioning that the Explore mode is unique to Netrw.

![Vim in explorer mode](https://azhrbvulmwgxcijoaenn.supabase.co/storage/v1/object/public/my-blog/mar-2024/newrt-in-explorer-mode.png?t=2024-03-08T13%3A49%3A38.631Z)

## Quick Keys

To open the file explorer in the current window, you can use the following to get where you're trying to go.

```vim
:Explore
```

Or for a vertical split:

```vim
:Vexplore
```

And for a horizontal split:

```vim
:Sexplore
```

It's pretty handy stuff. So, while drafting this article, I ended up diving much deeper into Netrw than I had initially anticipated. Here are some of the capabilities I've discovered.

These are some cool things you can do once you've entered the Explorer state.

## Creating Files and Directories

You can create new files and directories directly from Netrw.

**To create a file**

1. Navigate to the desired directory and press `%`
2. Type the name of the new file.

## Renaming and Moving Files or Directories

**To rename or move a file or directory**

1. navigate to the item you want to rename, press `R`,
2. Type the new file name.

## Deleting Files and Directories

**To delete a file or directory**

1. Navigate to the item and press `D`
2. You will be asked to confirm the deletion.

---

There are many reasons to like Vim; this is just one more. I'm sure there's a lot more to unpack here with Netrw, but it's interesting to know this type of capability is baked into our terminals and isn't unique to IDEs such as Neovim, as I might have assumed before.
