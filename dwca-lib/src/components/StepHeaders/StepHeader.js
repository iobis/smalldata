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
      <header className={classNames('step-header columns is-vcentered', className)} onClick={onStepTitleClick}>
        <div className={classNames('column is-1', { 'is-hidden-mobile': !dataDescription })}>
          <p className="datadescription">
            {dataDescription}
          </p>
        </div>
        <p className={classNames('selected-data column', { 'is-hidden-mobile': !selectedData })}>
          {selectedData}
        </p>
        <div className="column details">
          <h3 className="is-size-6">
            {stepDescription}
          </h3>
          <h2 className="step-title">
            {iconVisible && <FontAwesomeIcon className="check-circle" icon="check-circle"/>}
            {stepTitle}
          </h2>
        </div>
      </header>
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
