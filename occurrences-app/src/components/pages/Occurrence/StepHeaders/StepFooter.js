import CopyPreviousData from './CopyPreviousData'
import ContinueButton from './ContinueButton'
import PropTypes from 'prop-types'
import React from 'react'

export default function StepFooter({ activeStepIndex, onContinueButtonClick, nextStep }) {
  return (
    <div className="step-footer columns">
      <CopyPreviousData visible={activeStepIndex !== 0}/>
      <ContinueButton
        name="locationContinue"
        onClick={onContinueButtonClick}
        value={nextStep}/>
    </div>
  )
}

StepFooter.propTypes = {
  activeStepIndex:       PropTypes.number,
  nextStep:              PropTypes.string,
  onContinueButtonClick: PropTypes.func.isRequired
}
