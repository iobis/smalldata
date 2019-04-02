import React from 'react'

export default function SelectedDataset() {
  return (
    <div className="selected-dataset is-fluid">
      <div className="columns">
        <div className="column">
          <table className="table is-striped is-fullwidth">
            <tbody>
            <DatasetOption description="HAB Region 2: Occurrences of harmful (toxic) algal taxa within an area of interest to El Salvador compiled as part of a literature search project."/>
            <DatasetOption description="NPPSD Short-tailed Albatross Sightings"/>
            <DatasetOption description="PANGAEA - Data from Christian-Albrechts-University Kiel"/>
            <DatasetOption description="NSIS: List of marine benthic algae from Magdalen Islands, Quebec as recorded in 1979"/>
            <DatasetOption description="Seguimiento de 10 crías de tortuga boba nacidas en 2016 en el litoral valenciano, en el marco del Proyecto LIFE 15 IPE ES 012 (aggregated per 1-degree cell)"/>
            <DatasetOption description="Waved Albatross Tracking (aggregated per 1-degree cell)"/>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function DatasetOption({ description }) {
  return (
    <tr>
      <td><input type="radio" name="dataset"/></td>
      <td>{description}</td>
    </tr>
  )
}
