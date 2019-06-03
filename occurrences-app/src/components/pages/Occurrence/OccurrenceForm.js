import ActiveStepHeader from './StepHeaders/ActiveStepHeader'
import ConfirmedStepHeader from './StepHeaders/ConfirmedStepHeader'
import DarwinCoreFields from './DarwinCoreFields/DarwinCoreFields'
import FinalSummary from './FinalSummary/FinalSummary'
import LocationData from './LocationData/LocationData'
import MeasurementOrFact from './MeasurementOrFact/MeasurementOrFact'
import NotConfirmedStepHeader from './StepHeaders/NotConfirmedStepHeader'
import ObservationData from './ObservationData/ObservationData'
import OccurrenceData from './OccurrenceData/OccurrenceData'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import Dataset from './Dataset/Dataset'
import { format } from 'date-fns'
import { getDatasets, datasetTitleOf } from '../../../clients/SmalldataClient'
import { useTranslation } from 'react-i18next'

export default function OccurrenceForm() {
  const { t } = useTranslation()
  const [datasets, setDatasets] = useState([])
  const [dataset, setDataset] = useState(null)
  const [occurrenceData, setOccurrenceData] = useState({
    basisOfRecord:    'humanObservation',
    beginDate:        Date.now(),
    endDate:          null,
    lifestage:        'larva',
    occurrenceStatus: 'present',
    scientificName:   '',
    sex:              'male'
  })
  const [locationData, setLocationData] = useState({
    decimalLongitude:      null,
    decimalLatitude:       null,
    coordinateUncertainty: null,
    minimumDepth:          null,
    maximumDepth:          null,
    verbatimCoordinates:   '',
    verbatimDepth:         ''
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
  const [measurementOrFact, setMeasurementOrFact] = useState([])
  const [finalSummaryVisible, setFinalSummaryVisible] = useState(false)

  useEffect(() => {
    const fetchDatasets = async() => {
      const datasets = await getDatasets()
      setDatasets(datasets)
      setDataset(datasets[0])
    }
    fetchDatasets()
  }, [])

  function showFinalSummary() {
    setActiveStepIndex(null)
    setFinalSummaryVisible(true)
  }

  function showActiveStep(stepIndex) {
    setActiveStepIndex(stepIndex)
    setFinalSummaryVisible(false)
  }

  function isOccurrenceValid() {
    return !dataset
  }

  const steps = [{
    dataDescription: t('occurrenceForm.dataset.step.dataDescription'),
    selectedData:    datasetTitleOf(dataset),
    stepDescription: t('occurrenceForm.dataset.step.stepDescription'),
    stepTitle:       t('occurrenceForm.dataset.step.stepTitle'),
    children:        datasets && dataset && (
      <Dataset
        datasets={datasets}
        onChange={setDataset}
        selectedDataset={dataset}/>)
  }, {
    dataDescription: t('occurrenceForm.occurrenceData.step.dataDescription'),
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
    dataDescription: t('occurrenceForm.observationData.step.dataDescription'),
    selectedData:    renderIdentifiedByLabel(observationData),
    stepDescription: t('occurrenceForm.observationData.step.stepDescription'),
    stepTitle:       t('occurrenceForm.observationData.step.stepTitle'),
    children:        <ObservationData
      observationData={observationData}
      onChange={setObservationData}/>
  }, {
    dataDescription: t('occurrenceForm.measurementOrFact.step.dataDescription'),
    selectedData:    <MeasurementOrFactSummary data={measurementOrFact}/>,
    stepDescription: t('occurrenceForm.measurementOrFact.step.stepDescription'),
    stepTitle:       t('occurrenceForm.measurementOrFact.step.stepTitle'),
    children:        <MeasurementOrFact
      data={measurementOrFact}
      onChange={setMeasurementOrFact}/>
  }, {
    dataDescription: '',
    selectedData:    '',
    stepDescription: t('occurrenceForm.darwinCoreFields.step.stepDescription'),
    stepTitle:       t('occurrenceForm.darwinCoreFields.step.stepTitle'),
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
            onStepTitleClick={() => showActiveStep(index)}
            stepTitle={stepNumber + ' - ' + step.stepTitle}/>
        )
      })}
      {finalSummaryVisible ?
        (<FinalSummary
          darwinCoreFields={darwinCoreFields}
          dataset={dataset}
          locationData={locationData}
          measurements={measurementOrFact}
          observationData={observationData}
          occurrenceData={occurrenceData}
          onChangeClick={(params) => showActiveStep(params.index)}
          onSubmitClick={() => {}}/>) :
        (<div className="columns column is-centered">
          <button className="review-and-submit-button button is-medium is-info" disabled={isOccurrenceValid()} onClick={showFinalSummary}>
            {t('occurrenceForm.reviewAndSubmitButton')}
          </button>
        </div>)}
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
