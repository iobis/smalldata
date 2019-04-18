import CopyPreviousData from '../CopyPreviousData'
import DatePicker from '../../../form/DatePicker'
import InputRadioGroup from '../../../form/InputRadioGroup'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function BasicData({ onChange, basicData }) {
  const { t } = useTranslation()
  const { basisOfRecord, beginDate, endDate, lifestage, occurrenceStatus, scientificName, sex } = basicData

  const updateField = (name, value) => {
    const newSelection = { ...basicData, [name]: value }
    onChange(newSelection)
  }

  return (
    <div className="basic-dataset section is-fluid">
      <div className="columns">
        <div className="field is-half column">
          <label className="label">{t('occurrenceForm.basicData.scientificName')}</label>
          <div className="control">
            <input
              className="input"
              onChange={(value) => updateField('scientificName', value.target.value)}
              type="text"
              placeholder={t('occurrenceForm.basicData.scientificName')}
              value={scientificName}/>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="event-begin-date column field is-one-quarter">
          <label className="label">
            {t('occurrenceForm.basicData.eventBeginDate')}
          </label>
          <DatePicker onChange={(value) => updateField('beginDate', value)} value={beginDate}/>
        </div>
        <div className="event-end-date column field is-one-quarter">
          <label className="label">
            {t('occurrenceForm.basicData.eventEndDate')}
          </label>
          <div className="control">
            <DatePicker onChange={(value) => updateField('endDate', value)} value={endDate}/>
          </div>
          <p className="help">{t('occurrenceForm.basicData.eventEndDateHelp')}</p>
        </div>
      </div>
      <InputRadioGroup
        name="occurrenceForm.basicData.occurrenceStatus"
        onChange={(value) => updateField('occurrenceStatus', value)}
        options={['absent', 'present']}
        selectedValue={occurrenceStatus}/>
      <InputRadioGroup
        name="occurrenceForm.basicData.basisOfRecord"
        onChange={(value) => updateField('basisOfRecord', value)}
        options={['humanObservation', 'fossilSpecimen', 'livingSpecimen', 'machineSpecimen', 'preservedSpecimen']}
        selectedValue={basisOfRecord}/>
      <InputRadioGroup
        name="occurrenceForm.basicData.sex"
        onChange={(value) => updateField('sex', value)}
        options={['male', 'female', 'hermaphrodite', 'unspecified']}
        selectedValue={sex}/>
      <InputRadioGroup
        name="occurrenceForm.basicData.lifestage"
        onChange={(value) => updateField('lifestage', value)}
        options={['egg', 'eft', 'juvenile', 'adult', 'unspecified']}
        selectedValue={lifestage}/>
      <CopyPreviousData/>
    </div>
  )
}

BasicData.propTypes = {
  onChange:  PropTypes.func.isRequired,
  basicData: PropTypes.object.isRequired
}
