import React from 'react'

export default function BasicData() {
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
        <div className="control">
          <input className="input" type="text" placeholder="Text input"/>
        </div>
      </div>
      <div className="field">
        <label className="label">
          Event date end
        </label>
        <div className="control">
          <input className="input" type="text" placeholder="Text input"/>
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
          Sex
          <small>(optional)</small>
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

function InputRadio({ text, name }) {
  return (
    <label className="radio">
      <input type="radio" name={name}/>
      {text}
    </label>
  )
}
