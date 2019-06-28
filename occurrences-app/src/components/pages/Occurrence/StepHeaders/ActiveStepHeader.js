import PropTypes from 'prop-types'
import React from 'react'
import StepHeader from './StepHeader'
import CopyPreviousData from '../CopyPreviousData'
import ContinueButton from '../ContinueButton'

export default function ActiveStepHeader({
  activeStepIndex,
  children,
  nextStep,
  onContinueButtonClick,
  onStepTitleClick,
  stepDescription,
  stepTitle,
  totalSteps
}) {
  const wrapperClassname = (activeStepIndex === 0) ? 'column dataset-continue-button' : ''
  return (
    <>
      <StepHeader
        className="active has-background-grey has-text-white"
        dataDescription=""
        iconVisible={false}
        onStepTitleClick={onStepTitleClick}
        selectedData=""
        stepDescription={stepDescription}
        stepTitle={stepTitle}>
        {children}
      </StepHeader>
      {activeStepIndex < totalSteps && (
        <div className="step-footer columns">
          {activeStepIndex > 0 && <CopyPreviousData/>}
          <ContinueButton
            name="locationContinue"
            onClick={onContinueButtonClick}
            value={nextStep}
            wrapperClassName={wrapperClassname}/>
        </div>)}
    </>
  )
}

ActiveStepHeader.propTypes = {
  activeStepIndex:       PropTypes.number,
  children:              PropTypes.node,
  nextStep:              PropTypes.string,
  onContinueButtonClick: PropTypes.func.isRequired,
  onStepTitleClick:      PropTypes.func.isRequired,
  stepDescription:       PropTypes.string.isRequired,
  stepTitle:             PropTypes.string.isRequired,
  totalSteps:            PropTypes.number
}
