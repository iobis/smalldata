import React from 'react'
import PropTypes from 'prop-types'

export default function ContinueButton({ name, value, onClick, wrapperClassName }) {
  return (
    <div className={wrapperClassName}>
      <button className="button is-info" name={name} onClick={onClick}>{value}</button>
    </div>
  )
}

ContinueButton.propTypes = {
  name:             PropTypes.string.isRequired,
  onClick:          PropTypes.func.isRequired,
  value:            PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string.isRequired
}
