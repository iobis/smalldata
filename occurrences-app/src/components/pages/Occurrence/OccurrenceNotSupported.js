import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function OccurrenceNotSupported({ dwca }) {
  const { t } = useTranslation()

  return (
    <section className="occurrence-not-supported section">
      <div className="notification is-danger">
        <div className="main-message">
          {t('occurrenceForm.occurrenceNotSupported.message')}
          <Link to="/input-data/">{t('occurrenceForm.occurrenceNotSupported.linkMessage')}</Link>
        </div>
        <pre>
          {JSON.stringify(dwca, null, 2)}
        </pre>
      </div>
    </section>
  )
}

OccurrenceNotSupported.propTypes = {
  dwca: PropTypes.object.isRequired
}
