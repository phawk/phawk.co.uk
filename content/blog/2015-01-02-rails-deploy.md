---
layout: post
title: 'Rails Deploy'
tags: Ruby, Rails, Operations
category_id: devops
date: "2015-01-02T22:00:00.000Z"
---

[Rails deploy](https://github.com/phawk/rails-deploy) is an opinionated set of ansible scripts that take the pain out of setting up and deploying Ruby/Rails applications.

**The basic opinions are:**

- You use Ubuntu 14.04 (or similar debian based linux)
- nginx and [phusion passenger](https://www.phusionpassenger.com/) serve your application and static assets
- PostgreSQL for the database
- [rbenv](https://github.com/sstephenson/rbenv) for ruby version management and easily updating to new versions of ruby as they become available
- [dotenv-rails](https://rubygems.org/gems/dotenv-rails) is used to load environment variables
- You use [capistrano](http://capistranorb.com/) for deployment


### You can [find Rails deploy on Github](https://github.com/phawk/rails-deploy)

## What does it do?

Rails deploy will take a blank slate Ubuntu 14.04 server and set it up to the stage where you can `cap production deploy` your code and it is running.

**Some of the things it does:**

1. Creates a deploy user and sets up public-key authentication to your machine
2. Creates required folder structure for capistrano and sets up `.env` file with environment variables
3. Installs ruby with rbenv
4. Pre-installs any gems you might need (default: bundler)
5. Installs nginx + passenger all configured and ready to serve
6. Sets up PostgreSQL and creates a database + user for your app and links that with the `DATABASE_URL` environment variable

## Future plans

I’m going to continue using this for myself, it’s [open source](https://github.com/phawk/rails-deploy) if it’s useful for anyone else and I welcome any contributions.

- **SSL automation** - I currently handle domain routing and SSL termination in haproxy but I would like to add SSL support to this just to keep things more self contained and simple for others.
- **Memcached support** - Adding a memcached instance to the server that will work out of the box with [dalli](https://rubygems.org/gems/dalli)
- **Redis support** - Seems to be common enough in usage and would be handy to have on the box
- **MySQL support** - I don’t use MySQL but would like to have it in as an alternative to PG

That’s all for now, please leave any comments with suggestions or problems.
