import PropTypes from 'prop-types'
import React, { useState } from 'react'

export default function SelectedDataset() {
  const datasetOptions = [{
    id:          0,
    description: 'HAB Region 2: Occurrences of harmful (toxic) algal taxa within an area of interest to El Salvador compiled as part of a literature search project.'
  }, {
    id:          1,
    description: 'NPPSD Short-tailed Albatross Sightings'
  }, {
    id:          2,
    description: 'PANGAEA - Data from Christian-Albrechts-University Kiel'
  }, {
    id:          3,
    description: 'NSIS: List of marine benthic algae from Magdalen Islands, Quebec as recorded in 1979'
  }, {
    id:          4,
    description: 'Seguimiento de 10 crías de tortuga boba nacidas en 2016 en el litoral valenciano, en el marco del Proyecto LIFE 15 IPE ES 012 (aggregated per 1-degree cell)'
  }, {
    id:          5,
    description: 'Waved Albatross Tracking (aggregated per 1-degree cell)'
  }]
  const [selectedDatasetId, setSeletedDatasetId] = useState(datasetOptions[0].id)

  return (
    <div className="selected-dataset is-fluid">
      <div className="columns">
        <div className="column">
          <table className="table is-striped is-fullwidth">
            <tbody>
            {datasetOptions.map(props => (
              <DatasetOption
                key={props.id}
                onClick={() => setSeletedDatasetId(props.id)}
                checked={props.id === selectedDatasetId}
                {...props}
              />))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function DatasetOption({ checked, description, onClick }) {
  return (
    <tr>
      <td><input checked={checked} type="radio" name="dataset" onClick={onClick}/></td>
      <td>{description}</td>
    </tr>
  )
}

DatasetOption.propTypes = {
  checked:     PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  onClick:     PropTypes.func.isRequired
}
