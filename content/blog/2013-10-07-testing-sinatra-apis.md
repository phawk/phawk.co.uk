---
layout: post
title: 'Testing sinatra APIs'
tags: Testing, Ruby
category_id: testing
date: "2013-10-07T22:00:00.000Z"
---

[Sinatra](http://www.sinatrarb.com/) is often a great choice for writing restful web services. I want to show you what I have found beneficial when testing APIs and how to do it with sinatra and [minitest](http://docs.seattlerb.org/minitest/).

## Different types of tests

There are a couple of different types of tests you could write, I am only going to show you two of these types and give a little specific information on how they fit into testing APIs.

### Acceptance/Story tests

Acceptance tests are end to end, they test that the system as a whole works, rather than testing small isolated components. These are often found to be quite expensive to write and maintain for conventional HTML based web applications, due to constantly changing user interfaces.

However, when writing a restful web service you have a consistent and easily parsable data source. Like most, you are hopefully using JSON as that data type. Each endpoint is atomic and often won't change at the same rate as a standard HTML web application.

For an API, acceptance tests are much less expensive than in a conventional application, and will be the main basis for the tests we will be writing.

These tests will call endpoints directly and assert the JSON responses match up with what we expect. These are high level tests and will by proxy cover all of our application code, providing the most value for the time it costs to write, and allowing complete refactoring of the internal architecture.

### Unit tests

Unit tests are small isolated tests, usually testing 1 method at a time, and asserting at a micro level that objects are behaving as per their design.

When practising test-driven development, unit tests are key to driving the design of your code. To me, unit tests have proven very valuable when designing complex algorithms and objects, but when dealing with simple CRUD objects from ORMs like ActiveRecord or DataMapper, they are often uneccessary if you already have an acceptance test in place.

## Test setup

I've created a [barebones application structure](https://github.com/phawk/sinatra-minitest) and made it available on github, but will continue to go through the setup here for any of you that have pre-existing sinatra applications, and to describe a little more about what's going on.

### Dependencies

First up you'll need to add a few gems to your Gemfile:

```ruby
gem 'multi_json'

group :test do
  gem "rack-test", "~> 0.6.1"
  gem 'mocha', '~> 0.14.0', require: false
end
```

Now that you have the required libraries (don't forget to `bundle install`) we can move on to setting up our testing structure, for this example I'm going to use `minitest::spec`, but you can easily substitute this out for `minitest::unit`.

### spec_helper

You'll want to create a `spec/` folder in the root of your application to house all of your tests and helpers.

```ruby
#spec/spec_helper.rb

# Set the rack environment to `test`
ENV["RACK_ENV"] = "test"

# Pull in all of the gems including those in the `test` group
require 'bundler'
Bundler.require :default, :test

# Require test libraries
require 'minitest/autorun'
require 'minitest/pride'
require 'minitest/spec'
require 'mocha/setup'

# Load the sinatra app
require_relative '../app'

# Load the unit helpers
require_relative "support/unit_helpers.rb"

# Create a custom class inheriting from minitest::spec for your unit tests
class UnitTest < MiniTest::Spec
  include UnitHelpers

  # Any test that ends with 'Unit|Spec|Model' is a `UnitTest`
  register_spec_type(/(Unit|Spec|Model)$/, self)

  # Any test that is a class rather than a string is also a `UnitTest`
  register_spec_type(self) do |desc|
    true if desc.is_a?(Class)
  end
end
```

Once you have the spec_helper setup, you will want to create another file for any helpers you will need for writing unit tests:

```ruby
# spec/support/unit_helpers.rb

module UnitHelpers
  # Helpers
end
```

Now we can go ahead and define our story_helper for writing acceptance tests

```ruby
# spec/story_helper.rb

require_relative "spec_helper"
require_relative "support/story_helpers.rb"

require 'rack/test'

class StoryTest < UnitTest
  include Rack::Test::Methods
  include StoryHelpers

  register_spec_type(/Story$/, self)

  def app
    Api::Base
  end
end
```

And similarly we want to pull in helpers for story tests, we'll add a few helper methods for parsing and requesting API endpoints with JSON.

```ruby
# spec/support/story_helpers.rb

module StoryHelpers

  # Request helpers

  def get_json(path)
    get path
    json_parse(last_response.body)
  end

  def post_json(url, data)
    post(url, json(data), { "CONTENT_TYPE" => "application/json" })
    json_parse(last_response.body)
  end

  # JSON helpers

  def json_parse(body)
    MultiJson.load(body, symbolize_keys: true)
  end

  def json(hash)
    MultiJson.dump(hash, pretty: true)
  end

end
```

We also need a rake task for running all of the specs at once

```ruby
# Rakefile

task :default => :test

desc "Run all tests"
task(:test) do
  Dir['./spec/**/*_spec.rb'].each { |f| load f }
end
```

## Writing tests

Lets start off with a basic acceptance test, we want an API endpoint that returns users.

```ruby
# spec/stories/api/v1/users_spec.rb

# Pull in the story helper for all the test functionality we need
require_relative "../../../story_helper.rb"

# Notice the spec name ending in `Story` this is important, it lets minitest know we want this test to be a `StoryTest`
describe "Api::v1::UsersStory" do
  describe "GET /users" do
    before do
      # using the rack::test:methods, call into the sinatra app and request the following url
      get "/api/v1/users"
    end

    it "responds successfully" do
      # Ensure the request we just made gives us a 200 status code
      last_response.status.must_equal 200
    end
  end
end
```

Running this test will give us the following failure:

```sh
FAIL Api::v1::UsersStory#test_0001_responds successfully (0.01s)
  Expected: 200
    Actual: 404
  (eval):8:in `must_equal'
  /Users/pete/Sites/sinatra-minitest/spec/stories/api/v1/users_spec.rb:9:in `block (2 levels) in <top (required)>'
```

We haven't yet implemented a route for `api/v1/users` so sinatra is serving us up a 404 error, fix that by adding a sinatra route for `/api/v1/users` in **app.rb**

```ruby
# add this route to your sinatra app
namespace '/api/v1' do
  get '/users' do
  end
end
```

You should now see the test passing, let's continue to iterate and make another more comprehensive test.

```ruby
# spec/stories/api/v1/users_spec.rb
require_relative "../../../story_helper.rb"

describe "Api::v1::UsersStory" do
  describe "GET /users" do
    before { get "/api/v1/users" }
    let(:json) { json_parse(last_response.body) }
    let(:users) { json[:users] }

    it "responds successfully" do
      last_response.status.must_equal 200
      json[:status].must_equal "success"
    end

    it "returns 3 users" do
      users.size.must_equal 3
    end
  end
end
```

You'll see both tests failing agian, as our `/api/v1/users` route doesn't return anything yet. We can update our users route to pass the tests, usually we'd read from our database, but for now let's solve this with static data.

```ruby
# app.rb

get '/users' do
  users = ["bob", "andy", "john"]
  json({ status: "success", users: users })
end
```

Once we have these three users being returned our test is passing again and we can move on. Add a new test to the *spec/stories/api/v1/users_spec.rb* file.

```ruby
# spec/stories/api/v1/users_spec.rb
describe "POST /users" do
  before do
    post_json("/api/v1/users", {
      user: {
        name: "bob",
        email: "bob@test.com"
      }
    })
  end

  let(:resp) { json_parse(last_response.body) }

  it { resp[:status].must_equal "success" }
  it { resp[:user][:name].must_equal "bob" }
  it { resp[:user][:email].must_equal "bob@test.com" }
end
```

Normally our API would persist this data, but we'll just assert that it responds back with the same user object as we passed in for now. Run your tests again, and let's add the code to make them pass.

```ruby
# app.rb

post '/users' do
  # use a helper to parse the JSON request body
  user = parsed_params[:user]

  # Respond back with the same user posted in
  json({ status: "success", user: user })
end
```

## Conclusion

We started out writing tests based on the end data we wanted the API to respond with, this got us thinking about the top down design of our API endpoints.

Now when we choose to attach a database we can do so with ease, while also still having a test suite to run to ensure our API still works as expected from the outside.

You also have options for adding unit tests alongside these **stories**, and I would encourage you to do that for anything sufficiently complex. For the most part the APIs I have been working on have been reasonably small and not overly complicated, and this approach is working well for me so far.

*Feel free to leave any thoughts or questions below*
