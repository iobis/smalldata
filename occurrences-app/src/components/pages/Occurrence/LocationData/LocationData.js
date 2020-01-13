import InputNumber from '@smalldata/dwca-lib/src/components/form/InputNumber'
import InputText from '@smalldata/dwca-lib/src/components/form/InputText'
import LocationPickerModal from './LocationPickerModal'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DatePicker from '@smalldata/dwca-lib/src/components/form/DatePicker'

export default function LocationData({ data, onChange }) {
  const { t } = useTranslation()
  const updateField = (name, value) => {
    const newSelection = { ...data, [name]: value }
    onChange(newSelection)
  }
  const [locationPickerVisible, setLocationPickerVisible] = useState(false)

  function handleLocationUpdate(location) {
    setLocationPickerVisible(false)
    const newSelection = {
      ...data,
      decimalLatitude:       location.latitude,
      decimalLongitude:      location.longitude,
      coordinateUncertainty: location.coordinateUncertainty
    }
    onChange(newSelection)
  }

  return (
    <div className="location-data section is-fluid">

      <h2 className="title">{t('occurrenceForm.locationData.enterCoordinates.title')}</h2>
      <div className="columns no-margin">
        <InputNumber
          className="decimal-longitude is-3 mandatory no-margin"
          name="occurrenceForm.locationData.decimalLongitude"
          onChange={(value) => updateField('decimalLongitude', value)}
          step={0.0001}
          value={data.decimalLongitude}/>
        <InputNumber
          className="decimal-latitude is-3 mandatory no-margin"
          name="occurrenceForm.locationData.decimalLatitude"
          onChange={(value) => updateField('decimalLatitude', value)}
          step={0.0001}
          value={data.decimalLatitude}/>
      </div>
      <div className="location-picker-notice button" onClick={() => setLocationPickerVisible(true)}>
        {t('occurrenceForm.locationData.locationPicker.title')}
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
        <InputNumber
          className="coordinate-uncertainty is-3"
          name="occurrenceForm.locationData.coordinateUncertainty"
          onChange={(value) => updateField('coordinateUncertainty', value)}
          optional
          step={0.01}
          value={data.coordinateUncertainty}/>
      </div>
      <LocationPickerModal
        active={locationPickerVisible}
        onChange={handleLocationUpdate}
        onClose={() => setLocationPickerVisible(false)}/>

      <h2 className="title">{t('occurrenceForm.locationData.verbatimData.title')}</h2>
      <h3 className="subtitle">{t('occurrenceForm.locationData.verbatimData.subtitle')}</h3>
      <div className="columns">
        <InputText
          className="verbatim-coordinates is-3"
          name="occurrenceForm.locationData.verbatimCoordinates"
          onChange={(value) => updateField('verbatimCoordinates', value)}
          optional
          value={data.verbatimCoordinates}/>
        <InputText
          className="verbatim-depth is-3"
          name="occurrenceForm.locationData.verbatimDepth"
          onChange={(value) => updateField('verbatimDepth', value)}
          optional
          value={data.verbatimDepth}/>
      </div>

      <h2 className="title">{t('occurrenceForm.locationData.timeData.title')}</h2>
      <div className="columns">
        <div className="event-begin-date column field is-two-fifths">
          <label className="label">
            {t('occurrenceForm.locationData.eventBeginDate')}
          </label>
          <DatePicker
            onChange={(value) => updateField('beginDate', value)}
            value={data.beginDate}/>
        </div>
        <div className="event-end-date column field is-two-fifths">
          <label className="label has-text-weight-normal">
            {t('occurrenceForm.locationData.eventEndDate')}
          </label>
          <div className="control">
            <DatePicker
              onChange={(value) => updateField('endDate', value)}
              value={data.endDate}/>
          </div>
          <p className="help">{t('occurrenceForm.locationData.eventEndDateHelp')}</p>
        </div>
      </div>
    </div>
  )
}

export const locationDataShape = {
  beginDate:             PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
  endDate:               PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  decimalLongitude:      PropTypes.number,
  decimalLatitude:       PropTypes.number,
  coordinateUncertainty: PropTypes.number,
  minimumDepth:          PropTypes.number,
  maximumDepth:          PropTypes.number,
  verbatimCoordinates:   PropTypes.string.isRequired,
  verbatimDepth:         PropTypes.string.isRequired
}

LocationData.propTypes = {
  data:     PropTypes.shape(locationDataShape).isRequired,
  onChange: PropTypes.func.isRequired
}
