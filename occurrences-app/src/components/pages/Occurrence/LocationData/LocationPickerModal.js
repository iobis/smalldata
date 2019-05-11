import classNames from 'classnames'
import LocationPicker from './LocationPicker'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LocationPickerModal({ active, onClose, onChange }) {
  const { t } = useTranslation()
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 })

  return (
    <div className={classNames('location-picker-modal modal', { 'is-active': active })}>
      <div className="modal-background"/>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{t('occurrenceForm.locationData.locationPicker.title')}</p>
          <button aria-label="close" className="delete" onClick={() => onClose()}/>
        </header>
        <section className="modal-card-body">
          <LocationPicker onChange={(location) => setLocation(location)}/>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={() => onChange(location)}>{t('common.confirm')}</button>
          <button className="button" onClick={() => onClose()}>{t('common.cancel')}</button>
        </footer>
      </div>
    </div>
  )
}

LocationPickerModal.propTypes = {
  active:   PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose:  PropTypes.func.isRequired
}
