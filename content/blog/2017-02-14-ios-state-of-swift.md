---
title: 'The State of Swift'
category: Swift
date: "2017-02-14T22:00:00.000Z"
archived: true
---


*Let’s start with a little context...* I’ve been doing quite a lot of iOS development over the last couple of years, nearly all of my native app experience on the platform is using Apples new language, [Swift](https://swift.org/).

I can’t give a fair comparison of objective-c to Swift, but if you like podcasts you should give [Under the Radar #66](https://www.relay.fm/radar/66) a listen, David and Marco discuss their experiences migrating to Swift from an experienced objective-c background. Instead I’m going to compare with the language/ecosystem that I’m most familiar with: [Ruby](https://www.ruby-lang.org/).

## Easy to learn

I found Swift very easy to learn the basics in, being very comfortable with JavaScript and having built large scale apps in [Backbone](http://backbonejs.org/), [Angular](https://angularjs.org/) and more recently [Vue](https://vuejs.org/) has helped to grasp Swift very quickly!

The only thing I struggled with a little bit was optionals. An optional represents a value that can be nil, the concept is great and really does help you to write idiomatic code, I was just a little unaware of the best practises of using them and where best to unwrap optionals. There is a good read on optionals in this [5 part email guide](http://roadfiresoftware.com/free-swift-course/).

An entirely new experience for me was the compiler, Swifts in particular is fantastic, it doesn’t just alert you to issues, often it fixes your code for you. A large part of the language design was based on being easy to learn and having language features that if it compiles it’s probably likely to work.

## Things are changing, fast

Arguably I started using Swift before it was *ready*, Swift 2.0 was definitely production ready to write an app and ship it to the app store, but when Swift 2.2, 2.3 and 3.0 came around the corner, the experience was daunting.

That brings me onto my next subject...

## Package management

I’m a Ruby developer most of the time, it’s my favourite language and where I’m most productive, if you took [Ruby gems](https://rubygems.org/) away from me I’m sure that productivity would take a hit.

A hard lesson to learn on iOS was to keep dependencies to a bare minimum, this is for several reasons:

- It took a long time for all of the cocoapods I relied on to upgrade to the latest version of Swift when it was released
- Swift *didn’t* (and might still not) have an awful lot of open source packages, in comparison to Ruby
- Not having many packages made me select some that I never should have because they had only a single contributor

The pain in upgrading to Swift 3.0 led me to strip back on dependencies and reinvent the wheel a considerable bit more on iOS that in Ruby. I had to strip out some dependencies and build that functionality into the apps in order to upgrade to Swift 3.0.

I have learnt this lesson in the earlier days of rails when you see an app with 50+ gems in the gemfile, although this is a much more extreme problem in Swift. I’m also bringing this back to our Ruby projects and trying to keep things as lean as possible, we’ve even considered imposing a arbitrary gem limit on apps that we have to stick to.

## What are you waiting for?

In my experience Swift is production ready as of version 3.0, hopefully the migration from 3.0 to 4.0 won’t be as gruesome as 2.2 -> 3.0.

I really like the language, the compiler is great and there are very interesting things you can do, particularly with enums and generics.

I’ll try to post more on Swift soon! If you have any experience with Swift or concerns in moving to it please leave a comment, I’d love to hear from you.
