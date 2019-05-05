import InputNumber from '../../../form/InputNumber'
import InputText from '../../../form/InputText'
import PropTypes from 'prop-types'
import React from 'react'

export default function LocationData({ data, onChange }) {
  const updateField = (name, value) => {
    const newSelection = { ...data, [name]: value }
    onChange(newSelection)
  }

  return (
    <div className="location-data section is-fluid">
      <h1 className="title">Enter coordinates</h1>
      <h2 className="subtitle">bold fields are mandatory</h2>
      <div className="columns">
        <InputNumber
          className="decimal-longitude is-3"
          name="occurrenceForm.locationData.decimalLongitude"
          onChange={(value) => updateField('decimalLongitude', value)}
          step={0.0001}
          value={data.decimalLongitude}/>
        <InputNumber
          className="decimal-latitude is-3"
          name="occurrenceForm.locationData.decimalLatitude"
          onChange={(value) => updateField('decimalLatitude', value)}
          step={0.0001}
          value={data.decimalLatitude}/>
        <InputNumber
          className="coordinate-uncertainty is-3"
          name="occurrenceForm.locationData.coordinateUncertainty"
          onChange={(value) => updateField('coordinateUncertainty', value)}
          optional
          step={0.01}
          value={data.coordinateUncertainty}/>
      </div>
      <div className="columns">
        <InputNumber
          className="minimum-depth is-3"
          name="occurrenceForm.locationData.minimumDepth"
          onChange={(value) => updateField('minimumDepth', value)}
          optional
          step={0.01}
          value={data.minimumDepth}/>
        <InputNumber
          className="maximum-depth is-3"
          name="occurrenceForm.locationData.maximumDepth"
          onChange={(value) => updateField('maximumDepth', value)}
          optional
          step={0.01}
          value={data.maximumDepth}/>
      </div>
      <div className="verbatim-data">
        <h1 className="title">Verbatim Data</h1>
        <h2 className="subtitle">optionally supply verbatim data as it appeared originally in the notes</h2>
        <div className="columns">
          <InputText
            className="verbatim-coordinates is-3"
            name="occurrenceForm.locationData.verbatimCoordinates"
            onChange={(value) => updateField('verbatimCoordinates', value)}
            optional
            value={data.verbatimCoordinates}/>
          <InputText
            className="verbatim-event-date is-3"
            name="occurrenceForm.locationData.verbatimEventDate"
            onChange={(value) => updateField('verbatimEventDate', value)}
            optional
            value={data.verbatimEventDate}/>
        </div>
        <div className="columns">
          <InputText
            className="verbatim-depth is-3"
            name="occurrenceForm.locationData.verbatimDepth"
            onChange={(value) => updateField('verbatimDepth', value)}
            optional
            value={data.verbatimDepth}/>
        </div>
      </div>
    </div>
  )
}

LocationData.propTypes = {
  data:     PropTypes.shape({
    decimalLongitude:      PropTypes.string.isRequired,
    decimalLatitude:       PropTypes.string.isRequired,
    coordinateUncertainty: PropTypes.string.isRequired,
    minimumDepth:          PropTypes.string.isRequired,
    maximumDepth:          PropTypes.string.isRequired,
    verbatimCoordinates:   PropTypes.string.isRequired,
    verbatimEventDate:     PropTypes.string.isRequired,
    verbatimDepth:         PropTypes.string.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired
}