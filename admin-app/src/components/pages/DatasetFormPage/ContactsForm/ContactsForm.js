import classNames from 'classnames'
import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import OceanExpertNameInput from '../../OceanExpertNameInput/OceanExpertNameInput'

export default function ContactsForm({ className, contactsTableHeader, data, onChange }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [contacts, setContacts] = useState(data)

  function handleAddClick() {
    const contact = { name, email, organisation }
    const newContacts = [...contacts, contact]
    setContacts(newContacts)
    onChange(newContacts)
  }

  function handleRemoveClick(index) {
    const newContacts = contacts.filter((_, i) => i !== index)
    setContacts(newContacts)
    onChange(newContacts)
  }

  function handleOceanExpertProfileChange(profile) {
    setName(profile.name)
    setEmail(profile.email || email)
  }

  return (
    <div className={classNames('contacts-form', className)}>
      <OceanExpertNameInput
        oceanExpertName={name}
        onChange={handleOceanExpertProfileChange}/>
      <div className="columns column">
        <InputText
          className="column email"
          name="datasetFormPage.contactsForm.email"
          onChange={value => setEmail(value)}
          value={email}/>
        <InputText
          className="column organisation"
          name="datasetFormPage.contactsForm.organisation"
          onChange={value => setOrganisation(value)}
          value={organisation}/>
        <div className="column field button-placeholder">
          <button className="add button" onClick={handleAddClick}>{t('common.add')}</button>
        </div>
      </div>
      <div className="column field">
        <div className="title is-5 contacts-table-header">{contactsTableHeader}</div>
        <table className="general table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>{t('datasetFormPage.contactsForm.name.label')}</th>
              <th>{t('datasetFormPage.contactsForm.email.label')}</th>
              <th>{t('datasetFormPage.contactsForm.organisation.label')}</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <ContactRow key={index} {...contact} onRemove={() => handleRemoveClick(index)}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const contactShape = {
  email:        PropTypes.string.isRequired,
  name:         PropTypes.string.isRequired,
  organisation: PropTypes.string.isRequired
}

ContactsForm.propTypes = {
  className:           PropTypes.string,
  contactsTableHeader: PropTypes.string.isRequired,
  data:                PropTypes.arrayOf(PropTypes.shape(contactShape)).isRequired,
  onChange:            PropTypes.func.isRequired
}

function ContactRow({ email, name, organisation, onRemove }) {
  const { t } = useTranslation()
  return (
    <tr className="contact-row">
      <td className="name">{name}</td>
      <td className="email">{email}</td>
      <td className="organisation">{organisation}</td>
      <td className="action">
        <button className="remove button" onClick={onRemove}>
          {t('common.remove')}
        </button>
      </td>
    </tr>
  )
}

ContactRow.propTypes = {
  email:        PropTypes.string.isRequired,
  name:         PropTypes.string.isRequired,
  onRemove:     PropTypes.func.isRequired,
  organisation: PropTypes.string.isRequired
}
