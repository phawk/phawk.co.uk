import React from "react"
import { Link } from "gatsby"

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

      <div className="mt-10 flex flex-col sm:flex-row sm:items-center">
        <Link
          to="/blog/"
          className="sm:mr-3 py-3 px-4 text-lg font-medium text-white bg-teal-500 border border-teal-500 rounded"
        >
          Learn Gatsby + React
        </Link>

        <Link
          to="/projects/"
          className="mt-4 sm:mt-0 py-3 px-4 text-lg font-medium text-teal-500 border border-teal-500 rounded"
        >
          See my projects
        </Link>
      </div>
    </div>
  </Layout>
)

export default IndexPage
