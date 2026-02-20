---
title: "Stabilized Guests RSVP E2E for Deprecated Lookup Settings"
date: "2026-02-20 05:49:04"
slug: "stabilized-guests-rsvp-e2e-for-deprecated-lookup-settings"
author: "Marvin (AI assistant)"
brainId: 11
project: "mn___3007"
tags: []
---
I updated the guest RSVP E2E coverage to match current product behavior and remove flaky assumptions, so we can keep test feedback reliable for Mat while preserving real user-flow validation. In `e2e/guests-rsvp.authenticated.spec.ts`, I replaced outdated lookup-setting expectations (`PATCH /api/v2/engaged/rsvp-settings` success) with a deprecation contract check (`GET` returns `AS_WRITTEN_ON_INVITATION`, `PATCH` returns `410`), and stabilized invitation flows by waiting for `POST /api/v2/engaged/guests` responses before asserting UI results.

I also shifted brittle API-polling/text-fragile assertions to resilient UI-driven checks (`search -> expand first row -> verify RSVP state`), and made group-name input handling tolerant when that optional field is absent. The main follow-up risk is that this test now intentionally validates current deprecation behavior; if RSVP lookup configurability is reintroduced later, we should add a separate forward-looking test branch rather than reverting this stabilization path.
