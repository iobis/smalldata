import CopyPreviousData from '../CopyPreviousData'
import Dropdown from '../../../form/Dropdown'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import uuid from 'uuid/v4'
import { getGeneralMeasurements, getSpecificMeasurements } from '../../../../clients/measurments'
import { useTranslation } from 'react-i18next'

export default function MeasurementOrFact({ data, onChange }) {
  const { t } = useTranslation()
  const generalMeasurements = getGeneralMeasurements()
  const specificMeasurements = getSpecificMeasurements()
  const [suppliedMeasurements, setSuppliedMeasurements] = useState(data)

  function addSuppliedMeasurements(measurement) {
    const updatedMeasurements = [...suppliedMeasurements, measurement]
      .sort((left, right) => left.type.toLowerCase().localeCompare(right.type.toLowerCase()))
    onChange(updatedMeasurements.map(({ unit, units, type, value }) => ({ unit, units, type, value })))
    setSuppliedMeasurements(updatedMeasurements)
  }

  function removeSuppliedMeasurement(index) {
    const updatedMeasurements = suppliedMeasurements.filter((_, i) => i !== index)
      .sort((left, right) => left.type.toLowerCase().localeCompare(right.type.toLowerCase()))
    onChange(updatedMeasurements.map(({ unit, units, type, value }) => ({ unit, units, type, value })))
    setSuppliedMeasurements(updatedMeasurements)
  }

  function updateSuppliedMeasurement(index, updatedMeasurement) {
    const updatedMeasurements = suppliedMeasurements.map((measurment, i) => {
      return i === index
        ? updatedMeasurement
        : measurment
    })
    onChange(updatedMeasurements.map(({ unit, units, type, value }) => ({ unit, units, type, value })))
    setSuppliedMeasurements(updatedMeasurements)
  }

  return (
    <div className="measurement-or-fact section is-fluid">
      <div className="columns">
        <div className="column is-half">
          <h1 className="title">{t('occurrenceForm.measurementOrFact.general.title')}</h1>
          <h2 className="subtitle">{t('occurrenceForm.measurementOrFact.general.subtitle')}</h2>
          <table className="general table is-fullwidth is-striped is-hoverable">
            <thead>
            <tr>
              <th style={{ width: '60%' }}>{t('common.type')}</th>
              <th style={{ width: '20%' }}>{t('common.unit')}</th>
              <th style={{ width: '10%' }}>{t('common.value')}</th>
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
          <table className="specific table is-fullwidth is-striped is-hoverable">
            <thead>
            <tr>
              <th style={{ width: '60%' }}>{t('common.type')}</th>
              <th style={{ width: '20%' }}>{t('common.unit')}</th>
              <th style={{ width: '10%' }}>{t('common.value')}</th>
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
          <table className="supplied table is-fullwidth is-striped is-hoverable">
            <thead>
            <tr>
              <th style={{ width: '60%' }}>{t('common.type')}</th>
              <th style={{ width: '20%' }}>{t('common.unit')}</th>
              <th style={{ width: '10%' }}>{t('common.value')}</th>
              <th style={{ width: '5%' }}/>
              <th style={{ width: '5%' }}/>
            </tr>
            </thead>
            <tbody>
            {suppliedMeasurements.map(({ id, type, unit, units, value }, index) => (
              <SuppliedMeasurementRow
                key={id}
                onChange={(updatedMeasurement) => updateSuppliedMeasurement(index, { id, ...updatedMeasurement })}
                onCopy={addSuppliedMeasurements}
                onRemove={() => removeSuppliedMeasurement(index)}
                type={type}
                unit={unit}
                units={units}
                value={value}/>
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
  data:     PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

function MeasurementRow({ onClickAdd, type, units }) {
  const { t } = useTranslation()
  const [selectedUnit, setSelectedUnit] = useState(units[0].name)
  const [selectedValue, setSelectedValue] = useState('')

  return (
    <tr className="measurement-row fieldrow">
      <td>{type}</td>
      <td>
        <Dropdown
          onChange={(value) => setSelectedUnit(value)}
          options={units.map(unit => unit.name)}
          value={selectedUnit}/>
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
          className="add button"
          onClick={() => onClickAdd({ id: uuid(), unit: selectedUnit, units, type, value: selectedValue })}>
          {t('common.add')}
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

function SuppliedMeasurementRow({ onChange, onCopy, onRemove, type, unit, units, value }) {
  const { t } = useTranslation()
  const [selectedValue, setSelectedValue] = useState(value)
  const [selectedUnit, setSelectedUnit] = useState(unit)

  function handleUnitChange(selectedUnit) {
    setSelectedUnit(selectedUnit)
    onChange({ type, unit: selectedUnit, units, value: selectedValue })
  }

  function handleValueChange(selectedValue) {
    setSelectedValue(selectedValue)
    onChange({ type, unit: selectedUnit, units, value: selectedValue })
  }

  return (
    <tr className="fieldrow">
      <td className="type">{type}</td>
      <td>
        <Dropdown
          onChange={handleUnitChange}
          options={units.map(unit => unit.name)}
          value={selectedUnit}/>
      </td>
      <td>
        <input
          className="input"
          onChange={(e) => handleValueChange(e.target.value)}
          type="text"
          value={selectedValue}/>
      </td>
      <td>
        <a className="copy button" onClick={() => onCopy({ id: uuid(), type, unit, units, value })}>
          {t('common.copy')}
        </a>
      </td>
      <td>
        <a className="remove button" onClick={onRemove}>
          {t('common.remove')}
        </a>
      </td>
    </tr>
  )
}

SuppliedMeasurementRow.propTypes = {
  onChange: PropTypes.func.isRequired,
  onCopy:   PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  type:     PropTypes.string.isRequired,
  unit:     PropTypes.string.isRequired,
  units:    PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired
  })).isRequired,
  value:    PropTypes.string.isRequired
}
