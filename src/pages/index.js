import React from "react"

import Layout from "../components/Layouts/Base"
import SEO from "../components/seo"
import Avatar from "../components/Avatar"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div className="mt-12 lg:mt-16">
      <Avatar className="mb-3" />
      <h1 className="mb-8 text-2xl md:text-5xl text-gray-900 font-bold leading-tight">
        All things Gatsby + React.
      </h1>
      <p className="text-xl">
        I’m Pete, I like to build things on the web using React and Gatsby. I
        have been building complex client-side apps for over 10 years, learning
        a lot along the way. Hopefully you can find some helpful resources here.
      </p>
    </div>
  </Layout>
)

export default IndexPage
