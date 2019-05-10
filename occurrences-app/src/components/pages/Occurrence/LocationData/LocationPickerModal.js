import LocationPicker from './LocationPicker'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LocationPickerModal() {
  const { t } = useTranslation()

  return (
    <div className="location-picker-modal modal is-active modal-full-screen">
      <div className="modal-background"/>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{t('occurrenceForm.locationData.locationPicker.title')}</p>
          <button aria-label="close" className="delete"/>
        </header>
        <section className="modal-card-body">
          <LocationPicker/>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success">Save changes</button>
          <button className="button">Cancel</button>
        </footer>
      </div>
    </div>
  )
}
