---
layout: post
title: Search by proximity using PostGIS and Rails
tags: Rails, PostGIS
date: "2015-11-11T22:00:00.000Z"
archived: true
---

Searching proximity to a location is a task we have done before in a traditional database with some complex trigonometry algorithms. As we’re always seeking to keep our code as clean and efficient as possible we wanted try out [PostGIS](http://postgis.net/), an addon for the open source PostgreSQL database we use on almost every app we’ve built.

PostGIS is a spatial and geographic database which can store everything from simple lat/long points to complex polygons and even 3 dimensional objects. For this article we’ll only be looking at 2D geographic points.

## About the prototype

We decided to build a basic app showcasing this functionality by scraping developer meetups from the meetup.com API (~11,000 as of writing). A user could perform a search by city name and we will search our PostGIS database for meetups in 50km of that City and display them.

**You can see a [live demo here](http://meetups.phawk.co.uk/) or the [source code](https://github.com/phawk/meetups-map)**

![meetups prototype](/images/articles/postgis/meetups-map.png)

## Integrating with Rails

PostGIS was reasonably straightforward to integrate with Rails, assuming you have PostGIS available (if you use a mac postgresapp.com comes prepackaged with PostGIS support).

Make sure your created database has the postgis extension

```sh
psql your_db_name -c 'create extension postgis;'
```

Add some helpful gems and `bundle install`

```ruby
gem 'activerecord-postgis-adapter'
gem 'geocoder'
```

And alter your **database.yml** file to use the `postgis` adapter

```yaml
development:
  adapter: postgis
  postgis_extension: true
  encoding: unicode
  database: your_database_name
```

Also if you’re using the `DATABASE_URL` environment variable in production just change the scheme from `postgres://` to `postgis://`.

Thats all the setup required other than creating your database columns to store point based data see the sample migration below.

```rb
class CreateMeetups &lt; ActiveRecord::Migration
  def change
    create_table :meetups do |t|
      t.string :name
      # ...
      t.st_point :coords, geographic: true # ST_Point is added by the activerecord-postgis-adapter gem along with several other types for lines and polygons etc

      t.timestamps null: false
    end

    add_index :meetups, :coords, using: :gist
  end
end
```

## Quering nearby points

There are several PostGIS SQL functions provided that allow you to query different spatial things, for now the only function we’ll look at is `ST_DWithin` which allows us to query meetups within certain number of metres of another point (the city centre).

We have defined a **nearby** class method on the **Meetup** model:

```ruby
class Meetup &lt; ActiveRecord::Base
  def self.nearby(latitude, longitude, distance: 5000)
    where("ST_DWithin(meetups.coords, ST_GeographyFromText('SRID=4326;POINT(:lon :lat)'), :distance)", lon: longitude, lat: latitude, distance: distance)
  end
end
```

## Geocoding with google maps JS API

We can find the latitude and longitude of a given search term using the google maps API:

```js
// Create a geocoder
var geocoder = new google.maps.Geocoder(),
    searchLocation = $("location").val();

geocoder.geocode({ 'address': searchLocation }, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    var location = results[0].geometry.location;
    // location.lat + location.lng coordinates :)
  }
});
```

This gives us all the building blocks we need to search by location and display results in whatever format we want, even a map.

## Takeaways

The [resulting app](http://meetups.phawk.co.uk/) is quite basic but touches on key features of location based search and geocoding.

I’ve found PostGIS to be quite straightforward to setup and use in this basic form. And you get the benefits of keeping your application code simpler and better performance as database indexes can be used. I’ve only touched on the basics of PostGIS but if your core business is location based you should probably start with the right tool for the right job rather than complex and innefficient application code.

All the source code is [available on GitHub](https://github.com/phawk/meetups-map)
