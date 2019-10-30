import PropTypes from 'prop-types'
import React from 'react'
import StepFooter from './StepFooter'
import StepHeader from './StepHeader'

export default function ActiveStepHeader({
  activeStepIndex,
  children,
  nextStep,
  onContinueButtonClick,
  onCopyPreviousDataClick,
  onStepTitleClick,
  stepDescription,
  stepTitle,
  totalSteps
}) {
  const footerVisible = activeStepIndex <= totalSteps
  return (
    <>
      <StepHeader
        className="active has-background-grey has-text-white"
        dataDescription=""
        iconVisible={false}
        onStepTitleClick={onStepTitleClick}
        scrollOnRender={true}
        selectedData=""
        stepDescription={stepDescription}
        stepTitle={stepTitle}>
        {children}
      </StepHeader>
      {footerVisible && (
        <StepFooter
          activeStepIndex={activeStepIndex}
          nextStep={nextStep}
          onContinueButtonClick={onContinueButtonClick}
          onCopyPreviousDataClick={onCopyPreviousDataClick}/>
      )}
    </>
  )
}

ActiveStepHeader.propTypes = {
  activeStepIndex:         PropTypes.number.isRequired,
  children:                PropTypes.node,
  nextStep:                PropTypes.string,
  onContinueButtonClick:   PropTypes.func.isRequired,
  onCopyPreviousDataClick: PropTypes.func,
  onStepTitleClick:        PropTypes.func.isRequired,
  stepDescription:         PropTypes.string.isRequired,
  stepTitle:               PropTypes.string.isRequired,
  totalSteps:              PropTypes.number.isRequired
}
