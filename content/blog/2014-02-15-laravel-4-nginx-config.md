---
layout: post
title: 'Laravel 4 nginx config'
tags: PHP
category_id: devops
date: "2014-02-15T22:00:00.000Z"
---

I’ve seen a lot of complicated nginx setups for laravel and other major PHP frameworks.

Below is the setup I use and I think it is a more simplistic approach and easier to understand what’s going on.

### /etc/nginx/sites-available/phawk.co.uk

```text
server {
    # Force non-www version of the site
    listen       80;
    server_name  www.phawk.co.uk;
    return       301 http://phawk.co.uk$request_uri;
}

server {
    listen 80;
    server_name  phawk.co.uk;
    root /var/www/phawk.co.uk/public; # Laravels public folder

    access_log /var/www/phawk.co.uk/logs/nginx.access.log;
    error_log /var/www/phawk.co.uk/logs/nginx.error.log;

    autoindex on;
    index index.php;

    # Cache static files for a long time
    include global/static-asset-caching.conf;

    # Pull in some good PHP defaults
    include global/php-restrictions.conf;

    location / {

        # First try and load files from the public folder, if they don't exist
        # then send the request through to laravel
        try_files $uri $uri/ /index.php;

        # Forward requests on to PHP-FPM
        location = /index.php {
            include /etc/nginx/fastcgi_params;
            fastcgi_index index.php;
            fastcgi_intercept_errors on;
            fastcgi_split_path_info ^(.+\.php)(/.+)$;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_pass unix:/var/run/php5-fpm.sock;
        }
    }

    # If someone explicitly tries to load a PHP file return a 404 error,
    # always use url rewrites and never have the .php extension in the url
    location ~ \.php$ {
        return 404;
    }
}
```

Keep the next two files in the `global/` folder inside `/etc/nginx`, this means they can easily be shared amongst the rest of you apps.

### /etc/nginx/global/static-asset-caching.conf;

```text
# Any files matching these extensions are cached for a long time
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires max;
    add_header Cache-Control public;
    access_log off;
}
```

### /etc/nginx/global/php-restrictions.conf;

```text
# Don't throw any errors for missing favicons and don't display them in the logs
location = /favicon.ico {
    log_not_found off;
    access_log off;
}

# Don't log missing robots or show them in the nginx logs
location = /robots.txt {
    allow all;
    log_not_found off;
    access_log off;
}

# Deny all attempts to access hidden files such as .htaccess, .htpasswd, .DS_Store (Mac).
# Keep logging the requests to parse later (or to pass to firewall utilities such as fail2ban)
location ~ /\. {
    deny all;
}

# Deny access to any files with a .php extension in the uploads directory
# Works in sub-directory installs and also in multisite network
# Keep logging the requests to parse later (or to pass to firewall utilities such as fail2ban)
location ~* /(?:uploads|files)/.*\.php$ {
    deny all;
}
```
