import CopyPreviousData from '../CopyPreviousData'
import InputMultipleText from '../../../form/InputMultipleText'
import InputText from '../../../form/InputText'
import PropTypes from 'prop-types'
import React from 'react'
import Textarea from '../../../form/Textarea'

export default function ObservationData({ onChange, observationData }) {
  const updateField = (name, value) => {
    const newSelection = { ...observationData, [name]: value }
    onChange(newSelection)
  }

  return (
    <div className="observation-data section is-fluid">
      <div className="columns">
        <InputText
          className="is-3"
          name="occurrenceForm.observationData.institutionCode"
          onChange={(value) => updateField('institutionCode', value)}
          value={observationData.institutionCode}/>
        <InputText
          className="is-3"
          name="occurrenceForm.observationData.collectionCode"
          onChange={(value) => updateField('collectionCode', value)}
          value={observationData.collectionCode}/>
      </div>
      <div className="columns">
        <InputText
          className="is-3"
          name="occurrenceForm.observationData.fieldNumber"
          onChange={(value) => updateField('fieldNumber', value)}
          value={observationData.fieldNumber}/>
        <InputText
          className="is-3"
          name="occurrenceForm.observationData.catalogNumber"
          onChange={(value) => updateField('catalogNumber', value)}
          value={observationData.catalogNumber}/>
        <InputText
          className="is-3"
          name="occurrenceForm.observationData.recordNumber"
          onChange={(value) => updateField('recordNumber', value)}
          value={observationData.recordNumber}/>
      </div>
      <div className="columns">
        <InputMultipleText
          className="is-3"
          name="occurrenceForm.observationData.identifiedBy"
          onChange={(value) => updateField('identifiedBy', value)}
          values={observationData.identifiedBy}/>
        <InputMultipleText
          className="is-3"
          name="occurrenceForm.observationData.recordedBy"
          onChange={(value) => updateField('recordedBy', value)}
          values={observationData.recordedBy}/>
      </div>
      <div className="columns">
        <InputText
          className="is-9"
          name="occurrenceForm.observationData.identificationQualifier"
          onChange={(value) => updateField('identificationQualifier', value)}
          value={observationData.identificationQualifier}/>
      </div>
      <div className="columns">
        <Textarea
          className="is-9"
          name="occurrenceForm.observationData.identificationRemarks"
          onChange={(value) => updateField('identificationRemarks', value)}
          value={observationData.identificationRemarks}/>
      </div>
      <div className="columns">
        <InputMultipleText
          className="is-9"
          name="occurrenceForm.observationData.references"
          onChange={(value) => updateField('references', value)}
          labelComponent={(link) => <a href={link}>{link}</a>}
          values={observationData.references}/>
      </div>
      <CopyPreviousData/>
    </div>
  )
}

ObservationData.propTypes = {
  onChange: PropTypes.func.isRequired
}
