import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'

const basisOfRecordOptions = ['humanObservation', 'machineObservation', 'fossilSpecimen', 'livingSpecimen', 'preservedSpecimen']
const lifestageOptions = ['larva', 'juvenile', 'adult', 'unspecified']
const occurrenceStatusOptions = ['absent', 'present']
const sexOptions = ['male', 'female', 'unspecified']

export default function FinalSummary({ dataset, occurrenceData, onChange, onSubmit }) {
  const { t } = useTranslation()

  return (
    <div className="final-summary section is-fluid">
      <h1 className="title is-3">{t('occurrenceForm.finalSummary.title')}</h1>
      <button className="button is-info is-medium">Submit Entry</button>
      <h2 className="title is-5">1 - DATASET</h2>
      <p>{dataset.description}</p>
      <h2 className="title is-5">2 - OCCURRENCE DATA</h2>
      <table className="table is-striped">
        <tbody>
          <tr>
            <td>scientific name</td>
            <td>{occurrenceData.scientificName}</td>
          </tr>
          <tr>
            <td>beginDate</td>
            <td>{format(occurrenceData.beginDate, 'D MMMM YYYY')}</td>
          </tr>
          <tr>
            <td>endDate</td>
            <td>{format(occurrenceData.endDate, 'D MMMM YYYY')}</td>
          </tr>
          <tr>
            <td>occurrenceStatus</td>
            <td>{occurrenceData.occurrenceStatus}</td>
          </tr>
          <tr>
            <td>basisOfRecord</td>
            <td>{occurrenceData.basisOfRecord}</td>
          </tr>
          <tr>
            <td>sex</td>
            <td>{occurrenceData.sex}</td>
          </tr>
          <tr>
            <td>lifestage</td>
            <td>{occurrenceData.lifestage}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

FinalSummary.propTypes = {
  dataset:        PropTypes.shape({
    description: PropTypes.string.isRequired,
    id:          PropTypes.number.isRequired
  }).isRequired,
  occurrenceData: PropTypes.shape(PropTypes.shape({
    basisOfRecord:    PropTypes.oneOf(basisOfRecordOptions).isRequired,
    beginDate:        PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
    endDate:          PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    lifestage:        PropTypes.oneOf(lifestageOptions),
    occurrenceStatus: PropTypes.oneOf(occurrenceStatusOptions).isRequired,
    scientificName:   PropTypes.string.isRequired,
    sex:              PropTypes.oneOf(sexOptions)
  }).isRequired).isRequired,
  onChange:       PropTypes.func.isRequired,
  onSubmit:       PropTypes.func.isRequired
}
