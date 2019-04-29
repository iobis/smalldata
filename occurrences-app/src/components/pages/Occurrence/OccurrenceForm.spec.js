import OccurrenceForm from './OccurrenceForm'
import React from 'react'
import { mount } from 'enzyme/build'

describe('OccurrenceForm', () => {
  it('renders correctly', () => {
    const wrapper = mount(<OccurrenceForm/>)
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.step-3 .step-header').simulate('click')
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.institution-code input').simulate('change', { target: { value: 'institution code' } })
    wrapper.find('.step-4 .step-header').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })
})
