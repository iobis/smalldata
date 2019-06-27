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
import React, { useContext, useEffect, useState } from 'react'
import Dataset from './Dataset/Dataset'
import { format } from 'date-fns'
import { datasetTitleOf, getDatasets, postOccurrence } from '../../../clients/SmalldataClient'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '@smalldata/dwca-lib'

export default function OccurrenceForm() {
  const initialState = createInitialState()
  const { t } = useTranslation()
  const { userRef } = useContext(AuthContext)
  const [successVisible, setSuccessVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [datasets, setDatasets] = useState([])
  const [dataset, setDataset] = useState(initialState.dataset)
  const [occurrenceData, setOccurrenceData] = useState(initialState.occurrenceData)
  const [locationData, setLocationData] = useState(initialState.locationData)
  const [observationData, setObservationData] = useState(initialState.observationData)
  const [darwinCoreFields, setDarwinCoreFields] = useState(initialState.darwinCoreFields)
  const [measurements, setMeasurements] = useState(initialState.measurements)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
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

  async function handleSubmitClick() {
    const occurrence = {
      dataset,
      occurrenceData,
      locationData,
      observationData,
      measurements:     measurements || [],
      darwinCoreFields: darwinCoreFields || []
    }
    const response = await postOccurrence({ occurrence, userRef })
    if (response.exception) {
      setErrorVisible(true)
      setErrorMessage(response.exception + ': ' + response.exceptionMessage)
    } else {
      setSuccessVisible(true)
    }
  }

  function handleErrorClose() {
    setErrorVisible(false)
    setErrorMessage('')
  }

  function handleCreateFreshClick() {
    resetUiState()
    resetOccurrenceState()
  }

  function handleCreateFromThisClickClick() {
    resetUiState()
  }

  function resetUiState() {
    setActiveStepIndex(0)
    setFinalSummaryVisible(false)
    setSuccessVisible(false)
  }

  function resetOccurrenceState() {
    setDataset(datasets[0])
    setOccurrenceData(initialState.occurrenceData)
    setLocationData(initialState.locationData)
    setObservationData(initialState.observationData)
    setDarwinCoreFields(initialState.darwinCoreFields)
    setMeasurements(initialState.measurements)
  }

  const steps = [{
    dataDescription: t('occurrenceForm.dataset.step.dataDescription'),
    selectedData:    datasetTitleOf(dataset),
    stepDescription: t('occurrenceForm.dataset.step.stepDescription'),
    stepTitle:       t('occurrenceForm.dataset.step.stepTitle'),

    children: datasets && dataset && (
      <Dataset
        datasets={datasets}
        nextStepHandler={() => showActiveStep(activeStepIndex + 1)}
        onChange={setDataset}
        selectedDataset={dataset}/>)
  }, {
    dataDescription: t('occurrenceForm.occurrenceData.step.dataDescription'),
    selectedData:    <OccurrenceDataSummary {...occurrenceData}/>,
    stepDescription: t('occurrenceForm.occurrenceData.step.stepDescription'),
    stepTitle:       t('occurrenceForm.occurrenceData.step.stepTitle'),

    children:
      <OccurrenceData
        data={occurrenceData}
        nextStepHandler={() => showActiveStep(activeStepIndex + 1)}
        onChange={setOccurrenceData}/>
  }, {
    dataDescription: t('occurrenceForm.locationData.step.dataDescription'),
    selectedData:    <SelectedLocation {...locationData}/>,
    stepDescription: t('occurrenceForm.locationData.step.stepDescription'),
    stepTitle:       t('occurrenceForm.locationData.step.stepTitle'),

    children:
      <LocationData
        data={locationData}
        nextStepHandler={() => showActiveStep(activeStepIndex + 1)}
        onChange={setLocationData}/>
  }, {
    dataDescription: t('occurrenceForm.observationData.step.dataDescription'),
    selectedData:    renderIdentifiedByLabel(observationData),
    stepDescription: t('occurrenceForm.observationData.step.stepDescription'),
    stepTitle:       t('occurrenceForm.observationData.step.stepTitle'),

    children:
      <ObservationData
        nextStepHandler={() => showActiveStep(activeStepIndex + 1)}
        observationData={observationData}
        onChange={setObservationData}/>
  }, {
    dataDescription: t('occurrenceForm.measurementOrFact.step.dataDescription'),
    selectedData:    <MeasurementOrFactSummary data={measurements}/>,
    stepDescription: t('occurrenceForm.measurementOrFact.step.stepDescription'),
    stepTitle:       t('occurrenceForm.measurementOrFact.step.stepTitle'),

    children:
      <MeasurementOrFact
        data={measurements}
        nextStepHandler={() => showActiveStep(activeStepIndex + 1)}
        onChange={setMeasurements}/>
  }, {
    dataDescription: '',
    selectedData:    '',
    stepDescription: t('occurrenceForm.darwinCoreFields.step.stepDescription'),
    stepTitle:       t('occurrenceForm.darwinCoreFields.step.stepTitle'),

    children:
      <DarwinCoreFields
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
          errorMessage={errorMessage}
          errorVisible={errorVisible}
          locationData={locationData}
          measurements={measurements}
          observationData={observationData}
          occurrenceData={occurrenceData}
          onChangeClick={(params) => showActiveStep(params.index)}
          onCreateFreshClick={handleCreateFreshClick}
          onCreateFromThisClick={handleCreateFromThisClickClick}
          onErrorClose={handleErrorClose}
          onSubmitClick={handleSubmitClick}
          successVisible={successVisible}/>) :
        (<div className="columns column is-centered">
          <button
            className="review-and-submit-button button is-medium is-info"
            disabled={isOccurrenceValid()}
            onClick={showFinalSummary}>
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
  beginDate:      PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  endDate:        PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  scientificName: PropTypes.string
}

function createInitialState() {
  return {
    dataset:          null,
    occurrenceData:   {
      basisOfRecord:    'humanObservation',
      beginDate:        Date.now(),
      endDate:          null,
      lifestage:        'larva',
      occurrenceStatus: 'present',
      scientificName:   '',
      sex:              'male'
    },
    locationData:     {
      decimalLongitude:      null,
      decimalLatitude:       null,
      coordinateUncertainty: null,
      minimumDepth:          null,
      maximumDepth:          null,
      verbatimCoordinates:   '',
      verbatimDepth:         ''
    },
    observationData:  {
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
    },
    darwinCoreFields: [],
    measurements:     []
  }
}
