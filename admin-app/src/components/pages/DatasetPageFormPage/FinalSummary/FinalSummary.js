import ChangeButton from '@smalldata/dwca-lib/src/components/FinalSummary/ChangeButton'
import NameValueHeader from '@smalldata/dwca-lib/src/components/FinalSummary/NameValueHeader'
import NameValueRow from '@smalldata/dwca-lib/src/components/FinalSummary/NameValueRow'
import PropTypes from 'prop-types'
import React from 'react'
import SectionTitle from '@smalldata/dwca-lib/src/components/FinalSummary/SectionTitle'
import { basicInformationShape } from '../BasicInformation'
import { contactShape } from '../ContactsForm/ContactsForm'
import { useTranslation } from 'react-i18next'

export default function FinalSummary({
  basicInformation,
  keywords,
  metadataProviders,
  onChangeClick,
  resourceContacts,
  resourceCreators
}) {
  const { t } = useTranslation()

  return (
    <div className="final-summary section is-fluid">
      <div className="columns is-centered">
        <h1 className="final-summary-title title is-3">{t('datasetPageFormPage.finalSummary.title')}</h1>
      </div>
      <section className="basic-information-summary">
        <SectionTitle>1 - {t('datasetPageFormPage.basicInformation.step.stepTitle')}</SectionTitle>
        <div className="content">
          <table className="table is-striped is-fullwidth is-hoverable">
            <NameValueHeader/>
            <tbody>
              <NameValueRow
                name={t('datasetPageFormPage.basicInformation.title.label')}
                value={basicInformation.title}/>
              <NameValueRow
                name={t('datasetPageFormPage.basicInformation.publishingOrganisation.label')}
                value={basicInformation.publishingOrganisation}/>
              <NameValueRow
                name={t('datasetPageFormPage.basicInformation.licence.label')}
                value={basicInformation.licence}/>
              <NameValueRow
                name={t('datasetPageFormPage.basicInformation.language.label')}
                value={basicInformation.language}/>
              <NameValueRow
                name={t('datasetPageFormPage.basicInformation.abstract.label')}
                value={basicInformation.abstract}/>
            </tbody>
          </table>
        </div>
        <ChangeButton onClick={() => onChangeClick({ index: 0 })}/>
      </section>
      <section className="resource-contacts-summary">
        <SectionTitle>2 - {t('datasetPageFormPage.resourceContacts.step.stepTitle')}</SectionTitle>
        <div className="content">
          <div className="content">
            <ContactTable contacts={resourceContacts}/>
          </div>
        </div>
        <ChangeButton onClick={() => onChangeClick({ index: 1 })}/>
      </section>
      <section className="resource-creators-summary">
        <SectionTitle>3 - {t('datasetPageFormPage.resourceCreators.step.stepTitle')}</SectionTitle>
        <div className="content">
          <ContactTable contacts={resourceCreators}/>
        </div>
        <ChangeButton onClick={() => onChangeClick({ index: 2 })}/>
      </section>
      <section className="metadata-providers-summary">
        <SectionTitle>4 - {t('datasetPageFormPage.metadataProviders.step.stepTitle')}</SectionTitle>
        <div className="content">
          <ContactTable contacts={metadataProviders}/>
        </div>
        <ChangeButton onClick={() => onChangeClick({ index: 3 })}/>
      </section>
      <section className="keywords-summary">
        <SectionTitle>5 - {t('datasetPageFormPage.keywords.step.stepTitle')}</SectionTitle>
        <div className="content">
          {keywords.join(', ')}
        </div>
        <ChangeButton onClick={() => onChangeClick({ index: 4 })}/>
      </section>
    </div>
  )
}

FinalSummary.propTypes = {
  basicInformation:  PropTypes.shape(basicInformationShape).isRequired,
  keywords:          PropTypes.arrayOf(PropTypes.string).isRequired,
  metadataProviders: PropTypes.arrayOf(PropTypes.shape(contactShape).isRequired),
  onChangeClick:     PropTypes.func.isRequired,
  resourceContacts:  PropTypes.arrayOf(PropTypes.shape(contactShape).isRequired),
  resourceCreators:  PropTypes.arrayOf(PropTypes.shape(contactShape).isRequired)
}

function ContactTable({ contacts }) {
  const { t } = useTranslation()

  return (
    <table className="general table is-fullwidth is-striped is-hoverable">
      <thead>
        <tr>
          <th>{t('datasetPageFormPage.contactsForm.name.label')}</th>
          <th>{t('datasetPageFormPage.contactsForm.email.label')}</th>
          <th>{t('datasetPageFormPage.contactsForm.organisation.label')}</th>
          <th>{t('datasetPageFormPage.contactsForm.position.label')}</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <ContactRow key={index} {...contact}/>
        ))}
      </tbody>
    </table>
  )
}

ContactTable.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.shape(contactShape).isRequired)
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

ContactRow.propTypes = contactShape
