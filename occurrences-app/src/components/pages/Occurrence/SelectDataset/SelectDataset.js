import PropTypes from 'prop-types'
import React from 'react'

export default function SelectDataset({ datasets, selectedDataset, onChange }) {
  return (
    <div className="select-dataset columns is-fluid">
      <table className="table is-striped is-fullwidth">
        <tbody>
        {datasets.map(dataset => (
          <DatasetOption
            key={dataset.id}
            onClick={() => onChange(dataset)}
            checked={dataset.id === selectedDataset.id}
            {...dataset}
          />))}
        </tbody>
      </table>
    </div>
  )
}

const datasetShape = {
  id:          PropTypes.number.isRequired,
  description: PropTypes.string.isRequired
}

SelectDataset.propTypes = {
  datasets:        PropTypes.arrayOf(PropTypes.shape(datasetShape)).isRequired,
  onChange:        PropTypes.func.isRequired,
  selectedDataset: PropTypes.shape(datasetShape).isRequired
}

function DatasetOption({ checked, description, onClick }) {
  return (
    <tr className="dataset-option">
      <td><input checked={checked} type="radio" name="dataset" onChange={onClick}/></td>
      <td>{description}</td>
    </tr>
  )
}

DatasetOption.propTypes = {
  checked:     PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  onClick:     PropTypes.func.isRequired
}
