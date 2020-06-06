---
layout: post
title: Architecture process
tags: Development, JavaScript
category_id: clean_code
date: "2013-01-03T22:00:00.000Z"
---

I've long wanted to jot down the elements to my architecture process so that I could measure and improve upon it. I think once you have something nailed down as a specific process you can really see where the weaknesses are and make big improvements to your workflow.

Architecture for me has long been a black art of kinds that different problems need different styles of process to solve them, I doubt this is true, and it's probably just that I've never solidified my process, I'm going to try that with an example problem and note down what I am doing.

## The problem

We have some friends who are amazing at JavaScript, but don't know the first thing about HTML or CSS and they want to build an app that lives in the browser. They want to draw and position rectangles and colour them in. We need a JavaScript object that will hide the complexities of the DOM but allow us to do the following:

- Create a rectangle
- Set its width and height in pixels
- Position its x and y coordinates in pixels
- Choose it's colour
- Show / Hide the rectangle
- Oh and of course, it only needs to work in google chrome (no cross browser testing for me).

View my [solution on GitHub](https://github.com/phawk/js-rect-example/blob/master/src/rect.js).

## Can it be smaller?

This should be on your mind before you build anything, can it be broken into smaller tasks? If so, stop right where you are, break it down into smaller tasks and architect each of those instead.

I'd also as part of this inital descision ask, **Can it be abstracted and more reusable?** In this instance I would say so, howver to keep this short we aren't going to dive into creating a **Shape** object that **Rect** can inherit from, I might do that some other time.

## 1. Design the public API

One of the first things I like to do when architecting code that is to be used by others (nearly all the code I write is, and so is yours!) is to jot down the public API I would like to use. This gives no thought to the internal architecture, but building from outside in will help you define a suitable API. This is how I would like to use the Rectangle:

```js
var rect1 = new Rect();
rect1.color('blue'); // any CSS colour value
rect1.position(100, 200); // x, y
rect1.size(300, 150); // width, height
rect1.show(); // Shows the rectangle on screen (appends it to body)
rect1.hide(); // Detatches the rectabgle from the DOM


// I would also love a shorthand way of specifying the arguments in the
// constructor, at least the width, height and colour.
var rect2 = new Rect(200, 100, 'red'); // width, height, colour - All optional
rect2.position(300, 100);
rect2.show();
```

I'd be reasonably happy to use an API like this. Once I am happy with the API design I'll move on.

## 2. What are the responsibilities of this object?

This is where you define how the internals of the object operate, what does it need to do:

- Contains an HTMLElement object
- Sets CSS styling properties on the HTMLElement
- Inserts the HTMLElement to the DOM
- Detatches the HTMLElement from the DOM

## 3. Dependency diagram

I've found drawing diagrams is a great way to help you focus and think when architecting. I always find it too easy to write a couple of paragraphs about something without actually doing much thinking. Once you have to draw a diagram you will realise you have a lot more work to do.

![Rect dependency](https://cl.ly/Lv2S/Rect%20object%20deps.png)

So this simply illustrates the depency upon the browsers document API, **document.createElement** etc. And the realisation that the object needs to store an internal HTMLElement. This one seems quite simple, as part of a larger application it is always good to show where your object sits within the system, these diagrams help me with that decision.

## 4. Flow diagrams

In the interest of brevity I am going to illustrate just one flow here, creation of a new Rect object.

![Rect creation flow](https://cl.ly/Lvh0/Creation%20of%20Rect%20flow.png)

This may seem simple for this scenario, but it can really help simplify your solutions for more complex problems, thinking about these things up front is key.

## 5. Write your first failing test

Get stuck in, if your task is as small as this one it's time to write a failing test and start to test-drive your solution. If you don't do TDD yet, it's time you tried it! Have a look at [my tests for Rect](https://github.com/phawk/js-rect-example/blob/master/tests/rect.test.js) and see if it makes any sense.

I have all of the source and tests for this [solution on GitHub](https://github.com/phawk/js-rect-example).

## Solution

```js
(function(global, moduleName, undefined) {

    var Rect = function() {
        // Create an HTML Element
        this._el = global.document.createElement('div');
        this._el.style.position = 'absolute';

        // Call the constructor
        this.init.apply(this, arguments);
    };

    Rect.prototype.init = function(w, h, color) {
        if (parseInt(w) && parseInt(h)) this.size(w, h);
        if (typeof color === "string") this.color(color);
    };

    Rect.prototype.color = function(color) {
        if (typeof color !== "string") throw new Error('rect.color(cssColor): You must pass a valid CSS color');

        this._el.style.backgroundColor = color;
    };

    Rect.prototype.position = function(x, y) {
        if (!parseInt(x) || !parseInt(y)) throw new Error('rect.position(x, y): You must pass (int)x and (int)y values');

        this._el.style.left = x+'px';
        this._el.style.top = y+'px';
    };

    Rect.prototype.size = function(w, h) {
        if (!parseInt(w) || !parseInt(h)) throw new Error('rect.size(width, height): You must pass (int)width and (int)height values');

        this._el.style.width = w+'px';
        this._el.style.height = h+'px';
    };

    Rect.prototype.show = function() {
        var body = global.document.querySelector('body');
        body.appendChild(this._el);
    };

    Rect.prototype.hide = function() {
        if (this._el.parentElement) {
            this._el.parentElement.removeChild(this._el);
        }
    };

    global[moduleName] = Rect;

})(this, 'Rect');
```

I'd love to hear your thoughts and suggestions in the comments.
