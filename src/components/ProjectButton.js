import React from "react"

const ProjectButton = ({ url, icon, title, description }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col md:flex-row md:items-center border border-gray-300 hover:border-gray-400 rounded-lg mb-6 px-4 py-3 shadow-sm"
    >
      <img
        src={icon}
        alt={title}
        className="w-10 h-10 object-contain mb-4 md:mb-0 md:mr-4"
      />
      <div>
        <h3 className="font-semibold text-gray-900 text-lg group-hover:underline">
          {title}
        </h3>
        <p className="text-base leading-snug">{description}</p>
      </div>
    </a>
  )
}

export default ProjectButton
