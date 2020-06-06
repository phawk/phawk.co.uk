import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const Avatar = ({ className }) => {
  const data = useStaticQuery(graphql`
    query AvatarQuery {
      avatar: file(absolutePath: { regex: "/ignite-1600.jpg/" }) {
        childImageSharp {
          fluid(maxWidth: 96) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <Img
      fluid={data.avatar.childImageSharp.fluid}
      className={`rounded-full ${className}`}
    />
  )
}

export default Avatar
