---
layout: post
title: 'Vanilla Rails'
tags: Rails, Ruby
category_id: clean_code
date: "2017-10-08T22:00:00.000Z"
archived: true
---


Vanilla Rails is something we have arrived at after several years of growing and maintaining Rails applications at [Alt Labs](http://alternatelabs.co).

*Update 9th October 16:24GMT*: Due to [some misunderstandings on /r/ruby](https://www.reddit.com/r/ruby/comments/758rdu/vanilla_rails/) I have updated some copy to make it extra clear that I am taking about unneeded, trivial dependencies and certainly not advocating that you reinvent complex or time consuming pieces of functionality just to have a few less lines in your Gemfile.

I switched to Ruby from PHP back in 2012 and followed the same path many do when they first come to Ruby, adding gem after gem to build out trivial pieces on functionality. Rubygems is truly amazing, the amount of high quality, well tested libraries available is astounding! This does unfortunately lead to an over-reliance on third party dependencies if you don’t carefully consider the need for each one.

I started out learning rails using the built-in `form_for` for forms, then found out I could write slightly less HTML if I used `simple_form`, learnt how to write my own authentication and then moved to `devise` because it was faster to setup (I now use [Clearance](http://pooreffort.com/blog/clearance-vs-devise/) due to its simplicity).

I have used `acts_as_shopping_cart` in the past and been fraught with issues when upgrading Rails, all of this to save me generating my own ShoppingCart controller and a couple of routes, which would have taken me all of 30minutes. And I know I’m just being lazy when I add a gem like `koala` to make a single HTTP request and fetch the latest facebook post 😄.

And lastly when I need to have pretty URLs I don’t even think about the code I need to write, I think about installing `friendly_id` (p.s. I ❤️ this gem and I’ll continue using it)!

All of the above is commonplace for Rails applications and can lead to serious problems for successful apps as they need to grow.

## What is Vanilla Rails?

Choosing vanilla Rails isn’t an absolute, it’s a methodology focussed on minimal dependencies and boils down to this: **Only add a gem to your Gemfile if it’s absolutely necessary**.

Rails is a huge framework and provides us with 90% of the tools we need to build any project.

Vanilla Rails has no hard-fast rules, however I personally try to have no more than 25-30 gems in the Gemfile.

I still rely on several gems in almost all projects, I feel these are must haves:

- **rspec-rails** - I test drive all of my Ruby code and prefer the complete solution that RSpec provides with its comprehensive expectations and mocks.
- **http** - Net::HTTP is just too verbose for my liking and seeing as I use HTTP to directly talk to other 3rd parties and save me using other gems I think it’s worth it.
- **active_model_serializers** - Nearly all of our apps are API first or have a JSON based API and I like the AMS way of working.

As with all approaches there are trade-offs, but if I could offer up wisdom to anyone starting out in the Ruby/Rails ecosystem keeping dependencies to a minimum would be it.

### Advantages

1. **Performance** (Speed) - Speed isn’t everything, I mean we’re using Ruby rather than writing C, but who doesn’t want faster app startup in development, faster tests and quicker page loads?
2. **Performance** (Hosting/Scaling) - Memory bloat is one of the biggest problems I see when scaling Rails apps and there is a direct correlation between an applications memory usage and the number of gems in the Gemfile.
3. **Maintainance** - It’s much easier to look after your Rails applications when you have minimal dependencies, upgrading to each new Rails version is a breeze and staying up to date means being able to take advantage of the latest features.
4. **Onboarding** - When new team members start they can get familiar with your business logic rather than the slew of gems your using.
5. **Knowledge** - You have a deeper understanding of how your application works and it’s easy to reason about, you don’t have to go off digging into a gems source code to see how your application behaves.
6. **Extensibility** - If you hand roll your own authentication it’s much easier to extend it with new features whilst using third party gems can make this tricky.

### Disadvantages

1. **Productivity** - You definitely take a hit when writing functionality yourself or relying on Rails built in tools, compared to specialised gems that extend Rails with exactly what you need. It can take slightly longer to use `form_for` rather than `simple_form` for instance.
2. **Reinvent the wheel** - It can feel like you’re wasting your time writing a little extra code, reimplementing a feature, but quite often you won’t need all of the functionality a gem provides and you can implement the logic yourself in an hour or two, if it’s a crucial gem providing non-trivial functionality I’m not suggesting you implement that yourself!

## Conclusion

I strongly believe the benefits of a Vanilla Rails approach outweigh the drawbacks in terms of early on productivity and the little extra code you have to write. I’d advise all Rails developers to seriously question a gem before adding it to their project and I think we’d all be better off in the Ruby community with fewer dependencies.

I have seen this approach pay dividends on the Rails applications myself and the Alt Labs team contribute to on a daily basis.

Stay tuned for my next post where I talk about how I’m never using active admin ever again! It’s tangibly similar.
