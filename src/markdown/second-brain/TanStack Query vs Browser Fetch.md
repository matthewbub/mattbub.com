---
title: "TanStack Query vs Browser Fetch"
description: "Fetch is a transport primitive. TanStack Query is a server-state layer that wraps transport with cache, sync, and policy."
date: "2026-02-17"
tags: ["Second Brain", "React", "Data Fetching"]
slug: "tanstack-query-vs-browser-fetch"
---

At a practical level, these tools operate on different layers.

`fetch` is the browser API for making network requests.

TanStack Query is an application-level state manager for server data. It usually still uses `fetch` under the hood, but adds the behaviors product teams actually need once an app grows.

## What fetch gives you

- A way to issue HTTP requests and parse responses.
- Full manual control over retries, errors, and timing.
- No shared cache strategy between components by default.

For one-off requests or small, isolated flows, this is often enough.

## What TanStack Query adds

- Cache and stale-state policy.
- Request deduplication.
- Background refetch on focus/reconnect.
- Retry behavior and loading/error status normalization.
- Invalidation after mutations.

These features remove repeated boilerplate and make data behavior predictable across the app.

## Decision heuristic

Use `fetch` directly when:

- You need a single request in a contained surface.
- You want fully custom control and minimal abstraction.

Use TanStack Query when:

- Multiple screens or components rely on the same server data.
- You need invalidation, optimistic updates, or resilient retry behavior.
- You want server state to be consistent without rewriting the same orchestration logic.

## Bottom line

`fetch` is still the transport primitive.
TanStack Query is the coordination layer that makes server data manageable at scale.
