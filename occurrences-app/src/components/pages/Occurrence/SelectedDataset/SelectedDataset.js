import PropTypes from 'prop-types'
import React from 'react'

export default function SelectedDataset({ datasets, selectedDatasetId, onChange }) {
  return (
    <div className="selected-dataset columns is-fluid">
      <table className="table is-striped is-fullwidth">
        <tbody>
        {datasets.map(dataset => (
          <DatasetOption
            key={dataset.id}
            onClick={() => onChange(dataset.id)}
            checked={dataset.id === selectedDatasetId}
            {...dataset}
          />))}
        </tbody>
      </table>
    </div>
  )
}

SelectedDataset.propTypes = {
  datasets:          PropTypes.arrayOf(PropTypes.shape({
    id:          PropTypes.number.isRequired,
    description: PropTypes.string.isRequired
  })).isRequired,
  onChange:          PropTypes.func.isRequired,
  selectedDatasetId: PropTypes.number.isRequired
}

function DatasetOption({ checked, description, onClick }) {
  return (
    <tr>
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
