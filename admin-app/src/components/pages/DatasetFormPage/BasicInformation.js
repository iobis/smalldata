import Dropdown from '@smalldata/dwca-lib/src/components/form/Dropdown'
import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import PropTypes from 'prop-types'
import React from 'react'
import Textarea from '@smalldata/dwca-lib/src/components/form/Textarea'
import { useTranslation } from 'react-i18next'

export default function BasicInformation({ onChange, data, licences, languages }) {
  const { t } = useTranslation()
  const { title, licence, language, abstract } = data

  const updateField = (name, value) => {
    const newSelection = { ...data, [name]: value }
    onChange(newSelection)
  }

  return (
    <div className="basic-information">
      <InputText
        className="title mandatory"
        name="datasetFormPage.basicInformation.title"
        onChange={value => updateField('title', value)}
        value={title}/>
      <div className="column field licence">
        <label className="label">
          {t('datasetFormPage.basicInformation.licence.label')}
        </label>
        <Dropdown
          onChange={value => updateField('licence', value)}
          options={licences}
          value={licence}/>
      </div>
      <div className="column field language">
        <label className="label">
          {t('datasetFormPage.basicInformation.language.label')}
        </label>
        <Dropdown
          onChange={value => updateField('language', value)}
          options={languages}
          value={language}/>
      </div>
      <Textarea
        className="abstract is-9"
        name="datasetFormPage.basicInformation.abstract"
        onChange={value => updateField('abstract', value)}
        value={abstract}/>
    </div>
  )
}

export const basicInformationShape = {
  title:    PropTypes.string.isRequired,
  licence:  PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  abstract: PropTypes.string.isRequired
}

BasicInformation.propTypes = {
  data:      PropTypes.shape(basicInformationShape).isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  licences:  PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange:  PropTypes.func.isRequired
}
