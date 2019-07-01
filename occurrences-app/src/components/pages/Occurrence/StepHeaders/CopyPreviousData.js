import PropTypes from 'prop-types'
import React from 'react'

export default function CopyPreviousData({ onClick, visible }) {
  const label = visible
    ? 'copy data from previous entry'
    : ''

  return (
    <div className="columns">
      <div className="copy-previous-data column is-narrow" onClick={onClick}>{label}</div>
    </div>
  )
}

CopyPreviousData.propTypes = {
  onClick: PropTypes.func,
  visible: PropTypes.bool.isRequired
}
