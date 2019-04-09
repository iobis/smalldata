import ActiveStepHeader from './ActiveStepHeader'
import BasicData from './BasicData/BasicData'
import ConfirmedStepHeader from './ConfirmedStepHeader'
import NotConfirmedStepHeader from './NotConfirmedStepHeader'
import React, { useState } from 'react'
import SelectDataset from './SelectDataset/SelectDataset'
import { getDatasetMock } from '../../../clients/server'
import { useTranslation } from 'react-i18next'

export default function OccurrenceForm() {
  const datasets = getDatasetMock()
  const { t } = useTranslation()
  const [selectedDataset, setSelectedDataset] = useState(datasets[0])
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  const steps = [{
    dataDescription: t('occurrenceForm.selectDataset.dataDescription'),
    selectedData:    selectedDataset.description,
    stepDescription: t('occurrenceForm.selectDataset.stepDescription'),
    stepTitle:       t('occurrenceForm.selectDataset.stepTitle'),
    children:        <SelectDataset
                       datasets={datasets}
                       selectedDataset={selectedDataset}
                       onChange={(dataset) => setSelectedDataset(dataset)}/>
  }, {
    dataDescription: 'Given Values',
    selectedData:    'Abra alba 2019-02-02',
    stepDescription: 'Mandatory observation information',
    stepTitle:       'Basic Data',
    children:        <BasicData/>
  }, {
    dataDescription: 'Main Location',
    selectedData:    'North Sea',
    stepDescription: 'Select the location for data collected',
    stepTitle:       'Location Data',
    children:        <StubFormContent/>
  }, {
    dataDescription: 'Main Info',
    selectedData:    'Institution: CA Identified by: Jane Doe, John Doe, Indiana Jones',
    stepDescription: 'Enter further specifics',
    stepTitle:       'Observation Data',
    children:        <StubFormContent/>
  }, {
    dataDescription: 'DWCA INFO',
    selectedData:    'You have submitted 7 extra fields',
    stepDescription: 'Enter further specifics',
    stepTitle:       'Generic Data',
    children:        <StubFormContent/>
  }]

  return (
    <section className="section">
      {steps.map((step, index) => {
        const className = 'step-' + index
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
            stepTitle={(index + 1) + ' - ' + step.stepTitle}/>
        )
      })}
    </section>
  )
}

function StubFormContent() {
  return (
    <div className="is-fluid">
      <div className="columns">
        <div className="column">
          Form Content To Be Added
        </div>
      </div>
    </div>
  )
}
