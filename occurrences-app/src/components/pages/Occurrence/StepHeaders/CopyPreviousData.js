import PropTypes from 'prop-types'
import React from 'react'

export default function CopyPreviousData({ visible }) {
  const label = visible
    ? 'copy data from previous entry'
    : ''
  return (
    <div className="columns">
      <div className="copy-previous-data column is-narrow">{label}</div>
    </div>
  )
}

CopyPreviousData.propTypes = {
  visible: PropTypes.bool.isRequired
}
