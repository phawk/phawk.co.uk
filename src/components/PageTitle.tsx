import React from "react"

const PageTitle: React.FC = ({ children }) => {
  return (
    <h1 className="mb-6 text-3xl md:text-5xl text-gray-900 font-bold leading-tight">
      {children}
    </h1>
  )
}

export default PageTitle
