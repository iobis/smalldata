import PropTypes from 'prop-types'
import React from 'react'

export default function Divider({ children }) {
  return (
    <div className="divider">
      <span>{children}</span>
    </div>
  )
}

Divider.propTypes = {
  children: PropTypes.node
}
