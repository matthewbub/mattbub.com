---
title: "Logging Aspirations"
description: "Exploring the evolution of my custom logging system and its potential as a standalone service or SaaS offering."
pubDate: "August 22 2024"
---

So yeah, I've pretty much been logging stuff for a while now. Over the years my implementation of loggers have advanced in both complexity and capability. It seems like for each project I start, I'm creating a new logger based on similar patterns.

Really I think I just like to continue to build and improve upon things that I've created myself, based on my own experiences because it's what I like to do. That's also what the Chroniconl itself has always been about. I've rolled through so much tech just to say I did it, the messages in the commit history of the Chroniconl repo are littered with 'migrate'.

But the logger I'm building is actually getting pretty cool. It might just be the colors in the dashboard that are flashing before me right now but I'm at a point that I think I want to seek feedback from others to see if this idea is worth pursuing as a SaaS; or at-least isolating as a standalone service.

## How it all started

I think I started the iteration of the logger we see today because I was tired of throwing in `console.log` statements all over my Next.js application, trying to chase down errors. My approach for this project has been to slap code at the wall until I've got something that resembles a feature, and just roll with it from there. (You can see why I am chasing errors.)

Anyway I don't leave `console.log` statements in production and I am unaware of the ability to `ssh` into my Vercel deployment and extract a log file, so I opted to throw them into Supabase. At the same time, I had a few CRON jobs running in a Golang environment, so I figured I throw the logs from my little black box of a CRON job system into the same table.

## AI generated schema

I created a logger ChatGPT assisted schema and figured I could iterate over some of these fields that really don't make sense. Here's the TypeScript type definition for the logger in it's current state. I still haven't deprecated any fields here, although there are a handful that I don't use.

```js
application_name: string | null;
correlation_id: string | null;
cpu_usage: number | null;
custom_field_1: string | null;
custom_field_2: string | null;
environment: string | null;
error_code: string | null;
exception_type: string | null;
execution_time: number | null;
hostname: string | null;
http_method: string | null;
id: number;
ip_address: string | null;
log_level: string | null;
logger_name: string | null;
memory_usage: number | null;
message: string;
nextUrl: string | null;
request_cookies: string | null;
request_geo: string | null;
request_headers: JSON | null;
request_id: string | null;
response_time: number | null;
service_name: string | null;
session_id: string | null;
stack_trace: string | null;
thread_id: string | null;
timestamp: string;
url: string | null;
user_id: string | null;
```

I'll just call out potential where I see it. I think a nice-to-have here, would be the ability to pre-configure the logger and tables via IDE or CLI.

Now that I'm looking at that type definition in isolation, I'm realizing that the project isn't utilizing the available fields correctly. F\*\*k, see this is why I iterate.

## Justification of resources

To be honest in my head, the whole time I was fighting the need to say "this isn't a justifiable use of resources", but I've been truly pleased with the outcome so far. So much to the point that i've now made several iterations over the logger itself, requiring a massive overhaul of the code base each time.

I'm the most satisfied with the latest iteration of a particular class function in my Next.js application. In addition, I've begun to build a set of patterns, that I've found make querying the logging system really easy.

The explicit benefits I've seen so far from this logger, over `console.log` statements include

- **Viewing development errors** from an intuitive dashboard that makes tracing the error back to it's origin fool-proof. It almost feels like a "magic box" for error management.
- **Viewing production errors** if (1.) a user reports a bug in the application, and (2.) the error just so-happens to be coming from the server, I'll have the immediate ability to collect the exact error's call stack.
- **Comparing performance metrics** as I iterate through different variations of business logic. You probably haven't seen it, but the chroniconl repo's `/api` directory has gone through 4 versions so far. (v0, v0.1, v0.2, v1) and to make all of that a bit more funny, I'm currently headed into a final version (v2) where I plan to reduce the need for so many routes. It will be interesting to compare metrics before / after the migration.

As the application grows in size, I suspect that memory management will become an issue but I have plans for mitigating that. I'm hopeful I'll have the solution ironed out long before that begins to become a problem. I figure if the as the size of the table grows, I can create a system to roll the data and export it somewhere else. Like a "Wipe logs after 30 days" type of feature.

## Ability to track user session data

If you're wondering how I trace the error back to the user, it's really simple. The logger has a few methods to hook the user and their session to the error itself. I have this type of logic implemented in every authenticated route

```
// hook the user into the logger
logger.setUserId(userData?.id)
logger.setSessionId(userData?.session_id)

// the user `id` and `session_id` will be logged with this error
logger.logError({
  message: "Whoops"
})
```

Why do that? I come from the land of cyber security, and I've also read books like "This Is How They Tell Me the World Ends: The Cyber weapons Arms Race" by Nicole Perlroth (which I would highly recommend) and am actively reading Ghost In The Wires by Kevin Mitnick and William L. Simon

The general philosophy for this app has been "lock it down". Matter fact, it's like a paranoid drug lords house inside the logger. There's cameras set up all over this shit. There shall be no tomfoolery here.

## Established conventions

I [wrote a user-guide to using the logging system](https://github.com/chroniconl/cms/blob/main/docs/Logger-Nextjs-AppRouter-Tutorial.md) within the context of the Chroniconl application. It gives a birds-eye view into the patterns I'm referring too. That guide is particular beneficial to a contributor working within the Chroniconl repository, they could implement logging at the business logic level really easily. If they have a auto-complete AI, conventions would likely auto-complete based on similarities throughout the code base.

Here's a snippet from that guide, and from our code base

```
import { failResponse, okResponse } from '@/utils/response'
import { supabase } from '@/utils/supabase'
import Logger from '@/utils/logger'

export async function GET() {
  // 1. Start tracking time immediately
  const start = performance.now()

  const logger = new Logger({
    name: 'api.v0.categories.GET',
  })

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, color')

  if (error) {
    // Assigns the [DATABASE_ERROR] code and additional error properties
    void logger.logDatabaseError(error)

    return failResponse(error?.message)
  }

  // 2. Capture the time it took to complete the task
  const end = performance.now()

  // 3. Log the time to the `execution_time` field
  void logger.logPerformance({
    execution_time: Math.round(end - start),
  })
  return okResponse(data)
}
```

I plan to use these patterns to continue to build and iterate upon the language agnostic logging system. It's currently needed and in-use for Node.js (ES5), Vercel Edge Function, Golang, and Python projects. I'm working on it, and will get there!

## The dashboard isn't there yet

Right now I actually still use raw SQL statements to query the Supabase database, which is an open source wrapper on top of PostgreSQL. The UI of this feature is still in the throwing shit all the wall phase but it seems promising.

The project is also in a migratory stage (its never _not_ in a migratory stage, thanks javascript). Where I plan to move to my own self-hosted instance of PostgreSQL with the Drizzle ORM as the primary ORM. If I were to pursue this as an isolated service, I imagine I'd need to take additional things into consideration such as a custom querying system, which sounds like fun!

For example, when it comes to logging, I imagine folks are running some seriously complex queries so I'd probably need to find a way to make said complex queries safe. Like, the JQL syntax from Jira, or the much more intuitive Slack search syntax would probably be a better example to reference and aspire to be like. Very cool.

## Where's the potential

If I were to pursue this as a SaaS, I would be striving to provide the best tooling possible to work with these logs and interact with them. I imagine the end user being able to define their own log schema, integrate that schema into an API, and SDK and then be able to interact with the logs freely and creatively.

Really the only selling point I can imagine here, would be to follow a path like Supabase where the APIs, SDKs and Dashboard are open source and can be self-hosted, but you can choose to host with Chroniconl if you'd like. There would be logic in place to charge if your data surpasses a pre-defined limit. It would have to be a high limit though, like Supabase, their super generous with the free plan.

I could also easily build those tools to roll your logs, so really there would never be a reason you'd have to pay unless you're app is just a total resource hog or you want the data retention beyond X days. Maybe billing for teams in the cloud version is a path worth pursuing as well. Really I'm just throwing ideas into the wind.

## Final thoughts

I'm going to chalk this up as an nothing more than an idea for now, but really I think there may be potential in this area of the application.
