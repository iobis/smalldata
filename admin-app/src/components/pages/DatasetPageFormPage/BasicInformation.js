import Dropdown from '@smalldata/dwca-lib/src/components/form/Dropdown'
import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import PropTypes from 'prop-types'
import React from 'react'
import Textarea from '@smalldata/dwca-lib/src/components/form/Textarea'
import { useTranslation } from 'react-i18next'

export const licences = [
  'Creative Commons Attribution Non Commercial (CC-BY) 4.0 License',
  'Creative Commons Attribution Non Commercial (CC-BY-NC) 4.0 License',
  'Public Domain (CC0 1.0)']
export const languages = [
  'English',
  'Dutch',
  'French',
  'Spanish']

export default function BasicInformation({ onChange, data }) {
  const { t } = useTranslation()
  const { title, licence, language, abstract } = data

  const updateField = (name, value) => {
    const newSelection = { ...data, [name]: value }
    onChange(newSelection)
  }

  return (
    <div className="basic-information">
      <InputText
        className="title"
        name="datasetPageFormPage.basicInformation.title"
        onChange={value => updateField('title', value)}
        value={title}/>
      <div className="column field licence">
        <label className="label">
          {t('datasetPageFormPage.basicInformation.licence.label')}
        </label>
        <Dropdown
          onChange={value => updateField('licence', value)}
          options={licences}
          value={licence}/>
      </div>
      <div className="column field language">
        <label className="label">
          {t('datasetPageFormPage.basicInformation.language.label')}
        </label>
        <Dropdown
          onChange={value => updateField('language', value)}
          options={languages}
          value={language}/>
      </div>
      <Textarea
        className="abstract is-9"
        name="datasetPageFormPage.basicInformation.abstract"
        onChange={value => updateField('abstract', value)}
        value={abstract}/>
    </div>
  )
}

export const basicInformationShape = {
  title:                  PropTypes.string.isRequired,
  licence:                PropTypes.oneOf(licences).isRequired,
  language:               PropTypes.oneOf(languages).isRequired,
  abstract:               PropTypes.string.isRequired
}

BasicInformation.propTypes = {
  data:     PropTypes.shape(basicInformationShape).isRequired,
  onChange: PropTypes.func.isRequired
}
