---
layout: post
title: Don't ever fix a bug
tags: Development
date: "2012-11-03T22:00:00.000Z"
archived: true
---

We'll start by a basic [definition of a bug](http://en.wikipedia.org/wiki/Software_bug).

> A software bug is an error, flaw, mistake, failure, or fault in a computer program or system that produces an incorrect or unexpected result, or causes it to behave in unintended ways.

### What generally causes a bug

In my opinion bugs are caused by complexity, complicated code that hasn't been designed effectively to make it as simple as possible.

There are code smells that you can tell simply by looking at code to know that it is complex and will potentially be bug prone.

- Long methods (methods with 20+ lines of code)
- Long classes with more than a couple of hundred lines of code
- Many nested control structures
- In JavaScript particularly code that has many nested callbacks

Don't take it for granted that these things ensure you will have code ridelled with bugs, but in my experience, the likely hood is high.

## What does a bug fix look like

In most cases especially dealing with the type of code mentioned above, a bug fix is generally adding more control structures or input checks–this is not necessarily a bad thing if these checks were missing in the first place.

However, if we already had the appropriate checks for input coming from users or third parties and the bug came from within our own application, a bug fix often leads to more complexity and longer methods.

Under the pressures of delivering, we often succome to this kind of fix, a temporary hack around the real problem. Now that we know what the real problem is (ineffective design) we can approach it in a different way.

## What is the alternative

The alternative that I personally propose is refactoring. Patching up bugs will only get you so far and the likelyhood it will lead to more issues is high. *Don't ever fix a bug, refactor it out*.

Simplicity is the goal, taking complicated problems and coming up with simple, well-composed solutions, taking code as mentioned above with long methods and lots of controls structures and simplifying it. The goal:

- Short methods that do one thing and one thing only
- Well composed classes that deal with one concern
- Simple control structures
- And in JavaScript, not having deeply nested callbacks

I personally practise TDD and find that it helps to drive the design of the code you write, to have well composed short methods, especially because you think a lot more about the design of the code up front, and thinking about writing a test focusses you on solving a single problem at a time.

I know TDD isn't for everyone, but I'd really encourage you to try it if you haven't and give it a couple of weeks to enlighten you, regardless, I hope you can see the benefits in refactoring bugs away.
