import React from 'react'
import renderer from 'react-test-renderer'
import BasicData from './BasicData'

describe('SelectDataset', () => {
  it('renders correctly', () => {
    expect(renderer.create(createComponent()).toJSON()).toMatchSnapshot()
  })
})

function createComponent() {
  return (
    <BasicData
      basicData={{
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
