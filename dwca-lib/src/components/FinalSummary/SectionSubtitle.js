import PropTypes from 'prop-types'
import React from 'react'

export default function SectionSubtitle({ children }) {
  return <h2 className="title is-5">{children}</h2>
}

SectionSubtitle.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}
