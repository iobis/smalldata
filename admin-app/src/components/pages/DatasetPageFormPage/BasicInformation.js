import React, { useState } from 'react'
import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import Dropdown from '@smalldata/dwca-lib/src/components/form/Dropdown'
import { useTranslation } from 'react-i18next'
import Textarea from '@smalldata/dwca-lib/src/components/form/Textarea'

export default function BasicInformation() {
  const { t } = useTranslation()

  const licences = [
    'Creative Commons Attribution Non Commercial (CC-BY) 4.0 License',
    'Creative Commons Attribution Non Commercial (CC-BY-NC) 4.0 License',
    'Public Domain (CC0 1.0)']
  const languages = ['English', 'Dutch', 'French', 'Spanish']

  const [title, setTitle] = useState('')
  const [publishingOrganisation, setPublishingOrganisation] = useState('')
  const [licence, setLicence] = useState(licences[0])
  const [language, setLanguage] = useState(languages[0])
  const [abstract, setAbstract] = useState('')

  return (
    <div className="basic-information">
      <InputText
        className="title"
        name="datasetPageFormPage.basicInformation.title"
        onChange={setTitle}
        value={title}/>
      <InputText
        className="publishing-organisation"
        name="datasetPageFormPage.basicInformation.publishingOrganisation"
        onChange={setPublishingOrganisation}
        value={publishingOrganisation}/>
      <div className="column field">
        <label className="label">
          {t('datasetPageFormPage.basicInformation.licence.label')}
        </label>
        <Dropdown
          onChange={value => setLicence(value)}
          options={licences}
          value={licence}/>
      </div>
      <div className="column field">
        <label className="label">
          {t('datasetPageFormPage.basicInformation.language.label')}
        </label>
        <Dropdown
          onChange={value => setLanguage(value)}
          options={languages}
          value={language}/>
      </div>
      <Textarea
        className="identification-remarks is-9"
        name="datasetPageFormPage.basicInformation.abstract"
        onChange={(value) => setAbstract(value)}
        value={abstract}/>
    </div>
  )
}
