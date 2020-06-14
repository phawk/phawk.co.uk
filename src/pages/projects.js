import React from "react"

import Layout from "../components/Layouts/Base"
import SEO from "../components/seo"
import PageTitle from "../components/PageTitle"

import payhereIcon from "../images/payhere-icon-blue.svg"
import gatsbyIcon from "../images/gatsby.svg"
import voidIcon from "../images/void-o.svg"
import altIcon from "../images/altlabs.svg"
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

      <ProjectButton
        url="https://gatsbythemes.store"
        icon={gatsbyIcon}
        title="gatsbythemes.store"
        description="Beautiful, full-featured themes to kick-start your next Gatsby.js project. A collection of production ready Gatsby themes for common use-cases."
      />

      <ProjectButton
        url="https://voidapp.co"
        icon={voidIcon}
        title="Void"
        description="Void exists somewhere between Getting Things Done™ (GTD), bookmarks and read later helping you decide upon and focus on the important stuff."
      />

      <ProjectButton
        url="https://alternatelabs.co"
        icon={altIcon}
        title="Alt Labs"
        description="Alt started out as a software agency building MVPs for startups. We have transitioned into a product house, launching our own digital products."
      />
    </div>
  </Layout>
)

export default ProjectsPage
