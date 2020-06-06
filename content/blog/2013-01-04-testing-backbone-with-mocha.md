---
layout: post
title: Testing Backbone.js with mocha
tags: JavaScript, Backbone.js, Testing
category_id: testing
date: "2013-01-04T22:00:00.000Z"
---

This is a zero setup quick starter to using TDD, it should take about 20minutes of your time max!

Client side is one of the best places to get started with TDD as it will teach you the fundamentals without you having to worry about mocking out databases and file i/o. JavaScripts awesome flexibility helps a lot too, no matter the state of your application you will probably still find it relatively easy to get legacy code into a test harness.

## Setup

I'm going to skip past the setup phase here and give you [the code](https://github.com/phawk/tdd-backbone-mocha) thats good to go. For the purpose of this tutorial I want to teach some TDD by example, not module loading with AMD or CommonJS, so we're just going to use namespacing to organise the application.

### Structure

All source files go into the `src` directory, you can see an example in `src/models/user.js` and it's related test is mirrored in `tests/models/user.test.js`.

The `src/app.js` file sets up an extremely basic namespace of app.models, app.views and app.collections to organise our source files.

All source files are wrapped in immediately executing anonymous functions to prevent hammering the global namespace with variables.

## The first task

We want our User model to use the first and last name of the user but we want a convenience method to call to get the full name of a user.

### Red (the first failing test)

In TDD we always start with a failing test, how else could we be confident that our code passes the test without first making sure that it fails.

Let's write a test in `tests/models/user.test.js` (this file has already been setup for you as a reference). Place the test below the pre-existing test inside the suite block.

I like to start off with the most simple test that I could possibly assert, in this case it's probably to test for the presence of a 'getFullName' method.

```javascript
test('should have a getFullName() method', function() {
    expect(typeof this.user.getFullName).to.equal('function');
});```

Open up the `tests/test-runner.html` file in your browser, you should see this output:

![First red test](/images/articles/testing-backbone-with-mocha/failing-test.png)

The expect code is part of the [chaijs assertion library](http://chaijs.com/), they have a few different styles of assertions, we'll continue to use the expect style throughout this tutorial.

### Making the test green

The next step is to take this failing test and write the minimum amount of code to make it pass, don't write any extra code, you should have more failing tests for that.

So to pass this test we simply need to add a 'getFullName' method to the User model, go ahead and open up `src/models/user.js` and add in the new method, it should look like this:

```js
(function(global, _, Backbone, undefined) {

    app.models.User = Backbone.Model.extend({

        getFullName: function() {

        }

    });

})(this, _, Backbone);
```

Refresh your test-runner.html file and watch the test pass. The TDD three step process is **red**, **green**, **refactor**, given the simplicity of what we have just done and the rest of this tutorial I doubt we'll use the refactoring step, but this is a critical step in TDD.

### Testing this method actually works

As you can see in the `setup()` method inside `tests/models/user.test.js` we have setup a user model with a first_name and last_name property, we want to test that those come out as 'Jimmy Wilson'. Write our next test like so and watch it fail:

```js
test('calling getFullName should return first_name[space]last_name', function() {
    expect(this.user.getFullName()).to.equal('Jimmy Wilson');
});
```

You might think of writing some code here to make sure to trim the full name, but remember what I said above **write the minimum code to pass the test**, if you think you should add in a trim() function around the returned name, write a test for it and then add the code. For now the simplest way of passing this test legitimately would be to take the first_name and last_name properties and concatenate them with a space in between, so that's what we shall do.

```js
app.models.User = Backbone.Model.extend({

    getFullName: function() {
        return this.get('first_name')+" "+this.get('last_name');
    }

});
```

Again, watch it pass and we can move on. You want to move from failing to passing tests as quickly as possible, some experts on the topic would say around 30 seconds to 1 minute maximum, I would be a little bit more liberal than that, but I would feel uncomfortable if I didn't have my test passing within 5minutes of watching it fail.

Overall in Backbone, models are quite straightforward to test until you come to mocking out AJAX requests, I'll write another post on that soon.

## Testing Backbone views

We need a profile view that will display the users details.

Your test suite should run very fast and we should always mock out things like databases, file system calls or even the DOM. For Backbone this is quite esay, we are still going to use the jQuery elements, but detatched ones in memory, this keeps things very fast.

### The first failing test

Create the most simple test possible, that the user profile view exists. We also need to make a new test file `tests/views/profile.test.js` and add two script tags to our test-runner.html file:

1. Add `<script src="../src/views/profile.js"></script>` to the source files section
2. Add `<script src="views/profile.test.js"></script>` to the tests section

And then write our test:

```js
suite('Profile View', function() {

    // Create a User model to pass into our view to give it data
    var model = new app.models.User({
        first_name: 'John',
        last_name: 'Black',
        age: 35
    });

    setup(function() {
        this.profile = new app.views.Profile({
            // Pass in a jQuery in memory &lt;div&gt; for testing the view rendering
            el: $('&lt;div&gt;'),

            // Pass in the User model
            // dependency inversion makes this simple to test,
            // we are in control of the dependencies rather
            // than the view setting them up internally.
            model: model
        });
    });

    teardown(function() {
        this.profile = null;
    });

    test('should exist', function() {
        expect(this.profile).to.be.ok;
    });

});
```

Pay attention to the comments in the above test file as they explain a little more about writing testable code. Watch the test fail, you should see an error like this:

![profile view fail](/images/articles/testing-backbone-with-mocha/failing-test2.png)

We are getting this error because we haven't defined our view yet, create the file `src/views/profile.js` and add the following Backbone view code:

```js
(function(global, $, _, Backbone, undefined) {

    app.views.Profile = Backbone.View.extend({

    });

})(this, $, _, Backbone);
```

Now run your test again and it will pass.

### Test View rendering

Our view template will look like this:

```html
<div>
<h1>John Black</h1>
<p>John is 35 years old</p>
</div>
```

Before we write out failing view tests, a word of warning. **Coupling your tests directly to implementation makes them brittle**.

Brittle tests don't provide much in the area of refactoring and aren't that valuable. When testing the view I simple want to test that it took the data from the model and rendered, so I am going to take the HTML that the view generated and assert that it has a couple of the users details in it, not that it has an `<h1>` or a `<p>` tag.

```js
test('render()', function() {
    this.profile.render();

    expect(this.profile.$el.html().match(/John/)).to.be.ok;
    expect(this.profile.$el.html().match(/Black/)).to.be.ok;
    expect(this.profile.$el.html().match(/35/)).to.be.ok;
});
```

Now watch the test fail and write the code to pass it.

```js
(function(global, $, _, Backbone, undefined) {

    app.views.Profile = Backbone.View.extend({

        render: function() {
            var html = "&lt;h1&gt;"+ this.model.getFullName() +"&lt;/h1&gt;" +
                "&lt;p&gt;"+ this.model.get('first_name') +" is "+ this.model.get('age') + " years old&lt;/p&gt;";

            this.$el.html(html);
        }

    });

})(this, $, _, Backbone);
```

As you can see my "template" is pretty ugly and should be in an external file, see the Homework section below.

## Homework

Safe refactoring is one of the top benefits of TDD. Take the aweful template in the view and change it around to be a client side template of your choice, if you are not sure which I'd recommend looking at [Handlebars](http://handlebarsjs.com/). Use your tests to make sure it all still works.

## Other resources

I'll try to write more JavaScript TDD posts soon, in the meantime checkout some of these great articles and resources that helped me learn TDD.

* [Testing Backbone with Jasmine and sinon](http://tinnedfruit.com/2011/03/03/testing-backbone-apps-with-jasmine-sinon.html) - Jim Newbury who I got to meet and chat with at one of our [typecast](http://typecast.com) parties this year has an excellent 3 part series on testing backbone.
* [Testing backbone best practises](http://blog.involver.com/2012/01/26/testing-backbone-js-best-practices-2) - Oracle involver
* [Testing backbone with Qunit and sinon](http://addyosmani.com/blog/unit-testing-backbone-js-apps-with-qunit-and-sinonjs/) - Addy osmani
* [Testing socket.io with mocha](http://liamkaufman.com/blog/2012/01/28/testing-socketio-with-mocha-should-and-socketio-client/) - This will give you an introduction to using mocha to test node.js code.
