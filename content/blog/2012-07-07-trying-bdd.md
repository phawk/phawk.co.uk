---
layout: post
title: Trying BDD
tags: Testing
category_id: testing
date: "2012-07-07T22:00:00.000Z"
---

When I started out as a developer and to this day I am always seeking ways to improve my workflow and the quality of the code I write.

Before I started writing tests I would still try and do top down design, looking at the end goals, writing down the behaviors as comments in files before I would write the code to complete the task at hand.

This approach certainly works well, although was just covering one advantage brought from top down design, thinking. Thinking before you code is absolutely neccessary, but as developers we need more than that, we should have confidence in our code and be able to safely refactor and improve our codebase at any point in time, without having to worry about extensive manual testing.

## Starting out with tests

I've started to use behaviour driven development (BDD) as a major part of my workflow, definng business rules (behaviours) along with the design of each feature up front. Tests (or specs) should be based on these behaviours and entirely separated from the implementation used to pass them, making our specs extremely valuable for us devs and for the business people too.

I am still very much new to this BDD thing, and missing out on a few key parts of BDD as a whole, sticking initially to unit test specs and the core language for describing behaviour (scenarios and given, when, then).

I try to write stubs for all of my behaviours up front without writing any test code. Once I have this structure set up I can then start writing my first test specification, moving quickly on to writing the code to pass that spec, this schedule should follow a strict pattern.

## Red, Green, Refactor

* write a test spec to assert one behaviour
* run the test and see it fail (red)
* write the minimum code to pass the test
* run the test and see it pass (green)
* refactor the code so you are happy that it is readable and easily maintainable
* run the test again to ensure you refactored code passes
* repeat until you are happy with the refactored code

These steps should be done in very quick succession, 30seconds to 2minutes. I think it is ok to take longer depending on the complexity of the job at hand, but aim to make this progress as quick as possible so everything is fresh in your head. Another byproduct of quick progression ensures you won't have massive amounts of code tested by just one spec, you will end up having better test coverage.

Hopefully this gives you an overview of the advantages and process to using TDD / BDD as a methodology for development. The main enviornment I am working in right now is JavaScript in the browser and on node.js, I will put together an article specifically on how I acomplish testing JavaScript and the tools I use (for now listed below).

* [mocha](http://visionmedia.github.com/mocha/)
* [chai.js](http://chaijs.com/)
* [sinon](http://sinonjs.org/)
* [sinon-chai](https://github.com/domenic/sinon-chai/)

If you have any tips or anything to add please feel free to comment.
