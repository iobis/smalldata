import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ContinueButton({ name, value, wrapperClassName, onClick }) {
  const { t } = useTranslation()

  return (
    <div className={wrapperClassName}>
      <button className="button is-info" name={name} onClick={onClick}>{t(value)}</button>
    </div>
  )
}

ContinueButton.propTypes = {

  name:             PropTypes.string,
  onClick:          PropTypes.func.isRequired,
  value:            PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string
}
