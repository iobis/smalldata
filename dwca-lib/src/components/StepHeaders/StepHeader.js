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
      <div className={classNames('step-header columns is-vcentered', className)} onClick={onStepTitleClick}>
        <div className={classNames('column is-1', { 'is-hidden-mobile': !dataDescription })}>
          <p className="is-size-5 is-uppercase">
            <b>
              {dataDescription}
            </b>
          </p>
        </div>
        <div className={classNames('selected-data column is-7 is-size-5', { 'is-hidden-mobile': !selectedData })}>
          {selectedData}
        </div>
        <div className="column details">
          <div className="is-size-6">
            {stepDescription}
          </div>
          <div className="is-size-5 is-uppercase">
            {iconVisible && <FontAwesomeIcon className="check-circle" icon="check-circle"/>}
            <b className="step-title">
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
  selectedData:     PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  stepDescription:  PropTypes.string.isRequired,
  stepTitle:        PropTypes.string.isRequired
}
