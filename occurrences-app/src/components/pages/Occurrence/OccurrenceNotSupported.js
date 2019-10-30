import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function OccurrenceNotSupported({ dwca, exception }) {
  const { t } = useTranslation()
  const [detailsVisible, setDetailsVisible] = useState(false)
  const toggleLabel = detailsVisible
    ? t('occurrenceForm.occurrenceNotSupported.hideDetails')
    : t('occurrenceForm.occurrenceNotSupported.showDetails')

  return (
    <section className="occurrence-not-supported section">
      <div className="notification is-danger">
        <div className="main-message">
          <div>
            {t('occurrenceForm.occurrenceNotSupported.message')}
            <Link to="/input-data/">{t('occurrenceForm.occurrenceNotSupported.linkMessage')}</Link>
          </div>
          <div>
            <button
              className="button is-danger is-inverted"
              onClick={() => setDetailsVisible(!detailsVisible)}>
              {toggleLabel}
            </button>
          </div>
        </div>
        {detailsVisible && (
          <div>
            <div className="exception-message">
              {t('occurrenceForm.occurrenceNotSupported.exceptionMessage', { message: exception.message })}
            </div>
            <pre className="dwca-object">
              {JSON.stringify(dwca, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}

OccurrenceNotSupported.propTypes = {
  dwca:      PropTypes.object.isRequired,
  exception: PropTypes.shape({
    message: PropTypes.string.isRequired,
    stack:   PropTypes.string.isRequired
  }).isRequired
}
