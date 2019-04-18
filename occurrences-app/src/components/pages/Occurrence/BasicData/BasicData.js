import React, { useState, useEffect, useRef } from 'react'
import bulmaCalendar from 'bulma-calendar'
import { useTranslation } from 'react-i18next'
import CopyPreviousData from '../CopyPreviousData'

export default function BasicData() {
  const [beginDate, setBeginDate] = useState(new Date())
  const [endDate, setEndDate] = useState(null)
  const [occurrenceStatus, setOccurrenceStatus] = useState(null)
  const [basisOfRecord, setBasisOfRecord] = useState(null)
  const [sex, setSex] = useState(null)
  const [lifestage, setLifestage] = useState(null)

  return (
    <div className="basic-dataset section is-fluid">
      <div className="columns">
        <div className="field is-half column">
          <label className="label">Scientific name</label>
          <div className="control">
            <input className="input" type="text" placeholder="Text input"/>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-one-quarter">
          <div className="field">
            <label className="label">Event begin date</label>
            <DatePicker onChange={setBeginDate} value={beginDate}/>
          </div>
        </div>
        <div className="column is-one-quarter">
          <div className="field">
            <label className="label">
              Event end date
            </label>
            <div className="control">
              <DatePicker onChange={setEndDate} value={endDate}/>
            </div>
            <p className="help">optional: only in case of date range</p>
          </div>
        </div>
      </div>
      <InputRadioGroup
        name="occurrenceStatus"
        onChange={setOccurrenceStatus}
        options={['absent', 'present']}
        selectedValue={occurrenceStatus}
        title="Occurrence status"/>
      <InputRadioGroup
        name="basisOfRecord"
        onChange={setBasisOfRecord}
        options={['humanObservation', 'fossilSpecimen', 'livingSpecimen', 'machineSpecimen', 'preservedSpecimen']}
        selectedValue={basisOfRecord}
        title="Basis of record"/>
      <InputRadioGroup
        name="sex"
        onChange={setSex}
        options={['male', 'female', 'hermaphrodite', 'unspecified']}
        selectedValue={sex}
        title="Sex"/>
      <InputRadioGroup
        name="lifestage"
        onChange={setLifestage}
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

function InputRadio({ checked, text, name, onChange, value }) {
  const id = name + '-' + value
  return (
    <>
      <input
        className="is-checkradio"
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onClick={(e) => onChange(e.target.value)}
        value={value}/>
      <label htmlFor={id}>{text}</label>
    </>
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
