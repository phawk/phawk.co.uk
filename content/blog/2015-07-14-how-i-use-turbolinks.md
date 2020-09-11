---
title: How I use Turbolinks
category: Rails
date: "2015-07-14T22:00:00.000Z"
archived: true
---

For many traditional multi-page apps [turbolinks](https://github.com/rails/turbolinks) can offer a great perceived performance boost to your end users, however it can be tricky to get running if you’re not well practiced in JavaScript.

There are two main choices you need to make when writing your JS code:

1. Does this need to run only on the initial page load?
2. Does this need to run on every page load including the turbolinks soft page loads?

If you’re answered 1 then your JS code probably already works with a standard jQuery wrapper like below:

```js
$(function() {
  // Your code
});
```

## The Setup

I have a common boilerplate I like to use on turbolinks projects that I find makes things a bit easier

```js
// app/assets/javascripts/application.js

//= require jquery
//= require jquery_ujs
//= require underscore
//= require turbolinks
// ** other js plugins etc go here **
//= require_self
//= require_tree ./features

var App = {
    onLoadFns: [],

    onPageLoad: function(callback) {
        this.onLoadFns.push(callback);
    },

    load: function() {
        _.each(this.onLoadFns, function(callback) {
            callback.call(this);
        }, this);
    }
};

$(function() {

    Turbolinks.enableProgressBar();

    // Called everytime turbolinks loads a new page
    $(document).on("page:load", function() {
        App.load();
    });

    // Called on initial full page load
    //
    // defer is used to allow all features to register
    // their page load callbacks before App.load runs
    _.defer(function() {
        App.load();
    });
});
```

This is the main code that allows simple usage within your `app/assets/javascripts/features/*.js` files.

### Load every time turbolinks changes the page

An example feature that needs to run everytime turbolinks pulls down a new page would be adding a rails CSRF token to all ajax requests:

```js
// app/assets/javascripts/features/ajax_prefilter.js
App.onPageLoad(function() {
  // Reset CSRF token for ajax requests on each page load
  var token = $("meta[name='csrf-token']").attr("content");

  $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    jqXHR.setRequestHeader('X-CSRF-Token', token);
  });
});
```

Another example would be applying a datepicker to all date fields, as each new page could contain new date fields we need to run this on every page:

```js
// app/assets/javascripts/features/datepicker.js
App.onPageLoad(function() {

    $("input.datepicker").pickadate({
        firstDay: 1,
        formatSubmit: "yyyy-mm-dd",
        hiddenName: true
    });

});
```

### Load once on initial page load

For code that only needs to run once you could have dropdown menus in your navigation, use jQuery event delegation for this and you only need to register the event listeners once.

```js
// app/assets/javascripts/features/dropdowns.js
$(function() {
    $(document).on("click", ".ui-dropdown-menu .title", function() {
        var $menu = $(this).closest(".ui-dropdown-menu");

        $menu.toggleClass("open");
    });
});
```

### Combination of both

This third case doesn’t happen as often but is sometimes necessary to keep some state across all pages but also bind events on individual page loads.

```js
$(function() {
  // Code to be loaded only once
  var pages_visited_with_turbolinks = 0;

  App.onPageLoad(function() {
    pages_visited_with_turbolinks++;
    console.log("User has visited "+ pages_visited_with_turbolinks +" pages");
  });
});
```


## Wrapping up

Turbolinks can be a bit of a pain to get started with but if you follow these simple rules I’ve found it to work well. It provides a decent performance improvement that doesn’t come close to the time investment required to build a single page app.
