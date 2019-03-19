import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function StepHeader({ className, dataDescription, selectedData, stepDescription, stepTitle, iconVisible }) {
  return (
    <div className="step-header container is-fluid">
      <div className={classNames('columns is-vcentered', className)}>
        <div className="column is-1">
          <p className="is-size-5 is-uppercase">
            <b>
              {dataDescription}
            </b>
          </p>
        </div>
        <div className="column is-7">
          <p className="is-size-5">
            {selectedData}
          </p>
        </div>
        <div className="column">
          <div className="is-size-6 is-pulled-right">
            {stepDescription}
          </div>
          <br/>
          <div className="is-size-5 is-uppercase is-pulled-right">
            {iconVisible && <FontAwesomeIcon className="check-circle" icon="check-circle"/>}
            <b className="step-title">
              {stepTitle}
            </b>
          </div>
        </div>
      </div>
    </div>
  )
}

StepHeader.propTypes = {
  className:       PropTypes.string,
  dataDescription: PropTypes.string.isRequired,
  iconVisible:     PropTypes.bool.isRequired,
  selectedData:    PropTypes.string.isRequired,
  stepDescription: PropTypes.string.isRequired,
  stepTitle:       PropTypes.string.isRequired
}
