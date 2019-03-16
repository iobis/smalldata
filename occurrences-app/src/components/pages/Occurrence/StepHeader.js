import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function StepHeader({ dataDescription, selectedData, stepDescription, stepTitle }) {
  return (
    <div className="step-header container is-fluid">
      <div className="columns is-vcentered">
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
            <FontAwesomeIcon className="check-circle" icon="check-circle"/>
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
  dataDescription: PropTypes.string.isRequired,
  selectedData:    PropTypes.string.isRequired,
  stepDescription: PropTypes.string.isRequired,
  stepTitle:       PropTypes.string.isRequired
}
