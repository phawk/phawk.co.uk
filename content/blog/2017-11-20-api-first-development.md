---
layout: post
title: 'API first development'
tags: Ruby, APIs
category_id: clean_code
date: "2017-11-20T22:00:00.000Z"
---

APIs are core curriculum for any developer these days, whether it be building a JSON API to support interactive pieces of UI through AJAX, a native mobile application or consuming third party APIs. At [Alt Labs](http://alternatelabs.co) we mandate API first development and I’d like to convince you that it’s a good idea.

### Lower defect rates

We care deeply about the quality of our work from start to finish. From carrying out thorough and meaningful research right through all the stages of our design + build process to the shipped product we want to produce excellent work for our clients. Code is a core component of the work we output and we need to do our best to ensure high quality and stand proud over our work.

To that end, how does adding an extra integration point to every system increase quality?

A common software architectural pattern is to separate things which change often from things that stay the same and we should have clear boundaries between them. No matter the project, UI changes are way more common than business logic change requests, we should have a clear boundary there. We of course take this into account within our object oriented design and try to separate our core business objects from our web frameworks and databases (see: [clean archictecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html)) but we take the extra step to also be able to deploy business logic (API) changes and UI (frontend codebase) changes individually.

This enables designers and frontend developers to rely on rock solid APIs which encapsulate the core business decisions and to freely develop using the tools and frameworks best suited to developing fast paced UIs that are easy to maintain.

### APIs are easier to test

We practise TDD (Test driven development) at [Alt Labs](http://alternatelabs.co), with APIs we can easily write integration tests that exercise the API code end to end, this gives us a high level of confidence in our code and allow us to deploy many times per day.

Integration tests for APIs run much faster than their browser based counterparts and with the extra confidence in our code this really lets us iterate rapidly and enables continuous deployment.

### Open and extensible

If you’re developing for the web in a traditional way were your backend services render and deliver HTML to the browser and you come to require a native mobile application or even want to start shifting towards a PWA (progressive web app) you will have to develop an API. This leads to migrating your existing business logic across from your HTML based views into JSON and once an application is of a significant size this will be a considerable expense.

We prefer to be **open and extensible by default**. Need a mobile application? No problem, here’s the documentation, send it along to the mobile developer. Want to use a modern frontend framework like Vue.js? Go ahead!

### More up front design

This may be seen as a downside to the API-first approach. At the start of a project there is more setup time and up front planning required. This approach isn’t suitable for a 2 day hackathon, more thinking is required to consider what API endpoints should be built. However, once you get weeks or months into a project you start to gain back the early lost time by having clearer separation of concerns and a better documented system.

## In Conclusion

At our company we have had significantly less runtime errors reported in production since moving to our API first approach and we’re more confident than ever in our code because of our tests. Our frontend devs are also happy as they can be even more productive using the tools best suited to their job without having to worry about databases and backend systems.
