import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CopyPreviousData from '../CopyPreviousData'

export default function MeasurementOrFact({ data, onChange }) {
  const { t } = useTranslation()

  return (
    <div className="measurement-or-fact section is-fluid">
      <h1 className="title">{t('occurrenceForm.measurementOrFact.general.title')}</h1>
      <h2 className="subtitle">{t('occurrenceForm.measurementOrFact.general.subtitle')}</h2>
      <h1 className="title">{t('occurrenceForm.measurementOrFact.specific.title')}</h1>
      <h2 className="subtitle">{t('occurrenceForm.measurementOrFact.specific.subtitle')}</h2>
      <CopyPreviousData/>
    </div>
  )
}

MeasurementOrFact.propTypes = {
  onChange: PropTypes.func.isRequired
}
