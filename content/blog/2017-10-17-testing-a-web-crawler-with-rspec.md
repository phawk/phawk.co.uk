---
layout: post
title: 'Real code: Testing a web crawler with RSpec'
category_id: building_void
tags: Ruby, Testing
date: "2017-10-17T22:00:00.000Z"
archived: true
---

This is another post coming out of working on my [side project Void](/apps). You often see articles teaching testing or TDD on an example topic (I’ve written [many](/blog/tiny-testing/) [in](/blog/testing-sinatra-apis/) [the](/blog/testing-node-apps-with-mocha/) [past](/blog/testing-backbone-with-mocha/)), so I thought it was time to start writing about real world testing, with real code.

### Web crawler feature specification

In Void when a user bookmarks a page or adds it to their reading list it needs to crawl the URL and fetch information about the web page, such as it's title and a short description.

In the future I plan to fetch images and media using the pages open graph tags and some machine learning algorithms, but that’s for another day, I haven’t implemented any of that yet.

### Architecture thoughts

When building this feature I wanted it to be a PORO (plain old ruby object), I didn’t want this critical piece of business logic to be coupled to the Rails framework. I named the object `Crawler` and placed it under the `Void` namespace to ensure it doesn’t collide with other libraries that I may use in the future.

```ruby
# lib/void/crawler.rb
module Void
  class Crawler
    attr_reader :web_page

    def initialize(web_page)
      @web_page = web_page
    end

    def start
    end
  end
end
```

For brevity I’ve skipped some of the finer grained TDD dance. As you can see the `Crawler` takes a web_page as it’s only argument and has a method called `#start`, let’s go ahead and see how this is tested.

### Fast specs

```ruby
# spec/lib/void/crawler_spec.rb
require 'spec_helper'
require 'void/crawler'

describe Void::Crawler do
  describe "#start" do
    context "when the URL responds successfully" do
      it "crawls websites" do
      end
    end
  end
end
```

The first thing you’ll notice is I included `spec_helper` instead of `rails_helper`, this allows the tests to run without loading the Rails environment and speeds things up considerably (if this interests you, I urge you to [checkout destroy all software](https://www.destroyallsoftware.com/screencasts)).

### VCR

I use [VCR](https://github.com/vcr/vcr) to record and replay network requests in my tests. VCR allows you to ‘cache’ a request in your test and store the result on disk (I also commit them to git), this removes flaky network dependent tests but you can also delete your VCR cassettes (the saved requests) and when you re-run your tests they’ll be running against the real network again. This allows you to verify every so often that your tests working in real world scenarios.

To setup VCR I have added the following gems and created a vcr_helper

```ruby
# Gemfile
gem 'vcr', require: false, group :test
gem 'webmock', group :test
```

```ruby
# spec/vcr_helper.rb
require 'vcr'
require 'webmock'
require 'dotenv'

# Load environment variables from .env file
Dotenv.load

VCR.configure do |c|
  # Store cassettes in the following directory (I check these into source control)
  c.cassette_library_dir = 'spec/fixtures/vcr_cassettes'
  c.hook_into :webmock
  # This allows you to filter out sensitive data from being
  # stored in VCRs cassettes and thus your git repo
  c.filter_sensitive_data("AWS_ACCESS_KEY_ID") { ENV.fetch("AWS_ACCESS_KEY_ID") }
  c.filter_sensitive_data("AWS_SECRET_ACCESS_KEY") { ENV.fetch("AWS_SECRET_ACCESS_KEY") }
end
```

With VCR setup you can make use of it in your tests, don't forgot to require the vcr_helper. Anything inside the **VCR.use_cassette** block will be recorded to a cassette with the name provided. The second time you run this spec it will use the recorded version instead of hitting the real network. N.B. you sometimes end up saving a cassette with the wrong requests if your doing TDD, during the initial development of a feature you may need to remove the cassette several times or wait until after the test is more fully formed before wrapping in a **VCR.use_cassette** block.

```ruby
require 'spec_helper'
require 'vcr_helper'
require 'void/crawler'

describe Void::Crawler do
  describe "#start" do
    context "when the URL responds successfully" do
      it "crawls websites" do
        VCR.use_cassette :crawl_pooreffort do
          # Any requests made here will be recorded
        end
      end
    end
  end
end
```

### Stub web page

The `Void::Crawler` takes a `web_page` as its only argument, in Void I knew I wanted this to be an ActiveRecord Model, however for the purpose of this test the business logic doesn’t care about models, so I’m using an **OpenStruct** as a [stub](https://github.com/testdouble/contributing-tests/wiki/Stub). In the happy path the crawler only requires the URL of the web page, so I’ve only implemented a URL method.

```ruby
web_page = OpenStruct.new(
  url: "https://pooreffort.com/blog/postgresql-uuid-primary-keys-in-rails-5/"
)
```

### Test the public API

When testing I like to be able to refactor the internals of a feature and know it still works, this is why my tests for the Crawler only touch the public API of the object under test and are fairly simple.

```ruby
require 'spec_helper'
require 'vcr_helper'
require 'active_support/core_ext/string'
require 'void/crawler'
require 'ostruct'

describe Void::Crawler do
  describe "#start" do
    context "when the URL responds successfully" do
      it "crawls websites" do
        VCR.use_cassette :crawl_pooreffort do
          web_page = OpenStruct.new(
            url: "https://pooreffort.com/blog/postgresql-uuid-primary-keys-in-rails-5/"
          )

          Void::Crawler.new(web_page).start

          expect(web_page.title).to eq("PostgreSQL UUID primary keys in Rails 5 | poor effort")
          expect(web_page.description).to eq("In a recent project I have been using UUIDs as the primary key type with Rails 5 and PostgreSQL. This can be useful if your objects IDs are publicly exposed and you want to disguise the fact that they are a sequence, or how early on in the sequence they might be ;-)")
        end
      end
    end
  end
end
```

Running this test you’ll see the failure

```text
    expected: "PostgreSQL UUID primary keys in Rails 5 | poor effort"
         got: nil
```

![First failure](/images/articles/testing-a-web-crawler-with-rspec/first-failure.png)

## Parsing HTML titles

To solve the first test I knew I wanted to read the HTML `<title>` tag and may want to make this title parsing smarter in the future so I decided to split out a `Void::HtmlTitle` object and spec for this purpose, again for brevity I’ll skip the TDD dance and just show **HtmlTitle**’s spec and implementation.

```ruby
# spec/lib/void/html_title_spec.rb
require 'spec_helper'
require 'active_support/all'
require 'void/html_title'

describe Void::HtmlTitle do
  describe "when html source has a title tag" do
    # Take note: in the test below I don’t need to provide an entire HTML file
    # or do a network request, I can just provide a simple string fixture
    let(:html) { '<title>pooreffort.com // unreal post</title>' }

    it "finds a useful description" do
      title = Void::HtmlTitle.new(html).title
      expect(title).to eq("pooreffort.com // unreal post")
    end
  end

  describe "when html source has no title tag" do
    let(:html) { '' }

    it "has no title" do
      expect(Void::HtmlTitle.new(html).title).to be_nil
    end
  end
end
```

The spec above is pretty straightforward and the solution adheres to the single responsibility principle nicely too, it’s only job is to look through a string of HTML and return the title.

```ruby
module Void
  class HtmlTitle
    attr_reader :html
    def initialize(html)
      @html = html
    end

    def title
      html.match(/\<title\>([^<]+)/i)&.captures&.first
    end
  end
end
```

I was now able to move back to the Crawler and implement the first part of the crawling, fetching the title from the HTML, which also requires doing an HTTP request to get the HTML, for simple network requests I’m currently using the [HTTP gem](https://github.com/httprb/http) as I really like it’s straightforward API 👌

```ruby
require 'void/html_title'
require 'http'

module Void
  class Crawler
    attr_reader :web_page

    def initialize(web_page)
      @web_page = web_page
    end

    def start
      response = HTTP.get(web_page.url)

      title = Void::HtmlTitle.new(response.body.to_s).title

      # Since the object passed in is an OpenStruct/ActiveRecord Model
      # I settled with using attr writers to set the new properties
      web_page.title = title
    end
  end
end
```

This shows implementing the `Void::HtmlTitle` object, I’ve also got a `Void::HtmlDescription` object that attempts to read a meta description, failing that dropping back to the first paragraph on the page, but due to the length of this article I’m not going to cover that in depth.

## Dealing with failures

I started this feature with the happy path, I know there are lots of ways this code could fail but for my first implementation I just covered two:

1. Bad HTTP status codes – I didn’t want to store server error text if the site being crawled happens to 500 error when Void is crawling it.
2. SSL and general HTTP connection issues

I also wanted a way of tracking these errors so I could store the failures and stop attempting to crawl a site after N amount of failures.

Here’s a snippet of those sad path specs I came up with:

```ruby
context "when the URL is unavailable" do
  it "outputs errors" do
    VCR.use_cassette :crawl_unknown_dns do
      web_page = OpenStruct.new(
        url: "http://somebadsitename.dev",
        failed_crawls: []
      )

      Void::Crawler.new(web_page).start

      expect(web_page.title).to be_nil
      expect(web_page.failed_crawls.last).to match(/503/)
    end
  end
end

context "when the URL has connection errors" do
  it "outputs errors" do
    VCR.use_cassette :crawl_bad_ssl do
      web_page = OpenStruct.new(
        url: "https://somebadsitename.dev",
        failed_crawls: []
      )

      Void::Crawler.new(web_page).start

      expect(web_page.title).to be_nil
      expect(web_page.failed_crawls.last).to match(/HTTP::ConnectionError/)
      expect(web_page.failed_crawls.last).to match(/connection refused/i)
    end
  end
end
```

With the above failing specs I was able to take steps to make the Crawler more robust.

```ruby
require 'void/html_description'
require 'void/html_title'
require 'http'

module Void
  class Crawler
    attr_reader :web_page

    def initialize(web_page)
      @web_page = web_page
    end

    def start
      response = HTTP.get(web_page.url)

      if response.status.to_i > 302
        web_page.failed_crawls << "#{Time.now.to_i} crawl failed status code #{response.status}"
      else
        title = Void::HtmlTitle.new(response.body.to_s).title
        description = Void::HtmlDescription.new(response.body.to_s).description
        text_content = Void::HtmlDescription.new(response.body.to_s).page_content

        web_page.title = title
        web_page.description = description
        web_page.text_content = text_content
        web_page.status = "crawled"
        web_page.last_crawled_at = Time.now
      end
    rescue OpenSSL::SSL::SSLError, HTTP::ConnectionError => e
      web_page.failed_crawls << "#{e.class.name} - #{e.message}"
    end
  end
end
```

There are a couple of improvements here:

1. If the HTTP status code is in the 400-500 range a message is added to the failed_crawls array.
2. If there is an `HTTP::ConnectionError` or SSL error, rescue it and add a message to the failed_crawls array.

## Piecing this together with ActiveJob

Each time a new bookmark is created I queue a `WebPageCrawlJob` in Sidekiq that runs the Crawler, only instead of passing in an OpenStruct, I pass in the WebPage ActiveRecord Model and save it after the crawl has completed.

```ruby
require 'void/crawler'

class WebPageCrawlJob < ApplicationJob
  queue_as :default

  def perform(web_page)
    Void::Crawler.new(web_page).start

    web_page.save

    # This data is denormalized out to each
    # bookmark for performance reasons
    web_page.bookmarks.update_all(
      title: web_page.title,
      description: web_page.description,
      text_content: web_page.text_content,
      processed_at: Time.zone.now
    )
  end
end
```

This ties together Void and the Crawler object, for good measure I have a high level test for this background job. It’s using [FactoryGirl](https://github.com/thoughtbot/factory_girl_rails) and persisting to the database, this might seem like overkill but it really helps give me confidence and peace of mind in my code.

```ruby
require 'rails_helper'
require 'vcr_helper'

RSpec.describe WebPageCrawlJob, type: :job do
  let!(:user) { create(:user) }
  let!(:web_page) { create(:web_page, url: "http://guides.rubyonrails.org/active_record_postgresql.html#array") }
  let!(:bookmark) { create(:bookmark, user: user, web_page: web_page) }

  it "extracts data from the URL" do
    VCR.use_cassette :crawl_rails_guides do
      subject.perform(web_page)
      web_page.reload
      bookmark.reload

      expect(web_page.title).to eq("Active Record and PostgreSQL — Ruby on Rails Guides")
      expect(web_page.description).to eq("This guide covers PostgreSQL specific usage of Active Record.")
      expect(web_page.text_content).to include("PostgreSQL")
      expect(web_page.text_content).to include("Active Record")

      expect(bookmark.title).to eq("Active Record and PostgreSQL — Ruby on Rails Guides")
      expect(bookmark.description).to eq("This guide covers PostgreSQL specific usage of Active Record.")
      expect(bookmark.text_content).to include("PostgreSQL")
    end
  end
end

```

As you can see in this instance I am only testing the happy path to make sure everything is integrated together. I have tests for the sad path in the `Void::Crawler` itself, no need to repeat them here.

## Conclusion

Testing features that call out to third party services or use the network are easily tested using [VCR](https://github.com/vcr/vcr).

Getting business logic like this under test gives me great confidence when deploying updates to Void. I can also easily write regression tests if the crawler has bugs in production, these allow me to be certain that issues are fixed and never occur again.

Do let me know in the comments if you’ve found this useful and would like more real world testing posts. If you want kept up to date with my progress on Void, please subscribe to my mailing list below ✌️
