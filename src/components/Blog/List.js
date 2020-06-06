import React from "react"
import { Link } from "gatsby"

const List = ({ posts, className }) => {
  return (
    <div className={className}>
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        return (
          <Link
            key={node.fields.slug}
            to={node.fields.slug}
            className="block group mb-10"
          >
            <span className="block text-xl font-medium text-gray-900 group-hover:underline">
              {title}
            </span>

            <span
              className="block text-lg"
              dangerouslySetInnerHTML={{
                __html: node.frontmatter.description || node.excerpt,
              }}
            />
            <small className="text-base text-gray-500">
              {node.frontmatter.date}
            </small>
          </Link>
        )
      })}
    </div>
  )
}

export default List
