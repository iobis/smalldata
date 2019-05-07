import classNames from 'classnames'
import CopyPreviousData from '../CopyPreviousData'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getGeneralMeasurements, getSpecificMeasurements } from '../../../../clients/measurments'
import { useOnClickOutside } from '../../../../hooks/hooks'
import { useTranslation } from 'react-i18next'

export default function MeasurementOrFact({ onChange }) {
  const { t } = useTranslation()
  const generalMeasurements = getGeneralMeasurements()
  const specificMeasurements = getSpecificMeasurements()
  const [suppliedMeasurements, setSuppliedMeasurements] = useState([])

  function addSuppliedMeasurements(measurment) {
    const updatedMeasurements = [...suppliedMeasurements, measurment]
      .sort((left, right) => left.type.toLowerCase().localeCompare(right.type.toLowerCase()))
    setSuppliedMeasurements(updatedMeasurements)
  }

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
            {generalMeasurements.map(generalMeasurement => (
              <MeasurementRow
                key={generalMeasurement.type}
                onClickAdd={addSuppliedMeasurements}
                type={generalMeasurement.type}
                units={generalMeasurement.units}/>
            ))}
            </tbody>
          </table>
          <h1 className="title">{t('occurrenceForm.measurementOrFact.specific.title')}</h1>
          <h2 className="subtitle">{t('occurrenceForm.measurementOrFact.specific.subtitle')}</h2>
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
            {specificMeasurements.map(specificMeasurement => (
              <MeasurementRow
                key={specificMeasurement.type}
                onClickAdd={addSuppliedMeasurements}
                type={specificMeasurement.type}
                units={specificMeasurement.units}/>
            ))}
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
            {suppliedMeasurements.map(({ type, unit, value }) => (
              <tr className="fieldrow" key={type + unit + value}>
                <td>{type}</td>
                <td>{unit}</td>
                <td>{value}</td>
                <td><a className="button" onClick={() => {}}>remove</a></td>
              </tr>
            ))}
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

function MeasurementRow({ onClickAdd, type, units }) {
  const [selectedUnit, setSelectedUnit] = useState(units[0])
  const [selectedValue, setSelectedValue] = useState('')

  return (
    <tr className="fieldrow">
      <td>{type}</td>
      <td>
        <Dropdown
          onChange={(value) => setSelectedUnit(value)}
          options={units.map(unit => unit.name)}
          value={selectedUnit.name}/>
      </td>
      <td>
        <input
          className="input"
          onChange={(e) => setSelectedValue(e.target.value)}
          type="text"
          value={selectedValue}/>
      </td>
      <td>
        <a
          className="button"
          onClick={() => onClickAdd({ unit: selectedUnit.name, type, value: selectedValue })}>
          add
        </a>
      </td>
    </tr>
  )
}

MeasurementRow.propTypes = {
  onClickAdd: PropTypes.func.isRequired,
  type:       PropTypes.string.isRequired,
  units:      PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired
  })).isRequired
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
        <button aria-controls="dropdown-menu" aria-haspopup="true" className="button">
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
              href="#"
              key={option}
              onClick={() => handleChange(option)}>
              {option}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

Dropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  options:  PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  value:    PropTypes.string.isRequired
}
