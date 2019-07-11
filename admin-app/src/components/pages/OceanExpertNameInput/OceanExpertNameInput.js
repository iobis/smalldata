import * as OceanExpertClient from '../../../clients/OceanExpertClient'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDebounce, useOnClickOutside } from '@smalldata/dwca-lib'
import { useTranslation } from 'react-i18next'

export default function OceanExpertNameInput({ oceanExpertName, onChange }) {
  const { t } = useTranslation()
  const ref = useRef()
  const [firstRender, setFirstRender] = useState(true)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(oceanExpertName)
  const [nameValid, setNameValid] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [dropdownActive, setDropdownActive] = useState(false)
  const hideDropdownOptions = () => setDropdownActive(false)
  const showDropdownOption = () => {if (dropdownActive === false) setDropdownActive(true)}
  const debouncedName = useDebounce(name, 500)
  const isRecordWithName = (record, name) => (record.name || '').trim().toLowerCase() === (name || '').trim().toLowerCase()
  const findRecordWithName = (records, name) => records.find(record => isRecordWithName(record, name))

  useOnClickOutside(ref, hideDropdownOptions)

  useEffect(() => setName(oceanExpertName), [oceanExpertName])

  useEffect(() => {
    const getByName = async() => {
      setLoading(true)
      const newSuggestions = await OceanExpertClient.getByExpertByName(name)
      const newNameValid = !!findRecordWithName(newSuggestions, name)
      setSuggestions(newSuggestions)
      setNameValid(newNameValid)
      if (!newNameValid && newSuggestions.length > 0) showDropdownOption()
      setLoading(false)
      setFirstRender(false)
    }

    if (debouncedName) getByName()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName])

  function handleNameChange(newName) {
    if (newName === '') setNameValid(false)
    const profile = {
      name: newName || ''
    }
    onChange(profile)
    setName(newName)
  }

  function handleSuggestionClick(user) {
    hideDropdownOptions()
    const profile = {
      name: user.name || ''
    }
    onChange(profile)
    setName(user.name)
  }

  return (
    <div className="field column is-four-fifths" ref={ref}>
      <div className={classNames('dropdown', { 'is-active': dropdownActive && suggestions.length > 0 })}>
        <div className="dropdown-trigger">
          <label className="label">{t('userFormPage.name.label')}</label>
          <div className={classNames('control has-icons-right', { 'is-loading': loading })}>
            <input
              className={classNames('input', { 'is-danger': !firstRender && !nameValid && !dropdownActive })}
              onChange={(value) => handleNameChange(value.target.value)}
              onClick={showDropdownOption}
              placeholder=""
              type="text"
              value={name}/>
            {nameValid && !loading
              ? <span className="clear icon is-small is-right"><FontAwesomeIcon className="check" icon="check"/></span>
              : null}
          </div>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {suggestions.filter(record => !!record.name).map(record => (
              <div
                className={classNames('dropdown-item', { 'is-active': isRecordWithName(record, name) })}
                key={record['id_inst'] + record.name}
                onClick={() => handleSuggestionClick(record)}>
                {record.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

OceanExpertNameInput.propTypes = {
  oceanExpertName: PropTypes.string.isRequired,
  onChange:        PropTypes.func.isRequired
}
