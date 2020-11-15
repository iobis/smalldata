import InputRadioGroup from '@smalldata/dwca-lib/src/components/form/InputRadioGroup'
import PropTypes from 'prop-types'
import React from 'react'
import ScientificNameInput from './ScientificNameInput'
import { useTranslation } from 'react-i18next'
import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import Textarea from '@smalldata/dwca-lib/src/components/form/Textarea'

const basisOfRecordOptions = ['humanObservation', 'machineObservation', 'fossilSpecimen', 'livingSpecimen', 'preservedSpecimen']
const lifeStageOptions = ['larva', 'juvenile', 'adult', 'unspecified']
const occurrenceStatusOptions = ['absent', 'present']
const sexOptions = ['male', 'female', 'unspecified']

export default function OccurrenceData({ onChange, data }) {
  const { t } = useTranslation()
  const { basisOfRecord, lifeStage, occurrenceStatus, scientificName, scientificNameId, sex, identificationQualifier, identificationRemarks } = data

  const updateField = (name, value) => {
    const newSelection = { ...data, [name]: value }
    onChange(newSelection)
  }

  function handleScientificNameChange(scientificName, scientificNameId) {
    const newSelection = { ...data, scientificName, scientificNameId }
    onChange(newSelection)
  }

  return (
    <div className="occurrence-data section is-fluid">
      <div className="columns mandatory">
        <ScientificNameInput
          onChange={(scientificName) => handleScientificNameChange(scientificName, '')}
          onSuggestionClick={({ scientificName, scientificNameId }) => handleScientificNameChange(scientificName, scientificNameId)}
          scientificName={scientificName}/>
      </div>
      <div className="columns no-margin">
        <div className="column">
          <label className="label">
            {t('occurrenceForm.occurrenceData.scientificNameId')}
          </label>
          <div>
            {scientificNameId || t('common.notAvailable')}
          </div>
        </div>
      </div>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.occurrenceStatus"
        onChange={(value) => updateField('occurrenceStatus', value)}
        options={occurrenceStatusOptions}
        selectedValue={occurrenceStatus}/>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.basisOfRecord"
        onChange={(value) => updateField('basisOfRecord', value)}
        options={basisOfRecordOptions}
        selectedValue={basisOfRecord}/>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.sex"
        onChange={(value) => updateField('sex', value)}
        options={sexOptions}
        selectedValue={sex}/>
      <InputRadioGroup
        name="occurrenceForm.occurrenceData.lifeStage"
        onChange={(value) => updateField('lifeStage', value)}
        options={lifeStageOptions}
        selectedValue={lifeStage}/>
      <div className="columns">
        <InputText
          className="identification-qualifier is-9"
          name="occurrenceForm.occurrenceData.identificationQualifier"
          onChange={(value) => updateField('identificationQualifier', value)}
          value={identificationQualifier}/>
      </div>
      <div className="columns">
        <Textarea
          className="identification-remarks is-9"
          name="occurrenceForm.occurrenceData.identificationRemarks"
          onChange={(value) => updateField('identificationRemarks', value)}
          value={identificationRemarks}/>
      </div>

    </div>
  )
}

export const occurrenceDataShape = {
  basisOfRecord:    PropTypes.oneOf(basisOfRecordOptions).isRequired,
  lifeStage:        PropTypes.oneOf(lifeStageOptions).isRequired,
  occurrenceStatus: PropTypes.oneOf(occurrenceStatusOptions).isRequired,
  scientificNameId: PropTypes.string.isRequired,
  scientificName:   PropTypes.string.isRequired,
  sex:              PropTypes.oneOf(sexOptions).isRequired,
  identificationQualifier: PropTypes.string.isRequired,
  identificationRemarks:   PropTypes.string.isRequired
}

OccurrenceData.propTypes = {
  data:     PropTypes.shape(occurrenceDataShape).isRequired,
  onChange: PropTypes.func.isRequired
}
