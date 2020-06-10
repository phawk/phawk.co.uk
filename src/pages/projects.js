import React from "react"

import Layout from "../components/Layouts/Base"
import SEO from "../components/seo"
import PageTitle from "../components/PageTitle"

import payhereIcon from "../images/payhere-icon.svg"
import ProjectButton from "../components/ProjectButton"

const ProjectsPage = () => (
  <Layout>
    <SEO title="Projects" />
    <PageTitle>Projects</PageTitle>

    <p className="text-xl">
      I love thinking up ideas and bringing them to life. Below are some of the
      products I am working on.
    </p>

    <div className="mt-16">
      <ProjectButton
        url="https://payhere.co"
        icon={payhereIcon}
        title="Payhere"
        description="Everything a services business needs to collect online payments, so simple anyone can do it. Instalment, subscriptions and one-off payments all with a simple link."
      />
    </div>
  </Layout>
)

export default ProjectsPage
