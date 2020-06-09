import React from "react"

import Layout from "../components/Layouts/Base"
import SEO from "../components/seo"
import PageTitle from "../components/PageTitle"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <PageTitle>Whoops!</PageTitle>
    <p className="text-xl">
      You just hit a route that doesn&#39;t exist... the sadness.
    </p>
  </Layout>
)

export default NotFoundPage
