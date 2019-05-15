import ActiveStepHeader from './ActiveStepHeader'
import OccurrenceData from './OccurrenceData/OccurrenceData'
import ConfirmedStepHeader from './ConfirmedStepHeader'
import DarwinCoreFields from './DarwinCoreFields/DarwinCoreFields'
import LocationData from './LocationData/LocationData'
import MeasurementOrFact from './MeasurementOrFact/MeasurementOrFact'
import NotConfirmedStepHeader from './NotConfirmedStepHeader'
import ObservationData from './ObservationData/ObservationData'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import SelectDataset from './SelectDataset/SelectDataset'
import { format } from 'date-fns'
import { getDatasetMock } from '../../../clients/server'
import { useTranslation } from 'react-i18next'

export default function OccurrenceForm() {
  const datasets = getDatasetMock()
  const { t } = useTranslation()
  const [selectedDataset, setSelectedDataset] = useState(datasets[0])
  const [occurrenceData, setOccurrenceData] = useState({
    basisOfRecord:    'humanObservation',
    beginDate:        Date.now(),
    endDate:          null,
    lifestage:        null,
    occurrenceStatus: 'present',
    scientificName:   '',
    sex:              null
  })
  const [observationData, setObservationData] = useState({
    institutionCode:         '',
    collectionCode:          '',
    fieldNumber:             '',
    catalogNumber:           '',
    recordNumber:            '',
    identifiedBy:            [],
    recordedBy:              [],
    identificationQualifier: '',
    identificationRemarks:   '',
    references:              []
  })
  const [darwinCoreFields, setDarwinCoreFields] = useState([])
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [locationData, setLocationData] = useState({
    decimalLongitude:      null,
    decimalLatitude:       null,
    coordinateUncertainty: null,
    minimumDepth:          null,
    maximumDepth:          null,
    verbatimCoordinates:   '',
    verbatimDepth:         ''
  })
  const [measurementOrFact, setMeasurementOrFact] = useState([])
  const steps = [{
    dataDescription: t('occurrenceForm.selectDataset.dataDescription'),
    selectedData:    selectedDataset.description,
    stepDescription: t('occurrenceForm.selectDataset.stepDescription'),
    stepTitle:       t('occurrenceForm.selectDataset.stepTitle'),
    children:        <SelectDataset
      datasets={datasets}
      onChange={setSelectedDataset}
      selectedDataset={selectedDataset}/>
  }, {
    dataDescription: 'Given Values',
    selectedData:    <OccurrenceDataSummary {...occurrenceData}/>,
    stepDescription: t('occurrenceForm.occurrenceData.step.stepDescription'),
    stepTitle:       t('occurrenceForm.occurrenceData.step.stepTitle'),
    children:        <OccurrenceData
      data={occurrenceData}
      onChange={setOccurrenceData}/>
  }, {
    dataDescription: t('occurrenceForm.locationData.step.dataDescription'),
    selectedData:    <SelectedLocation {...locationData}/>,
    stepDescription: t('occurrenceForm.locationData.step.stepDescription'),
    stepTitle:       t('occurrenceForm.locationData.step.stepTitle'),
    children:        <LocationData
      data={locationData}
      onChange={setLocationData}/>
  }, {
    dataDescription: 'Main Info',
    selectedData:    renderIdentifiedByLabel(observationData),
    stepDescription: 'Enter further specifics',
    stepTitle:       'Observation Data',
    children:        <ObservationData
      observationData={observationData}
      onChange={setObservationData}/>
  }, {
    dataDescription: 'Given values',
    selectedData:    <MeasurementOrFactSummary data={measurementOrFact}/>,
    stepDescription: 'Enter further specifics',
    stepTitle:       'Measurement or Fact',
    children:        <MeasurementOrFact
      data={measurementOrFact}
      onChange={setMeasurementOrFact}/>
  }, {
    dataDescription: '',
    selectedData:    '',
    stepDescription: 'Supply specific Darwin core fields',
    stepTitle:       'Darwin Core Fields',
    children:        <DarwinCoreFields
      fields={darwinCoreFields}
      onChange={setDarwinCoreFields}/>
  }]

  return (
    <section className="section">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const className = 'step-' + stepNumber + ' background-color-' + Math.floor(30 / steps.length * index)
        const StepComponent = activeStepIndex === index
          ? ActiveStepHeader
          : activeStepIndex > index
            ? ConfirmedStepHeader
            : NotConfirmedStepHeader
        return (
          <StepComponent
            {...step}
            className={className}
            key={step.stepTitle}
            onStepTitleClick={() => setActiveStepIndex(index)}
            stepTitle={stepNumber + ' - ' + step.stepTitle}/>
        )
      })}
    </section>
  )
}

function SelectedLocation({ decimalLatitude, decimalLongitude }) {
  const { t } = useTranslation()

  return (
    <>
      <div>{t('occurrenceForm.locationData.step.selectedData.latitude')}: {decimalLatitude}</div>
      <div>{t('occurrenceForm.locationData.step.selectedData.longitude')}: {decimalLongitude}</div>
    </>
  )
}

SelectedLocation.propTypes = {
  decimalLatitude:  PropTypes.number,
  decimalLongitude: PropTypes.number
}

function renderIdentifiedByLabel({ identifiedBy, institutionCode }) {
  const institutionCodeLabel = institutionCode ? `Institution: ${institutionCode}` : ''
  const identifiedByLabel = identifiedBy.length > 0 ? 'Identified by: ' + identifiedBy.join(', ') : ''
  return [institutionCodeLabel, identifiedByLabel].filter(label => !!label).join('; ')
}

function MeasurementOrFactSummary({ data }) {
  const { t } = useTranslation()

  return <div>{t('occurrenceForm.measurementOrFact.step.title', { number: data.length })}</div>
}

MeasurementOrFactSummary.propTypes = {
  data: PropTypes.array.isRequired
}

function OccurrenceDataSummary({ scientificName, beginDate, endDate }) {
  const occurrenceDataLabel = [
    scientificName,
    format(beginDate, 'D MMMM YYYY'),
    endDate ? ' - ' + format(endDate, 'D MMMM YYYY') : ''
  ].join(' ')

  return (
    <div>{occurrenceDataLabel}</div>
  )
}

OccurrenceDataSummary.propTypes = {
  beginDate:      PropTypes.number,
  endDate:        PropTypes.number,
  scientificName: PropTypes.string
}
