import ActiveStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/ActiveStepHeader'
import ConfirmedStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/ConfirmedStepHeader'
import DarwinCoreFields from './DarwinCoreFields/DarwinCoreFields'
import Dataset from './Dataset/Dataset'
import FinalSummary from './FinalSummary/FinalSummary'
import LocationData from './LocationData/LocationData'
import MeasurementOrFact from './MeasurementOrFact/MeasurementOrFact'
import NotConfirmedStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/NotConfirmedStepHeader'
import ObservationData from './ObservationData/ObservationData'
import OccurrenceData from './OccurrenceData/OccurrenceData'
import OccurrenceNotSupported from './OccurrenceNotSupported'
import PropTypes from 'prop-types'
import React, { useContext, useEffect, useState } from 'react'
import { format } from 'date-fns'
import {
  datasetTitleOf,
  mapDwcaToLocationData,
  mapDwcaToMeasurements,
  mapDwcaToObservationData,
  mapDwcaToOccurrenceData,
  mapDwcsToDarwinCoreFields
} from '@smalldata/dwca-lib/src/clients/SmalldataConverters'
import {
  createOccurrence,
  findLatestOccurrence,
  getDatasets,
  getOccurrence,
  updateOccurrence
} from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import { AuthContext } from '@smalldata/dwca-lib'
import { useTranslation } from 'react-i18next'

export default function OccurrenceForm({ location }) {
  const { t } = useTranslation()
  const { userRef, claims } = useContext(AuthContext)
  const initialState = createInitialState(claims)

  const [action, setAction] = useState('create')
  const [successVisible, setSuccessVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [datasets, setDatasets] = useState([])
  const [dataset, setDataset] = useState(initialState.dataset)
  const [occurrenceData, setOccurrenceData] = useState(initialState.occurrenceData)
  const [locationData, setLocationData] = useState(initialState.locationData)
  const [observationData, setObservationData] = useState(initialState.observationData)
  const [measurements, setMeasurements] = useState(initialState.measurements)
  const [darwinCoreFields, setDarwinCoreFields] = useState(initialState.darwinCoreFields)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [finalSummaryVisible, setFinalSummaryVisible] = useState(false)
  const [occurrenceSupported, setOccurrenceSupported] = useState(true)
  const [occurrenceNotSupportedDetails, setOccurrenceNotSupportedDetails] = useState('')

  useEffect(() => {
    const fetchOccurrence = async() => {
      const dwca = await getOccurrence({
        datasetId: location.state.datasetId,
        dwcaId:    location.state.dwcaId,
        userRef
      })
      const datasets = await getDatasets()

      try {
        const dataset = datasets.find(d => d.id === dwca.dataset)
        const occurrence = mapDwcaToOccurrenceData(dwca)
        const locationData = mapDwcaToLocationData(dwca)
        const observationData = mapDwcaToObservationData(dwca)
        const measurements = mapDwcaToMeasurements(dwca)
        const darwinCoreFields = mapDwcsToDarwinCoreFields(dwca)
        setDataset(dataset)
        setOccurrenceData(occurrence)
        setLocationData(locationData)
        setObservationData(observationData)
        setMeasurements(measurements)
        setDarwinCoreFields(darwinCoreFields)
        setAction(location.state.action === 'update' ? 'update' : 'create')
      } catch (exception) {
        setOccurrenceNotSupportedDetails({ dwca, exception })
        setOccurrenceSupported(false)
      }
    }
    if (location && location.state) fetchOccurrence()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    const response = action === 'update' && !!location.state.dwcaId
      ? await updateOccurrence({ occurrence, userRef, dwcaId: location.state.dwcaId })
      : await createOccurrence({ occurrence, userRef })
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
    setAction('create')
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
    nextStep:        t('occurrenceForm.occurrenceData.step.stepTitle'),
    selectedData:    datasetTitleOf(dataset),
    stepDescription: t('occurrenceForm.dataset.step.stepDescription'),
    stepTitle:       t('occurrenceForm.dataset.step.stepTitle'),

    onCopyPreviousDataClick: async() => {
      const dwca = await findLatestOccurrence({ userRef })
      const datasets = await getDatasets()
      const dataset = datasets.find(d => d.id === dwca.dataset)
      setDataset(dataset)
    },

    children: datasets && dataset && (
      <Dataset
        datasets={datasets}
        onChange={setDataset}
        selectedDataset={dataset}/>)
  }, {
    dataDescription: t('occurrenceForm.occurrenceData.step.dataDescription'),
    nextStep:        t('occurrenceForm.locationData.step.stepTitle'),
    selectedData:    <OccurrenceDataSummary {...occurrenceData}/>,
    stepDescription: t('occurrenceForm.occurrenceData.step.stepDescription'),
    stepTitle:       t('occurrenceForm.occurrenceData.step.stepTitle'),

    onCopyPreviousDataClick: async() => setOccurrenceData(mapDwcaToOccurrenceData(await findLatestOccurrence({ userRef }))),

    children:
      <OccurrenceData
        data={occurrenceData}
        onChange={setOccurrenceData}/>
  }, {
    dataDescription: t('occurrenceForm.locationData.step.dataDescription'),
    nextStep:        t('occurrenceForm.observationData.step.stepTitle'),
    selectedData:    <SelectedLocation {...locationData}/>,
    stepDescription: t('occurrenceForm.locationData.step.stepDescription'),
    stepTitle:       t('occurrenceForm.locationData.step.stepTitle'),

    onCopyPreviousDataClick: async() => setLocationData(mapDwcaToLocationData(await findLatestOccurrence({ userRef }))),

    children:
      <LocationData
        data={locationData}
        onChange={setLocationData}/>
  }, {
    dataDescription: t('occurrenceForm.observationData.step.dataDescription'),
    nextStep:        t('occurrenceForm.measurementOrFact.step.stepTitle'),
    selectedData:    renderIdentifiedByLabel(observationData),
    stepDescription: t('occurrenceForm.observationData.step.stepDescription'),
    stepTitle:       t('occurrenceForm.observationData.step.stepTitle'),

    onCopyPreviousDataClick: async() => setObservationData(mapDwcaToObservationData(await findLatestOccurrence({ userRef }))),

    children:
      <ObservationData
        observationData={observationData}
        onChange={setObservationData}/>
  }, {
    dataDescription: t('occurrenceForm.measurementOrFact.step.dataDescription'),
    nextStep:        t('occurrenceForm.darwinCoreFields.step.stepTitle'),
    selectedData:    <MeasurementOrFactSummary data={measurements}/>,
    stepDescription: t('occurrenceForm.measurementOrFact.step.stepDescription'),
    stepTitle:       t('occurrenceForm.measurementOrFact.step.stepTitle'),

    onCopyPreviousDataClick: async() => setMeasurements(mapDwcaToMeasurements(await findLatestOccurrence({ userRef }))),

    children:
      <MeasurementOrFact
        data={measurements}
        onChange={setMeasurements}/>
  }, {
    dataDescription: '',
    selectedData:    '',
    stepDescription: t('occurrenceForm.darwinCoreFields.step.stepDescription'),
    stepTitle:       t('occurrenceForm.darwinCoreFields.step.stepTitle'),

    onCopyPreviousDataClick: async() => setDarwinCoreFields(mapDwcsToDarwinCoreFields(await findLatestOccurrence({ userRef }))),

    children:
      <DarwinCoreFields
        fields={darwinCoreFields}
        onChange={setDarwinCoreFields}/>
  }]

  if (!occurrenceSupported) return <OccurrenceNotSupported {...occurrenceNotSupportedDetails}/>
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
            activeStepIndex={activeStepIndex}
            className={className}
            key={step.stepTitle}
            nextStep={step.nextStep}
            onContinueButtonClick={() => showActiveStep(activeStepIndex + 1)}
            onStepTitleClick={() => showActiveStep(index)}
            stepTitle={stepNumber + ' - ' + step.stepTitle}
            totalSteps={steps.length - 1}/>
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
          successMessageType={action}
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

OccurrenceForm.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      action:    PropTypes.oneOf(['create', 'update']),
      datasetId: PropTypes.string.isRequired,
      dwcaId:    PropTypes.string.isRequired
    })
  })
}

function SelectedLocation({ decimalLatitude, decimalLongitude }) {
  const { t } = useTranslation()

  return (
    <>
      <span>{t('occurrenceForm.locationData.step.selectedData.latitude')}: {decimalLatitude}</span>
      <span>{t('occurrenceForm.locationData.step.selectedData.longitude')}: {decimalLongitude}</span>
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

  return <span>{t('occurrenceForm.measurementOrFact.step.title', { number: data.length })}</span>
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
    <span>{occurrenceDataLabel}</span>
  )
}

OccurrenceDataSummary.propTypes = {
  beginDate:      PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  endDate:        PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  scientificName: PropTypes.string
}

function createInitialState(claims) {
  return {
    dataset:          null,
    occurrenceData:   {
      basisOfRecord:    'humanObservation',
      lifeStage:        'unspecified',
      occurrenceStatus: 'present',
      scientificName:   '',
      scientificNameId: '',
      sex:              'unspecified',
      identificationQualifier: '',
      identificationRemarks: claims && claims.name ? 'Record entered by ' + claims.name + '.' : ''
    },
    locationData:     {
      beginDate:        Date.now(),
      endDate:          null,
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
      references:              []
    },
    measurements:     [],
    darwinCoreFields: []
  }
}
