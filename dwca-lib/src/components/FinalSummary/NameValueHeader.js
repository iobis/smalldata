import React from 'react'
import { useTranslation } from 'react-i18next'

export default function NameValueHeader() {
  const { t } = useTranslation()
  return (
    <thead>
      <tr>
        <th className="type">{t('common.name')}</th>
        <th className="value">{t('common.value')}</th>
      </tr>
    </thead>
  )
}
