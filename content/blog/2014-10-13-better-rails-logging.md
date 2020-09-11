---
title: 'Better Rails logging'
category: Rails
date: "2014-10-13T22:00:00.000Z"
archived: true
---

When insignificant messages are clogging up your application logs it can be very difficult and time consuming to debug errors happening in production.

Luckily, Rails logging is highly configurable and with a few tweaks you can pinpoint exceptions much faster.

## 12 factor logs

If you haven’t read the [12 factor app](http://12factor.net/logs) do so post-haste! TL;DR *your app should log to STDOUT and not concern itself with anything else such as logging to disk or log rotation*.

I’m going to show you how to get rails to log to STDOUT along with a few tricks to keep your logs tidy.

## Logging to STDOUT

First step, place the following in **config/application.rb**

```ruby
# config/application.rb

module MyRailsApp
  class Application < Rails::Application

    # ...

    unless Rails.env.test?
      log_level = String(ENV['LOG_LEVEL'] || "info").upcase
      config.logger = Logger.new(STDOUT)
      config.logger.level = Logger.const_get(log_level)
      config.log_level = log_level
      config.lograge.enabled = true # see lograge section below...
    end
  end
end
```

You will notice I default the log level to **info** as I want that to be the default behaviour and I see adding a LOG_LEVEL=debug environment variable the easiest option in development. I also want to be able to change my log levels on production or staging easily without having to re-deploy my code.

## Quiet assets

During development asset requests are logged and in my opinion, get in the way of important information. Add the [quiet_assets](http://rubygems.org/gems/quiet_assets) gem to your development group in your gemfile to turn this off.

```ruby
# Gemfile
group :development do
  gem 'quiet_assets'
end
```

## Lograge

[Lograge](http://rubygems.org/gems/lograge) changes the default format of rails request logs and shortens them onto a single line. You might only want this in production, I personally like this output for development too. You will need to add `gem 'lograge'` to your Gemfile.

## Rails.logger

Always use `Rails.logger.{info|debug|error}` rather than `puts`. This allows your logs to fit into the standard log format, have a timestamp and have a level so you choose whether they are important enough to be shown in a specific environment.

```ruby
# Don’t use puts
puts "My puts log"

# Choose a level and use the standard rails logger interface
Rails.logger.info "My info log"
Rails.logger.debug "My debug log"
```

![Log methods comparison](/images/articles/better-rails-logging/compared.png)

## Unicorn

Unicorn comes with built in rack middleware that logs each request, since Rails already covers this we don’t want unicorns output, you can specify the flag `--no-default-middleware` when starting unicorn to disable this. I use foreman to run my apps and my Procfile for the web process looks like:

```sh
web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb --no-default-middleware
```

## Foreman export

I use [foreman export](http://ddollar.github.io/foreman/#EXPORTING) when deploying to export my processes to upstart. This manages logs and will write them to `/var/log/upstart/*.log` and automatically rotate and gzip them using logrotate.

