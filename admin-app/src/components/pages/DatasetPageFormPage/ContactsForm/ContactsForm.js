import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ContactsForm({ data, onChange }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [position, setPosition] = useState('')
  const [contacts, setContacts] = useState(data)

  function handleAddClick() {
    const contact = { name, email, organisation, position }
    const newContacts = [...contacts, contact]
    setContacts(newContacts)
    onChange(newContacts)
  }

  return (
    <div className="contacts-form">
      <InputText
        className="name"
        name="datasetPageFormPage.resourceContacts.name"
        onChange={value => setName(value)}
        value={name}/>
      <InputText
        className="email"
        name="datasetPageFormPage.resourceContacts.email"
        onChange={value => setEmail(value)}
        value={email}/>
      <InputText
        className="organisation"
        name="datasetPageFormPage.resourceContacts.organisation"
        onChange={value => setOrganisation(value)}
        value={organisation}/>
      <InputText
        className="position"
        name="datasetPageFormPage.resourceContacts.position"
        onChange={value => setPosition(value)}
        value={position}/>
      <div className="column field">
        <button className="add button" onClick={handleAddClick}>{t('common.add')}</button>
      </div>
      <div className="column field">
        <table className="general table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>{t('datasetPageFormPage.resourceContacts.name.label')}</th>
              <th>{t('datasetPageFormPage.resourceContacts.email.label')}</th>
              <th>{t('datasetPageFormPage.resourceContacts.organisation.label')}</th>
              <th>{t('datasetPageFormPage.resourceContacts.position.label')}</th>
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

const contactShape = {
  email:        PropTypes.string.isRequired,
  name:         PropTypes.string.isRequired,
  organisation: PropTypes.string.isRequired,
  position:     PropTypes.string.isRequired
}

ContactsForm.propTypes = {
  data:     PropTypes.arrayOf(PropTypes.shape(contactShape)).isRequired,
  onChange: PropTypes.func.isRequired
}

function ContactRow({ email, name, organisation, position }) {
  return (
    <tr className="contact-row">
      <td className="name">{name}</td>
      <td className="email">{email}</td>
      <td className="organisation">{organisation}</td>
      <td className="position">{position}</td>
    </tr>
  )
}

ContactRow.propTypes = {
  email:        PropTypes.string.isRequired,
  name:         PropTypes.string.isRequired,
  organisation: PropTypes.string.isRequired,
  position:     PropTypes.string.isRequired
}
