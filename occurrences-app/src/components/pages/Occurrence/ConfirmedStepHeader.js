import PropTypes from 'prop-types'
import React from 'react'
import StepHeader from './StepHeader'

export default function ConfirmedStepHeader(props) {
  return (
    <StepHeader
      className="confirmed has-background-white has-text-black"
      iconVisible={true}
      {...props}/>
  )
}

ConfirmedStepHeader.propTypes = {
  dataDescription: PropTypes.string.isRequired,
  selectedData:    PropTypes.string.isRequired,
  stepDescription: PropTypes.string.isRequired,
  stepTitle:       PropTypes.string.isRequired
}
