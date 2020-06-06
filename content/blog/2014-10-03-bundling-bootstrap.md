---
layout: post
title: 'Bundling bootstrap'
tags: Ruby, Rails
date: "2014-10-03T22:00:00.000Z"
archived: true
---

I am growing tired of seeing css or javascript frameworks and libraries being installed with bundler.

When working on a rails app I want to keep the list of dependencies to a minimum. By adding static assets to your Gemfile you are adding more to the load path, incurring a boot up time penalty and making bundler install slower.

### My approach

I use rails’ `vendor/` directory to store all third party frontend assets and simply require them through sprockets in my application.css and application.js files.

My Gemfile is kept for Ruby dependencies and by reading through it I can see the external boundaries of the system.

I want to experiment further with [cdnjs](https://cdnjs.com) and local fallbacks, but for now no frontend assets are clogging up my Gemfile! Please leave any comments with how you handle third party assets in your rails apps.
