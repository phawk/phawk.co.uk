---
layout: post
title: 'Lean JavaScript templates in Rails'
tags: Rails, JavaScript
date: "2016-10-21T22:00:00.000Z"
archived: true
---

A little known Rails feature is built-in JST support and we can leverage this along with [EJS](http://www.embeddedjs.com/) to have a neat and tidy JS templating solution.

### Getting started

The first thing you’ll want to do is add the **ejs** gem to your gemfile

```rb
gem 'ejs' # client side templates
```

Once we’re setup with [EJS](http://www.embeddedjs.com/) we can then create our first template:

```html
// app/assets/javascripts/templates/profile.jst.ejs
&lt;div class="user-profile">
  &lt;img src="&lt;%= user.profile_img %>">
  &lt;h4>&lt;%= user.username %>&lt;/h4>
&lt;/div>
```

To get templates loading into application.js, add `//= require_tree ./templates` like below:

```js
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree ./templates
//= require_tree .
```

All set, now each of the templates is available as a javascript variable with the path name of the template. The *profile.jst.ejs* template created above is available as `JST['templates/profile']`

```js
// Example usage
$(function() {
  var profile_template = JST['templates/profile'];

  var html = profile_template({
    user: {
      username: "phawk",
      profile_img: "https://example.org/thumb/pete.jpg"
    }
  });

  $('.user-profiles').append(html);
});
```

We could accomplish something similar with a more complex solution like requireJS or browserify, however I like to keep my tooling and workflow lean when starting new projects and sticking with the asset pipeline is usually how I start off.
