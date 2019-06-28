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
  const footerVisible = activeStepIndex < totalSteps
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
      {footerVisible && (
        <StepFooter
          activeStepIndex={activeStepIndex}
          nextStep={nextStep}
          onContinueButtonClick={onContinueButtonClick}/>
      )}
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

function StepFooter({ activeStepIndex, onContinueButtonClick, nextStep }) {
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
