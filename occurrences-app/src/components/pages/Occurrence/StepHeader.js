import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function StepHeader() {
  return (
    <div className="step-header container is-fluid">
      <div className="columns">
        <div className="column is-1">
          <p className="is-size-4">
            <b>
              Using Data
            </b>
          </p>
        </div>
        <div className="column is-7">
          <p className="is-size-5">
            HAB Region 2: Occurrences of harmful (toxic) algal taxa within an area of interest
            to El Salvador compiled
            as part of a literature search project.
          </p>
        </div>
        <div className="column">
          <div className="is-size-6 is-pulled-right">
            Choose the dataset for adding observations
          </div>
          <div className="is-size-4 is-pulled-right">
            <FontAwesomeIcon className="check-circle" icon="check-circle"/>
            <b>
              1 - SELECT DATASET
            </b>
          </div>
        </div>
      </div>
    </div>
  )
}
