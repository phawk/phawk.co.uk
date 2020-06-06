---
layout: post
title: 'Tiny testing'
tags: Ruby, Testing
category_id: testing
date: "2014-09-23T22:00:00.000Z"
---

I recently started getting a lot of spam enquiries through my [portfolio site](http://phawk.co.uk). This began to annoy me after several days of junk emails and I planned to do something about it.

I decided to implement wordpress’ [askimet](http://akismet.com/) to filter the enquiries before they are sent off to my inbox. Usually (with tiny personal projects) this implementation would be hacked together, deployed and manually tested. This time round I took a different approach and decided to write automated tests.

## Solving the problem using tests

I setup **cucumber** to [integration test enquiries](https://github.com/phawk/phawk.co.uk/tree/8a0eac81d944e02cc6b3dd26ff2f47d81b474604/features/enquiries.feature). This was my first time using cucumber, I normally write my integration tests in MiniTest but I will definitely give cucumber a go in a few other projects as I really like the separation from the normal unit style specs and it was also pretty painless to configure.

I then turned to **MiniTest::Spec** to drive the design of an [Enquiry](https://github.com/phawk/phawk.co.uk/tree/8a0eac81d944e02cc6b3dd26ff2f47d81b474604/lib/enquiry.rb) object and introduced the [Rakismet gem](http://rubygems.org/gems/rakismet) to handle actually talking with the akismet API.

Once I had completed this feature I setup codeship to run whenever code is pushed to GitHub, this provides exposure if something does break. I like to use a git pre-push/pre-commit hook to run tests, but since they don’t get committed to your repo you can’t rely on them always being there.

Overall this probably took more than 10x the amount of time it would take to manually test this feature, however, it was a lot less boring and I got to play with some new tools (cucumber and Rakismet).

## Future thoughts

From this scenario I have learnt that automated testing isn’t reserved for large or important apps, it can be used effectively on trivial applications every day to provide confidence in code and enable joyous refactoring.

Since starting to write this post I have also added to the [cucumber features](https://github.com/phawk/phawk.co.uk/tree/8a0eac81d944e02cc6b3dd26ff2f47d81b474604/features/blog_redirect.feature) to make sure other functionality is working.

The source code for my portfolio is [available on GitHub](https://github.com/phawk/phawk.co.uk) if you’re interested in exploring further.
