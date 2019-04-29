import ActiveStepHeader from './ActiveStepHeader'
import BasicData from './BasicData/BasicData'
import ConfirmedStepHeader from './ConfirmedStepHeader'
import NotConfirmedStepHeader from './NotConfirmedStepHeader'
import ObservationData from './ObservationData/ObservationData'
import React, { useState } from 'react'
import SelectDataset from './SelectDataset/SelectDataset'
import { format } from 'date-fns'
import { getDatasetMock } from '../../../clients/server'
import { useTranslation } from 'react-i18next'

export default function OccurrenceForm() {
  const datasets = getDatasetMock()
  const { t } = useTranslation()
  const [selectedDataset, setSelectedDataset] = useState(datasets[0])
  const [basicData, setBasicData] = useState({
    basisOfRecord:    null,
    beginDate:        new Date(),
    endDate:          null,
    lifestage:        null,
    occurrenceStatus: null,
    scientificName:   '',
    sex:              null
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
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const basicDataLabel = [
    basicData.scientificName,
    format(basicData.beginDate, 'D MMMM YYYY'),
    basicData.endDate ? ' - ' + format(basicData.endDate, 'D MMMM YYYY') : ''
  ].join(' ')

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
    selectedData:    basicDataLabel,
    stepDescription: 'Mandatory observation information',
    stepTitle:       'Basic Data',
    children:        <BasicData
                       onChange={(basicData) => setBasicData(basicData)}
                       basicData={basicData}/>
  }, {
    dataDescription: 'Main Location',
    selectedData:    'North Sea',
    stepDescription: 'Select the location for data collected',
    stepTitle:       'Location Data',
    children:        <StubFormContent/>
  }, {
    dataDescription: 'Main Info',
    selectedData:    renderIdentifiedByLabel(observationData),
    stepDescription: 'Enter further specifics',
    stepTitle:       'Observation Data',
    children:        <ObservationData
                       observationData={observationData}
                       onChange={data => setObservationData(data)}/>
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

function renderIdentifiedByLabel({ identifiedBy, institutionCode }) {
  const institutionCodeLabel = institutionCode ? `Institution: ${institutionCode}` : ''
  const identifiedByLabel = identifiedBy.length > 0 ? 'Identified by: ' + identifiedBy.join(',') : ''
  return [institutionCodeLabel, identifiedByLabel].filter(label => !!label).join(',')
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
