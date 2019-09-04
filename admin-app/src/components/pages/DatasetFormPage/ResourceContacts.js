import ContactsForm from './ContactsForm/ContactsForm'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ResourceContacts(props) {
  const { t } = useTranslation()

  return (
    <ContactsForm
      className="resource-contacts"
      contactsTableHeader={t('datasetFormPage.resourceContacts.contactsTableHeader')}
      {...props}/>
  )
}
