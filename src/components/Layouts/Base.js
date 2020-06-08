import "../../styles/app.css"
import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

import Logo from "../Logo"

const BaseLayout = ({ children }) => {
  return (
    <>
      <div className="max-w-screen-md mx-auto px-6 font-body">
        <div className="py-8 lg:py-12 flex items-center">
          <Link to="/" className="mr-10">
            <Logo />
          </Link>
          <span className="hidden lg:block lg:flex-1"></span>
          <Link
            to="/blog/"
            className="mr-5 lg:mr-8 font-normal text-gray-700 hover:text-gray-800 text-lg"
          >
            Blog
          </Link>
          <Link
            to="/projects/"
            className="mr-5 lg:mr-8 font-normal text-gray-700 hover:text-gray-800 text-lg"
          >
            Projects
          </Link>
          <Link
            to="/about/"
            className="font-normal text-gray-700 hover:text-gray-800 text-lg"
          >
            About
          </Link>
        </div>
        <main className="text-gray-700 text-lg pb-16">{children}</main>
      </div>
      <div className="border-t border-gray-200">
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
            href="https://twitter.com/peteyhawkins"
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
