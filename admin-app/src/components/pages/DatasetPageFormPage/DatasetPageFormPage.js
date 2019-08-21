import React, { useState } from 'react'
import ActiveStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/ActiveStepHeader'
import NotConfirmedStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/NotConfirmedStepHeader'
import BasicInformation, { languages, licences } from './BasicInformation'
import ResourceContacts from './ResourceContacts'
import Keywords from './Keywords'
import ResourceCreators from './ResourceCreators'
import MetadataProviders from './MetadataProviders'
import ConfirmedStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/ConfirmedStepHeader'
import { useTranslation } from 'react-i18next'

export default function DatasetPageFormPage() {
  const initialState = createInitialState()
  const { t } = useTranslation()
  const [basicInformation, setBasicInformation] = useState(initialState.basicInformation)
  const [resourceContacts, setResourceContacts] = useState(initialState.resourceContacts)
  const [resourceCreators, setResourceCreators] = useState(initialState.resourceCreators)
  const [metadataProviders, setMetadataProviders] = useState(initialState.metadataProviders)
  const [keywords, setKeywords] = useState(initialState.keywords)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [finalSummaryVisible, setFinalSummaryVisible] = useState(false)

  function showActiveStep(stepIndex) {
    setActiveStepIndex(stepIndex)
    setFinalSummaryVisible(false)
  }

  function isValid() {
    return false
  }

  function showFinalSummary() {
    setActiveStepIndex(null)
    setFinalSummaryVisible(true)
  }

  const steps = [{
    dataDescription: t('datasetPageFormPage.basicInformation.step.dataDescription'),
    nextStep:        t('datasetPageFormPage.resourceContacts.step.stepTitle'),
    selectedData:    basicInformation.title,
    stepDescription: t('datasetPageFormPage.basicInformation.step.stepDescription'),
    stepTitle:       t('datasetPageFormPage.basicInformation.step.stepTitle'),

    children:
      <BasicInformation
        data={basicInformation}
        onChange={setBasicInformation}/>
  }, {
    dataDescription: t('datasetPageFormPage.resourceContacts.step.dataDescription'),
    nextStep:        t('datasetPageFormPage.resourceCreators.step.stepTitle'),
    selectedData:    t('datasetPageFormPage.resourceContacts.step.selectedData', { nrOfContacts: resourceContacts.length }),
    stepDescription: t('datasetPageFormPage.resourceContacts.step.stepDescription'),
    stepTitle:       t('datasetPageFormPage.resourceContacts.step.stepTitle'),

    children:
      <ResourceContacts
        data={resourceContacts}
        onChange={setResourceContacts}/>
  }, {
    dataDescription: t('datasetPageFormPage.resourceCreators.step.dataDescription'),
    nextStep:        t('datasetPageFormPage.metadataProviders.step.stepTitle'),
    selectedData:    t('datasetPageFormPage.resourceCreators.step.selectedData', { nrOfContacts: resourceCreators.length }),
    stepDescription: t('datasetPageFormPage.resourceCreators.step.stepDescription'),
    stepTitle:       t('datasetPageFormPage.resourceCreators.step.stepTitle'),

    children:
      <ResourceCreators
        data={resourceCreators}
        onChange={setResourceCreators}/>
  }, {
    dataDescription: t('datasetPageFormPage.metadataProviders.step.dataDescription'),
    nextStep:        t('datasetPageFormPage.keywords.step.stepTitle'),
    selectedData:    t('datasetPageFormPage.metadataProviders.step.selectedData', { nrOfContacts: metadataProviders.length }),
    stepDescription: t('datasetPageFormPage.metadataProviders.step.stepDescription'),
    stepTitle:       t('datasetPageFormPage.metadataProviders.step.stepTitle'),

    children:
      <MetadataProviders
        data={metadataProviders}
        onChange={setMetadataProviders}/>
  }, {
    dataDescription: t('datasetPageFormPage.keywords.step.dataDescription'),
    selectedData:    '',
    stepDescription: t('datasetPageFormPage.keywords.step.stepDescription'),
    stepTitle:       t('datasetPageFormPage.keywords.step.stepTitle'),

    children:
      <Keywords
        keywords={keywords}
        onChange={setKeywords}/>
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
        (<div>FINAL SUMMARY</div>) :
        (<div className="columns column is-centered">
          <button
            className="review-and-submit-button button is-medium is-info"
            disabled={isValid()}
            onClick={showFinalSummary}>
            {t('datasetPageFormPage.reviewAndSubmitButton')}
          </button>
        </div>)}
    </section>
  )
}

function createInitialState() {
  return {
    basicInformation:  {
      title:                  '',
      publishingOrganisation: '',
      licence:                licences[0],
      language:               languages[0],
      abstract:               ''
    },
    resourceContacts:  [],
    resourceCreators:  [],
    metadataProviders: [],
    keywords:          []
  }
}
