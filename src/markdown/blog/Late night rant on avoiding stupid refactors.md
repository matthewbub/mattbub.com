---
title: "Late night rant on avoiding stupid refactors"
description: "A perspective on choosing the right refactoring approach when dealing with legacy code."
pubDate: September 19 2025
tags: ["refactoring", "react", "jsx", "css", "engineering", "best-practices"]
---

As engineers we have to weigh whats most important and generally speaking there's an infinite amount of time that could be spent on refactoring legacy code. (When I say Legacy, I mean code that's already been committed and merged into a release branch)

Take this chunk of React JSX for a website I've been working on, it's defined in like 10 places in this app:

```jsx
<div className="text-center">
  <Link
    href="/"
    className="inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors font-black"
  >
    {t("common.backToHome")}
  </Link>
</div>
```

The markup is already there. The website is already live and making money. We just picked up a Jira ticket with a title: "refactor the back to home button" and no description- classic. Ask yourself, what is easier + worth the effort? It's already there, so whats the lightest way would could "clean this up" and which of these paths would yield the most benefit to us in the future?

There's really two options here. One of them sucks. The other makes sense. I suspect a lot of engineers would choose the option that sucks lol.

Option A: Move the chunk of JSX to it's own component. Likely in it's own file, e.g Schancn Style, then replace the existing references with the new component declaration

```jsx
// components/BackToHomeButton.tsx

export const BackToHomeButton = () => (
  <Link
    href="/"
    className="inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors font-black"
  >
    {t("common.backToHome")}
  </Link>
);
```

Option B: Move the class name to a CSS file, then replace the long tailwind class name with the consolidated version.

```css
/* in the same file we've imported Tailwind */
.btn-backToHome {
  @apply inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors font-black;
}
```

With both options in consideration, which would you choose? This is what the refactor would look like if we opt for the component driven refactor:

```jsx
import { BackToHomeButton } from "@/components/BackToHomeButton";

// ...

<div className="text-center">
  <BackToHomeButton />
</div>;
```

and then here is what the refactor would look like if we were to opt for the CSS only refactor

```jsx
<div className="text-center">
  <Link href="/" className="btn-backToHome">
    {t("common.backToHome")}
  </Link>
</div>
```

To me theres a clear winner here. I think the inconsiderate decision would be to journey down the path of Option A, and the only path that actually makes sense is Option B. Idk what makes more sense to start with but heres my raisins

- Option A requires that we create a new file, and define the same component that already exists.
- Option A requires template logic to stand up the new component
- Option A requires that we replace existing code that we already know is making us money in production
- Option A is dependent on build systems and TS Servers being capable of catching potential errors. (These systems are often not reliable when you are working in old codebases that have multi-step build processes that are totally unique to the way the company has aged (like rings around a tree))
- Option A is pointless, what are you even doing making components that small for. There's more important things to do with your time. (Like write an article about it)
- Option B is refactoring the code to a file that already exists in our application. It's a much lighter refactor.
- Option B is ACTUALLY cleaning up the component, the only thing that was messy about it to begin with was the class name.
- Option B is a 1 line swap that can be preformed confidently via your preferred IDE's "Find and Replace" functionality, which is a huge time savor. (This argument could be make for Option A, but gets wrecked when you have to go to each file and make sure your new component is imported)
- Option B has a dramatic reduction in the risk of causing regressions due to the inherit lightweight nature of the change.

## Entreprise Scenario

Here's the real reason Option B is the right path, and what it actually looks like to scale through the years

Option B is backwards and forwards compatible. Everything that makes this link what it is, is in it's appearance. _We've just move what drives the appearance to a CSS stylesheet_ where it belongs. Why is that a good thing?

Say the company we work for decides to acquire a competitor, and their codebase uses Angular with Bootstrap for their style system or something idk. We are now tasked with unifying the styles between both products.

The product we just purchased needs to undergo cosmetic surgery and inherit our branding. It's gotta be done fast. At this point, had we chosen Option A, the entire refactor would have been a wasted effort because we would of had to STILL have to go back and unify the styles. The recommended Tailwind CSS approach of "just copy paste the class names between your components" doesnt scale well. That's not going to work across multiple repositories being worked on by dozens of engineers. There's going to be so much lost in translation.

Let's make an assumption to help aid the decision process here: We have two CSS frameworks, shit is messy. The team has reached a community census that we will be using PostCSS moving forward in an attempt to bring sanity back to the organization. We'll also assume that testing every corner of the app is not feasible. Most large scale apps have dozens, if not hundreds of screens on different controls that will display different interfaces depending on privileges, and probably take minutes between local builds.

Here's how i might hit this refactor to unify things in as light a fashion as possible. First we'd use the mixin syntax in PostCSS create a reusable set of style rules.

```css
@mixin BtnBackToHome {
  display: inline-block; /* inline-block */
  border-width: 2px; /* border-2 */
  border-style: solid;
  border-color: #000; /* border-black */
  padding-left: 2rem; /* px-8 (8 * 0.25rem) */
  padding-right: 2rem;
  padding-top: 0.75rem; /* py-3 (3 * 0.25rem) */
  padding-bottom: 0.75rem;
  text-transform: uppercase; /* uppercase */
  letter-spacing: 0.05em; /* tracking-wider */
  font-weight: 900; /* font-black */
  color: inherit; /* keep current text color */
  background-color: transparent; /* default background */
  transition-property: color, background-color; /* transition-colors */
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: #000; /* hover:bg-black */
    color: #fff; /* hover:text-white */
  }
}

.btn-backToHome {
  @include BtnBackToHome;
}
```

The above code block is a little beefy in code-change, but has minimal risks for regression to our existing application. Now we can lock into the new product we've been tasked with unifying. Let's say they have a similar button that needs the same styles. They use BootStrap with Angular, plus a weird layer of jQuery from their startup days, so they advise against removing class names, instead we should be additive.

```diff
- <div class="text-center">
+ <div class="v2-Layout-BackToHome text-center">
	<a
		routerLink="/"
-		class="btn btn-primary fw-bold text-uppercase tracking-wide px-4 py-2"
+		class="v2-Btn-BackToHome btn btn-primary fw-bold text-uppercase tracking-wide px-4 py-2"
	>
		Back to Home
	</a>
	</div>
```

and then in a stylesheet, we'd use the order of specificity principle in CSS to target the button and make sure our styles take precedent over the existing Bootstrap code.

```css
.v2-Layout-BackToHome .v2-Btn-BackToHome {
  @include BtnBackToHome;
}
```

and now we are on-to the next component.

Hopefully i've made my argument clear as to why theres a right and wrong way to refactor code. See ya
