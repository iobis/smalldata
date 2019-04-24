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
        <InputText name="occurrenceForm.observationData.institutionCode" onChange={onChange}/>
        <InputText name="occurrenceForm.observationData.collectionCode" onChange={onChange}/>
      </div>
      <div className="columns">
        <InputText name="occurrenceForm.observationData.fieldNumber" onChange={onChange}/>
        <InputText name="occurrenceForm.observationData.catalogNumber" onChange={onChange}/>
        <InputText name="occurrenceForm.observationData.recordNumber" onChange={onChange}/>
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
          <StringTags strings={identifiedByNames} onDelete={(names) => setIdentifiedByNames(names)}/>
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
          <StringTags strings={recordedByNames} onDelete={(names) => setRecordedByNames(names)}/>
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
          <LinkTags links={references} onDelete={(names) => setReferences(names)}/>
        </div>
      </div>
      <CopyPreviousData/>
    </div>
  )
}

ObservationData.propTypes = {
  onChange: PropTypes.func.isRequired
}

function InputText({ name, onChange }) {
  const { t } = useTranslation()
  const label = t(name + '.label')
  const placeholder = t(name + '.placeholder')
  return (
    <div className="column field is-3">
      <label className="label">
        {label}
      </label>
      <input
        className="input"
        onChange={onChange}
        type="text"
        placeholder={placeholder}/>
    </div>
  )
}

function LinkTags({ links, onDelete }) {
  return (
    <div className="block">
      {links.map((link, index) =>
        <div key={index}>
          <span className="tag">
            <a href={link}>{link}</a>
            <button className="delete is-small" onClick={() => onDelete(deleteByIndex(index))}/></span>
        </div>
      )}
    </div>
  )

  function deleteByIndex(index) {
    return [...links.slice(0, index), ...links.slice(index + 1)]
  }
}

LinkTags.propTypes = {
  links:    PropTypes.arrayOf(PropTypes.string).isRequired,
  onDelete: PropTypes.func.isRequired
}

function StringTags({ strings, onDelete }) {
  return (
    <div className="block">
      {strings.map((string, index) =>
        <div key={index}>
          <span className="tag">
            {string}
            <button className="delete is-small" onClick={() => onDelete(deleteByIndex(index))}/></span>
        </div>
      )}
    </div>
  )

  function deleteByIndex(index) {
    return [...strings.slice(0, index), ...strings.slice(index + 1)]
  }
}

StringTags.propTypes = {
  strings:  PropTypes.arrayOf(PropTypes.string).isRequired,
  onDelete: PropTypes.func.isRequired
}
