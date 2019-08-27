import React from 'react'
import { useTranslation } from 'react-i18next'

export default function HelpPage() {
  const { t } = useTranslation()

  return <div className="helppage"><h3 className="title is-3">  Entering large datasets</h3><p>In case of large datasets being inserted, please <a href={t('helpPage.contactEmail')}>contact
    your node manager</a> for a more efficient method. In case of technical difficulties, please do the same</p></div>
}
