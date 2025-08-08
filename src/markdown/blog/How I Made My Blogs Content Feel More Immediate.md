---
pubDate: "March 3 2024"
title: "How I Made My Blogs Content Feel More Immediate"
description: "We decided to introduce dates in the form of relative time to articles that were recently published on this blog. A particularly beneficial feature with time-sensitive content."
---

I decided to introduce dates in the form of relative time to articles that were recently published on [this blog](https://www.matthewbub.com/). A particularly beneficial feature with time-sensitive content.

In introducing relative time, it was revealed that the blog's dates need to handle time-zone differences correctly. A pesky problem for content created on this blog, where "breaking news" is applicable.

## The Practical Benefits of Relative Time Formatting

With [relative time](https://en.wikipedia.org/wiki/Time_dilation), you might see: "My Post, published today at 5:51pm" whereas without the relative time, the formatting would be less visually appealing and might display as "My Post, published 03/01/2024 at 5:51pm".

In addition to the latter option being less appealing, there needs to be a clear indication that 03/01/2024 is the current day. I'm leaving it up to the reader to have background knowledge of the current date. Surely not hard to figure out, but surely not ideal when it comes to reading experiences either.

This subtle change significantly enhances the reading experience by making the content feel more immediate and relevant.

## Understanding Time Zone Discrepancies

The timestamp I'll refer to is `2024-03-01T13:51:59.667Z`, which, in the development environment, is being formatted to display as `Today at 5:51AM` - an accurate representation of the current time.

On the live site, however - the same timestamp is displaying as `Today at  1:51pm` - a 6-hour difference. Let's examine the code that formats the date. Then, break down _why_ this is happening.

```ts
import { formatRelative } from "date-fns";

// i.e. "today at 5:51 PM"
export function formatRelativeDate(dateString) {
  return formatRelative(new Date(dateString), new Date());
}
```

**No explicit time zone mentioned**
First and most obvious, there's no mention of explicit [time zone](https://en.wikipedia.org/wiki/Time_zone) behavior here. The absence of explicit time zone handling in this code means that the `formatRelative` function from `date-fns` uses the local time zone of the environment where the code is running.

**Zulu time stamping is as fair as it is inconvenient**
The second and not-so-obvious challenge is the 'Z' at the end of the timestamp being provided (`2024-02-21T13:51:59.667Z`), which signifies [UTC time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), the global standard for regulating clocks and time. I'm not going to change the format of the date, so I won't be exploring any options there.

All things considered, I'm based out of Los Angeles and always will be. I know I'll always use the Los Angeles time zone for formatting. I'll have to make it explicit that time is formatted to PST.

## The Rapidly Evolving NPM Ecosystem

Most of the date-related behavior needed can be managed via the [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) built-in object's in the browser. However, Relative time isn't a default functionality built into most browsers. Meaning this is typically outsourced to open-source libraries such as [`date-fns`](https://date-fns.org/), [`dayjs`](https://day.js.org/), or [`luxon`](https://moment.github.io/luxon/#/).

This would have been really easy to implement with the `date-fns-tz` package, a time zone helper library for `date-fns`, but at the time of this writing, the `date-fns-tz` package is not in sync with `date-fns`, and unfortunately, there are breaking changes that make the `date-fns-tz` package unusable out-of-the-box. It just straight-up doesn't work.

There are a few open issues about this; this seems to be the most popular issue regarding the break: https://github.com/marnusw/date-fns-tz/issues/260. Nevertheless, exploration into other options seems necessary.

### Exploring Alternative Options

I began exploring `dayjs` as an alternative, but `dayjs` doesn't seem to have built-in functionality capable of replicating the specific formatting I had with `date-fns`, or at least I couldn't find a 1:1 replacement to the preferred method within the `dayjs` docs in a timely manner.

Migrating to `dayjs` would require changing the functionality of a single function, the one in question above, which I explored. Here's the `dayjs` version, not fully accounting for days further than 2 days back

```js
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import relativeTime from 'dayjs/plugin/relativeTime';
import time-zone from 'dayjs/plugin/time-zone';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with the necessary plugins
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

// Localized "today at 1:51 PM"
export function formatRelativeDate(dateString) {
  const dateInLATime = dayjs(dateString).tz('America/Los_Angeles');

  let prefix = '';
  if (dateInLATime.isToday()) {
    prefix = 'Today';
  } else if (dateInLATime.isYesterday()) {
    prefix = 'Yesterday';
  } else {
    return dateInLATime.format('MMMM D, YYYY');
  }

  return `${prefix} at ${dateInLATime.format('h:mm A')}`;
}
```

That code is pretty chunky compared to what `date-fns` provided with zero configuration and conditional logic. Back to `date-fns` because this isn't going to work.

## Ignoring The Problem (Version Locking)

There were some overly complicated workarounds presented in the GitHub issue that could provide possible solutions. But let's face it, my use case is simple.

The easiest way to move forward here would be to downgrade `date-fns` to a specific point in time to make the `date-fns-tz` package work, then set a watcher on the `date-fns-tz` repository so I can bring both packages up-to-date when the maintainers can fix the breaking changes.

Navigating to the [`date-fns` release history](https://github.com/date-fns/date-fns/releases) to find a release before it became unsynchronized with the `date-fns-tz` library.

The [GitHub issue about the `date-fns` break](https://github.com/marnusw/date-fns-tz/issues/260) made it clear the breaking changes are due to the [v3 release of the `date-fns` library](https://blog.date-fns.org/v3-is-out/). This means my target version will be the last release in v2, which happens to be [v2.30.0](https://github.com/date-fns/date-fns/releases/tag/v2.30.0).

In the blog's applicable `package.json` file, I version-locked the `date-fns` package to 2.30.0 and ran a clean install to bring the blog dependencies up to date.

```js
"date-fns": "2.30.0",
"date-fns-tz": "^2.0.0"
```

This patchwork allows the blog to work with these packages in harmony, with the `date-fns-tz` library not crashing, allowing for a safe merge to prod. This could finally wrap up and move forward.

```js
import { formatRelative } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

const laTimeZone = "America/Los_Angeles";

/**
 * Format Relative Date in 'America/Los_Angeles'
 * @param {string} dateString
 * @returns {string}
 */
export function formatRelativeDate(dateString) {
  // Convert the provided UTC date to Los Angeles time zone
  const laDate = utcToZonedTime(new Date(dateString), laTimeZone);
  // Get the current date and time in Los Angeles time zone
  const nowInLa = utcToZonedTime(new Date(), laTimeZone);
  // Format the relative difference
  return formatRelative(laDate, nowInLa);
}
```

That's the little adventure I went on to bring you the relative dates you see throughout this blog.

I'd like to hear what others might have done in the same scenario. Would you have migrated the single function to `dayjs` or stuck with `date-fns` like I did?

Special thanks to the maintainers of these projects for making all of this discussion and possibility for exploration possible. I appreciate you all!
