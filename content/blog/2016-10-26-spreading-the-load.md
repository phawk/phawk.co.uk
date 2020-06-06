---
layout: post
title: 'Spreading the load'
tags: Misc
draft: true
date: "2016-10-26T22:00:00.000Z"
archived: true
---

Often times when building out applications we need to fetch feeds or data in bulk from other services.

I don't know about you but for me this often results in a scheduled task being run daily in the early hours of the morning, it grabs a bunch of data and starts processing it all there and then. Don't get me wrong, this can be a great place to start and depending on how much new data there is daily and how intensive the processing is you may never need anything more complex.

However, when there is a lot of new data coming in daily and processing isn't as simple this can put stress on your system. We queue up 150,000 background jobs at 2am and the job queue is flat out processing for a couple of hours. If a user uploads content to be processed during that time it's not going to be as responsive as it would be during the normal flow of the day.

### Apple solved this in iOS 10

After watching apples [what's new in Collection Views in iOS 10](https://developer.apple.com/videos/play/wwdc2016/219/) it got me thinking. Their main point was smoothing out the CPU load so rather than putting a lot of pressure on the CPU all at once they put lighter pressure on it for a longer time period.

![Smoothing out CPU load](/images/articles/spreading-the-load/apple-cpu-graph.png)

### How we can apply the same thinking to application architecture

Luckily our feed fetching service doesn't need to be realtime, users can wait 24 hours for new data, so long as there appears to be new data daily that's fresh enough for our needs.

My thinking is this: parse all the new feeds at 2am, and buffer them out to the application for processing over a 20 hour period, every 10 minutes. This keeps the application load consistent and those nasty spikes are gone.
