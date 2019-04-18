import bulmaCalendar from 'bulma-calendar'
import CopyPreviousData from '../CopyPreviousData'
import InputRadio from '../../../layout/InputRadio'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export default function BasicData({ onChange, basicData }) {
  const { basisOfRecord, beginDate, endDate, lifestage, occurrenceStatus, scientificName, sex } = basicData

  const updateField = (name, value) => {
    const newSelection = { ...basicData, [name]: value }
    onChange(newSelection)
  }

  return (
    <div className="basic-dataset section is-fluid">
      <div className="columns">
        <div className="field is-half column">
          <label className="label">Scientific name</label>
          <div className="control">
            <input
              className="input"
              onChange={(value) => updateField('scientificName', value.target.value)}
              type="text"
              placeholder="Text input"
              value={scientificName}/>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column field is-one-quarter">
          <label className="label">Event begin date</label>
          <DatePicker onChange={(value) => updateField('beginDate', value)} value={beginDate}/>
        </div>
        <div className="column field is-one-quarter">
          <label className="label">
            Event end date
          </label>
          <div className="control">
            <DatePicker onChange={(value) => updateField('endDate', value)} value={endDate}/>
          </div>
          <p className="help">optional: only in case of date range</p>
        </div>
      </div>
      <InputRadioGroup
        name="occurrenceStatus"
        onChange={(value) => updateField('occurrenceStatus', value)}
        options={['absent', 'present']}
        selectedValue={occurrenceStatus}
        title="Occurrence status"/>
      <InputRadioGroup
        name="basisOfRecord"
        onChange={(value) => updateField('basisOfRecord', value)}
        options={['humanObservation', 'fossilSpecimen', 'livingSpecimen', 'machineSpecimen', 'preservedSpecimen']}
        selectedValue={basisOfRecord}
        title="Basis of record"/>
      <InputRadioGroup
        name="sex"
        onChange={(value) => updateField('sex', value)}
        options={['male', 'female', 'hermaphrodite', 'unspecified']}
        selectedValue={sex}
        title="Sex"/>
      <InputRadioGroup
        name="lifestage"
        onChange={(value) => updateField('lifestage', value)}
        options={['egg', 'eft', 'juvenile', 'adult', 'unspecified']}
        selectedValue={lifestage}
        title="Lifestage"/>
      <CopyPreviousData/>
    </div>
  )
}

function InputRadioGroup({ title, onChange, selectedValue, name, options }) {
  const { t } = useTranslation()

  return (
    <div className="field">
      <label className="label">
        {title}
      </label>
      <div className="control">
        {options.map(option => (
          <InputRadio
            key={option}
            checked={selectedValue === option}
            text={t('occurrenceForm.basicData.' + name + '.' + option)}
            name={name}
            onChange={onChange}
            value={option}/>
        ))}
      </div>
    </div>
  )
}

function DatePicker({ onChange, value }) {
  const datePickerEl = useRef()

  useEffect(() => {
    const calendar = bulmaCalendar.attach(datePickerEl.current, {
      type:        'date',
      displayMode: 'default',
      startDate:   value !== null ? new Date(value) : null
    })
    calendar[0].on('select', (e) => onChange(e.data))
  }, [])

  return <input className="input" ref={datePickerEl} type="date" placeholder="Text input"/>
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value:    PropTypes.instanceOf(Date)
}
