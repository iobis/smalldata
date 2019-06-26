import React from 'react'
import PropTypes from 'prop-types'

export default function ContinueButton({ name, value, onClick, wrapperClassName, nextStepHandler }) {
  return (
    <div className={wrapperClassName}>
      <button className="button is-info" name={name} onClick={nextStepHandler}>{value}</button>
    </div>
  )
}

ContinueButton.propTypes = {
  name:             PropTypes.string.isRequired,
  nextStepHandler:  PropTypes.func.isRequired,
  value:            PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string.isRequired
}
