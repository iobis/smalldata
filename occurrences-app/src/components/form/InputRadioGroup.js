import InputRadio from './InputRadio'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function InputRadioGroup({ onChange, selectedValue, name, options }) {
  const { t } = useTranslation()

  return (
    <div className="input-radio-group field">
      <label className="label">
        {t(name + '.title')}
      </label>
      <div className="control">
        {options.map(option => (
          <InputRadio
            key={option}
            checked={selectedValue === option}
            text={t(name + '.' + option)}
            name={name}
            onChange={onChange}
            value={option}/>
        ))}
      </div>
    </div>
  )
}

InputRadioGroup.propTypes = {
  name:          PropTypes.string.isRequired,
  onChange:      PropTypes.func.isRequired,
  options:       PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValue: PropTypes.string
}
