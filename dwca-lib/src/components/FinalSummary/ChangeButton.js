import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

export default function ChangeButton({ onClick }) {
  const { t } = useTranslation()
  return (
    <button className="change-button button" onClick={onClick}>
      {t('common.change')}
    </button>
  )
}

ChangeButton.propTypes = {
  onClick: PropTypes.func.isRequired
}
