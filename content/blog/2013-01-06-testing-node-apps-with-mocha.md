---
title: Testing node.js apps with mocha
category: Testing
date: "2013-01-06T22:00:00.000Z"
archived: true
---

A couple of days ago I wrote an article on [Testing Backbone.js with mocha](/blog/testing-backbone-with-mocha), this was a primer on doing TDD in one of the easiest environments possible, all you needed to get started was a web browser. If you have never done TDD before, I'd recommend checking out [that post](/blog/testing-backbone-with-mocha) first.

For those of us who aren't building client side and are working with multi-page websites this won't be as useful, but we can reuse the same language and testing framework, [mocha](http://visionmedia.github.com/mocha/), on the server side with [node.js](http://nodejs.org/).

## Setup

This isn't quite as simple as downloading a zip file in my last article...

1. Make sure you have node.js and npm installed. Hit up [nodejs.org](http://nodejs.org/) and click the big install button.
2. Create a new directory for your project
3. Make a package.json file and fill it with the following content

```json
{
  "name": "testing-node-with-mocha",
  "version": "0.1.0",
  "author": "Firstname Lastname <email@domain.com>",
  "description": "a barebones example of testing node.js code with mocha",
  "scripts": {
    "test": "make test"
  },
  "dependencies": {
    "chai": "~1.4.2",
    "mocha": "*"
  },
  "engines": {
    "node": ">=0.8"
  }
}
```

4. Install your dependencies with `npm install`. *I haven't used the devDependencies section for these as there are still a few problems with that and circular references when installing chai or expect.js alongside mocha*.
5. Create a Makefile so you can run `make test` to run all of the command line arguments passed to mocha in an easy manner, I found this helpful from [Brian Stoners article on testing with node](http://brianstoner.com/blog/testing-in-nodejs-with-mocha).

```make
REPORTER = dot

test:
  @NODE_ENV=test ./node_modules/.bin/mocha \
        --reporter $(REPORTER) \
        --ui tdd

test-w:
    @NODE_ENV=test ./node_modules/.bin/mocha \
        --reporter $(REPORTER) \
        --growl \
        --ui tdd \
        --watch

.PHONY: test test-w
```

**Warning** if you get the following error when running `make test`: `Makefile:13: *** missing separator (did you mean TAB instead of 8 spaces?).  Stop.`, you need to use tabs as the separator in a Makefile, spaces won't work.

6. Create a `test/` directory in the app root — mocha will automatically look into this folder for tests to run.

## What we are going to do

We need to write a Bank Account Object for our application, we're going to test drive the design of it.

## The most simple test

Let's test for the existence of our bank account, that is the simplest test we could write.

Create a new file named `bank-account.test.js` inside your `test/` directory:

```js
// Require chai.js expect module for assertions
var expect = require('chai').expect;

// Create a new test suite for our Bank Account
suite("Bank Account Tests", function() {

    // Define a pending test
    test("should exist");

});
```

You'll notice this test is pending and won't actually assert anything yet, but this is a good time to run `make test` and check that mocha is running as it should, if all is working you'll see the following output:

![Mocha - Output pending](/images/articles/testing-node-with-mocha/output-pending.png)

Hopefully you're all setup and good to go, if you have any problems at this stage go back over the steps, or post in the comments with any problems.

### Writing the test

Now let's fill in that pending test to make it fail and give us some work to do:

```js
    // Require chai.js expect module for assertions
var expect = require('chai').expect,
    // Require our Account to test it
    Account = require('../lib/bank-account');

// Create a new test suite for our Bank Account
suite("Bank Account Tests", function() {

    // Define a pending test
    test("should exist", function() {
        var account = new Account();
        expect(account).to.be.ok;
    });

});
```

Run the tests with `make test` and you should get a big scary error: `Error: Cannot find module '../lib/bank-account'`.

### Let's fix this one by making our Account module.

1. Create a `lib/` folder in the root directory of our application.
2. Create a `bank-account.js` file inside the lib folder you just created.

Re-run `make test`, all should fail, but it will look a lot prettier and also be red.

![Mocha - First red test](/images/articles/testing-node-with-mocha/first-red-test.png)

### Making it pass

Our test uses an instantiated version of our object, therefore our bank account module will need to return a constructor function that will return an object, let's create this barebones object.

```js
var Account = function(args) {

};

module.exports = Account;
```

The output of your `make test` should now be `1 test complete` and all green.

## The balanace

What good is a bank account without a balance, we want to have private variables (encapsulation) via closures on this bank account object to prevent people tampering with it, so we want a method to fetch the balance, we'll also start the balance off at 0 so we know what to assert.

### Writing the test

```js
test("getBalance()", function() {
    expect(this.account.getBalance()).to.equal(0);
});
```

Watch it fail, you should get a TypeError: `TypeError: Object [object Object] has no method 'getBalance'`.

### Making it pass

```js
var balance = 0;

var Account = function(args) {

};

Account.prototype.getBalance = function() {
    return balance;
};

module.exports = Account;
```

All should now be green and you should have two passing tests

## Lodging money

What good is a bank account with no money in it, lets make a lodge method on the account to input some money.

### Red

```js
suite("lodge()", function() {

    test("should update the balance", function() {
        // Create a new account
        var account = new Account();

        // Put 100 monies into the account
        account.lodge(100);

        // Check the balance is now 100
        expect(account.getBalance()).to.equal(100);
    });

});
```

We add a new suite just below the second test, suites can be infinitely nested and help to provide context in your test ouput.

### Green

You are on your own here, make this test pass. If you do run into trouble, you can view the complete source code of [my solution on GitHub](https://github.com/phawk/tdd-node-mocha), try not to use it though.

## Multiple bank accounts

Is it just me or do you have a sneaky suspicion the variable for balance will be shared across all accounts? Let's write a new test to make sure they work.

```js
suite("multiple accounts", function() {

    test("should not share the same balance", function() {
        var acc1 = new Account();
        acc1.lodge(110);

        var acc2 = new Account();
        acc2.lodge(95);

        expect(acc1.getBalance()).to.equal(110);
        expect(acc2.getBalance()).to.equal(95);
    });

});
```

Run your test and see what happens.

Oh dear, now our balance isn't coming out as 110 for account 1, it is coming out as 305, why could this be? Well if we add up all of the money we have lodged it adds up to 305, so it would seem as anticipated our `balance` variable is actually shared between all of our accounts. This has been a common mistake for me in the past with node and I'm sure might affect other people starting out as well.

What has gone wrong? Well we have reference to one Account variable, which shares one instance of the closure to `var balance`. Let's change our Account around a little and make its creation happen with a function. Update our test suite first.

Change all instances of `new Account()` in our test suite to be `Account.create()`. Run the tests again and see all of them fail.

### Making it pass

We need our module to have export create method that will have it's own internal closure state and create our Account object for us and return it.

```js
module.exports = {};

/**
*   create()
*   ========
*
*   Creates and returns a new Bank Account Object
*   This allows us to have privately scoped variables
*/
module.exports.create = function() {

    // A non exported variable to hold the balance that our
    var balance = 0;

    var Account = function(args) {

    };

    // Returns the current balance of the account
    Account.prototype.getBalance = function() {
        return balance;
    };

    // Lodges money into the account
    Account.prototype.lodge = function(amount) {
        balance = parseInt(amount) + parseInt(balance);
    };

    // Return the new instance of the Account Object
    return new Account();
};
```

## Withdrawing money

Now we want to be able to take out some of our well deserved cash at an ATM. Let's write a failing test.

```js
suite("withdraw()", function() {

    test("should update the balance", function() {
        // Create a new account
        var account = Account.create();

        // Put 1,000 monies into the account
        account.lodge(1000);

        // Take out 150 monies
        account.withdraw(150);

        // Check the balance is now 850
        expect(account.getBalance()).to.equal(850);
    });

});
```

You should get an error: `TypeError: Object [object Object] has no method 'withdraw'`. Let's add a withdraw method to the `prototype` of our Account object that let's you take out money and passes this test.

{% highlight js linenoes %}
// Take some of your monies out
Account.prototype.withdraw = function(amount) {
    balance = parseInt(balance) - parseInt(amount);
};
```

## Starting balance of an account

One last thing we are going to write a test for: Allow passing of a starting account balance when opening the account with `Account.create(150);`.

```js
suite("opening balance", function() {

    test("should affect the balance", function() {
        var account = Account.create(1175);

        expect(account.getBalance()).to.equal(1175);
    });

});
```

Passing the test is pretty easy too:

```js
module.exports = {};

/**
*   create()
*   ========
*
*   Creates and returns a new Bank Account Object
*   This allows us to have privately scoped variables
*/
module.exports.create = function(initialBalance) {

    // A non exported variable to hold the balance that our
    var balance = 0;

    var Account = function(initialBalance) {
        if (parseInt(initialBalance)) balance = initialBalance;
    };

    // Returns the current balance of the account
    Account.prototype.getBalance = function() {
        return balance;
    };

    // Lodges money into the account
    Account.prototype.lodge = function(amount) {
        balance = parseInt(amount) + parseInt(balance);
    };

    // Take some of your monies out
    Account.prototype.withdraw = function(amount) {
        balance = parseInt(balance) - parseInt(amount);
    };

    // Return the new instance of the Account Object
    return new Account(initialBalance);
};
```

## Homework

If you want to continue on with TDD in node, there are a few things you can do to improve your bank account:

* Type checking on all inputs into methods.
* Make sure you can't lodge negative amounts of money or 0.
* Make sure you can't withdraw negative amounts of money or 0.
* Support for an overdraft facility.

## Source

If you want to view the finished source of my example, it is [available on GitHub](https://github.com/phawk/tdd-node-mocha).
