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
        beginDate:        new Date('2019-01-02T12:30:40+00:00'),
        endDate:          new Date('2020-01-02T12:30:40+00:00'),
        lifestage:        'larva',
        occurrenceStatus: 'absent',
        scientificName:   'scientific name',
        sex:              'male'
      }}
      onChange={jest.fn()}/>
  )
}
