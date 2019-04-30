import React from 'react'
import LocationData from './LocationData'
import { mount } from 'enzyme'

describe('SelectDataset', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })
})

function createComponent() {
  const data = {
    decimalLongitude:      '',
    decimalLatitude:       '',
    coordinateUncertainty: '',
    minimumDepth:          '',
    maximumDepth:          ''
  }
  const defaultProps = { data, onChange: () => {} }
  return <LocationData {...defaultProps}/>
}
