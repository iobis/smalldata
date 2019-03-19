import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import StepHeader from './StepHeader'

export default function NotConfirmedStepHeader({ className, stepDescription, stepTitle }) {
  return (
    <StepHeader
      className={classNames('not-confirmed has-text-white', className || 'has-background-info')}
      dataDescription=""
      iconVisible={false}
      selectedData=""
      stepDescription={stepDescription}
      stepTitle={stepTitle}/>
  )
}

NotConfirmedStepHeader.propTypes = {
  className:       PropTypes.string,
  stepDescription: PropTypes.string.isRequired,
  stepTitle:       PropTypes.string.isRequired
}
