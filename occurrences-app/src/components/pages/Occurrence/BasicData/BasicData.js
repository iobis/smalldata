import React, { useState, useEffect, useRef } from 'react'
import bulmaCalendar from 'bulma-calendar'

export default function BasicData() {
  const [beginDate, setBeginDate] = useState(new Date())
  const [endDate, setEndDate] = useState(null)

  return (
    <div className="basic-dataset section is-fluid">
      <div className="field">
        <label className="label">Scientific name</label>
        <div className="control">
          <input className="input" type="text" placeholder="Text input"/>
        </div>
      </div>
      <div className="field">
        <label className="label">Event date begin</label>
        <DatePicker onChange={setBeginDate} value={beginDate}/>
      </div>
      <div className="field">
        <label className="label">
          Event date end
        </label>
        <div className="control">
          <DatePicker onChange={setEndDate} value={endDate}/>
        </div>
        <p className="help">optional: only in case of date range</p>
      </div>
      <div className="field">
        <label className="label">Occurrence status</label>
        <div className="control">
          <InputRadio text="absent" name="occurrence-status"/>
          <InputRadio text="present" name="occurrence-status"/>
        </div>
      </div>
      <div className="field">
        <label className="label">Basis of record</label>
        <div className="control">
          <InputRadio text="human observation" name="basis"/>
          <InputRadio text="fossil specimen" name="basis"/>
          <InputRadio text="living specimen" name="basis"/>
          <InputRadio text="machine specimen" name="basis"/>
          <InputRadio text="preserved specimen" name="basis"/>
        </div>
      </div>
      <div className="field">
        <label className="label">
          Sex <small>(optional)</small>
        </label>
        <div className="control">
          <InputRadio text="male" name="sex"/>
          <InputRadio text="female" name="sex"/>
          <InputRadio text="hermaphrodite" name="sex"/>
        </div>
      </div>
      <div className="field">
        <label className="label">
          Lifestage <small>(optional)</small>
        </label>
        <div className="control">
          <InputRadio text="egg" name="lifestage"/>
          <InputRadio text="eft" name="lifestage"/>
          <InputRadio text="juvenile" name="lifestage"/>
          <InputRadio text="adult" name="lifestage"/>
        </div>
      </div>
    </div>
  )
}

function InputRadio({ checked, text, name }) {
  return (
    <>
      <input className="is-checkradio" id={text} type="radio" name={name} checked={checked}/>
      <label htmlFor={text}>{text}</label>
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
