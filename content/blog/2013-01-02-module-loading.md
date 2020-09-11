---
title: Module loading
category: JavaScript
date: "2013-01-02T22:00:00.000Z"
archived: true
---

So as I mentioned in my goals for 2013 I am working on a JavaScript framework, it has been really interesting so far and I am learning quite a lot from it.

One of the things I wanted was to allow the library to be loaded in any of the 3 major environments, AMD, CommonJS or directly in the browser as a global. I've done a bit of tinkering and come up with my first iteration of loading.

```js
(function (global, $, name, definition) {
    // Checks what environment we are in and loads accordingly
    if (typeof define === "function" && define.amd) {
        // With AMD we require the module with its name rather than passing the variable directly
        define(["jquery"], definition); // AMD
    }
    else if (typeof module !== "undefined" && module.exports) {
        // CommonJS will need to require the node module for jQuery
        $ = require("jquery");
        module.exports = definition($); // CommonJS
    }
    else {
        global[name] = definition($); // Browser global variable
    }
})(this, this.$, "ModuleName", function ($) {
    // Modules private API
    return {
        // Modules public API
    };
});
```

I hate having the dependencies hard-coded for AMD and CommonJS and will hopefully find a much nicer way of doing that, maybe it's a sign though that I shouldn't be building it as a strict dependency on the framework itself. I'd love to allow people to easily use zepto as an alternative, or even something without the jQuery syntax altogether. Maybe a more modular approach is needed as an adapter interface.

Although this post isn't about dependencies per-say, I'd love to hear thoughts on them in the comments. Also if you have a neater way of doing the loading do let me know!
