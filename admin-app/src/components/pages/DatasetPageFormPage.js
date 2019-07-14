import React, { useState } from 'react'
import ActiveStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/ActiveStepHeader'
import NotConfirmedStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/NotConfirmedStepHeader'
import ConfirmedStepHeader from '@smalldata/dwca-lib/src/components/StepHeaders/ConfirmedStepHeader'
import { useTranslation } from 'react-i18next'

export default function DatasetPageFormPage() {
  const { t } = useTranslation()
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
    selectedData:    'to be added',
    stepDescription: t('datasetPageFormPage.basicInformation.step.stepDescription'),
    stepTitle:       t('datasetPageFormPage.basicInformation.step.stepTitle'),

    onCopyPreviousDataClick: () => {},

    children:
      <div>BASIC INFORMATION</div>
  }, {
    dataDescription: t('datasetPageFormPage.resourceContacts.step.dataDescription'),
    nextStep:        t('datasetPageFormPage.resourceCreators.step.stepTitle'),
    selectedData:    'to be added',
    stepDescription: t('datasetPageFormPage.resourceContacts.step.stepDescription'),
    stepTitle:       t('datasetPageFormPage.resourceContacts.step.stepTitle'),

    onCopyPreviousDataClick: () => {},

    children:
      <div>RESOURCE CONTACTS</div>
  }, {
    dataDescription: t('datasetPageFormPage.resourceCreators.step.dataDescription'),
    nextStep:        t('datasetPageFormPage.metadataProviders.step.stepTitle'),
    selectedData:    'to be added',
    stepDescription: t('datasetPageFormPage.resourceCreators.step.stepDescription'),
    stepTitle:       t('datasetPageFormPage.resourceCreators.step.stepTitle'),

    onCopyPreviousDataClick: () => {},

    children:
      <div>RESOURCE CREATOR</div>
  }, {
    dataDescription: t('datasetPageFormPage.metadataProviders.step.dataDescription'),
    nextStep:        t('datasetPageFormPage.keywords.step.stepTitle'),
    selectedData:    'to be added',
    stepDescription: t('datasetPageFormPage.metadataProviders.step.stepDescription'),
    stepTitle:       t('datasetPageFormPage.metadataProviders.step.stepTitle'),

    onCopyPreviousDataClick: () => {},

    children:
      <div>METADATA PROVIDERS</div>
  }, {
    dataDescription: t('datasetPageFormPage.keywords.step.dataDescription'),
    selectedData:    'to be added',
    stepDescription: t('datasetPageFormPage.keywords.step.stepDescription'),
    stepTitle:       t('datasetPageFormPage.keywords.step.stepTitle'),

    onCopyPreviousDataClick: () => {},

    children:
      <div>KEYWORDS</div>
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
