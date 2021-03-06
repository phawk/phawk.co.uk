import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/Layouts/Base"
import SEO from "../../components/seo"
import List from "../../components/Blog/List"
import PageTitle from "../../components/PageTitle"
import { BlogPostData } from "../../utils/types"

export const pageQuery = graphql`
  query blogListArchiveQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true }, archived: { eq: true } } }
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
            category
            indexImage {
              childImageSharp {
                fluid(maxWidth: 720) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`

type Props = {
  data: {
    allMdx: {
      edges: BlogPostData[]
    }
  }
}

const BlogArchive: React.FC<Props> = ({ data }) => {
  const posts = data.allMdx.edges

  return (
    <Layout>
      <SEO title="Blog" />
      <PageTitle>The Archive</PageTitle>
      <p className="text-xl">
        A long time ago, in a galaxy far, far away...
        <br />I used to write about Ruby, Rails and a bunch of other random
        developer related topics, you can find some of that below.
      </p>
      <List posts={posts} className="mt-10 lg:mt-16" />
    </Layout>
  )
}

export default BlogArchive
