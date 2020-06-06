---
layout: post
title: Way Less CSS
tags: Web Apps
category_id: clean_code
date: "2013-02-09T22:00:00.000Z"
---

With the redesign of my blog a few months back I decided I was going to try out this mobile first thing everyone was harping on about.

## Problems with mobile last

I have built a few responsive sites in the past and always started out with the large (desktop) version first, adding in media queries to scale the site down for smaller devices. I wouldn't say I was unhappy with this approach, it was easy-ish to design for, but did always leave a large amount of code written in the media queries. A lot of styling that was previously set above was then overridden and unset for mobile devices.

Another thing that concerned me was content, designing with content based on a large devices would tend to look like too much information once it got to the small screen, just squash it all down so long as it's readable.

Building things in afterwards is always a nightmare, just try writing unit tests after you have written your code.

## Mobile first to the rescue

Setting your mobile styling first and then using media queries to scale up your design rather than down seemed to result in a lot less CSS. I was shocked, even with the little amount of CSS required for this minimal design, you can [see it on GitHub](https://github.com/phawk/phawk.github.com/blob/master/css/styles.scss). I would be a firm believer that the best way to have more maintainable code and less bugs is to have less code in the first place, so I am very happy when I have to write less to get the same job done.

The other benefit of a mobile first approach is that the code just works, you can't ever forget to do the mobile version, because it is mobile by default. I'd also imagine that re-paint times on mobile can be a lot more performant as there is a lot less styling to calculate.

### Any Downsides?

The one negative point I found was mobile first is harder to design for. This could be down to it being the first time I have used this approach though, or also down to the fact that I barely design things anymore, but I would still use this approach for every new project in the future.
