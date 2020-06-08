import React from "react"

import Layout from "../components/Layouts/Base"
import SEO from "../components/seo"
import PageTitle from "../components/PageTitle"

const AboutPage = () => (
  <Layout>
    <SEO title="About" />
    <PageTitle>A little history&hellip;</PageTitle>
    <p className="text-xl">something.</p>
  </Layout>
)

export default AboutPage
