import { map } from "lodash"
import React from "react"
import { Link as ScrollLink } from "react-scroll"

const Contents = ({ data }) => {
  return (
    <div className="my-10 border border-gray-300 rounded-md">
      <span className="block p-3 font-semibold border-b border-gray-300">
        Contents
      </span>
      {map(data, (name, slug) => (
        <ScrollLink
          key={slug}
          to={slug}
          smooth
          className="block cursor-pointer p-3 font-semibold border-b border-gray-300"
        >
          {name}
        </ScrollLink>
      ))}
    </div>
  )
}

export default Contents
