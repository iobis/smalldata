import PropTypes from 'prop-types'
import React from 'react'
import StepHeader from './StepHeader'

export default function ConfirmedStepHeader({ dataDescription, onStepTitleClick, selectedData, stepDescription, stepTitle }) {
  return (
    <StepHeader
      className="confirmed has-background-white has-text-black"
      iconVisible={true}
      onStepTitleClick={onStepTitleClick}
      dataDescription={dataDescription}
      selectedData={selectedData}
      stepDescription={stepDescription}
      stepTitle={stepTitle}/>
  )
}

ConfirmedStepHeader.propTypes = {
  dataDescription:  PropTypes.string.isRequired,
  onStepTitleClick: PropTypes.func.isRequired,
  selectedData:     PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  stepDescription:  PropTypes.string.isRequired,
  stepTitle:        PropTypes.string.isRequired
}
