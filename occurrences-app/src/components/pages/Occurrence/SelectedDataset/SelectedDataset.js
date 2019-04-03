import PropTypes from 'prop-types'
import React, { useState } from 'react'

export default function SelectedDataset() {
  const [datasetId, setDataSetId] = useState(null)

  return (
    <div className="selected-dataset is-fluid">
      <div className="columns">
        <div className="column">
          <table className="table is-striped is-fullwidth">
            <tbody>
            <DatasetOption
              checked={true}
              onClick={() => setDataSetId(0)}
              description="HAB Region 2: Occurrences of harmful (toxic) algal taxa within an area of interest to El Salvador compiled as part of a literature search project."/>
            <DatasetOption
              checked={false}
              onClick={() => setDataSetId(1)} description="NPPSD Short-tailed Albatross Sightings"/>
            <DatasetOption
              checked={false}
              onClick={() => setDataSetId(2)}
              description="PANGAEA - Data from Christian-Albrechts-University Kiel"/>
            <DatasetOption
              checked={false}
              onClick={() => setDataSetId(3)}
              description="NSIS: List of marine benthic algae from Magdalen Islands, Quebec as recorded in 1979"/>
            <DatasetOption
              checked={false}
              onClick={() => setDataSetId(4)}
              description="Seguimiento de 10 crías de tortuga boba nacidas en 2016 en el litoral valenciano, en el marco del Proyecto LIFE 15 IPE ES 012 (aggregated per 1-degree cell)"/>
            <DatasetOption
              checked={false}
              onClick={() => setDataSetId(5)}
              description="Waved Albatross Tracking (aggregated per 1-degree cell)"/>
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
