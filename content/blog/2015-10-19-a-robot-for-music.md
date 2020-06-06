---
layout: post
title: A robot for music
tags: node
date: "2015-10-19T22:00:00.000Z"
---

Having chat controlled music for the office is certainly [not a new idea](http://zachholman.com/screencast/play/), however I was a little disappointed when trying to set it up. [GitHubs play](https://github.com/play/play) hasn’t been used by the company or updated in years and has little hope of running on an up to date version of OS X.

We tried a different approach and decided to use [Spotify](https://www.spotify.com/uk/)  as this has a couple of advantages

- Nobody needs to load music onto the mac mini server
- Spotify has [documented their apple script API](https://developer.spotify.com/applescript-api/) so it will be a little easier to put together than using itunes

After a look around google I came across [hubot-spotify](https://github.com/davidvanleeuwen/hubot-spotify/blob/master/spotify.coffee) but had a couple of issues with it. We would have to host our Hubot on the mac mini spotify runs on but we already have it running happily on heroku. This library was still a great help in figuring out the applescript commands and when it came to writing our hubot adapter.

## Our approach

I decided to hack together a simple Node.js HTTP API that would listen for requests and call the corresponding applescripts when required, this would allow us to separate hubot from the mac mini and have a nice way to communicate back and forth and it could also be used for other integrations.

We have open sourced [spotify-mac-api](https://github.com/alternatelabs/spotify-mac-api) and it is available on npm, you can run it like so:

```sh
$ npm install -g spotify-mac-api
$ spotify-mac-api -p 3344 -s MySharedSecret
```

Once we had the API running we used [ngrok](https://ngrok.com/) to create a publicly available tunnel to the node app running on our private network, this takes care of DNS and gives us a subdomain like x2ru4ei.ngrok.io

```sh
$ ngrok http 3344
```

### Connecting up Hubot

We’ll hopefully package this up as a hubot npm module soon but for now while there are going to be frequent additions to the functionality we have written a [simple script](https://gist.github.com/phawk/cdf480f779dff0dcf0dc) you can place in `./hubot/scripts/spotify.coffee`. This will communicate with the API provided via the environment variable `HUBOT_SPOTIFY_MAC_API_URL`, don’t forget to tell it the shared secret in `HUBOT_SPOTIFY_MAC_API_SECRET`.
