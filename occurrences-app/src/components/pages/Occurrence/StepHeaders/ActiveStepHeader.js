import PropTypes from 'prop-types'
import React from 'react'
import StepHeader from './StepHeader'
import CopyPreviousData from '../CopyPreviousData'
import ContinueButton from '../ContinueButton'

export default function ActiveStepHeader({ children, onStepTitleClick, stepDescription, stepTitle, onContinueButtonClick }) {
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
      <div className="columns obis-spaced">
        <CopyPreviousData/>
        <ContinueButton
          name="locationContinue"
          nextStepHandler={onContinueButtonClick}
          value="occurrenceForm.locationData.step.nextStep"
          wrapperClassName=""/>
      </div>
    </>
  )
}

ActiveStepHeader.propTypes = {
  children:              PropTypes.node,
  onContinueButtonClick: PropTypes.func.isRequired,
  onStepTitleClick:      PropTypes.func.isRequired,
  stepDescription:       PropTypes.string.isRequired,
  stepTitle:             PropTypes.string.isRequired
}
