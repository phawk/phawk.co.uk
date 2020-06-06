---
layout: post
title: 'Production Rails apps'
tags: Ruby, Rails
category_id: devops
date: "2014-12-19T22:00:00.000Z"
---

This isn’t a **go-live** checklist, just a couple of things that aren’t too difficult to setup and will give you a bit more peace of mind when you deploy your app to the big bad world.

## Catching Errors

Knowing what errors are troubling your users is essential to building a quality product. Many services offer error tracking and reporting but often have restrictive limits or charge too much to be viable for a side project.

I use the [exception_notification](https://github.com/smartinez87/exception_notification) gem because it’s free, simple to setup and emails me every time an exception occurs in production. I really like this approach because emails bug me and I will fix the problems quicker.

```sh
# Add this to your Gemfile
gem 'exception_notification'

# Add this to the bottom of config/environments/production.rb
# (Don’t forget to update the details!)
config.middleware.use ExceptionNotification::Rack,
  :email => {
    :sender_address => %{"My App Exception" <hello@myapp.co>},
    :exception_recipients => %w{pete@myapp.co}
  }
```

## Friendly error pages

Customising the default Rails error pages is something I all too often forget. All you need is your apps logo and a friendly, sympathetic message. If you have setup [exception_notification](https://github.com/smartinez87/exception_notification) you can also mention that you have recorded the error and are working to fix it, and not be lying :)

Don’t forget to point nginx or heroku to your custom error pages if your app is offline or undergoing maintenance.

```text
# Sample nginx config with custom error pages
server {
  listen 80 default_server;
  root /var/www/myapp.co/current/public;

  # nginx conf for errors
  error_page 404 /404.html;
  error_page 500 /500.html;
  error_page 502 /500.html; # Displayed when you app is offline/unreachable

  passenger_enabled on;
  passenger_app_env production;
}
```

## SSL

No excuses for launching an app without SSL as [startssl.com](https://startssl.com/) provide free certificates. It can be a little intimidating if you haven’t setup SSL before but it’s worth learning how to setup. Use the **openssl** command line util available on OS X or linux to create your key and certificate signing request. Once you have a CSR you can paste that into startssl and they will provide you with a `.crt` certificate file.

```sh
# Generate a private key (yes keep it private!)
$ openssl genrsa -out pooreffort.com.key 2048

# Generate a signing request (to be pasted into StartSSL)
# Make sure the 'Common Name (e.g. server FQDN or YOUR name) []:'
# is the domain name i.e. www.pooreffort.com
$ openssl req -new -sha256 -key pooreffort.com.key -out pooreffort.com.csr
```

Don’t forget to test your SSL configuration with [SSLlabs](https://www.ssllabs.com/ssltest/analyze.html) to make sure you’re not vulnerable to common exploits/weaknesses. My goto nginx configuration for SSL sites is as follows:

```text
server {
  listen 80;
  listen 443 ssl spdy;
  server_name myapp.co;
  server_tokens off;
  root /var/www/myapp.co/current/public;

  add_header Strict-Transport-Security "max-age=31536000";

  ssl_certificate /etc/nginx/ssl/myapp.co.crt;
  ssl_certificate_key /etc/nginx/ssl/myapp.co.key;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_prefer_server_ciphers on;
  ssl_ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS;

  access_log  /var/www/myapp.co/log/nginx.access.log;
  error_log   /var/www/myapp.co/log/nginx.error.log;

  passenger_enabled on;
  passenger_app_env production;
}
```

Once you have the certificate from StartSSL (or whoever else) configured you want to make sure your Rails app redirects to SSL and sets [HSTS headers](http://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security). Add the following to `config/environments/production.rb`

```ruby
# Force redirects to SSL version and only
# provide cookies over a secure connection
config.force_ssl = true
```

## Data backups

You never want to lose data no matter how un-mission-critical your app is. When not running on [heroku](https://www.heroku.com) I use the wonderful [backup](https://github.com/meskyanichi/backup) gem to backup my databases and any other important data.

All of my source code is on a couple of machines + GitHub and all file uploads are usually stored on amazon S3, the only thing I normally need to backup is the database (this may differ on an app to app basis).

My basic backup configuration looks like:

```ruby
Model.new(:db1_backup, 'db1 backup') do

  database PostgreSQL do |db|
    db.name               = :all
    db.username           = "postgres"
    db.password           = "[hidden]"
    db.host               = "localhost"
    db.port               = 5432
  end

  compress_with Gzip

  store_with S3 do |s3|
    s3.path               = 'bkp'
    s3.max_retries        = 5
    s3.retry_waitsec      = 60
    s3.keep               = 15 # days
  end

  notify_by Mail do |mail|
    mail.on_success           = true
    mail.on_warning           = true
    mail.on_failure           = true

    mail.delivery_method      = :sendmail
    mail.from                 = 'enquiries@myapp.co'
    mail.to                   = 'pete@myapp.co'
  end

end
```

## Preventing attacks

Preventing some harmful attempts can be easier than you think. I’m not suggesting this is all you need to secure your app, but hopefully from the example below you can see how beneficial [rack-attack](https://github.com/kickstarter/rack-attack) can be.

```ruby
# Add to Gemfile
gem 'rack-attack'

# Add to config/application.rb
config.middleware.use Rack::Attack

# Create: config/initializers/rack_attack.rb
class Rack::Attack
  throttle("logins/ip", limit: 10, period: 20) do |req|
    if req.path == "/users/sign_in" && req.post?
      Rails.logger.error("Rack::Attack Too many login attempts from IP: #{req.ip}")
      req.ip
    end
  end

  throttle("logins/email", limit: 10, period: 20) do |req|
    email = req.params['user'].kind_of?(Hash) && req.params['user']['email'].presence
    if req.path == "/users/sign_in" && req.post?
      Rails.logger.error("Rack::Attack Too many login attempts for email: #{email} ip: #{req.ip}")
      email
    end
  end

  throttle('req/ip', limit: 1000, period: 60) do |req|
    Rails.logger.error("Rack::Attack IP over 1000reqs/min #{req.ip}")
    req.ip
  end
end
```
