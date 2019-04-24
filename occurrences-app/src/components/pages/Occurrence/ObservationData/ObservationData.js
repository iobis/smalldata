import CopyPreviousData from '../CopyPreviousData'
import InputText from '../../../form/InputText'
import Textarea from '../../../form/Textarea'
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
        <InputText className="is-3" name="occurrenceForm.observationData.institutionCode" onChange={onChange}/>
        <InputText className="is-3" name="occurrenceForm.observationData.collectionCode" onChange={onChange}/>
      </div>
      <div className="columns">
        <InputText className="is-3" name="occurrenceForm.observationData.fieldNumber" onChange={onChange}/>
        <InputText className="is-3" name="occurrenceForm.observationData.catalogNumber" onChange={onChange}/>
        <InputText className="is-3" name="occurrenceForm.observationData.recordNumber" onChange={onChange}/>
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
        <InputText
          className="is-9"
          name="occurrenceForm.observationData.identificationQualifier"
          onChange={onChange}/>
      </div>
      <div className="columns">
        <Textarea
          className="is-9"
          name="occurrenceForm.observationData.identificationRemarks"
          onChange={onChange}/>
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
