import OccurrenceForm from './OccurrenceForm'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { DATASTES_RESPONSE } from '../../../clients/SmalldataClient.mock'

describe('OccurrenceForm', () => {
  const originalError = console.error
  let wrapper

  beforeAll(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) return
      originalError.call(console, ...args)
    }
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(Date.UTC(2019, 3, 29)).valueOf())
    global.fetch = jest.fn().mockImplementation(() =>
      new Promise((resolve) => {
        resolve({ json: () => DATASTES_RESPONSE })
      })
    )
  })

  afterAll(() => {
    console.error = originalError
    jest.spyOn(Date, 'now').mockRestore()
  })

  it('renders correctly', () => {
    act(() => {
      wrapper = mount(<OccurrenceForm/>)
    })
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('/api/datasets')
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.step-3 .step-header').simulate('click')
    wrapper.find('.decimal-latitude input').simulate('change', { target: { value: '0.12345' } })
    wrapper.find('.decimal-longitude input').simulate('change', { target: { value: '-0.54321' } })
    wrapper.find('.step-4 .step-header').simulate('click')
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.identified-by input').simulate('change', { target: { value: 'Indiana Jones' } })
    wrapper.find('.institution-code input').simulate('change', { target: { value: 'institution code' } })
    wrapper.find('.identified-by input').simulate('keydown', { key: 'Enter' })
    wrapper.find('.step-5 .step-header').simulate('click')
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.general .measurement-row .input').at(0).simulate('change', { target: { value: '10' } })
    wrapper.find('.general .measurement-row .button.add').at(0).simulate('click')
    wrapper.find('.step-6 .step-header').simulate('click')
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.step-5 .step-header').simulate('click')
    wrapper.find('.general .measurement-row .input').at(0).simulate('change', { target: { value: '20' } })
    wrapper.find('.general .measurement-row .button.add').at(0).simulate('click')
    wrapper.find('.step-6 .step-header').simulate('click')
    expect(wrapper).toMatchSnapshot()

    wrapper.find('.step-5 .step-header').simulate('click')
    wrapper.find('.general .measurement-row .input').at(0).simulate('change', { target: { value: '20' } })
    wrapper.find('.general .measurement-row .button.add').at(0).simulate('click')
    wrapper.find('.step-6 .step-header').simulate('click')
    expect(wrapper).toMatchSnapshot()

    expect(wrapper.find('.fieldrow')).toHaveLength(0)
    addDarwinCoreField(wrapper, 'name-1', 'value-1')
    expect(wrapper.find('.fieldrow')).toHaveLength(1)

    addDarwinCoreField(wrapper, 'name-2', 'value-2')
    expect(wrapper.find('.fieldrow')).toHaveLength(2)

    addDarwinCoreField(wrapper, 'name-3', 'value-3')
    expect(wrapper.find('.fieldrow')).toHaveLength(3)

    removeDarwinCoreField(wrapper, 1)
    expect(wrapper.find('.fieldrow')).toHaveLength(2)

    wrapper.find('.review-and-submit-button').simulate('click')
    expect(wrapper).toMatchSnapshot()
  })

  function addDarwinCoreField(wrapper, name, value) {
    wrapper.find('.darwin-core-fields .field-name input').simulate('change', { target: { value: name } })
    wrapper.find('.darwin-core-fields .value input').simulate('change', { target: { value: value } })
    wrapper.find('.darwin-core-fields .add .button').simulate('click')
  }

  function removeDarwinCoreField(wrapper, index) {
    wrapper.find('.darwin-core-fields .remove').at(index).simulate('click')
  }
})
