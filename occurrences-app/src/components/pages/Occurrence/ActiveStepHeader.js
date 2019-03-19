import PropTypes from 'prop-types'
import React from 'react'
import StepHeader from './StepHeader'

export default function ActiveStepHeader({ stepDescription, stepTitle }) {
  return (
    <StepHeader
      className="active has-background-grey has-text-white"
      dataDescription=""
      iconVisible={false}
      selectedData=""
      stepDescription={stepDescription}
      stepTitle={stepTitle}/>
  )
}

ActiveStepHeader.propTypes = {
  stepDescription: PropTypes.string.isRequired,
  stepTitle:       PropTypes.string.isRequired
}
