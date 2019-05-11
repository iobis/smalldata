import CopyPreviousData from '../CopyPreviousData'
import DatePicker from '../../../form/DatePicker'
import InputRadioGroup from '../../../form/InputRadioGroup'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function OccurrenceData({ onChange, data }) {
  const { t } = useTranslation()
  const { basisOfRecord, beginDate, endDate, lifestage, occurrenceStatus, scientificName, sex } = data

  const updateField = (name, value) => {
    const newSelection = { ...data, [name]: value }
    onChange(newSelection)
  }

  return (
    <div className="occurrence-data section is-fluid">
      <div className="columns">
        <div className="field is-four-fifths column">
          <label className="label">{t('occurrenceForm.occurrenceData.scientificName')}</label>
          <div className="control">
            <input
              className="input"
              onChange={(value) => updateField('scientificName', value.target.value)}
              placeholder={t('occurrenceForm.occurrenceData.scientificName')}
              type="text"
              value={scientificName}/>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="event-begin-date column field is-two-fifths">
          <label className="label">
            {t('occurrenceForm.occurrenceData.eventBeginDate')}
          </label>
          <DatePicker onChange={(value) => updateField('beginDate', value)} value={beginDate}/>
        </div>
        <div className="event-end-date column field is-two-fifths">
          <label className="label">
            {t('occurrenceForm.occurrenceData.eventEndDate')}
          </label>
          <div className="control">
            <DatePicker onChange={(value) => updateField('endDate', value)} value={endDate}/>
          </div>
          <p className="help">{t('occurrenceForm.occurrenceData.eventEndDateHelp')}</p>
        </div>
      </div>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.occurrenceStatus"
        onChange={(value) => updateField('occurrenceStatus', value)}
        options={['absent', 'present']}
        selectedValue={occurrenceStatus}/>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.basisOfRecord"
        onChange={(value) => updateField('basisOfRecord', value)}
        options={['humanObservation', 'fossilSpecimen', 'livingSpecimen', 'machineSpecimen', 'preservedSpecimen']}
        selectedValue={basisOfRecord}/>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.sex"
        onChange={(value) => updateField('sex', value)}
        options={['male', 'female', 'hermaphrodite', 'unspecified']}
        selectedValue={sex}/>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.lifestage"
        onChange={(value) => updateField('lifestage', value)}
        options={['egg', 'eft', 'juvenile', 'adult', 'unspecified']}
        selectedValue={lifestage}/>
      <CopyPreviousData/>
    </div>
  )
}

OccurrenceData.propTypes = {
  data:     PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}
