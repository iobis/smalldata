import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ContinueButton({ name, value, onClick }) {
  const { t } = useTranslation()
  const label = t('occurrenceForm.stepContinue') + ' ' + value.toLowerCase()

  return <button className="button is-info" name={name} onClick={onClick}>{label}</button>
}

ContinueButton.propTypes = {
  name:    PropTypes.string,
  onClick: PropTypes.func.isRequired,
  value:   PropTypes.string.isRequired
}
