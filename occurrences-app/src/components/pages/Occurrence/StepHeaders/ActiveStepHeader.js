import PropTypes from 'prop-types'
import React from 'react'
import StepHeader from './StepHeader'
import CopyPreviousData from '../CopyPreviousData'
import ContinueButton from '../ContinueButton'

export default function ActiveStepHeader({ children, onStepTitleClick, stepDescription, stepTitle, onContinueButtonClick, totalSteps, activeStepIndex }) {
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
      {activeStepIndex < totalSteps &&
      <div className="columns obis-spaced">
        {activeStepIndex > 0 &&
        <CopyPreviousData/>
        }
        <ContinueButton
          name="locationContinue"
          onClick={onContinueButtonClick}
          value="occurrenceForm.locationData.step.nextStep"
          wrapperClassName=""/>
      </div>
      }
    </>
  )
}

ActiveStepHeader.propTypes = {
  activeStepIndex:       PropTypes.number,
  children:              PropTypes.node,
  onContinueButtonClick: PropTypes.func.isRequired,
  onStepTitleClick:      PropTypes.func.isRequired,
  stepDescription:       PropTypes.string.isRequired,
  stepTitle:             PropTypes.string.isRequired,
  totalSteps:            PropTypes.number
}
