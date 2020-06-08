import React from "react"
import "vertical-timeline-component-for-react/dist/Timeline.css"
import "vertical-timeline-component-for-react/dist/TimelineItem.css"
import { Timeline, TimelineItem } from "vertical-timeline-component-for-react"

import altLogo from "../images/altlabs.svg"
import payhereLogo from "../images/payhere-icon.svg"
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

    <Timeline lineColor={"#edf2f7"}>
      <TimelineItem
        key="001"
        dateComponent={<div className="text-gray-600 ml-10 md:ml-0">2005</div>}
        style={{ color: "#38b2ac" }}
      >
        <p className="mb-4 text-gray-600">
          I started my professional career as a UI developer/designer, helping
          to design, build and ship products and services on the web.
        </p>
        <p className="mb-4 text-gray-600">
          I worked for various agencies and startups such as{" "}
          <a
            href="http://typecast.com"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Typecast
          </a>
          ,{" "}
          <a
            href="http://craftydevil.co.uk"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Crafty Devil
          </a>{" "}
          and{" "}
          <a
            href="http://propertypal.com"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            PropertyPal
          </a>
          .
        </p>
      </TimelineItem>

      <TimelineItem
        key="002"
        dateComponent={<div className="text-gray-600 ml-10 md:ml-0">2014</div>}
        style={{ color: "#38b2ac" }}
      >
        <img src={altLogo} alt="Alt Labs" className="w-16 mb-5" />
        <p className="mb-4 text-gray-600">
          I founded{" "}
          <a
            href="https://alternatelabs.co"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alt Labs
          </a>{" "}
          in late 2014 – a small software agency that builds ambitious
          applications on web &amp; mobile.
        </p>
        <p className="mb-4 text-gray-600">
          We care deeply about UX, code-quality, and launching{" "}
          <span role="img" aria-label="Launch">
            🚀
          </span>{" "}
          and can help and guide companies through the entire process.
        </p>
      </TimelineItem>

      <TimelineItem
        key="003"
        dateComponent={<div className="text-gray-600 ml-10 md:ml-0">2018</div>}
        style={{ color: "#38b2ac" }}
      >
        <img src={payhereLogo} alt="Payhere" className="w-10 mb-5" />
        <p className="mb-4 text-gray-600">
          <a
            href="https://payhere.co"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Payhere
          </a>{" "}
          was born out of Alt Labs from continously building payment
          integrations and seeking to build a simpler solution. In Jan 2018 we
          launched with test customers and refined the product.
        </p>
        <p className="mb-4 text-gray-600">
          One year later, we joined{" "}
          <a
            href="https://igniteni.com/"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ignite Propel
          </a>{" "}
          and publicly launched gaining over 200 customers in the weeks to
          follow.
        </p>
        <p className="mb-4 text-gray-600">
          Our{" "}
          <a
            href="https://www.producthunt.com/posts/payhere"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Product Hunt launch
          </a>{" "}
          was awesome and we came in #4 for the day.
        </p>
      </TimelineItem>

      <TimelineItem
        key="004"
        dateComponent={<div className="text-gray-600 ml-10 md:ml-0">2020</div>}
        style={{ color: "#38b2ac" }}
      >
        <h3 className="mb-3 font-semibold text-gray-900">
          Alt is a Product House
        </h3>
        <p className="mb-4 text-gray-600">
          In early March we made the decision to stop client projects and focus
          solely on growing our own digital products.
        </p>
        <p className="mb-4 text-gray-600">
          Alt Labs will live on as a product house, essentially a holding
          company for all the products we launch.
        </p>
        <p className="mb-4 text-gray-600">
          At the same time we started the{" "}
          <a
            href="https://igniteni.com/"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ignite Accelerator
          </a>{" "}
          with Payhere, continuing to market the product.
        </p>
      </TimelineItem>
    </Timeline>
  </Layout>
)

export default AboutPage
