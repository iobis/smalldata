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
      <div className="columns">
        <InputText
          className="decimal-longitude is-3"
          name="occurrenceForm.locationData.decimalLongitude"
          onChange={(value) => updateField('decimalLongitude', value)}
          value={data.decimalLongitude}/>
        <InputText
          className="decimal-latitude is-3"
          name="occurrenceForm.locationData.decimalLatitude"
          onChange={(value) => updateField('decimalLatitude', value)}
          value={data.decimalLatitude}/>
        <InputText
          className="coordinate-uncertainty is-3"
          name="occurrenceForm.locationData.coordinateUncertainty"
          onChange={(value) => updateField('coordinateUncertainty', value)}
          value={data.collectionCode}/>
      </div>
      <div className="columns">
        <InputText
          className="minimum-depth is-3"
          name="occurrenceForm.locationData.minimumDepth"
          onChange={(value) => updateField('minimumDepth', value)}
          value={data.minimumDepth}/>
        <InputText
          className="maximum-depth is-3"
          name="occurrenceForm.locationData.maximumDepth"
          onChange={(value) => updateField('maximumDepth', value)}
          value={data.maximumDepth}/>
      </div>
      <div className="columns">
        <InputText
          className="verbatim-coordinates is-5"
          name="occurrenceForm.locationData.verbatimCoordinates"
          onChange={(value) => updateField('verbatimCoordinates', value)}
          value={data.verbatimCoordinates}/>
        <InputText
          className="verbatim-event-date is-5"
          name="occurrenceForm.locationData.verbatimEventDate"
          onChange={(value) => updateField('verbatimEventDate', value)}
          value={data.verbatimEventDate}/>
      </div>
      <div className="columns">
        <InputText
          className="verbatim-depth is-5"
          name="occurrenceForm.locationData.verbatimDepth"
          onChange={(value) => updateField('verbatimDepth', value)}
          value={data.verbatimDepth}/>
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
