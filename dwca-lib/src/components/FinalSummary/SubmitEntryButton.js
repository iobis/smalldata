import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

export default function SubmitEntryButton({ onClick }) {
  const { t } = useTranslation()
  return (
    <div className="submit-entry-button columns is-mobile is-centered">
      <button className="button is-info is-medium" onClick={onClick}>
        {t('common.submit')}
      </button>
    </div>
  )
}

SubmitEntryButton.propTypes = {
  onClick: PropTypes.func.isRequired
}
