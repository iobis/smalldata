import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function StepHeader({
  children,
  className,
  dataDescription,
  selectedData,
  stepDescription,
  stepTitle,
  iconVisible,
  onStepTitleClick
}) {
  return (
    <>
      <div className={classNames('step-header container columns is-vcentered', className)}>
        <div className={classNames('column is-1', { 'is-hidden-mobile': !dataDescription })}>
          <p className="is-size-5 is-uppercase">
            <b>
              {dataDescription}
            </b>
          </p>
        </div>
        <div className={classNames('column is-7', { 'is-hidden-mobile': !selectedData })}>
          <p className="is-size-5">
            {selectedData}
          </p>
        </div>
        <div className="column details">
          <div className="is-size-6">
            {stepDescription}
          </div>
          <div className="is-size-5 is-uppercase">
            {iconVisible && <FontAwesomeIcon className="check-circle" icon="check-circle"/>}
            <b onClick={onStepTitleClick} className="step-title">
              {stepTitle}
            </b>
          </div>
        </div>
      </div>
      {children}
    </>
  )
}

StepHeader.propTypes = {
  children:         PropTypes.node,
  className:        PropTypes.string,
  dataDescription:  PropTypes.string.isRequired,
  iconVisible:      PropTypes.bool.isRequired,
  onStepTitleClick: PropTypes.func.isRequired,
  selectedData:     PropTypes.string.isRequired,
  stepDescription:  PropTypes.string.isRequired,
  stepTitle:        PropTypes.string.isRequired
}
