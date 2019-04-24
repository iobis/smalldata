import classNames from 'classnames'
import i18next from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Textarea({ className, name, onChange }) {
  const { t } = useTranslation()
  const label = t(name + '.label')
  const placeholderKey = name + '.placeholder'
  const helpKey = name + '.help'

  return (
    <div className={classNames('column field', className)}>
      <label className="label">
        {label}
      </label>
      <textarea
        className="textarea"
        onChange={onChange}
        rows={5}
        placeholder={i18next.exists(placeholderKey) ? t(placeholderKey) : undefined}/>
      {i18next.exists(helpKey) ? <p className="help">{t(helpKey)}</p> : null}
    </div>
  )
}

