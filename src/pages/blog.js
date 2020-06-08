import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/Layouts/Base"
import SEO from "../components/seo"
import List from "../components/Blog/List"
import PageTitle from "../components/PageTitle"
import gatsbyLogo from "../images/gatsby.svg"
import reactLogo from "../images/react.svg"

const BlogIndex = ({ data }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO title="Blog" />
      <div className="mt-10 lg:mt-12 flex items-center mb-5">
        <img src={gatsbyLogo} alt="Gatsby" className="w-10 h-10" />
        <span className="text-3xl font-light mx-3 text-gray-400">+</span>
        <img src={reactLogo} alt="React" className="w-12 h-12" />
      </div>
      <PageTitle>Jamstack with Gatsby + React.</PageTitle>
      <p className="text-xl">
        The modern developer assembles the best headless APIs and brings them
        togehther on the frontend. I’m a fan of the new era of static sites and
        I like to write about my experiences building websites and digital
        products.
      </p>

      <List posts={posts} className="mt-10" />
      <div>
        <Link className="link" to="/blog/archive/">
          View full archive
        </Link>
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query blogIndexListQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true }, archived: { ne: true } } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
