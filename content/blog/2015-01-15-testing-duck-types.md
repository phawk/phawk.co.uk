---
layout: post
title: 'Testing duck types'
tags: Ruby, Testing
category_id: testing
date: "2015-01-15T22:00:00.000Z"
---

I just finished reading [Practical Object-Oriented Design in Ruby](http://www.poodr.com/) and I wanted to share one of the cool things I got from the last chapter on testing duck types.

This is something that has bitten me during testing previously. It comes into play when using a test double to simulate a duck type, what happens when you update the real interface and your tests don’t fail?

### Example problem

From the book we have a Gear object that depends on a concrete Wheel object. This wheel doesn’t need to be an instance of Wheel and the only thing Gear depends on is an object that can recieve the `diameter` message.

### Original Gear Test

```ruby
require 'test_helper'
require 'gear'

class DiameterizableDouble
  def diameter
    31
  end
end

class GearTest < MiniTest::Test
  def setup
    @gear = Gear.new(chainring: 52, cog: 11, wheel: DiameterizableDouble.new)
  end

  def test_ratio
    assert_in_delta 4.72, @gear.ratio, 0.01
  end

  def test_gear_inches
    assert_in_delta 146.54, @gear.gear_inches, 0.01
  end
end
```

We could just use the real Wheel object in place of the stub, but let’s say we also use gears for machinery and it is a true duck type.

### Testing Wheel confirms to the Diameterizable interface

I’m going to skip to the part where we make a module that can be shared across tests, it will look something like this:

```ruby
module Diameterizable
  def test_responds_to_diameter
    assert_respond_to @object, :diameter
  end
end
```

Then we include this into our `wheel_test.rb`:

```ruby
require 'test_helper'
require 'wheel'

class WheelTest < MiniTest::Test
  include Diameterizable

  def setup
    @wheel = @object = Wheel.new(rim: 29, tyre: 1)
  end

  def test_diameter
    assert_equal @wheel.diameter, 31
  end
end
```

This is great we now have a reusable test we can apply to all of our duck types and if we change the interface tests will fail in nearly all the right places.

### Testing the test double

The one place tests won’t fail currently is `gear_test.rb`, the test double we are using should be a type of Diameterizable, but there are no tests to verify this. Let’s adjust `gear_test.rb` to fix this.

```ruby
require 'test_helper'
require 'gear'

class DiameterizableDouble
  def diameter
    31
  end
end

class DiameterizableDoubleTest < MiniTest::Test
  include Diameterizable

  def setup
    @object = DiameterizableDouble.new
  end
end

class GearTest < MiniTest::Test
  def setup
    @gear = Gear.new(chainring: 52, cog: 11, wheel: DiameterizableDouble.new)
  end

  def test_ratio
    assert_in_delta 4.72, @gear.ratio, 0.01
  end

  def test_gear_inches
    assert_in_delta 146.54, @gear.gear_inches, 0.01
  end
end
```

### Summary

I am now a lot happier about the coverage of the duck types and have confidence that if the interface is ever updated the right tests will fail and I won’t hit runtime errors.
