import ContactsForm from './ContactsForm/ContactsForm'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function MetadataProviders(props) {
  const { t } = useTranslation()

  return (
    <ContactsForm
      className="metadata-providers"
      contactsTableHeader={t('datasetFormPage.metadataProviders.contactsTableHeader')}
      {...props}/>
  )
}
