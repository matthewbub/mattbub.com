---
title: "When to Reach for TanStack Query over Fetch"
description: "When to reach for TanStack Query as a frontend engineer, and how to justify it over plain fetch with real code examples."
date: "2026-02-19"
tags: ["Second Brain", "React", "Data Fetching"]
slug: "when-to-reach-for-tanstack-query-over-fetch"
---

If you've ever said "we can just use `fetch`," you're not wrong.

But you might be under-scoping the problem.

As front-end engineers, we're usually not fighting "how do I make one HTTP request?"
We're fighting server-state orchestration:

- How long is this data valid?
- Who else in the app needs it?
- What happens after a mutation?
- Do we refetch on focus/reconnect?
- How do we avoid duplicated request logic and stale UIs?

`fetch` is a transport API. TanStack Query is a server-state management layer that can use `fetch` under the hood. They solve different problems.  
`fetch` is still in the stack either way. ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), [TanStack Overview](https://tanstack.com/query/latest/docs/framework/react/overview))

## The honest `fetch` version

For isolated pages, this is totally fine:

```tsx
import { useEffect, useState } from "react";

type User = { id: string; name: string };

export function UserCard({ userId }: { userId: string }) {
  const [data, setData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as User;
        setData(json);
        setError(null);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No user found</p>;

  return <p>{data.name}</p>;
}
```

No complaints. This is clean for one-off usage.

But the second this same data is needed in multiple components, with freshness rules, retries, and post-mutation sync, you're writing infrastructure code over and over.

## The part where teams start feeling pain

With plain `fetch`, you eventually hand-roll:

- Cache shape and cache lifetime
- Shared loading/error states
- Background refresh behavior
- Retry rules
- Invalidation after writes
- Cancellation wiring via `AbortController`

All of that is doable. It's also a lot of repeated engineering tax.

`fetch` gives you request/response primitives, not server-state policies. ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API))

## When I reach for TanStack Query

### 1) Same data used in more than one place

TanStack Query uses query keys to cache and coordinate server state across components.  
If query keys match, those queries share the same cache entry and lifecycle. ([Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), [Caching](https://tanstack.com/query/latest/docs/framework/react/guides/caching))

```tsx
import { useQuery } from "@tanstack/react-query";

function useUser(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });
}
```

Now `ProfileHeader` and `AccountPanel` can both call `useUser(userId)` without building a custom cache layer.

### 2) You care about freshness policy, not just "did it load once"

Out of the box, TanStack Query treats cached data as stale and can refetch on mount, window refocus, and reconnect. It also retries failed queries by default. ([Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults))

```tsx
const userQuery = useQuery({
  queryKey: ["user", userId],
  queryFn: fetchUser,
  staleTime: 2 * 60 * 1000, // 2 minutes fresh
  retry: 2,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
});
```

This is the core "production app" reason to reach for it. Data policy becomes explicit and consistent.

### 3) Your mutations should update the right reads automatically

After writes, TanStack Query pushes you toward targeted invalidation.  
So you mutate, then invalidate relevant keys, and active queries refetch in the background. ([Invalidation from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations), [Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation))

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

const updateUserMutation = useMutation({
  mutationFn: updateUser,
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["user", userId] });
    await queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
```

Without this, your team is manually deciding everywhere: "do we refetch? patch local state? hope it's fine?"

### 4) You want optimistic UI without spaghetti rollback logic

TanStack Query supports optimistic updates with `onMutate`, rollback on `onError`, and final invalidation in `onSettled`. ([Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates))

```tsx
const mutation = useMutation({
  mutationFn: addTodo,
  onMutate: async (newTodo, context) => {
    await context.client.cancelQueries({ queryKey: ["todos"] });
    const previousTodos = context.client.getQueryData(["todos"]);
    context.client.setQueryData(["todos"], (old: any[] = []) => [...old, newTodo]);
    return { previousTodos };
  },
  onError: (_err, _newTodo, result, context) => {
    context.client.setQueryData(["todos"], result?.previousTodos);
  },
  onSettled: (_data, _error, _variables, _result, context) => {
    context.client.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

Same story: possible by hand, but a lot of custom edge-case code.

## "But we can do all of this with fetch"

True. You can.

The question isn't "is it possible?"  
The question is "do we want to keep rebuilding server-state orchestration ourselves?"

TanStack Query is usually worth it when:

- Server data is shared across screens/components
- UX needs resilience (retry, refetch on reconnect/focus)
- Mutations must keep reads coherent
- You want consistent, testable data behavior instead of one-off hook logic

## Quick decision rule

Use plain `fetch` when:

- The data flow is isolated and simple
- You genuinely want minimal abstraction
- Cache invalidation/freshness policy is not a concern yet

Use TanStack Query when:

- Server-state behavior is becoming a product concern
- Multiple engineers are touching the same data domains
- You're paying the "manual orchestration tax" repeatedly

## Bottom line

`fetch` is still the network primitive.  
TanStack Query is the coordination layer for server state.

If all you need is one request, use `fetch`.  
If you need predictable data behavior across a real app, reach for TanStack Query.

## Sources

- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [TanStack Query: Overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Query: Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [TanStack Query: Caching](https://tanstack.com/query/latest/docs/framework/react/guides/caching)
- [TanStack Query: Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [TanStack Query: Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)
- [TanStack Query: Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)
- [TanStack Query: Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [TanStack Query: Query Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation)
