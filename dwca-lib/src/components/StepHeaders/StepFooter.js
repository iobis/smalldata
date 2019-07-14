import CopyPreviousData from './CopyPreviousData'
import ContinueButton from './ContinueButton'
import PropTypes from 'prop-types'
import React from 'react'

export default function StepFooter({
  onContinueButtonClick,
  onCopyPreviousDataClick,
  nextStep
}) {
  return (
    <div className="step-footer columns section">
      <CopyPreviousData
        onClick={onCopyPreviousDataClick}
        visible/>
      {!!nextStep && (
        <ContinueButton
          name="locationContinue"
          onClick={onContinueButtonClick}
          value={nextStep}/>)}
    </div>
  )
}

StepFooter.propTypes = {
  nextStep:                PropTypes.string,
  onContinueButtonClick:   PropTypes.func.isRequired,
  onCopyPreviousDataClick: PropTypes.func
}
