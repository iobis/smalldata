import CopyPreviousData from '../CopyPreviousData'
import InputText from '../../../form/InputText'
import Textarea from '../../../form/Textarea'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ObservationData({ onChange }) {
  const { t } = useTranslation()
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
        <InputMultipleText name="occurrenceForm.observationData.identifiedBy" values={['name 1', 'name 2']}/>
        <InputMultipleText name="occurrenceForm.observationData.recordedBy" values={['name 1', 'name 2', 'name 3']}/>
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

function InputMultipleText({ name, values }) {
  const { t } = useTranslation()
  const [newValues, setNewValues] = useState(values)
  const [inputFieldValue, setInputFieldValue] = useState('')

  return (
    <div className="column field is-3">
      <label className="label">
        {t(name + '.label')}
      </label>
      <input
        value={inputFieldValue}
        className="input"
        onChange={(e) => setInputFieldValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setNewValues([...newValues, e.target.value])
            setInputFieldValue('')
          }
        }}
        type="text"
        placeholder={t(name + '.placeholder')}/>
      <p className="help">{t(name + '.help')}</p>
      <StringTags strings={newValues} onDelete={(names) => setNewValues(names)}/>
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
