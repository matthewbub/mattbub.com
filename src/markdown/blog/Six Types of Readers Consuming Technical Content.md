---
title: "6 Types of Readers Consuming Technical Content"
description: "A commonly overlooked and possibly neglected faucet of software development is the end user's manual. For the purposes of simplicity, we should assume everyone that can use our product or service is also going to have a question that can be answered in some sort of technical documentation. When..."
pubDate: "February 14 2024"
---

An aspect of software development that is often overlooked and possibly neglected is creating an end user's manual. We should assume that everyone who uses our product or service will have a question that can be answered in technical documentation. So, for simplicity, it's important to create clear and concise documentation for our users.

When users have enough knowledge of a product or service, they become comfortable with its capabilities and limitations. A simple technical document can enable opportunities for invaluable feedback from your core audience.

Technical documentation adds value to the product or service. In the digital age, content that provides value is always an asset.

## Exploring Reading Behaviors

Everyone consumes content differently; beginners may need more handholding, whereas more experienced users might consider the documentation a source of truth.

This article won't cover every type of reader that exists. In fact, I'm sure you'll fall into one or more of these categories depending on your level of engagement with the product or service. _(How are we ranking here?)_

To get the most value from this article, consider the persona of each reader presented below. By understanding how readers find value in your documentation, you might improve your mindset for delivering content that resonates with most audiences.

## TLDR

The six types of readers consuming technical content are:

- The Thorough Reader
- The Reader Who Follows the Tutorials
- The Reader Who Only Reads the Introduction
- The Reverse Engineer
- The Reader Who Scans the Content
- The Reader Who Does Not Read
- Bonus: The Senior Engineer

### 1. The Thorough Reader

This reader is going to read the entire documentation from start to finish (like [@teej_dv](https://www.youtube.com/@teej_dv/videos), who [live-streamed his reading of the Neovim documentation in just under 10 hours](https://youtu.be/rT-fbLFOCy0?si=F1TMEkMlLUXAy_zt)).

We should assume this reader is here for all the value the product or service offers. Understanding why a reader might go to such great lengths may be beneficial. Typically, this will be someone who prefers a more traditional reading experience. They are likely to expect the content to be well-structured and concisely organized.

Attention to detail is crucial here. These are the readers who will submit issues for typos in the documentation.

### 2. The Reader Who Follows the Tutorials

Like the thorough reader, the reader who prefers to follow tutorials will benefit from a "how-to" based experience.

It's important to understand how your audience consumes this type of content, as it is likely not what you expect. These readers may approach the product or service with enough background knowledge that they may not necessarily be looking to _work through_ the "how-to" but are more interested in seeing intended use cases and implementations.

This type of content can vary greatly; the primary takeaway for creating "how to" content is clearly defining the input/output for every step described.

### 3. The Reader Who Only Reads the Introduction

Another common reader might be those who only read the introduction and/ or getting started sections before using the product or service. With proper guidance, these users may avoid frustrations quicker than others.

When considering these readers, you'll want to focus primarily on the value you provide in the introduction and getting started. These readers will benefit from detailed input/output examples; they will "figure the rest out" as they go.

Be sure to keep the first pages of your documentation concise and filled with value. The first few pages might be as far as these readers ever get.

### 4. The Reverse Engineer

Some readers prefer the self-starting approach. They may even begin directly in the source code (if available). These readers will likely have advanced technical knowledge surrounding your product or server or its underlying technology.

These readers will benefit from a centralized reference point with many properly formatted headings. Presuming we're writing a technical document that will be read online, this reader would benefit from deep linking between sections for faster navigation.

A note on deep linking: Be mindful of deep links nested within documents. Consider implementing mechanisms to alert the support team when a deep link dies. Services such as Docusaurus and Next.js offer these capabilities out-of-the-box.

### 5. The Reader Who Scans the Content

These are your speed readers. They are seeking value, but they aren't going to look too deep to find it. They may have a shorter attention span. They're going to benefit from the "flashy" content.

To best support the reader who scans content, it's best to reduce large blocks of text and sprinkle flashy content throughout the document. In the context of technical documentation, flashy content might be considered items such as code blocks, tutorials, links, GIFs, videos, and items of similar nature. Essentially _not just text_.

### 6. The Reader Who Does Not Read

Some people wouldn't read the manual if you paid them, too. Understandably, there isn't much we can do about these readers. Exercising empathy for the reader, they may have been traumatized by poor documentation while using another product or service in the past.

This reader who does not read may never open your manual, but if they do – and you make a good impression on them – they may just come back.

### 7. Bonus: The Senior Engineer

These folks aren't end-users, but they are heavily involved in the product or service's success. They spend the most time with a product or service's inner workings. Therefore, they rely on type definitions, markdown files that stay close to the code, comments in code, and simply dissecting the source code as their documentation.

This suits these types of readers, especially in the context of open-ended products. Their use cases likely span beyond what can be covered in any amount of technical documentation. You need not worry about these readers; they will find what they need.

## Which reader are you?

Hopefully, this article has provided insight into how your target audience might be looking to consume the technical documentation you create.
