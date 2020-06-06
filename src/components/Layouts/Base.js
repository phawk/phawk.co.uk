import "../../styles/app.css"
import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Logo from "../Logo"

const BaseLayout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className="max-w-screen-md mx-auto px-6 font-body">
      <div className="py-8 lg:py-12 flex items-center">
        <Link to="/" className="mr-10">
          <Logo />
        </Link>
        <span className="hidden lg:block lg:flex-1"></span>
        <Link
          to="/blog/"
          className="mr-5 lg:mr-8 font-semibold text-gray-700 hover:text-gray-800 text-lg"
        >
          Blog
        </Link>
        <Link
          to="/apps/"
          className="mr-5 lg:mr-8 font-semibold text-gray-700 hover:text-gray-800 text-lg"
        >
          Apps
        </Link>
        <Link
          to="/about/"
          className="font-semibold text-gray-700 hover:text-gray-800 text-lg"
        >
          About
        </Link>
      </div>
      <main className="text-gray-700 text-lg pb-16">{children}</main>
    </div>
  )
}

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default BaseLayout
