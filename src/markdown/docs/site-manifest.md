---
title: "site-manifest"
description: "Framework-agnostic manifest contract for localized labels, grouped fields, and repeater-backed content."
version: "0.3.1"
repo: "https://github.com/matthewbub/site-manifest"
---

## Overview

`site-manifest` is a small TypeScript package for defining editable site content with a single schema-backed contract. It keeps authoring, validation, and runtime resolution aligned by letting you define one manifest shape and reuse it everywhere.

It revolves around three field kinds:

- `string` for one localized value
- `group` for keyed label maps
- `repeater` for ordered structured items

## Install

```bash
pnpm add site-manifest
```

## Define Fields

Each label field declares a `kind` that determines its shape.

```ts
const titleField = {
  key: "title",
  label: "Title",
  kind: "string",
  defaultValue: { en: "Welcome" },
};
```

### Group Fields

Use `group` when one field owns several named labels.

```ts
const linksField = {
  key: "links",
  label: "Links",
  kind: "group",
  fields: [
    { key: "home", label: "Home", defaultValue: { en: "Home" } },
    { key: "features", label: "Features", defaultValue: { en: "Features" } },
  ],
};
```

### Repeater Fields

Use `repeater` for arrays like FAQs, schedules, or feature lists.

```ts
const faqField = {
  key: "items",
  label: "Items",
  kind: "repeater",
  itemFields: [
    { key: "question", label: "Question", kind: "string" },
    { key: "answer", label: "Answer", kind: "string" },
  ],
};
```

## Define A Manifest

`defineSiteManifest()` preserves literal types while returning the same object shape.

```ts
import { defineSiteManifest } from "site-manifest";

const manifest = defineSiteManifest({
  id: "example-site",
  locales: ["en"],
  sections: [
    {
      id: "hero",
      title: "Hero",
      enabledByDefault: true,
      labels: [
        {
          key: "title",
          label: "Title",
          kind: "string",
          defaultValue: { en: "Welcome" },
        },
      ],
    },
  ],
});
```

## Validate

`validateManifest()` checks the manifest against the bundled Draft 2020-12 JSON Schema and throws if the shape is invalid.

```ts
import { validateManifest } from "site-manifest";

validateManifest(manifest);
```

For non-throwing validation, use `isValidManifest()` or `getManifestValidationErrors()`.

## Resolve Values

`createLabelSet()` merges persisted overrides with manifest defaults for one locale.

```ts
import { createLabelSet } from "site-manifest";

const labelSet = createLabelSet({
  manifest,
  locale: "en",
  labels: {
    en: {
      hero: { title: "Hello" },
    },
  },
});
```

## Read Content

### String Values

Use `value()` for single fields.

```ts
labelSet.value("hero", "title");
// "Hello"
```

### Groups

Use `group()` for grouped labels.

```ts
labelSet.group("navigation", "links");
// { home: "Home", features: "Features" }
```

### Repeaters

Use `items()` for array-shaped content.

```ts
labelSet.items("faq", "items");
// [{ question: "Question", answer: "Answer" }]
```

## Hidden Metadata

`hidden()` reads per-field hidden state from `_hidden` by default.

```ts
labelSet.hidden("hero", "title");
```

Pass `hiddenKey` to `createLabelSet()` if your persisted metadata uses a different key.

## Helper Exports

The package also exports two small lookup helpers:

- `getSection(manifest, sectionId)`
- `getField(manifest, sectionId, key)`

They are useful when building editors or admin tooling on top of the manifest.

## Public API

- `defineSiteManifest(manifest)`
- `validateManifest(manifest)`
- `isValidManifest(manifest)`
- `getManifestValidationErrors(manifest)`
- `createLabelSet({ manifest, labels, locale, hiddenKey? })`
- `getSection(manifest, sectionId)`
- `getField(manifest, sectionId, key)`
