import CopyPreviousData from '../CopyPreviousData'
import DatePicker from '../../../form/DatePicker'
import InputRadioGroup from '../../../form/InputRadioGroup'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as MarineSpeciesClient from '../../../../clients/MarineSpeciesClient'
import { useDebounce } from '../../../../hooks/hooks'
import { useTranslation } from 'react-i18next'

const basisOfRecordOptions = ['humanObservation', 'fossilSpecimen', 'livingSpecimen', 'machineSpecimen', 'preservedSpecimen']
const lifestageOptions = ['egg', 'eft', 'juvenile', 'adult', 'unspecified']
const occurrenceStatusOptions = ['absent', 'present']
const sexOptions = ['male', 'female', 'hermaphrodite', 'unspecified']

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
        <ScientificNameInput
          onChange={(value) => updateField('scientificName', value)}
          scientificName={scientificName}/>
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
        name="occurrenceForm.occurrenceData.lifestage"
        onChange={(value) => updateField('lifestage', value)}
        options={lifestageOptions}
        selectedValue={lifestage}/>
      <CopyPreviousData/>
    </div>
  )
}

OccurrenceData.propTypes = {
  data:     PropTypes.shape({
    basisOfRecord:    PropTypes.oneOf(basisOfRecordOptions).isRequired,
    beginDate:        PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
    endDate:          PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    lifestage:        PropTypes.oneOf(lifestageOptions),
    occurrenceStatus: PropTypes.oneOf(occurrenceStatusOptions).isRequired,
    scientificName:   PropTypes.string.isRequired,
    sex:              PropTypes.oneOf(sexOptions)
  }).isRequired,
  onChange: PropTypes.func.isRequired
}

function ScientificNameInput({ scientificName, onChange }) {
  const { t } = useTranslation()
  const [valid, setValid] = useState(false)
  const [name, setName] = useState(scientificName)

  const debouncedName = useDebounce(name, 500)

  useEffect(() => {
    const getByName = async() => {
      const response = await MarineSpeciesClient.getByName(name)
      const newValid = response.find(record => (record.scientificname || '').toLocaleLowerCase() === name.toLowerCase())
      setValid(newValid)
    }

    if (debouncedName) getByName()
  }, [debouncedName])

  function handleNameChange(newName) {
    onChange(newName)
    setName(newName)
  }

  return (
    <div className="field is-four-fifths column">
      <label className="label">{t('occurrenceForm.occurrenceData.scientificName')}</label>
      <div className="control has-icons-right">
        <input
          className="input"
          onChange={(value) => handleNameChange(value.target.value)}
          placeholder={t('occurrenceForm.occurrenceData.scientificName')}
          type="text"
          value={name}/>
        {valid
          ? <span className="clear icon is-small is-right"><FontAwesomeIcon className="check" icon="check"/></span>
          : null}
      </div>
    </div>
  )
}

ScientificNameInput.propTypes = {
  onChange:       PropTypes.func.isRequired,
  scientificName: PropTypes.string.isRequired
}
