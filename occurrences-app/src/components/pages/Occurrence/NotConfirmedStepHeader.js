import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import StepHeader from './StepHeader'

export default function NotConfirmedStepHeader({ className, onStepTitleClick, stepDescription, stepTitle }) {
  return (
    <StepHeader
      className={classNames('not-confirmed has-text-white', className || 'has-background-info')}
      dataDescription=""
      iconVisible={false}
      onStepTitleClick={onStepTitleClick}
      selectedData=""
      stepDescription={stepDescription}
      stepTitle={stepTitle}/>
  )
}

NotConfirmedStepHeader.propTypes = {
  className:        PropTypes.string,
  onStepTitleClick: PropTypes.func.isRequired,
  stepDescription:  PropTypes.string.isRequired,
  stepTitle:        PropTypes.string.isRequired
}
