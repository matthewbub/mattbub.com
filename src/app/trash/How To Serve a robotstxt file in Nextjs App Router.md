---
title: "How To Serve a robots.txt file in Next.js App Router"
description: "A simple step-by-step guide to serve a robots.txt file using a serverless function in Next.js's App Router."
pubDate: "March 6 2024"
---

In this guide, we'll walk through the simple steps required to serve a `robots.txt` file using a serverless function in Next.js's App Router. This task is straightforward, and we aim to keep it that way.

### Step-by-Step Guide

Create the route handler for the `robots.txt` file

```shell
mkdir src/app/robots.txt
touch src/app/robots.txt/route.ts
```

Then, create a serverless function in your Next.js application. This function will return the `robots.txt` content.

Here's a basic example:

```ts
export async function GET() {
  const robotstxt = `User-agent: *\nSitemap: https://www.yoursite.com/sitemap.xml\nDisallow: /api/`;
  return new Response(robotstxt, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "s-maxage=31556952",
    },
  });
}
```

You may not have a sitemap for your site, but if you do, don't forget to replace the `https://www.yoursite.com/sitemap.xml` with your actual sitemap URL.

### Understanding the robots.txt File

A `robots.txt` file instructs web crawlers about pages or sections of your site that should not be processed or indexed. This allows you to control the search engine's access to your site and ensure that only relevant content is made searchable.
