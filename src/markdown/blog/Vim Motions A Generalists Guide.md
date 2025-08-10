---
title: "Vim Motions: A Generalist's Guide"
description: "A practical introduction to Vim motions for developers who want to navigate and edit text more efficiently without getting overwhelmed by advanced features."
pubDate: "February 29 2024"
tags: ["vim", "editor", "keyboard-shortcuts", "productivity", "learning"]
---

Vim can be a wild place without a firm understanding of the motions required to navigate the interface. What at first seems painful by design yields many productivity benefits.

If your only experience with Vim is getting stuck in a Vim instance, this article is for you!

## Basic Modes of Vim

First, let's familiarize ourselves with the basic modes of Vim. Vim operates in four primary modes, each designed for specific tasks.

1. **Normal mode**: The default state you'll see when entering Vim. Typically used for navigating throughout your document and entering into other vim modes.
2. **Insert mode**: This mode resembles a traditional text editor and is the mode people frequently get stuck in.
3. **Visual mode**: Commonly used for highlighting, selecting blocks of text to yank or delete, and more.
4. **Command mode**: Accessed through Normal mode. Enabled the ability to execute commons over files. Think of the ability to save files, search, replace text, execute shell commands, and more. Command mode must be accessed through Normal mode.

## Navigating with Vim Motions

The rest of this article touches on a handful of common Vim motions frequently used within Vim. A firm understanding of these is a healthy starting point in one's Vim journey.

<Standout label="Normal Motions" color="teal">

These simple keystrokes allow you to move around and navigate through a file.

- `j` moves the cursor up.
- `k` moves the cursor down.
- `h` moves the cursor left.
- `l` moves the cursor right.
- `w` jumps forward by a word.
- `b` jumps backward by a word.

</Standout>

You can compound the action of a single motion by utilizing relative line numbers within your IDE. This allows you to move with Vim motions quickly. i.e., `10j` takes you up 10 lines.

<Standout label="Visual Motions" color="blue">

Visual mode provides commands that act on selected text.

- `d` deletes the selected text.
- `dd` deletes the current line.
- `c` cuts the selected text.
- `y` yanks (copies) the selected text.
- `p` pastes the yanked or cut text.
- `v` starts visual selection.
- `u` undoes the last action.

</Standout>

Visual motions can be mixed with normal motions and relative line numbers.

**Heads up!** Yanking and deleting lines go to the same buffer, so if you yank a line and later delete a line in visual mode, you'll override the yank with whatever you had deleted.

<Standout label="Insert Motions" color="yellow">
Most commands related to Insert mode will involve taking you into Insert mode because once you're inside Insert mode - it's a traditional editorial experience.

There are various ways to enter insert mode. Here are two more commonly used approaches to enter insert mode from normal mode.

- `i` takes you to the left of the cursor
- `a` takes you to the right of the cursor

### Command mode

Let's dive a little deeper into this one; there's a lot you can do here, so consume the list at your own pace or use it as a defense if anything else.

**Saving and Exiting**

- `:w` saves the current file but keeps it open for further editing.
- `:q` quits the current window. If there are unsaved changes, Vim will warn you.
- `:wq` or `:x` saves the current file and exits.
- `:q!` quits without saving, discarding any changes made since the last save.

**Opening and Creating Files**

- `:e filename` opens a file named "filename" in the current window, allowing you to edit a different file without leaving Vim.
- `:tabe filename` opens a file in a new tab, enabling you to work with multiple files.

**Searching and Replacing**

- `:/pattern` searches for "pattern" in the document. You can navigate through occurrences with `n` (for next) and `N` (for previous).
- `:%s/old/new/g` replaces all occurrences of "old" with "new" throughout the document. The `g` at the end specifies that the replacement should happen globally across the entire file. Without `g`, only the first occurrence in each line would be replaced.

**Line Navigation**

- `:number` jumps to the line number specified. For example, `:25` would take you directly to line 25.
- `:$` moves the cursor to the last line of the document.
- `:0` or `:1` takes you to the document's first line.

**Setting Preferences** (Typically managed in a dotfile but can be done on the fly)

- `:set number` turns on line numbering. This can help you navigate through your document.
- `:set relativenumber` enables relative line numbering, which is particularly useful with Vim's motion commands.
- `:set norelativenumber` switches back to absolute line numbering.
- `:set nowrap` disables text wrapping, which can be useful when editing code or configuration files.

</Standout>

## Advanced Motions

Once you're comfortable with the basics, you can explore more advanced motions to enhance your productivity in Vim.

<Standout label="Moving Lines" color="fuchsia">
Two common default options for moving lines in Vim are `dd` and `p`, and explicitly _moving_ lines. Deleting a line with `dd` and pasting it with `p` works, because the deleted line is stored in a buffer.

To explicitly move a single line, you can use the following commands:

- `:m +1` moves the current line down by one.
- `:m -2` moves the current line up by two. (Including the current line, this is a net movement of one line up.)

For moving multiple lines, enter Visual mode with `V`, select the lines you want to move, and then choose your preferred movement command.
</Standout>
