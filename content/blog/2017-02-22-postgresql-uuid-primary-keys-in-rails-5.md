---
layout: post
title: PostgreSQL UUID primary keys in Rails 5
tags: PostgreSQL, Rails, Ruby
date: "2017-02-22T22:00:00.000Z"
archived: true
---

In a recent project I have been using UUIDs as the primary key type with Rails 5 and PostgreSQL. This can be useful if your objects IDs are publicly exposed and you want to disguise the fact that they are a sequence, or how early on in the sequence they might be ;-)

## How to make it happen...

First you need to enable the **uuid-ossp** extension which will generate secure v4 UUIDs in the database.

```sh
$ bin/rails g migration enable_uuid_extension
```

```ruby
class EnableUuidExtension < ActiveRecord::Migration[5.0]
  def change
    enable_extension 'uuid-ossp'
  end
end
```

Next up you want to setup a generator so that rails sets all primary key columns to be UUID by default.

```ruby
# config/initializers/generators.rb

Rails.application.config.generators do |g|
  g.orm :active_record, primary_key_type: :uuid
end
```

And that’s all you need to use UUIDs as your primary key. Thanks to [Jon McCartie](http://www.mccartie.com/2015/10/20/default-uuid's-in-rails.html).

### Foreign key references

If you get an error trying to run migrations for foreign keys make sure to set the type to `:uuid`

```ruby
# example foreign key constraint
t.references :web_page, foreign_key: true, type: :uuid
```

## Adding non primary key UUIDs

You may want to add UUID columns in other places. As long as you’re using `uuid_generate_v4()` you can use UUIDs as API keys or secure tokens for user lookup. This allows you to have postgres handle generation of these values for you, keeping your Rails app leaner.

```ruby
class AddSecureTokenToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :secure_token, :uuid, null: false, default: 'uuid_generate_v4()'
    add_index :users, :secure_token, unique: true
  end
end
```

I hope this has been useful and if you have anything to add drop a comment below.










