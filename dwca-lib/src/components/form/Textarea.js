import classNames from 'classnames'
import i18next from 'i18next'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Textarea({ className, name, onChange, value }) {
  const { t } = useTranslation()
  const label = t(name + '.label')
  const accessibilityId = label.replace(' ','').toLocaleLowerCase()
  const placeholderKey = name + '.placeholder'
  const helpKey = name + '.help'

  return (
    <div className={classNames('column field', className)}>
      <label className="label" htmlFor={accessibilityId}>
        {label}
      </label>
      <textarea
        className="textarea"
        id={accessibilityId}
        onChange={(e) => onChange(e.target.value)}
        placeholder={i18next.exists(placeholderKey) ? t(placeholderKey) : undefined}
        rows={5}
        value={value}/>
      {i18next.exists(helpKey) ? <p className="help">{t(helpKey)}</p> : null}
    </div>
  )
}

Textarea.propTypes = {
  className: PropTypes.string,
  name:      PropTypes.string.isRequired,
  onChange:  PropTypes.func.isRequired,
  value:     PropTypes.string.isRequired
}
