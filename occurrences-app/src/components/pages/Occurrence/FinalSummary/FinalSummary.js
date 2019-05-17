import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function FinalSummary({ onChange, onSubmit }) {
  const { t } = useTranslation()

  return (
    <div className="final-summary section is-fluid">
      <h1 className="title">{t('occurrenceForm.finalSummary.title')}</h1>
    </div>
  )
}

FinalSummary.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}
