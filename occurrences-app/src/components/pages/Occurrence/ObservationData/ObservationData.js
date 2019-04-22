import CopyPreviousData from '../CopyPreviousData'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ObservationData({ onChange }) {
  const { t } = useTranslation()

  return (
    <div className="observation-data section is-fluid">
      <div className="columns">
        <div className="column field is-3">
          <label className="label">
            {t('occurrenceForm.observationData.institutionCode.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.institutionCode.placeholder')}/>
        </div>
        <div className="column field is-3">
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
        <div className="column field is-3">
          <label className="label">
            {t('occurrenceForm.observationData.fieldNumber.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.fieldNumber.placeholder')}/>
        </div>
        <div className="column field is-3">
          <label className="label">
            {t('occurrenceForm.observationData.catalogNumber.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.catalogNumber.placeholder')}/>
        </div>
        <div className="column field is-3">
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
      <div className="columns">
        <div className="column field is-3">
          <label className="label">
            {t('occurrenceForm.observationData.identifiedBy.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.identifiedBy.placeholder')}/>
          <p className="help">{t('occurrenceForm.observationData.identifiedBy.help')}</p>
        </div>
        <div className="column field is-3">
          <label className="label">
            {t('occurrenceForm.observationData.recordedBy.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.recordedBy.placeholder')}/>
          <p className="help">{t('occurrenceForm.observationData.recordedBy.help')}</p>
        </div>
      </div>
      <div className="columns">
        <div className="column field is-9">
          <label className="label">
            {t('occurrenceForm.observationData.identificationQualifier.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.identificationQualifier.placeholder')}/>
          <p className="help">{t('occurrenceForm.observationData.identificationQualifier.help')}</p>
        </div>
      </div>
      <div className="columns">
        <div className="column field is-9">
          <label className="label">
            {t('occurrenceForm.observationData.identificationRemarks.label')}
          </label>
          <textarea
            class="textarea"
            onChange={onChange}
            rows={5}
            placeholder={t('occurrenceForm.observationData.identificationRemarks.placeholder')}/>
          <p className="help">{t('occurrenceForm.observationData.identificationRemarks.help')}</p>
        </div>
      </div>
      <div className="columns">
        <div className="column field is-9">
          <label className="label">
            {t('occurrenceForm.observationData.references.label')}
          </label>
          <input
            className="input"
            onChange={onChange}
            type="text"
            placeholder={t('occurrenceForm.observationData.references.placeholder')}/>
          <p className="help">{t('occurrenceForm.observationData.references.help')}</p>
        </div>
      </div>
      <CopyPreviousData/>
    </div>
  )
}

ObservationData.propTypes = {
  onChange: PropTypes.func.isRequired
}
