---
layout: post
title: 'Custom Rails error pages'
category_id: building_void
tags: Rails
date: "2017-10-15T22:00:00.000Z"
archived: true
---

This is the start of an ongoing series extracted from building [Void](/apps) – a bookmarking and reading list tool. Void is one of my side projects which I’m going to start writing about, sharing my experiences building and hopefully launching soon! I’ll write more about the what and why of Void in a later post.

Despite practising test-driven development, I’m still human, I make mistakes and at some point a user of my app will run into an error. The default experience Rails gives us when an internal server error happens isn’t great. It doesn’t fit my brand and it doesn't look like a part of my application, so if a user runs into it they’ll likely get confused.

![Rails default 500 error screen](/images/articles/custom-rails-error-pages/rails-default-500.png)

There are two main approaches to customising error pages in Rails, the first one is the simplest, so we’ll start there.

## Custom error pages

The easiest option is to just replace Rails built in error pages with your own. You’ll find these files in `/public/{404,422,500}.html`. If you’re short on time I’ve got some slightly fancier pages for you, all you have to add is your logo.

Run the following command from the root of your Rails app:

```sh
$ curl -L https://github.com/phawk/simple-error-pages/archive/master.tar.gz | tar --strip-components=1 -zx -C public/
```

You can contribute to these pages or download them manually from [Github](https://github.com/phawk/simple-error-pages). See the example below for a preview of what they look like.

![Simple 400 error screen](/images/articles/custom-rails-error-pages/simple-404.png)

I know these pages still have issues and they don’t provide a great user experience, particularly for a 404 where you may want to suggest other content for your user to view, but for me they do a much better job than the default Rails error pages for my use case and are painless to add.

Read on to find out how to have dynamic error pages with Rails

## Dynamic error pages

This is the option I’ve opted for with Void as in this instance I want to keep the header and footer in place. It takes a little more configuration.

1. Firstly Remove the static HTML error pages

    ```sh
    $ rm public/{404,422,500}.html
    ```

2. Set your own application routes as Rails’ exception app

    ```ruby
    # config/environments/production.rb
    config.exceptions_app = self.routes
    ```

3. Add some routes for each error type

    ```ruby
    # config/routes.rb

    # Dynamic error pages
    get "/404", to: "errors#not_found", :defaults => { :format => 'html' }
    get "/422", to: "errors#unacceptable", :defaults => { :format => 'html' }
    get "/500", to: "errors#internal_error", :defaults => { :format => 'html' }
    ```

4. Create an ErrorsController. Because Void is API based I also take care to render JSON error responses

    ```ruby
    class ErrorsController < ApplicationController
      skip_before_action :require_login

      def not_found
        respond_to do |format|
          format.html { render status: 404 }
          format.json { render json: { error: "Resource not found" }, status: 404 }
        end
      end

      def unacceptable
        respond_to do |format|
          format.html { render status: 422 }
          format.json { render json: { error: "Params unacceptable" }, status: 422 }
        end
      end

      def internal_error
        respond_to do |format|
          format.html { render status: 500 }
          format.json { render json: { error: "Internal server error" }, status: 500 }
        end
      end
    end```

5. Create views for each error action `app/views/errors/{internal_error,not_found,unacceptable}.html.erb`

    ```html
    <!-- example app/views/errors/not_found.html.erb -->
    <h1>Page not found</h1>
    <p>Whoops we couldn’t find the page you were looking for!</p>```


### And Voilà!

You now have dynamic error pages, you can test each one out by visiting the appropriate URL, for example `/404`. Here’s an example of how these look on Void:

![Simple 400 error screen](/images/articles/custom-rails-error-pages/dynamic-500.png)

Dynamic error pages are not without fault however, you still need static pages as a fallback for when your application errors due to your hosting provider/PaaS having unexpected downtime or incase you bump into a long running database migration when deploying.

If you use heroku you can configure your maintenance and error pages by running the following command:

```sh
$ heroku config:set \
  ERROR_PAGE_URL=//s3.amazonaws.com/&lt;your_bucket&gt;/your_error_page.html \
  MAINTENANCE_PAGE_URL=//s3.amazonaws.com/&lt;your_bucket&gt;/your_maintenance_page.html
```

---

Hope this helps, I’ll write another post about Void soon. If you want to keep up to date consider subscribing to my mailing list below, you’ll just get infrequent updates, once a week max and I’ll never spam you, promise 😇
