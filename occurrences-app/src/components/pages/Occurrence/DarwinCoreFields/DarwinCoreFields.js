import PropTypes from 'prop-types'
import React, { useState } from 'react'
import InputText from '../../../form/InputText'
import { useTranslation } from 'react-i18next'

export default function DarwinCoreFields({ fields, onChange }) {
  const { t } = useTranslation()
  const [selectedFields, setSelectedFields] = useState([
    { name: 'dummy field', value: 'dummy value' },
    { name: 'dummy2 field', value: 'dummy value' },
    { name: 'dummy3 field', value: 'dummy value' },
    { name: 'dummy4 field', value: 'dummy value' }
  ])

  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  function makeDarwinCoreObject() {
    setSelectedFields([...fields, { name, value }])
  }

  function removeRowItem(index) {
    const updatedFields = [...fields]
    updatedFields.splice(index, 1)
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
        <InputText className="field-name" name="occurrenceForm.darwinCoreFields.fieldName" onChange={setName}/>
        <InputText className="value" name="occurrenceForm.darwinCoreFields.value" onChange={setValue}/>
        <div className="column add">
          <span className="label">&nbsp;</span>
          <button className="button" onClick={makeDarwinCoreObject}>{t('common.add')}</button>
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
          <tr className="fieldrow" key={field.name + field.value}>
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

DarwinCoreFields.propTypes = {
  fields:   PropTypes.arrayOf(PropTypes.shape({
    name:  PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired,
  onChange: PropTypes.func.isRequired
}
