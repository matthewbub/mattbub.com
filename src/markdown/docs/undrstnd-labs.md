---
title: "undrstnd-labs"
description: "Open source tools for building AI-powered applications — SDKs, utilities, and reference implementations."
version: "0.2.0"
repo: "https://github.com/undrstnd-labs"
---

## Overview

undrstnd-labs is a collection of open source packages for building AI-powered applications. The goal is to provide practical, well-tested building blocks that handle the boring parts so you can focus on your product.

Each package is standalone — use one, use all, or use none. No vendor lock-in.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@undrstnd/core` | Shared types, utilities, and base classes | Stable |
| `@undrstnd/client` | HTTP client for AI service integrations | Stable |
| `@undrstnd/react` | React hooks and components for AI UIs | Beta |

## Quick Start

### Installation

```bash
npm install @undrstnd/core @undrstnd/client
```

### Basic Usage

```typescript
import { createClient } from "@undrstnd/client";

const client = createClient({
  provider: "openai",
  apiKey: process.env.AI_API_KEY,
});

const response = await client.chat({
  messages: [{ role: "user", content: "Hello" }],
  model: "gpt-4",
});

console.log(response.content);
```

## @undrstnd/core

The core package provides shared types and utilities used across all other packages.

### Types

```typescript
import type {
  Message,
  ChatRequest,
  ChatResponse,
  StreamEvent,
  ProviderConfig,
} from "@undrstnd/core";
```

### Message Format

```typescript
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  metadata?: Record<string, unknown>;
};
```

### Utilities

```typescript
import { tokenEstimate, truncateMessages } from "@undrstnd/core";

// Rough token count (no tokenizer dependency)
const tokens = tokenEstimate("Hello, world!");

// Trim oldest messages to fit context window
const trimmed = truncateMessages(messages, { maxTokens: 4096 });
```

## @undrstnd/client

A provider-agnostic HTTP client for AI services.

### Configuration

```typescript
import { createClient } from "@undrstnd/client";

const client = createClient({
  provider: "openai",    // or "anthropic", "cohere", etc.
  apiKey: "sk-...",
  baseUrl: "https://api.openai.com/v1",  // optional override
  timeout: 30_000,       // ms, default 30s
  retries: 3,            // default 3
});
```

### Chat Completions

```typescript
const response = await client.chat({
  model: "gpt-4",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Explain monads in one sentence." },
  ],
  temperature: 0.7,
  maxTokens: 256,
});

console.log(response.content);
console.log(response.usage); // { prompt: 24, completion: 42, total: 66 }
```

### Streaming

```typescript
const stream = client.stream({
  model: "gpt-4",
  messages: [{ role: "user", content: "Write a haiku about code." }],
});

for await (const event of stream) {
  if (event.type === "content") {
    process.stdout.write(event.text);
  }
}
```

### Error Handling

```typescript
import { AIError, RateLimitError } from "@undrstnd/client";

try {
  await client.chat({ ... });
} catch (err) {
  if (err instanceof RateLimitError) {
    console.log(`Retry after ${err.retryAfter}ms`);
  } else if (err instanceof AIError) {
    console.error(err.provider, err.code, err.message);
  }
}
```

## @undrstnd/react

React hooks and components for building AI-powered interfaces.

### useChatStream

```tsx
import { useChatStream } from "@undrstnd/react";

function Chat() {
  const { messages, send, isStreaming } = useChatStream({
    endpoint: "/api/chat",
  });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id} data-role={msg.role}>
          {msg.content}
        </div>
      ))}
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            send(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
        disabled={isStreaming}
      />
    </div>
  );
}
```

### useCompletion

```tsx
import { useCompletion } from "@undrstnd/react";

function Editor() {
  const { complete, completion, isLoading } = useCompletion({
    endpoint: "/api/complete",
  });

  return (
    <div>
      <textarea onChange={(e) => complete(e.target.value)} />
      {isLoading && <span>Thinking...</span>}
      {completion && <pre>{completion}</pre>}
    </div>
  );
}
```

## Architecture

```
@undrstnd/core          ← shared types & utilities
    ↑
@undrstnd/client        ← provider-agnostic HTTP layer
    ↑
@undrstnd/react         ← React bindings
```

Each layer only depends on the one below it. You can use `core` without `client`, or `client` without `react`.

## Contributing

1. Clone the monorepo
2. Run `pnpm install` at the root
3. Run `pnpm dev` to start all packages in watch mode

### Conventions

- TypeScript strict mode everywhere
- Tests colocated with source (`*.test.ts`)
- Changesets for versioning (`pnpm changeset`)
- PR titles follow conventional commits
