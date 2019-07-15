import React from 'react'
import ContactsForm from './ContactsForm/ContactsForm'
import { useTranslation } from 'react-i18next'

export default function ResourceCreators(props) {
  const { t } = useTranslation()

  return (
    <ContactsForm
      className="resource-creators"
      contactsTableHeader={t('datasetPageFormPage.resourceCreators.contactsTableHeader')}
      {...props}/>
  )
}
