import React from 'react'
import renderer from 'react-test-renderer'
import OccurrenceData from './OccurrenceData'

describe('OccurrenceData', () => {
  it('renders correctly', () => {
    expect(renderer.create(createComponent()).toJSON()).toMatchSnapshot()
  })
})

function createComponent() {
  return (
    <OccurrenceData
      data={{
        basisOfRecord:    'humanObservation',
        beginDate:        new Date('2019-01-02T12:30:40'),
        endDate:          new Date('2020-01-02T12:30:40'),
        lifestage:        'egg',
        occurrenceStatus: 'absent',
        scientificName:   'scientific name',
        sex:              'male'
      }}
      onChange={jest.fn()}/>
  )
}
