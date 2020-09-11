---
title: 'Using Vue.js + webpack with Rails 5 today'
category: Rails
published: false
date: "2017-02-05T22:00:00.000Z"
archived: true
---

With Rails 5.1 we’re going to get built in support for using webpack for our javascript, allowing us to use more advanced frontend tools and frameworks. The rails/webpacker gem is already out there and with a bit of reading, trial & error I’ve got it working with rails 5.0.

For this tutorials we’ll be building a very basic contacts manager app, this should give you a good idea of how to use rails, webpack and vue.js.

First up we need to create a skeleton rails 5 app, I’m skipping a few things we don’t need.

```sh
$ rails new contacts --skip-bundle --skip-action-cable --skip-javascript --skip-turbolinks
$ cd contacts
```

Once we have this we need to add a few extra gems to the Gemfile, it should look like the following:

```ruby
source 'https://rubygems.org'

gem 'rails', '~> 5.0.0', '>= 5.0.0.1'
gem 'sqlite3'
gem 'puma', '~> 3.0'
gem 'sass-rails', '~> 5.0'
gem 'webpacker', git: 'https://github.com/rails/webpacker.git'

group :development, :test do
  gem 'byebug', platform: :mri
end

group :development do
  gem 'foreman'
  gem 'web-console'
  gem 'listen', '~> 3.0.5'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end
```

Next up, install all of the gems and install webpack and vue

```sh
$ bundle install
$ bin/rails webpacker:install
$ bin/yarn add vue vue-template-compiler vue-html-loader vue-loader axios underscore underscore.string vue-style-loader css-loader dotenv node-sass sass-loader postcss-loader
```

With webpack install we need to configure a couple of things to run the webpack dev server. Open up `config/environments/development.rb` and uncomment the webpack dev server host

```ruby
Rails.application.configure do
  # Make javascript_pack_tag load assets from webpack-dev-server.
  config.x.webpacker[:dev_server_host] = "http://localhost:8080"
  # ...
end
```

Next create a `Procfile.dev` in the root of your project and add the following content to it:

```yaml
web: bin/rails server
webpack: bin/webpack-dev-server --inline --hot
```

And so rails doesn't generate lots of things you don't need, add this to your `config/application.rb` file:

```ruby
config.generators do |g|
  g.skip_routes true
  g.helper false
  g.stylesheets false
  g.javascripts false
end
```

And Make your config routes look like this:

```ruby
Rails.application.routes.draw do
  root 'pages#home'
end
```

And finally include your application pack into your layouts/application.html.erb file

```erb
<!DOCTYPE html>
<html>
  <head>
    <title>Contacts</title>
    <%= csrf_meta_tags %>

    <%= stylesheet_link_tag    'application', media: 'all' %>
  </head>

  <body>
    <div id="app"></div>
    <%#= yield %>

    <%= javascript_pack_tag 'application' %>
  </body>
</html>
```

At this point we can load up rails and check that wepback is loading

```sh
$ bin/rails g controller Pages home
$ foreman start -f Procfile.dev
```

Now if you load up http://localhost:5000 you should see a "Hello From Webpacker" in your console

![Hello from webpacker](/images/articles/rails5-webpack/hello-from-webpacker.png)



Setup vue.js loader

```js
// Add vue loaders
{ test: /\.vue$/, loader: 'vue-loader' },
{ test: /\.html$/, loader: 'vue-html-loader' },

// Update resolve
resolve: {
  extensions: [ '.js', '.coffee', '.html' ],
  modules: [
    path.resolve('../app/javascript'),
    path.resolve('../vendor/node_modules')
  ],
  alias: {
    'components': path.resolve(__dirname, '../../app/javascript/components'),
    'helpers': path.resolve(__dirname, '../../app/javascript/helpers'),
    'vue$': 'vue/dist/vue.common.js',
    'resources$': path.resolve(__dirname, '../../app/javascript/helpers/resources.js'),
  }
},
```

Setup root pack to require and boot the Vue app.

```js
const App = require("components/app.vue");

if (document.getElementById("app")) {
  new App().$mount("#app");
}
```

Let's generate some data to play with

```sh
$ bin/rails g model Contact first_name last_name email phone avatar_url
$ bin/rails db:migrate
$ bin/rails g serializer contact first_name last_name email phone avatar_url
$ bin/rails g controller contacts
```


Files:

app/controllers/contacts_controller.rb
config/routes.rb
helpers/resources.js

protect from forgery with null session



Vue HMR needs the modules to be plain JS objects and the main to be a VM.
