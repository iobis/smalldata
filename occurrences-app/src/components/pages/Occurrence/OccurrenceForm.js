import ActiveStepHeader from './ActiveStepHeader'
import ConfirmedStepHeader from './ConfirmedStepHeader'
import React, { useState } from 'react'
import NotConfirmedStepHeader from './NotConfirmedStepHeader'

export default function OccurrenceForm() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const steps = [{
    dataDescription: 'Using Data',
    selectedData:    'HAB Region 2: Occurrences of harmful (toxic) algal taxa within an area of interest to El Salvador compiled as part of a literature search project.',
    stepDescription: 'Choose the dataset for adding observations',
    stepTitle:       '1 - Basic Data',
    children:        <StubFormContent/>
  }, {
    dataDescription: 'Given Values',
    selectedData:    'Abra alba 2019-02-02',
    stepDescription: 'Mandatory observation information',
    stepTitle:       '2 - Basic Data',
    children:        <StubFormContent/>
  }, {
    className:       'has-background-black',
    dataDescription: 'Main Location',
    selectedData:    'North Sea',
    stepDescription: 'Select the location for data collected',
    stepTitle:       '3 - Location Data',
    children:        <StubFormContent/>
  }, {
    className:       'has-background-link',
    dataDescription: 'Main Info',
    selectedData:    'Institution: CA Identified by: Jane Doe, John Doe, Indiana Jones',
    stepDescription: 'Enter further specifics',
    stepTitle:       '4 - Observation Data',
    children:        <StubFormContent/>
  }, {
    className:       'has-background-info',
    dataDescription: 'DWCA INFO',
    selectedData:    'You have submitted 7 extra fields',
    stepDescription: 'Enter further specifics',
    stepTitle:       '5 - Generic Data',
    children:        <StubFormContent/>
  }]

  return (
    <>
      {steps.map((step, index) => {
        const StepComponent = activeStepIndex === index
          ? ActiveStepHeader
          : activeStepIndex > index
            ? ConfirmedStepHeader
            : NotConfirmedStepHeader
        return <StepComponent onStepTitleClick={() => setActiveStepIndex(index)} key={step.stepTitle} {...step}/>
      })}
    </>
  )
}

function StubFormContent() {
  return (
    <div className="step-header container is-fluid">
      <div className="columns">
        <div className="column">
          Form Content To Be Added
        </div>
      </div>
    </div>
  )
}
