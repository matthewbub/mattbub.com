---
title: "Tailwind CSS Is Good for Us"
description: "An exploration of Tailwind CSS, its benefits, and real-world application in Next.js development, discussing both its advantages and potential drawbacks."
pubDate: July 2 2021
tags: ["tailwindcss", "css", "frontend", "styling", "nextjs", "design-system"]
---

# Tailwind CSS Is Good for Us.

I am not first person to go and jump on the bandwagon for the latest and greatest new framework or library. It wasn't until I was browsing the frontend subreddit when I stumbled across a seemingly one-sided argument stating that **the philosophy of Tailwind is not a best practice due to the overwhelming nature of the html classes**, comparing it to services such as Atomic CSS, (For those like myself that had to google that, Atomic CSS is a CSS architecture as a non opinionated set of classes representing single-purpose styling units).

For one reason or another **I decided to challenge this argument** and would come to spend the next few weeks working with Tailwind as the library of choice for a real world Next.js Application.

## Here's what I've learned

For the most part I have found the installation and setup to be a well documented and smooth process. There are a few caveats meaning that seemed a bit foreign coming from frameworks like Bootstrap, but none that were not quickly identified and adaptable early on. Very nice.

To the credit of the developers, the website itself is quite solid in terms of accessibility and documentation. The theme is comparable to that of a simplified version of the [Stripe Documentation](https://stripe.com/docs), bringing the "everything you need" and my personal favorite, "no filler" approach. I believe the documentation behind Tailwind is a big enough reason to assume Tailwind will stand the test of time.

Getting back to my personal experience, once the development environment had been established and I was off to coding. I found the initial experience to be nothing like what the angry redditor had told us, at this point I am quickly becoming a fan. I even stumbled upon [a spawn of Tailwind, (TUK)](https://tailwinduikit.com/) that makes building templates feel more like Bootstrap. The React version needed a bit of rewiring for the `onClick` events, apparently the dev's didn't notice? Anyways no big deal, nothing that wasn't worth doing in the grand scheme of things.

> I believe the documentation behind Tailwind is a big enough reason to assume Tailwind will stand the test of time.

I found that in a short amount of time I was styling components based off memory of the syntax alone. The class names being so similar to CSS really helps dull the learning curve. Although this would later prove a bit problematic when I migrated back to CSS.

Yes, you've read that last bit right. When it comes down to it, the angry redditor was right. While Tailwind is incredibly fast for rapid prototyping, it truly does make for an overly long line of html. So what am I doing here hyping up Tailwind? The dev's over at Tailwind have created an incredibly thorough style guide for writing CSS with the easy to search details.

While we are all in agreement that the data must live somewhere, I suppose I am suggesting to go with what works best for you. In my case I have found creating proprietary class names with smaller groups of styles to be more beneficial for my use case. I just feel `"col"` is a bit easier than `"flex flex-col"` but at this point I am just being nit picky. I think you see where I am going with this.

Today, I continue to work with various CSS preprocessor's and libraries. When it comes to starting new projects, I find myself consistently referring to Tailwind as a general style guide. Overall I would highly recommend you familiarize yourself with this modern framework that is paving the way for future front end development.

- Mat
