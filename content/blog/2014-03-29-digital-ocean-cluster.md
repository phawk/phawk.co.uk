---
layout: post
title: 'Digital ocean cluster from $15/mo'
tags: Operations
category_id: devops
date: "2014-03-29T22:00:00.000Z"
---

With digital ocean you can get a VPS for $5 / month so why not get a few small VPS’s and start to separate out your server architecture to help with basic horizontal scalability.

My server stack now has 3 tiers, I’ll be playing with alternatives in the load balancer / cache areas over time, but for now I’ve simply gone with Varnish for both tasks.

![Server stack](/images/articles/digital-ocean-cluster/cluster.png)

### 1. Load balancer

This is where you point all your DNS records and send all traffic. This server is responsible for routing all of your traffic to an available web server, or simply serving the requests up from the cache if possible.

[HAProxy](http://haproxy.1wt.eu/) or [nginx](http://nginx.org/) would also have been great options for this tier and I’ll be considering bringing one of those in here for greater health checking of the app servers, but for now I really wanted a shared caching layer sitting before the application servers.

### 2. Application servers

You can scale this tier by continuing to add more servers. There are a couple of things you need to cater for here:

* Ensure your cookies / sessions will work across multiple machines, use a shared DB session, cookie or shared memcache box to handle sessions.
* Don’t write files to the file system, use amazon s3 or google cloud storage etc.
* Use capistrano or another tool to help you automate deployments to both boxes at the same time.

Start off with a single app server and add more as you need to scale up, if you cover the cases above you shouldn’t have any problems adding more servers into the mix.

### 3. Database server

Put your database on its own server for now, this will help you to tune it independently of other applications and give it more resources. You can also easily vertically scale this one server before you need to start thinking about sharding or have mutliple read/write databases.
