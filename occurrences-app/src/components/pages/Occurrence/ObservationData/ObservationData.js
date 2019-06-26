import CopyPreviousData from '../CopyPreviousData'
import InputMultipleText from '../../../form/InputMultipleText'
import InputText from '../../../form/InputText'
import PropTypes from 'prop-types'
import React from 'react'
import Textarea from '../../../form/Textarea'
import ContinueButton from '../ContinueButton'

export default function ObservationData({ onChange, observationData, nextStepHandler }) {
  const updateField = (name, value) => {
    const newSelection = { ...observationData, [name]: value }
    onChange(newSelection)
  }

  return (
    <div className="observation-data section is-fluid">
      <div className="columns">
        <InputText
          className="institution-code is-3"
          name="occurrenceForm.observationData.institutionCode"
          onChange={(value) => updateField('institutionCode', value)}
          value={observationData.institutionCode}/>
        <InputText
          className="collection-code is-3"
          name="occurrenceForm.observationData.collectionCode"
          onChange={(value) => updateField('collectionCode', value)}
          value={observationData.collectionCode}/>
      </div>
      <div className="columns">
        <InputText
          className="field-number is-3"
          name="occurrenceForm.observationData.fieldNumber"
          onChange={(value) => updateField('fieldNumber', value)}
          value={observationData.fieldNumber}/>
        <InputText
          className="catalog-number is-3"
          name="occurrenceForm.observationData.catalogNumber"
          onChange={(value) => updateField('catalogNumber', value)}
          value={observationData.catalogNumber}/>
        <InputText
          className="record-number is-3"
          name="occurrenceForm.observationData.recordNumber"
          onChange={(value) => updateField('recordNumber', value)}
          value={observationData.recordNumber}/>
      </div>
      <div className="columns">
        <InputMultipleText
          className="identified-by is-3"
          name="occurrenceForm.observationData.identifiedBy"
          onChange={(value) => updateField('identifiedBy', value)}
          values={observationData.identifiedBy}/>
        <InputMultipleText
          className="recorded-by is-3"
          name="occurrenceForm.observationData.recordedBy"
          onChange={(value) => updateField('recordedBy', value)}
          values={observationData.recordedBy}/>
      </div>
      <div className="columns">
        <InputText
          className="identification-qualifier is-9"
          name="occurrenceForm.observationData.identificationQualifier"
          onChange={(value) => updateField('identificationQualifier', value)}
          value={observationData.identificationQualifier}/>
      </div>
      <div className="columns">
        <Textarea
          className="identification-remarks is-9"
          name="occurrenceForm.observationData.identificationRemarks"
          onChange={(value) => updateField('identificationRemarks', value)}
          value={observationData.identificationRemarks}/>
      </div>
      <div className="columns">
        <InputMultipleText
          className="references is-9"
          labelComponent={(link) => <a href={link}>{link}</a>}
          name="occurrenceForm.observationData.references"
          onChange={(value) => updateField('references', value)}
          values={observationData.references}/>
      </div>
      <CopyPreviousData/>
      <ContinueButton
        name="datasetContinue"
        nextStepHandler={nextStepHandler}
        value="occurrenceForm.observationData.step.nextStep"
        wrapperClassName=""/>
    </div>
  )
}

export const observationDataShape = {
  institutionCode:         PropTypes.string.isRequired,
  collectionCode:          PropTypes.string.isRequired,
  fieldNumber:             PropTypes.string.isRequired,
  catalogNumber:           PropTypes.string.isRequired,
  recordNumber:            PropTypes.string.isRequired,
  identifiedBy:            PropTypes.arrayOf(PropTypes.string).isRequired,
  recordedBy:              PropTypes.arrayOf(PropTypes.string).isRequired,
  identificationQualifier: PropTypes.string.isRequired,
  identificationRemarks:   PropTypes.string.isRequired,
  references:              PropTypes.arrayOf(PropTypes.string).isRequired
}

ObservationData.propTypes = {
  nextStepHandler: PropTypes.func.isRequired,
  observationData: PropTypes.shape(observationDataShape).isRequired,
  onChange:        PropTypes.func.isRequired
}
