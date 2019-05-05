import classNames from 'classnames'
import { getGeneralMeasurements, getSpecificMeasurements } from '../../../../clients/measurments'
import CopyPreviousData from '../CopyPreviousData'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOnClickOutside } from '../../../../hooks/hooks'

export default function MeasurementOrFact({ data, onChange }) {
  const { t } = useTranslation()
  const generalMeasurements = getGeneralMeasurements()
  const specificMeasurements = getSpecificMeasurements()
  const suppliedMeasurements = [{
    type:   'Temperature',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/TEMPCU01/',
    units:  [{ name: 'Degrees Celsius', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UPAA' }],
    value:  '10'
  }]

  return (
    <div className="measurement-or-fact section is-fluid">
      <div className="columns">
        <div className="column is-half">
          <h1 className="title">{t('occurrenceForm.measurementOrFact.general.title')}</h1>
          <h2 className="subtitle">{t('occurrenceForm.measurementOrFact.general.subtitle')}</h2>
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
            <tr>
              <th style={{ width: '60%' }}>type</th>
              <th style={{ width: '20%' }}>unit</th>
              <th style={{ width: '10%' }}>value</th>
              <th style={{ width: '10%' }}/>
            </tr>
            </thead>
            <tbody>
            {generalMeasurements.map(generalMeasurement =>
              <tr className="fieldrow" key={generalMeasurement.type}>
                <td>{generalMeasurement.type}</td>
                <td>
                  <Dropdown
                    onChange={(value) => console.log(value)}
                    options={generalMeasurement.units.map(unit => unit.name)}
                    value={generalMeasurement.units[0].name}/>
                </td>
                <td>
                  <input
                    className="input"
                    onChange={(e) => onChange(e.target.value)}
                    type="text"
                    value=""/>
                </td>
                <td><a className="button" onClick={() => {}}>add</a></td>
              </tr>
            )}
            </tbody>
          </table>
          <h1 className="title">{t('occurrenceForm.measurementOrFact.specific.title')}</h1>
          <h2 className='subtitle'>{t('occurrenceForm.measurementOrFact.specific.subtitle')}</h2>
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
            <tr>
              <th style={{ width: '60%' }}>type</th>
              <th style={{ width: '20%' }}>unit</th>
              <th style={{ width: '10%' }}>value</th>
              <th style={{ width: '10%' }}/>
            </tr>
            </thead>
            <tbody>
            {specificMeasurements.map(specificMeasurement =>
              <tr className="fieldrow" key={specificMeasurement.type}>
                <td>{specificMeasurement.type}</td>
                <td>
                  <Dropdown
                    onChange={(value) => console.log(value)}
                    options={specificMeasurement.units.map(unit => unit.name)}
                    value={specificMeasurement.units[0].name}/>
                </td>
                <td>
                  <input
                    className="input"
                    onChange={(e) => onChange(e.target.value)}
                    type="text"
                    value=""/>
                </td>
                <td><a className="button" onClick={() => {}}>add</a></td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        <div className="column is-half supplied">
          <h1 className="title">{t('occurrenceForm.measurementOrFact.supplied.title')}</h1>
          <h2 className="subtitle">&nbsp;</h2>
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
            <tr>
              <th style={{ width: '60%' }}>type</th>
              <th style={{ width: '20%' }}>unit</th>
              <th style={{ width: '10%' }}>value</th>
              <th style={{ width: '10%' }}/>
            </tr>
            </thead>
            <tbody>
            {suppliedMeasurements.map(suppliedMeasurements =>
              <tr className="fieldrow" key={suppliedMeasurements.type}>
                <td>{suppliedMeasurements.type}</td>
                <td>
                  <Dropdown
                    onChange={(value) => console.log(value)}
                    options={suppliedMeasurements.units.map(unit => unit.name)}
                    value={suppliedMeasurements.units[0].name}/>
                </td>
                <td>
                  <input
                    className="input"
                    onChange={(e) => onChange(e.target.value)}
                    type="text"
                    value={suppliedMeasurements.value}/>
                </td>
                <td><a className="button" onClick={() => {}}>remove</a></td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
      <CopyPreviousData/>
    </div>
  )
}

MeasurementOrFact.propTypes = {
  onChange: PropTypes.func.isRequired
}

function Dropdown({ value, options, onChange }) {
  const ref = useRef()
  const [active, setActive] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value)
  const hideOptions = () => setActive(false)
  const showOptions = () => {if (active === false) setActive(true)}
  const handleChange = (item) => {
    onChange(item)
    setSelectedValue(item)
    setActive(false)
  }

  useOnClickOutside(ref, hideOptions)

  return (
    <div className={classNames('dropdown', { 'is-active': active })} onClick={showOptions} ref={ref}>
      <div className="dropdown-trigger">
        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
          <span>{selectedValue}</span>
          <span className="icon is-small">
            <FontAwesomeIcon className="angle-down" icon="angle-down"/>
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {options.map(option => (
            <a
              className={classNames('dropdown-item', { 'is-active': option === selectedValue })}
              key={option}
              href="#"
              onClick={() => handleChange(option)}>
              {option}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
