import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

export default function ContinueButton({ name, value, wrapperClassName, onContinueButtonClick }) {
  const { t } = useTranslation()

  return (
    <div className={wrapperClassName}>
      <button className="button is-info" name={name} onClick={onContinueButtonClick}>{t(value)}</button>
    </div>
  )
}

ContinueButton.propTypes = {

  name:                  PropTypes.string,
  onContinueButtonClick: PropTypes.func.isRequired,
  value:                 PropTypes.string.isRequired,
  wrapperClassName:      PropTypes.string
}
