---
layout: post
title: Manage cron jobs with whenever and capistrano
tags: Rails, Server
category_id: devops
date: "2015-11-06T22:00:00.000Z"
archived: true
---

Keeping track of your apps scheduled tasks is usually a bit of a pain. It can be handled outside of your normal code processes such as github and missed in your code reviews.

However if you happen to be self hosting a rails application and using capistrano for deployments there is a handy gem to help you out, it’s called [whenever](https://rubygems.org/gems/whenever).

Whenever provides a DSL for configuring cron jobs and integrates nicely with capistrano. A simple schedule to run a rake task every hour looks like this:

```ruby
# config/schedule.rb
every 1.hour do
  rake "articles:fetch_comments_count"
end
```

To see how this translates into cron run `bundle exec whenever`, this just outputs the text it would insert into cron. If you want to export the schedule to cron you can run:

```sh
$ bundle exec whenever --update-crontab -i myapp_identifier
```

## Capistrano 3 integration

If you’re using capistrano you don’t even need to run `whenever --update-crontab` on your server, why not have capistrano do it for you...

```rb
# Require this in your Capfile
require 'whenever/capistrano'

# Set the whenever identifier in your config/deploy.rb
set :whenever_identifier, ->{ "myapp_#{fetch(:stage)}" }
```

That’s it, simple! Capistrano will now keep track of your schedule and update your cron tab with each deploy. You’ll also have your applications scheduled tasks in your source code repository and they can be code reviewed along with your other changes.

## What about heroku?

For heroku applications I try to keep a list of rake tasks in the readme file and remember to add them into the heroku scheduler when deploying. I’m on the lookout for a better way to handle this, if you have any ideas please post them in the comments!
