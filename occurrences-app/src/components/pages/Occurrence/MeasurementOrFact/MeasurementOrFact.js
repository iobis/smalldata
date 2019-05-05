import classNames from 'classnames'
import CopyPreviousData from '../CopyPreviousData'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOnClickOutside } from '../../../../hooks/hooks'

export default function MeasurementOrFact({ data, onChange }) {
  const { t } = useTranslation()
  const generalMeasurements = [{
    type:  'temperature',
    units: ['celsius', 'kelvin']
  }, {
    type:  'acidity',
    units: ['celsius', 'kelvin']
  }]
  const specificMeasurements = [{
    type:  'abundance per volume',
    units: ['celsius', 'kelvin']
  }, {
    type:  'abundance per area',
    units: ['celsius', 'kelvin']
  }]

  return (
    <div className="measurement-or-fact section is-fluid">
      <h1 className="title">{t('occurrenceForm.measurementOrFact.general.title')}</h1>
      <h2 className="subtitle">{t('occurrenceForm.measurementOrFact.general.subtitle')}</h2>
      <table className="table is-fullwidth">
        <thead>
        <tr>
          <th>type</th>
          <th>unit</th>
          <th>value</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {generalMeasurements.map(generalMeasurement =>
          <tr className="fieldrow" key={generalMeasurement.type}>
            <td>{generalMeasurement.type}</td>
            <td>
              <Dropdown
                onChange={(value) => console.log(value)}
                options={generalMeasurement.units}
                value={generalMeasurement.units[0]}/>
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
      <table className="table is-fullwidth">
        <thead>
        <tr>
          <th>type</th>
          <th>unit</th>
          <th>value</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {specificMeasurements.map(specificMeasurement =>
          <tr className="fieldrow" key={specificMeasurement.type}>
            <td>{specificMeasurement.type}</td>
            <td>
              <Dropdown
                onChange={(value) => console.log(value)}
                options={specificMeasurement.units}
                value={specificMeasurement.units[0]}/>
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
