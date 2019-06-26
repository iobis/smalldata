import CopyPreviousData from '../CopyPreviousData'
import InputNumber from '../../../form/InputNumber'
import InputText from '../../../form/InputText'
import LocationPickerModal from './LocationPickerModal'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ContinueButton from '../ContinueButton'

export default function LocationData({ data, onChange, nextStepHandler }) {
  const { t } = useTranslation()
  const updateField = (name, value) => {
    const newSelection = { ...data, [name]: value }
    onChange(newSelection)
  }
  const [locationPickerVisible, setLocationPickerVisible] = useState(false)

  function handleLocationUpdate(location) {
    setLocationPickerVisible(false)
    const newSelection = { ...data, decimalLatitude: location.latitude, decimalLongitude: location.longitude }
    onChange(newSelection)
  }

  return (
    <div className="location-data section is-fluid">
      <h1 className="title">{t('occurrenceForm.locationData.enterCoordinates.title')}</h1>
      <h2 className="subtitle">{t('occurrenceForm.locationData.enterCoordinates.subtitle')}</h2>
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
      <div className="columns">
        <div className="location-picker-notice column is-narrow" onClick={() => setLocationPickerVisible(true)}>
          {t('occurrenceForm.locationData.locationPicker.title')}
        </div>
      </div>
      <LocationPickerModal
        active={locationPickerVisible}
        onChange={handleLocationUpdate}
        onClose={() => setLocationPickerVisible(false)}/>
      <div className="verbatim-data">
        <h1 className="title">{t('occurrenceForm.locationData.verbatimData.title')}</h1>
        <h2 className="subtitle">{t('occurrenceForm.locationData.verbatimData.subtitle')}</h2>
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
      </div>
      <CopyPreviousData/>
      <ContinueButton
        name="datasetContinue"
        nextStepHandler={nextStepHandler}
        value="occurrenceForm.locationData.step.nextStep"
        wrapperClassName=""/>
    </div>
  )
}

export const locationDataShape = {
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
  nextStepHandler: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}
