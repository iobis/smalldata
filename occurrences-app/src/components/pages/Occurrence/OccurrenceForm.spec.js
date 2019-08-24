import OccurrenceForm from './OccurrenceForm'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { getDatasetDefaultResponse } from '@smalldata/dwca-lib/src/clients/SmalldataClient.mock'
import { AuthProvider } from '@smalldata/dwca-lib'
import SmalldataClient from '@smalldata/dwca-lib/src/clients/SmalldataClient'

describe('OccurrenceForm', () => {
  let wrapper

  describe('when creating new occurrence', () => {
    beforeAll(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => new Date(Date.UTC(2019, 3, 29)).valueOf())
      global.fetch = jest.fn().mockImplementation(() =>
        new Promise((resolve) => {
          resolve({ json: () => getDatasetDefaultResponse() })
        })
      )
    })

    afterAll(() => {
      jest.spyOn(Date, 'now').mockRestore()
    })

    it('renders correctly', async() => {
      await act(async() => {
        wrapper = mount(
          <AuthProvider>
            <OccurrenceForm/>
          </AuthProvider>
        )
      })
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith('/api/datasets', {
        headers: {
          'Authorization': 'Basic verysecret',
          'Content-Type':  'application/json'
        }
      })
      expect(wrapper).toMatchSnapshot()

      addLocation(wrapper)
      wrapper.find('.step-4 .step-header').simulate('click')
      expect(wrapper).toMatchSnapshot()

      addObservationData(wrapper)
      wrapper.find('.step-5 .step-header').simulate('click')
      expect(wrapper).toMatchSnapshot()

      addMeasurement(wrapper, '10')
      wrapper.find('.step-6 .step-header').simulate('click')
      expect(wrapper).toMatchSnapshot()

      addMeasurement(wrapper, '20')
      wrapper.find('.step-6 .step-header').simulate('click')
      expect(wrapper).toMatchSnapshot()

      addMeasurement(wrapper, '20')
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
      expect(wrapper.find('.final-summary').exists()).toBe(true)
      expect(wrapper.find('.success-message').exists()).toBe(false)
      expect(wrapper.find('.error-message').exists()).toBe(false)
    })
  })
})

function addLocation(wrapper) {
  wrapper.find('.step-3 .step-header').simulate('click')
  wrapper.find('.decimal-latitude input').simulate('change', { target: { value: '0.12345' } })
  wrapper.find('.decimal-longitude input').simulate('change', { target: { value: '-0.54321' } })
}

function addObservationData(wrapper) {
  wrapper.find('.step-4 .step-header').simulate('click')
  wrapper.find('.identified-by input').simulate('change', { target: { value: 'Indiana Jones' } })
  wrapper.find('.institution-code input').simulate('change', { target: { value: 'institution code' } })
  wrapper.find('.identified-by input').simulate('keydown', { key: 'Enter' })
}

function addMeasurement(wrapper, value) {
  wrapper.find('.step-5 .step-header').simulate('click')
  wrapper.find('.general .measurement-row .input').at(0).simulate('change', { target: { value: value } })
  wrapper.find('.general .measurement-row .button.add').at(0).simulate('click')
}

function addDarwinCoreField(wrapper, name, value) {
  wrapper.find('.darwin-core-fields .field-name input').simulate('change', { target: { value: name } })
  wrapper.find('.darwin-core-fields .value input').simulate('change', { target: { value: value } })
  wrapper.find('.darwin-core-fields .add .button').simulate('click')
}

function removeDarwinCoreField(wrapper, index) {
  wrapper.find('.darwin-core-fields .remove').at(index).simulate('click')
}
