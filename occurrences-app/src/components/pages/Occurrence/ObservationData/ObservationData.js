import CopyPreviousData from '../CopyPreviousData'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ObservationData({ onChange }) {
  const { t } = useTranslation()
  const [identifiedByNames, setIdentifiedByNames] = useState(['name 1', 'name 2'])
  const [identifiedByBy, setIdentifiedBy] = useState('')
  const [recordedByNames, setRecordedByNames] = useState(['name 1', 'name 2', 'name 3'])
  const [recordedBy, setRecordedBy] = useState('')
  const [references, setReferences] = useState(['https://google.com', 'https://gmail.com'])
  const [reference, setReference] = useState('')

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
            value={identifiedByBy}
            className="input"
            onChange={(e) => setIdentifiedBy(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIdentifiedByNames([...identifiedByNames, e.target.value])
                setIdentifiedBy('')
              }
            }}
            type="text"
            placeholder={t('occurrenceForm.observationData.identifiedBy.placeholder')}/>
          <p className="help">{t('occurrenceForm.observationData.identifiedBy.help')}</p>
          <Names names={identifiedByNames} onDelete={(names) => setIdentifiedByNames(names)}/>
        </div>
        <div className="column field is-3">
          <label className="label">
            {t('occurrenceForm.observationData.recordedBy.label')}
          </label>
          <input
            value={recordedBy}
            className="input"
            onChange={(e) => setRecordedBy(e.target.value)}
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setRecordedByNames([...recordedByNames, e.target.value])
                setRecordedBy('')
              }
            }}
            placeholder={t('occurrenceForm.observationData.recordedBy.placeholder')}/>
          <p className="help">{t('occurrenceForm.observationData.recordedBy.help')}</p>
          <Names names={recordedByNames} onDelete={(names) => setRecordedByNames(names)}/>
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
            className="textarea"
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
            value={reference}
            className="input"
            onChange={(e) => setReference(e.target.value)}
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setReferences([...references, e.target.value])
                setReference('')
              }
            }}
            placeholder={t('occurrenceForm.observationData.references.placeholder')}/>
          <p className="help">{t('occurrenceForm.observationData.references.help')}</p>
          <Names names={references} onDelete={(names) => setReferences(names)}/>
        </div>
      </div>
      <CopyPreviousData/>
    </div>
  )
}

ObservationData.propTypes = {
  onChange: PropTypes.func.isRequired
}

function Names({ names, onDelete }) {
  return (
    <div className="block">
      {names.map((name, index) =>
        <div key={index}>
          <span className="tag">
            {name}
            <button className="delete is-small" onClick={() => onDelete(deleteNameByIndex(index))}/></span>
        </div>
      )}
    </div>
  )

  function deleteNameByIndex(index) {
    return [...names.slice(0, index), ...names.slice(index + 1)]
  }
}

Names.propTypes = {
  names:    PropTypes.arrayOf(PropTypes.string).isRequired,
  onDelete: PropTypes.func.isRequired
}
