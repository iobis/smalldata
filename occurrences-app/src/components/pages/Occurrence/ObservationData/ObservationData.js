import CopyPreviousData from '../CopyPreviousData'
import InputMultipleText from '../../../form/InputMultipleText'
import InputText from '../../../form/InputText'
import PropTypes from 'prop-types'
import React from 'react'
import Textarea from '../../../form/Textarea'

export default function ObservationData({ onChange }) {
  return (
    <div className="observation-data section is-fluid">
      <div className="columns">
        <InputText className="is-3" name="occurrenceForm.observationData.institutionCode" onChange={onChange}/>
        <InputText className="is-3" name="occurrenceForm.observationData.collectionCode" onChange={onChange}/>
      </div>
      <div className="columns">
        <InputText className="is-3" name="occurrenceForm.observationData.fieldNumber" onChange={onChange}/>
        <InputText className="is-3" name="occurrenceForm.observationData.catalogNumber" onChange={onChange}/>
        <InputText className="is-3" name="occurrenceForm.observationData.recordNumber" onChange={onChange}/>
      </div>
      <div className="columns">
        <InputMultipleText
          className="is-3"
          name="occurrenceForm.observationData.identifiedBy"
          values={['name 1', 'name 2']}/>
        <InputMultipleText
          className="is-3"
          name="occurrenceForm.observationData.recordedBy"
          values={['name 1', 'name 2', 'name 3']}/>
      </div>
      <div className="columns">
        <InputText
          className="is-9"
          name="occurrenceForm.observationData.identificationQualifier"
          onChange={onChange}/>
      </div>
      <div className="columns">
        <Textarea
          className="is-9"
          name="occurrenceForm.observationData.identificationRemarks"
          onChange={onChange}/>
      </div>
      <div className="columns">
        <InputMultipleText
          className="is-9"
          name="occurrenceForm.observationData.references"
          onChange={onChange}
          labelComponent={(link) => <a href={link}>{link}</a>}
          values={['https://google.com', 'https://gmail.com']}/>
      </div>
      <CopyPreviousData/>
    </div>
  )
}

ObservationData.propTypes = {
  onChange: PropTypes.func.isRequired
}
