import ActiveStepHeader from './ActiveStepHeader'
import ConfirmedStepHeader from './ConfirmedStepHeader'
import React, { useState } from 'react'
import NotConfirmedStepHeader from './NotConfirmedStepHeader'

export default function OccurrenceForm() {
  const [activeStepIndex, setActiveStepIndex] = useState(2)
  const steps = [{
    dataDescription: 'Using Data',
    selectedData:    'HAB Region 2: Occurrences of harmful (toxic) algal taxa within an area of interest to El Salvador compiled as part of a literature search project.',
    stepDescription: 'Choose the dataset for adding observations',
    stepTitle:       'Basic Data',
    children:        <StubFormContent/>
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
    <div className="container">
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
    </div>
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
