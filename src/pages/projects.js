import React from "react"

import Layout from "../components/Layouts/Base"
import SEO from "../components/seo"
import PageTitle from "../components/PageTitle"

import payhereIcon from "../images/payhere-icon.svg"

const ProjectsPage = () => (
  <Layout>
    <SEO title="Projects" />
    <PageTitle>Projects</PageTitle>

    <div className="mt-16">
      <a
        href="https://payhere.co"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col md:flex-row md:items-center border border-gray-300 hover:border-gray-400 rounded-lg mb-6 px-4 py-3 shadow-sm"
      >
        <img
          src={payhereIcon}
          alt="Payhere"
          className="w-10 h-10 object-contain mb-4 md:mb-0 md:mr-4"
        />
        <div>
          <h3 className="font-semibold text-gray-900 text-lg group-hover:underline">
            Payhere
          </h3>
          <p className="text-base leading-snug">
            Helps you modernize your business payments with easy subscriptions
            and instalment plans, all in a simple payment link.
          </p>
        </div>
      </a>
    </div>
  </Layout>
)

export default ProjectsPage
