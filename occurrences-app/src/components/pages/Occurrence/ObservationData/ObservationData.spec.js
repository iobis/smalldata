import React from 'react'
import renderer from 'react-test-renderer'
import ObservationData from './ObservationData'

describe('ObservationData', () => {
  it('renders correctly', () => {
    expect(renderer.create(createComponent()).toJSON()).toMatchSnapshot()
  })
})

function createComponent() {
  const observationData = {
    institutionCode:         '',
    collectionCode:          '',
    fieldNumber:             '',
    catalogNumber:           '',
    recordNumber:            '',
    identifiedBy:            ['name 1', 'name 2'],
    recordedBy:              ['name 1', 'name 2', 'name 3'],
    identificationQualifier: '',
    identificationRemarks:   '',
    references:              ['https://google.com', 'https://gmail.com']
  }
  return (
    <ObservationData observationData={observationData} onChange={jest.fn()}/>
  )
}
