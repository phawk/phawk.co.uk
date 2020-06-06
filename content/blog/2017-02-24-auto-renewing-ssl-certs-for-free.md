---
layout: post
title: 'Auto renewing SSL certs for free'
category_id: devops
tags: Server, SSL
date: "2017-02-24T22:00:00.000Z"
archived: true
---

I’m mainly writing this post for my own reference, I’m assuming most people have heard of letsencrypt.org and their free tool [certbot](https://certbot.eff.org/) for creating and automating SSL certification requests and renewals. I used to use [startssl](https://www.startssl.com/)’s free service but it was a lot of hassle.

I’ll explain the basic steps I use below, if you use a different server you’ll want to checkout the [certbot user guide](https://certbot.eff.org/docs/using.html#) yourself.

- [SSL certs with nginx](#installing-ssl-certs-on-your-own-server-running-nginx)
- [SSL certs on heroku](#using-certbot-with-heroku)

## Installing SSL certs on your own server running nginx

Make sure certbot is installed on your server, I normally place it in `/home/deploy/certbot-auto`

```sh
$ wget https://dl.eff.org/certbot-auto
$ chmod a+x certbot-auto
```

Setup an SSL cert for the first time

```sh
# If its a rails app or similar make sure to point web root to the public/ folder
$ /home/deploy/certbot-auto certonly --webroot -w /var/www/pooreffort.com/public -d pooreffort.com -d www.pooreffort.com
```

### Edit nginx config to use this SSL cert

Below is the nginx config for this blog

```nginx
server {
  listen 80;
  listen 443 ssl http2;
  server_name pooreffort.com;
  server_tokens off;
  root /var/www/pooreffort.com/public;

  if ($scheme = http) {
    return 301 https://$server_name$request_uri;
  }

  add_header Strict-Transport-Security "max-age=31536000";

  ssl_certificate /etc/letsencrypt/live/pooreffort.com/cert.pem;
  ssl_certificate_key /etc/letsencrypt/live/pooreffort.com/privkey.pem;
  ssl_prefer_server_ciphers on;
  ssl_protocols TLSv1.1 TLSv1.2;
  ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

  # OCSP stapling - means nginx will poll the CA for signed OCSP responses,
  # and send them to clients so clients don't make their own OCSP calls.
  # https://en.wikipedia.org/wiki/OCSP_stapling
  #
  # while the ssl_certificate above may omit the root cert if the CA is trusted,
  # ssl_trusted_certificate below must point to a chain of **all** certs
  # in the trust path - (your cert, intermediary certs, root cert)
  #
  # 8.8.8.8 and 8.8.4.4 below are Google's public IPv4 DNS servers.
  # nginx will use them to talk to the CA.
  ssl_stapling on;
  ssl_stapling_verify on;
  resolver 8.8.8.8 8.8.4.4 valid=86400;
  resolver_timeout 10;
  ssl_trusted_certificate /etc/letsencrypt/live/pooreffort.com/fullchain.pem;

  access_log  /var/www/pooreffort.com/log/nginx_access.log;
  error_log   /var/www/pooreffort.com/log/nginx_error.log;

  include global/static-asset-caching.conf;

  error_page 404 /404/;

  location / {
    expires 5m;
    add_header Cache-Control public;
    try_files $uri $uri/index.html $uri.html =404;
  }

  location =404 {
    internal;
  }
}
```

### Automating the renewal process

Once you have your certificate setup its very easy to autorenew, if your like me and host a bunch of different sites on the same server this makes it even handier! We just setup an entry in cron to handle it.

Open up crontab with `crontab -e` and add the following to your crontab:

```sh
# Auto update SSL certs
17 9,21 * * * /home/deploy/certbot-auto renew --quiet --no-self-upgrade  --post-hook "service nginx restart"
```

There is a method to the madness of the odd cron timing, certbot ask us to run this at a random minute of the hour, I think it’s to keep load on their servers random. They also recommend running it twice a day incase there are certificate revocations.

You can test the auto renewal process first and make sure it will work for your domains by doing a **dry run**:

```sh
/home/deploy/certbot-auto renew --no-self-upgrade --dry-run
```

## Using certbot with heroku

I like to host more important apps apps and client projects on [heroku](https://heroku.com/), now that they offer free SSL SNI endpoints you can have a custom domain and free SSL. It’s not quite as easy to automate as it is for your own server (if anyone has automated this more please drop me a comment, I would appreciate it a lot).

Install certbot on your local machine (I’m using a mac and homebrew)

```sh
$ brew install certbot

# Run the GUI to generate a new certificate
$ sudo certbot certonly --manual
```

Run the GUI to setup the certificate, you’ll be prompted to enter the domain name, then it will ouput some files you need to add to your webroot, i.e. `.well-know/acme-challenge/[big-random-string]`, you’ll also need to add `[big-random-string-two]` into this file.

If you’re using rails just add this file to your public folder `public/.well-known/acme-challenge/[big-random-string]`. If you’re using PHP or something served via nginx you can add an nginx directive:

```nginx
location ^~ /.well-known/acme-challenge/raJtRcOqY5BHHoWqFmOfZxxxxxxxxxxxxxxxxxxx {
    return 200 'raJtRcOqY5BHHoWqFmOfZxxxxxxxxxxxxxxxxxxx.PG8wgxxxxxx-4xSiGGP2XkQAxxxxxxxxxxxxxxx';
}
```

Once you have added the file to your web root or nginx directive deploy your app to heroku and then hit `Enter` on the certbot script for it to validate your challenge and issue a certificate. I’ve found you need to act reasonably quickly so the request doesn’t timeout, try and deploy within 5 minutes of issuing the cert request.

Once your certificate is validated and downloaded onto your own machine you’ll want to push it to heroku

```sh
$ sudo heroku certs:add /etc/letsencrypt/live/pooreffort.com/fullchain.pem /etc/letsencrypt/live/pooreffort.com/privkey.pem -a pooreffort
```

### Renewing heroku certs

For now there doesn’t seem to be a nice way of renewing the manual certs, you have to just run through the same steps again. It’s not too bad as letsencrypt will email you before your cert expires.

## Conclusion

I have previously recommended SSL across the board for all sites and now it’s not only a requirement but now a lot easier to work with thanks to certbot!
