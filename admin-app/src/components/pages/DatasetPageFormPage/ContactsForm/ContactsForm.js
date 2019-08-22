import classNames from 'classnames'
import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

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

  return (
    <div className={classNames('contacts-form', className)}>
      <InputText
        className="name"
        name="datasetPageFormPage.contactsForm.name"
        onChange={value => setName(value)}
        value={name}/>
      <InputText
        className="email"
        name="datasetPageFormPage.contactsForm.email"
        onChange={value => setEmail(value)}
        value={email}/>
      <InputText
        className="organisation"
        name="datasetPageFormPage.contactsForm.organisation"
        onChange={value => setOrganisation(value)}
        value={organisation}/>
      <div className="column field">
        <button className="add button" onClick={handleAddClick}>{t('common.add')}</button>
      </div>
      <div className="column field">
        <div className="title is-5 contacts-table-header">{contactsTableHeader}</div>
        <table className="general table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>{t('datasetPageFormPage.contactsForm.name.label')}</th>
              <th>{t('datasetPageFormPage.contactsForm.email.label')}</th>
              <th>{t('datasetPageFormPage.contactsForm.organisation.label')}</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <ContactRow key={index} {...contact}/>
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

function ContactRow({ email, name, organisation }) {
  return (
    <tr className="contact-row">
      <td className="name">{name}</td>
      <td className="email">{email}</td>
      <td className="organisation">{organisation}</td>
    </tr>
  )
}

ContactRow.propTypes = {
  email:        PropTypes.string.isRequired,
  name:         PropTypes.string.isRequired,
  organisation: PropTypes.string.isRequired
}
