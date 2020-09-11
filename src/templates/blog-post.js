import React from "react"
import { Link, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Img from "gatsby-image"

import Layout from "../components/Layouts/Base"
import SEO from "../components/seo"
import PageTitle from "../components/PageTitle"
import Avatar from "../components/Avatar"
import Contents from "../components/Blog/Contents"
import { MDXProvider } from "@mdx-js/react"

const shortcodes = { Contents }

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        date(formatString: "MMM Do, YYYY")
        description
        caption
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
`

const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.mdx
  const { previous, next } = pageContext

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        <header className="mb-10 lg:mb-16">
          <PageTitle>{post.frontmatter.title}</PageTitle>
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-4" />
            <span>
              <a
                href="https://twitter.com/peteyhawkins"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Pete
              </a>{" "}
              posted on {post.frontmatter.date}
            </span>
          </div>
        </header>
        {post.frontmatter.indexImage && (
          <figure className="mb-10">
            <Img
              fluid={post.frontmatter.indexImage.childImageSharp.fluid}
              alt={post.frontmatter.caption || post.frontmatter.title}
            />
            {post.frontmatter.caption && (
              <figcaption className="mt-1 text-gray-600">
                {post.frontmatter.caption}
              </figcaption>
            )}
          </figure>
        )}
        <section className="styled-text">
          <MDXProvider components={shortcodes}>
            <MDXRenderer>{post.body}</MDXRenderer>
          </MDXProvider>
        </section>
      </article>

      <nav className="mt-10 lg:mt-16">
        <ul className="sm:grid sm:grid-cols-2">
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev" className="link">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li className="text-right">
            {next && (
              <Link to={next.fields.slug} rel="next" className="link">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate
