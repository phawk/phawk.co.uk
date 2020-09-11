import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import noThumbnailImg from "../../images/no-thumbnail.png"

const List = ({ posts, className }) => {
  return (
    <div className={className}>
      <section className="text-gray-700 body-font">
        <div className="container mx-auto">
          <div className="flex flex-wrap -m-4">
            {posts.map(({ node }) => {
              const title = node.frontmatter.title || node.fields.slug
              return (
                <div className="p-4 sm:w-1/2" key={node.fields.slug}>
                  <div className="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <Link to={node.fields.slug} className="block">
                      {node.frontmatter.indexImage ? (
                        <Img
                          className="lg:h-48 md:h-36 w-full object-cover object-center"
                          fluid={
                            node.frontmatter.indexImage.childImageSharp.fluid
                          }
                          alt={title}
                        />
                      ) : (
                        <img
                          className="lg:h-48 md:h-36 w-full object-cover object-center"
                          src={noThumbnailImg}
                          alt={title}
                        />
                      )}
                    </Link>
                    <div className="p-6">
                      <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1 uppercase">
                        {node.frontmatter.category}
                      </h2>
                      <Link
                        to={node.fields.slug}
                        className="block title-font text-lg font-medium text-gray-900 mb-3"
                      >
                        {title}
                      </Link>
                      <p
                        className="leading-relaxed mb-3"
                        dangerouslySetInnerHTML={{
                          __html: node.frontmatter.description || node.excerpt,
                        }}
                      />
                      <div className="flex items-center flex-wrap ">
                        <Link
                          to={node.fields.slug}
                          className="text-teal-500 hover:text-teal-600 inline-flex items-center md:mb-2 lg:mb-0"
                        >
                          Learn More
                          <svg
                            className="w-4 h-4 ml-2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                          </svg>
                        </Link>
                        <span className="text-gray-600 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm py-1">
                          {node.frontmatter.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default List
