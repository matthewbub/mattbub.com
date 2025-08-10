I recently rewrote my blog (again). Last version I was using Astro and TailwindCSS on Vercel which doesn't exactly demonstrate my experience or capabilities. It also didn't feel like the best position to be in as far as scaling goes either. I don't mean in terms of users or anything like that, just the little things; like wanting a database. I guess what I'm going to lean into is, I just don't want to use separate cloud providers for everything in my app.

- auth platform
- error logging
- analytics
- data management

I'm sure there's more i could be sold into if I really sit and think on it. These services are all like, $20 a month respectively, all for an app with 2 visitors per day on average. .. I don't think I need to call into The Ramsey Show to discover that's not good on my wallet.

With the above factors in mind, (and love in my heart) hosting on Vercel begins to feel like the lazy route for a developer of experience in basic web hosting. I don't think this was really like, news to anyone though. If i were to be less spicy, I'd simply say it's not the right option for me.

I'm able to do a-lot more with Docker and a little $6 shared server on a platform like Vultr or Digital Ocean. There's something about Docker that makes me feel like at-least 1.5 times as cool as I usually am, so that's an instant win.

At the time of this writing, I've got some simple analytics setup using server-side cookies in 5 min intervals. There's plenty of room for growth in this regard. For example, I'm not tracking the uniqueness between what is a robot and what is a user but the stats look good right now so I'm not really worried about it.

There's other things that I still want to do for this blog, but where it's at right now is definitely in a "good enough" state for me. I really liked the way that Astro serves and distributes markdown by default. So to recreate that behavior was definitely a huge thing to strive for. I like how when you're using Astro, you can have markdown files that have white space in the name. They support capitalization if you need proper title case. And there's also the front matter built in.

I find all of that to be really convenient in Astro and one of my favorite reasons to use it. So that was definitely a feature I wanted to port over to this site.

My first attempt was a hand rolled solution that crawled my markdown directory. I was using Go and just a markdown library specific to Go to convert these files from markdown to HTML with respect to the file names and converting them into valid URIs. And that solution was all right.

It generated a lot of HTML, which was instantly noisy. There's something about HTML in the languages section of a GitHub repository that is just ugly to look at. I don't want to see 90% HTML. So I decided to go with React and Vite and ended up using a handful of open source plugins specific to markdown that mimics what Astro is doing with respect to file names and conventions. I think it turned out really well.

I have a newspaper style theme, which I'm really digging at the moment. And a basic contact form that just submits to my database. There's no real mechanism to actually notify me when a new form has been submitted. That'll be a feature for a later date. But for now, this is an MVP that is already more capable than my last app. I can easily query the database from my remote server. And it's all good.

explain the backend

Then to expand on the back end a bit more, using Go, with the HTTP built-in library. It's been fine. I haven't had any issues with it. Nobody's attempted to DDoS me, but that's probably because I'm behind Cloudflare, which is also a nice thing to have. Cloudflare has the DDoS protection. Other niceties built in for free. The Go server is being ran on a Docker image, which I am hosting on an Ubuntu server on VOLTER for $6 a month on a little tiny shared server. With one CPU, one gigabyte of memory, and 25 gigabytes of storage. That's about the smallest I could get it without running into weird errors when I'm deploying on Docker. It, like, all the charts are peaking. It's almost at the point where it's going to stall out due to lack of space. So, I'm already pushing it, but when the application is running, it seems to be just fine. Yeah, I just SSH into the server. I have my .files that I can spin up within this environment and quickly get some nice things like NeoVim and Git if needed. Usually Git's already there, but sometimes you need to install it. Yeah, I am hosting the app on VOLTER like I already said. I have the firewall rules set up at the cloud level and at the host level, which I think is nice. I actually was working on this late at night and I implemented some bad firewall rules at one point and got locked out of my server. And it took me a few hours to realize that I was just, I had some bad firewall rules. So that was a good lesson learned. Yeah. I'm using Nginx to host the DNS records or to manage the site settings and then using CERTBOT to ensure HTTPS and proper encryptions. I'm also enforcing that via CloudFlare too, which is again, just nice to have. That's where it's at right now. Again, there's a lot of things I want to add in the future. I'm probably going to work on improving the analytics. I want to work on adding a logging system so I can figure out when the app is crashing. There's no tests right now. Not that there's really much to test, I guess. I could test the connections. Yeah. No ORM, just SQLite3.
