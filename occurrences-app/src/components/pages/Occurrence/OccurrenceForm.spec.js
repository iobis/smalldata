import OccurrenceForm from './OccurrenceForm'
import React from 'react'
import { mount } from 'enzyme/build'

describe('OccurrenceForm', () => {
  it('renders correctly', () => {
    const wrapper = mount(<OccurrenceForm/>)
    expect(wrapper).toMatchSnapshot()
  })
})
