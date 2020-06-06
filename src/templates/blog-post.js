import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/Layouts/Base"
import SEO from "../components/seo"
import PageTitle from "../components/PageTitle"
import Avatar from "../components/Avatar"

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMM Do, YYYY")
        description
        img
        caption
      }
    }
  }
`

const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark
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
            <span>Pete posted on {post.frontmatter.date}</span>
          </div>
        </header>
        {post.frontmatter.img && (
          <figure>
            <img
              src={post.frontmatter.img}
              alt={post.frontmatter.caption || post.frontmatter.title}
            />
            {post.frontmatter.caption && (
              <figcaption>{post.frontmatter.caption}</figcaption>
            )}
          </figure>
        )}
        <section
          className="styled-text"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
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
