import React from "react"

import Layout from "../components/Layouts/Base"
import SEO from "../components/seo"
import Avatar from "../components/Avatar"
import PageTitle from "../components/PageTitle"

const IndexPage = () => (
  <Layout>
    <SEO title="Learn to build blazing fast sites with Gatsby.js" />
    <div className="py-12 lg:py-16">
      <Avatar className="mb-3 w-24 h-24" />
      <PageTitle>Making things with React.</PageTitle>
      <p className="text-xl">
        I’m Pete, I like to build things on the web using React. I have been
        building complex client-side apps for over 10 years, learning a lot
        along the way. Hopefully you can find some helpful resources here.
      </p>
    </div>
  </Layout>
)

export default IndexPage
