import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const Avatar = ({ className }) => {
  const data = useStaticQuery(graphql`
    query AvatarQuery {
      avatar: file(absolutePath: { regex: "/ignite-1600.jpg/" }) {
        childImageSharp {
          fixed(width: 80, height: 80) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  return (
    <Img
      fixed={data.avatar.childImageSharp.fixed}
      className={`rounded-full ${className}`}
    />
  )
}

export default Avatar
