---
layout: post
title: Clearance vs. Devise
tags: Rails
category_id: clean_code
date: "2015-09-04T22:00:00.000Z"
---

Thoughtbots [clearance](https://github.com/thoughtbot/clearance) gem is an alternative to the more popular [Devise](https://github.com/plataformatec/devise) gem that allows you to easily add authentication to a Rails app.

I’ve been a long time user of Devise and from what I have seen in the ruby community it’s popularly is vast. Starting most new rails apps it’s been one of the first gems added to my projects.

I recently looked at clearance and admired the simplicity of it, coming from devise I knew it was a lot more feature rich but the reality is I struggle to think of a project that has required me to use more functionality than clearance provides so I decided to try clearance on my next rails app.

## How it worked out

### Less configuration

Clearance took even less time to setup than devise, I find this is because it aligns more closely with the Rails mantra ‘convention over configuration’.

### Less complexity

I was able to read through clearances source code quickly and understood everything. Having tried to read through the devise source code before and struggling a bit to piece together all of the abstractions this was a welcome surprise.

### Active job integration

Clearance automatically integrates with active job to send emails in the background, something that you have to add an extra gem for in devise.

## Wrapping up

I’m sure there are plenty of projects out there that need the additional features of devise but there are even more that don’t and sticking with a simpler less complex tool can’t be a bad choice. I’m going to stick with clearance on most projects going forward.
