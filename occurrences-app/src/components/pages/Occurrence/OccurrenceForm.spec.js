import OccurrenceForm from './OccurrenceForm'
import React from 'react'
import { mount } from 'enzyme/build'

describe('OccurrenceForm', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(Date.UTC(2019, 3, 29)).valueOf())
  })

  afterAll(() => {
    jest.spyOn(Date, 'now').mockRestore()
  })

  it('renders correctly', () => {
    const wrapper = mount(<OccurrenceForm/>)
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.step-3 .step-header').simulate('click')
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.identified-by input').simulate('change', { target: { value: 'Indiana Jones' } })
    wrapper.find('.institution-code input').simulate('change', { target: { value: 'institution code' } })
    wrapper.find('.identified-by input').simulate('keydown', { key: 'Enter' })
    wrapper.find('.step-4 .step-header').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })
})