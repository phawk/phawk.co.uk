---
layout: post
title: Using tailwind CSS with Gatsby
tags: ["gatsby"]
date: "2020-06-09T20:00:00.000Z"
author: pete
---

Tailwind CSS has taken frontend styling by storm, it’s not quite CSS-in-JS but can provide many of the same benefits without having to write a lot of boilerplate and in my opinion works really well with React.

I’ll give a bit of an overview to why I use tailwind for the majority of my projects, if you are already a convert and simply want to know how to use it with Gatsby you can skip ahead.

- [Why tailwind](#why-tailwind)
- [How to get started](#how-to-get-started)
- [Reusing styles by creating components](#reusing-styles-by-creating-components)

## Why tailwind?

I am a recent convert to tailwind despite knowing of it for a long time, mainly due to the fact that I was already using a utility CSS framework tachyons. Tachyons has many of the same benefits and works exactly the same way,

If you have seen the utility CSS style and initally thought it was horrible, I have writing HTML and for almost 20 years now and I felt the same way initially. What changed my mind was persevering with it and realising just how much faster I could style components, particularly adding different margins and padding when reusing them in different locations. The other great benefit is theming and sticking to a subset of colours. Constraints imposed on design make it a lot faster to build UIs and often tend to make the overall feel and rythym more consistent.

With the switch to tailwind I did notice some major improvements over the tachyons library I was using previously.

- Responsive prefixes like `flex flex-col md:flex-row` are super helpful and even `hover:` and `focus:` psuedo selectors make interactive styling a breeze.
- Tight integration with Post CSS, purge CSS and the whole node.js ecosystem
- Easy overrides and customising your base styles are simple with `tailwind.config.js`

Overall I’m really happy with tailwind, even comparing with emotion and styled-components.

Couple tailwind with Gatsby or any other React based framework and you can create components for each element in your design, enabling you to reuse the lengthy class names easily and avoid repetition.

If you have any concerns about performance (I initially did), turns out compression algorithms like GZIP and Brotli are fantastic at optimising similar strings, so that's a non-issue.

## How to get started

There are a lot of different articles out there explaining how to use tailwind with Gatsby and React, many of which I was personally unhappy with, running a separate process to build your CSS, altering build scripts or setting tailwind up in combination with emotion. So I decided to write my own.

#### 1. Installing dependencies

```sh
$ yarn add tailwindcss gatsby-plugin-postcss gatsby-plugin-purgecss
$ yarn add --dev postcss-import autoprefixer
```

#### 2. Setup postcss + purgecss in gatsby-config.js

Add the following to your `gatsby-config.js` file.

```
{
  resolve: `gatsby-plugin-postcss`,
  options: {
    postCssPlugins: [
      require("postcss-import"),
      require("tailwindcss"),
      require("autoprefixer"),
    ],
  },
},
{
  resolve: `gatsby-plugin-purgecss`,
  options: {
    printRejected: true, // Print removed selectors and processed file names
    develop: false, // Enable while using `gatsby develop`
    tailwind: true, // Enable tailwindcss support
  },
},
```

#### 3. Create tailwind config

Run this in the root of your project to create your tailwind config file. Here you can override and extend styles or set your base font family etc.

```
$ npx tailwindcss init
```

#### 5. Setup `src/styles/app.css`

Setup your stylesheet for your application and import in your main layout file.

```
@import "tailwindcss/base";

@import "tailwindcss/components";

@import "tailwindcss/utilities";
```

```
import "../styles/app.css"
```

#### 6. Bonus: Adding tailwind UI

...

## Reusing styles by creating components

Creating your design system or components allows you to easily build UIs for new pages or features. Over time you’ll build up a tonne of styled components and creating a new page is effortless.

I personally like to keep my components similar to how they work in standard HTML, using a lot of custom attributes means you need to keep re-referencing files to see how they work.

```jsx
// src/components/Button.js
import React from "react"

const Button = ({ children, className, ...rest}) => {
  return (
    <button
      type="button"
      className={`px-3 py-2 rounded bg-gray-900 hover:bg-gray-800 text-white font-medium text-lg ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
```

Using your new button is easy.

```jsx
import Layout from "../components/Layout"
import Button from "../components/Button"

const IndexPage = () => {
  return (
    <Layout>
      <Button className="my-5">
        Subscribe
      </Button>
    </Layout>
  )
}
```