import ActiveStepHeader from './ActiveStepHeader'
import ConfirmedStepHeader from './ConfirmedStepHeader'
import NotConfirmedStepHeader from './NotConfirmedStepHeader'
import React, { useState } from 'react'
import SelectedDataset from './SelectedDataset/SelectedDataset'

export default function OccurrenceForm() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  const datasets = [{
    id:          0,
    description: 'HAB Region 2: Occurrences of harmful (toxic) algal taxa within an area of interest to El Salvador compiled as part of a literature search project.'
  }, {
    id:          1,
    description: 'NPPSD Short-tailed Albatross Sightings'
  }, {
    id:          2,
    description: 'PANGAEA - Data from Christian-Albrechts-University Kiel'
  }, {
    id:          3,
    description: 'NSIS: List of marine benthic algae from Magdalen Islands, Quebec as recorded in 1979'
  }, {
    id:          4,
    description: 'Seguimiento de 10 crías de tortuga boba nacidas en 2016 en el litoral valenciano, en el marco del Proyecto LIFE 15 IPE ES 012 (aggregated per 1-degree cell)'
  }, {
    id:          5,
    description: 'Waved Albatross Tracking (aggregated per 1-degree cell)'
  }]
  const [selectedDatasetId, setSelectedDatasetId] = useState(datasets[0].id)
  const selectedDataset = datasets.find(dataset => dataset.id === selectedDatasetId)

  const steps = [{
    dataDescription: 'Using Data',
    selectedData:    selectedDataset.description,
    stepDescription: 'Choose the dataset for adding observations',
    stepTitle:       'Selected Dataset',
    children:        <SelectedDataset
                       datasets={datasets}
                       selectedDatasetId={selectedDatasetId}
                       onChange={(id) => setSelectedDatasetId(id)}/>
  }, {
    dataDescription: 'Given Values',
    selectedData:    'Abra alba 2019-02-02',
    stepDescription: 'Mandatory observation information',
    stepTitle:       'Basic Data',
    children:        <StubFormContent/>
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
