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
          Event date end <small>(optional: only in case of date range)</small>
        </label>
        <div className="control">
          <input className="input" type="text" placeholder="Text input"/>
        </div>
      </div>
      <div className="field">
        <label className="label">Occurrence status</label>
        <div className="control">
          <label className="radio">
            <input type="radio" name="occurrence-status"/>
            absent
          </label>
          <label className="radio">
            <input type="radio" name="occurrence-status"/>
            present
          </label>
        </div>
      </div>
      <div className="field">
        <label className="label">Basis of record</label>
        <div className="control">
          <label className="radio">
            <input type="radio" name="basis"/>
            human observation
          </label>
          <label className="radio">
            <input type="radio" name="basis"/>
            fossil specimen
          </label>
          <label className="radio">
            <input type="radio" name="basis"/>
            living specimen
          </label>
          <label className="radio">
            <input type="radio" name="basis"/>
            machine specimen
          </label>
          <label className="radio">
            <input type="radio" name="basis"/>
            preserved specimen
          </label>
        </div>
      </div>
      <div className="field">
        <label className="label">
          Sex
          <small>(optional)</small>
        </label>
        <div className="control">
          <label className="radio">
            <input type="radio" name="sex"/>
            male
          </label>
          <label className="radio">
            <input type="radio" name="sex"/>
            female
          </label>
          <label className="radio">
            <input type="radio" name="sex"/>
            hermaphrodite
          </label>
        </div>
      </div>
      <div className="field">
        <label className="label">
          Lifestage
          <small>(optional)</small>
        </label>
        <div className="control">
          <label className="radio">
            <input type="radio" name="lifestage"/>
            egg
          </label>
          <label className="radio">
            <input type="radio" name="lifestage"/>
            eft
          </label>
          <label className="radio">
            <input type="radio" name="lifestage"/>
            juvenile
          </label>
          <label className="radio">
            <input type="radio" name="lifestage"/>
            adult
          </label>
        </div>
      </div>
    </div>
  )
}
