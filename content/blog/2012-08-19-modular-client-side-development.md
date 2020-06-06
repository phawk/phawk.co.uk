---
layout: post
title: Modular client-side development
tags: JavaScript, Web Apps
date: "2012-08-19T22:00:00.000Z"
---

From using node.js and sinatra quite a lot in the past few months it has really been evident that our client side JavaScript code and loaders don't seem to deal with the modular concept very easily. I have spent the past few weeks building modules or micro applications that form a piece of a bigger puzzle. Reading through [TJ's post on components](http://tjholowaychuk.com/post/27984551477/components) at the end of last week and how the guys at learn boost have pretty much built their entire application based on this concept was comforting and you should definitely give it a read!

## Philosophy

One of the most important things I have found is **writing your module outside of your application**, this ensures a couple of things:

* Your tests are completely isolated
* Adding a dependency to your module is a pain!
* Your module can be easily re-used, just drag and drop it into another app

One of the most important things to take from this is coupling to a dependency is hard, it really forces you to think if that dependency is necessary and you will end up with code that has very loose coupling, which is always a good thing!

To demonstrate how easy it is to move your code to another application, this source code I put together for this app was already in an [app I was developing](http://hedgeho.gg) last week. It took all of about 5 minutes to piece together the [sample code](https://github.com/phawk/client-side-modules).

## Walkthrough

The sample code is [available on GitHub](https://github.com/phawk/client-side-modules). If you are running this code you will need to set up a server in the root directory to make sure all of the assets are loaded in. I was lazy and just useds PHP 5.4's built in server:

```bash
$ php -S localhost:8000
```

### File structure

Inside the root `js` folder we have a modules directory and one *extremely small* module `action-dialog`. Keeping all of your modules files: Views, Models, Collections and assets separate really makes things reusable. It will also help in a large team and help avoid people changing the same code at the same time.

### Tests

With this modular approach, each module should have their own tests, take a look at the `modules/action-dialog/specs` directory.

For running the tests I have been using one `tests.html` file in the root of the application. For me this approach just minimises the code taken to get a test runner up and going. With mocha it is really easy to still drill down and just view the tests for one particular module during development, just click on the **Action Dialog View** heading and mocha will only run that spec.

### Assets

I agree with TJ in his components article that each module should have it's own CSS and images, he adds that the CSS should only be structural CSS for layout, and not delve into typography or colour at all. Your applications independent CSS in `css/layout.css` should be like a theme that covers all of those reusable style attributes.

Also images and html should all be self contained in the module, currently I load in the HTML with the requirejs text plugin and compile it into a template using [Handlebars](http://handlebarsjs.com). Images can easily be placed into the modules CSS and then loaded into the core application that way, or referenced via the modules HTML templates.

### Core Libraries

So for my applications I have several core libraries that I always make use of:

* [require js](http://requirejs.org/)
* [jQuery](http://jquery.com/)
* [mocha](http://visionmedia.github.com/mocha/)
* [sinon](http://sinonjs.org/)
* [chai](http://chaijs.com/)
* [underscore](http://underscorejs.org/)
* [Backbone](http://backbonejs.org/)
* [Handlebars](http://handlebarsjs.com)

In this example and in the applications I am building currently, these core libraries sit in `/js/libs` and are shared between all of the modules. This does go a little against the modules being completely standalone, but it would be simple enough for a module to have its own **libs** folder and manage its own library dependencies. If a new team member comes on board and doesn't like using mochas BDD style specs they could certainly write their own Qunit tests for their module and have it run those independently of the rest of the app.

### main.js

To simplify loading the modules into the app, each module has its own `main.js` file in the root of that module. This is just a convention for that module to export whatever public API is needed to run.

### Documentation

Each module should have its own [readme file](https://github.com/phawk/client-side-modules/blob/master/js/modules/action-dialog/readme.md) that explains how it can be used and go into detail on its public API and events.

### Loading

Require js is used currently to load the modules into the app, and load their specs in and run them. While I like require JS a lot, I feel something else out there is required to make this modular approach even better. I want my loader to pull in CSS and assets as well as JavaScript. I have looked at various client side module loaders and haven't found any that solve this problem well yet. [Jam](http://jamjs.org/) and [bpm](https://github.com/bpm/bpm/) seem to be the nicest loaders out there at present, but are really geared towards loading in external open source modules rather than your own custom modules living in the file system.

A build script using grunt or similar could solve this problem and over the next month or two I'm sure I will either find an excellent tool for this job, or try to write one.

## Conclusion

I am going to continue with this approach of building micro applications and glueing them together to form a large application. I have been very impressed so far by this approach, and for me it has made my code extremely lean.

I'd love to hear more thoughts on potential problems with this, or anyone else using this approach and has any suggestions. Hit me up on [twitter](http://twitter.com/peteyhawkins) or [GitHub](http://github.com/phawk).
