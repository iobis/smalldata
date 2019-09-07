import ActiveStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/ActiveStepHeader'
import BasicInformation from './BasicInformation'
import ConfirmedStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/ConfirmedStepHeader'
import FinalSummary from './FinalSummary/FinalSummary'
import Keywords from './Keywords'
import MetadataProviders from './MetadataProviders'
import NotConfirmedStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/NotConfirmedStepHeader'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import ResourceContacts from './ResourceContacts'
import ResourceCreators from './ResourceCreators'
import { createDataset, getDatasets, updateDataset } from '@smalldata/dwca-lib/src/clients/SmalldataClient'
import { languages } from '@smalldata/dwca-lib/src/clients/languages'
import { findLicenceByTitle, licences } from '@smalldata/dwca-lib/src/clients/licences'
import { useTranslation } from 'react-i18next'
import { getProperty } from '@smalldata/dwca-lib/src/common/objects'
import {
  mapDatasetResponseToBasicInformation,
  mapDatasetResponseToKeywords,
  mapDatasetResponseToMetadataProviders,
  mapDatasetResponseToResourceContacts,
  mapDatasetResponseToResourceCreators
} from '@smalldata/dwca-lib/src/clients/SmalldataConverters'

export default function DatasetFormPage({ location }) {
  const initialState = createInitialState(location)
  const { t } = useTranslation()
  const [action, setAction] = useState(initialState.action)
  const [successVisible, setSuccessVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [basicInformation, setBasicInformation] = useState(initialState.basicInformation)
  const [resourceContacts, setResourceContacts] = useState(initialState.resourceContacts)
  const [resourceCreators, setResourceCreators] = useState(initialState.resourceCreators)
  const [metadataProviders, setMetadataProviders] = useState(initialState.metadataProviders)
  const [keywords, setKeywords] = useState(initialState.keywords)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [finalSummaryVisible, setFinalSummaryVisible] = useState(false)

  useEffect(() => {
    async function fetchDataset() {
      const datasets = await getDatasets()
      const dataset = datasets.find(d => d.id === location.state.id)
      setBasicInformation(mapDatasetResponseToBasicInformation(dataset))
      setResourceContacts(mapDatasetResponseToResourceContacts(dataset))
      setResourceCreators(mapDatasetResponseToResourceCreators(dataset))
      setMetadataProviders(mapDatasetResponseToMetadataProviders(dataset))
      setKeywords(mapDatasetResponseToKeywords(dataset))
      setAction(location.state.action === 'update' ? 'update' : 'create')
    }

    if (getProperty(() => location.state.id, false)) fetchDataset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function showActiveStep(stepIndex) {
    setActiveStepIndex(stepIndex)
    setFinalSummaryVisible(false)
  }

  function showFinalSummary() {
    setActiveStepIndex(null)
    setFinalSummaryVisible(true)
  }

  function handleErrorClose() {
    setErrorVisible(false)
    setErrorMessage('')
  }

  async function handleSubmitClick() {
    const dataset = {
      basicInformation: {
        ...basicInformation,
        licence: findLicenceByTitle(basicInformation.licence)
      },
      resourceContacts,
      resourceCreators,
      metadataProviders,
      keywords
    }
    const response = action === 'update'
      ? await updateDataset(dataset, location.state.id)
      : await createDataset(dataset)
    if (response.exception) {
      setErrorVisible(true)
      setErrorMessage(response.exception + ': ' + response.exceptionMessage)
    } else {
      setSuccessVisible(true)
    }
  }

  function handleCreateClick() {
    resetUiState()
    resetDatasetState()
    setAction('create')
  }

  function resetUiState() {
    setActiveStepIndex(0)
    setFinalSummaryVisible(false)
    setSuccessVisible(false)
  }

  function resetDatasetState() {
    const initialState = createInitialState()
    setBasicInformation(initialState.basicInformation)
    setResourceContacts(initialState.resourceContacts)
    setResourceCreators(initialState.resourceCreators)
    setMetadataProviders(initialState.metadataProviders)
    setKeywords(initialState.keywords)
  }

  const steps = [{
    dataDescription: t('datasetFormPage.basicInformation.step.dataDescription'),
    nextStep:        t('datasetFormPage.resourceContacts.step.stepTitle'),
    selectedData:    basicInformation.title,
    stepDescription: t('datasetFormPage.basicInformation.step.stepDescription'),
    stepTitle:       t('datasetFormPage.basicInformation.step.stepTitle'),

    children:
      <BasicInformation
        data={basicInformation}
        languages={languages.map(language => language.title)}
        licences={licences.map(licence => licence.title)}
        onChange={setBasicInformation}/>
  }, {
    dataDescription: t('datasetFormPage.resourceContacts.step.dataDescription'),
    nextStep:        t('datasetFormPage.resourceCreators.step.stepTitle'),
    selectedData:    t('datasetFormPage.resourceContacts.step.selectedData', { nrOfContacts: resourceContacts.length }),
    stepDescription: t('datasetFormPage.resourceContacts.step.stepDescription'),
    stepTitle:       t('datasetFormPage.resourceContacts.step.stepTitle'),

    children:
      <ResourceContacts
        data={resourceContacts}
        onChange={setResourceContacts}/>
  }, {
    dataDescription: t('datasetFormPage.resourceCreators.step.dataDescription'),
    nextStep:        t('datasetFormPage.metadataProviders.step.stepTitle'),
    selectedData:    t('datasetFormPage.resourceCreators.step.selectedData', { nrOfContacts: resourceCreators.length }),
    stepDescription: t('datasetFormPage.resourceCreators.step.stepDescription'),
    stepTitle:       t('datasetFormPage.resourceCreators.step.stepTitle'),

    children:
      <ResourceCreators
        data={resourceCreators}
        onChange={setResourceCreators}/>
  }, {
    dataDescription: t('datasetFormPage.metadataProviders.step.dataDescription'),
    nextStep:        t('datasetFormPage.keywords.step.stepTitle'),
    selectedData:    t('datasetFormPage.metadataProviders.step.selectedData', { nrOfContacts: metadataProviders.length }),
    stepDescription: t('datasetFormPage.metadataProviders.step.stepDescription'),
    stepTitle:       t('datasetFormPage.metadataProviders.step.stepTitle'),

    children:
      <MetadataProviders
        data={metadataProviders}
        onChange={setMetadataProviders}/>
  }, {
    dataDescription: t('datasetFormPage.keywords.step.dataDescription'),
    selectedData:    '',
    stepDescription: t('datasetFormPage.keywords.step.stepDescription'),
    stepTitle:       t('datasetFormPage.keywords.step.stepTitle'),

    children:
      <Keywords
        keywords={keywords}
        onChange={setKeywords}/>
  }]

  return (
    <>
      {basicInformation.title.length > 0 ? (
        <h1>Edit dataset</h1>
      ) : (
        <h1>Create new dataset</h1>
      )}

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
            basicInformation={basicInformation}
            errorMessage={errorMessage}
            errorVisible={errorVisible}
            keywords={keywords}
            metadataProviders={metadataProviders}
            onChangeClick={(params) => showActiveStep(params.index)}
            onCreateClick={handleCreateClick}
            onErrorClose={handleErrorClose}
            onSubmitClick={handleSubmitClick}
            resourceContacts={resourceContacts}
            resourceCreators={resourceCreators}
            successMessageType={action}
            successVisible={successVisible}/>) :
          (<div className="columns column is-centered">
            <button
              className="review-and-submit-button button is-medium is-info"
              onClick={showFinalSummary}>
              {t('datasetFormPage.reviewAndSubmitButton')}
            </button>
          </div>)}
      </section>
    </>
  )
}

DatasetFormPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      action: PropTypes.oneOf(['create', 'update']),
      id:     PropTypes.string.isRequired
    })
  })
}

function createInitialState(location) {
  return {
    action:            getProperty(() => location.state.action, 'create'),
    basicInformation:  {
      title:    '',
      licence:  licences[0].title,
      language: languages[0].title,
      abstract: ''
    },
    resourceContacts:  [],
    resourceCreators:  [],
    metadataProviders: [],
    keywords:          []
  }
}