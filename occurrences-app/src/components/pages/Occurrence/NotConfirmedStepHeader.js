import PropTypes from 'prop-types'
import React from 'react'
import StepHeader from './StepHeader'

export default function NotConfirmedStepHeader({ stepDescription, stepTitle }) {
  return (
    <StepHeader
      className="not-confirmed has-background-info has-text-white"
      dataDescription=""
      iconVisible={false}
      selectedData=""
      stepDescription={stepDescription}
      stepTitle={stepTitle}/>
  )
}

NotConfirmedStepHeader.propTypes = {
  stepDescription: PropTypes.string.isRequired,
  stepTitle:       PropTypes.string.isRequired
}
