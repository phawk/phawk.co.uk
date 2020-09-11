---
title: 'Self hosting Rack based apps'
category: Ruby
date: "2013-11-09T22:00:00.000Z"
archived: true
---

I've been self hosting my own rack based applications (rails, sinatra etc) for some time, I want to show you my server setup and how to achieve decent performance out of your applications on a minimal budget.

Below is a high level diagram of the tools I am using, I'll go into a little more detail on each and how to set them up in this configuration.

![Server setup](/images/articles/self-hosting-rack-based-apps/server-diagram.png)

### Overall design

With this setup I have the highest performing servers closest to the the users incoming requests. I want to serve HTTP responses at layer 1 if at all possible, falling back to layer 2, and only 3 if necessary.

## 1. Varnish

[Varnish](https://www.varnish-cache.org/) is a high performance HTTP cache proxy, to get the most out of it you should really brush up on [caching](http://tomayko.com/writings/things-caches-do). Varnish is used to cache as much as we possibly can in memory. On my little 2GB [linode](http://linode.com/) box it can serve around 10,000 concurrent requests give or take, turns out this is around 34 million hits per day, much more than the yearly traffic I'll see from any of the sites on this box.

So you get the idea, varnish is fast, really really fast, we want as much sitting in varnish as possible. For starters, all of our applications assets, CSS, JS and images are something that is usually pretty safe to cache, especially with the cache digests from the asset pipeline. Here's a sample varnish config to get you started, I've left comments in to describe what each block of code is doing.

*Note: You'll want to set varnish up on port 80, so that all of your HTTP traffic goes there first.*

```tcl
# /etc/varnish/defaults.vcl

backend nginx {
    .host = "127.0.0.01";
    .port = "8088";
}

# Incoming request
# can return pass or lookup (or pipe, but not used often)
# This decides what should be looked up in the cache.
sub vcl_recv {

    # set default backend as nginx for all requests
    set req.backend = nginx;

    # Never cache POST, PUT, PATCH or DELETE
    if (req.request != "GET") {
        # pipe pushes these requests straight to nginx without doing any real work itself
        return(pipe);
    }

    # Tweak accepts encoding headers for compatibility
    if (req.http.Accept-Encoding) {
        if (req.url ~ "\.(jpg|png|gif|gz|tgz|bz2|tbz|mp3|ogg)$") {
            # No point in compressing these files
            remove req.http.Accept-Encoding;
        } elsif (req.http.Accept-Encoding ~ "gzip") {
            # Use gzip - prefered
            set req.http.Accept-Encoding = "gzip";
        } elsif (req.http.Accept-Encoding ~ "deflate" && req.http.user-agent !~ "MSIE") {
            # Use deflate
            set req.http.Accept-Encoding = "deflate";
        } else {
            # Fallback, unkown algorithm, remove the header
            remove req.http.Accept-Encoding;
        }
    }

    # lookup static assets in the cache
    if (req.url ~ "^/(stylesheets|images|javascripts|js|css|img|assets)" || req.url ~ "\.(png|gif|jpg|ico|txt|swf|css|js)$") {
        return(lookup);
    }

    # You could play it safe and only cache a certain site by
    # uncommenting this below
    # if (req.http.host ~ "^(www\.)?phawk\.co\.uk") {
    #     return(lookup);
    # }
    #
    # return(pass);


    # Or live life on the edge and allow your `vcl_fetch` to weed out
    # the responses you don't want to cache.
    return(lookup);
}


# called after recv and before fetch
# allows for special hashing before cache is accessed
sub vcl_hash {
}


# Before fetching from webserver
# returns pass or deliver
sub vcl_fetch {

    # Don't cache 404s 500s or anything else that is an error response
    if (beresp.status >= 400) {
        return(hit_for_pass);
    }

    # If a url matches an asset, cache it for a long time
    if (req.url ~ "^/(stylesheets|images|javascripts|assets)/" || req.url ~ "\.(png|gif|jpg|swf|css|js)$") {
        # Removing any cookies
        unset beresp.http.Set-Cookie;

        # Cache for 2 weeks in varnish
        set beresp.ttl = 2w;

        return(deliver);
    }

    # Web server set public cache
    if (beresp.http.Cache-Control ~ "public") {
        # You won't set Cache-Control: public for logged in user content,
        # if you want a better solution, look into edge side includes.
        unset beresp.http.Set-Cookie;

        # Playing it safe, don't allow browsers to cache page content,
        # so varnish can be flushed on deploys if needs be.
        unset beresp.http.Cache-Control;
        set beresp.http.Cache-Control = "no-cache";

        return(deliver);
    }

    # Don't cache by default to be safe, this means all your normal requests
    # won't cache unless you explicitly set cache control headers from your
    # web / application server
    return(hit_for_pass);
}

# called after fetch or lookup yields a hit, this allows you to browser the
# cache headers in your network tab to inspect what is getting cached
# or not, you might want to disable this in production environments.
sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT";
    } else {
        set resp.http.X-Cache = "MISS";
    }
}
```

This simple setup should get you going for public content and it honours your applications caching headers, if you want to cache a public page in rails for an hour, you can use the following in your controller action:

```ruby
class HomeController < ApplicationController
  def index
    expires_in 1.hour, public: true
  end
end
```

## 2. nginx

The next layer in the stack is [nginx](http://nginx.org/), a fast event driven web server. This is a lot slower than varnish, but still beats pushing traffic towards your application servers. Nginx should be used to serve any static files, this includes files to be downloaded from your application by your users (but for brevity we'll just focus on static files for now).

I use nginx to serve my rack apps public directory, adding cache headers for static files to keep them as long as possible in varnish and in the users web browser, this means the only requests going through to my application server are valid dynamic web requests.

Below is a sample nginx config that first looks for files in your applications public folder, if it cannot find a file that matches a request, it will forward the request onto your app server.

```text
# /etc/nginx/sites-available/myrackapp.com

upstream myrackapp {
  # Listen on a unix socket - could give ~5% performance boost over a port
  server unix:/var/www/myrackapp.com/tmp/sockets/unicorn.socket;
}

server {
  # Listen on whatever port we setup in /etc/varnish/defaults.vcl
  listen 8088;
  server_name myrackapp.com;
  server_tokens off; # don't show the version number, a security best practice
  root /var/www/myrackapp.com/public; # Your rack apps public folder

  access_log  /var/www/myrackapp.com/log/nginx.access.log;
  error_log   /var/www/myrackapp.com/log/nginx.error.log;

  location ~*  \.(jpg|jpeg|png|gif|ico|css|js)$ {
    # set cache headers for static files
    expires max;
    add_header Cache-Control public;
    access_log off;
  }

  # Redirect error pages to your rack application
  error_page 404 /404/;
  error_page 500 /500/;

  location / {
    # serve static files from defined root folder, falling back to the rack application
    try_files $uri $uri/index.html $uri.html @myrackapp;
  }

  # if a file, which is not found in the root folder is requested,
  # then the proxy pass the request to the upsteam app server
  location @myrackapp {
    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_redirect     off;

    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   Host              $http_host;
    proxy_set_header   X-Real-IP         $remote_addr;

    # Pass to the upstream unix socket defined at the top
    proxy_pass http://myrackapp;
  }

}
```

There is a lot more potential for nginx to help you out further, but this is a great place to start.

## 3. Unicorn App servers

This doesn't have to be [unicorn](http://unicorn.bogomips.org/), you could quite easily swap it out for [Puma](http://puma.io/), or even something like PHP-fpm if you don't use ruby.

### Foreman

For most rack servers, I use [Foreman](https://github.com/ddollar/foreman) to manage everything, this allows me to define multiple process types, like sidekiq workers alongside my unicorn web workers and easily manage environment variables. Foreman can also be exported to **upstart** to easily manage stopping, starting and restarting your app. We need to create a couple of files to setup our rack app:

### .env

Create this **.env** file in the root of your application, it manages environment variables when you launch your app.

*Note: Don't check this into version control, you want to make one **.env** file locally and one on your server.*

```text
PORT=5001
RACK_ENV=production
RAILS_ENV=production
```

### Procfile

This file manages your app bootup, how you run web workers, job workers etc, for now we'll just start with simple unicorn web worker.

```ruby
web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
```

### config/unicorn.rb

Your unicorn configuration, this will really depend on your app and your server, for now we'll start with 2 unicorn workers, and some sensible defaults. You'll want to strip out some parts of this if you're not using active record or ruby 2.0.

```ruby
worker_processes 2
timeout 15

APP_PATH = File.expand_path("#{File.dirname(__FILE__)}/..")
working_directory APP_PATH

# Listen on a unix socket instead of port
listen "#{APP_PATH}/tmp/sockets/unicorn.socket", backlog: 64

# Store unicorns master process ID so we can signal it
pid "#{APP_PATH}/tmp/pids/unicorn.pid"

# combine Ruby 2.0.0dev or REE with "preload_app true" for memory savings
# http://rubyenterpriseedition.com/faq.html#adapt_apps_for_cow
preload_app true
GC.respond_to?(:copy_on_write_friendly=) and
  GC.copy_on_write_friendly = true

# Enable this flag to have unicorn test client connections by writing the
# beginning of the HTTP headers before calling the application.  This
# prevents calling the application for connections that have disconnected
# while queued.  This is only guaranteed to detect clients on the same
# host unicorn runs on, and unlikely to detect disconnects even on a
# fast LAN.
check_client_connection false

before_fork do |server, worker|

  Signal.trap 'TERM' do
    puts 'Unicorn master intercepting TERM and sending myself QUIT instead'
    Process.kill 'QUIT', Process.pid
  end

  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|

  Signal.trap 'TERM' do
    puts 'Unicorn worker intercepting TERM and doing nothing. Wait for master to sent QUIT'
  end

  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.establish_connection
end
```

### Exporting foreman to upstart

You'll want to export foreman to upstart on your server so you can easily startup and shutdown your app.

```sh
# Export foreman
$ foreman export upstart /etc/init -a myrackapp -u USER_TO_RUN_APP -l /var/www/myrackapp.com/log/unicorn

# Start your app
$ sudo start myrackapp

# Stop your app
$ sudo stop myrackapp

# Restart your app
$ sudo restart myrackapp

# Run foreman on your dev machine
$ foreman start
```

## Conclusion

By now you should be setup with a reliable and reasonbly fast way of serving rack apps on your own server / VPS. If you have any extra tips, questions or anything else please leave a comment.
