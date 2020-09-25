import React from "react"

type Props = {
  className?: string
  title?: string
}

const Logo: React.FC<Props> = ({ className, ...rest }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 86 86"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.5 0.5H0.5V10.5H5.5H80.5H85.5V0.5H80.5H5.5ZM11.272 66V51.152H21.192C26.44 51.152 30.5573 49.776 33.544 47.024C36.5307 44.272 38.024 40.528 38.024 35.792C38.024 31.056 36.5307 27.312 33.544 24.56C30.5573 21.808 26.44 20.432 21.192 20.432H0.455994V66H11.272ZM20.488 42H11.272V29.584H20.488C22.5787 29.584 24.2213 30.1173 25.416 31.184C26.6107 32.2507 27.208 33.7867 27.208 35.792C27.208 37.7973 26.6213 39.3333 25.448 40.4C24.2747 41.4667 22.6213 42 20.488 42ZM56.468 66V47.568H74.772V66H85.588V20.432H74.772V37.84H56.468V20.432H45.652V66H56.468ZM0.5 75.5H5.5H80.5H85.5V85.5H80.5H5.5H0.5V75.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default Logo
