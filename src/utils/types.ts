import { FixedObject, FluidObject } from "gatsby-image"

export type GatsbyFixedImage = {
  childImageSharp: {
    fixed: FixedObject
  }
}

export type GatsbyFluidImage = {
  childImageSharp: {
    fluid: FluidObject
  }
}

export type BlogPost = {
  excerpt: string
  body?: string
  fields: {
    slug: string
  }
  frontmatter: {
    date: string
    title: string
    description?: string
    category?: string
    indexImage?: GatsbyFluidImage
    caption?: string
  }
}

export type BlogPostData = {
  node: BlogPost
}
