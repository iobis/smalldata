import React from 'react'
import PropTypes from 'prop-types'

export default function ContinueButton({ name, value }) {
  return (
    <div className="columns">
      <button className="button is-info" name={name}>{value}</button>
    </div>
  )
}

ContinueButton.propTypes = {
  name:  PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}
