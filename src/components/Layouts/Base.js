import "../../styles/app.css"
import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"

import Logo from "../Logo"

const BaseLayout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteMetaQuery {
      site {
        siteMetadata {
          title
          mailchimpURL
          social {
            twitter
          }
        }
      }
    }
  `)
  return (
    <>
      <div className="border-b border-gray-300 flex items-stretch justify-between">
        <div className="p-4 sm:px-6 lg:px-8 flex-1 flex items-center">
          <Link to="/" className="mr-6 lg:mr-8">
            <Logo
              className="h-6 w-6 text-teal-500"
              title={data.site.siteMetadata.title}
            />
          </Link>
          <Link
            to="/blog/"
            className="mr-5 lg:mr-8 font-medium text-gray-700 hover:text-gray-800 text-base"
          >
            Blog
          </Link>
          {/*<Link
            to="/projects/"
            className="mr-5 lg:mr-8 font-medium text-gray-700 hover:text-gray-800 text-base"
          >
            Projects
          </Link>*/}
          <Link
            to="/about/"
            className="font-medium text-gray-700 hover:text-gray-800 text-base"
          >
            About
          </Link>
        </div>
        <div className="hidden sm:flex border-l border-gray-300 p-3 px-4">
          <a
            href={data.site.siteMetadata.mailchimpURL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-600 flex items-center hover:bg-gray-700 px-2 font-medium rounded text-white"
          >
            Subscribe
          </a>
          <a
            href={`https://twitter.com/${data.site.siteMetadata.social.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="self-stretch ml-2 flex items-center px-2 lg:px-3 text-gray-600 hover:text-gray-700"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div className="max-w-screen-md mx-auto px-6 font-body pt-10 lg:pt-12 pb-10 lg:pb-16">
        <main className="text-gray-700 text-lg">{children}</main>
      </div>
      <div className="border-t border-gray-300">
        <div className="max-w-screen-md mx-auto px-6 font-body py-6 md:py-10 text-gray-700 md:grid md:grid-cols-2 ">
          <div className="mb-3 md:mb-0">
            <a
              href="https://app.payhere.co/phawk/buy-me-a-coffee-525b933d-24ad-4be2-b5cc-e9e3d414e4e1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Coffee goes in, code comes out{" "}
              <span role="img" aria-label="Coffee">
                ☕️
              </span>
            </a>
          </div>
          <a
            href={`https://twitter.com/${data.site.siteMetadata.social.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block md:text-right link"
          >
            Follow me on Twitter
          </a>
        </div>
      </div>
    </>
  )
}

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default BaseLayout
