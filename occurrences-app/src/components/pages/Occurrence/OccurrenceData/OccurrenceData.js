import InputRadioGroup from '@smalldata/dwca-lib/src/components/form/InputRadioGroup'
import DatePicker from '@smalldata/dwca-lib/src/components/form/DatePicker'
import PropTypes from 'prop-types'
import React from 'react'
import ScientificNameInput from './ScientificNameInput'
import { useTranslation } from 'react-i18next'

const basisOfRecordOptions = ['humanObservation', 'machineObservation', 'fossilSpecimen', 'livingSpecimen', 'preservedSpecimen']
const lifeStageOptions = ['larva', 'juvenile', 'adult', 'unspecified']
const occurrenceStatusOptions = ['absent', 'present']
const sexOptions = ['male', 'female', 'unspecified']

export default function OccurrenceData({ onChange, data }) {
  const { t } = useTranslation()
  const { basisOfRecord, beginDate, endDate, lifeStage, occurrenceStatus, scientificName, scientificNameId, sex } = data

  const updateField = (name, value) => {
    const newSelection = { ...data, [name]: value }
    onChange(newSelection)
  }

  return (
    <div className="occurrence-data section is-fluid">
      <div className="columns mandatory">
        <ScientificNameInput
          onChange={(value) => {
            updateField('scientificName', value)
            updateField('scientificNameId', '')
          }}
          onSuggestionClick={({ scientificName, scientificNameId }) => {
            updateField('scientificName', scientificName)
            updateField('scientificNameId', scientificNameId)
          }}
          scientificName={scientificName}/>
      </div>
      <div>
        {scientificNameId}
      </div>
      <div className="columns">
        <div className="event-begin-date column field is-two-fifths">
          <label className="label">
            {t('occurrenceForm.occurrenceData.eventBeginDate')}
          </label>
          <DatePicker
            onChange={(value) => updateField('beginDate', value)}
            value={beginDate}/>
        </div>
        <div className="event-end-date column field is-two-fifths">
          <label className="label has-text-weight-normal">
            {t('occurrenceForm.occurrenceData.eventEndDate')}
          </label>
          <div className="control">
            <DatePicker
              onChange={(value) => updateField('endDate', value)}
              value={endDate}/>
          </div>
          <p className="help">{t('occurrenceForm.occurrenceData.eventEndDateHelp')}</p>
        </div>
      </div>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.occurrenceStatus"
        onChange={(value) => updateField('occurrenceStatus', value)}
        options={occurrenceStatusOptions}
        selectedValue={occurrenceStatus}/>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.basisOfRecord"
        onChange={(value) => updateField('basisOfRecord', value)}
        options={basisOfRecordOptions}
        selectedValue={basisOfRecord}/>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.sex"
        onChange={(value) => updateField('sex', value)}
        options={sexOptions}
        selectedValue={sex}/>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.lifeStage"
        onChange={(value) => updateField('lifeStage', value)}
        options={lifeStageOptions}
        selectedValue={lifeStage}/>
    </div>
  )
}

export const occurrenceDataShape = {
  basisOfRecord:    PropTypes.oneOf(basisOfRecordOptions).isRequired,
  beginDate:        PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
  endDate:          PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  lifeStage:        PropTypes.oneOf(lifeStageOptions).isRequired,
  occurrenceStatus: PropTypes.oneOf(occurrenceStatusOptions).isRequired,
  scientificNameId: PropTypes.string.isRequired,
  scientificName:   PropTypes.string.isRequired,
  sex:              PropTypes.oneOf(sexOptions).isRequired
}

OccurrenceData.propTypes = {
  data:     PropTypes.shape(occurrenceDataShape).isRequired,
  onChange: PropTypes.func.isRequired
}
