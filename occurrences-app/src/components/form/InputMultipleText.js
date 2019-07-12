import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function InputMultipleText({ className, name, values, onChange, labelComponent }) {
  const { t } = useTranslation()
  const [newValues, setNewValues] = useState(values)
  const [inputFieldValue, setInputFieldValue] = useState('')

  useEffect(() => {
    setNewValues(values)
  }, [values])

  const updateNewValues = (newValues) => {
    onChange(newValues)
    setNewValues(newValues)
  }

  return (
    <div className={classNames('column field', className)}>
      <label className="label">
        {t(name + '.label')}
      </label>
      <input
        className="input"
        onChange={(e) => setInputFieldValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setNewValues([...newValues, e.target.value])
            onChange([...newValues, e.target.value])
            setInputFieldValue('')
          }
        }}
        placeholder={t(name + '.placeholder')}
        type="text"
        value={inputFieldValue}/>
      <p className="help">{t(name + '.help')}</p>
      <Tags labelComponent={labelComponent} onDelete={updateNewValues} strings={newValues}/>
    </div>
  )
}

InputMultipleText.propTypes = {
  className:      PropTypes.string,
  labelComponent: PropTypes.func,
  name:           PropTypes.string.isRequired,
  onChange:       PropTypes.func.isRequired,
  values:         PropTypes.arrayOf(PropTypes.string).isRequired
}

function Tags({ strings, onDelete, labelComponent }) {
  return (
    <div className="block">
      {strings.map((string, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <span className="tag">
            {labelComponent ? labelComponent(string) : string}
            <button className="delete is-small" onClick={() => onDelete(deleteByIndex(index))}/></span>
        </div>
      ))}
    </div>
  )

  function deleteByIndex(index) {
    return [...strings.slice(0, index), ...strings.slice(index + 1)]
  }
}

Tags.propTypes = {
  labelComponent: PropTypes.func,
  onDelete:       PropTypes.func.isRequired,
  strings:        PropTypes.arrayOf(PropTypes.string).isRequired
}
