import PropTypes from 'prop-types'
import React from 'react'

export default function SectionTitle({ children }) {
  return (
    <h2 className="title is-4">{children}</h2>
  )
}

SectionTitle.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}
