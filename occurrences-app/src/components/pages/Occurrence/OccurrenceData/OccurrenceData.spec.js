import React from 'react'
import { mount } from 'enzyme'
import OccurrenceData from './OccurrenceData'

describe('OccurrenceData', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })
})

function createComponent() {
  return (
    <OccurrenceData
      data={{
        basisOfRecord:    'humanObservation',
        lifeStage:        'larva',
        occurrenceStatus: 'absent',
        scientificName:   'scientific name',
        scientificNameId: 'scientific:name:id',
        sex:              'male',
        identificationQualifier: 'identification qualifier',
        identificationRemarks: 'identification remarks'
      }}
      onChange={jest.fn()}/>
  )
}
