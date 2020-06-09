---
layout: post
title: Backbone.js conventions (part 1)
tags: JavaScript, Backbone.js
date: "2012-12-09T22:00:00.000Z"
archived: true
---

[Backbone.js](http://backbonejs.org/) is a very popular client side framework, it is very flexible and thus has many different ways of doing things. I've found so many different examples on the web of how to do things in backbone, this makes it very difficult for beginners to know which is the right convention to follow.

I want to share some of the common conventions I've picked up along the way and why I use them.

## 1. Event aggregator

Creating a global event system is a great way to handle decoupled messaging within your applications. You can pass this single event instance to all of your views / components and it allows a platform for evented communication.

```js
var app = app || {};

app.events = _.extend({}, Backbone.Events);

new Backbone.View({
  events: app.events
});

// Trigger events
app.events.trigger("some-module:some-event", some, params)

// Bind to events
app.events.bind("some-module:some-event", this.callbackMethod, this);
```

## 2. Dependency inversion of el

The `this.el` element within the Backbone views can easily be passed in using a common technique called Inversion of Control. This allows us to do flexible things when testing our views:

- Testing views we can pass in an in-memory DOM node $('&lt;div&gt;')
- We can use in memory nodes on list views to build up list items and then only append once to the actual DOM.

```js
var app = app || {};
app.views = app.views || {};

app.views.MyView = Backbone.View.extend({

  render: function() {
    // Use a handlebars template or similar here
    var html = "Some html template content here";
    this.$el.html(html);
  }

});


new app.views.MyView({
  el: $('.some-div-container')
});
```

## 3. Unbinding events

This one is major, especially if you are coming from a server side garbage collected language where it's trickier to get memory leaks. With Backbone you have to cleanup all of your own events when you remove a view.

I put a **destroy** method into views for this purpose, I ensure all of my views define this method and cleanup any custom bound events.

```js
var app = app || { views: {} };

app.views.MyView = Backbone.View.extend({

  initialize: function() {
    app.events.bind("some-event", this.render, this);
  },

  events: {
    "click .reload": "render"
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
  },

  destroy: function() {
    // Unbind the custom events
    app.events.unbind("some-event", this.render);
  }

});

var myView = new app.views.MyView();

// Cleanup the view safely
myView.destroy();
myView.remove();
```

Looking through the Backbone source code you will see views have a **dispose** method that clears up any events bound by the view onto a model or collection held within it, it also automatically undelegates all events bound in the events hash. This happens when you call `.remove` on a Backbone view.

## Wrapping up

I hope to present another one of these informative posts soon, if there is anything in particular you would like to know how to handle in Backbone, please drop a comment below. Again these are just things I have come across and find work well when building maintainable Backbone apps, if you have any better takes on the above, drop a comment, I'd love to hear about them.
