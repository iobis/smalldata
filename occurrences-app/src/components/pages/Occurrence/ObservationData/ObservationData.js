import classNames from 'classnames'
import CopyPreviousData from '../CopyPreviousData'
import InputText from '../../../form/InputText'
import Textarea from '../../../form/Textarea'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ObservationData({ onChange }) {
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
        <InputMultipleText
          className="is-3"
          name="occurrenceForm.observationData.identifiedBy"
          values={['name 1', 'name 2']}/>
        <InputMultipleText
          className="is-3"
          name="occurrenceForm.observationData.recordedBy"
          values={['name 1', 'name 2', 'name 3']}/>
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
        <InputMultipleText
          className="is-9"
          name="occurrenceForm.observationData.references"
          onChange={onChange}
          labelComponent={(link) => <a href={link}>{link}</a>}
          values={['https://google.com', 'https://gmail.com']}/>
      </div>
      <CopyPreviousData/>
    </div>
  )
}

ObservationData.propTypes = {
  onChange: PropTypes.func.isRequired
}

function InputMultipleText({ className, name, values, onChange, labelComponent }) {
  const { t } = useTranslation()
  const [newValues, setNewValues] = useState(values)
  const [inputFieldValue, setInputFieldValue] = useState('')

  return (
    <div className={classNames('column field', className)}>
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
            onChange([...newValues, e.target.value])
            setInputFieldValue('')
          }
        }}
        type="text"
        placeholder={t(name + '.placeholder')}/>
      <p className="help">{t(name + '.help')}</p>
      <Tags labelComponent={labelComponent} strings={newValues} onDelete={(names) => setNewValues(names)}/>
    </div>
  )
}

function Tags({ strings, onDelete, labelComponent }) {
  return (
    <div className="block">
      {strings.map((string, index) =>
        <div key={index}>
          <span className="tag">
            {labelComponent ? labelComponent(string) : string}
            <button className="delete is-small" onClick={() => onDelete(deleteByIndex(index))}/></span>
        </div>
      )}
    </div>
  )

  function deleteByIndex(index) {
    return [...strings.slice(0, index), ...strings.slice(index + 1)]
  }
}

Tags.propTypes = {
  labelComponent: PropTypes.func,
  onDelete:       PropTypes.func.isRequired,
  strings:        PropTypes.arrayOf(PropTypes.string).isRequired
}
