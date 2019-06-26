import InputRadio from '../../../form/InputRadio'
import PropTypes from 'prop-types'
import React from 'react'
import { datasetTitleOf } from '../../../../clients/SmalldataClient'
import ContinueButton from '../ContinueButton'

export default function Dataset({ datasets, selectedDataset, onChange, nextStepHandler }) {
  return (
    <>
      <div className="dataset is-fluid">
        <table className="table is-striped is-fullwidth">
          <tbody>
            {datasets.map(dataset => (
              <DatasetOption
                checked={dataset.id === selectedDataset.id}
                id={dataset.id}
                key={dataset.id}
                onClick={() => onChange(dataset)}
                title={datasetTitleOf(dataset)}/>))}
          </tbody>
        </table>
      </div>
      <ContinueButton
        name="datasetContinue"
        nextStepHandler={nextStepHandler}
        value="Continue to Occurrence Data"
        wrapperClassName=""/>
    </>
  )
}

export const datasetShape = {
  id:    PropTypes.string.isRequired,
  title: PropTypes.shape({
    value: PropTypes.string.isRequired
  }).isRequired
}

Dataset.propTypes = {
  datasets:        PropTypes.arrayOf(PropTypes.shape(datasetShape)).isRequired,
  nextStepHandler: PropTypes.func.isRequired,
  onChange:        PropTypes.func.isRequired,
  selectedDataset: PropTypes.shape(datasetShape).isRequired
}

function DatasetOption({ id, checked, title, onClick }) {
  return (
    <tr className="dataset-option" onClick={onClick}>
      <td><InputRadio checked={checked} name="dataset" onChange={onClick} value={id}/></td>
      <td>{title}</td>
    </tr>
  )
}

DatasetOption.propTypes = {
  checked: PropTypes.bool.isRequired,
  id:      PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title:   PropTypes.string.isRequired
}
