---
title: "My Mom Tried To RSVP Through A MarriedNext Portal"
description: "Early feedback from handing out our first wedding invitations and watching my mom try to RSVP through MarriedNext for the first time."
pubDate: March 22 2026
tags: ["marriednext", "wedding-tech", "ux", "product-feedback", "rsvp"]
author: "Matthew Bub"
---

> Disclaimer: I am the maintainer of [MarriedNext](https://marriednext.com/?utm_source=mattbub.com&utm_medium=blog&utm_campaign=my-mom-tried-to-rsvp-through-a-marriednext-portal). It exists as a backend originally intended for [yulissaandmatthew.com](https://yulissaandmatthew.com/?utm_source=mattbub.com&utm_medium=blog&utm_campaign=my-mom-tried-to-rsvp-through-a-marriednext-portal) but was later engineered into a web system that can serve millons of other weddings at once. This article conveys my developer journey, and initial user feedback.

My fiancée and I handed out the first set of invitations for [yulissaandmatthew.com](https://yulissaandmatthew.com/?utm_source=mattbub.com&utm_medium=blog&utm_campaign=my-mom-tried-to-rsvp-through-a-marriednext-portal) today. (The first live tenant of [MarriedNext](https://marriednext.com/?utm_source=mattbub.com&utm_medium=blog&utm_campaign=my-mom-tried-to-rsvp-through-a-marriednext-portal).) Like, we physically handed my mom and dad their invitations, also my brother and his wife as well. We've done a pretty good job keeping the site a secret, but my mom knows we've been working on it for a while so she was pretty hyped to check it out.

This is technically the soft launch of [MarriedNext](https://marriednext.com/?utm_source=mattbub.com&utm_medium=blog&utm_campaign=my-mom-tried-to-rsvp-through-a-marriednext-portal) and its underlying services. 🎉 It's always great to see users engage with your site for the first time, and while there was nothing but compliments from the UI perspective; the UX proved as complicated as I had feared.

The RSVP flow is kind of tricky from a UX perspective. The `guest` 's get grouped by `invitation` and if you look up one guest on an invitation, you can RSVP on behalf of everyone in your invitation.

Whats proving to be a problem - is the name lookup itself. The code works just fine; in-fact I have [Sentry](https://sentry.io/?utm_source=mattbub.com&utm_medium=blog&utm_campaign=my-mom-tried-to-rsvp-through-a-marriednext-portal) setup to capture failed lookups so I can monitor the situation. I'm seeing, and receiving feedback from my mom that the RSVP lookup is ambiguous or difficult at the least. Her initial feedback was that she tried every combination of names she could think of and just couldn't get it to work. She had my dad try too. We have her down as "Terri", because thats how it was written on the invitation. Competitors impose first + last name restrictions and I can see why, but I wanted to create something more flexible.

Anyway, thats 2/2 failed attempts, she had to get me on the phone and I was able to walk her through the lookup process and get her to that "aha" moment. While on that phone call I took (literal) note of all of her confusion, and pain points and have been taking steps to solidifying a more consistent user experience ever since. She also gave me a bunch of compliments on the overall site, plus a bunch of constructive feedback.

I applied the feedback by improving the instructions in the RSVP lookup. They were unclear and contradicting before, now the defaults are consistent; and the overrides for [yulissaandmatthew.com](https://yulissaandmatthew.com/?utm_source=mattbub.com&utm_medium=blog&utm_campaign=my-mom-tried-to-rsvp-through-a-marriednext-portal) are much more concise. I'm also actively working on the enhancements that she has suggested as well. They're pretty minor but made sense:

- Add a recap to the end of the RSVP flow to show who has confirmed and declined
- Add a recap to the email to show who RSVP'd

So anyway, i got a bit more work to do. My fiancée is waiting on me to finish this, so we can get the wedding invitations out. 😬 I'll do a follow up article on the underlying technologies that power [MarriedNext](https://marriednext.com/?utm_source=mattbub.com&utm_medium=blog&utm_campaign=my-mom-tried-to-rsvp-through-a-marriednext-portal) soon.
