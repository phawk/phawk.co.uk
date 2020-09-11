---
title: 'Turbolinks in middleman'
category: Middleman
date: "2013-09-14T22:00:00.000Z"
archived: true
---

Rails 4 now comes with [Turbolinks](http://github.com/rails/turbolinks) enabled by default, I think this is great and would love to see more sites make use of this technology if it&#8217;s feasable.

Turbolinks might not be so easy to setup or might not even make sense at all for sites that rely on a large amount of JavaScript interaction, especially if they are not making use of event delegation. However, this site has been running off static content for a long time now, first [jekyll](/blog/jekyll/) and now [middleman](http://middlemanapp.com/), it&#8217;s a perfect candidate for turbolinks as there is no complex JavaScript running. This will save the browser fetching and parsing both the CSS and the web fonts for each internal link the user clicks, leaving everything nice and snappy.

## Setup

Hooking this up if your using middleman couldn&#8217;t be any easier, as middleman has sprokets built in.

### Require the turbolinks gem

Add the following line to your Gemfile and then run `bundle` to install it

```ruby
gem "turbolinks", require: false
```

### Create and load your JavaScript file

If you already have a JavaScript file created and pulled in with `javascript_include_tag` you can skip this step.

Create an **source/javascripts/application.js** file and then add the following into the `<head>` section of your **layouts/layout.erb**

```ruby
<%= javascript_include_tag "application" %>
```

### Pull in the turbolinks JS

Now that you have your JS file being successfully loaded you can require turbolinks, add the following line to the top of your **application.js** file:

```js
//= require turbolinks
```

## That&#8217;s it!

You&#8217;re now running a static site with turbolinks. I&#8217;ve found this improves the perceived speed of my site a lot, hopefully it can do the same for you. If you have any questions please leave them below.
