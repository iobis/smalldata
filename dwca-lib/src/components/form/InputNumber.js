import classNames from 'classnames'
import i18next from 'i18next'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function InputNumber({ className, name, onChange, optional, value, step }) {
  const { t } = useTranslation()
  const label = t(name + '.label')
  const placeholderKey = name + '.placeholder'
  const helpKey = name + '.help'

  return (
    <div className={classNames('column field', className)}>
      <label className={classNames('label', { 'has-text-weight-normal': optional })}>
        {label}
      </label>
      <input
        className="input"
        onChange={(e) => onChange(parseFloat(e.target.value))}
        placeholder={i18next.exists(placeholderKey) ? t(placeholderKey) : undefined}
        step={step}
        type="number"
        value={value === undefined || value === null ? '' : value}/>
      {i18next.exists(helpKey) ? <p className="help">{t(helpKey)}</p> : null}
    </div>
  )
}

InputNumber.propTypes = {
  className: PropTypes.string,
  name:      PropTypes.string.isRequired,
  onChange:  PropTypes.func.isRequired,
  optional:  PropTypes.bool,
  step:      PropTypes.number,
  value:     PropTypes.number
}
