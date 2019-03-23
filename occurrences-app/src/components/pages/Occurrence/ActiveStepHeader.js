import PropTypes from 'prop-types'
import React from 'react'
import StepHeader from './StepHeader'

export default function ActiveStepHeader({ children, onStepTitleClick, stepDescription, stepTitle }) {
  return (
    <StepHeader
      className="active has-background-grey has-text-white"
      dataDescription=""
      iconVisible={false}
      selectedData=""
      onStepTitleClick={onStepTitleClick}
      stepDescription={stepDescription}
      stepTitle={stepTitle}>
      {children}
    </StepHeader>
  )
}

ActiveStepHeader.propTypes = {
  onStepTitleClick: PropTypes.func.isRequired,
  stepDescription:  PropTypes.string.isRequired,
  stepTitle:        PropTypes.string.isRequired
}
