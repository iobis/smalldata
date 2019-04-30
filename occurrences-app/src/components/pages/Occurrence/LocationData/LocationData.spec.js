import LocationData from './LocationData'
import React from 'react'
import { getEmptyData } from './LocationData.fixture'
import { mount } from 'enzyme'

describe('SelectDataset', () => {
  it('renders correctly', () => {
    expect(mount(createComponent())).toMatchSnapshot()
  })
})

function createComponent() {
  const defaultProps = { data: getEmptyData(), onChange: () => {} }
  return <LocationData {...defaultProps}/>
}
