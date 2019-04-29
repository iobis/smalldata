import classNames from 'classnames'
import i18next from 'i18next'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function InputText({ className, name, onChange, value }) {
  const { t } = useTranslation()
  const label = t(name + '.label')
  const placeholderKey = name + '.placeholder'
  const helpKey = name + '.help'

  return (
    <div className={classNames('column field', className)}>
      <label className="label">
        {label}
      </label>
      <input
        className="input"
        onChange={(e) => onChange(e.target.value)}
        placeholder={i18next.exists(placeholderKey) ? t(placeholderKey) : undefined}
        type="text"
        value={value}/>
      {i18next.exists(helpKey) ? <p className="help">{t(helpKey)}</p> : null}
    </div>
  )
}

InputText.propTypes = {
  className: PropTypes.string,
  name:      PropTypes.string.isRequired,
  onChange:  PropTypes.func.isRequired,
  value:     PropTypes.string
}
