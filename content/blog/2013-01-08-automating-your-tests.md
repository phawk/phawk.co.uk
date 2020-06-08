---
layout: post
title: Automating your tests
tags: JavaScript, node, Testing
category_id: testing
date: "2013-01-08T22:00:00.000Z"
archived: true
---

Having a test suite is awesome, doing TDD is awesome too, but what if you make that really quick change and forget to run those tests? It's likely to blow up in your face.

### Don't fret automating tests is simple

I'm going to show you two super easy ways to automate your node.js mocha tests from the [last post](/blog/testing-node-apps-with-mocha).

## Git pre-commit hook

You've got to commit your code before you can deploy it, so a pre-commit hook will ensure your tests are always run, there is no forgetting.

Setting up a git pre-commit hook is super easy, first create a pre-commit file in your `my-project/.git/hooks/` directory and make it executable, then add `make test` the command to be run on pre-commit. (Run these commands at the root of your git repository)

```bash
$ touch .git/hooks/pre-commit
$ chmod +x .git/hooks/pre-commit
$ echo "make test" > .git/hooks/pre-commit
```

Once you have this file, git will run the commands inside it and listen to the exit codes of the programs to see if it will proceed with the commit or not. Our `make test` from the last post will output an exit code **1** (which is an error) if the tests fail and a **0** (which is a pass) if the tests pass.

### Failing tests

![Failing commit](/images/articles/automating-tests/commit-failing.png)

*If the tests fail git will not even commit the code, it will leave the changes in the staging area.*

### Passing tests

![Passing commit](/images/articles/automating-tests/commit-passing.png)

*If the tests pass your commit will go through like normal*

## Travis CI

You are now covered with the pre-commit hook above, git won't let you check in code that doesn't pass the tests, this next step will also allow you to see contributors or team members code is passing before accepting pull requests.

### Failing travis pull request

![Failing travis-ci pull request on github](/images/articles/automating-tests/travis-fail.png)

### Passing travis pull request

![Passing travis-ci pull request on github](/images/articles/automating-tests/travis-pass.png)

Integrating with [travis-ci](https://travis-ci.org/) is free for open source projects and is a perfect first pass for your pull requests.

1. Create a `.travis.yml` file in the root of your repository and set its content to the following:

        language: node_js
        node_js: 0.8

    *[A lot more configuration options](http://about.travis-ci.org/docs/) can be set in this file, this is all we need to get our node tests running though since they follow a lot of the node conventions (like running with npm test and installing dependencies with npm install).*

2. Signin to [travis-ci](https://travis-ci.org/) with your github account and turn the tests on for your repository.

3. (optional) It is nice to show the consumers of your project the build status to give a little peace of mind, you can put a status image into your readme ![Build status](https://travis-ci.org/phawk/tdd-node-mocha.png?branch=master)

        Image url:
        https://travis-ci.org/[Organisation]/[Repository].png?branch=master

## Wrapping up

With git pre-commit hooks and continuous integration systems like travis-ci it is extremely straightforward to ensure you, your team or collaborators never commit or accept failing code.

It is a little more complex to get travis to run your web browser based tests for mocha in a headless browser, I will leave that for another post.
