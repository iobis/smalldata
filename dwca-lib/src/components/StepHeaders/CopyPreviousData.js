import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function CopyPreviousData({ onClick, visible }) {
  const { t } = useTranslation()
  const label = visible
    ? t('occurrenceForm.copyPreviousStep')
    : ''

  return (
    <div className="columns">
      <div className="copy-previous-data column is-narrow" onClick={onClick}>{label}</div>
    </div>
  )
}

CopyPreviousData.propTypes = {
  onClick: PropTypes.func,
  visible: PropTypes.bool.isRequired
}
