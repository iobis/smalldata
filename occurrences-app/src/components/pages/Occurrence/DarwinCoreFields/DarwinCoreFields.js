import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import { useTranslation } from 'react-i18next'

export default function DarwinCoreFields({ fields, onChange }) {
  const { t } = useTranslation()
  const [selectedFields, setSelectedFields] = useState(fields)
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  useEffect(() => setSelectedFields(fields), [fields])

  function addDarwinField(field) {
    const updatedFields = [...fields, field]
    onChange(updatedFields)
    setSelectedFields(updatedFields)
  }

  function removeRowItem(index) {
    const updatedFields = fields.filter((_, i) => i !== index)
    onChange(updatedFields)
    setSelectedFields(updatedFields)
  }

  return (
    <div className="darwin-core-fields section is-fluid">
      <h1 className="title">{t('occurrenceForm.darwinCoreFields.title')}</h1>
      <h2 className="subtitle">
        {t('occurrenceForm.darwinCoreFields.subtitle')}
        {' '}
        {t('occurrenceForm.darwinCoreFields.tip')}
      </h2>
      <div className="columns is-grouped">
        <InputText className="is-3 field-name" name="occurrenceForm.darwinCoreFields.fieldName" onChange={setName}/>
        <InputText className="is-3 value" name="occurrenceForm.darwinCoreFields.value" onChange={setValue}/>
        <div className="column add">
          <span className="label">&nbsp;</span>
          <button className="button" onClick={() => addDarwinField({ name, value })}>{t('common.add')}</button>
        </div>
      </div>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>{t('common.name')}</th>
            <th>{t('common.value')}</th>
            <th/>
          </tr>
        </thead>
        <tbody>
          {selectedFields.map((field, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr className="fieldrow" key={i}>
              <td>{field.name}</td>
              <td>{field.value}</td>
              <td>
                <button className="button remove" onClick={() => removeRowItem(i)}>
                  {t('common.remove')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const darwinCoreFieldShape = {
  name:  PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

DarwinCoreFields.propTypes = {
  fields:   PropTypes.arrayOf(PropTypes.shape(darwinCoreFieldShape)).isRequired,
  onChange: PropTypes.func.isRequired
}
