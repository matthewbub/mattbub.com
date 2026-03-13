---
title: "sbrain-SKILL"
description: "A structured skill format for AI coding agents — define capabilities, constraints, and context in one file."
version: "0.1.0"
repo: "https://github.com/matthewbub/sbrain-SKILL"
---

## Overview

sbrain-SKILL is a structured format for defining AI agent capabilities. A single `SKILL.md` file gives any coding agent the context it needs — what it can do, what it shouldn't do, and how to do it well.

Think of it as a resume for your AI agent's abilities, written in a format both humans and machines can parse.

## Quick Start

Create a `SKILL.md` file in the root of your project:

```markdown
---
name: "my-skill"
version: "0.1.0"
description: "A brief description of what this skill enables."
---

## Capabilities

- Describe what the agent can do
- List specific actions or transformations

## Constraints

- Define boundaries and limitations
- Specify what the agent should NOT do

## Context

Additional information the agent needs to perform well.
```

That's it. Drop it in your repo and any compatible agent picks it up automatically.

## File Structure

The SKILL file uses YAML frontmatter for metadata and markdown sections for content:

```
SKILL.md
├── Frontmatter (YAML)
│   ├── name
│   ├── version
│   └── description
├── Capabilities (what it can do)
├── Constraints (what it shouldn't do)
└── Context (background knowledge)
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the skill |
| `version` | Yes | Semver version string |
| `description` | Yes | One-line summary |

### Sections

**Capabilities** — A list of specific things the agent can do when this skill is loaded. Be concrete and actionable.

**Constraints** — Guardrails. Things the agent should avoid, edge cases to watch for, or hard limits on behavior.

**Context** — Background knowledge that helps the agent make better decisions. Architecture details, naming conventions, or domain-specific terminology.

## Design Principles

### Minimal by default

A SKILL file should be readable in under 60 seconds. If you need a wall of text, you probably need multiple skills.

### Human-first

The format is markdown because humans need to read and edit it. YAML frontmatter because it's the simplest structured header format.

### Composable

Skills are meant to be combined. An agent might load `react-skill`, `testing-skill`, and `your-project-skill` together. Keep each one focused.

## Examples

### React Component Skill

```markdown
---
name: "react-components"
version: "1.0.0"
description: "Build React components following project conventions."
---

## Capabilities

- Create functional components with TypeScript
- Implement hooks for state and side effects
- Build accessible UI following WAI-ARIA patterns

## Constraints

- No class components
- No default exports (use named exports)
- No inline styles — use CSS modules

## Context

This project uses React 19 with TypeScript 5.x.
Component files live in `src/components/`.
Tests are colocated as `ComponentName.test.tsx`.
```

### API Integration Skill

```markdown
---
name: "api-client"
version: "1.0.0"
description: "Interact with the project's REST API."
---

## Capabilities

- Make authenticated API requests
- Handle pagination and rate limiting
- Transform API responses to domain models

## Constraints

- Always use the shared HTTP client (never raw fetch)
- Never log or expose API keys
- Retry logic maxes out at 3 attempts

## Context

Base URL is configured via `API_BASE_URL` env var.
Auth tokens are stored in httpOnly cookies.
All endpoints return `{ data, meta, errors }` shape.
```

## API Reference

### Loading a SKILL file

```typescript
import { parseSkill } from "sbrain-skill";

const skill = parseSkill("./SKILL.md");

console.log(skill.name);         // "my-skill"
console.log(skill.version);      // "0.1.0"
console.log(skill.capabilities); // string[]
console.log(skill.constraints);  // string[]
```

### Validating

```typescript
import { validateSkill } from "sbrain-skill";

const result = validateSkill("./SKILL.md");

if (!result.valid) {
  console.error(result.errors);
}
```

### Composing Skills

```typescript
import { composeSkills } from "sbrain-skill";

const combined = composeSkills([
  "./skills/react.md",
  "./skills/testing.md",
  "./skills/project.md",
]);

// Merged capabilities, constraints, and context
agent.load(combined);
```

## Contributing

This project is open source. If you have ideas for the format or want to build tooling around it:

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description of the change

Keep PRs focused — one concept per PR.
