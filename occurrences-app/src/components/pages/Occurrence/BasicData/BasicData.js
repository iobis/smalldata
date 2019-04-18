import React, { useState, useEffect, useRef } from 'react'
import bulmaCalendar from 'bulma-calendar'

export default function BasicData() {
  const [beginDate, setBeginDate] = useState(new Date())
  const [endDate, setEndDate] = useState(null)
  const [occurrenceStatus, setOccurrenceStatus] = useState(null)
  const [basisOfRecord, setBasisOfRecord] = useState(null)
  const [sex, setSex] = useState(null)
  const [lifestage, setLifestage] = useState(null)

  return (
    <div className="basic-dataset section is-fluid">
      <div className="field">
        <label className="label">Scientific name</label>
        <div className="control">
          <input className="input" type="text" placeholder="Text input"/>
        </div>
      </div>
      <div className="columns">
        <div className="column is-one-third">
          <div className="field">
            <label className="label">Event begin date</label>
            <DatePicker onChange={setBeginDate} value={beginDate}/>
          </div>
        </div>
        <div className="column is-one-third">
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
      <div className="field">
        <label className="label">Occurrence status</label>
        <div className="control">
          <InputRadio
            checked={occurrenceStatus === 'absent'}
            name="occurrence-status"
            onChange={setOccurrenceStatus}
            text="absent"
            value="absent"/>
          <InputRadio
            checked={occurrenceStatus === 'present'}
            name="occurrence-status"
            onChange={setOccurrenceStatus}
            text="present"
            value="present"/>
        </div>
      </div>
      <div className="field">
        <label className="label">Basis of record</label>
        <div className="control">
          <InputRadio
            checked={basisOfRecord === 'humanObservation'}
            name="basis"
            onChange={setBasisOfRecord}
            text="human observation"
            value="humanObservation"/>
          <InputRadio
            checked={basisOfRecord === 'fossilSpecimen'}
            text="fossil specimen"
            name="basis"
            onChange={setBasisOfRecord}
            value="fossilSpecimen"/>
          <InputRadio
            checked={basisOfRecord === 'livingSpecimen'}
            text="living specimen"
            name="basis"
            onChange={setBasisOfRecord}
            value="livingSpecimen"/>
          <InputRadio
            checked={basisOfRecord === 'machineSpecimen'}
            text="machine specimen"
            name="basis"
            onChange={setBasisOfRecord}
            value="machineSpecimen"/>
          <InputRadio
            checked={basisOfRecord === 'preservedSpecimen'}
            text="preserved specimen"
            name="basis"
            onChange={setBasisOfRecord}
            value="preservedSpecimen"/>
        </div>
      </div>
      <div className="field">
        <label className="label">
          Sex <small>(optional)</small>
        </label>
        <div className="control">
          <InputRadio
            checked={sex === 'male'}
            text="male"
            name="sex"
            onChange={setSex}
            value="male"/>
          <InputRadio
            checked={sex === 'female'}
            text="female"
            name="sex"
            onChange={setSex}
            value="female"/>
          <InputRadio
            checked={sex === 'hermaphrodite'}
            text="hermaphrodite"
            name="sex"
            onChange={setSex}
            value="hermaphrodite"/>
        </div>
      </div>
      <div className="field">
        <label className="label">
          Lifestage <small>(optional)</small>
        </label>
        <div className="control">
          <InputRadio
            checked={lifestage === 'egg'}
            text="egg"
            name="lifestage"
            onChange={setLifestage}
            value="egg"/>
          <InputRadio
            checked={lifestage === 'eft'}
            text="eft"
            name="lifestage"
            onChange={setLifestage}
            value="eft"/>
          <InputRadio
            checked={lifestage === 'juvenile'}
            text="juvenile"
            name="lifestage"
            onChange={setLifestage}
            value="juvenile"/>
          <InputRadio
            checked={lifestage === 'adult'}
            text="adult"
            name="lifestage"
            onChange={setLifestage}
            value="adult"/>
        </div>
      </div>
    </div>
  )
}

function InputRadio({ checked, text, name, onChange, value }) {
  return (
    <>
      <input
        className="is-checkradio"
        id={text}
        type="radio"
        name={name}
        checked={checked}
        onClick={(e) => onChange(e.target.value)}
        value={value}/>
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
