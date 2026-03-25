---
title: "porkbun-provider"
description: "A lightweight TypeScript client for managing Porkbun DNS CNAME records"
version: "1.0.0"
repo: "https://github.com/ieportals/porkbun-provider"
---

## Overview

`@ieportals/porkbun-provider` is a zero-dependency TypeScript library that wraps the Porkbun DNS API to create and delete CNAME records. It's designed for use in deployment pipelines, automation scripts, or any Node.js project that needs programmatic DNS management.

## Prerequisites

- **Node.js 18+** (uses the built-in `fetch` global)
- A **Porkbun API key and secret key** from your [Porkbun API settings](https://porkbun.com/account/api)
- **API access enabled** on the domain you want to manage in Porkbun's domain settings

## Installation

```bash
npm i @ieportals/porkbun-provider
```

## Usage

### Creating a client

Import the factory function and pass your Porkbun credentials:

```ts
import { createPorkbunClient } from "@ieportals/porkbun-provider";

const dns = createPorkbunClient({
  baseUrl: "https://api.porkbun.com/api/json/v3",
  apiKey: process.env.PORKBUN_API_KEY || "",
  secretKey: process.env.PORKBUN_SECRET_KEY || "",
  baseDomain: "example.com",
});
```

### Configuration options

| Option | Required | Default | Description |
| --- | --- | --- | --- |
| `baseUrl` | Yes | — | Porkbun API base URL |
| `apiKey` | Yes | — | Your Porkbun API key |
| `secretKey` | Yes | — | Your Porkbun secret API key |
| `baseDomain` | Yes | — | The domain records are managed under |
| `defaultTtl` | No | `"600"` | TTL for created records (in seconds) |
| `defaultNotes` | No | `"Automatically created by @ieportals/porkbun-provider"` | Note attached to created records |

### Creating a CNAME record

```ts
const result = await dns.createCnameRecord("staging", "cname.vercel-dns.com");

if (result.success) {
  console.log(`Record created with ID: ${result.id}`);
} else {
  console.error(`Failed: ${result.error}`);
}
```

This creates a CNAME record pointing `staging.example.com` to `cname.vercel-dns.com`.

### Deleting a CNAME record

```ts
const result = await dns.deleteCnameRecord("staging");

if (result.success) {
  console.log("Record deleted");
} else {
  console.error(`Failed: ${result.error}`);
}
```

## Return type

Both methods return the same shape:

```ts
interface DnsRecordResult {
  success: boolean;
  id?: string;    // present on successful create
  error?: string; // present on failure
}
```

## Example: deployment pipeline

```ts
import { createPorkbunClient } from "@ieportals/porkbun-provider";

const dns = createPorkbunClient({
  baseUrl: "https://api.porkbun.com/api/json/v3",
  apiKey: process.env.PORKBUN_API_KEY || "",
  secretKey: process.env.PORKBUN_SECRET_KEY || "",
  baseDomain: "mysite.com",
  defaultTtl: "300",
  defaultNotes: "Created by deploy script",
});

// Point a preview subdomain to your hosting provider
const subdomain = `preview-${prNumber}`;
await dns.createCnameRecord(subdomain, "cname.vercel-dns.com");

// Clean up after the PR is merged
await dns.deleteCnameRecord(subdomain);
```

## Environment variables

For convenience, you can store your credentials in a `.env` file:

```env
PORKBUN_BASE_URL=https://api.porkbun.com/api/json/v3
PORKBUN_API_KEY=pk1_...
PORKBUN_SECRET_KEY=sk1_...
PORKBUN_BASE_DOMAIN=example.com
```
