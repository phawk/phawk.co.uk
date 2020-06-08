import React from "react"
import { Link } from "gatsby"

import Layout from "../components/Layouts/Base"
import SEO from "../components/seo"
import PageTitle from "../components/PageTitle"

const AboutPage = () => (
  <Layout>
    <SEO title="About" />
    <PageTitle>A little history&hellip;</PageTitle>
    <p className="mb-4 text-xl">
      I am a full-stack developer with more than 15 years experience building
      apps. I have worked with many teams to help deliver high-quality software
      projects using lean methodologies.
    </p>
    <p className="mb-4 text-xl">
      For the technical folk; I have spent a large portion of my career building
      well tested APIs and web apps in Ruby, and nowadays, I spend most of my
      time working with React or React Native.
    </p>
    <h3 className="text-xl mt-8 mb-3 font-semibold text-gray-900">2005</h3>
    <p className="mb-4">
      I started my professional career as a UI developer/designer, helping to
      design, build and ship products and services on the web. Previously I have
      worked at{" "}
      <a href="http://typecast.com" className="link">
        Typecast
      </a>
      ,{" "}
      <a href="http://craftydevil.co.uk" className="link">
        Crafty Devil
      </a>{" "}
      and{" "}
      <a href="http://propertypal.com" className="link">
        PropertyPal
      </a>
      .
    </p>
    <h3 className="text-xl mt-8 mb-3 font-semibold text-gray-900">
      2014 Alt Labs
    </h3>
    <p className="mb-4">
      I founded{" "}
      <a href="https://alternatelabs.co" className="link">
        Alt Labs
      </a>{" "}
      in late 2014 – a small software agency that builds ambitious applications
      on web &amp; mobile. We care deeply about UX, code-quality, and launching{" "}
      <span role="img" aria-label="Launch">
        🚀
      </span>{" "}
      and can help and guide companies through the entire process.
    </p>
    <h3 className="text-xl mt-8 mb-3 font-semibold text-gray-900">
      2018 Payhere
    </h3>
    <p className="mb-4">
      <a href="https://payhere.co" className="link">
        Payhere
      </a>{" "}
      was born out of Alt Labs from continously building payment integrations
      and seeking to build a simpler solution. In Jan 2018 we launched with test
      customers and refined the product, until Jan 2019 joining the{" "}
      <a href="https://igniteni.com/" className="link">
        Ignite Propel accelerator
      </a>{" "}
      and launching to the public in Feb 2019 gaining over 200 customers in the
      weeks to follow. Our{" "}
      <a href="https://www.producthunt.com/posts/payhere" className="link">
        Product Hunt launch
      </a>{" "}
      was awesome and we came in #4 for the day. Scott and I are continuing to
      build and grow Payhere into a sustainable, profitable business.
    </p>

    <h3 className="text-xl mt-8 mb-3 font-semibold text-gray-900">
      2020 Alt is a Product House
    </h3>
    <p className="mb-4">
      In early March we made the decision to stop client projects and focus
      solely on growing our own digital products. Alt Labs will live on as a
      product house, essentially a holding company for all the products we
      launch.
    </p>
  </Layout>
)

export default AboutPage
