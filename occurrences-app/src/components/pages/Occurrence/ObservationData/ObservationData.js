import CopyPreviousData from '../CopyPreviousData'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ObservationData({ onChange }) {
  const { t } = useTranslation()

  return (
    <div className="observation-data section is-fluid">
      <div className="columns">
        <div className="column field is-two-fifths">
          <label className="label">
            {t('occurrenceForm.observationData.institutionCode.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.institutionCode.placeholder')}/>
        </div>
        <div className="column field is-two-fifths">
          <label className="label">
            {t('occurrenceForm.observationData.collectionCode.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.collectionCode.placeholder')}/>
        </div>
      </div>
      <div className="columns">
        <div className="column field is-two-fifths">
          <label className="label">
            {t('occurrenceForm.observationData.fieldNumber.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.fieldNumber.placeholder')}/>
        </div>
        <div className="column field is-two-fifths">
          <label className="label">
            {t('occurrenceForm.observationData.catalogNumber.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.catalogNumber.placeholder')}/>
        </div>
        <div className="column field is-two-fifths">
          <label className="label">
            {t('occurrenceForm.observationData.recordNumber.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.recordNumber.placeholder')}/>
        </div>
      </div>
      <CopyPreviousData/>
    </div>
  )
}

ObservationData.propTypes = {
  onChange: PropTypes.func.isRequired
}
