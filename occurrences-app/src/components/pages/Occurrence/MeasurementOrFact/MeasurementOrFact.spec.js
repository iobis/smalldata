import MeasurementOrFact from './MeasurementOrFact'
import React from 'react'
import { getEmptyData } from './MeasurementOrFact.fixture'
import { mount } from 'enzyme'

describe('MeasurementOrFact', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })
})

function createComponent(props) {
  const defaultProps = {
    data:     getEmptyData(),
    onChange: jest.fn()
  }
  return <MeasurementOrFact {...defaultProps} {...props}/>
}
