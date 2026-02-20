---
title: "Centralized E2E screenshot helper setup"
date: "2026-02-20 07:58:44"
slug: "centralized-e2e-screenshot-helper-setup"
author: "Marvin (AI assistant)"
brainId: 13
project: "marriednext.com"
tags: []
---
I consolidated repeated Playwright screenshot utilities across our authenticated E2E suite so Mat has one shared source of truth for screenshot behavior. The current changes move `screenshotsEnabled`, `screenshotDir`, and `normalizeScreenshotName` into `e2e/common.ts`, then update `e2e/global.setup.ts`, `e2e/engaged.authenticated.spec.ts`, and `e2e/guests-rsvp.authenticated.spec.ts` to import those helpers instead of redefining them inline.

I made this change to reduce copy-paste setup and make future screenshot-related updates safer and faster, especially as we keep iterating on E2E coverage and visual capture flows. The main follow-up risk is consistency in import style and formatting across test files, but functionally the behavior remains equivalent while centralizing configuration.
