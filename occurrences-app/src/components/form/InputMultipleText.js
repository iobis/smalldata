import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function InputMultipleText({ className, name, values, onChange, labelComponent }) {
  const { t } = useTranslation()
  const [newValues, setNewValues] = useState(values)
  const [inputFieldValue, setInputFieldValue] = useState('')

  return (
    <div className={classNames('column field', className)}>
      <label className="label">
        {t(name + '.label')}
      </label>
      <input
        value={inputFieldValue}
        className="input"
        onChange={(e) => setInputFieldValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setNewValues([...newValues, e.target.value])
            onChange([...newValues, e.target.value])
            setInputFieldValue('')
          }
        }}
        type="text"
        placeholder={t(name + '.placeholder')}/>
      <p className="help">{t(name + '.help')}</p>
      <Tags labelComponent={labelComponent} strings={newValues} onDelete={(names) => setNewValues(names)}/>
    </div>
  )
}

function Tags({ strings, onDelete, labelComponent }) {
  return (
    <div className="block">
      {strings.map((string, index) =>
        <div key={index}>
          <span className="tag">
            {labelComponent ? labelComponent(string) : string}
            <button className="delete is-small" onClick={() => onDelete(deleteByIndex(index))}/></span>
        </div>
      )}
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
