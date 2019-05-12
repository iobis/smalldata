import PropTypes from 'prop-types'
import React, { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as MarineSpeciesClient from '../../../../clients/MarineSpeciesClient'
import { useDebounce, useOnClickOutside } from '../../../../hooks/hooks'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

export default function ScientificNameInput({ scientificName, onChange }) {
  const { t } = useTranslation()
  const ref = useRef()
  const [firstRender, setFirstRender] = useState(true)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(scientificName)
  const [nameValid, setNameValid] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [dropdownActive, setDropdownActive] = useState(false)
  const hideDropdownOptions = () => setDropdownActive(false)
  const showDropdownOption = () => {if (dropdownActive === false) setDropdownActive(true)}
  const debouncedName = useDebounce(name, 500)
  const isRecordWithName = (record, name) => (record.scientificname || '').trim().toLowerCase() === (name || '').trim().toLowerCase()
  const findRecordWithName = (records, name) => records.find(record => isRecordWithName(record, name))

  useOnClickOutside(ref, hideDropdownOptions)

  useEffect(() => {
    const getByName = async() => {
      setLoading(true)
      const newSuggestions = await MarineSpeciesClient.getByName(name)
      const newNameValid = !!findRecordWithName(newSuggestions, name)
      setSuggestions(newSuggestions)
      setNameValid(newNameValid)
      if (!newNameValid && newSuggestions.length > 0) showDropdownOption()
      setLoading(false)
      setFirstRender(false)
    }

    if (debouncedName) getByName()
  }, [debouncedName])

  function handleNameChange(newName) {
    if(newName === '') setNameValid(false)
    onChange(newName)
    setName(newName)
  }

  function handleSuggestionClick(newName) {
    hideDropdownOptions()
    onChange(newName)
    setName(newName)
  }

  return (
    <div className="field column is-four-fifths" ref={ref}>
      <div className={classNames('dropdown', { 'is-active': dropdownActive && suggestions.length > 0 })}>
        <div className="dropdown-trigger">
          <label className="label">{t('occurrenceForm.occurrenceData.scientificName')}</label>
          <div className={classNames('control has-icons-right', { 'is-loading': loading })}>
            <input
              className={classNames('input', { 'is-danger': !firstRender && !nameValid && !dropdownActive})}
              onChange={(value) => handleNameChange(value.target.value)}
              onClick={showDropdownOption}
              placeholder={t('occurrenceForm.occurrenceData.scientificName')}
              type="text"
              value={name}/>
            {nameValid && !loading
              ? <span className="clear icon is-small is-right"><FontAwesomeIcon className="check" icon="check"/></span>
              : null}
          </div>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {suggestions.map(record => (
              <div
                className={classNames('dropdown-item', { 'is-active': isRecordWithName(record, name) })}
                key={record.lsid}
                onClick={() => handleSuggestionClick(record.scientificname)}>
                {record.scientificname}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

ScientificNameInput.propTypes = {
  onChange:       PropTypes.func.isRequired,
  scientificName: PropTypes.string.isRequired
}